# 07 - Arquitectura de VenceYa

**Fase BMAD:** solución, a cargo del agente Architect.
**Fecha:** 2026-11-09.
**País de operación:** Perú. **Zona horaria de negocio:** America/Lima.
**Fuentes:** `00-constitucion.md` (PRINCIPIO-001 a PRINCIPIO-012, enmiendas E-001 a E-013), `06-user-stories.md` (HU-001 a HU-012), `02-alcance.md`, `01-project-brief.md`, `03-reglas-de-negocio.md` y `otros/06-diseno-seguridad-datos.md`.
**Contratos REST:** [07-openapi.yaml](./07-openapi.yaml) (OpenAPI 3.1, fuente oficial).

**Alcance de este documento.** Cubre las 12 HUs priorizadas: 10 Must del MVP (HU-001 a HU-010) y 2 Should (HU-011 y HU-012), que se entregan después del MVP. Las HUs sugeridas por QA (HU-013 a HU-018) todavía no tienen la aprobación del PO, así que no tienen endpoints. La sección 6.3 indica dónde encajarán.

---

## 1. Overview del sistema

### 1.1 Descripción

VenceYa es una aplicación web multiempresa con la que las pymes peruanas controlan los vencimientos de sus cuentas por cobrar y por pagar, en soles y en dólares. Una SPA en React con shadcn/ui consume una API REST en NestJS. La API está organizada como un monolito modular y persiste en PostgreSQL. Todos los cálculos financieros (saldos, estados, atraso, proyección y tiempo promedio de cobro) viven en un núcleo de dominio de funciones puras, que reciben la fecha de cálculo como parámetro. Los datos sensibles se cifran en la aplicación con AES-256-GCM antes de llegar a la base de datos, y cada consulta queda acotada a la empresa del usuario autenticado. El único servicio externo es Resend, que envía por correo los avisos de vencimiento, las invitaciones y las recuperaciones de contraseña.

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
│  │ Núcleo de     │ │ Servicio        │ │ Auditoría e      │ │ Adaptador correo  │────┼──► Resend (us-east-1)
│  │ dominio puro  │ │ criptográfico   │ │ historiales      │ │ (idempotencia,    │    │    o buzón de prueba
│  │ (cálculos)    │ │ AES-GCM · HMAC  │ │                  │ │ redirección test) │    │
│  └───────────────┘ │ · Argon2id      │ └──────────────────┘ └───────────────────┘    │
│                    └───────┬─────────┘                                               │
│                            │ claves por propósito y versión                          │
│                            ▼                                                         │
│                  Custodia de claves (variables de Railway / servidor local)          │
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

### 1.3 Principios de diseño

1. **Empresa desde la sesión, nunca desde la petición.** Ningún endpoint de negocio recibe el `empresaId`. Lo toma de la sesión y lo aplica dos veces: en los repositorios y en la base de datos mediante RLS. Un recurso de otra empresa responde `404` (PRINCIPIO-003, RN-008).
2. **Dominio puro y determinista.** Los estados y saldos no se guardan: se derivan de los hechos registrados mediante funciones puras que reciben la fecha de cálculo (PRINCIPIO-007, RN-198).
3. **Hechos inmutables y correcciones como hechos nuevos.** Un pago nunca se modifica. Su anulación es un registro aparte, y la base de datos rechaza cualquier UPDATE o DELETE sobre un pago (PRINCIPIO-006).
4. **Cifrado en la aplicación, por campo.** Correos, teléfono, dirección y RUC se cifran con AES-256-GCM. Las búsquedas exactas usan referencias HMAC con ámbito (PRINCIPIO-004).
5. **Todo o nada.** Cada operación es una transacción. Las condiciones se evalúan con el estado vigente al guardar, y la concurrencia se resuelve con bloqueos de fila, versiones optimistas e índices únicos (RN-160).
6. **Idempotencia en el servidor.** El doble clic se evita en la interfaz, pero la garantía real la da el backend (RN-156 a RN-159).
7. **Privacidad por defecto en la observabilidad.** Los logs y los errores solo llevan eventos, identificadores internos y códigos (PRINCIPIO-005).
8. **Simplicidad proporcional al volumen.** El volumen previsto es de unas 80 operaciones al mes por empresa (supuesto S7). Por eso se descartan colas, microservicios y cachés distribuidas mientras no exista evidencia de que hagan falta.

---

## 2. Componentes principales

| # | Componente | Responsabilidad | Tecnología | HUs |
|---|---|---|---|---|
| C1 | **SPA web** | Pantallas de todas las HUs para los tres roles. Formato peruano de importes y fechas; leyenda «Datos al DD/MM/AAAA, HH:mm». Deshabilita los botones mientras una solicitud está en curso y genera la `Clave-Idempotencia` de cada pago. Muestra los gráficos junto con su tabla accesible equivalente. | React 18, TypeScript, Vite, shadcn/ui (Radix + Tailwind), TanStack Query, React Hook Form + Zod, Recharts (gráficos de shadcn) | HU-002 a HU-012 |
| C2 | **Capa transversal de la API** | Valida la sesión y el CSRF, autoriza por rol según la matriz RN-060, fija el contexto de empresa (`SET LOCAL app.empresa_id`), normaliza y valida los campos (RN-162), traduce las excepciones al formato de error único, añade el `idSolicitud` y escribe logs estructurados sin datos personales. | NestJS 10 (guards, pipes, interceptors, exception filters), class-validator, pino | Todas |
| C3 | **Módulo Autenticación y sesiones** | Inicio y cierre de sesión, activación por invitación, recuperación de contraseña, bloqueo tras 5 fallos (RN-103), sesiones con 30 minutos de inactividad y 12 horas absolutas (RN-149), cierre de sesiones al cambiar el rol, desactivar al usuario o recuperar la contraseña. | NestJS, argon2 (Argon2id), tabla `sesiones` en PostgreSQL | HU-002 |
| C4 | **Módulo Operaciones internas** | Alta atómica de una empresa con su primer administrador y reenvío de la invitación de ese administrador. Se despliega como una aplicación NestJS aparte, publicada solo en la red privada. | NestJS (misma base de código, punto de entrada propio), token de operaciones | HU-001 |
| C5 | **Módulo Usuarios y configuración de empresa** | Invitación, cambio de rol, desactivación y reactivación de usuarios, con la protección del último administrador. Correo administrativo, moneda por defecto, listas de copias y preferencias personales. | NestJS, TypeORM | HU-003, HU-008, HU-009 |
| C6 | **Módulo Contactos** | Catálogo de contactos con correo único por empresa (HMAC con ámbito de empresa), historial de ediciones por campo, eliminación solo de contactos sin comprobantes. | NestJS, TypeORM | HU-004 |
| C7 | **Módulo Comprobantes y cuotas** | Propuesta de cuotas, registro y edición con historial por campo, unicidad del número de documento entre comprobantes no anulados, anulación de comprobantes. | NestJS, TypeORM, núcleo de dominio | HU-005, HU-007 |
| C8 | **Módulo Pagos y anulaciones** | Registro idempotente de pagos con bloqueo de la cuota, validación de saldo y orden cronológico, y anulación de pagos como entidad separada. | NestJS, TypeORM, núcleo de dominio | HU-006, HU-007 |
| C9 | **Módulo Reprogramaciones** (Should) | Promesas de pago con un máximo de una ACTIVA por cuota; la fecha efectiva de vencimiento sale de la promesa (RN-071). Se activa con la bandera `FUNCIONALIDAD_S1`. | NestJS, TypeORM, núcleo de dominio | HU-011 |
| C10 | **Módulo Panel** | Lectura coherente en un solo corte (RN-205, RN-206): indicadores, proyección, movimientos y tiempo promedio de cobro (este último con la bandera `FUNCIONALIDAD_S5`). | NestJS, transacción `REPEATABLE READ READ ONLY`, núcleo de dominio | HU-008, HU-012 |
| C11 | **Módulo Avisos** | Cuotas por avisar, vista previa con firma de destinatarios, intentos persistidos antes de llamar a Resend, verificación con la misma clave de idempotencia y bandeja interna. | NestJS, TypeORM, adaptador de correo | HU-010 |
| C12 | **Núcleo de dominio puro** | Funciones puras sin E/S y sin reloj, entre ellas `calcularSaldoCuota`, `calcularEstadoCuota`, `calcularDiasAtraso`, `calcularFechaEfectiva`, `proponerCuotas`, `calcularProyeccion`, `calcularIndicadoresCartera`, `clasificarTipoAviso`, `clasificarPromesa` y `calcularTiempoPromedioCobro`. Aritmética decimal exacta en céntimos. | TypeScript puro (paquete `dominio`), decimal.js, Jest con casos de referencia y cobertura ≥ 80 % | HU-005, HU-006, HU-007, HU-008, HU-010, HU-011, HU-012 |
| C13 | **Servicio criptográfico** | Cifrado AES-256-GCM por campo (IV aleatorio de 96 bits, AAD con ambiente, entidad, id, campo y empresa), referencias HMAC-SHA-256 por propósito, hash Argon2id, contador de usos por versión de clave y rotación (RN-139 a RN-143, RN-216 a RN-242). | `node:crypto`, argon2 | HU-001 a HU-004, HU-009, HU-010 |
| C14 | **Adaptador de correo** | Envío por Resend con clave de idempotencia por intento y plantillas fijas por tipo de aviso. En entornos de prueba redirige todo al buzón de prueba (RN-013, PRINCIPIO-011). | SDK de Resend, plantillas React Email | HU-001, HU-002, HU-003, HU-010 |
| C15 | **Auditoría e historiales** | Eventos de auditoría (roles, listas de copias, invitaciones, configuración) e historial de ediciones por campo, escritos en la misma transacción que el cambio. Las copias de campos cifrados se guardan cifradas. | NestJS, PostgreSQL | HU-001, HU-003, HU-004, HU-005, HU-007, HU-009 |
| C16 | **Base de datos** | Persistencia, RLS por `empresa_id`, índices únicos parciales y triggers de inmutabilidad. Migraciones SQL versionadas. | PostgreSQL 16 (Neon o local), migraciones TypeORM | Todas |

**Organización del código (monorepo):** `apps/web` (C1), `apps/api` (C2, C3, C5 a C11, C13 a C15), `apps/api-interna` (C4, que reutiliza los módulos de `apps/api`), `packages/dominio` (C12) y `packages/contratos` (tipos generados desde `07-openapi.yaml`).

---

## 3. Modelo de datos

### 3.1 Entidades y atributos clave

Convenciones: los identificadores son `bigint`; las tablas de negocio llevan `empresa_id`; los importes son `numeric(14,2)` y nunca `float`; las fechas de negocio son `date` y los instantes `timestamptz`. Los campos `*_cifrado` son `bytea` con el formato `{versión de formato, id de clave, IV, texto cifrado, etiqueta}`, y los campos `*_ref` son `bytea` con la referencia HMAC y su versión de clave.

| Entidad | Atributos clave | Notas |
|---|---|---|
| `empresas` | `id`, `razon_social`, `ruc_cifrado`, `ruc_ref` (único global), `correo_administrativo_cifrado`, `moneda_por_defecto` (`PEN`/`USD`), `estado_contrato` (`VIGENTE`/`TERMINADO`), `terminacion_efectiva_en`, `creada_en`, `version` | La terminación contractual es un procedimiento interno (HU-018, sugerida). |
| `usuarios` | `id`, `empresa_id`, `correo_cifrado`, `correo_ref` (único global), `rol`, `estado` (`INVITADO`/`ACTIVO`/`DESACTIVADO`), `hash_contrasena` (Argon2id, nulo hasta la activación), `fallos_consecutivos`, `bloqueado_hasta`, `moneda_preferida`, `ventana_proyeccion_dias`, `version` | Sin DELETE desde la aplicación. |
| `enlaces_acceso` | `id`, `usuario_id`, `tipo` (`INVITACION`/`RECUPERACION`), `token_hash` (SHA-256), `emitido_en`, `vence_en`, `usado_en`, `revocado_en` | Índice único parcial: un enlace vigente por usuario y tipo (RN-259). El token en claro solo viaja en el correo. |
| `sesiones` | `id`, `usuario_id`, `token_hash`, `token_csrf_hash`, `iniciada_en`, `ultima_actividad_en`, `cerrada_en`, `motivo_cierre` | Vigente si `cerrada_en` es nulo, han pasado menos de 30 minutos desde `ultima_actividad_en` y menos de 12 horas desde `iniciada_en`. |
| `contactos` | `id`, `empresa_id`, `nombre`, `correo_cifrado`, `correo_ref` (único por `empresa_id`), `telefono_cifrado`, `direccion_cifrada`, `estado`, `version` | El `nombre` va en claro para permitir la búsqueda parcial (ver 3.3). |
| `comprobantes` | `id`, `empresa_id`, `contacto_id`, `sentido` (`POR_COBRAR`/`POR_PAGAR`), `numero_documento`, `moneda`, `total`, `fecha_emision`, `modalidad`, `anulado` (bool), `tuvo_pagos` (bool), `tuvo_reprogramaciones` (bool), `creado_por`, `creado_en`, `version` | `anulado`, `tuvo_pagos` y `tuvo_reprogramaciones` son marcas monótonas: solo pasan de falso a verdadero, en la misma transacción que el hecho que las provoca. |
| `anulaciones_comprobante` | `id`, `empresa_id`, `comprobante_id` (único), `motivo`, `usuario_id`, `anulado_en` | Fuente de verdad de la anulación. No admite UPDATE ni DELETE. |
| `cuotas` | `id`, `empresa_id`, `comprobante_id`, `numero`, `importe`, `vencimiento_original`, `version` | Estado, saldo y fecha efectiva se derivan; no se guardan. |
| `pagos` | `id`, `empresa_id`, `cuota_id`, `importe`, `moneda`, `fecha_pago`, `clave_idempotencia` (uuid), `huella_solicitud`, `registrado_por`, `creado_en` | Único (`empresa_id`, `clave_idempotencia`). Un trigger rechaza UPDATE y DELETE. |
| `anulaciones_pago` | `id`, `empresa_id`, `pago_id` (único), `motivo`, `usuario_id`, `anulado_en` | El índice único sobre `pago_id` garantiza una sola anulación por pago. |
| `promesas_pago` (S1) | `id`, `empresa_id`, `cuota_id`, `fecha_prometida`, `reemplazada_en`, `registrada_por`, `registrada_en` | Índice único parcial: una sola promesa no reemplazada por cuota. CUMPLIDA e INCUMPLIDA se derivan. |
| `historial_ediciones` | `id`, `empresa_id`, `entidad`, `entidad_id`, `campo`, `valor_anterior` / `valor_anterior_cifrado`, `valor_nuevo` / `valor_nuevo_cifrado`, `usuario_id`, `editado_en` | Los campos sensibles se guardan solo en la columna cifrada. |
| `auditoria_eventos` | `id`, `empresa_id`, `tipo_evento`, `actor_usuario_id` u `actor_operativo`, `afectado_id`, `datos` (jsonb, sin secretos ni enlaces), `datos_cifrados`, `ocurrido_en` | Ejemplos de eventos: `ROL_CAMBIADO`, `COPIA_AGREGADA`, `INVITACION_ENVIADA` o `INVITACION_FALLIDA`. |
| `listas_copias` | `empresa_id`, `sentido`, `usuario_id`, `agregado_por`, `agregado_en` | Clave primaria (`empresa_id`, `sentido`, `usuario_id`). Recibe copias si el usuario está ACTIVO y no es OPERADOR. |
| `intentos_aviso` | `id`, `empresa_id`, `contacto_id`, `tipo_aviso`, `estado`, `clave_idempotencia_proveedor`, `asunto`, `cuerpo_cifrado`, `comentario`, `id_mensaje_proveedor`, `creado_por`, `creado_en`, `resuelto_en` | Se guarda antes de llamar a Resend (RN-158). |
| `destinatarios_aviso` | `intento_id`, `tipo` (`PARA`/`COPIA`/`RESPONDER_A`), `correo_cifrado` | Copia histórica cifrada (PRINCIPIO-004). |
| `cuotas_aviso` | `intento_id`, `cuota_id`, `fecha_efectiva`, `saldo_al_envio`, `sin_confirmar` (bool) | Índice único parcial (`cuota_id`, `tipo_aviso`, `fecha_efectiva`) donde `sin_confirmar` es verdadero; impide dos intentos sin confirmar a la vez (RN-158). |
| `claves_uso` | `proposito`, `version`, `operaciones_cifrado` | Contador para rotar antes de llegar a 2³² cifrados. Las claves en sí nunca están en la base. |

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

- **Cifrado (PRINCIPIO-004):** se cifran `contactos.correo`, `contactos.telefono`, `contactos.direccion`, `empresas.ruc`, `empresas.correo_administrativo` y `usuarios.correo`, junto con sus copias en `historial_ediciones`, `auditoria_eventos.datos_cifrados`, `destinatarios_aviso` y `intentos_aviso.cuerpo_cifrado`.
  - El AAD vincula ambiente, entidad, id, campo y empresa; un descifrado con otro contexto falla.
  - Las búsquedas exactas usan solo `*_ref`. Nunca se guarda una copia en texto plano normalizada.
- **Nombres y razón social:** no están en la lista cerrada de PRINCIPIO-004, así que van en claro para permitir la búsqueda parcial y el orden. Siguen protegidos por PRINCIPIO-005: nunca aparecen en logs ni en errores.
- **Contraseñas:** Argon2id con un mínimo de 19 MiB, 2 iteraciones y paralelismo 1, y sal individual. No se normalizan.
- **Tokens:** los de sesión, invitación y recuperación son aleatorios de 256 bits, y en la base solo se guarda su SHA-256.
- **RLS:** las tablas de negocio tienen la política `empresa_id = current_setting('app.empresa_id')::bigint`. El rol `venceya_app` no tiene `BYPASSRLS`. La API interna usa el rol `venceya_operaciones`, con permisos solo sobre el alta de empresas y usuarios.
- **Inmutabilidad (PRINCIPIO-006):**
  - Hay triggers `BEFORE UPDATE OR DELETE` sobre `pagos`, `anulaciones_pago` y `anulaciones_comprobante`.
  - Además, `venceya_app` no tiene privilegios `UPDATE` ni `DELETE` sobre esas tablas.
  - La baja contractual (RN-152) la ejecuta un procedimiento interno con un rol separado, que elimina todos los datos de la empresa juntos.
- **Retención:** mientras el contrato esté vigente no se elimina ningún comprobante, cuota, pago, anulación, usuario ni historial. La única excepción es un contacto sin comprobantes (RN-130). Qué pasa con su historial de ediciones sigue pendiente (pregunta 51, QA-13).

---

## 4. API Contracts

La especificación completa (schemas, parámetros, cuerpos, respuestas y ejemplos) está en **[07-openapi.yaml](./07-openapi.yaml)**, la fuente oficial de los contratos. Este documento no repite schemas. El archivo tiene exactamente las mismas 49 operaciones que el inventario de 4.2. La sintaxis se validó con la Postman CLI 1.75.0 (`postman spec lint --issueType=syntax`, sin errores) y el archivo se importa en Postman (colección generada por tags) y en Swagger UI.

### 4.1 Convenciones generales

| Tema | Convención |
|---|---|
| Prefijo y versión | `https://{host}/api/v1`. Un cambio incompatible crea `/api/v2`; los cambios compatibles (campos nuevos opcionales) no cambian la versión. |
| Autenticación | Sesión opaca en servidor, en la cookie `venceya_sesion` (`HttpOnly; Secure; SameSite=Strict; Path=/api`). Toda operación distinta de GET exige la cabecera `X-Token-CSRF`. Plazos: 30 minutos de inactividad y 12 horas absolutas (RN-149). Los sondeos envían `X-Peticion-Automatica: true` y no renuevan la inactividad. La API interna usa `Authorization: Bearer <token de operaciones>`. |
| Autorización | Matriz RN-060, comprobada en el servidor en cada operación. La extensión `x-roles` de cada operación del YAML lista los roles autorizados. La empresa nunca se recibe del cliente. |
| Formato de error único | `{ codigo, mensaje, detalles[{campo, codigo, mensaje}], idSolicitud }`. El mensaje está en español y nunca incluye valores ingresados, datos personales ni importes (PRINCIPIO-005). |
| Códigos HTTP | `400`: JSON mal formado o parámetros de ruta o de consulta inválidos. `401`: sin sesión vigente o credenciales inválidas. `403`: rol sin permiso o CSRF inválido. `404`: recurso inexistente o de otra empresa. `409`: conflicto con el estado vigente. `422`: el cuerpo incumple reglas de contenido o de negocio. `500`: falla técnica sin efectos. |
| Concurrencia | Los recursos editables exponen `version` y las mutaciones la reciben; si no coincide, `409 DATOS_DESACTUALIZADOS` (RN-160). Pagos y reprogramaciones reciben `versionCuota`. |
| Idempotencia | Los pagos exigen la cabecera `Clave-Idempotencia` (UUID). Una repetición idéntica responde `200` con el pago original; la misma clave con otros datos, `409` (RN-156). Los avisos usan intentos persistidos y una clave por intento hacia Resend (RN-158, RN-159). |
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
| `SIN_CUOTAS_APTAS`, `INTENTO_SIN_CONFIRMAR`, `DESTINATARIOS_CAMBIARON`, `REENVIO_REQUIERE_CONFIRMACION` | Avisos. |
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
| 49 | POST | `/avisos/intentos/{intentoId}/verificacion` | Verificar un envío sin confirmar | HU-010 | ADM, SUP, OPE |

**Cobertura:** las 12 HUs tienen al menos un endpoint. Los endpoints 40, 41 y 43 pertenecen a funcionalidades Should: mientras sus banderas estén apagadas, responden `404`.

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
- **Consecuencias:** revocación exacta y verificable, y cumplimiento directo de RN-149. Cada petición consulta la tabla `sesiones`, lo que es aceptable para el volumen. SPA y API deben compartir el sitio (mismo dominio registrable) para que `SameSite=Strict` funcione.

### ADR-003: Cifrado por campo en la aplicación con referencias HMAC

- **Contexto:** PRINCIPIO-004 y E-005 exigen AES-256-GCM para campos concretos y sus copias, comparaciones exactas sin texto plano y claves fuera de la base, separadas por propósito y ambiente, con rotación.
- **Decisión:** el servicio criptográfico (C13) cifra con `node:crypto` (`aes-256-gcm`, IV aleatorio de 96 bits, AAD de contexto) y calcula `HMAC-SHA-256` sobre la tupla (versión, ambiente, propósito, ámbito, valor normalizado) con claves distintas. Las claves se cargan desde variables de entorno (Railway o el servidor local) y se identifican por versión.
- **Alternativas:** `pgcrypto`, descartado porque las claves viajarían en las consultas SQL y quedarían en los logs de PostgreSQL. Cifrado del disco (TDE o el de Neon) como única medida, descartado porque no protege frente a un acceso con credenciales de la base ni cumple el principio por campo. Cifrado determinista para buscar, prohibido por el diseño de seguridad.
- **Consecuencias:** no hay búsqueda parcial por correo, teléfono ni dirección; la búsqueda de contactos es por nombre. Rotar una clave exige recifrar en segundo plano y conservar las versiones anteriores para leer respaldos. Hay un costo leve de CPU, irrelevante para el volumen.

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

- **Contexto:** RN-156 exige que un doble clic, un reintento o una petición concurrente creen como máximo un pago. RN-158 y RN-159 exigen guardar el intento antes de llamar a Resend, impedir envíos simultáneos de las mismas cuotas y verificar un resultado sin confirmar sin duplicar el correo.
- **Decisión:**
  - **Pagos:**
    - La SPA genera la `Clave-Idempotencia` (UUID) al abrir el formulario.
    - El backend, en una transacción, bloquea la cuota con `FOR UPDATE`, compara `versionCuota` y busca la clave.
    - Si la clave existe con la misma huella (cuota, fecha e importe), devuelve el pago original; si existe con otra huella, responde 409; si no existe, valida y guarda.
    - Un índice único sobre (`empresa_id`, `clave_idempotencia`) cubre las carreras que queden.
  - **Avisos:**
    - En la transacción 1 se insertan el intento SIN_CONFIRMAR y las filas de `cuotas_aviso`, cuyo índice único parcial impide un segundo intento sin confirmar.
    - Fuera de la transacción se llama a Resend con la cabecera `Idempotency-Key` igual a la clave del intento.
    - En la transacción 2 se registra el resultado. «Verificar envío» repite la llamada con la misma clave.
- **Alternativas:** bloqueo distribuido o cola de mensajes, descartados por agregar infraestructura. Deduplicar solo en la SPA, prohibido por RN-157.
- **Consecuencias:**
  - Garantía en la base de datos, comprobable con tests concurrentes.
  - No queda ningún correo aceptado sin su intento en la bandeja.
  - Una caída entre la llamada a Resend y la transacción 2 deja el intento SIN_CONFIRMAR, que es el comportamiento exigido (RN-067).

### ADR-007: API interna separada para procedimientos del equipo de VenceYa

- **Contexto:** HU-001 es un procedimiento interno, y no debe existir ningún endpoint de autoalta para los roles de empresa (O15). La futura baja contractual (HU-018) tendrá la misma naturaleza.
- **Decisión:** un punto de entrada aparte, `apps/api-interna`, que monta solo `/api/v1/interno/*`. Se publica únicamente en la red privada (red privada de Railway o localhost del servidor local), se autentica con tokens personales de operaciones guardados como hash y usa el rol de base de datos `venceya_operaciones`. Cada acción se audita con el operador que la ejecutó.
- **Alternativas:** un rol `SUPERADMIN` dentro de la API pública, descartado porque amplía la superficie de ataque y mezcla permisos internos con roles de empresa. Scripts de línea de comandos sin API, viables pero sin un contrato verificable ni una auditoría uniforme; se reservan para la baja contractual si el PO así lo decide.
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
  - **Capa 2:** RLS de PostgreSQL. Al iniciar cada transacción se ejecuta `SET LOCAL app.empresa_id`, y las políticas filtran todas las tablas de negocio. Sin ese valor, las consultas no devuelven filas.
- **Alternativas:** solo el filtro en el código, frágil ante un olvido. Un esquema o una base de datos por empresa, que complica migraciones, respaldos y la baja, y es desproporcionado para el volumen.
- **Consecuencias:** un error en el código no expone datos de otra empresa. Existe una suite `aislamiento.e2e` que recorre todos los endpoints con identificadores de otra empresa y exige `404`. Hay que cuidar que el pool de conexiones no conserve la variable entre transacciones; `SET LOCAL` lo garantiza.

---

## 6. Restricciones técnicas

### 6.1 Alineación con la constitución

| Principio | Restricción técnica | Verificación |
|---|---|---|
| PRINCIPIO-001 Español | Identificadores, rutas, campos, `operationId`, códigos de error, comentarios y commits en español; la única excepción son las palabras reservadas y las API de terceros. | Regla de ESLint de nombres sobre `packages/dominio` y `apps/*/src/modulos`; revisión de pull requests. |
| PRINCIPIO-002 Stack | Node.js 22 LTS, NestJS 10, PostgreSQL 16, React 18 con shadcn/ui. Nube: Neon (`us-east-1`) y Railway (US East). Local: los tres componentes en el servidor del cliente. No se usa otro motor de base de datos, framework de frontend ni almacén como Redis o una cola. | Revisión de `package.json` y de la configuración de conexión en cada merge. |
| PRINCIPIO-003 Aislamiento | Empresa tomada de la sesión, repositorio con filtro y RLS (ADR-009); `404` para recursos de otra empresa. | Suite e2e de aislamiento en CI. |
| PRINCIPIO-004 Cifrado | AES-256-GCM por campo, HMAC para comparaciones, Argon2id para contraseñas, claves fuera de la base y del repositorio, TLS 1.2 o superior (HSTS en la SPA y la API; `sslmode=require` hacia Neon). | Pruebas de almacenamiento (la columna no contiene el texto plano), de etiqueta alterada, de unicidad por ámbito y de rotación. |
| PRINCIPIO-005 Datos personales | Logger con lista blanca de campos (eventos, identificadores, códigos); los errores no repiten la entrada; fixtures con datos ficticios `@example.com`; nunca se envían datos reales a prompts de IA. | Test que inspecciona los logs de la suite e2e en busca de correos y nombres de los fixtures; revisión de fixtures en el pull request. |
| PRINCIPIO-006 Inmutabilidad | Tres capas (ADR-004); las anulaciones son entidades separadas; solo la baja contractual elimina datos, y siempre todos los de la empresa. | Tests de integración de UPDATE y DELETE rechazados; test de la baja con dos empresas. |
| PRINCIPIO-007 Cálculos | Funciones puras en `packages/dominio` con `fechaCalculo` como parámetro; regla de lint que prohíbe `Date.now()` y `new Date()` sin argumentos en el dominio; `decimal.js`. | Jest con umbral de cobertura del 80 % en `packages/dominio` (CI falla por debajo); suite de casos de referencia aprobados. |
| PRINCIPIO-008 Indicador | El futuro indicador S3 se calculará solo con el histórico interno, sin clientes HTTP hacia fuentes externas en el dominio. | Test de recálculo desde un histórico de referencia (al entregar S3). |
| PRINCIPIO-009 Canales | Único canal de salida: Resend (correo) más la bandeja interna (`intentos_aviso`). Sin SDK de SMS ni de mensajería. | Revisión de dependencias; lista de dependencias prohibidas en CI. |
| PRINCIPIO-010 Accesibilidad | Componentes de shadcn/ui (Radix) accesibles, foco visible, contraste ≥ 4.5:1, diseño responsive y tabla equivalente para cada gráfico. | axe-core con Playwright en CI y revisión manual con teclado en cada pantalla nueva. |
| PRINCIPIO-011 Límites de la IA | `CORREO_MODO=PRUEBA` fuera de producción: todo se redirige al buzón de prueba (RN-013). Despliegue a producción solo con aprobación manual. Sin pasarelas de pago. | gitleaks en CI; *environment protection* de GitHub para producción. |
| PRINCIPIO-012 Revisión humana | Rama `main` protegida, con una aprobación humana obligatoria antes del merge. | Regla de protección de la rama en GitHub. |

### 6.2 Restricciones de implementación

- **Contrato primero:** `07-openapi.yaml` es la fuente oficial. En CI, `postman spec lint` valida el YAML y un test compara las rutas registradas en NestJS con las operaciones del YAML; cualquier diferencia hace fallar el build.
- **Validación en el servidor:** la interfaz puede adelantar validaciones, pero cada regla (RN-162, contraseñas, importes, fechas) se comprueba en la API. `ValidationPipe` usa `errorHttpStatusCode: 422`, `whitelist` y `forbidNonWhitelisted`.
- **Fecha de cálculo:** se obtiene una sola vez por petición, a partir del corte en America/Lima, y se pasa explícitamente al dominio. Las sesiones y los enlaces usan el reloj del servidor (RN-149, RN-098), que no es un cálculo financiero.
- **Transacciones:** cada caso de uso que escribe se ejecuta en una sola transacción, con los niveles de aislamiento y los bloqueos indicados en ADR-006. Los efectos externos (correo) van siempre fuera de la transacción de negocio y con su propio registro.
- **Funcionalidades Should:** S1 (HU-011) y S5 (HU-012) se activan con las banderas `FUNCIONALIDAD_S1` y `FUNCIONALIDAD_S5`. Mientras estén apagadas, sus rutas responden `404` y la interfaz no muestra sus opciones. Sus cálculos quedan sujetos a PRINCIPIO-007 desde que se implementan (E-012).
- **Rendimiento esperado:** p95 por debajo de 500 ms para el panel con 5,000 cuotas, y por debajo de 300 ms para las mutaciones (salvo el envío de avisos, que depende de Resend; tiempo de espera de 10 s).
- **Observabilidad:** logs JSON con `idSolicitud`, `evento`, `empresa_id`, identificadores internos y `codigo`; métricas de errores 5xx y de intentos SIN_CONFIRMAR.

### 6.3 Pendientes y extensiones previstas

| Tema | Estado | Impacto en la arquitectura |
|---|---|---|
| Historial de ediciones de un contacto eliminado (pregunta 51, QA-13) | Abierta | Por ahora `DELETE /contactos/{id}` conserva el historial. Si se decide eliminarlo o anonimizarlo, solo cambia el caso de uso, no el contrato. |
| Reglas de formato del teléfono del contacto | Propuesta de esta arquitectura (de 1 a 30 caracteres: dígitos, espacios y `+ - ( )`) | Debe confirmarse en `03-reglas-de-negocio.md`; si cambia, se ajusta la validación y la descripción del YAML. |
| Dominio remitente de Resend (pregunta 39) | Pendiente | Se configura en el adaptador de correo. |
| Operación de la modalidad local (preguntas 41 y 42) | Pendiente | Custodia de claves, respaldos y actualizaciones; el código no cambia. |
| HU-013 a HU-017 (S3 y S4) | Sugeridas, sin aprobación | Encajarán en los módulos Contactos (indicador), Panel (reporte) y en un módulo nuevo de Exportaciones (CSV y Excel). Se agregarán al YAML cuando el PO las apruebe. |
| HU-018 (baja contractual) | Sugerida, sin aprobación | Encaja en la API interna (ADR-007), con su propio rol de base de datos para la eliminación total. |
