# 07 - Arquitectura de VenceYa

**Fase BMAD:** solución, a cargo del agente Architect.
**Fecha:** 2026-11-09.
**País de operación:** Perú. **Zona horaria de negocio:** America/Lima.
**Fuentes:** `00-constitucion.md` (PRINCIPIO-001 a PRINCIPIO-012, enmiendas E-001 a E-013), `06-user-stories.md` (HU-001 a HU-012 y HU-017), `02-alcance.md`, `01-project-brief.md`, `03-reglas-de-negocio.md` y `otros/06-diseno-seguridad-datos.md`.
**Contratos REST:** [07-openapi.yaml](./07-openapi.yaml) (OpenAPI 3.1, fuente oficial).

**Alcance de este documento.** Cubre las 13 HUs aprobadas: 10 Must del MVP (HU-001 a HU-010) y 3 Should (HU-011, HU-012 y HU-017), que se entregan después del MVP. HU-017 fue aprobada por decisión del usuario del 2026-11-10 (M-06) como historial compartido entre S1 y S4. HU-013 a HU-016 siguen sugeridas, sin aprobación ni endpoints; HU-018 no se desarrolla (pregunta 52). La sección 6.3 indica dónde encajarán.

---

## 1. Overview del sistema

### 1.1 Descripción

VenceYa es una aplicación web multiempresa con la que las pymes peruanas controlan los vencimientos de sus cuentas por cobrar y por pagar, en soles y en dólares. Una SPA en React con shadcn/ui consume una API REST en NestJS. La API está organizada como un monolito modular y persiste en PostgreSQL. Todos los cálculos financieros (saldos, estados, atraso, proyección y tiempo promedio de cobro) viven en un núcleo de dominio de funciones puras, que reciben la fecha de cálculo como parámetro. Cada consulta queda acotada a la empresa del usuario autenticado, y cada acceso a datos personales deja un registro de interacción lógica sin datos personales (E-015). El único servicio externo es Resend, que envía por correo los avisos de vencimiento, las invitaciones y las recuperaciones de contraseña.

### 1.2 Diagrama de arquitectura

```text
                     ┌──────────────────────────────────────────────────────────┐
  Navegador          │  SPA VenceYa (React + shadcn/ui + TanStack Query)        │
  (móvil/tablet/PC)  │  WCAG 2.2 AA · formato peruano de importes · CSRF header │
                     └───────────────┬──────────────────────────────────────────┘
                                     │ HTTPS (TLS ≥ 1.2) · cookie de sesión HttpOnly
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  API pública NestJS  /api/v1                                                         │
│  ┌──────────────── Capa transversal (guards, pipes, interceptores) ───────────────┐  │
│  │ Sesión y CSRF · Rol (RN-060) · Contexto de empresa (PRINCIPIO-003) ·           │  │
│  │ Validación y normalización (RN-162) · Error único · Logs sin datos personales  │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
│  Módulos de aplicación:                                                              │
│  [Autenticación] [Usuarios] [Configuración empresa] [Contactos] [Comprobantes]       │
│  [Pagos y anulaciones] [Reprogramaciones*] [Panel] [Avisos]                          │
│        │                 │                    │                    │                 │
│        ▼                 ▼                    ▼                    ▼                 │
│  ┌───────────────┐ ┌─────────────────┐ ┌──────────────────┐ ┌───────────────────┐    │
│  │ Núcleo de     │ │ Servicio de     │ │ Auditoría,       │ │ Adaptador correo  │────┼──► Resend (us-east-1)
│  │ dominio puro  │ │ hash            │ │ historiales y    │ │ (idempotencia,    │    │    o buzón de prueba
│  │ (cálculos)    │ │ Argon2id ·      │ │ registros de     │ │ redirección test) │    │
│  └───────────────┘ │ SHA-256 tokens  │ │ acceso           │ └───────────────────┘    │
│                    └─────────────────┘ └──────────────────┘                          │
│                                                                                      │
│                                                                                      │
│                  Secretos en variables de entorno (Railway / servidor local)         │
└───────────────────────────────┬──────────────────────────────────────────────────────┘
                                │ TLS · rol de BD sin UPDATE/DELETE sobre pagos
┌───────────────────────────────┼────────────────────┐
│  API interna NestJS           │                    │   red privada, sin exposición pública
│  /api/v1/interno (HU-001)     │                    │   token de operaciones del equipo VenceYa
└───────────────────────────────┼────────────────────┘
                                ▼
                 ┌───────────────────────────────────────────────┐
                 │ PostgreSQL 16 (Neon us-east-1 o servidor local)│
                 │ RLS por empresa · índices únicos parciales ·   │
                 │ triggers de inmutabilidad                       │
                 └───────────────────────────────────────────────┘
  (*) Reprogramaciones (HU-011) es Should: se activa después del MVP.
```

**Modalidades de instalación (PRINCIPIO-002, E-007).** Ambas usan el mismo código y el mismo stack:

- **Nube:** SPA y API en Railway, región US East; PostgreSQL en Neon, región `us-east-1`. Los secretos y las claves quedan en las variables de entorno de Railway.
- **Local (on-premise):** SPA, API y PostgreSQL en el servidor de la empresa cliente. Las claves se custodian fuera de la base de datos y del repositorio. Su operación sigue pendiente (preguntas 41 y 42).

**Despliegue en la nube (M-07, decisión del usuario del 2026-11-10):** pruebas y producción usan bases, credenciales y secretos separados. Cada ambiente presenta un mismo origen HTTPS: SPA en `/` y API pública en `/api`, con enrutamiento hacia sus servicios en Railway; nunca se reenvía el prefijo interno. `apps/api-interna` carece de dominio y puerto público y solo acepta conexiones por la red privada (ADR-007). TLS 1.2 o superior y HSTS se verifican en SPA y API, y la conexión a Neon usa `sslmode=require`. Los nombres de dominio y DNS quedan en la pregunta 53; la 39 trata del correo. T-041 a T-043 cubren preparación, pruebas y producción; no resuelven la operación local pendiente.

### 1.3 Principios de diseño

1. **Empresa desde la sesión, nunca desde la petición.** Ningún endpoint de negocio recibe el `empresaId`. Lo toma de la sesión y lo aplica dos veces: en los repositorios y en la base de datos mediante RLS. Un recurso de otra empresa responde `404` (PRINCIPIO-003, RN-008).
2. **Dominio puro y determinista.** Los estados y saldos no se guardan: se derivan de los hechos registrados mediante funciones puras que reciben la fecha de cálculo (PRINCIPIO-007, RN-198).
3. **Hechos inmutables y correcciones como hechos nuevos.** Un pago nunca se modifica. Su anulación es un registro aparte, y la base de datos rechaza cualquier UPDATE o DELETE sobre un pago (PRINCIPIO-006).
4. **Sin cifrado por campo (E-015).** Correos, teléfono, dirección y RUC se guardan en claro, protegidos por aislamiento, control de acceso y trazabilidad de accesos. Las comparaciones exactas usan índices únicos sobre el valor normalizado (PRINCIPIO-004).
5. **Todo o nada.** Cada operación es una transacción. Las condiciones se evalúan con el estado vigente al guardar, y la concurrencia se resuelve con bloqueos de fila, versiones optimistas e índices únicos (RN-160).
6. **Idempotencia en el servidor.** El doble clic se evita en la interfaz, pero la garantía real la da el backend (RN-156 a RN-158).
7. **Privacidad por defecto en la observabilidad.** Los logs y los errores solo llevan eventos, identificadores internos y códigos (PRINCIPIO-005).
8. **Simplicidad proporcional al volumen.** El volumen previsto es de unas 80 operaciones al mes por empresa (supuesto S7). Por eso se descartan colas, microservicios y cachés distribuidas mientras no exista evidencia de que hagan falta.

---

## 2. Componentes principales

| # | Componente | Responsabilidad | Tecnología | HUs |
|---|---|---|---|---|
| C1 | **SPA web** | Pantallas de todas las HUs para los tres roles. Formato peruano de importes y fechas; leyenda «Datos al DD/MM/AAAA, HH:mm». Deshabilita los botones mientras una solicitud está en curso y genera la `Clave-Idempotencia` de cada pago. Muestra los gráficos junto con su tabla accesible equivalente. | React 18, TypeScript, Vite, shadcn/ui (Radix + Tailwind), TanStack Query, React Hook Form + Zod, Recharts (gráficos de shadcn) | HU-002 a HU-012, HU-017 |
| C2 | **Capa transversal de la API** | Valida la sesión y el CSRF, autoriza por rol según la matriz RN-060, fija el contexto de empresa (`SET LOCAL app.empresa_id`), normaliza y valida los campos (RN-162), traduce las excepciones al formato de error único, añade el `idSolicitud` y escribe logs estructurados sin datos personales. | NestJS 10 (guards, pipes, interceptors, exception filters), class-validator, pino | Todas |
| C3 | **Módulo Autenticación y sesiones** | Inicio y cierre de sesión, activación por invitación, recuperación de contraseña, bloqueo tras 5 fallos (RN-103), sesiones con 30 minutos de inactividad y 12 horas absolutas (RN-149), cierre de sesiones al cambiar el rol, desactivar al usuario o recuperar la contraseña. | NestJS, argon2 (Argon2id), tabla `sesiones` en PostgreSQL | HU-002 |
| C4 | **Módulo Operaciones internas** | Alta atómica de una empresa con su primer administrador y reenvío de la invitación de ese administrador. Se despliega como una aplicación NestJS aparte, publicada solo en la red privada. | NestJS (misma base de código, punto de entrada propio), token de operaciones | HU-001 |
| C5 | **Módulo Usuarios y configuración de empresa** | Invitación, cambio de rol, desactivación y reactivación de usuarios, con la protección del último administrador. Correo administrativo, moneda por defecto, listas de copias y preferencias personales. | NestJS, TypeORM | HU-003, HU-008, HU-009 |
| C6 | **Módulo Contactos** | Catálogo de contactos con correo único por empresa (índice único sobre `empresa_id` y el correo normalizado), historial de ediciones por campo, eliminación solo de contactos sin comprobantes. | NestJS, TypeORM | HU-004 |
| C7 | **Módulo Comprobantes y cuotas** | Propuesta de cuotas, registro y edición con historial por campo, unicidad del número de documento entre comprobantes no anulados, anulación de comprobantes. Provee los hechos de comprobante/cuota a la consulta cronológica coordinada por C15. | NestJS, TypeORM, núcleo de dominio | HU-005, HU-007, HU-017 |
| C8 | **Módulo Pagos y anulaciones** | Registro idempotente de pagos con bloqueo de la cuota, validación de saldo y orden cronológico, y anulación de pagos como entidad separada. | NestJS, TypeORM, núcleo de dominio | HU-006, HU-007 |
| C9 | **Módulo Reprogramaciones** (Should) | Promesas de pago con un máximo de una ACTIVA por cuota; la fecha efectiva de vencimiento sale de la promesa (RN-071). Se activa con la bandera `FUNCIONALIDAD_S1`. | NestJS, TypeORM, núcleo de dominio | HU-011 |
| C10 | **Módulo Panel** | Lectura coherente en un solo corte (RN-205, RN-206): indicadores, proyección, movimientos y tiempo promedio de cobro (este último con la bandera `FUNCIONALIDAD_S5`). | NestJS, transacción `REPEATABLE READ READ ONLY`, núcleo de dominio | HU-008, HU-012 |
| C11 | **Módulo Avisos** | Cuotas por avisar, vista previa con firma de destinatarios, intentos persistidos antes de llamar a Resend, cierre de errores y tiempos de espera como «No Enviado», y bandeja interna. El bloqueo solo dura mientras el intento está en proceso con plazo vigente. Con S1, incluye la promesa activa en cada cuota por avisar para todos los roles de la empresa (RN-036). | NestJS, TypeORM, adaptador de correo | HU-010, HU-011 |
| C12 | **Núcleo de dominio puro** | Funciones puras sin E/S y sin reloj, entre ellas `calcularSaldoCuota`, `calcularEstadoCuota`, `calcularDiasAtraso`, `calcularFechaEfectiva`, `proponerCuotas`, `calcularProyeccion`, `calcularIndicadoresCartera`, `clasificarTipoAviso`, `clasificarPromesa`, `calcularTiempoPromedioCobro` y `construirHistorialCuota` (transiciones y orden RN-078). Aritmética decimal exacta en céntimos. | TypeScript puro (paquete `dominio`), decimal.js, Jest con casos de referencia y cobertura ≥ 80 % | HU-005, HU-006, HU-007, HU-008, HU-010, HU-011, HU-012, HU-017 |
| C13 | **Servicio de hash** | Hash Argon2id de contraseñas, generación de tokens aleatorios de 256 bits y su hash SHA-256, y normalización de correo y RUC para comparar (RN-139, RN-143, RN-216 a RN-218, RN-243 a RN-253, RN-262). | `node:crypto`, argon2 | HU-001 a HU-004, HU-009, HU-010 |
| C14 | **Adaptador de correo** | Envío por Resend con clave de idempotencia por intento y plantillas fijas por tipo de aviso. En entornos de prueba redirige todo al buzón de prueba (RN-013, PRINCIPIO-011). | SDK de Resend, plantillas React Email | HU-001, HU-002, HU-003, HU-010 |
| C15 | **Auditoría, historiales y trazabilidad** | Eventos de auditoría (roles, listas de copias, invitaciones, configuración) e historial de ediciones por campo, escritos en la misma transacción que el cambio, salvo los eventos del resultado de un envío de correo (`INVITACION_ENVIADA`, `INVITACION_FALLIDA`), que se escriben en una transacción propia después de la llamada al proveedor. Escribe también los registros de interacción lógica de `registros_acceso` (RN-263 a RN-266) mediante un interceptor común: en las escrituras, en la misma transacción que el cambio; en las consultas y exportaciones, antes de entregar la respuesta. Coordina además la consulta cronológica RN-078 usando hechos de C7/C8/C9 y ediciones, con transiciones calculadas en C12; la lectura no escribe auditoría ni persiste transiciones. | NestJS, PostgreSQL | HU-001, HU-003, HU-004, HU-005, HU-007, HU-009, HU-017 |
| C16 | **Base de datos** | Persistencia, RLS por `empresa_id`, índices únicos parciales y triggers de inmutabilidad. Migraciones SQL versionadas. | PostgreSQL 16 (Neon o local), migraciones TypeORM | Todas |

**Organización del código (monorepo):** `apps/web` (C1), `apps/api` (C2, C3, C5 a C11, C13 a C15), `apps/api-interna` (C4, que reutiliza los módulos de `apps/api`), `packages/dominio` (C12) y `packages/contratos` (tipos generados desde `07-openapi.yaml`).

---

## 3. Modelo de datos

### 3.1 Entidades y atributos clave

Convenciones: los identificadores son `bigint`; las tablas de negocio llevan `empresa_id`; los importes son `numeric(14,2)` y nunca `float`; las fechas de negocio son `date` y los instantes `timestamptz`. Los correos se guardan normalizados (TRIM y minúsculas, RN-139) y el RUC como texto de 11 dígitos (RN-217); no hay columnas cifradas (E-015).

| Entidad | Atributos clave | Notas |
|---|---|---|
| `empresas` | `id`, `razon_social`, `ruc` (`char(11)`, único global), `correo_administrativo`, `moneda_por_defecto` (`PEN`/`USD`), `terminacion_efectiva_en` (nulo mientras no haya terminación formalizada), `creada_en`, `version` | La empresa está terminada cuando `terminacion_efectiva_en <= ahora`, con el reloj inyectado. No se guarda un estado del contrato: un estado que alguien debe cambiar a la hora exacta quedaría desfasado (C-03). La fecha la fija el equipo de VenceYa mediante su procedimiento operativo manual, fuera de la aplicación y de la API interna (pregunta 52); el bloqueo lo aplican el inicio de sesión, el guard de sesión, los enlaces y los avisos. |
| `usuarios` | `id`, `empresa_id`, `correo` (único global), `rol`, `estado` (`INVITADO`/`ACTIVO`/`DESACTIVADO`), `hash_contrasena` (Argon2id, nulo hasta la activación), `fallos_consecutivos`, `bloqueado_hasta`, `moneda_preferida`, `ventana_proyeccion_dias`, `version` | Sin DELETE desde la aplicación. |
| `enlaces_acceso` | `id`, `empresa_id`, `usuario_id`, `tipo` (`INVITACION`/`RECUPERACION`), `token_hash` (SHA-256), `emitido_en`, `vence_en`, `usado_en`, `revocado_en` | Índice único parcial: un enlace vigente por usuario y tipo (RN-259). El token en claro solo viaja en el correo. |
| `sesiones` | `id`, `empresa_id`, `usuario_id`, `token_hash`, `token_csrf_hash`, `iniciada_en`, `ultima_actividad_en`, `cerrada_en`, `motivo_cierre` | Vigente si `cerrada_en` es nulo, han pasado menos de 30 minutos desde `ultima_actividad_en` y menos de 12 horas desde `iniciada_en`. |
| `contactos` | `id`, `empresa_id`, `nombre`, `correo` (único por `empresa_id`), `telefono`, `direccion`, `estado`, `version` | La búsqueda parcial es solo por `nombre` (ver 3.3). |
| `comprobantes` | `id`, `empresa_id`, `contacto_id`, `sentido` (`POR_COBRAR`/`POR_PAGAR`), `numero_documento`, `moneda`, `total`, `fecha_emision`, `modalidad`, `anulado` (bool), `tuvo_pagos` (bool), `tuvo_reprogramaciones` (bool), `creado_por`, `creado_en`, `version` | `anulado`, `tuvo_pagos` y `tuvo_reprogramaciones` son marcas monótonas: solo pasan de falso a verdadero, en la misma transacción que el hecho que las provoca. |
| `anulaciones_comprobante` | `id`, `empresa_id`, `comprobante_id` (único), `motivo`, `usuario_id`, `anulado_en` | Fuente de verdad de la anulación. No admite UPDATE ni DELETE. |
| `cuotas` | `id`, `empresa_id`, `comprobante_id`, `numero`, `importe`, `vencimiento_original`, `version` | Estado, saldo y fecha efectiva se derivan; no se guardan. |
| `pagos` | `id`, `empresa_id`, `cuota_id`, `importe`, `moneda`, `fecha_pago`, `clave_idempotencia` (uuid), `huella_solicitud`, `registrado_por`, `creado_en` | Único (`empresa_id`, `clave_idempotencia`). Un trigger rechaza UPDATE y DELETE. |
| `anulaciones_pago` | `id`, `empresa_id`, `pago_id` (único), `motivo`, `usuario_id`, `anulado_en` | El índice único sobre `pago_id` garantiza una sola anulación por pago. |
| `promesas_pago` (S1) | `id`, `empresa_id`, `cuota_id`, `fecha_prometida`, `reemplazada_en`, `registrada_por`, `registrada_en` | Índice único parcial: una sola promesa no reemplazada por cuota. CUMPLIDA e INCUMPLIDA se derivan. |
| `historial_ediciones` | `id`, `empresa_id`, `entidad`, `entidad_id`, `campo`, `valor_anterior`, `valor_nuevo`, `usuario_id`, `editado_en` | Sus valores nunca se escriben en logs (PRINCIPIO-005). |
| `auditoria_eventos` | `id`, `empresa_id`, `tipo_evento`, `actor_usuario_id` u `actor_operativo`, `afectado_id`, `datos` (jsonb, sin secretos ni enlaces), `ocurrido_en` | Ejemplos de eventos: `ROL_CAMBIADO`, `COPIA_AGREGADA`, `INVITACION_ENVIADA` o `INVITACION_FALLIDA`. `INVITACION_FALLIDA` cubre el rechazo y el envío no confirmado (`datos.resultado` = `RECHAZADO` o `SIN_CONFIRMAR`), sin el enlace ni su hash, y se escribe en una transacción propia después de llamar al proveedor (QA-08). Si esa escritura falla, no se revierte la creación: la respuesta informa el resultado del envío y el error queda en logs con `idSolicitud` y `empresa_id`. |
| `listas_copias` | `empresa_id`, `sentido`, `usuario_id`, `agregado_por`, `agregado_en` | Clave primaria (`empresa_id`, `sentido`, `usuario_id`). Recibe copias si el usuario está ACTIVO y no es OPERADOR. |
| `intentos_aviso` | `id`, `empresa_id`, `contacto_id`, `tipo_aviso`, `estado`, `clave_idempotencia_proveedor`, `asunto`, `cuerpo`, `comentario`, `id_mensaje_proveedor`, `creado_por`, `creado_en`, `vence_en`, `resuelto_en`, `motivo_no_envio` | Estados EN_PROCESO, ENVIADO y NO_ENVIADO. Se guarda antes de llamar a Resend; vence_en = creado_en + 10 s (RN-158). |
| `destinatarios_aviso` | `intento_id`, `tipo` (`PARA`/`COPIA`/`RESPONDER_A`), `correo` | Copia histórica de los destinatarios del intento. |
| `cuotas_aviso` | `intento_id`, `cuota_id`, `tipo_aviso`, `fecha_efectiva`, `saldo_al_envio`, `en_proceso` (bool) | Índice único parcial (`cuota_id`, `tipo_aviso`, `fecha_efectiva`) donde `en_proceso` es verdadero. El cierre del intento libera esas filas en la misma transacción; antes de insertar se cierran los intentos vencidos, bajo bloqueo de las cuotas (RN-158). |
| `registros_acceso` | `id`, `empresa_id`, `usuario_id` (nulo en operaciones internas) u `actor_operativo`, `accion` (`INICIO_SESION`/`CIERRE_SESION`/`CONSULTA`/`ALTA`/`EDICION`/`ANULACION`/`ELIMINACION`/`EXPORTACION`), `entidad` o `recurso`, `entidad_id` (nulo en listados y reportes), `ocurrido_en` | Registro de interacción lógica (RN-263 a RN-266). Sin datos personales, importes ni criterios de búsqueda. `venceya_app` solo tiene INSERT; un trigger rechaza UPDATE y DELETE. Se conserva al menos dos años y el script de baja no lo elimina (pregunta 31). Índice (`empresa_id`, `ocurrido_en`). |

### 3.1.1 Historial cronológico de cuota (HU-017; M-06, 2026-11-10)

C15 coordina `GET /cuotas/{cuotaId}/historial` en una transacción `REPEATABLE READ READ ONLY`, validando primero la cuota de la empresa de la sesión. Lee el comprobante y cuota (C7), las ediciones conservadas por T-012/T-017, pagos y anulaciones (C8) y promesas (C9, cuando existan). No requiere tablas nuevas ni modifica el servicio de escritura de T-012. Los valores sensibles de ediciones se descifran solo dentro de la consulta autorizada y nunca se escriben en logs.

C12 recibe estos hechos y `fechaCalculo` derivada del corte en America/Lima. Construye los eventos registrados y recalcula VENCIDA, CANCELADA y REAPERTURA conforme a RN-078/RN-084/RN-088; estas transiciones no se guardan. Se ordena por fecha del hecho y desempates de RN-078; actor y fecha/hora de registro son informativos. El pago anulado y su anulación permanecen, aunque las transiciones cambien tras una corrección. No se conserva lo mostrado por consultas anteriores. Un comprobante anulado mantiene su historial consultable según RN-090, sin habilitar operaciones.

La disponibilidad de la vista y la consulta es `FUNCIONALIDAD_S1 || FUNCIONALIDAD_S4`. S4 se configura apagada y reservada para su futura entrega; habilitar la consulta con solo S4 permite comprobar su independencia y no implementa su reporte ni exportaciones. Sin promesas existentes no hay eventos de reprogramación; si existen, se conservan en el historial. Ambas banderas apagadas producen `404` y ocultan la vista. El registro de la ruta es incondicional desde T-005; antes de T-038 el controlador mínimo responde `404` incluso ante activación accidental. La lista de promesas (40) no sustituye esta consulta.

### 3.2 Relaciones

```text
empresas 1──N usuarios 1──N sesiones
                     └──N enlaces_acceso
empresas 1──N contactos 1──N comprobantes 1──N cuotas 1──N pagos 1──0..1 anulaciones_pago
                              └──0..1 anulaciones_comprobante      └──N promesas_pago (S1)
empresas 1──N listas_copias N──1 usuarios
empresas 1──N intentos_aviso 1──N destinatarios_aviso
                             └──N cuotas_aviso N──1 cuotas
(entidad, entidad_id) 1──N historial_ediciones · empresas 1──N auditoria_eventos
```

**Reglas de integridad en la base de datos:**

- Índice único parcial en `comprobantes`, sobre `(empresa_id, numero_documento)`, con `sentido = 'POR_COBRAR' AND NOT anulado`.
- Índice único parcial en `comprobantes`, sobre `(empresa_id, contacto_id, numero_documento)`, con `sentido = 'POR_PAGAR' AND NOT anulado`.
- `CHECK (importe > 0)` en cuotas y pagos.
- Clave foránea de `comprobantes.contacto_id` con `ON DELETE RESTRICT`: impide eliminar un contacto con comprobantes, incluso si la eliminación compite con un alta concurrente.
- El saldo nunca es negativo. Se garantiza con `SELECT … FOR UPDATE` sobre la cuota antes de validar y guardar el pago.

### 3.3 Notas de seguridad

- **Sin cifrado por campo (PRINCIPIO-004, E-015):** los datos personales se guardan en claro y se protegen con RLS, permisos por rol, trazabilidad de accesos y TLS. En la nube se asume el cifrado en reposo del almacenamiento de Neon, verificado antes del lanzamiento (pregunta 26); en la modalidad local, el cifrado del disco y de los respaldos lo decide la empresa cliente.
  - Unicidad con índices únicos: `usuarios (correo)`, `contactos (empresa_id, correo)` y `empresas (ruc)`, sobre el valor ya normalizado; una restricción `CHECK (correo = lower(btrim(correo)))` impide guardar un correo sin normalizar.
- **Nombres y razón social:** van en claro para permitir la búsqueda parcial y el orden. Como todos los datos personales, nunca aparecen en logs ni en errores (PRINCIPIO-005).
- **Secretos:** la clave de firma de sesiones, la clave de Resend y las credenciales de base de datos están en variables de entorno, separadas por ambiente; nunca en la base ni en el repositorio (RN-227, RN-228).
- **Contraseñas:** Argon2id con un mínimo de 19 MiB, 2 iteraciones y paralelismo 1, y sal individual. No se normalizan.
- **Tokens:** los de sesión, invitación y recuperación son aleatorios de 256 bits, y en la base solo se guarda su SHA-256 (RN-262).
- **Trazabilidad (PRINCIPIO-005, RN-263 a RN-266):** un interceptor de NestJS escribe en `registros_acceso` cada inicio y cierre de sesión y cada consulta, alta, edición, anulación, eliminación o exportación de datos personales. Si la escritura falla, la operación se revierte o la consulta responde `500` sin datos.
- **RLS:** las tablas de negocio, y también `usuarios`, `sesiones` y `enlaces_acceso`, tienen la política `empresa_id = current_setting('app.empresa_id')::bigint`. El rol `venceya_app` no tiene `BYPASSRLS`.
  - **Lecturas antes de la autenticación (C-01):** `usuarios`, `sesiones` y `enlaces_acceso` se consultan sin conocer la empresa solo mediante tres funciones `SECURITY DEFINER`: `resolver_sesion(token_hash)`, `buscar_usuario_por_correo(correo_normalizado)` y `resolver_enlace(token_hash)`. Cada una devuelve el `empresa_id` y `empresas.terminacion_efectiva_en`, y con ese `empresa_id` la petición ejecuta `SET LOCAL app.empresa_id`; todo lo demás (renovar la actividad, cerrar la sesión, contar fallos, consumir el enlace) se escribe ya bajo RLS. Son las únicas vías de lectura sin `app.empresa_id`.
  - **Endurecimiento de las funciones:** pertenecen a un rol dedicado sin login y con `BYPASSRLS`, fijan `search_path`, tienen `REVOKE EXECUTE … FROM PUBLIC` con `GRANT` solo a `venceya_app`, y devuelven únicamente las columnas necesarias (`hash_contrasena` solo la función de inicio de sesión). La API interna usa el rol `venceya_operaciones`, con permisos solo sobre el alta de empresas y usuarios.
- **Inmutabilidad (PRINCIPIO-006):**
  - Hay triggers `BEFORE UPDATE OR DELETE` sobre `pagos`, `anulaciones_pago` y `anulaciones_comprobante`.
  - Además, `venceya_app` no tiene privilegios `UPDATE` ni `DELETE` sobre esas tablas.
  - La baja contractual (RN-152) la ejecuta el equipo de VenceYa con un script operativo manual, fuera de la aplicación, que elimina todos los datos de la empresa juntos (ver §6.3, fila HU-018).
- **Retención:** mientras el contrato esté vigente no se elimina ningún comprobante, cuota, pago, anulación, usuario ni historial. La única excepción es un contacto sin comprobantes (RN-130). Su historial de ediciones se conserva sin cambios (pregunta 51, QA-13, resuelta el 2026-11-10; RN-255). Los registros de `registros_acceso` se conservan al menos dos años (RN-265).

---

## 4. API Contracts

La especificación completa (schemas, parámetros, cuerpos, respuestas y ejemplos) está en **[07-openapi.yaml](./07-openapi.yaml)**, la fuente oficial de los contratos. Este documento no repite schemas. El archivo tiene exactamente las mismas 49 operaciones que el inventario de 4.2. M-05 (2026-11-10) retiró la antigua operación 49 de verificación de avisos; M-06 incorpora ahora la nueva operación 49 de historial de cuota, sin recuperar la ruta retirada. Validación de M-06: ver el cierre documental en `08-backlog-reporte.md`; las comprobaciones de contrato no acreditan implementación.

### 4.1 Convenciones generales

| Tema | Convención |
|---|---|
| Prefijo y versión | `https://{host}/api/v1`. Un cambio incompatible crea `/api/v2`; los cambios compatibles (campos nuevos opcionales) no cambian la versión. |
| Autenticación | Sesión opaca en servidor, en la cookie `venceya_sesion` (`HttpOnly; Secure; SameSite=Strict; Path=/api`). Toda operación distinta de GET exige la cabecera `X-Token-CSRF`. Plazos: 30 minutos de inactividad y 12 horas absolutas (RN-149). Los sondeos envían `X-Peticion-Automatica: true` y no renuevan la inactividad. La API interna usa `Authorization: Bearer <token de operaciones>`. |
| Autorización | Matriz RN-060, comprobada en el servidor en cada operación. La extensión `x-roles` de cada operación del YAML lista los roles autorizados. La empresa nunca se recibe del cliente. |
| Formato de error único | `{ codigo, mensaje, detalles[{campo, codigo, mensaje}], idSolicitud }`. El mensaje está en español y nunca incluye valores ingresados, datos personales ni importes (PRINCIPIO-005). |
| Códigos HTTP | `400`: JSON mal formado o parámetros de ruta o de consulta inválidos. `401`: sin sesión vigente o credenciales inválidas. `403`: rol sin permiso o CSRF inválido. `404`: recurso inexistente o de otra empresa. `409`: conflicto con el estado vigente. `422`: el cuerpo incumple reglas de contenido o de negocio. `500`: falla técnica sin efectos. |
| Concurrencia | Los recursos editables exponen `version` y las mutaciones la reciben; si no coincide, `409 DATOS_DESACTUALIZADOS` (RN-160). Pagos y reprogramaciones reciben `versionCuota`. |
| Idempotencia | Los pagos exigen la cabecera `Clave-Idempotencia` (UUID). Una repetición idéntica responde `200` con el pago original; la misma clave con otros datos, `409` (RN-156). Los avisos usan intentos persistidos y una clave por intento hacia Resend (RN-158). Cada intento manual nuevo tiene otra clave; el bloqueo de concurrencia termina con el resultado o el plazo del servidor. |
| Paginación | `pagina` (desde 1) y `tamanoPagina` (de 1 a 100, 20 por defecto). La respuesta trae `{ elementos, paginacion: { pagina, tamanoPagina, totalElementos, totalPaginas } }`. Se aplica a usuarios, contactos, comprobantes e intentos de aviso. El panel y las cuotas por avisar devuelven el listado completo de un solo corte (ADR-008). |
| Importes | Cadena decimal canónica `"1000.50"`: punto decimal, sin separador de miles, hasta 12 dígitos enteros y 2 decimales. Las respuestas siempre llevan 2 decimales. Moneda en ISO 4217: `PEN` (S/) o `USD` (US$). El formato `S/ 1,000.00` es responsabilidad de la SPA (RN-153). |
| Fechas | Fechas de negocio en `AAAA-MM-DD`. Instantes en ISO 8601 con desfase de Lima (`2026-11-09T08:15:30-05:00`). La fecha de cálculo y el corte los fija el servidor (RN-198, RN-205) y se devuelven en `fechaCalculo` y `corte`. |
| Texto | El servidor aplica RN-162 en todos los casos: TRIM, MAYÚSCULAS (minúsculas en correos), longitud y caracteres permitidos. Nunca trunca ni corrige un valor sin avisar. |
| Idioma | Rutas, campos, schemas, `operationId` y códigos de error en español (PRINCIPIO-001). Los ejemplos usan datos ficticios y correos `@example.com` (PRINCIPIO-005). |

**Catálogo de códigos de error:**

| Código | Uso |
|---|---|
| `SOLICITUD_INVALIDA` | Errores 400. |
| `VALIDACION_FALLIDA` | Errores 422 con detalle por campo. |
| `CREDENCIALES_INVALIDAS` | Inicio de sesión rechazado. |
| `SESION_NO_VIGENTE` | Sin sesión vigente. |
| `CONTRATO_TERMINADO` | La empresa alcanzó su terminación contractual efectiva (RN-152): `403` al iniciar sesión con la contraseña correcta o al canjear un enlace, `401` en una sesión abierta (que se cierra) y `409` en la API interna. |
| `TOKEN_CSRF_INVALIDO` | Falta la cabecera CSRF o no coincide. |
| `PERMISO_DENEGADO` | Rol sin permiso. |
| `RECURSO_NO_ENCONTRADO` | Recurso inexistente o de otra empresa. |
| `ENLACE_VENCIDO`, `ENLACE_NO_VALIDO` | Enlaces de invitación o recuperación. |
| `RUC_YA_REGISTRADO`, `CORREO_USUARIO_YA_REGISTRADO`, `CORREO_CONTACTO_YA_REGISTRADO`, `COMPROBANTE_DUPLICADO` | Duplicados. |
| `DATOS_DESACTUALIZADOS` | Versión distinta de la vigente. |
| `ESTADO_NO_PERMITE_OPERACION` | El estado actual no admite la operación. |
| `ULTIMO_ADMINISTRADOR_ACTIVO` | La operación dejaría a la empresa sin administrador activo. |
| `EXISTE_ADMINISTRADOR_ACTIVO` | Reenvío interno con un administrador activo. |
| `USUARIO_YA_EN_LISTA`, `USUARIO_NO_ELEGIBLE_COPIAS` | Listas de copias. |
| `CONTACTO_CON_COMPROBANTES` | Eliminación de un contacto con comprobantes. |
| `COMPROBANTE_NO_EDITABLE`, `COMPROBANTE_CON_PAGOS_VIGENTES`, `COMPROBANTE_ANULADO`, `YA_ANULADO` | Comprobantes y anulaciones. |
| `IMPORTE_SUPERA_SALDO`, `CLAVE_IDEMPOTENCIA_REUTILIZADA` | Pagos. |
| `CUOTA_SIN_SALDO` | Reprogramación. |
| `MES_FUTURO` | Tiempo promedio de cobro. |
| `SIN_CUOTAS_APTAS`, `INTENTO_EN_PROCESO`, `DESTINATARIOS_CAMBIARON`, `REENVIO_REQUIERE_CONFIRMACION` | Avisos. |
| `ERROR_INTERNO` | Falla técnica. |

### 4.2 Inventario de endpoints

Abreviaturas de roles: **ADM** (ADMINISTRADOR), **SUP** (SUPERVISOR), **OPE** (OPERADOR), **EQV** (equipo de VenceYa, solo API interna), **Público** (sin sesión). Todas las rutas llevan el prefijo `/api/v1`.

| # | Método | Ruta | Descripción | HU | Roles |
|---|---|---|---|---|---|
| 1 | POST | `/autenticacion/inicio-sesion` | Iniciar sesión con correo y contraseña | HU-002 | Público |
| 2 | POST | `/autenticacion/cierre-sesion` | Cerrar la sesión actual | HU-002 | ADM, SUP, OPE |
| 3 | GET | `/autenticacion/sesion` | Obtener la sesión vigente y el token CSRF | HU-002 | ADM, SUP, OPE |
| 4 | POST | `/autenticacion/activacion` | Activar la cuenta con el enlace de invitación | HU-002 | Público |
| 5 | POST | `/autenticacion/recuperacion` | Solicitar un enlace de recuperación (respuesta neutra) | HU-002 | Público |
| 6 | POST | `/autenticacion/recuperacion/restablecimiento` | Definir una nueva contraseña con el enlace | HU-002 | Público |
| 7 | POST | `/interno/empresas` | Dar de alta una empresa y su primer administrador | HU-001 | EQV |
| 8 | POST | `/interno/empresas/{empresaId}/reenvio-invitacion-administrador` | Reenviar la invitación del primer administrador | HU-001 | EQV |
| 9 | GET | `/usuarios` | Listar los usuarios de la empresa | HU-003, HU-009 | ADM |
| 10 | POST | `/usuarios` | Invitar un usuario con un rol | HU-003 | ADM |
| 11 | GET | `/usuarios/{usuarioId}` | Obtener un usuario | HU-003 | ADM |
| 12 | PUT | `/usuarios/{usuarioId}/rol` | Cambiar el rol (cierra sesiones y audita) | HU-003 | ADM |
| 13 | POST | `/usuarios/{usuarioId}/desactivacion` | Desactivar un usuario | HU-003 | ADM |
| 14 | POST | `/usuarios/{usuarioId}/reactivacion` | Reactivar un usuario | HU-003 | ADM |
| 15 | POST | `/usuarios/{usuarioId}/reenvio-invitacion` | Reenviar la invitación de un usuario INVITADO | HU-003 | ADM |
| 16 | GET | `/mi-cuenta/preferencias` | Obtener mis preferencias de moneda y ventana | HU-008 | ADM, SUP, OPE (propias) |
| 17 | PUT | `/mi-cuenta/preferencias` | Actualizar mis preferencias | HU-008 | ADM, SUP, OPE (propias) |
| 18 | GET | `/empresa/configuracion` | Obtener correo administrativo y moneda por defecto | HU-008, HU-009 | ADM |
| 19 | PATCH | `/empresa/configuracion` | Cambiar correo administrativo o moneda por defecto | HU-008, HU-009 | ADM |
| 20 | GET | `/empresa/listas-copias` | Obtener las listas de copias por cobrar y por pagar | HU-009 | ADM |
| 21 | POST | `/empresa/listas-copias/{sentido}/usuarios` | Agregar un usuario a una lista de copias | HU-009 | ADM |
| 22 | DELETE | `/empresa/listas-copias/{sentido}/usuarios/{usuarioId}` | Quitar un usuario de una lista de copias | HU-009 | ADM |
| 23 | GET | `/contactos` | Listar o buscar contactos | HU-004, HU-005 | ADM, SUP, OPE |
| 24 | POST | `/contactos` | Crear un contacto | HU-004 | ADM, SUP, OPE |
| 25 | GET | `/contactos/{contactoId}` | Obtener un contacto | HU-004 | ADM, SUP, OPE |
| 26 | PATCH | `/contactos/{contactoId}` | Editar un contacto (historial por campo) | HU-004 | ADM, SUP, OPE |
| 27 | DELETE | `/contactos/{contactoId}` | Eliminar un contacto sin comprobantes | HU-004 | ADM, SUP, OPE |
| 28 | POST | `/contactos/{contactoId}/desactivacion` | Desactivar un contacto | HU-004 | ADM, SUP, OPE |
| 29 | POST | `/contactos/{contactoId}/reactivacion` | Reactivar un contacto | HU-004 | ADM, SUP, OPE |
| 30 | POST | `/comprobantes/propuesta-cuotas` | Calcular la propuesta de cuotas (sin persistir) | HU-005 | ADM, SUP, OPE |
| 31 | GET | `/comprobantes` | Listar comprobantes | HU-005 | ADM, SUP, OPE |
| 32 | POST | `/comprobantes` | Registrar un comprobante con sus cuotas | HU-005 | ADM, SUP, OPE |
| 33 | GET | `/comprobantes/{comprobanteId}` | Obtener un comprobante con sus cuotas | HU-005, HU-006, HU-007 | ADM, SUP, OPE |
| 34 | PATCH | `/comprobantes/{comprobanteId}` | Editar un comprobante sin pagos ni reprogramaciones | HU-005 | ADM, SUP, OPE |
| 35 | POST | `/comprobantes/{comprobanteId}/anulacion` | Anular un comprobante sin pagos vigentes | HU-007 | SUP, ADM |
| 36 | GET | `/cuotas/{cuotaId}` | Obtener una cuota con su saldo vigente | HU-006, HU-011 | ADM, SUP, OPE |
| 37 | GET | `/cuotas/{cuotaId}/pagos` | Listar los pagos de una cuota | HU-006, HU-007 | ADM, SUP, OPE |
| 38 | POST | `/cuotas/{cuotaId}/pagos` | Registrar un cobro o pago (idempotente) | HU-006 | ADM, SUP, OPE |
| 39 | POST | `/pagos/{pagoId}/anulacion` | Anular un pago | HU-007 | SUP, ADM |
| 40 | GET | `/cuotas/{cuotaId}/promesas` | Listar las promesas de pago de una cuota (S1) | HU-011 | ADM, SUP, OPE |
| 41 | POST | `/cuotas/{cuotaId}/promesas` | Reprogramar una cuota con promesa de pago (S1) | HU-011 | ADM, SUP, OPE |
| 42 | GET | `/panel` | Panel de cartera: indicadores, proyección y movimientos | HU-008 | ADM, SUP, OPE |
| 43 | GET | `/panel/tiempo-promedio-cobro` | Tiempo promedio de cobro de comprobantes saldados (S5) | HU-012 | ADM, SUP, OPE |
| 44 | GET | `/avisos/cuotas-por-avisar` | Listar las cuotas por avisar | HU-010, HU-011 | ADM, SUP, OPE |
| 45 | POST | `/avisos/vista-previa` | Preparar un aviso y mostrar sus destinatarios | HU-010 | ADM, SUP, OPE |
| 46 | POST | `/avisos/envios` | Confirmar y enviar un aviso | HU-010 | ADM, SUP, OPE |
| 47 | GET | `/avisos/intentos` | Consultar la bandeja interna de avisos | HU-010 | ADM, SUP, OPE |
| 48 | GET | `/avisos/intentos/{intentoId}` | Obtener un intento de aviso | HU-010 | ADM, SUP, OPE |
| 49 | GET | `/cuotas/{cuotaId}/historial` | Consultar el historial cronológico (S1 o S4) | HU-017 | ADM, SUP, OPE |

**Cobertura:** las 13 HUs tienen al menos un endpoint. Las operaciones Should 40/41 requieren S1, la 43 requiere S5 y la 49 requiere S1 o S4; sin disponibilidad responden `404`. Todas se registran desde el MVP con controladores mínimos (T-005) que no ejecutan lógica hasta implementar T-034, T-036 y T-038 respectivamente.

### 4.3 Fuente oficial

[07-openapi.yaml](./07-openapi.yaml) es la fuente oficial del detalle de los contratos. Si este documento y el YAML difieren, prevalece el YAML, y la diferencia se corrige en el mismo pull request. Los tipos de `packages/contratos` se generan desde el YAML, y en CI se verifica que el código expone exactamente esas operaciones (ver 6.2).

---

## 5. ADRs

### ADR-001: Monolito modular en NestJS

- **Contexto:** el equipo es pequeño, el volumen es de unas 80 operaciones al mes por empresa y hay dos modalidades de instalación, una de ellas en el servidor del cliente. Muchas operaciones cruzan módulos en una sola transacción (pago, saldo y estado; anulación y cuotas).
- **Decisión:** una sola aplicación NestJS con módulos por capacidad (sección 2), una base de datos y transacciones locales. La API interna es un segundo punto de entrada de la misma base de código.
- **Alternativas:** microservicios por dominio, descartados por las transacciones distribuidas, el costo operativo y la dificultad de instalarlos on-premise. Funciones serverless, descartadas por el estado de las sesiones, las transacciones y la modalidad local.
- **Consecuencias:** una instalación simple en Railway y on-premise, con atomicidad nativa (RN-160). Los límites entre módulos se protegen con reglas de lint de dependencias. Escalar implica replicar la aplicación completa, algo suficiente para el volumen previsto.

### ADR-002: Sesiones opacas en servidor con cookie HttpOnly

- **Contexto:** RN-149 exige 30 minutos de inactividad sin contar las peticiones automáticas y 12 horas absolutas. Hay que cerrar todas las sesiones al cambiar el rol, desactivar al usuario o recuperar la contraseña (RN-099, RN-102, RN-161), y la terminación contractual debe bloquear el acceso al instante.
- **Decisión:** un token aleatorio de 256 bits en la cookie `venceya_sesion` (`HttpOnly; Secure; SameSite=Strict`). La tabla `sesiones` guarda solo su hash. CSRF con token sincronizado en la cabecera `X-Token-CSRF`. La actividad se renueva en cada petición del usuario, salvo con `X-Peticion-Automatica: true`.
- **Alternativas:** JWT de acceso y de refresco, descartado porque la revocación inmediata exigiría una lista negra consultada en cada petición, que equivale a una sesión en servidor con más complejidad; además, guardar el JWT en `localStorage` lo expone a XSS. Sesiones en Redis, descartadas por agregar un servicio no previsto en PRINCIPIO-002.
- **Topología web (M-07, 2026-11-10):** para la nube se adopta un mismo origen HTTPS por ambiente, con SPA en `/` y API en `/api`. Esto cumple el requisito de compartir sitio de `SameSite=Strict` y simplifica la integración del navegador. No se fija todavía un nombre de dominio: queda pendiente en la pregunta 53, independiente del dominio remitente de Resend (39).
- **Consecuencias:** revocación exacta y verificable, y cumplimiento directo de RN-149. Cada petición consulta la tabla `sesiones`, lo que es aceptable para el volumen. La misma consulta obtiene `empresas.terminacion_efectiva_en`: si es menor o igual que el instante actual, el guard cierra la sesión con `motivo_cierre = 'CONTRATO_TERMINADO'` y responde `401 CONTRATO_TERMINADO`, sin necesidad de un job a la hora de la terminación (RN-149, RN-152). La función `resolver_sesion` (C-01, §3.3), que resuelve la sesión antes de conocer la empresa, devuelve también esa columna. SPA y API deben compartir el sitio (mismo dominio registrable) para que `SameSite=Strict` funcione.

### ADR-003: Sin cifrado por campo; protección por aislamiento y trazabilidad (E-015)

- **Contexto:** E-005 exigía AES-256-GCM por campo, referencias HMAC para comparar y gestión de claves con rotación. Al revisar M-08 se vio que la rotación obligaba a duplicar las referencias para no romper la unicidad, y que la Ley 29733 y su reglamento (D.S. 016-2024-JUS) no exigen cifrado en reposo ni por campo; sí exigen control de acceso, trazabilidad de accesos durante dos años, documento de seguridad y respaldos verificados (art. 46 a 51). Además, el cifrado dejaba en claro el nombre, los importes y las fechas, de modo que una copia filtrada de la base seguía revelando quién debe cuánto.
- **Decisión:** no se cifra ningún campo en la aplicación. Correos y RUC se guardan normalizados con índices únicos por ámbito; contraseñas con Argon2id y tokens con SHA-256; secretos en variables de entorno; trazabilidad de accesos en `registros_acceso`. En la nube se asume el cifrado en reposo de Neon.
- **Alternativas:** mantener el cifrado por campo con doble referencia durante la rotación (M-08), descartado por su complejidad frente a un beneficio parcial. Cifrar solo teléfono y dirección, descartado por la decisión del usuario: no son datos de alto riesgo y el sistema ya no guarda números de cuenta (RN-006).
- **Consecuencias:** desaparecen las referencias HMAC y la custodia y rotación de claves de datos; la prueba de recuperación (RN-240) solo restaura, verifica integridad, acceso y unicidad. La unicidad la garantiza directamente PostgreSQL. Una copia de la base o un respaldo expone los datos en claro, así que su protección depende del proveedor, del control de acceso a la base y de la custodia de las credenciales. Si la revisión legal (pregunta 31) exigiera cifrado, habría que añadirlo con una migración de datos.

### ADR-004: Inmutabilidad de pagos en tres capas

- **Contexto:** PRINCIPIO-006 exige que ninguna operación de la aplicación haga UPDATE ni DELETE sobre un pago confirmado, que las anulaciones sean registros separados y que esto sea verificable con pruebas.
- **Decisión:**
  1. El modelo no expone métodos de modificación de pagos.
  2. El rol de base de datos `venceya_app` no tiene `UPDATE` ni `DELETE` sobre `pagos`, `anulaciones_pago` ni `anulaciones_comprobante`.
  3. Un trigger `BEFORE UPDATE OR DELETE` lanza un error en esas tablas; solo lo desactiva el procedimiento de baja contractual, con su propio rol.

  El estado ANULADO se deriva de que exista una fila en `anulaciones_pago`.
- **Alternativas:** una columna `anulado` en el pago, que viola PRINCIPIO-006. Event sourcing completo, desproporcionado para el alcance.
- **Consecuencias:** la garantía no depende del código de la aplicación y se prueba con tests de integración que intentan el UPDATE y esperan el rechazo. Las consultas de saldo hacen `LEFT JOIN anulaciones_pago`.

### ADR-005: Estados y saldos derivados por funciones puras

- **Contexto:** PRINCIPIO-007 exige cálculos deterministas, la fecha de cálculo como parámetro, casos de referencia y cobertura ≥ 80 %. El estado de una cuota cambia con el paso del tiempo (de PENDIENTE a VENCIDA) sin ningún evento que lo dispare.
- **Decisión:** saldo, estado, días de atraso, fecha efectiva, tipo de aviso, estado de las promesas y tiempo promedio de cobro no se guardan. Se calculan en `packages/dominio` a partir de los hechos (cuotas, pagos, anulaciones, promesas) y de `fechaCalculo`, que la capa de aplicación deriva del corte en America/Lima. Los importes se manejan con `decimal.js`.
- **Alternativas:** columnas de estado actualizadas por un job nocturno, descartado porque introduce desfases, depende del reloj y rompe la reproducibilidad. Vistas SQL con `CURRENT_DATE`, descartadas porque leen el reloj del servidor de base de datos.
- **Consecuencias:** resultados reproducibles y con pruebas unitarias. Para el panel se cargan los hechos de la empresa y se calcula en memoria, algo viable con el volumen previsto. Si el volumen creciera mucho, se puede materializar un resumen sin cambiar las funciones.

### ADR-006: Idempotencia y concurrencia de pagos y avisos

- **Contexto:** RN-156 exige que un doble clic, un reintento o una petición concurrente creen como máximo un pago. RN-158 exige guardar el intento antes de llamar a Resend e impedir envíos simultáneos de las mismas cuotas mientras está en proceso. La decisión M-05 (2026-11-10) trata errores y tiempos de espera como «No Enviado» y permite otro intento manual (RN-066, RN-067).
- **Decisión:**
  - **Pagos:**
    - La SPA genera la `Clave-Idempotencia` (UUID) al abrir el formulario.
    - El backend, en una transacción, bloquea la cuota con `FOR UPDATE`, compara `versionCuota` y busca la clave.
    - Si la clave existe con la misma huella (cuota, fecha e importe), devuelve el pago original; si existe con otra huella, responde 409; si no existe, valida y guarda.
    - Un índice único sobre (`empresa_id`, `clave_idempotencia`) cubre las carreras que queden.
  - **Avisos:**
    - La transacción 1 bloquea las cuotas en orden de ID, comprueba el contrato vigente y cierra los intentos EN_PROCESO cuyo plazo venció, liberando sus filas de cuotas_aviso. Recalcula saldo, tipo y aptitud; excluye las no aptas con motivo. Si no queda ninguna, responde 422 SIN_CUOTAS_APTAS sin guardar un intento ni llamar a Resend (RN-155). Las exclusiones no cambian el historial ni un envío exitoso anterior.
    - Valida la firma y los destinatarios de los grupos que siguen siendo aptos; excluir una cuota por sí solo no produce DESTINATARIOS_CAMBIARON. La firma debe permitir comparar los destinatarios confirmados de los grupos sobrevivientes. Un cambio real de destinatarios exige otra confirmación (RN-136).
    - Si existe otro intento EN_PROCESO con plazo vigente para una cuota, tipo y fecha efectiva, rechaza con INTENTO_EN_PROCESO sin crear otro intento. En caso contrario, guarda el intento EN_PROCESO, sus destinatarios, su contenido y sus cuotas_aviso con en_proceso = true, garantizados por el índice único parcial.
    - El intento guarda creado_en y vence_en = creado_en + 10 s, medidos con el reloj del servidor. Fuera de la transacción se llama una sola vez a Resend con Idempotency-Key igual a la clave del intento, usando como tiempo máximo el plazo restante; los reintentos del SDK/cliente están deshabilitados.
    - La transacción 2 registra ENVIADO y el identificador del proveedor si guarda la respuesta exitosa dentro del plazo; en caso de rechazo, error o tiempo de espera registra NO_ENVIADO con motivo y resuelto_en. Cierra las filas en_proceso en esa misma transacción. Motivos: RECHAZO_PROVEEDOR, TIEMPO_ESPERA, ERROR_COMUNICACION, ERROR_REGISTRO o INTERRUPCION_PROCESO.
    - Cada transición exige que el intento siga EN_PROCESO y su plazo sea vigente; el cierre por vencimiento es condicional y atómico. Un resultado tardío no cambia un intento ya cerrado. Si cae el proceso o falla la escritura del resultado, las lecturas proyectan NO_ENVIADO tras vencer el plazo sin éxito registrado; la siguiente transacción de envío persiste el cierre y libera el índice antes de permitir otro intento. La vista previa y los GET no escriben ni llaman al proveedor para recuperar intentos.
    - Un nuevo intento es siempre manual, tiene otra clave y utiliza datos y destinatarios vigentes. No hay endpoint de verificación, espera de 24 horas, advertencia adicional ni seguimiento de entrega. Un tiempo de espera puede corresponder a una solicitud recibida por el proveedor; se acepta la posibilidad de repetición al intentar otra vez (RN-067).
- **Alternativas:** bloqueo distribuido o cola de mensajes, descartados por agregar infraestructura. Deduplicar solo en la SPA, prohibido por RN-157.
- **Consecuencias:**
  - Garantía en la base de datos, comprobable con tests concurrentes.
  - No queda ningún correo aceptado sin su intento en la bandeja.
  - Una caída entre la llamada a Resend y la transacción 2 conserva el intento histórico; al vencer su plazo sin éxito registrado se trata como NO_ENVIADO, sin bloqueo indefinido ni verificación por el usuario (RN-067, RN-158).

### ADR-007: API interna separada para procedimientos del equipo de VenceYa

- **Contexto:** HU-001 es un procedimiento interno, y no debe existir ningún endpoint de autoalta para los roles de empresa (O15). La terminación y la baja contractual (RN-152) no pasan por esta API: son un procedimiento operativo manual fuera del alcance (pregunta 52).
- **Decisión:** un punto de entrada aparte, `apps/api-interna`, que monta solo `/api/v1/interno/*`. Se publica únicamente en la red privada (red privada de Railway o localhost del servidor local), se autentica con tokens personales de operaciones guardados como hash y usa el rol de base de datos `venceya_operaciones`. Cada acción se audita con el operador que la ejecutó.
- **Alternativas:** un rol `SUPERADMIN` dentro de la API pública, descartado porque amplía la superficie de ataque y mezcla permisos internos con roles de empresa. Scripts de línea de comandos sin API, viables pero sin un contrato verificable ni una auditoría uniforme; es la vía elegida para la baja contractual, como procedimiento operativo fuera del proyecto.
- **Consecuencias:** las rutas internas nunca están expuestas en la API pública, lo que se verifica con un test. Hay que operar un segundo proceso, que en la nube puede dormir sin uso.

### ADR-008: Panel en una sola respuesta con un corte coherente

- **Contexto:** RN-205 y RN-206 exigen que los indicadores, el gráfico y el listado de un mismo panel correspondan a un único corte con la leyenda «Datos al…». Con varias peticiones separadas, cada una tendría su propio corte.
- **Decisión:** `GET /panel` devuelve indicadores, proyección y el listado completo de movimientos, leídos en una transacción `REPEATABLE READ READ ONLY` cuyo inicio define el `corte`. La lista de cuotas por avisar sigue el mismo patrón. El tiempo promedio de cobro tiene su propio corte, porque es una tarjeta independiente del selector de moneda.
- **Alternativas:** endpoints separados con un parámetro `corte` y lectura histórica, descartados porque las ediciones de comprobantes sin pagos no permiten reconstruir un instante pasado de forma fiable. Endpoints separados sin corte común, que violan RN-206.
- **Consecuencias:** el listado no se pagina; con el volumen previsto (unas 1,000 cuotas al año por empresa) la respuesta es pequeña. Si una empresa superara unas 5,000 cuotas abiertas, se evaluaría paginar el listado con un *snapshot* exportado (`pg_export_snapshot`). La SPA filtra y ordena en el cliente.

### ADR-009: Aislamiento por empresa en dos capas (repositorio y RLS)

- **Contexto:** PRINCIPIO-003 exige que toda consulta filtre por empresa y que haya tests automatizados que intenten acceder a otra empresa.
- **Decisión:**
  - **Capa 1:** un `RepositorioEmpresa` base añade `empresa_id` a toda consulta y toda inserción.
  - **Capa 2:** RLS de PostgreSQL. Al iniciar cada transacción se ejecuta `SET LOCAL app.empresa_id`, y las políticas filtran todas las tablas de negocio, incluidas `usuarios`, `sesiones` y `enlaces_acceso`. Sin ese valor, las consultas no devuelven filas.
  - **Antes de la autenticación (C-01):** la empresa se descubre solo con las funciones `SECURITY DEFINER` `resolver_sesion`, `buscar_usuario_por_correo` y `resolver_enlace` (§3.3), que devuelven el `empresa_id` para el `SET LOCAL`. `sesiones` y `enlaces_acceso` llevan `empresa_id` para que sus escrituras posteriores también pasen por RLS.
- **Alternativas:** solo el filtro en el código, frágil ante un olvido. Dejar `usuarios`, `sesiones` y `enlaces_acceso` fuera de RLS, descartado por ser una excepción a PRINCIPIO-003. Un segundo rol con `BYPASSRLS` y su propio pool para la autenticación, descartado por dar acceso amplio, más superficie que tres funciones auditables. Un esquema o una base de datos por empresa, que complica migraciones, respaldos y la baja, y es desproporcionado para el volumen.
- **Consecuencias:** un error en el código no expone datos de otra empresa. Existe una suite `aislamiento.e2e` que recorre todos los endpoints con identificadores de otra empresa y exige `404`. Hay que cuidar que el pool de conexiones no conserve la variable entre transacciones; `SET LOCAL` lo garantiza.

---

## 6. Restricciones técnicas

### 6.1 Alineación con la constitución

| Principio | Restricción técnica | Verificación |
|---|---|---|
| PRINCIPIO-001 Español | Identificadores, rutas, campos, `operationId`, códigos de error, comentarios y commits en español; la única excepción son las palabras reservadas y las API de terceros. | Regla de ESLint de nombres sobre `packages/dominio` y `apps/*/src/modulos`; revisión de pull requests. |
| PRINCIPIO-002 Stack | Node.js 22 LTS, NestJS 10, PostgreSQL 16, React 18 con shadcn/ui. Nube: Neon (`us-east-1`) y Railway (US East). Local: los tres componentes en el servidor del cliente. No se usa otro motor de base de datos, framework de frontend ni almacén como Redis o una cola. | Revisión de `package.json` y de la configuración de conexión en cada merge. |
| PRINCIPIO-003 Aislamiento | Empresa tomada de la sesión, repositorio con filtro y RLS (ADR-009); `404` para recursos de otra empresa. | Suite e2e de aislamiento en CI. |
| PRINCIPIO-004 Protección de datos y secretos | Sin cifrado por campo (ADR-003); Argon2id para contraseñas, SHA-256 para tokens, secretos fuera de la base y del repositorio, separados por ambiente, TLS 1.2 o superior (HSTS en la SPA y la API; `sslmode=require` hacia Neon). | Pruebas de hash de contraseñas y tokens, de unicidad por ámbito y concurrencia, y escáner de secretos en CI. T-041 verifica separación y conexión cifrada; T-042 y T-043 comprueban rechazo de TLS 1.0/1.1, conexión admitida y HSTS en ambos ambientes. |
| PRINCIPIO-005 Datos personales y trazabilidad | Logger con lista blanca de campos (eventos, identificadores, códigos); registros de interacción lógica en `registros_acceso`, conservados dos años; los errores no repiten la entrada; fixtures con datos ficticios `@example.com`; nunca se envían datos reales a prompts de IA. | Test que inspecciona los logs de la suite e2e en busca de correos y nombres de los fixtures; revisión de fixtures en el pull request. Suite `trazabilidad.e2e`: cada operación con datos personales genera su fila en `registros_acceso`, sin datos personales, y un fallo de escritura impide la operación. |
| PRINCIPIO-006 Inmutabilidad | Tres capas (ADR-004); las anulaciones son entidades separadas; solo la baja contractual elimina datos, y siempre todos los de la empresa. | Tests de integración de UPDATE y DELETE rechazados; test de la baja con dos empresas. |
| PRINCIPIO-007 Cálculos | Funciones puras en `packages/dominio` con `fechaCalculo` como parámetro; regla de lint que prohíbe `Date.now()` y `new Date()` sin argumentos en el dominio; `decimal.js`. | Jest con umbral de cobertura del 80 % en `packages/dominio` (CI falla por debajo); suite de pruebas automáticas de referencia con entradas y resultados esperados trazables a las reglas de negocio, sin aprobación humana específica de los casos (E-014). |
| PRINCIPIO-008 Indicador | El futuro indicador S3 se calculará solo con el histórico interno, sin clientes HTTP hacia fuentes externas en el dominio. | Test de recálculo desde un histórico de referencia (al entregar S3). |
| PRINCIPIO-009 Canales | Único canal de salida: Resend (correo) más la bandeja interna (`intentos_aviso`). Sin SDK de SMS ni de mensajería. | Revisión de dependencias; lista de dependencias prohibidas en CI. |
| PRINCIPIO-010 Accesibilidad | Componentes de shadcn/ui (Radix) accesibles, foco visible, contraste ≥ 4.5:1, diseño responsive y tabla equivalente para cada gráfico. | axe-core con Playwright en CI y revisión manual con teclado en cada pantalla nueva. |
| PRINCIPIO-011 Límites de la IA | `CORREO_MODO=PRUEBA` fuera de producción: todo se redirige al buzón de prueba (RN-013). Producción requiere aprobación humana del environment de GitHub antes de acceder a las credenciales de despliegue; se deshabilita el despliegue automático directo desde Railway y las identidades de automatización no pueden eludir el control. La aprobación de merge es independiente. Sin pasarelas de pago. | gitleaks en CI; T-041 verifica que el job espera aprobación sin desplegar; T-043 exige aprobación y evidencia del artefacto promovido. Si la cuenta o plan no admite la protección, no se habilita producción. Se mantienen los pendientes previos al lanzamiento (26 y 31), correo (39) y dominio web (53). |
| PRINCIPIO-012 Revisión humana | Rama `main` protegida: cambios por PR, una aprobación humana obligatoria y checks de CI requeridos, sin bypass por identidades de automatización. | T-002 configura y verifica la regla en GitHub: push directo y merge sin aprobación o con checks fallidos bloqueados. La documentación en README es evidencia, no reemplaza la configuración. |

### 6.2 Restricciones de implementación

- **Contrato primero:** `07-openapi.yaml` es la fuente oficial. En CI, `postman spec lint` valida el YAML y un test compara las rutas registradas en NestJS con las operaciones del YAML; cualquier diferencia hace fallar el build.
- **Validación en el servidor:** la interfaz puede adelantar validaciones, pero cada regla (RN-162, contraseñas, importes, fechas) se comprueba en la API. `ValidationPipe` usa `errorHttpStatusCode: 422`, `whitelist` y `forbidNonWhitelisted`.
- **Fecha de cálculo:** se obtiene una sola vez por petición, a partir del corte en America/Lima, y se pasa explícitamente al dominio. Las sesiones y los enlaces usan el reloj del servidor (RN-149, RN-098), que no es un cálculo financiero.
- **Transacciones:** cada caso de uso que escribe se ejecuta en una sola transacción, con los niveles de aislamiento y los bloqueos indicados en ADR-006. Los efectos externos (correo) van siempre fuera de la transacción de negocio y con su propio registro.
- **Funcionalidades Should:** S1 (HU-011) y S5 (HU-012) se activan con las banderas `FUNCIONALIDAD_S1` y `FUNCIONALIDAD_S5`. Mientras estén apagadas, sus rutas responden `404` y la interfaz no muestra sus opciones. HU-017 comparte disponibilidad S1 o S4 (§3.1.1), con `FUNCIONALIDAD_S4` apagada y reservada para su entrega futura. No liberar S1 hasta completar T-034/T-035 (incluida visibilidad de promesas RN-036) y T-038/T-039 (historial RN-078); completar solo T-034/T-035 no acepta S1. Sus cálculos quedan sujetos a PRINCIPIO-007 desde que se implementan (E-012).
- **Rendimiento esperado:** p95 por debajo de 500 ms para el panel con 5,000 cuotas, y por debajo de 300 ms para las mutaciones (salvo el envío de avisos, que depende de Resend; tiempo de espera de 10 s).
- **Observabilidad:** logs JSON con `idSolicitud`, `evento`, `empresa_id`, identificadores internos y `codigo`; métricas de errores 5xx y de intentos NO_ENVIADO por motivo, incluidos los tiempos de espera.

### 6.3 Pendientes y extensiones previstas

| Tema | Estado | Impacto en la arquitectura |
|---|---|---|
| Solicitudes formales de eliminación de datos personales (RN-151, RN-257; M-11) | Gestión interna del equipo de VenceYa en coordinación con la empresa cliente (decisión del usuario, 2026-11-10) | Fuera del alcance funcional y del backlog de desarrollo: no incorpora HU, pantalla, endpoint ni componente. La definición operativa y revisión legal siguen pendientes antes del lanzamiento en la pregunta 31; no son dependencias de desarrollo. No altera el mantenimiento de contactos ni autoriza borrar registros económicos. Una automatización posterior sería un requerimiento nuevo. |
| Historial de ediciones de un contacto eliminado (pregunta 51, QA-13) | Resuelta el 2026-11-10 (opción B) | `DELETE /contactos/{id}` elimina el registro, lo que libera su correo, y conserva sin cambios las filas de `historial_ediciones` del contacto. No hay clave foránea desde el historial; el contacto nuevo que reutiliza el correo tiene otro `entidad_id` y no hereda el historial. Las copias históricas se retiran solo por el procedimiento interno de RN-151. |
| Reglas de formato del teléfono del contacto | Propuesta de esta arquitectura (de 1 a 30 caracteres: dígitos, espacios y `+ - ( )`) | Debe confirmarse en `03-reglas-de-negocio.md`; si cambia, se ajusta la validación y la descripción del YAML. |
| Dominio remitente de Resend (pregunta 39) | Pendiente | Se configura en el adaptador de correo. |
| Dominios web de pruebas y producción (pregunta 53; M-07) | Topología decidida; nombres y DNS pendientes | Un mismo origen HTTPS por ambiente, SPA en `/` y API en `/api`; API interna privada. T-042 y T-043 requieren resolver el dominio de su ambiente. No depende del dominio remitente de correo de la pregunta 39. |
| Operación de la modalidad local (preguntas 41 y 42) | Pendiente | Custodia de secretos, respaldos semanales verificados y actualizaciones; el código no cambia. |
| HU-013 a HU-016 (S3 y S4) | Sugeridas, sin aprobación | Encajarán en los módulos Contactos (indicador), Panel (reporte) y en un módulo nuevo de Exportaciones (CSV y Excel). Se agregarán al YAML cuando el PO las apruebe. |
| HU-017 (historial S1/S4) | Aprobada por el usuario el 2026-11-10 (M-06) | Consulta 49 coordinada por C15/C7/C12 y vista C1; tareas T-038/T-039. Se entrega con S1 o S4, la que llegue primero, y se reutiliza con la otra, sin esperar reporte ni exportaciones. |
| HU-018 (baja contractual) | No se desarrolla (pregunta 52, resuelta el 2026-11-10) | El bloqueo desde la terminación efectiva está en el MVP (ADR-002, HU-002, HU-010). Fijar `empresas.terminacion_efectiva_en`, limpiar los datos y llevar el registro externo de bajas es un procedimiento operativo manual con un script propio del equipo, fuera del backlog y de la API interna. Nota para ese script: los triggers de inmutabilidad de `pagos`, `anulaciones_pago` y `anulaciones_comprobante` impiden el `DELETE`, así que debe ejecutarse con el rol dueño de la base y desactivarlos dentro de su transacción. |
