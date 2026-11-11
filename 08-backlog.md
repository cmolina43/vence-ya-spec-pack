# 08 - Backlog técnico de VenceYa

**Fase BMAD:** construcción, a cargo del agente Backlog Builder (Technical Lead).
**Fecha:** 2026-11-09.
**País de operación:** Perú. **Zona horaria de negocio:** America/Lima.
**Fuentes:** `07-architecture.md` (componentes C1 a C16, ADR-001 a ADR-009), `07-openapi.yaml` (49 operaciones), `06-user-stories.md` (HU-001 a HU-012 y HU-017) y `02-alcance.md`.

**Criterios de esta versión**

- **Alcance:** las 10 HUs Must del MVP (HU-001 a HU-010) y las 3 HUs Should aprobadas (HU-011, HU-012 y HU-017; esta última por decisión del usuario del 2026-11-10, M-06). No hay tareas para lo que está fuera de alcance (O1 a O19), ni para las HUs sugeridas por QA pendientes (HU-013 a HU-016), porque no tienen la aprobación del PO ni endpoints en la arquitectura (sección 6.3). HU-018 no se desarrolla: fijar la fecha efectiva, conservar la constancia y limpiar los datos son un procedimiento operativo manual del equipo de VenceYa, fuera del alcance (pregunta 52); el bloqueo desde la terminación efectiva (RN-152, exigido también por RN-101 y RN-149) forma parte de HU-002 y HU-010 y se implementa en T-011, T-013, T-014, T-024 y T-031 (C-03 de `08-backlog-reporte.md`). Las funcionalidades Could (C1 y C3) no tienen diseño técnico y quedan sin tareas.
- **Tamaño:** S < 30 min, M de 30 min a 1 h y L de 1 a 2 h. Ninguna tarea supera las 2 horas, así que las HUs grandes se dividen en varias tareas.
- **Solicitudes formales de eliminación de datos personales (M-11, decisión del usuario del 2026-11-10):** RN-151 y RN-257 son obligaciones MUST del procedimiento operativo interno del equipo de VenceYa, coordinado con la empresa cliente, fuera del alcance funcional y del backlog de desarrollo. No requieren HU, pantalla, endpoint, componente ni tarea técnica; automatizarlas más adelante sería un requerimiento nuevo. La definición operativa y revisión legal permanecen pendientes antes del lanzamiento en la pregunta 31, sin bloquear las tareas de desarrollo. El cierre documental de M-11 no acredita el procedimiento como operativo ni autoriza por sí solo el lanzamiento. Se mantiene el catálogo de contactos de HU-004 y T-016/T-027; la pregunta 51 sobre el historial del contacto eliminado sigue abierta.
- **Aceptación de S1 (M-06):** no liberar `FUNCIONALIDAD_S1` hasta completar T-034, T-035, T-038 y T-039 y sus verificaciones. Incluye la visibilidad RN-036 y el historial RN-078, aunque S4 no esté entregada. HU-017 se reutiliza con S4; no se implementan su reporte ni sus exportaciones.
- **Orden:** el número de cada tarea respeta sus dependencias (cada tarea depende solo de tareas con un número menor), lo que garantiza un DAG sin ciclos. Primero van las Must y después las Should.
- **Despliegue en la nube (M-07, decisión del usuario del 2026-11-10):** T-001 incluye el repositorio remoto; T-002 configura y verifica la protección de `main`; T-041 a T-043 preparan los ambientes, verifican pruebas y habilitan producción con aprobación humana. La topología web usa un mismo origen HTTPS por ambiente, con la API bajo `/api`; los nombres de dominio y DNS se definen en la pregunta 53, separada del dominio remitente de correo (39). Las preguntas 26 y 31 conservan sus bloqueos previos a producción; 41 y 42 siguen pendientes para la modalidad local. Este ajuste cierra la omisión de planificación, sin acreditar despliegues ni pruebas ejecutadas.
- **Definition of Done común (requisitos transversales de `06-user-stories.md`):** se valida en el servidor, se aísla por empresa, no hay datos personales en logs ni errores, cada ruta declara su acción para el registro de accesos (RN-263, E-015), cada operación es una sola transacción, el dominio no lee el reloj, los identificadores están en español y los fixtures usan datos ficticios `@example.com`. Ninguna prueba envía correos reales (`CORREO_MODO=PRUEBA`).
- **Pruebas y aceptación funcional (M-10, E-014):** Las tareas técnicas se cierran al cumplir sus criterios y verificaciones aplicables; no requieren aprobación humana separada de los casos de referencia. Los cálculos usan pruebas automáticas con entradas y resultados esperados trazables a las reglas de negocio y sus ejemplos. La aceptación humana se realiza sobre el aplicativo por historia o entrega. Las ambigüedades de negocio que las fuentes no resuelvan se consultan a la persona encargada del proyecto. Se mantiene la revisión humana de cada merge (PRINCIPIO-012).

---

## 1. Tareas

### 1.1 Setup e infraestructura (Must)

#### T-001: Crear el monorepo con los paquetes de la arquitectura

- **HU relacionada:** Infraestructura
- **Componente:** Organización del código (monorepo)
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** Ninguna
- **Descripción:** Crear y vincular el repositorio remoto en GitHub para el monorepo, dejando `main` como rama principal y el remoto `origin` verificado antes de T-002. Crear `apps/web` (React 18 + Vite + TypeScript), `apps/api` y `apps/api-interna` (NestJS 10), `packages/dominio` y `packages/contratos`, sobre Node.js 22 LTS. Configurar TypeScript estricto, ESLint con la regla de nombres en español sobre `packages/dominio` y `apps/*/src/modulos`, y la regla que prohíbe `Date.now()` y `new Date()` sin argumentos en el dominio. Generar los tipos de `packages/contratos` desde `07-openapi.yaml`.
- **Criterio de completitud:** ¿El repositorio remoto existe en GitHub, `origin` apunta a él y `main` es la rama principal, `npm run build` y `npm run lint` terminan sin errores en los cinco paquetes, y un `new Date()` sin argumentos dentro de `packages/dominio` hace fallar el lint?

#### T-002: Configurar el pipeline de CI en GitHub Actions

- **HU relacionada:** Infraestructura
- **Componente:** Infraestructura (CI, PRINCIPIO-011 y PRINCIPIO-012)
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-001
- **Descripción:** Crear el workflow que ejecuta lint, build y tests, el escáner gitleaks, `postman spec lint --issueType=syntax` sobre `07-openapi.yaml` y una lista de dependencias prohibidas (SDK de SMS o mensajería, pasarelas de pago, Redis, colas). Exigir una cobertura mínima del 80 % en `packages/dominio`. Configurar y verificar en GitHub la protección de `main`: cambios mediante pull request, una aprobación humana obligatoria y checks de CI requeridos, sin permitir que las identidades de automatización eludan esas condiciones. Documentar en el README la configuración y su evidencia, sin secretos.
- **Criterio de completitud:** ¿El workflow falla al agregar un secreto de prueba, una dependencia prohibida o una cobertura del dominio por debajo del 80 %, pasa en verde sobre la rama limpia, y GitHub bloquea un push directo de la automatización y el merge de un PR sin aprobación humana o con checks requeridos fallidos, permitiendo el merge solo tras cumplir ambas condiciones?

#### T-003: Crear las migraciones de base de datos con RLS e inmutabilidad

- **HU relacionada:** Infraestructura
- **Componente:** C16 Base de datos
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-001
- **Descripción:** Escribir las migraciones SQL versionadas de todas las tablas de la sección 3.1, con importes `numeric(14,2)`, `CHECK (importe > 0)`, la FK `ON DELETE RESTRICT` de `comprobantes.contacto_id` y los índices únicos parciales (documento por cobrar y por pagar, clave de idempotencia, un enlace vigente por tipo, una anulación por pago, un intento en proceso por cuota, tipo y fecha efectiva) y los índices únicos de RN-140 sobre el valor normalizado: `usuarios (correo)` y `empresas (ruc)` globales y `contactos (empresa_id, correo)`, con `CHECK (correo = lower(btrim(correo)))` (E-015). Crear la tabla `registros_acceso` (RN-263 a RN-266) con su índice (`empresa_id`, `ocurrido_en`), sobre la que `venceya_app` solo tiene INSERT. Crear los roles `venceya_app` (sin `BYPASSRLS` ni `UPDATE`/`DELETE` sobre pagos y anulaciones) y `venceya_operaciones`, las políticas RLS por `app.empresa_id` (también sobre `usuarios`, `sesiones` y `enlaces_acceso`, que llevan `empresa_id`) y las funciones `SECURITY DEFINER` `resolver_sesion(token_hash)`, `buscar_usuario_por_correo(correo_normalizado)` y `resolver_enlace(token_hash)` (§3.3): devuelven `empresa_id` y `terminacion_efectiva_en`, pertenecen a un rol dedicado sin login y con `BYPASSRLS`, fijan `search_path` y solo `venceya_app` puede ejecutarlas. Crear los triggers `BEFORE UPDATE OR DELETE` sobre `pagos`, `anulaciones_pago`, `anulaciones_comprobante` y `registros_acceso`.
- **Criterio de completitud:** ¿Las migraciones se aplican y revierten sobre un PostgreSQL 16 vacío, con `venceya_app` una consulta sin `app.empresa_id` no devuelve filas, las tres funciones existen y son las únicas vías de lectura sobre `usuarios`, `sesiones` y `enlaces_acceso` sin `app.empresa_id`, dos inserciones concurrentes del mismo correo normalizado en `usuarios` dejan una sola fila, un correo con mayúsculas viola el `CHECK`, y un UPDATE o DELETE sobre `registros_acceso` se rechaza?

#### T-004: Implementar el servicio de hash y normalización

- **HU relacionada:** Infraestructura (transversal a HU-001 a HU-004, HU-009 y HU-010)
- **Componente:** C13 Servicio de hash
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-001
- **Descripción:** Implementar el hash Argon2id de contraseñas (19 MiB, 2 iteraciones, paralelismo 1, RN-143 y RN-243 a RN-253), la generación de tokens aleatorios de 256 bits con `node:crypto` y su hash SHA-256 (RN-262), y las funciones únicas de normalización de correo (TRIM y minúsculas, sin quitar puntos ni sufijos +, RN-139 y RN-216) y de RUC como cadena de 11 dígitos (RN-217). Sin cifrado por campo ni claves de datos (E-015). Incluir pruebas unitarias.
- **Criterio de completitud:** ¿Dos contraseñas iguales producen hashes distintos y ambas se verifican, un token se valida por su SHA-256 y la base nunca recibe el token en claro, ' Ana@Example.com ' se normaliza a 'ana@example.com' sin alterar 'ana+ventas@example.com', y el RUC 00601234567 conserva sus ceros iniciales?

#### T-005: Implementar la capa transversal de la API

- **HU relacionada:** Infraestructura (todas las HUs)
- **Componente:** C2 Capa transversal de la API
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-003
- **Descripción:** Crear el gestor de transacciones que ejecuta `SET LOCAL app.empresa_id` con la empresa de la sesión, y el `RepositorioEmpresa` base que agrega `empresa_id` a cada consulta e inserción. Configurar `ValidationPipe` (`422`, `whitelist`, `forbidNonWhitelisted`), la normalización RN-162, el filtro de excepciones con el formato de error único e `idSolicitud`, el logger pino con lista blanca de campos y las banderas `FUNCIONALIDAD_S1` y `FUNCIONALIDAD_S5`.
- **Registro de operaciones Should (C-02, ampliado por M-06):** Registrar desde el MVP controladores mínimos para `GET /cuotas/{cuotaId}/promesas` (40), `POST /cuotas/{cuotaId}/promesas` (41), `GET /panel/tiempo-promedio-cobro` (43) y `GET /cuotas/{cuotaId}/historial` (49). El registro de las cuatro operaciones es incondicional. Configurar también `FUNCIONALIDAD_S4` apagada y reservada para su entrega futura; no implementa S4. Las operaciones 40/41 requieren `FUNCIONALIDAD_S1`, la 43 requiere `FUNCIONALIDAD_S5` y la 49 requiere `FUNCIONALIDAD_S1 || FUNCIONALIDAD_S4`. Todas las banderas están apagadas por defecto y controlan disponibilidad, no registro. Hasta implementar T-034, T-036 y T-038 respectivamente, los controladores mínimos responden `404` con el formato de error común y sin efectos sobre los datos, incluso ante activación accidental de las banderas.
- **Criterio de completitud:** ¿Un error de validación responde `422` con `{ codigo, mensaje, detalles, idSolicitud }` sin repetir el valor ingresado, las operaciones 40, 41, 43 y 49 figuran en el registro con las tres banderas apagadas, y los controladores mínimos responden `404` sin cambios en los datos también al activar individualmente S1, S4 o S5 antes de implementar su lógica?

#### T-006: Implementar el adaptador de correo con Resend

- **HU relacionada:** Infraestructura (HU-001, HU-002, HU-003, HU-010)
- **Componente:** C14 Adaptador de correo
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-001
- **Descripción:** Crear el puerto de correo y su adaptador para Resend, que envía la cabecera `Idempotency-Key` y aplica un tiempo de espera de 10 s. Agregar las plantillas fijas (invitación, recuperación, aviso por cobrar y aviso por pagar) y el modo `CORREO_MODO=PRUEBA`, que redirige todos los destinatarios al buzón de prueba (RN-013). El puerto devuelve un resultado `ENVIADO`, `RECHAZADO` (el proveedor rechaza el envío) o `SIN_CONFIRMAR` (se agota el tiempo de espera o no se puede confirmar), y nunca reintenta por su cuenta: se desactivan los reintentos del cliente HTTP o del SDK (RN-098, QA-08).
- **Aplicación a avisos (M-05):** el puerto conserva sus diagnósticos compartidos; C11 transforma RECHAZADO en NO_ENVIADO/RECHAZO_PROVEEDOR y SIN_CONFIRMAR por tiempo de espera en NO_ENVIADO/TIEMPO_ESPERA. Un error de comunicación se registra como NO_ENVIADO/ERROR_COMUNICACION. El tiempo máximo efectivo es el restante hasta vence_en del intento; no se abre un flujo de verificación ni se altera el contrato de invitaciones.
- **Criterio de completitud:** ¿Con `CORREO_MODO=PRUEBA`, un test con el cliente de Resend simulado confirma que todo destinatario se reemplaza por el buzón de prueba y que se envía la clave de idempotencia recibida, y con el cliente simulado un rechazo devuelve `RECHAZADO` y un tiempo de espera de 10 s agotado devuelve `SIN_CONFIRMAR`, en ambos casos con una sola llamada al proveedor?

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
- **Descripción:** Convertir en tests de Jest los ejemplos de los criterios de aceptación de las HUs Must (reparto de cuotas, límites de 12 dígitos enteros y 120 cuotas, saldos, cambios de estado al anular, proyección e indicadores) en un archivo `casos-referencia`, con entradas y resultados esperados trazables a las reglas de negocio y los criterios correspondientes, sin aprobación humana específica de los casos (PRINCIPIO-007, E-014). Ejecutarlos en CI con el umbral de cobertura.
- **Criterio de completitud:** ¿La suite pasa, cubre todos los ejemplos numéricos de HU-005 a HU-008, cada caso identifica la regla o criterio del que derivan sus entradas y resultados esperados, y la cobertura de `packages/dominio` es del 80 % o más?

### 1.3 Acceso, auditoría y usuarios (Must)

#### T-011: Implementar inicio de sesión, sesiones, CSRF y autorización por rol

- **HU relacionada:** HU-002
- **Componente:** C3 Módulo Autenticación y sesiones
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-004, T-005
- **Descripción:** Implementar los endpoints 1, 2 y 3 (inicio y cierre de sesión, sesión vigente con su token CSRF), con la cookie `venceya_sesion`, los tokens de 256 bits guardados como SHA-256 y el bloqueo tras 5 fallos (RN-103). Resolver la empresa solo con `resolver_sesion` y `buscar_usuario_por_correo_ref` (C-01) y ejecutar después `SET LOCAL app.empresa_id` para todo lo demás. Crear los guards de sesión (30 minutos de inactividad sin contar `X-Peticion-Automatica` y 12 horas absolutas, RN-149), de CSRF y de rol según la matriz RN-060, y el servicio que cierra todas las sesiones de un usuario. El inicio de sesión y el guard de sesión comprueban `empresas.terminacion_efectiva_en <= ahora` con el reloj inyectado (RN-101, RN-149, RN-152): el login con la contraseña correcta responde `403 CONTRATO_TERMINADO` sin crear la sesión, y una sesión abierta se cierra con `motivo_cierre = 'CONTRATO_TERMINADO'` y responde `401 CONTRATO_TERMINADO`.
- **Criterio de completitud:** ¿Una petición POST sin `X-Token-CSRF` responde `403`, una sesión inactiva por 31 minutos responde `401`, el sexto intento tras 5 fallos se rechaza aunque la contraseña sea correcta, y con terminación efectiva a las 18:00:00 el login y una sesión abierta funcionan a las 17:59:59 pero a las 18:00:00 responden `CONTRATO_TERMINADO` (la sesión queda cerrada), mientras que una contraseña incorrecta sigue recibiendo la `401` neutra?

#### T-012: Implementar el servicio de auditoría e historial por campo

- **HU relacionada:** Infraestructura (transversal a HU-001, HU-003, HU-004, HU-005 y HU-009)
- **Componente:** C15 Auditoría, historiales y trazabilidad
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-005
- **Descripción:** Crear el servicio común que escribe `auditoria_eventos`, `historial_ediciones` y `registros_acceso`; ninguna otra tarea inserta en esas tablas (M-01). Ofrece `registrarEvento` (tipo, actor, afectado y `datos`) y `registrarCambios` (entidad, id y la lista de campos con su valor anterior y nuevo). Por defecto escribe en la transacción activa de T-005, así que una falla al auditar revierte el cambio del que llama. Para los eventos del resultado de un envío de correo (`INVITACION_ENVIADA` e `INVITACION_FALLIDA`) ofrece el modo de transacción propia: se escribe después de llamar al proveedor y, si falla, el error se registra en logs con `idSolicitud` y `empresa_id` y no se propaga (QA-08). Los valores anterior y nuevo se guardan en `valor_anterior` y `valor_nuevo`, sin cifrado (E-015), y nunca se escriben en logs. Agregar la operación `registrarAcceso` y un interceptor de NestJS que, con la acción y entidad declaradas en cada ruta, escribe en `registros_acceso` el usuario, la empresa, la acción, la entidad o recurso, el identificador afectado y la fecha y hora, sin datos personales, importes, criterios de búsqueda ni textos libres (RN-263, RN-264). En las escrituras se guarda en la transacción activa; en las consultas y exportaciones, antes de entregar la respuesta; si falla, la operación se revierte o responde `500` sin datos (RN-266). El servicio mantiene una lista cerrada de las claves permitidas en `datos` por tipo de evento, sin credenciales, tokens, hashes ni enlaces (RN-161), y los errores de este servicio no registran datos personales en logs.
- **Criterio de completitud:** ¿Al editar el correo de un contacto con `registrarCambios`, `historial_ediciones` guarda el valor anterior y el nuevo y ningún log los contiene; una clave no permitida en `datos` (por ejemplo `token`) se rechaza; una ruta de prueba con acción declarada deja su fila en `registros_acceso` sin datos personales ni el término de búsqueda, y una falla al escribir esa fila revierte la escritura o impide entregar la consulta; una falla al insertar el evento revierte el cambio hecho en la misma transacción; y, en el modo de transacción propia, una falla al escribir `INVITACION_FALLIDA` no revierte la operación de quien llama, no se propaga y deja el error en logs con `idSolicitud` y `empresa_id` pero sin el correo?

#### T-013: Implementar la activación por invitación y la recuperación de contraseña

- **HU relacionada:** HU-002
- **Componente:** C3 Módulo Autenticación y sesiones
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-006, T-011, T-012
- **Descripción:** Implementar el servicio de `enlaces_acceso` (emisión, vencimiento con límite exclusivo medido con el reloj del servidor, uso único, revocación del enlace anterior al emitir uno nuevo, RN-259) y los endpoints 4, 5 y 6. Resolver el enlace solo con `resolver_enlace` y el usuario con `buscar_usuario_por_correo_ref`, y seguir con `SET LOCAL app.empresa_id` (C-01). La vigencia se comprueba al canjear, no al abrir el enlace, y el canje de una recuperación comprueba que el usuario siga ACTIVO (RN-098, RN-102). La solicitud de recuperación responde de forma neutra exista o no el correo y sea cual sea el estado de la cuenta, y solo envía el enlace a un usuario ACTIVO (RN-258). Aplica el límite de 3 enlaces de recuperación por usuario en 60 minutos (RN-260): cuenta los enlaces `RECUPERACION` emitidos en ese plazo (los revocados siguen contando, porque `enlaces_acceso` los conserva) y, sobre el límite, responde la misma `202` sin emitir ni enviar y sin revocar el enlace vigente. El conteo y la emisión se hacen en una misma transacción que bloquea la fila del usuario (`SELECT … FOR UPDATE`), para que dos solicitudes simultáneas no emitan un cuarto enlace. Restablecer la contraseña cierra todas las sesiones del usuario, desbloquea la cuenta y reinicia `fallos_consecutivos` (RN-103). Un único validador de contraseña, compartido por la activación y el restablecimiento, se ejecuta en el servidor antes de consumir el enlace: de 8 a 128 caracteres, sin exigir composición, sin recortar ni normalizar, y rechaza vacía o solo espacios; el rechazo responde `422` sin consumir el enlace ni cambiar el estado ni la contraseña anterior (RN-246 a RN-253). Agregar el servicio compartido de invitación, que usan T-014 y T-015: emite el enlace dentro de la transacción de negocio, envía el correo por el puerto de T-006 fuera de esa transacción y registra el resultado con el servicio de T-012 en su modo de transacción propia (`INVITACION_ENVIADA` si es `ENVIADO`; `INVITACION_FALLIDA` con `datos.resultado` igual a `RECHAZADO` o `SIN_CONFIRMAR` en los demás casos, sin el token ni su hash). Un rechazo, un tiempo de espera o una falla al escribir ese evento nunca revierten la creación ni la emisión del enlace: si falla la escritura del evento, se responde igual con el resultado del envío y se registra el error en logs con `idSolicitud` y `empresa_id` (RN-098, QA-08).
- **Criterio de completitud:** ¿Un enlace usado o vencido responde `ENLACE_NO_VALIDO` o `ENLACE_VENCIDO`, y los bordes se respetan (invitación emitida a las 10:00:00: a las 09:59:59 del día 4 se acepta y a las 10:00:00 se rechaza y el usuario sigue INVITADO; recuperación emitida a las 08:00:00: a las 08:59:59 se acepta y a las 09:00:00 se rechaza y conserva la contraseña anterior), la recuperación devuelve la misma respuesta para un correo existente, uno inexistente, un usuario INVITADO y uno DESACTIVADO y solo envía correo al ACTIVO, un enlace de recuperación nuevo revoca el anterior, un enlace de recuperación de un usuario desactivado después de solicitarlo se rechaza sin cambiar la contraseña, con enlaces emitidos a las 10:00, 10:10 y 10:20 la solicitud de las 10:30 responde igual, no envía correo y deja vigente el enlace de las 10:20 mientras que la de las 11:00:00 sí envía, dos solicitudes simultáneas con 2 enlaces previos emiten solo uno más, tras restablecer la contraseña las sesiones anteriores quedan cerradas y una cuenta bloqueada queda desbloqueada con el contador en cero, una contraseña de 7 caracteres, de 129 o de solo espacios responde `422` con el motivo sin consumir el enlace ni activar al usuario ni cambiar la contraseña anterior, una de 8 y una de 128 sin mayúsculas, números ni símbolos se aceptan, « abcdefg » conserva sus espacios al iniciar sesión, con la empresa terminada la activación y el restablecimiento responden `403 CONTRATO_TERMINADO` sin consumir el enlace y la solicitud de recuperación responde neutra sin enviar correo, y el servicio de invitación, con Resend simulado, conserva el enlace vigente y escribe `INVITACION_FALLIDA` sin el token ni su hash tanto si rechaza el envío como si agota el tiempo de espera, no hace un segundo intento, y si además falla la escritura del evento devuelve igual el resultado del envío y deja el error en logs?

#### T-014: Implementar la API interna de alta de empresas

- **HU relacionada:** HU-001
- **Componente:** C4 Módulo Operaciones internas
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-012, T-013
- **Descripción:** Crear el punto de entrada `apps/api-interna`, que monta solo `/api/v1/interno/*`, se autentica con tokens de operaciones guardados como hash y usa el rol `venceya_operaciones`. Implementar los endpoints 7 y 8: el alta atómica de empresa, primer ADMINISTRADOR, enlace de invitación y auditoría con el servicio de T-012 (RN-211), y el reenvío de la invitación, que se rechaza con `EXISTE_ADMINISTRADOR_ACTIVO` si ya hay un administrador activo. El correo se envía con el servicio compartido de T-013, fuera de la transacción del alta, y su resultado se informa en `envioInvitacion`.
- **Criterio de completitud:** ¿Un RUC repetido responde `RUC_YA_REGISTRADO` sin crear filas, una falla simulada después de crear la empresa no deja ni empresa ni usuario, el reenvío de la invitación a una empresa con terminación efectiva responde `409 CONTRATO_TERMINADO` sin emitir enlace, la ruta `/api/v1/interno/empresas` responde `404` en la API pública, y con Resend simulado que rechaza el envío o agota el tiempo de espera el alta responde `201` con `RECHAZADO` o `SIN_CONFIRMAR`, la empresa y el administrador existen con el usuario INVITADO y su enlace vigente, existe `INVITACION_FALLIDA` sin el token, no hay segundo intento, y el reenvío posterior emite un enlace nuevo y revoca el anterior?

#### T-015: Implementar la administración de usuarios y roles

- **HU relacionada:** HU-003
- **Componente:** C5 Módulo Usuarios y configuración de empresa
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-012, T-013
- **Descripción:** Implementar los endpoints 9 a 15 (listar, invitar, obtener, cambiar rol, desactivar, reactivar y reenviar invitación), solo para ADMINISTRADOR. El cambio de rol y la desactivación cierran todas las sesiones del afectado y escriben la auditoría con el servicio de T-012 en la misma transacción (RN-100, RN-161), con bloqueo de fila para proteger al último administrador activo. La invitación, el reenvío y la reactivación de un usuario sin contraseña envían el correo con el servicio compartido de T-013, fuera de la transacción de negocio, e informan el resultado en `envioInvitacion`.
- **Criterio de completitud:** ¿Degradar o desactivar al único ADMINISTRADOR activo responde `ULTIMO_ADMINISTRADOR_ACTIVO`, tras un cambio de rol efectivo la sesión del afectado responde `401` y existe el evento `ROL_CAMBIADO`, y con Resend simulado que rechaza el envío o agota el tiempo de espera, invitar, reenviar y reactivar sin contraseña responden con `RECHAZADO` o `SIN_CONFIRMAR`, el usuario queda INVITADO con su enlace vigente, existe `INVITACION_FALLIDA` sin el token, no hay segundo intento y un nuevo intento de invitar al mismo correo se rechaza por existir ya?

### 1.4 Contactos, comprobantes y pagos (Must)

#### T-016: Implementar el catálogo de contactos

- **HU relacionada:** HU-004
- **Componente:** C6 Módulo Contactos
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-004, T-011, T-012
- **Descripción:** Implementar los endpoints 23 a 29: búsqueda paginada por nombre, alta, obtención, edición con `version` e historial por campo con el servicio de T-012, desactivación, reactivación y eliminación. El correo se guarda normalizado con T-004 y su unicidad por empresa la garantiza el índice único de T-003, incluidos los contactos desactivados (RN-140, RN-221). La eliminación se rechaza con `CONTACTO_CON_COMPROBANTES` si existe algún comprobante, aunque esté anulado; si procede, elimina el registro en la misma transacción, lo que libera su correo, y conserva sin cambios el historial de ediciones del contacto (pregunta 51, opción B; RN-255).
- **Criterio de completitud:** ¿Un correo repetido en la misma empresa responde `CORREO_CONTACTO_YA_REGISTRADO`, el mismo correo se acepta en otra empresa, ' Cliente@Example.com ' se rechaza si ya existe 'cliente@example.com' en la misma empresa, y tras eliminar un contacto sin comprobantes y con dos ediciones de correo el mismo correo se acepta en un contacto nuevo y las dos filas de `historial_ediciones` del eliminado siguen presentes y sin cambios?

#### T-017: Implementar el registro y la edición de comprobantes con cuotas

- **HU relacionada:** HU-005
- **Componente:** C7 Módulo Comprobantes y cuotas
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-007, T-012, T-016
- **Descripción:** Implementar los endpoints 30 a 34: propuesta de cuotas sin persistir, listado, registro atómico del comprobante con sus cuotas (contacto ACTIVO, número de documento normalizado y único entre no anulados según el sentido), obtención y edición. La edición solo se permite si el comprobante no está anulado, nunca tuvo pagos ni reprogramaciones (`COMPROBANTE_NO_EDITABLE`) y guarda el historial por campo con el servicio de T-012.
- **Criterio de completitud:** ¿Registrar « f001-00045 » por cobrar con F001-00045 vigente responde `COMPROBANTE_DUPLICADO`, el mismo número por pagar se acepta, y una falla simulada al guardar la cuota 3 no deja ni el comprobante ni sus cuotas?

#### T-018: Implementar el registro idempotente de pagos

- **HU relacionada:** HU-006
- **Componente:** C8 Módulo Pagos y anulaciones
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-008, T-017
- **Descripción:** Implementar los endpoints 36, 37 y 38. El registro exige la cabecera `Clave-Idempotencia` y, en una sola transacción, bloquea la cuota con `FOR UPDATE`, compara `versionCuota`, busca la clave (misma huella devuelve `200` con el pago original y otra huella responde `CLAVE_IDEMPOTENCIA_REUTILIZADA`) y aplica las validaciones del dominio. También marca `tuvo_pagos` en el comprobante.
- **Criterio de completitud:** ¿Un pago de S/ 600.01 sobre un saldo de S/ 600.00 responde `IMPORTE_SUPERA_SALDO`, la misma solicitud repetida devuelve el mismo pago sin crear otro, y un pago en US$ sobre una cuota en S/ se rechaza?

#### T-019: Implementar la anulación de pagos y de comprobantes

- **HU relacionada:** HU-007
- **Componente:** C8 Módulo Pagos y anulaciones
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-018
- **Descripción:** Implementar los endpoints 35 y 39, solo para SUPERVISOR y ADMINISTRADOR, con un motivo obligatorio normalizado según RN-162 (TRIM, mayúsculas, de 1 a 500 caracteres). La anulación de un pago crea un registro aparte, sin tocar el pago. La de un comprobante bloquea sus cuotas, exige que no tenga pagos vigentes (`COMPROBANTE_CON_PAGOS_VIGENTES`) y marca `anulado`.
- **Criterio de completitud:** ¿Un OPERADOR recibe `403`, un pago ya anulado responde `YA_ANULADO`, un motivo «   » o de 501 caracteres responde `422`, y tras anular un comprobante cualquier pago sobre sus cuotas se rechaza con `COMPROBANTE_ANULADO`?

#### T-020: Probar la inmutabilidad, la idempotencia y la concurrencia de pagos

- **HU relacionada:** HU-006, HU-007
- **Componente:** C8 Módulo Pagos y anulaciones / C16 Base de datos
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-019
- **Descripción:** Escribir tests de integración contra PostgreSQL real que verifiquen las reglas MUST de PRINCIPIO-006 y RN-156: UPDATE y DELETE sobre `pagos` y `anulaciones_*` rechazados con el rol `venceya_app`, solicitudes de pago concurrentes con la misma clave y con claves distintas, anulaciones concurrentes del mismo pago, y la carrera entre la anulación de un comprobante y un pago nuevo.
- **Criterio de completitud:** ¿Pasan los tests que confirman que 10 solicitudes paralelas con la misma clave crean 1 pago, que dos pagos concurrentes de S/ 400.00 y S/ 300.00 sobre un saldo de S/ 600.00 crean solo uno, y que el UPDATE directo sobre `pagos` falla?

### 1.5 Configuración, panel y avisos (Must)

#### T-021: Implementar la configuración de la empresa, las listas de copias y las preferencias

- **HU relacionada:** HU-008, HU-009
- **Componente:** C5 Módulo Usuarios y configuración de empresa
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-012, T-015
- **Descripción:** Implementar los endpoints 16 a 22: preferencias propias de moneda y ventana de proyección (7, 10 o 15 días), configuración de empresa (correo administrativo y moneda por defecto) y listas de copias por cobrar y por pagar. Solo un usuario ACTIVO y no OPERADOR puede entrar en una lista, y cada cambio se audita con el servicio de T-012 en la misma transacción.
- **Criterio de completitud:** ¿Agregar un OPERADOR a una lista responde `USUARIO_NO_ELEGIBLE_COPIAS`, agregarlo dos veces responde `USUARIO_YA_EN_LISTA`, y un SUPERVISOR recibe `403` en `/empresa/configuracion`?

#### T-022: Implementar el panel de cartera con un corte coherente

- **HU relacionada:** HU-008
- **Componente:** C10 Módulo Panel
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-009, T-019, T-021
- **Descripción:** Implementar `GET /panel` en una transacción `REPEATABLE READ READ ONLY` cuyo inicio define el `corte` y la `fechaCalculo` en America/Lima (ADR-008). Devuelve los indicadores, la proyección y el listado completo de movimientos en la moneda pedida (o en la preferida del usuario, o en la de la empresa), la marca de cuotas vencidas en la otra moneda y, con `incluirAnulados`, las cuotas ANULADAS fuera de los cálculos.
- **Criterio de completitud:** ¿La respuesta trae `corte` y `fechaCalculo`, los indicadores no cambian al activar `incluirAnulados`, y una cuota vencida en USD activa la marca de la otra moneda al consultar en PEN?

#### T-023: Implementar las cuotas por avisar y la vista previa del aviso

- **HU relacionada:** HU-010
- **Componente:** C11 Módulo Avisos
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-009, T-019, T-021
- **Descripción:** Implementar `GET /avisos/cuotas-por-avisar` con todas las cuotas con saldo, pendientes y vencidas, por cobrar y por pagar, sin limitarlas a la ventana del gráfico, con «Enviado» y la fecha del último envío exitoso vigente, o «No Enviado» y la acción «Enviar aviso» si no existe; informar solo los intentos EN_PROCESO cuyo plazo sigue vigente. Implementar `POST /avisos/vista-previa`, que arma el aviso con la plantilla fija y devuelve los destinatarios vigentes (contacto, correo administrativo y lista de copias del sentido) junto con su firma.
- **Criterio de completitud:** ¿Las cuotas de comprobantes anulados o con saldo cero no aparecen, y una cuota vencida fuera de la ventana de 15 días sí aparece?

#### T-024: Implementar el envío y la bandeja de avisos

- **HU relacionada:** HU-010
- **Componente:** C11 Módulo Avisos
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-006, T-023
- **Descripción:** Implementar POST /avisos/envios según ADR-006 y RN-066, RN-067, RN-138, RN-155 y RN-158. En la transacción 1 bloquear las cuotas, cerrar intentos vencidos y revalidar contrato, saldo, aptitud, tipo y destinatarios antes de guardar. Excluir cuotas no aptas con su motivo (CUOTA_CANCELADA, COMPROBANTE_ANULADO o SIN_SALDO); si no queda ninguna, responder 422 SIN_CUOTAS_APTAS sin crear intentos ni llamar a Resend. Una exclusión por sí sola no debe disparar DESTINATARIOS_CAMBIARON: validar los destinatarios de los grupos que siguen aptos. Rechazar cambios reales de destinatarios, reenvíos sin confirmar e intentos simultáneos vigentes (INTENTO_EN_PROCESO). Guardar el intento EN_PROCESO con destinatarios, contenido, cuotas y vence_en = creado_en + 10 s; fuera de la transacción llamar una sola vez al proveedor con su clave y el plazo restante. La transacción 2 guarda ENVIADO o NO_ENVIADO con motivo y libera las cuotas. Errores, tiempos de espera y caídas no dejan bloqueos indefinidos; las lecturas proyectan el cierre tras vencer el plazo y el siguiente envío lo persiste atómicamente. Un resultado tardío no cambia un intento cerrado. Implementar los endpoints 47 y 48 (bandeja paginada y detalle); no hay operación de verificación. Cada nuevo intento manual usa datos vigentes y otra clave.
- **Criterios de completitud:**
  - ¿Un rechazo o tiempo de espera simulado de 10 s termina como NO_ENVIADO con su motivo, conserva el intento, libera las cuotas y permite otro intento manual sin llamada automática al proveedor ni espera adicional?
  - ¿Dos solicitudes concurrentes sobre las mismas cuotas crean un solo intento y una llamada a Resend, mientras la otra responde INTENTO_EN_PROCESO, y una caída simulada permite otro envío después del plazo sin consultar al proveedor por el anterior ni aceptar resultados tardíos?
  - ¿Con una de dos cuotas cancelada entre vista previa y confirmación se envía solo la apta y se devuelve la excluida con motivo; si todas están canceladas o sus comprobantes anulados, se responde SIN_CUOTAS_APTAS con detalle, sin intentos nuevos ni llamadas al proveedor; y un pago parcial conserva la aptitud con el saldo actualizado?
  - ¿Se conservan los intentos históricos y la marca/fecha del último envío exitoso ante un intento posterior fallido, y un contacto desactivado no impide avisar sus cuotas aptas?
  - ¿Una empresa terminada no puede enviar, reenviar ni volver a intentar, sin llamar a Resend ni crear intentos? La comprobación contractual se repite dentro de la transacción 1, antes de autorizar el envío.
- **Estimación:** se mantiene L como previsión, sin atribuir ejecución. Si la estimación de implementación supera 2 h, separar envío y exclusiones de bandeja y cierre de intentos, actualizando dependencias y totales.

### 1.6 SPA web (Must)

#### T-025: Crear la base de la SPA y las pantallas de acceso

- **HU relacionada:** HU-002
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-011, T-013
- **Descripción:** Configurar shadcn/ui, el router, TanStack Query y un cliente HTTP tipado con `packages/contratos`, que envía `X-Token-CSRF` y redirige al inicio de sesión ante `401`; si el código es `CONTRATO_TERMINADO` (sesión abierta o inicio de sesión, activación o restablecimiento con `403`), la pantalla de inicio de sesión muestra un mensaje indicando que el contrato de la empresa terminó y que contacte a VenceYa. Crear el componente `CampoImporte` con el formato peruano, el formateo de fechas y la leyenda «Datos al DD/MM/AAAA, HH:mm», y un botón que se deshabilita mientras su solicitud está en curso. Construir las pantallas de inicio de sesión, activación y recuperación de contraseña.
- **Criterio de completitud:** ¿Un usuario de prueba activa su cuenta, inicia sesión y cierra sesión desde la SPA contra la API local, `CampoImporte` rechaza «1000.00» y acepta «1,000.00», y una respuesta `CONTRATO_TERMINADO` muestra el mensaje del contrato terminado en lugar de un inicio de sesión sin explicación?

#### T-026: Construir las pantallas de usuarios, configuración y copias

- **HU relacionada:** HU-003, HU-009
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-015, T-021, T-025
- **Descripción:** Construir la lista de usuarios con la invitación, el cambio de rol, la desactivación, la reactivación y el reenvío, visibles solo para ADMINISTRADOR. Agregar la pantalla de configuración de empresa (correo administrativo y moneda por defecto), la gestión de las dos listas de copias y la pantalla de preferencias personales para todos los roles.
- **Criterio de completitud:** ¿Un ADMINISTRADOR invita a un usuario y lo agrega a la lista de copias por cobrar desde la interfaz, y un OPERADOR no ve el menú de usuarios ni el de configuración?

#### T-027: Construir las pantallas de contactos y comprobantes

- **HU relacionada:** HU-004, HU-005
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-017, T-025
- **Descripción:** Construir el catálogo de contactos con búsqueda por nombre, alta, edición, desactivación, reactivación y eliminación con confirmación. Construir el formulario de comprobante con selector de contacto activo, «Pago único» o «En cuotas», la propuesta de cuotas editable y la diferencia visible entre la suma de cuotas y el total, sin ajustarla por su cuenta, y la vista de detalle con sus cuotas.
- **Criterio de completitud:** ¿Desde la interfaz se registra F001-00045 por US$ 3,000.00 en 3 cuotas, y al cambiar la cuota 1 de S/ 1,000.00 en 3 cuotas a S/ 400.00 se muestra la diferencia de S/ 66.67 y no se permite guardar?

#### T-028: Construir los formularios de pago y de anulación

- **HU relacionada:** HU-006, HU-007
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-019, T-027
- **Descripción:** Construir el formulario de pago, que genera la `Clave-Idempotencia` al abrirse, la reutiliza en los reintentos y deshabilita el botón durante el envío. Ante `IMPORTE_SUPERA_SALDO`, consulta de nuevo la cuota para mostrar el saldo vigente. Agregar los diálogos de anulación de pago y de comprobante con motivo obligatorio, visibles solo para SUPERVISOR y ADMINISTRADOR.
- **Criterio de completitud:** ¿Un doble clic en «Registrar pago» crea un solo pago, el saldo mostrado tras el rechazo viene de `GET /cuotas/{cuotaId}`, y un OPERADOR no ve la opción «Anular»?

#### T-029: Construir el panel de cartera con su gráfico accesible

- **HU relacionada:** HU-008
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-022, T-025
- **Descripción:** Construir el panel con las cuatro tarjetas de cartera, el selector de moneda con la marca de la otra moneda, el gráfico de proyección (Recharts) acompañado de su tabla equivalente, y el listado de movimientos con filtros y orden en el cliente y la opción «Incluir comprobantes anulados». Mostrar la leyenda «Datos al…» con el corte de la respuesta.
- **Criterio de completitud:** ¿El panel muestra los datos en S/ por defecto, cambia a US$ con el selector sin sumar monedas, y la tabla equivalente del gráfico se puede recorrer con el teclado?

#### T-030: Construir la pantalla de avisos y la bandeja interna

- **HU relacionada:** HU-010
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-024, T-025
- **Descripción:** Construir la lista de cuotas por avisar con selección, la vista previa con destinatarios y comentario opcional, el envío con botón deshabilitado, «Reenviar aviso» con confirmación, «No Enviado» con acción de envío manual ante error o tiempo de espera, y el detalle de cuotas excluidas con su motivo. Construir la bandeja interna con el detalle de cada intento.
- **Criterio de completitud:** ¿Con Resend simulado la respuesta exitosa muestra «Enviado» con su fecha, un rechazo o tiempo de espera muestra el error y permite otro envío manual sin verificación ni advertencia adicional, una cuota sin éxito previo muestra «No Enviado», un fallo posterior conserva el envío exitoso anterior y se muestran las exclusiones parciales y el rechazo SIN_CUOTAS_APTAS sin intento nuevo?

### 1.7 Testing transversal (Must)

#### T-031: Crear la suite e2e de aislamiento por empresa y privacidad de logs

- **HU relacionada:** HU-001 a HU-010 (requisitos transversales)
- **Componente:** C2 Capa transversal de la API / C16 Base de datos
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-014, T-022, T-024
- **Descripción:** Crear la suite `aislamiento.e2e`, dirigida por tabla: recorre el registro de rutas de `apps/api` y `apps/api-interna` y clasifica cada una de las 49 operaciones de `07-openapi.yaml` como «por identificador» (identificador en la ruta o en el cuerpo), «lectura sin identificador» (listados, panel, cuotas por avisar, bandeja de avisos y listas de copias) o «sin datos de empresa» (autenticación, operaciones internas y `proponerCuotas`). La suite falla si una operación no tiene clasificación, como T-032 falla si falta una ruta. Siembra dos empresas ficticias con datos distinguibles (PRINCIPIO-003, ADR-009). Las operaciones por identificador se llaman con identificadores de la otra empresa, exigiendo `404` y comprobando que no se modificó nada. Las lecturas sin identificador se comparan con datos distintos en cada empresa y con un control positivo: la respuesta de la empresa A debe incluir sus propios datos y ninguna fila ni importe de la B, porque un filtro ausente no produce un `404` sino datos ajenos. Las operaciones 40, 41, 43 y 49 figuran como «pendiente de bandera» (por identificador: 40, 41 y 49; lectura sin identificador: 43) y no se prueban con las banderas apagadas, porque su `404` es automático y no demuestra aislamiento; las prueban T-034, T-036 y T-038 con su disponibilidad habilitada. T-034 también repite la lectura agregada de cuotas por avisar con promesas activas propias y ajenas y S1 encendida. Al final, inspeccionar los logs capturados en busca de los correos y nombres de los fixtures (PRINCIPIO-005). Si al estimarla supera 2 h, separar en una tarea M las lecturas sin identificador y la inspección de logs.
- **Criterio de completitud:** ¿La tabla clasifica las 49 operaciones y la suite falla si una operación queda sin clasificar, las operaciones por identificador (en la ruta o en el cuerpo, como el contacto 88, el usuario 77 y la cuota 900) responden `404` con identificadores ajenos, las lecturas sin identificador devuelven los datos de la empresa A y ninguna fila ni importe de la B (con S/ 9,000.00 vencidos solo en la B, el panel de A muestra «Vencida por cobrar: S/ 0.00»; los listados, el panel, las cuotas por avisar y la bandeja no incluyen filas de la B), una tercera empresa sembrada con terminación efectiva vencida no puede iniciar sesión ni operar en ningún endpoint de negocio (`CONTRATO_TERMINADO`) sin que cambien sus datos, `resolver_sesion`, `buscar_usuario_por_correo` y `resolver_enlace` solo devuelven datos de la sesión, el correo o el enlace consultado (nunca de otra empresa) y `venceya_app` no puede leer `usuarios`, `sesiones` ni `enlaces_acceso` sin ellas, y los logs no contienen ningún correo ni nombre de los fixtures?

#### T-032: Verificar en CI que las rutas coinciden con el contrato OpenAPI

- **HU relacionada:** Infraestructura
- **Componente:** C2 Capa transversal de la API
- **Prioridad:** Must
- **Tamaño:** S
- **Dependencias:** T-002, T-014, T-024
- **Descripción:** Escribir un test que compara los pares método HTTP + ruta registrados en `apps/api` y `apps/api-interna` con las 49 operaciones de `07-openapi.yaml`, y agregarlo al workflow de CI. Incluir siempre las operaciones 40, 41, 43 y 49 registradas en T-005, aunque las banderas S1, S4 y S5 estén apagadas; no excluir operaciones por bandera. Inspeccionar el registro de rutas: recibir `404` en una petición no demuestra que una operación esté registrada.
- **Criterio de completitud:** ¿El test pasa con el MVP completo y las tres banderas apagadas, sin implementar T-034, T-036 ni T-038, y falla si se agrega un par método + ruta ajeno al YAML o falta cualquiera de sus operaciones, incluidas individualmente la 40, la 41, la 43 y la 49?

#### T-033: Automatizar las pruebas de accesibilidad de las pantallas

- **HU relacionada:** HU-002 a HU-010
- **Componente:** C1 SPA web
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-026, T-027, T-028, T-029, T-030
- **Descripción:** Configurar Playwright con axe-core y recorrer las pantallas Must en anchos de móvil y de escritorio, con reglas WCAG 2.2 AA. Agregar una prueba de navegación por teclado del flujo de registro de un pago y ejecutar todo en CI (PRINCIPIO-010).
- **Criterio de completitud:** ¿axe-core no reporta violaciones graves ni críticas en ninguna pantalla Must y el flujo de registro de un pago se completa solo con el teclado?

#### T-040: Registrar inicio y cierre de sesión y crear la suite de trazabilidad

- **HU relacionada:** HU-001 a HU-010 (requisitos transversales)
- **Componente:** C15 Auditoría, historiales y trazabilidad
- **Prioridad:** Must
- **Tamaño:** M
- **Dependencias:** T-011, T-012, T-014, T-022, T-024
- **Nota de numeración:** el ID se asigna al final para no renumerar las tareas existentes; sus dependencias tienen números menores, así que el grafo sigue sin ciclos.
- **Descripción:** Conectar el inicio de sesión exitoso y el cierre de sesión de T-011 con `registrarAcceso` de T-012 (RN-263). Crear la suite `trazabilidad.e2e`, dirigida por tabla como `aislamiento.e2e`: asigna a cada una de las 49 operaciones de `07-openapi.yaml` su acción (`CONSULTA`, `ALTA`, `EDICION`, `ANULACION`, `ELIMINACION`, `EXPORTACION`) y su entidad o recurso, o la marca «sin datos personales», y falla si una operación queda sin clasificar, de modo que una operación nueva (incluidas las Should) no quede sin trazabilidad por omisión. Ejecuta cada operación clasificada y comprueba su fila en `registros_acceso` sin datos personales, importes, criterios de búsqueda ni textos libres de los fixtures (RN-264). Simula una falla de escritura del registro y comprueba que una escritura se revierte y que una consulta o exportación responde `500` sin datos (RN-266). Las operaciones 40, 41, 43 y 49 se prueban con su bandera encendida en T-034, T-036 y T-038.
- **Criterio de completitud:** ¿La tabla clasifica las 49 operaciones y la suite falla si falta una; el inicio y cierre de sesión de Ana dejan sus filas con `usuario_id` y `empresa_id`; abrir el contacto 42 deja `CONSULTA contacto 42`; exportar movimientos deja `EXPORTACION reporte_movimientos`; ninguna fila contiene correos, nombres, importes ni el término de búsqueda de los fixtures; y con el registro forzado a fallar, el pago no se guarda y la consulta del contacto 42 no devuelve datos?

### 1.8 Ambientes y despliegue en la nube (Must; M-07)

Los IDs T-041 a T-043 se agregan sin renumerar las tareas existentes; todas sus dependencias tienen números menores. Cada tarea es L y debe dividirse antes de ejecutarla si su estimación supera 2 h. Las esperas por DNS, decisiones o aprobación humana no se cuentan como esfuerzo técnico ni habilitan a omitir un bloqueo.

#### T-041: Preparar los ambientes y la protección de producción

- **HU relacionada:** Infraestructura (PRINCIPIO-002, PRINCIPIO-004 y PRINCIPIO-011)
- **Componente:** Infraestructura (Railway, Neon y GitHub Actions)
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-002, T-003
- **Descripción:** Aprovisionar ambientes separados de pruebas y producción en Railway (US East, Virginia) y Neon (`us-east-1`), con bases, credenciales y secretos distintos; configurar las conexiones con `sslmode=require` y los roles de T-003 según cada servicio. Custodiar los secretos en variables de Railway con acceso restringido y documentar solo sus nombres y finalidad. Configurar `CORREO_MODO=PRUEBA` y el buzón autorizado fuera de producción. Crear el environment de producción en GitHub con aprobación humana obligatoria antes de que el job de despliegue acceda a sus credenciales; verificar que la cuenta o plan admite esa protección. Deshabilitar los despliegues automáticos de Railway a producción al hacer push o merge y restringir las credenciales e identidades de automatización para que no puedan desplegar por una vía alternativa sin aprobación. Preparar el workflow para desplegar un artefacto identificado por commit, manteniendo producción sin publicar hasta T-043.
- **Criterio de completitud:** ¿Las configuraciones evidencian las regiones y la separación de bases y secretos sin revelar valores, cada servicio usa su rol de base de datos, la conexión a Neon está cifrada, y una ejecución de prueba del job de producción queda esperando aprobación humana sin ejecutar migraciones ni despliegues, mientras un push o merge no dispara un despliegue directo en Railway? Si la protección requerida no está disponible, la tarea no se acepta ni se habilita producción.

#### T-042: Desplegar y verificar el ambiente de pruebas

- **HU relacionada:** Infraestructura (transversal a las HUs Must)
- **Componente:** Infraestructura (SPA, API pública y API interna)
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-014, T-024, T-025, T-041
- **Descripción:** Resolver los nombres y DNS de pruebas de la pregunta 53 y desplegar `apps/web` y `apps/api` bajo un mismo origen HTTPS: SPA en `/` y API en `/api`, mediante el enrutamiento público hacia ambos servicios. Aplicar las migraciones versionadas y desplegar `apps/api-interna` únicamente en la red privada, sin dominio ni puerto público y sin reenviarle tráfico desde el ingreso público. Configurar TLS 1.2 o superior y HSTS en SPA y API; HTTP no sirve contenido ni operaciones de la aplicación. Automatizar las comprobaciones para repetirlas sobre cada artefacto candidato. Verificar desde el navegador el inicio de sesión y una operación con CSRF conservando la cookie `HttpOnly; Secure; SameSite=Strict; Path=/api`. Mantener S1, S4 y S5 apagadas en la entrega Must. Usar datos ficticios y Resend simulado en pruebas automáticas; cualquier comprobación manual de correo queda limitada al buzón autorizado de RN-013.
- **Criterios de completitud:**
  - ¿Un cliente capaz de negociar TLS 1.0 y 1.1 demuestra que ambos se rechazan, TLS 1.2 o superior funciona, las respuestas HTTPS de SPA y API incluyen `Strict-Transport-Security` con `max-age` mayor que cero y HTTP no ejecuta operaciones ni entrega contenido de la aplicación?
  - ¿La API pública responde `404` en `/api/v1/interno/empresas`, el servicio interno no tiene exposición pública verificable desde Internet y una llamada autorizada desde la red privada sí funciona? Un `401` o `403` de un servicio interno expuesto no satisface el criterio.
  - ¿El navegador completa el flujo autenticado bajo el mismo origen, la aplicación consulta Neon por TLS con el rol previsto y ningún correo de pruebas puede alcanzar un destinatario fuera del buzón autorizado?

#### T-043: Habilitar y verificar producción con aprobación humana

- **HU relacionada:** Infraestructura (entrega de las HUs Must)
- **Componente:** Infraestructura (promoción y verificación de la entrega)
- **Prioridad:** Must
- **Tamaño:** L
- **Dependencias:** T-010, T-020, T-031, T-032, T-033, T-040, T-042
- **Descripción:** Validar en pruebas el artefacto candidato con todas las tareas Must completas y sus checks en verde, registrar su commit y promover ese mismo artefacto a producción únicamente después de la aprobación humana del environment protegido. Antes de habilitar producción, exigir el cierre de las preguntas 26 y 31, el dominio remitente configurado de la 39 y los nombres y DNS de producción de la 53. Como evidencia operativa de RN-240, restaurar un respaldo de pruebas con datos ficticios en una base aislada y verificar integridad, inicio de sesión y rechazo de duplicados según RN-140, sin tocar datos de producción. Configurar el mismo origen HTTPS de producción y repetir allí las comprobaciones de T-042 con una cuenta y datos ficticios, sin enviar correos a clientes reales. Guardar evidencia sin secretos del commit, checks, aprobación, restauración, TLS/HSTS, conexión cifrada y acceso privado de la API interna. Mantener las Should apagadas hasta su propia aceptación.
- **Criterio de completitud:** ¿El despliegue permanece bloqueado antes de la aprobación humana y ante cualquiera de los pendientes previos, tras resolverlos despliega exactamente el artefacto validado en pruebas, la restauración aislada cumple RN-240 y producción supera las comprobaciones de T-042 sin exponer la API interna ni enviar notificaciones reales? La aprobación de un PR no sustituye la aprobación del despliegue. Un documento de configuración por sí solo no satisface la tarea.

### 1.9 Funcionalidades Should (después del MVP)

#### T-034: Implementar la reprogramación y la visibilidad de promesas activas

- **HU relacionada:** HU-011
- **Componente:** C9 Módulo Reprogramaciones / C11 Módulo Avisos / C12 Núcleo de dominio
- **Prioridad:** Should
- **Tamaño:** L
- **Dependencias:** T-019, T-023
- **Descripción:** Extender `calcularFechaEfectiva` y agregar `clasificarPromesa` (ACTIVA, CUMPLIDA, INCUMPLIDA) en el dominio, con pruebas automáticas de referencia. Implementar los endpoints 40 y 41 detrás de `FUNCIONALIDAD_S1`: una sola promesa no reemplazada por cuota, saldo mayor que cero (`CUOTA_SIN_SALDO`), comprobante no anulado y marca `tuvo_reprogramaciones` en la misma transacción. Cubrir RN-080, RN-118 y los criterios de concurrencia de HU-011. Extender `GET /avisos/cuotas-por-avisar` (44): con S1 devuelve `promesaActiva` (fecha prometida y usuario que la registró) para todos los roles de la misma empresa; sin S1 devuelve null. Clasificarla con el mismo corte y fecha de cálculo de la respuesta. No mostrar como activas las reemplazadas, cumplidas, incumplidas ni las de comprobantes anulados; una cuota con saldo cero no aparece. Una anulación de pago actualiza la clasificación conforme a HU-011. Si la estimación detallada supera 2 h, dividir antes de implementar.
- **Continuidad de T-005 (C-02):** Incorporar la lógica a los controladores mínimos 40/41 ya registrados, sin duplicar rutas; conservar el registro y el `404` con S1 apagada.
- **Criterio de completitud:** ¿Con S1 apagada 40/41 responden `404` y 44 devuelve `promesaActiva: null`; con S1 encendida la fecha prometida se usa en cartera y avisos, una promesa del OPERADOR aparece al consultar 44 con cada uno de los tres roles de su empresa, y deja de mostrarse como activa al reemplazarla, cumplirse, incumplirse o anularse su comprobante? ¿40/41 pasan `aislamiento.e2e` con S1 encendida (cuota 900 ajena: `404`, sin crear promesa), 44 incluye las promesas propias y ninguna de otra empresa, y T-032 sigue pasando con las banderas apagadas y encendidas?

#### T-035: Agregar la reprogramación y las promesas activas en la interfaz

- **HU relacionada:** HU-011
- **Componente:** C1 SPA web
- **Prioridad:** Should
- **Tamaño:** L
- **Dependencias:** T-028, T-030, T-034
- **Descripción:** Agregar en el detalle de la cuota la acción «Reprogramar» con la fecha prometida, la marca de reprogramada y la lista de promesas con su fecha original. En el panel de notificaciones (pantalla de avisos de T-030), mostrar la fecha prometida y quién registró cada promesa activa, para OPERADOR, SUPERVISOR y ADMINISTRADOR, sin filtrar por su creador. Usar `promesaActiva` del contrato y actualizar los datos tras una reprogramación, pago o anulación, y al refrescar la consulta; la clasificación la determina el servidor. Las opciones S1 solo aparecen con `FUNCIONALIDAD_S1` encendida. La lista de promesas no sustituye el historial completo de T-039. El tamaño pasa de M a L por integrar la pantalla de avisos y sus pruebas.
- **Criterio de completitud:** ¿Una cuota se reprograma desde la interfaz y conserva su marca, la promesa registrada por un OPERADOR es visible al abrir notificaciones con cada uno de los tres roles de la empresa y se actualiza al reemplazarla o dejar de estar activa, y con S1 apagada no aparecen la acción ni la presentación de promesas? ¿La pantalla se opera por teclado y axe-core no informa violaciones graves ni críticas en los elementos incorporados?

#### T-036: Implementar el tiempo promedio de cobro

- **HU relacionada:** HU-012
- **Componente:** C10 Módulo Panel
- **Prioridad:** Should
- **Tamaño:** L
- **Dependencias:** T-022
- **Descripción:** Implementar `calcularTiempoPromedioCobro` en el dominio, con dos decimales y las reglas de redondeo y selección de QA-10 y QA-11, y sus casos de referencia automatizados, con trazabilidad a RN-053, RN-147 y HU-012, sin dependencia de aprobación humana específica (PRINCIPIO-007, E-014). Implementar `GET /panel/tiempo-promedio-cobro` detrás de `FUNCIONALIDAD_S5`, con su propio corte, el último mes completo por defecto, el mes actual marcado como parcial, `MES_FUTURO` para meses futuros y «Sin datos» sin comprobantes elegibles.
- **Continuidad de T-005 (C-02):** Incorporar la lógica funcional al controlador mínimo de la operación 43 ya registrado en T-005, sin duplicar rutas. Conservar su registro y la respuesta `404` con la bandera apagada.
- **Criterio de completitud:** ¿Los casos de referencia automatizados de HU-012, incluidos QA-10 y QA-11, pasan con entradas y resultados esperados trazables a sus reglas y criterios, la cobertura de sus módulos de dominio es del 80 % o más, un mes futuro responde `MES_FUTURO`, con la bandera apagada el endpoint responde `404`, la operación 43 pasa en `aislamiento.e2e` con la bandera encendida (con un comprobante de 30 días en la empresa A y uno de 90 días en la B, el promedio de A es 30.00 días), y T-032 sigue pasando con la bandera apagada y encendida?

#### T-037: Agregar la tarjeta de tiempo promedio de cobro al panel

- **HU relacionada:** HU-012
- **Componente:** C1 SPA web
- **Prioridad:** Should
- **Tamaño:** S
- **Dependencias:** T-029, T-036
- **Descripción:** Agregar al panel una tarjeta propia con selector de mes, independiente del selector de moneda, que muestra los días con dos decimales, la marca «parcial» para el mes actual o «Sin datos». Solo aparece con `FUNCIONALIDAD_S5` encendida.
- **Criterio de completitud:** ¿La tarjeta muestra el último mes completo por defecto, no cambia al cambiar la moneda del panel y no aparece con la bandera apagada?

#### T-038: Implementar la consulta del historial cronológico de una cuota

- **HU relacionada:** HU-017 (compartida por S1 y S4)
- **Componente:** C15 Auditoría e historiales / C7 Comprobantes y cuotas / C12 Núcleo de dominio
- **Prioridad:** Should
- **Tamaño:** L
- **Dependencias:** T-012, T-019
- **Descripción:** Incorporar la lógica al controlador mínimo 49 de T-005: `GET /cuotas/{cuotaId}/historial`. C15 coordina una lectura `REPEATABLE READ READ ONLY` de comprobante, cuota, ediciones, pagos, anulaciones y promesas, filtrados por empresa; devuelve `corte`, `fechaCalculo` y eventos según RN-078. C12 calcula las transiciones con la fecha de cálculo inyectada; no se guardan VENCIDA, CANCELADA ni REAPERTURA ni se reconstruyen consultas anteriores. Ordenar por fecha del hecho y desempates RN-078; mostrar además actor y fecha/hora de registro en los hechos de usuario. Conservar el pago anulado, su anulación con importe, ediciones y reprogramaciones con fecha anterior/nueva. No crear tablas ni un segundo escritor de auditoría; leer lo conservado por T-012/T-017 y los registros de negocio. Funciona sin promesas cuando S4 se entregue primero y usa las promesas conservadas cuando existan; no depende de T-034. Disponible con `FUNCIONALIDAD_S1 || FUNCIONALIDAD_S4`; con ambas apagadas responde `404`. S4 sigue sin reporte/exportaciones implementados. Si la estimación detallada supera 2 h, separar cálculo y consulta antes de implementar.
- **Criterio de completitud:** ¿Los casos de HU-017 y RN-078 pasan como pruebas automáticas trazables (retroactividad, anulación y reapertura, conservación de hechos, ediciones, reprogramaciones y empates), el caso de S/ 1,000.00 con pago retroactivo de S/ 600.00 del 14/10 muestra CANCELADA el 14/10 y elimina VENCIDA del 16/10, y la respuesta conserva los metadatos de un solo corte? ¿Con ambas banderas apagadas devuelve `404`; con solo S1 y con solo S4 la cuota propia devuelve `200` y la cuota 900 ajena o inexistente devuelve el mismo `404` en `aislamiento.e2e`, sin devolver eventos ajenos ni escribir datos? ¿T-032 pasa en todas esas combinaciones y la cobertura del cálculo de dominio es ≥ 80 %?

#### T-039: Agregar el historial cronológico al detalle de la cuota

- **HU relacionada:** HU-017 (compartida por S1 y S4)
- **Componente:** C1 SPA web
- **Prioridad:** Should
- **Tamaño:** L
- **Dependencias:** T-028, T-038
- **Descripción:** Agregar «Ver historial» al detalle de cada cuota para los tres roles de la empresa. Mostrar en el orden recibido emisión, ediciones por campo, reprogramaciones con fechas anterior/nueva, pagos, anulaciones con importe y transiciones; identificar pagos anulados, actor y fecha/hora de registro informativa. Mostrar «Datos al DD/MM/AAAA, HH:mm» en America/Lima a partir del corte y distinguir fecha del hecho de la de registro. Actualizar desde la API después de pagos, anulaciones o reprogramaciones: no mantener transiciones derivadas desaparecidas. Disponible con S1 o S4, oculta con ambas apagadas; no exige reporte ni exportaciones de S4. Reutilizar esta vista cuando se entregue la otra capacidad.
- **Criterio de completitud:** ¿OPERADOR, SUPERVISOR y ADMINISTRADOR consultan el mismo historial de su empresa con las fechas y el orden de HU-017, el pago anulado permanece identificado y las transiciones cambian al recargar después de una corrección, sin permitir consulta de cuotas ajenas? ¿La vista funciona con solo S1 y con solo S4, sin promesas si no existen, queda oculta con ambas apagadas, se opera por teclado y axe-core no informa violaciones graves ni críticas?

---

## 2. Resumen

### 2.1 Totales

**Total de tareas:** 43. Se superan las 20 a 25 recomendadas para cumplir la restricción de hasta 2 horas por tarea: el conjunto planificado abarca 13 HUs (10 Must y 3 Should), 49 operaciones REST, 16 componentes y el despliegue en la nube, así que agruparlas obligaría a tareas mayores de 2 horas.

**Esfuerzo estimado** (tope de cada tamaño: S = 0.5 h, M = 1 h, L = 2 h): 68 h en total, de las cuales 57.5 h son Must y 10.5 h son Should. M-06 suma 5 h: T-035 pasa de M a L (+1 h), T-038 es L (+2 h) y T-039 es L (+2 h). E-015 suma 1 h: T-004 pasa de L a M (−1 h), T-012 pasa de M a L (+1 h) y se agrega T-040 de tamaño M (+1 h). M-07 suma 7 h: T-002 pasa de M a L (+1 h) y se agregan T-041 a T-043 (L, +6 h); T-001 conserva M. Las estimaciones son topes de planificación y deben dividirse si superan 2 h por tarea; no incluyen las esperas externas ni de aprobación.

### 2.2 Desglose por prioridad

| Prioridad | Tareas | Cantidad |
|---|---|---|
| Must | T-001 a T-033 y T-040 a T-043 | 37 |
| Should | T-034 a T-039 | 6 |
| Could | Ninguna (C1 y C3 no tienen diseño técnico) | 0 |
| **Total** | | **43** |

### 2.3 Desglose por tipo

| Tipo | Tareas | Cantidad |
|---|---|---|
| Setup | T-001, T-002, T-003, T-004, T-005, T-006, T-041 | 7 |
| Features (dominio y backend) | T-007, T-008, T-009, T-011, T-012, T-013, T-014, T-015, T-016, T-017, T-018, T-019, T-021, T-022, T-023, T-034, T-036, T-038 | 18 |
| Integración (SPA, API, Resend y despliegue) | T-024, T-025, T-026, T-027, T-028, T-029, T-030, T-035, T-037, T-039, T-042, T-043 | 12 |
| Testing | T-010, T-020, T-031, T-032, T-033, T-040 | 6 |
| **Total** | | **43** |

**Tests de reglas Must:** T-010 (cálculos financieros, PRINCIPIO-007), T-020 (inmutabilidad e idempotencia de pagos, PRINCIPIO-006 y RN-156) T-031 (aislamiento por empresa y privacidad, PRINCIPIO-003 y PRINCIPIO-005) y T-040 (trazabilidad de accesos, PRINCIPIO-005 y RN-263 a RN-266). Además, cada tarea de feature tiene su criterio de completitud verificado con pruebas.

### 2.4 Desglose por componente

| Componente | Tareas | Cantidad |
|---|---|---|
| Infraestructura (monorepo, CI y despliegue) | T-001, T-002, T-041, T-042, T-043 | 5 |
| C1 SPA web | T-025, T-026, T-027, T-028, T-029, T-030, T-033, T-035, T-037, T-039 | 10 |
| C2 Capa transversal de la API | T-005, T-031, T-032 | 3 |
| C3 Autenticación y sesiones | T-011, T-013 | 2 |
| C4 Operaciones internas | T-014 | 1 |
| C5 Usuarios y configuración de empresa | T-015, T-021 | 2 |
| C6 Contactos | T-016 | 1 |
| C7 Comprobantes y cuotas | T-017 | 1 |
| C8 Pagos y anulaciones | T-018, T-019, T-020 | 3 |
| C9 Reprogramaciones | T-034 | 1 |
| C10 Panel | T-022, T-036 | 2 |
| C11 Avisos | T-023, T-024 | 2 |
| C12 Núcleo de dominio puro | T-007, T-008, T-009, T-010 | 4 |
| C13 Servicio de hash | T-004 | 1 |
| C14 Adaptador de correo | T-006 | 1 |
| C15 Auditoría, historiales y trazabilidad | T-012, T-038, T-040 | 3 |
| C16 Base de datos | T-003 | 1 |
| **Total** | | **43** |

Para este desglose cada tarea se cuenta una vez por su componente principal: T-034 en C9 (también modifica C11/C12) y T-038 en C15 (coordina C7/C12).

C15 (Auditoría, historiales y trazabilidad) lo construye T-012 (M-01) y es la única vía de escritura de `auditoria_eventos`, `historial_ediciones` y `registros_acceso`; T-040 conecta el inicio y cierre de sesión y verifica la trazabilidad de todas las operaciones. Lo usan T-013 (eventos de invitación), T-014 (alta de empresa), T-015 (roles y desactivaciones), T-016 (historial de contactos), T-017 (historial de comprobantes) y T-021 (listas de copias y configuración). Salvo los eventos del resultado de un envío de correo, que se escriben en una transacción propia, la auditoría y el historial se escriben en la misma transacción que cada cambio, como exige la arquitectura. Las anulaciones de pagos y comprobantes (T-019) no escriben un evento de C15: su propio registro ya guarda el motivo, el usuario y la fecha (RN-029 a RN-032). T-020 y T-031 también prueban C16. T-038 agrega la lectura cronológica RN-078; no modifica la exclusividad de escritura de T-012 ni equivale al historial por campo.

### 2.5 Desglose por tamaño

| Tamaño | Tareas | Cantidad | Horas (tope) |
|---|---|---|---|
| S (< 30 min) | T-032, T-037 | 2 | 1 |
| M (30 min - 1 h) | T-001, T-004, T-006, T-007, T-008, T-009, T-010, T-019, T-020, T-021, T-022, T-023, T-028, T-033, T-040 | 15 | 15 |
| L (1 - 2 h) | T-002, T-003, T-005, T-011, T-012, T-013, T-014, T-015, T-016, T-017, T-018, T-024, T-025, T-026, T-027, T-029, T-030, T-031, T-034, T-035, T-036, T-038, T-039, T-041, T-042, T-043 | 26 | 52 |
| **Total** | | **43** | **68** |

### 2.6 Ruta crítica

La ruta crítica del MVP hasta la verificación de producción es la cadena de dependencias más larga, medida con el tope de cada tamaño. Sin límite de recursos y sin contar las esperas externas por decisiones, DNS o aprobación humana:

```text
T-001 → T-003 → T-005 → T-011 → T-016 → T-017 → T-018 → T-019 → T-023 → T-024 → T-030 → T-033 → T-043
  M       L       L       L       L       L       L       M       M       L       L       M       L
 1 h     2 h     2 h     2 h     2 h     2 h     2 h     1 h     1 h     2 h     2 h     1 h     2 h   = 22 h
```

- **Qué la define:** la base de datos y la capa transversal habilitan la autenticación; sobre ella se construye la cadena de negocio (contactos → comprobantes → pagos → anulaciones), de la que dependen los avisos, su pantalla y la prueba de accesibilidad. La construcción y las pruebas terminan en la hora 20; T-043 añade 2 h para habilitar y verificar producción.
- **Cadenas casi críticas:** la de usuarios (T-011 → T-013 → T-015 → T-021, que llega a T-023 con 2 h de holgura) y la del panel (T-019 → T-022 → T-029 → T-033, con 2 h de holgura).
- **T-012:** depende solo de T-005 y ahora es L (E-015), así que termina en la hora 7, junto con T-011, y T-013 y T-016 empiezan en la hora 7 como antes. No mueve la ruta crítica.
- **T-040:** empieza al terminar T-024 (hora 17) y termina en la hora 18, con 2 h de holgura antes de iniciar T-043.
- **T-004:** pasa a M y termina en la hora 2; no bloquea T-011 ni T-016.
- **T-031:** empieza al terminar T-024 (hora 17; T-022 termina en la 15) y termina en la hora 19, con 1 h de holgura antes de iniciar T-043. Si crece a más de 2 h, se separa como indica la tarea.
- **Despliegue (M-07):** T-002 termina en la hora 3 tras pasar a L; T-041 espera T-002 y T-003 y termina en la 5. T-042 espera también T-014, T-024 y T-025: se ejecuta de la hora 17 a la 19. T-043 espera las suites Must y T-042: se ejecuta de la 20 a la 22. Los pendientes 26, 31, 39 y 53 y la aprobación humana pueden extender el plazo calendario, sin reducir las dependencias técnicas.
- **Paralelizables desde el inicio:** T-002, T-004, T-006 y la cadena del dominio T-007 → T-008 → T-009 → T-010 no bloquean la ruta crítica si se terminan antes de T-011 y T-017.
- **Should:** T-034 a T-039 quedan fuera de las dependencias del despliegue Must. T-034 puede empezar al terminar T-023 y T-036 al terminar T-022. T-035 espera también T-030: termina en la hora 21 (sin límite de recursos), frente a T-038 en la 16 y T-039 en la 18; S1 completa requiere las cuatro tareas T-034/T-035/T-038/T-039. T-038 no depende de T-034 y permite reutilizar el historial con S4 primero. Estas horas expresan dependencias técnicas; no adelantan la entrega Should al MVP ni activan sus banderas.

### 2.7 Grafo de dependencias

Vista de las dependencias principales; el campo **Dependencias** de cada tarea contiene la lista completa. La entrega en producción espera explícitamente las verificaciones Must y el ambiente de pruebas.

```text
T-001 ─┬─ T-002 ──────────────────────────────────────────┬─ T-010    T-032 (T-002, T-014, T-024)
       ├─ T-003 ── T-005 ─┐                               │
       ├─ T-004 ──────────┼─ T-011 ─┬─ T-013 ─┬─ T-014    │
       ├─ T-006 ──────────┼─────────┘         └─ T-015 ── T-021 ─┐
       └─ T-007 ── T-008 ── T-009 ────────────────────────┘      │
                                                                 │
T-011 ── T-016 ── T-017 ── T-018 ── T-019 ─┬─ T-020              │
                                           ├─ T-022 ◄────────────┤ ── T-029 ── T-037 (con T-036)
                                           ├─ T-023 ◄────────────┘ ── T-024 ── T-030
                                           └─ T-034 (con T-023) ── T-035 (con T-028 y T-030)

T-025 (T-011, T-013) ── T-026, T-027 ── T-028 ── T-033 (T-026 a T-030)
T-031 (T-014, T-022, T-024) · T-040 (T-011, T-012, T-014, T-022, T-024) · T-036 (T-022)
T-012, T-019 ── T-038 (historial) ── T-039 (con T-028)

T-005 ── T-012 (auditoría y trazabilidad) ──► T-013, T-014, T-015, T-016, T-017, T-021

T-002, T-003 ── T-041 (ambientes y protección)
T-014, T-024, T-025, T-041 ── T-042 (despliegue y verificación de pruebas)
T-010, T-020, T-031, T-032, T-033, T-040, T-042 ── T-043 (producción con aprobación humana)
```
