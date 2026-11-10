# 08 - Backlog técnico de VenceYa

**Fase BMAD:** construcción, a cargo del agente Backlog Builder (Technical Lead).
**Fecha:** 2026-11-09.
**País de operación:** Perú. **Zona horaria de negocio:** America/Lima.
**Fuentes:** `07-architecture.md` (componentes C1 a C16, ADR-001 a ADR-009), `07-openapi.yaml` (49 operaciones), `06-user-stories.md` (HU-001 a HU-012) y `02-alcance.md`.

**Criterios de esta versión**

- **Alcance:** las 10 HUs Must del MVP (HU-001 a HU-010) y las 2 HUs Should aprobadas (HU-011 y HU-012). No hay tareas para lo que está fuera de alcance (O1 a O19), ni para las HUs sugeridas por QA (HU-013 a HU-018), porque no tienen la aprobación del PO ni endpoints en la arquitectura (sección 6.3). Las funcionalidades Could (C1 y C3) no tienen diseño técnico y quedan sin tareas.
- **Tamaño:** S < 30 min, M de 30 min a 1 h y L de 1 a 2 h. Ninguna tarea supera las 2 horas, así que las HUs grandes se dividen en varias tareas.
- **Orden:** el número de cada tarea respeta sus dependencias (cada tarea depende solo de tareas con un número menor), lo que garantiza un DAG sin ciclos. Primero van las Must y después las Should.
- **Definition of Done común (requisitos transversales de `06-user-stories.md`):** se valida en el servidor, se aísla por empresa, no hay datos personales en logs ni errores, cada operación es una sola transacción, el dominio no lee el reloj, los identificadores están en español y los fixtures usan datos ficticios `@example.com`. Ninguna prueba envía correos reales (`CORREO_MODO=PRUEBA`).

---

## 1. Tareas

### 1.1 Setup e infraestructura (Must)

#### T-001: Crear el monorepo con los paquetes de la arquitectura

- **HU relacionada:** Infraestructura
- **Componente:** Organización del código (monorepo)
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** Ninguna
- **Descripción:** Crear el monorepo con `apps/web` (React 18 + Vite + TypeScript), `apps/api` y `apps/api-interna` (NestJS 10), `packages/dominio` y `packages/contratos`, sobre Node.js 22 LTS. Configurar TypeScript estricto, ESLint con la regla de nombres en español sobre `packages/dominio` y `apps/*/src/modulos`, y la regla que prohíbe `Date.now()` y `new Date()` sin argumentos en el dominio. Generar los tipos de `packages/contratos` desde `07-openapi.yaml`.
- **Criterio de completitud:** ¿`npm run build` y `npm run lint` terminan sin errores en los cinco paquetes, y un `new Date()` sin argumentos dentro de `packages/dominio` hace fallar el lint?

#### T-002: Configurar el pipeline de CI en GitHub Actions

- **HU relacionada:** Infraestructura
- **Componente:** Infraestructura (CI, PRINCIPIO-011 y PRINCIPIO-012)
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-001
- **Descripción:** Crear el workflow que ejecuta lint, build y tests, el escáner gitleaks, `postman spec lint --issueType=syntax` sobre `07-openapi.yaml` y una lista de dependencias prohibidas (SDK de SMS o mensajería, pasarelas de pago, Redis, colas). Exigir una cobertura mínima del 80 % en `packages/dominio`. Documentar en el README la protección de `main` con una aprobación humana obligatoria.
- **Criterio de completitud:** ¿El workflow falla al agregar un secreto de prueba, una dependencia prohibida o una cobertura del dominio por debajo del 80 %, y pasa en verde sobre la rama limpia?

#### T-003: Crear las migraciones de base de datos con RLS e inmutabilidad

- **HU relacionada:** Infraestructura
- **Componente:** C16 Base de datos
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-001
- **Descripción:** Escribir las migraciones SQL versionadas de todas las tablas de la sección 3.1, con importes `numeric(14,2)`, `CHECK (importe > 0)`, la FK `ON DELETE RESTRICT` de `comprobantes.contacto_id` y los índices únicos parciales (documento por cobrar y por pagar, clave de idempotencia, un enlace vigente por tipo, una anulación por pago, un intento sin confirmar por cuota). Crear los roles `venceya_app` (sin `BYPASSRLS` ni `UPDATE`/`DELETE` sobre pagos y anulaciones) y `venceya_operaciones`, las políticas RLS por `app.empresa_id` y los triggers `BEFORE UPDATE OR DELETE` sobre `pagos`, `anulaciones_pago` y `anulaciones_comprobante`.
- **Criterio de completitud:** ¿Las migraciones se aplican y revierten sobre un PostgreSQL 16 vacío, y con `venceya_app` una consulta sin `app.empresa_id` no devuelve filas?

#### T-004: Implementar el servicio criptográfico

- **HU relacionada:** Infraestructura (transversal a HU-001 a HU-004, HU-009 y HU-010)
- **Componente:** C13 Servicio criptográfico
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-001
- **Descripción:** Implementar con `node:crypto` el cifrado AES-256-GCM por campo, con un IV aleatorio de 96 bits y un AAD que vincula ambiente, entidad, id, campo y empresa. Implementar las referencias HMAC-SHA-256 por propósito y ámbito, el hash Argon2id (19 MiB, 2 iteraciones, paralelismo 1), la carga de claves por propósito y versión desde variables de entorno y el contador `claves_uso`. Incluir pruebas unitarias.
- **Criterio de completitud:** ¿Las pruebas confirman que el texto cifrado no contiene el texto plano, que descifrar con otro AAD o con la etiqueta alterada falla, y que el mismo correo produce referencias distintas en dos empresas?

#### T-005: Implementar la capa transversal de la API

- **HU relacionada:** Infraestructura (todas las HUs)
- **Componente:** C2 Capa transversal de la API
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-003
- **Descripción:** Crear el gestor de transacciones que ejecuta `SET LOCAL app.empresa_id` con la empresa de la sesión, y el `RepositorioEmpresa` base que agrega `empresa_id` a cada consulta e inserción. Configurar `ValidationPipe` (`422`, `whitelist`, `forbidNonWhitelisted`), la normalización RN-162, el filtro de excepciones con el formato de error único e `idSolicitud`, el logger pino con lista blanca de campos y las banderas `FUNCIONALIDAD_S1` y `FUNCIONALIDAD_S5`.
- **Criterio de completitud:** ¿Un error de validación responde `422` con `{ codigo, mensaje, detalles, idSolicitud }` sin repetir el valor ingresado, y una ruta protegida por una bandera apagada responde `404`?

#### T-006: Implementar el adaptador de correo con Resend

- **HU relacionada:** Infraestructura (HU-001, HU-002, HU-003, HU-010)
- **Componente:** C14 Adaptador de correo
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-001
- **Descripción:** Crear el puerto de correo y su adaptador para Resend, que envía la cabecera `Idempotency-Key` y aplica un tiempo de espera de 10 s. Agregar las plantillas fijas (invitación, recuperación, aviso por cobrar y aviso por pagar) y el modo `CORREO_MODO=PRUEBA`, que redirige todos los destinatarios al buzón de prueba (RN-013).
- **Criterio de completitud:** ¿Con `CORREO_MODO=PRUEBA`, un test con el cliente de Resend simulado confirma que todo destinatario se reemplaza por el buzón de prueba y que se envía la clave de idempotencia recibida?

### 1.2 Núcleo de dominio (Must)

#### T-007: Implementar importes y la propuesta de cuotas en el dominio

- **HU relacionada:** HU-005
- **Componente:** C12 Núcleo de dominio puro
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-001
- **Descripción:** Implementar en `packages/dominio` el tipo de importe en céntimos con `decimal.js`, el parseo de la cadena canónica de la API y del formato peruano de la interfaz (RN-153, sin redondear), y `proponerCuotas` (de 2 a 120 cuotas, reparto con el residuo en la última y vencimientos mensuales con el último día del mes cuando falta el día, RN-015). Incluir las validaciones de cantidad de cuotas, suma igual al total y vencimientos estrictamente crecientes.
- **Criterio de completitud:** ¿`proponerCuotas` devuelve S/ 333.33, 333.33 y 333.34 para S/ 1,000.00 en 3 cuotas, los vencimientos 2026-02-28, 2026-03-31 y 2026-04-30 para una emisión del 2026-01-31, y el parseo rechaza «100,50», «1,000.505» y «1,00.50»?

#### T-008: Implementar saldo, estado, atraso y fecha efectiva de una cuota

- **HU relacionada:** HU-006, HU-007
- **Componente:** C12 Núcleo de dominio puro
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-007
- **Descripción:** Implementar `calcularSaldoCuota` (importe menos los pagos no anulados), `calcularFechaEfectiva` (sin S1, el vencimiento original vigente), `calcularEstadoCuota` (PENDIENTE, VENCIDA, CANCELADA o ANULADA) y `calcularDiasAtraso`, todas con `fechaCalculo` como parámetro. Incluir las validaciones de un pago nuevo: no superar el saldo, no ser anterior al mayor pago vigente ni a la emisión, y no ser posterior a la fecha de cálculo (RN-089, RN-092).
- **Criterio de completitud:** ¿Con una cuota de S/ 1,000.00, pagos de S/ 400.00 y S/ 600.00 y la anulación del segundo, la función devuelve saldo S/ 600.00 y estado VENCIDA para un vencimiento del 2026-11-03 y la fecha de cálculo 2026-11-09?

#### T-009: Implementar indicadores de cartera, proyección y tipo de aviso

- **HU relacionada:** HU-008, HU-010
- **Componente:** C12 Núcleo de dominio puro
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-008
- **Descripción:** Implementar `calcularIndicadoresCartera` (vencida y pendiente, por cobrar y por pagar, en una sola moneda y sin comprobantes anulados), `calcularProyeccion` (saldos agrupados por día para 7, 10 o 15 días, con cobros y pagos en series separadas) y `clasificarTipoAviso`. Ninguna función suma monedas distintas.
- **Criterio de completitud:** ¿Con un conjunto de cuotas en PEN y USD, los indicadores en PEN excluyen las cuotas en USD y las de comprobantes anulados, y la proyección de 7 días devuelve exactamente 7 días con las series separadas?

#### T-010: Crear la suite de casos de referencia del dominio

- **HU relacionada:** HU-005, HU-006, HU-007, HU-008
- **Componente:** C12 Núcleo de dominio puro
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-002, T-007, T-008, T-009
- **Descripción:** Convertir en tests de Jest los ejemplos de los criterios de aceptación de las HUs Must (reparto de cuotas, límites de 12 dígitos enteros y 120 cuotas, saldos, cambios de estado al anular, proyección e indicadores) en un archivo `casos-referencia` que la persona encargada del proyecto aprueba (PRINCIPIO-007). Ejecutarlos en CI con el umbral de cobertura.
- **Criterio de completitud:** ¿La suite pasa, cubre todos los ejemplos numéricos de HU-005 a HU-008 y la cobertura de `packages/dominio` es del 80 % o más?

### 1.3 Acceso y usuarios (Must)

#### T-011: Implementar inicio de sesión, sesiones, CSRF y autorización por rol

- **HU relacionada:** HU-002
- **Componente:** C3 Módulo Autenticación y sesiones
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-004, T-005
- **Descripción:** Implementar los endpoints 1, 2 y 3 (inicio y cierre de sesión, sesión vigente con su token CSRF), con la cookie `venceya_sesion`, los tokens de 256 bits guardados como SHA-256 y el bloqueo tras 5 fallos (RN-103). Crear los guards de sesión (30 minutos de inactividad sin contar `X-Peticion-Automatica` y 12 horas absolutas, RN-149), de CSRF y de rol según la matriz RN-060, y el servicio que cierra todas las sesiones de un usuario.
- **Criterio de completitud:** ¿Una petición POST sin `X-Token-CSRF` responde `403`, una sesión inactiva por 31 minutos responde `401`, y el sexto intento tras 5 fallos se rechaza aunque la contraseña sea correcta?

#### T-012: Implementar la activación por invitación y la recuperación de contraseña

- **HU relacionada:** HU-002
- **Componente:** C3 Módulo Autenticación y sesiones
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-006, T-011
- **Descripción:** Implementar el servicio de `enlaces_acceso` (emisión, vencimiento, uso único, revocación del enlace anterior) y los endpoints 4, 5 y 6. La solicitud de recuperación responde de forma neutra exista o no el correo, y restablecer la contraseña cierra todas las sesiones del usuario.
- **Criterio de completitud:** ¿Un enlace usado o vencido responde `ENLACE_NO_VALIDO` o `ENLACE_VENCIDO`, la recuperación devuelve la misma respuesta para un correo existente y uno inexistente, y tras restablecer la contraseña la sesión anterior queda cerrada?

#### T-013: Implementar la API interna de alta de empresas

- **HU relacionada:** HU-001
- **Componente:** C4 Módulo Operaciones internas
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-012
- **Descripción:** Crear el punto de entrada `apps/api-interna`, que monta solo `/api/v1/interno/*`, se autentica con tokens de operaciones guardados como hash y usa el rol `venceya_operaciones`. Implementar los endpoints 7 y 8: el alta atómica de empresa, primer ADMINISTRADOR, enlace de invitación y auditoría (RN-211), y el reenvío de la invitación, que se rechaza con `EXISTE_ADMINISTRADOR_ACTIVO` si ya hay un administrador activo.
- **Criterio de completitud:** ¿Un RUC repetido responde `RUC_YA_REGISTRADO` sin crear filas, una falla simulada después de crear la empresa no deja ni empresa ni usuario, y la ruta `/api/v1/interno/empresas` responde `404` en la API pública?

#### T-014: Implementar la administración de usuarios y roles

- **HU relacionada:** HU-003
- **Componente:** C5 Módulo Usuarios y configuración de empresa
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-012
- **Descripción:** Implementar los endpoints 9 a 15 (listar, invitar, obtener, cambiar rol, desactivar, reactivar y reenviar invitación), solo para ADMINISTRADOR. El cambio de rol y la desactivación cierran todas las sesiones del afectado y escriben la auditoría en la misma transacción (RN-100, RN-161), con bloqueo de fila para proteger al último administrador activo.
- **Criterio de completitud:** ¿Degradar o desactivar al único ADMINISTRADOR activo responde `ULTIMO_ADMINISTRADOR_ACTIVO`, y tras un cambio de rol efectivo la sesión del afectado responde `401` y existe el evento `ROL_CAMBIADO`?

### 1.4 Contactos, comprobantes y pagos (Must)

#### T-015: Implementar el catálogo de contactos

- **HU relacionada:** HU-004
- **Componente:** C6 Módulo Contactos
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-004, T-011
- **Descripción:** Implementar los endpoints 23 a 29: búsqueda paginada por nombre, alta, obtención, edición con `version` e historial por campo (los valores sensibles solo cifrados), desactivación, reactivación y eliminación. El correo se cifra y su unicidad por empresa usa `correo_ref`, incluidos los contactos desactivados. La eliminación se rechaza con `CONTACTO_CON_COMPROBANTES` si existe algún comprobante, aunque esté anulado.
- **Criterio de completitud:** ¿Un correo repetido en la misma empresa responde `CORREO_CONTACTO_YA_REGISTRADO`, el mismo correo se acepta en otra empresa, y la columna `correo_cifrado` no contiene el texto plano?

#### T-016: Implementar el registro y la edición de comprobantes con cuotas

- **HU relacionada:** HU-005
- **Componente:** C7 Módulo Comprobantes y cuotas
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-007, T-015
- **Descripción:** Implementar los endpoints 30 a 34: propuesta de cuotas sin persistir, listado, registro atómico del comprobante con sus cuotas (contacto ACTIVO, número de documento normalizado y único entre no anulados según el sentido), obtención y edición. La edición solo se permite si el comprobante no está anulado, nunca tuvo pagos ni reprogramaciones (`COMPROBANTE_NO_EDITABLE`) y guarda el historial por campo.
- **Criterio de completitud:** ¿Registrar « f001-00045 » por cobrar con F001-00045 vigente responde `COMPROBANTE_DUPLICADO`, el mismo número por pagar se acepta, y una falla simulada al guardar la cuota 3 no deja ni el comprobante ni sus cuotas?

#### T-017: Implementar el registro idempotente de pagos

- **HU relacionada:** HU-006
- **Componente:** C8 Módulo Pagos y anulaciones
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-008, T-016
- **Descripción:** Implementar los endpoints 36, 37 y 38. El registro exige la cabecera `Clave-Idempotencia` y, en una sola transacción, bloquea la cuota con `FOR UPDATE`, compara `versionCuota`, busca la clave (misma huella devuelve `200` con el pago original y otra huella responde `CLAVE_IDEMPOTENCIA_REUTILIZADA`) y aplica las validaciones del dominio. También marca `tuvo_pagos` en el comprobante.
- **Criterio de completitud:** ¿Un pago de S/ 600.01 sobre un saldo de S/ 600.00 responde `IMPORTE_SUPERA_SALDO`, la misma solicitud repetida devuelve el mismo pago sin crear otro, y un pago en US$ sobre una cuota en S/ se rechaza?

#### T-018: Implementar la anulación de pagos y de comprobantes

- **HU relacionada:** HU-007
- **Componente:** C8 Módulo Pagos y anulaciones
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-017
- **Descripción:** Implementar los endpoints 35 y 39, solo para SUPERVISOR y ADMINISTRADOR, con un motivo obligatorio normalizado según RN-162 (TRIM, mayúsculas, de 1 a 500 caracteres). La anulación de un pago crea un registro aparte, sin tocar el pago. La de un comprobante bloquea sus cuotas, exige que no tenga pagos vigentes (`COMPROBANTE_CON_PAGOS_VIGENTES`) y marca `anulado`.
- **Criterio de completitud:** ¿Un OPERADOR recibe `403`, un pago ya anulado responde `YA_ANULADO`, un motivo «   » o de 501 caracteres responde `422`, y tras anular un comprobante cualquier pago sobre sus cuotas se rechaza con `COMPROBANTE_ANULADO`?

#### T-019: Probar la inmutabilidad, la idempotencia y la concurrencia de pagos

- **HU relacionada:** HU-006, HU-007
- **Componente:** C8 Módulo Pagos y anulaciones / C16 Base de datos
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-018
- **Descripción:** Escribir tests de integración contra PostgreSQL real que verifiquen las reglas MUST de PRINCIPIO-006 y RN-156: UPDATE y DELETE sobre `pagos` y `anulaciones_*` rechazados con el rol `venceya_app`, solicitudes de pago concurrentes con la misma clave y con claves distintas, anulaciones concurrentes del mismo pago, y la carrera entre la anulación de un comprobante y un pago nuevo.
- **Criterio de completitud:** ¿Pasan los tests que confirman que 10 solicitudes paralelas con la misma clave crean 1 pago, que dos pagos concurrentes de S/ 400.00 y S/ 300.00 sobre un saldo de S/ 600.00 crean solo uno, y que el UPDATE directo sobre `pagos` falla?

### 1.5 Configuración, panel y avisos (Must)

#### T-020: Implementar la configuración de la empresa, las listas de copias y las preferencias

- **HU relacionada:** HU-008, HU-009
- **Componente:** C5 Módulo Usuarios y configuración de empresa
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-014
- **Descripción:** Implementar los endpoints 16 a 22: preferencias propias de moneda y ventana de proyección (7, 10 o 15 días), configuración de empresa (correo administrativo cifrado y moneda por defecto) y listas de copias por cobrar y por pagar. Solo un usuario ACTIVO y no OPERADOR puede entrar en una lista, y cada cambio se audita en la misma transacción.
- **Criterio de completitud:** ¿Agregar un OPERADOR a una lista responde `USUARIO_NO_ELEGIBLE_COPIAS`, agregarlo dos veces responde `USUARIO_YA_EN_LISTA`, y un SUPERVISOR recibe `403` en `/empresa/configuracion`?

#### T-021: Implementar el panel de cartera con un corte coherente

- **HU relacionada:** HU-008
- **Componente:** C10 Módulo Panel
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-009, T-018, T-020
- **Descripción:** Implementar `GET /panel` en una transacción `REPEATABLE READ READ ONLY` cuyo inicio define el `corte` y la `fechaCalculo` en America/Lima (ADR-008). Devuelve los indicadores, la proyección y el listado completo de movimientos en la moneda pedida (o en la preferida del usuario, o en la de la empresa), la marca de cuotas vencidas en la otra moneda y, con `incluirAnulados`, las cuotas ANULADAS fuera de los cálculos.
- **Criterio de completitud:** ¿La respuesta trae `corte` y `fechaCalculo`, los indicadores no cambian al activar `incluirAnulados`, y una cuota vencida en USD activa la marca de la otra moneda al consultar en PEN?

#### T-022: Implementar las cuotas por avisar y la vista previa del aviso

- **HU relacionada:** HU-010
- **Componente:** C11 Módulo Avisos
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-009, T-018, T-020
- **Descripción:** Implementar `GET /avisos/cuotas-por-avisar` con todas las cuotas con saldo, pendientes y vencidas, por cobrar y por pagar, sin limitarlas a la ventana del gráfico, con su marca «Enviado» y la fecha del último envío. Implementar `POST /avisos/vista-previa`, que arma el aviso con la plantilla fija y devuelve los destinatarios vigentes (contacto, correo administrativo y lista de copias del sentido) junto con su firma.
- **Criterio de completitud:** ¿Las cuotas de comprobantes anulados o con saldo cero no aparecen, y una cuota vencida fuera de la ventana de 15 días sí aparece?

#### T-023: Implementar el envío, la verificación y la bandeja de avisos

- **HU relacionada:** HU-010
- **Componente:** C11 Módulo Avisos
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-006, T-022
- **Descripción:** Implementar `POST /avisos/envios` según ADR-006: la transacción 1 guarda el intento SIN_CONFIRMAR con sus destinatarios cifrados y sus `cuotas_aviso`; luego se llama a Resend con la clave del intento; la transacción 2 registra el resultado. Rechazar con `DESTINATARIOS_CAMBIARON` si la firma cambió, con `INTENTO_SIN_CONFIRMAR` si hay otro intento abierto y con `REENVIO_REQUIERE_CONFIRMACION` si falta la confirmación. Implementar los endpoints 47, 48 y 49 (bandeja paginada, detalle y verificación con la misma clave).
- **Criterio de completitud:** ¿Con Resend simulado sin respuesta, el intento queda SIN_CONFIRMAR, un segundo envío de las mismas cuotas responde `INTENTO_SIN_CONFIRMAR`, y la verificación repite la llamada con la misma `Idempotency-Key` y marca las cuotas como «Enviado»?

### 1.6 SPA web (Must)

#### T-024: Crear la base de la SPA y las pantallas de acceso

- **HU relacionada:** HU-002
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-011, T-012
- **Descripción:** Configurar shadcn/ui, el router, TanStack Query y un cliente HTTP tipado con `packages/contratos`, que envía `X-Token-CSRF` y redirige al inicio de sesión ante `401`. Crear el componente `CampoImporte` con el formato peruano, el formateo de fechas y la leyenda «Datos al DD/MM/AAAA, HH:mm», y un botón que se deshabilita mientras su solicitud está en curso. Construir las pantallas de inicio de sesión, activación y recuperación de contraseña.
- **Criterio de completitud:** ¿Un usuario de prueba activa su cuenta, inicia sesión y cierra sesión desde la SPA contra la API local, y `CampoImporte` rechaza «1000.00» y acepta «1,000.00»?

#### T-025: Construir las pantallas de usuarios, configuración y copias

- **HU relacionada:** HU-003, HU-009
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-014, T-020, T-024
- **Descripción:** Construir la lista de usuarios con la invitación, el cambio de rol, la desactivación, la reactivación y el reenvío, visibles solo para ADMINISTRADOR. Agregar la pantalla de configuración de empresa (correo administrativo y moneda por defecto), la gestión de las dos listas de copias y la pantalla de preferencias personales para todos los roles.
- **Criterio de completitud:** ¿Un ADMINISTRADOR invita a un usuario y lo agrega a la lista de copias por cobrar desde la interfaz, y un OPERADOR no ve el menú de usuarios ni el de configuración?

#### T-026: Construir las pantallas de contactos y comprobantes

- **HU relacionada:** HU-004, HU-005
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-016, T-024
- **Descripción:** Construir el catálogo de contactos con búsqueda por nombre, alta, edición, desactivación, reactivación y eliminación con confirmación. Construir el formulario de comprobante con selector de contacto activo, «Pago único» o «En cuotas», la propuesta de cuotas editable y la diferencia visible entre la suma de cuotas y el total, sin ajustarla por su cuenta, y la vista de detalle con sus cuotas.
- **Criterio de completitud:** ¿Desde la interfaz se registra F001-00045 por US$ 3,000.00 en 3 cuotas, y al cambiar la cuota 1 de S/ 1,000.00 en 3 cuotas a S/ 400.00 se muestra la diferencia de S/ 66.67 y no se permite guardar?

#### T-027: Construir los formularios de pago y de anulación

- **HU relacionada:** HU-006, HU-007
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-018, T-026
- **Descripción:** Construir el formulario de pago, que genera la `Clave-Idempotencia` al abrirse, la reutiliza en los reintentos y deshabilita el botón durante el envío. Ante `IMPORTE_SUPERA_SALDO`, consulta de nuevo la cuota para mostrar el saldo vigente. Agregar los diálogos de anulación de pago y de comprobante con motivo obligatorio, visibles solo para SUPERVISOR y ADMINISTRADOR.
- **Criterio de completitud:** ¿Un doble clic en «Registrar pago» crea un solo pago, el saldo mostrado tras el rechazo viene de `GET /cuotas/{cuotaId}`, y un OPERADOR no ve la opción «Anular»?

#### T-028: Construir el panel de cartera con su gráfico accesible

- **HU relacionada:** HU-008
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-021, T-024
- **Descripción:** Construir el panel con las cuatro tarjetas de cartera, el selector de moneda con la marca de la otra moneda, el gráfico de proyección (Recharts) acompañado de su tabla equivalente, y el listado de movimientos con filtros y orden en el cliente y la opción «Incluir comprobantes anulados». Mostrar la leyenda «Datos al…» con el corte de la respuesta.
- **Criterio de completitud:** ¿El panel muestra los datos en S/ por defecto, cambia a US$ con el selector sin sumar monedas, y la tabla equivalente del gráfico se puede recorrer con el teclado?

#### T-029: Construir la pantalla de avisos y la bandeja interna

- **HU relacionada:** HU-010
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-023, T-024
- **Descripción:** Construir la lista de cuotas por avisar con selección, la vista previa con destinatarios y comentario opcional, el envío con botón deshabilitado, «Reenviar aviso» con confirmación, «Verificar envío» para los intentos sin confirmar y la advertencia antes de enviar un aviso nuevo. Construir la bandeja interna con el detalle de cada intento.
- **Criterio de completitud:** ¿Con Resend simulado, al enviar un aviso la cuota pasa a «Enviado» con su fecha, y ante un error confirmado se muestra el mensaje y la cuota no se marca?

### 1.7 Testing transversal (Must)

#### T-030: Crear la suite e2e de aislamiento por empresa y privacidad de logs

- **HU relacionada:** HU-001 a HU-010 (requisitos transversales)
- **Componente:** C2 Capa transversal de la API / C16 Base de datos
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-013, T-023
- **Descripción:** Crear la suite `aislamiento.e2e`, que siembra dos empresas ficticias y recorre todos los endpoints de la API pública con identificadores de la otra empresa, exigiendo `404` y comprobando que no se modificó nada (PRINCIPIO-003, ADR-009). Al final, inspeccionar los logs capturados en busca de los correos y nombres de los fixtures (PRINCIPIO-005).
- **Criterio de completitud:** ¿La suite cubre los endpoints de recursos con identificador de `07-openapi.yaml`, todos responden `404` con identificadores ajenos, y los logs no contienen ningún correo ni nombre de los fixtures?

#### T-031: Verificar en CI que las rutas coinciden con el contrato OpenAPI

- **HU relacionada:** Infraestructura
- **Componente:** C2 Capa transversal de la API
- **Prioridad:** Must
- **Tamaño:** S
- **Dependencias:** T-002, T-013, T-023
- **Descripción:** Escribir un test que compara las rutas y los métodos registrados en `apps/api` y `apps/api-interna` con las 49 operaciones de `07-openapi.yaml`, y agregarlo al workflow de CI.
- **Criterio de completitud:** ¿El test pasa con el código actual y falla si se agrega una ruta que no está en el YAML o si falta una operación del YAML?

#### T-032: Automatizar las pruebas de accesibilidad de las pantallas

- **HU relacionada:** HU-002 a HU-010
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-025, T-026, T-027, T-028, T-029
- **Descripción:** Configurar Playwright con axe-core y recorrer las pantallas Must en anchos de móvil y de escritorio, con reglas WCAG 2.2 AA. Agregar una prueba de navegación por teclado del flujo de registro de un pago y ejecutar todo en CI (PRINCIPIO-010).
- **Criterio de completitud:** ¿axe-core no reporta violaciones graves ni críticas en ninguna pantalla Must y el flujo de registro de un pago se completa solo con el teclado?

### 1.8 Funcionalidades Should (después del MVP)

#### T-033: Implementar la reprogramación con promesa de pago

- **HU relacionada:** HU-011
- **Componente:** C9 Módulo Reprogramaciones
- **Prioridad:** Should
- **Tamaño:** L
- **Dependencias:** T-018, T-022
- **Descripción:** Extender `calcularFechaEfectiva` y agregar `clasificarPromesa` (ACTIVA, CUMPLIDA, INCUMPLIDA) en el dominio, con sus casos de referencia. Implementar los endpoints 40 y 41 detrás de `FUNCIONALIDAD_S1`: una sola promesa no reemplazada por cuota, saldo mayor que cero (`CUOTA_SIN_SALDO`), comprobante no anulado y marca `tuvo_reprogramaciones` en la misma transacción.
- **Criterio de completitud:** ¿Con la bandera apagada los endpoints responden `404`, y con la bandera encendida una cuota reprogramada usa la fecha prometida como vencimiento efectivo en el panel y en las cuotas por avisar?

#### T-034: Agregar la reprogramación en la interfaz

- **HU relacionada:** HU-011
- **Componente:** C1 SPA web
- **Prioridad:** Should
- **Tamaño:** M
- **Dependencias:** T-027, T-033
- **Descripción:** Agregar en el detalle de la cuota la acción «Reprogramar» con la fecha prometida, la marca de reprogramada y la lista de promesas con su fecha original. La opción solo aparece cuando la bandera `FUNCIONALIDAD_S1` está encendida.
- **Criterio de completitud:** ¿Con la bandera encendida se reprograma una cuota desde la interfaz y queda marcada como reprogramada, y con la bandera apagada la opción no aparece?

#### T-035: Implementar el tiempo promedio de cobro

- **HU relacionada:** HU-012
- **Componente:** C10 Módulo Panel
- **Prioridad:** Should
- **Tamaño:** L
- **Dependencias:** T-021
- **Descripción:** Implementar `calcularTiempoPromedioCobro` en el dominio, con dos decimales y las reglas de redondeo y selección de QA-10 y QA-11, y sus casos de referencia. Implementar `GET /panel/tiempo-promedio-cobro` detrás de `FUNCIONALIDAD_S5`, con su propio corte, el último mes completo por defecto, el mes actual marcado como parcial, `MES_FUTURO` para meses futuros y «Sin datos» sin comprobantes elegibles.
- **Criterio de completitud:** ¿Los casos de referencia de HU-012 pasan, un mes futuro responde `MES_FUTURO`, y con la bandera apagada el endpoint responde `404`?

#### T-036: Agregar la tarjeta de tiempo promedio de cobro al panel

- **HU relacionada:** HU-012
- **Componente:** C1 SPA web
- **Prioridad:** Should
- **Tamaño:** S
- **Dependencias:** T-028, T-035
- **Descripción:** Agregar al panel una tarjeta propia con selector de mes, independiente del selector de moneda, que muestra los días con dos decimales, la marca «parcial» para el mes actual o «Sin datos». Solo aparece con `FUNCIONALIDAD_S5` encendida.
- **Criterio de completitud:** ¿La tarjeta muestra el último mes completo por defecto, no cambia al cambiar la moneda del panel y no aparece con la bandera apagada?

---

## 2. Resumen

### 2.1 Totales

**Total de tareas:** 36. Se superan las 20 a 25 recomendadas para cumplir la restricción de menos de 2 horas por tarea: el MVP abarca 10 HUs Must, 49 operaciones REST y 16 componentes, así que agruparlas obligaría a tareas mayores de 2 horas.

**Esfuerzo estimado** (tope de cada tamaño: S = 0.5 h, M = 1 h, L = 2 h): 53 h en total, de las cuales 47.5 h son Must y 5.5 h son Should.

### 2.2 Desglose por prioridad

| Prioridad | Tareas | Cantidad |
|---|---|---|
| Must | T-001 a T-032 | 32 |
| Should | T-033 a T-036 | 4 |
| Could | Ninguna (C1 y C3 no tienen diseño técnico) | 0 |
| **Total** | | **36** |

### 2.3 Desglose por tipo

| Tipo | Tareas | Cantidad |
|---|---|---|
| Setup | T-001, T-002, T-003, T-004, T-005, T-006 | 6 |
| Features (dominio y backend) | T-007, T-008, T-009, T-011, T-012, T-013, T-014, T-015, T-016, T-017, T-018, T-020, T-021, T-022, T-033, T-035 | 16 |
| Integración (SPA con la API y API con Resend) | T-023, T-024, T-025, T-026, T-027, T-028, T-029, T-034, T-036 | 9 |
| Testing | T-010, T-019, T-030, T-031, T-032 | 5 |
| **Total** | | **36** |

**Tests de reglas Must:** T-010 (cálculos financieros, PRINCIPIO-007), T-019 (inmutabilidad e idempotencia de pagos, PRINCIPIO-006 y RN-156) y T-030 (aislamiento por empresa y privacidad, PRINCIPIO-003 y PRINCIPIO-005). Además, cada tarea de feature tiene su criterio de completitud verificado con pruebas.

### 2.4 Desglose por componente

| Componente | Tareas | Cantidad |
|---|---|---|
| Infraestructura (monorepo y CI) | T-001, T-002 | 2 |
| C1 SPA web | T-024, T-025, T-026, T-027, T-028, T-029, T-032, T-034, T-036 | 9 |
| C2 Capa transversal de la API | T-005, T-030, T-031 | 3 |
| C3 Autenticación y sesiones | T-011, T-012 | 2 |
| C4 Operaciones internas | T-013 | 1 |
| C5 Usuarios y configuración de empresa | T-014, T-020 | 2 |
| C6 Contactos | T-015 | 1 |
| C7 Comprobantes y cuotas | T-016 | 1 |
| C8 Pagos y anulaciones | T-017, T-018, T-019 | 3 |
| C9 Reprogramaciones | T-033 | 1 |
| C10 Panel | T-021, T-035 | 2 |
| C11 Avisos | T-022, T-023 | 2 |
| C12 Núcleo de dominio puro | T-007, T-008, T-009, T-010 | 4 |
| C13 Servicio criptográfico | T-004 | 1 |
| C14 Adaptador de correo | T-006 | 1 |
| C16 Base de datos | T-003 | 1 |
| **Total** | | **36** |

C15 (Auditoría e historiales) no tiene tarea propia: la auditoría y el historial se escriben en la misma transacción que cada cambio (T-013, T-014, T-015, T-016, T-018, T-020), como exige la arquitectura. T-019 y T-030 también prueban C16.

### 2.5 Desglose por tamaño

| Tamaño | Tareas | Cantidad | Horas (tope) |
|---|---|---|---|
| S (< 30 min) | T-031, T-036 | 2 | 1 |
| M (30 min - 1 h) | T-001, T-002, T-006, T-007, T-008, T-009, T-010, T-012, T-018, T-019, T-020, T-021, T-022, T-027, T-032, T-034 | 16 | 16 |
| L (1 - 2 h) | T-003, T-004, T-005, T-011, T-013, T-014, T-015, T-016, T-017, T-023, T-024, T-025, T-026, T-028, T-029, T-030, T-033, T-035 | 18 | 36 |
| **Total** | | **36** | **53** |

### 2.6 Ruta crítica

La ruta crítica del MVP es la cadena de dependencias más larga, medida con el tope de cada tamaño:

```text
T-001 → T-003 → T-005 → T-011 → T-015 → T-016 → T-017 → T-018 → T-022 → T-023 → T-029 → T-032
  M       L       L       L       L       L       L       M       M       L       L       M
 1 h     2 h     2 h     2 h     2 h     2 h     2 h     1 h     1 h     2 h     2 h     1 h   = 20 h
```

- **Qué la define:** la base de datos y la capa transversal habilitan la autenticación; sobre ella se construye la cadena de negocio (contactos → comprobantes → pagos → anulaciones), de la que dependen los avisos, su pantalla y la prueba de accesibilidad final.
- **Cadenas casi críticas:** la de usuarios (T-011 → T-012 → T-014 → T-020, que llega a T-022 con 3 h de holgura) y la del panel (T-018 → T-021 → T-028 → T-032, con 2 h de holgura).
- **Paralelizables desde el inicio:** T-002, T-004, T-006 y la cadena del dominio T-007 → T-008 → T-009 → T-010 no bloquean la ruta crítica si se terminan antes de T-011 y T-016.
- **Should:** T-033 a T-036 quedan fuera de la ruta crítica del MVP. T-033 puede empezar al terminar T-022 y T-035 al terminar T-021.

### 2.7 Grafo de dependencias

```text
T-001 ─┬─ T-002 ──────────────────────────────────────────┬─ T-010    T-031 (T-002, T-013, T-023)
       ├─ T-003 ── T-005 ─┐                               │
       ├─ T-004 ──────────┼─ T-011 ─┬─ T-012 ─┬─ T-013    │
       ├─ T-006 ──────────┼─────────┘         └─ T-014 ── T-020 ─┐
       └─ T-007 ── T-008 ── T-009 ────────────────────────┘      │
                                                                 │
T-011 ── T-015 ── T-016 ── T-017 ── T-018 ─┬─ T-019              │
                                           ├─ T-021 ◄────────────┤ ── T-028 ── T-036 (con T-035)
                                           ├─ T-022 ◄────────────┘ ── T-023 ── T-029
                                           └─ T-033 (con T-022) ── T-034 (con T-027)

T-024 (T-011, T-012) ── T-025, T-026 ── T-027 ── T-032 (T-025 a T-029)
T-030 (T-013, T-023) · T-035 (T-021)
```
