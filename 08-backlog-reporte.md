# 08 - Reporte de auditoría QA del Spec Pack (backlog)

**Fase BMAD:** construcción, a cargo del Agente QA de Backlog (QA Architect Senior).
**Fecha:** 2026-11-09.
**País de operación:** Perú. **Zona horaria de negocio:** America/Lima.
**Instrucciones:** `08-backlog-qa.xml`.
**Insumos auditados:** `02-alcance.md`, `03-reglas-de-negocio.md`, `06-user-stories.md`, `07-architecture.md` y `08-backlog.md`. Para verificar algunos hallazgos se consultaron también `00-constitucion.md`, `07-openapi.yaml` y `05-preguntas-abiertas.md`.
**Método:** las reglas, sus prioridades y las referencias RN de cada HU se extrajeron con un script y se cruzaron con la tabla de requisitos transversales, el inventario de componentes y las 36 tareas. Además se recalcularon las dependencias, los totales y la ruta crítica del backlog, y se revisó a mano cada criterio de completitud contra los criterios de aceptación de su HU.

---

## 1. Resumen ejecutivo

**Veredicto:** el backlog es sólido en su estructura, pero **no está listo para iniciar el sprint** hasta resolver 3 hallazgos críticos. Las 36 tareas trazan a una HU o a un requisito transversal, el grafo de dependencias no tiene ciclos y los totales, el esfuerzo y la ruta crítica coinciden con un recálculo independiente. Los problemas están en tres decisiones de diseño sin resolver (RLS antes de la autenticación, contrato OpenAPI con operaciones Should y terminación contractual) y en criterios de HUs Must que no llegaron a las tareas.

| Indicador | Valor |
|---|---|
| Reglas del catálogo | 259 IDs: 7 retiradas y 252 vigentes (222 MUST, 30 SHOULD) |
| Reglas MUST con cobertura | 218 de 222 (98.2 %): 171 en HUs aprobadas y 47 solo como requisito transversal (*Definition of Done*) |
| Reglas MUST sin HU aprobada | 4: RN-152 y RN-079 (solo en HUs sugeridas), RN-151 y RN-257 (sin HU) |
| HUs aprobadas | 12 (10 Must y 2 Should); las 12 tienen componente y tareas |
| Componentes de arquitectura | 16; 15 tienen tareas y C15 (Auditoría e historiales) no tiene tarea propia |
| Tareas | 36 (32 Must y 4 Should), sin tareas huérfanas; 4 tareas de infraestructura trazan a principios y no a una HU |
| Dependencias | DAG válido: ninguna tarea depende de otra con un número mayor |
| Esfuerzo y ruta crítica | 53 h (47.5 h Must y 5.5 h Should); ruta crítica de 20 h, confirmada |
| **Hallazgos** | **3 críticos · 11 mayores · 12 sugerencias** |

**Orden de resolución recomendado:**

1. Antes del sprint 1: C-01 (diseño de RLS para la autenticación, afecta a T-003 y T-011) y C-02 (prueba de contrato de T-031).
2. Antes de cerrar la planificación del MVP: C-03 (decisión del PO sobre HU-018 y RN-152), M-01 (servicio de auditoría) y M-07 (despliegue y ambientes).
3. Durante el sprint, antes de empezar cada tarea afectada: los demás mayores, ajustando los criterios de completitud.

---

## 2. Hallazgos

### 2.1 Críticos (bloquean la implementación)

#### C-01: No está definido cómo funciona la autenticación bajo RLS

- **Dónde:** `07-architecture.md` §3.3 (RLS) y ADR-009; `08-backlog.md` T-003, T-011 y T-012.
- **Hallazgo:** ADR-009 exige que todas las tablas de negocio filtren por `app.empresa_id`, y T-003 pide como criterio que con `venceya_app` «una consulta sin `app.empresa_id` no devuelve filas». Pero varias operaciones de C3 ocurren **antes** de conocer la empresa:
  - el inicio de sesión busca el usuario por `correo_ref`, que es único global;
  - cada petición resuelve la sesión por `token_hash`;
  - la activación y la recuperación resuelven el enlace por `token_hash`;
  - la solicitud de recuperación busca el usuario por correo.

  `usuarios` tiene `empresa_id`, mientras que `sesiones` y `enlaces_acceso` no lo tienen. La arquitectura no aclara si estas tablas quedan fuera de RLS, si se usa una función `SECURITY DEFINER` o si se usa otro rol.
- **Impacto:** si `usuarios` tiene RLS, T-011 no puede implementarse tal como está. Si no lo tiene, existe una excepción a PRINCIPIO-003 que nadie aprobó ni probó. T-011 está en la ruta crítica, así que el bloqueo alcanza a todo el backlog.
- **Acción:**
  1. Agregar a `07-architecture.md` §3.3 una decisión explícita, por ejemplo: «`usuarios`, `sesiones` y `enlaces_acceso` se consultan antes de la autenticación solo mediante las funciones `SECURITY DEFINER` `resolver_sesion(token_hash)`, `buscar_usuario_por_correo_ref(ref)` y `resolver_enlace(token_hash)`, que devuelven el `empresa_id` con el que luego se ejecuta `SET LOCAL`».
  2. Agregar a T-003 el criterio «las tres funciones existen y son las únicas vías de lectura sin `app.empresa_id`».
  3. Agregar a T-030 un caso que confirme que esas funciones no exponen datos de otra empresa.

#### C-02: La prueba de contrato de T-031 falla con el código del MVP

- **Dónde:** `08-backlog.md` T-031; `07-openapi.yaml` (operaciones 40, 41 y 43).
- **Hallazgo:** T-031 (Must) compara las rutas registradas con las 49 operaciones del YAML y debe fallar «si falta una operación del YAML». Pero las operaciones 40 y 41 (S1) y la 43 (S5) se implementan recién en T-033 y T-035, que son Should. Con el código del MVP solo existen 46 rutas, así que la prueba nunca pasa en verde. El YAML tampoco tiene una marca (por ejemplo `x-funcionalidad`) que permita excluir esas operaciones.
- **Impacto:** el CI queda en rojo desde que se integra T-031, y eso bloquea los merges del MVP (PRINCIPIO-012 exige la rama protegida). Es contradictorio con el propio criterio de T-031: «el test pasa con el código actual».
- **Acción:** elegir una de dos opciones y reflejarla en T-005 o en T-031.
  - **(a) Recomendada:** registrar en T-005 controladores mínimos para las operaciones 40, 41 y 43 detrás de `FUNCIONALIDAD_S1` y `FUNCIONALIDAD_S5`, que respondan `404`. El criterio de T-005 ya prevé ese comportamiento.
  - **(b)** Agregar `x-funcionalidad: S1` o `S5` a esas operaciones del YAML y hacer que T-031 las excluya mientras su bandera no esté implementada.

#### C-03: RN-152 (terminación contractual) es MUST y no tiene HU aprobada ni tareas

- **Dónde:** `03-reglas-de-negocio.md` RN-152 (y RN-150); `06-user-stories.md` HU-018, sugerida con prioridad **Must**; `07-architecture.md` §3.1 (`empresas.estado_contrato`, `terminacion_efectiva_en`) y ADR-002; `08-backlog.md`, criterios de esta versión.
- **Hallazgo:** RN-152 exige que, al llegar la fecha efectiva de terminación, se bloquee el acceso, se invaliden las sesiones y se rechacen las operaciones de negocio, incluidos los avisos pendientes, también al iniciar sesión (RN-101) y al comprobar una sesión (RN-149). El modelo de datos ya trae las columnas y ADR-002 lo menciona como requisito de diseño. Sin embargo, el backlog excluye HU-018 por falta de aprobación del PO, y ninguna tarea, ni siquiera T-011, comprueba el estado del contrato.
- **Impacto:** una regla MUST de origen legal y contractual (E-008, E-011) queda sin implementar en el MVP en la nube. Si se agrega después, habrá que rehacer los guards de T-011 y las validaciones de T-023 (avisos pendientes).
- **Acción:**
  1. Pedir al PO que apruebe HU-018 o que deje registrado que la difiere (en `05-preguntas-abiertas.md`).
  2. Aunque se difiera el procedimiento de baja, agregar **ya** a T-011 el criterio «con `terminacion_efectiva_en` vencida, el inicio de sesión y cualquier sesión vigente responden `401` y la sesión se cierra», y a T-023 «un envío de una empresa con contrato terminado se rechaza sin llamar a Resend».
  3. Si se aprueba HU-018, agregar a C4 (API interna) una tarea para registrar la constancia y otra para la baja con su rol de base de datos (ADR-007).

### 2.2 Mayores (reducen la calidad)

#### M-01: C15 (Auditoría e historiales) no tiene una tarea que construya el servicio común

- **Dónde:** `08-backlog.md` §2.4 (nota sobre C15); `07-architecture.md` C15.
- **Hallazgo:** el backlog reparte la auditoría entre T-013, T-014, T-015, T-016, T-018 y T-020. Sin embargo, ninguna tarea construye el servicio común que escribe `auditoria_eventos` y `historial_ediciones` en la transacción del caller y que guarda **solo cifradas** las copias de los campos sensibles (PRINCIPIO-004; RN-129, RN-166).
- **Impacto:** se corre el riesgo de seis implementaciones distintas. Además, no queda probado que una copia de un campo cifrado no termine en `valor_anterior` en claro.
- **Acción:** crear una tarea «Implementar el servicio de auditoría e historial por campo» (C15, tamaño M, dependencias T-004 y T-005) antes de T-013. Su criterio: «al editar el correo de un contacto, `historial_ediciones` solo llena `valor_anterior_cifrado` y `valor_nuevo_cifrado`, y una falla al auditar revierte el cambio».

#### M-02: La suite de aislamiento (T-030) deja fuera las lecturas agregadas y los endpoints Should

- **Dónde:** `08-backlog.md` T-030, T-033 y T-035; HU-008, HU-011 y HU-012 (criterios de aislamiento).
- **Hallazgo:** T-030 solo recorre los «endpoints de recursos con identificador» y no depende de T-021 (panel). Quedan sin prueba de aislamiento `GET /panel`, `GET /avisos/cuotas-por-avisar`, los listados paginados y los endpoints 40, 41 y 43. Esto incluye los criterios de aislamiento de HU-008 («otra empresa con S/ 9,000.00 vencidos no suma»), de HU-011 y de HU-012.
- **Acción:**
  1. Agregar T-021 a las dependencias de T-030 y ampliar su criterio: «los listados, el panel y las cuotas por avisar no incluyen filas de la empresa sembrada B».
  2. Agregar a T-033 y T-035 el criterio «el endpoint queda cubierto por `aislamiento.e2e`».

#### M-03: T-012 no recoge el límite de recuperaciones ni otras reglas de HU-002

- **Dónde:** `08-backlog.md` T-012; HU-002; RN-260, RN-102 y RN-243 a RN-253. El límite ya está en `07-openapi.yaml` (línea 218).
- **Hallazgo:** ni la descripción ni el criterio de T-012 mencionan:
  - el máximo de 3 enlaces de recuperación por usuario en 60 minutos (RN-260);
  - el desbloqueo de la cuenta al restablecer la contraseña (RN-102);
  - la política de contraseñas (de 8 a 128 caracteres, sin recortar ni normalizar, validada en el servidor; RN-243 a RN-253).
- **Acción:** agregar al criterio de T-012: «una cuarta solicitud a los 30 minutos responde igual, no envía correo y no revoca el enlace vigente; tras restablecer, la cuenta bloqueada queda desbloqueada; una contraseña de 7 o de 129 caracteres responde `422` sin consumir el enlace».

#### M-04: La falla del correo de invitación (QA-08) no está en T-013 ni en T-014

- **Dónde:** `08-backlog.md` T-013 y T-014; HU-001 y HU-003 (criterios QA-08 de rechazo y de tiempo de espera); `07-architecture.md` §3.1 (`INVITACION_FALLIDA`).
- **Hallazgo:** las HUs exigen que, si Resend rechaza el envío o no responde a tiempo, la empresa y el usuario se conserven, el usuario quede INVITADO con su enlace vigente, no haya reintento automático y el intento quede auditado sin el enlace. Las tareas describen el alta atómica, pero no dicen que el correo va fuera de la transacción ni cómo se audita la falla.
- **Acción:** agregar a T-013 y a T-014 el criterio: «con Resend simulado que rechaza el envío o agota el tiempo de espera, el usuario queda INVITADO, existe el evento `INVITACION_FALLIDA` sin el token y la respuesta indica que el correo no se envió».

#### M-05: Al backend de avisos le faltan los estados NO_VERIFICABLE y la exclusión de cuotas no aptas

- **Dónde:** `08-backlog.md` T-023; RN-155 y RN-159; HU-010. `07-openapi.yaml` ya define `NO_VERIFICABLE`, `advertenciaNoVerificable` y `SIN_CUOTAS_APTAS`.
- **Hallazgo:** T-023 no cubre:
  - el paso a `NO_VERIFICABLE` cuando vence la ventana de 24 horas de la clave de Resend (RN-159);
  - el envío de un aviso nuevo con advertencia después de ese paso;
  - la exclusión de las cuotas que dejaron de ser aptas al confirmar, con su motivo, y el rechazo `SIN_CUOTAS_APTAS` sin registrar un intento (RN-155).

  T-029 muestra la advertencia en la interfaz, pero ninguna tarea del backend la produce.
- **Acción:** agregar a T-023: «un intento sin confirmar con más de 24 horas pasa a `NO_VERIFICABLE` al verificarlo; si todas las cuotas seleccionadas quedaron canceladas, la respuesta es `SIN_CUOTAS_APTAS` y no se crea el intento; si se cancela una de dos, el correo sale con la otra y la respuesta informa la excluida». Si T-023 supera las 2 horas, dividirla.

#### M-06: S1 no puede entregarse completa con T-033 y T-034

- **Dónde:** `02-alcance.md` §3.1; HU-011 (criterio de visibilidad de promesas); RN-036 y RN-078; HU-017 (sugerida); `08-backlog.md` T-033 y T-034.
- **Hallazgo:** el alcance dice que, al entregarse S1, «se aplican todas sus validaciones, la visibilidad de promesas de RN-036 y el historial de RN-078». Ninguna tarea implementa la visibilidad de las promesas activas en el panel de notificaciones (RN-036, un criterio de HU-011). Tampoco hay tarea para el historial cronológico de la cuota (RN-078), porque HU-017 no está aprobada.
- **Acción:**
  1. Agregar a T-033 y T-034 la visibilidad de las promesas activas para todos los roles (el YAML ya la prevé en las cuotas por avisar, línea 2304).
  2. Pedir al PO que apruebe HU-017 antes de liberar `FUNCIONALIDAD_S1`, o que registre la excepción.

#### M-07: No hay tareas de despliegue, ambientes ni protección de producción

- **Dónde:** `08-backlog.md` §1.1; `07-architecture.md` §1.2 y §6.1 (PRINCIPIO-002, 004, 011 y 012); `02-alcance.md` D1, D4 y D7; RN-012.
- **Hallazgo:** ninguna tarea cubre:
  - crear el repositorio (D4: «falta crear el repositorio»);
  - aprovisionar Railway y Neon en `us-east-1`;
  - configurar las variables y claves por ambiente;
  - TLS 1.2 o superior y HSTS (RN-012), y `sslmode=require` hacia Neon;
  - publicar `apps/api-interna` solo en la red privada (ADR-007);
  - la *environment protection* de producción (PRINCIPIO-011).

  Además, T-002 solo «documenta en el README» la protección de `main`, cuando PRINCIPIO-012 exige configurarla. El mismo dominio para SPA y API, que exige `SameSite=Strict` (ADR-002), depende de la pregunta 39, todavía abierta.
- **Acción:**
  1. Crear una tarea «Desplegar los ambientes de prueba y producción en Railway y Neon» (Must, dependencias T-002, T-013 y T-023). Su criterio: «una conexión TLS 1.1 se rechaza, la respuesta incluye HSTS, `/api/v1/interno` no responde desde Internet y el despliegue a producción espera una aprobación manual».
  2. Cambiar en T-002 «documentar» por «configurar y verificar» la protección de `main`.

#### M-08: No hay tareas para la rotación de claves ni para la prueba de recuperación de respaldos

- **Dónde:** RN-141, RN-142, RN-226 y RN-235 a RN-242; `07-architecture.md` ADR-003 («rotar exige recifrar en segundo plano»); `08-backlog.md` T-004.
- **Hallazgo:** T-004 carga las claves por versión y lleva el contador `claves_uso`, pero no existen:
  - el proceso de recifrado y reindexación de referencias durante una rotación, manteniendo la unicidad (RN-226);
  - la prueba de recuperación conjunta de datos, claves y referencias (RN-240);
  - el procedimiento operativo con responsable, plazo y límites, que RN-237 exige **antes de producción**.
- **Acción:**
  1. Agregar a T-004 el criterio «con dos versiones de clave activas, un correo indexado con la versión 1 impide crear un duplicado con la versión 2».
  2. Crear una tarea Must «Implementar el recifrado por rotación y la prueba de restauración» (C13 y C16).
  3. Crear un entregable documental para RN-237 a RN-242, con responsable asignado en `05-preguntas-abiertas.md` (preguntas 26 y 41).

#### M-09: La eliminación de contactos (T-015) depende de la pregunta 51, todavía abierta

- **Dónde:** `08-backlog.md` T-015; RN-127, RN-129 y RN-130; `07-architecture.md` §6.3; pregunta 51 (QA-13).
- **Hallazgo:** la arquitectura elige por ahora conservar el historial del contacto eliminado. Pero RN-127 exige que eliminar el contacto libere el correo «retirando el valor cifrado y todas sus referencias de búsqueda vigentes». El historial guarda copias cifradas del correo, y la conservación de historiales es un requisito transversal. T-015 no define qué pasa con esas copias.
- **Acción:** resolver la pregunta 51 antes de empezar T-015. Mientras tanto, agregar a T-015 el criterio mínimo: «tras eliminar, no queda ningún `correo_ref` del contacto y el mismo correo se acepta en un contacto nuevo», y aislar la decisión sobre el historial en un solo método del caso de uso.

#### M-10: La aprobación humana de los casos de referencia no está modelada como dependencia

- **Dónde:** PRINCIPIO-007; `08-backlog.md` T-010 y T-035; HU-012 (QA-10: «casos de referencia pendientes de aprobación»).
- **Hallazgo:** T-010 exige un archivo `casos-referencia` aprobado por la persona encargada del proyecto, y T-035 usa los casos de redondeo de HU-012, que siguen sin aprobar. Ningún entregable ni dependencia representa esa aprobación, así que las tareas pueden cerrarse con casos no aprobados.
- **Acción:** agregar a T-010 y a T-035 el criterio «el pull request que agrega o cambia `casos-referencia` tiene la aprobación registrada de la persona encargada del proyecto», y registrar la aprobación de QA-10 como pendiente bloqueante de T-035.

#### M-11: RN-151 y RN-257 son MUST y no tienen HU ni tareas

- **Dónde:** `03-reglas-de-negocio.md` RN-151 y RN-257; `06-user-stories.md` «Revisión QA» §5; pregunta 31.
- **Hallazgo:** el procedimiento de solicitudes de eliminación de datos personales es obligatorio y no tiene HU, componente ni tarea, porque depende de la revisión legal de la pregunta 31.
- **Acción:** asignar un responsable y una fecha a la pregunta 31 en `05-preguntas-abiertas.md`, y dejar constancia en el backlog de que RN-151 y RN-257 están bloqueadas, con su efecto en el lanzamiento (Ley 29733).

### 2.3 Sugerencias (mejoran la calidad)

| # | Dónde | Hallazgo | Acción |
|---|---|---|---|
| S-01 | `07-architecture.md` C7 · `08-backlog.md` T-018 | La arquitectura asigna la anulación de comprobantes a C7, pero T-018 la implementa en C8. | Alinear: actualizar C7 y C8 en la arquitectura o cambiar el componente de T-018 a «C7 / C8». |
| S-02 | `07-architecture.md` C16 · T-003 | C16 dice «migraciones TypeORM» y T-003, «migraciones SQL versionadas». | Fijar la herramienta en T-003 (por ejemplo, migraciones TypeORM que contienen SQL explícito). |
| S-03 | T-011 | El criterio prueba la inactividad con 31 minutos; HU-002 define el borde exacto (09:29:59 vigente, 30:00 cerrada) y el cierre a las 12 horas. | Usar los valores de borde de HU-002 y agregar el caso de las 12 horas con actividad continua. |
| S-04 | T-001, T-002, T-003, T-031 | Estas tareas indican «Infraestructura» y no nombran a qué principio o requisito transversal responden. | Indicar la traza, por ejemplo T-003 → PRINCIPIO-003, PRINCIPIO-006 y RN-007; T-002 → PRINCIPIO-011 y PRINCIPIO-012. |
| S-05 | T-025 | Construye la pantalla de preferencias (HU-008, endpoints 16 y 17), pero solo indica HU-003 y HU-009. | Agregar HU-008 a «HU relacionada». |
| S-06 | T-010 | La suite de referencia no incluye `clasificarTipoAviso` (HU-010) ni los valores rechazados de la ventana (por ejemplo, 30). | Agregar los ejemplos de tipo de aviso de HU-010 y de la ventana de HU-008. |
| S-07 | T-032, T-034, T-036 | Las pruebas de accesibilidad solo cubren las pantallas Must; las Should quedan sin control de PRINCIPIO-010. | Agregar a T-034 y T-036 el criterio «axe-core sin violaciones graves y operable con el teclado». |
| S-08 | HU-006 y HU-008 · RN-071 | RN-071 (fecha efectiva) es MUST y la usa el MVP (T-008), pero solo figura en la lista de reglas de HU-011 (Should). Lo mismo ocurre con RN-080 y RN-118, aunque en esas dos el alcance §3.1 lo permite. | Agregar RN-071 a las reglas relacionadas de HU-006 y HU-008. |
| S-09 | T-014, T-020, T-022, T-023 | Hay criterios de HU que no figuran en las tareas: la reactivación según tenga o no contraseña (QA-09), la revocación del enlace al desactivar, la copia única cuando el correo administrativo coincide con alguien de la lista, el usuario inactivo dentro de una lista y el comentario de hasta 500 caracteres en mayúsculas (QA-04). | Agregarlos a los criterios de completitud correspondientes. |
| S-10 | `07-architecture.md` §6.2 | No hay tareas para las métricas de errores 5xx e intentos SIN_CONFIRMAR, ni para verificar el rendimiento (p95 < 500 ms en el panel con 5,000 cuotas). | Crear una tarea S o M de observabilidad y una prueba de carga del panel con datos ficticios. |
| S-11 | `08-backlog.md` §2.7 | El grafo omite las aristas T-004 → T-015, T-006 → T-023, T-007 → T-016 y T-008 → T-017. | Completar el grafo o aclarar que solo muestra las dependencias principales. |
| S-12 | `06-user-stories.md` «Revisión QA» §5 | Los conteos de la segunda pasada no cuadran: dice 180 reglas referenciadas por las HU-001 a HU-012 (el recálculo da 181) y pone RN-150 como «solo en HUs sugeridas», aunque figura en «Requisitos transversales». | Recalcular la tabla con el script de trazabilidad y corregir las cifras. |

### 2.4 Verificaciones que pasan

| Verificación | Resultado |
|---|---|
| El stack respeta la constitución (PRINCIPIO-002) | ✅ Node.js 22, NestJS 10, PostgreSQL 16, React 18 con shadcn/ui, Neon y Railway. Las librerías elegidas (TypeORM, decimal.js, pino, Recharts, Resend, Playwright y axe-core) no agregan otro motor de base de datos ni otro framework de frontend. T-002 prohíbe Redis, colas, SMS y pasarelas de pago (PRINCIPIO-009 y PRINCIPIO-011). |
| Alineación de prioridades | ✅ M1 a M6 → HU-001 a HU-010 (Must) → T-001 a T-032 (Must). S1 y S5 → HU-011 y HU-012 (Should) → T-033 a T-036 (Should). Las Could (C1 y C3) y lo fuera de alcance (O1 a O19) no tienen tareas. |
| Orden de dependencias (DAG) | ✅ Ninguna tarea depende de otra con un número mayor. |
| Totales del backlog | ✅ Las sumas por prioridad (32 + 4), por tipo (6 + 16 + 9 + 5), por componente (36) y por tamaño (2 S, 16 M y 18 L) cuadran. |
| Esfuerzo | ✅ 2 × 0.5 + 16 × 1 + 18 × 2 = 53 h; Should = 2 + 1 + 2 + 0.5 = 5.5 h. |
| Ruta crítica | ✅ Recalculada: T-032 termina en la hora 20. Holgura de 3 h en la cadena de usuarios (T-020 termina en la hora 11 y T-018 en la 14) y de 2 h en la del panel (T-028 en la 17 y T-029 en la 19). |
| Inventario de operaciones | ✅ 49 `operationId` en `07-openapi.yaml`, iguales al inventario de §4.2 y a lo que dice el backlog. |
| Valores numéricos repetidos en varios documentos | ✅ Iguales en alcance, reglas, HUs, arquitectura y backlog: de 2 a 120 cuotas; hasta 12 dígitos enteros y 2 decimales; ventana de 7, 10 o 15 días; sesión de 30 minutos de inactividad y 12 horas absolutas; bloqueo tras 5 fallos por 15 minutos; invitación de 72 horas y recuperación de 60 minutos; motivo y comentario de hasta 500 caracteres; Argon2id con 19 MiB, 2 iteraciones y paralelismo 1; cobertura ≥ 80 %; tiempo de espera de Resend de 10 s; ventana de idempotencia de 24 horas. |
| Ejemplos de los criterios de completitud | ✅ Reparto 333.33, 333.33 y 333.34; vencimientos 2026-02-28, 2026-03-31 y 2026-04-30; diferencia de S/ 66.67; saldo de S/ 600.00 tras la anulación; carrera entre S/ 400.00 y S/ 300.00. Todos coinciden con las HUs. |
| Referencias a reglas | ✅ Ninguna HU, tarea ni sección de la arquitectura cita una regla inexistente o retirada. |

---

## 3. Matriz de trazabilidad

### 3.1 Alcance → HUs → componentes → tareas

| Alcance | HU | Componentes (`07-architecture.md` §2) | Tareas | Estado |
|---|---|---|---|---|
| M6 | HU-001 Alta de empresa y primer administrador | C4, C13, C14, C15, C16 | T-013 (con T-004, T-006 y T-012) | ⚠️ M-04 |
| M6 | HU-002 Activar cuenta, iniciar sesión y recuperar contraseña | C1, C3, C13, C14 | T-011, T-012, T-024 | ❌ C-01 · ⚠️ M-03 |
| M6 | HU-003 Administrar usuarios y roles | C1, C5, C13, C14, C15 | T-014, T-025 | ⚠️ M-04, S-09 |
| M1 | HU-004 Gestionar el catálogo de contactos | C1, C6, C13, C15 | T-015, T-026 | ⚠️ M-09 |
| M1, M2 | HU-005 Registrar y editar comprobantes con cuotas | C1, C7, C12, C15 | T-007, T-010, T-016, T-026 | ✅ |
| M3 | HU-006 Registrar un cobro o pago | C1, C8, C12 | T-008, T-010, T-017, T-019, T-027 | ✅ |
| M3, M6 | HU-007 Anular un pago o un comprobante | C1, C7 (S-01), C8, C12, C15 | T-008, T-010, T-018, T-019, T-027 | ✅ |
| M4 | HU-008 Consultar el panel de cartera | C1, C5, C10, C12 | T-009, T-010, T-020, T-021, T-028 | ⚠️ M-02 |
| M5, M6 | HU-009 Configurar el correo administrativo y las copias | C1, C5, C13, C15 | T-020, T-025 | ⚠️ S-09 |
| M5 | HU-010 Enviar avisos de vencimiento | C1, C11, C12, C13, C14 | T-009, T-022, T-023, T-029 | ⚠️ M-05 |
| S1 | HU-011 Reprogramar con promesa de pago | C1, C9, C12 | T-033, T-034 | ⚠️ M-06 |
| S5 | HU-012 Tiempo promedio de cobro | C1, C10, C12 | T-035, T-036 | ⚠️ M-10 |
| Transversal | Requisitos transversales (*Definition of Done*) | C2, C13, C16, infraestructura | T-001 a T-006, T-030, T-031, T-032 | ❌ C-02 · ⚠️ M-01, M-07, M-08 |
| S3 | HU-013 (sugerida) | — | — | Sin aprobación del PO |
| S4 | HU-014 a HU-017 (sugeridas) | — (módulo de exportaciones previsto en §6.3) | — | Sin aprobación del PO; HU-017 afecta a S1 (M-06) |
| Procedimiento interno | HU-018 (sugerida, **Must**) | C4 (previsto en ADR-007) | — | ❌ C-03 |
| C1, C3 | — | — | — | Could, sin diseño técnico |
| O1 a O19 | — | — | — | Fuera de alcance |

### 3.2 Reglas → HUs → componentes → tareas

| HU | Reglas relacionadas (de `06-user-stories.md`) | Cantidad (MUST/total) | Componentes | Tareas |
|---|---|---|---|---|
| HU-001 | RN-005, RN-094 a RN-100, RN-139, RN-160, RN-162, RN-165, RN-211, RN-217, RN-222 | 15/15 | C4, C13, C14, C15 | T-013, T-004, T-006 |
| HU-002 | RN-098, RN-101 a RN-103, RN-139, RN-140, RN-143, RN-149, RN-243 a RN-253, RN-258 a RN-260 | 22/22 | C3, C13, C14, C1 | T-011, T-012, T-024 (RN-260: sin tarea, M-03) |
| HU-003 | RN-008 a RN-010, RN-060, RN-070, RN-097 a RN-100, RN-139, RN-160, RN-161 | 12/12 | C5, C3, C15, C1 | T-014, T-011, T-025 |
| HU-004 | RN-006, RN-044, RN-126 a RN-130, RN-139, RN-160, RN-162, RN-254 a RN-256 | 13/13 | C6, C13, C15, C1 | T-015, T-026 |
| HU-005 | RN-001 a RN-005, RN-008, RN-015 a RN-020, RN-057, RN-081 a RN-083, RN-093, RN-121, RN-122, RN-130 a RN-133, RN-153, RN-154, RN-160, RN-162 | 27/27 | C7, C12, C15, C1 | T-007, T-010, T-016, T-026 |
| HU-006 | RN-008, RN-021, RN-022, RN-024 a RN-026, RN-063, RN-084, RN-088, RN-089, RN-091, RN-092, RN-153, RN-156, RN-157, RN-160 | 16/16 | C8, C12, C1 | T-008, T-010, T-017, T-019, T-027 |
| HU-007 | RN-003, RN-008, RN-027 a RN-032, RN-058 a RN-062, RN-084, RN-090, RN-091, RN-123, RN-124, RN-160, RN-162 | 20/20 | C7, C8, C12, C15, C1 | T-008, T-018, T-019, T-027 |
| HU-008 | RN-007, RN-008, RN-021, RN-022, RN-046 a RN-049, RN-069, RN-105 a RN-111, RN-119, RN-120, RN-169 a RN-174, RN-180 a RN-182, RN-198, RN-201, RN-205 a RN-210 | 35/35 | C10, C5, C12, C1 | T-009, T-010, T-020, T-021, T-028 |
| HU-009 | RN-008, RN-042, RN-060, RN-104, RN-134, RN-135, RN-164 a RN-168, RN-175 a RN-179 | 16/16 | C5, C13, C15, C1 | T-020, T-025 |
| HU-010 | RN-008, RN-013, RN-039, RN-041 a RN-043, RN-045, RN-066, RN-067, RN-075, RN-104, RN-112 a RN-117, RN-120, RN-130, RN-136 a RN-138, RN-155, RN-157 a RN-159, RN-162, RN-164, RN-178, RN-212 a RN-215 | 33/33 | C11, C14, C12, C13, C1 | T-006, T-009, T-022, T-023, T-029 (RN-155 y RN-159: parcial, M-05) |
| HU-011 | RN-008, RN-021, RN-033 a RN-036, RN-045, RN-071 a RN-074, RN-080, RN-085, RN-118, RN-160, RN-162, RN-198 | 9/17 | C9, C12, C1 | T-033, T-034 (RN-036: sin tarea, M-06) |
| HU-012 | RN-008, RN-025, RN-053, RN-084, RN-088 a RN-090, RN-147, RN-198, RN-205, RN-206 | 9/11 | C10, C12, C1 | T-035, T-036 |

**Unión de las HUs aprobadas:** 181 reglas vigentes (171 MUST y 10 SHOULD).

### 3.3 Reglas transversales (solo *Definition of Done*) → componentes → tareas

| Grupo | Reglas (solo transversales) | Componentes | Tareas | Estado |
|---|---|---|---|---|
| Aislamiento por empresa | RN-052 (más RN-007 y RN-008, que también están en HUs) | C2, C16 | T-003, T-005, T-030 | ⚠️ C-01, M-02 |
| Cifrado, referencias HMAC y claves | RN-011, RN-141, RN-142, RN-189 a RN-192, RN-216, RN-218 a RN-221, RN-223 a RN-242 | C13, C16 | T-004, T-003 | ⚠️ M-08 (rotación, restauración y procedimiento operativo sin tarea) |
| Datos personales fuera de logs y errores | RN-014, RN-193 a RN-197 | C2 | T-005, T-030 | ✅ |
| TLS 1.2 o superior | RN-012 | Infraestructura | — | ❌ M-07 |
| Fecha de cálculo inyectada | RN-023, RN-199, RN-200, RN-202 a RN-204 | C12, C2 | T-001 (lint), T-007 a T-010 | ✅ |
| Conservación y baja | RN-150 (más RN-028, que también está en HU-007) | C16 | T-003, T-019 | ⚠️ La parte de baja a 30 días depende de HU-018 (C-03) |

**Total solo transversales:** 47 reglas MUST.

### 3.4 Reglas sin HU aprobada

| Regla | Prioridad | HU | Componente | Tareas | Hallazgo |
|---|---|---|---|---|---|
| RN-152 | MUST | HU-018 (sugerida, Must) | C4 / C3 (previstos) | — | C-03 |
| RN-151, RN-257 | MUST | — | — | — | M-11 (pregunta 31) |
| RN-079 | MUST (aplica al entregar S4) | HU-014 a HU-016 (sugeridas) | — | — | Sin acción en el MVP: no existe ningún endpoint de exportación. |
| RN-054 a RN-056, RN-148, RN-261 | SHOULD (S3) | HU-013 (sugerida) | — | — | Pendiente de aprobación del PO |
| RN-050, RN-051, RN-076 a RN-078, RN-144 a RN-146, RN-163, RN-183 a RN-188 | SHOULD (S4) | HU-014 a HU-017 (sugeridas) | — | — | Pendiente del PO; RN-078 afecta a S1 (M-06) |

### 3.5 Trazabilidad backward: tareas → HU

| Tarea | HU | Tarea | HU | Tarea | HU |
|---|---|---|---|---|---|
| T-001 | Infraestructura (S-04) | T-013 | HU-001 | T-025 | HU-003, HU-009 (S-05) |
| T-002 | Infraestructura (S-04) | T-014 | HU-003 | T-026 | HU-004, HU-005 |
| T-003 | Infraestructura (S-04) | T-015 | HU-004 | T-027 | HU-006, HU-007 |
| T-004 | Transversal (HU-001 a HU-004, HU-009, HU-010) | T-016 | HU-005 | T-028 | HU-008 |
| T-005 | Transversal (todas) | T-017 | HU-006 | T-029 | HU-010 |
| T-006 | Transversal (HU-001 a HU-003, HU-010) | T-018 | HU-007 | T-030 | HU-001 a HU-010 |
| T-007 | HU-005 | T-019 | HU-006, HU-007 | T-031 | Infraestructura (S-04) |
| T-008 | HU-006, HU-007 | T-020 | HU-008, HU-009 | T-032 | HU-002 a HU-010 |
| T-009 | HU-008, HU-010 | T-021 | HU-008 | T-033 | HU-011 |
| T-010 | HU-005 a HU-008 | T-022 | HU-010 | T-034 | HU-011 |
| T-011 | HU-002 | T-023 | HU-010 | T-035 | HU-012 |
| T-012 | HU-002 | T-024 | HU-002 | T-036 | HU-012 |

**Resultado:** no hay tareas huérfanas. Las 4 tareas marcadas solo como «Infraestructura» responden a principios de la constitución y deberían decirlo explícitamente (S-04).

### 3.6 Componentes → tareas

| Componente | Tareas | Componente | Tareas |
|---|---|---|---|
| C1 SPA web | T-024 a T-029, T-032, T-034, T-036 | C9 Reprogramaciones | T-033 |
| C2 Capa transversal | T-005, T-030, T-031 | C10 Panel | T-021, T-035 |
| C3 Autenticación | T-011, T-012 | C11 Avisos | T-022, T-023 |
| C4 Operaciones internas | T-013 | C12 Dominio puro | T-007 a T-010 |
| C5 Usuarios y configuración | T-014, T-020 | C13 Criptografía | T-004 |
| C6 Contactos | T-015 | C14 Correo | T-006 |
| C7 Comprobantes | T-016 | **C15 Auditoría e historiales** | **— (M-01)** |
| C8 Pagos y anulaciones | T-017, T-018, T-019 | C16 Base de datos | T-003 (también la prueban T-019 y T-030) |
