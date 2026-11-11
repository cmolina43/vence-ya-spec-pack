# 08 - Reporte de auditoría QA del Spec Pack (backlog)

**Fase BMAD:** construcción, a cargo del Agente QA de Backlog (QA Architect Senior).
**Fecha:** 2026-11-09.
**País de operación:** Perú. **Zona horaria de negocio:** America/Lima.
**Instrucciones:** `08-backlog-qa.xml`.
**Insumos auditados:** `02-alcance.md`, `03-reglas-de-negocio.md`, `06-user-stories.md`, `07-architecture.md` y `08-backlog.md`. Para verificar algunos hallazgos se consultaron también `00-constitucion.md`, `07-openapi.yaml` y `05-preguntas-abiertas.md`.
**Método:** las reglas, sus prioridades y las referencias RN de cada HU se extrajeron con un script y se cruzaron con la tabla de requisitos transversales, el inventario de componentes y las tareas (36 en la auditoría original, 37 tras M-01, 39 tras M-06, 40 tras E-015 y 43 tras M-07). Además se recalcularon las dependencias, los totales y la ruta crítica del backlog, y se revisó a mano cada criterio de completitud contra los criterios de aceptación de su HU.

---

## 1. Resumen ejecutivo

**Veredicto:** el backlog es sólido en su estructura y **no quedan hallazgos críticos abiertos en esta auditoría**. C-01, C-02 y C-03 quedaron cerrados documentalmente el 2026-11-10: C-01 define RLS antes de la autenticación con tres funciones `SECURITY DEFINER`; C-02 asigna a T-005 el registro de las cuatro operaciones Should (incluido el historial de M-06) con controladores mínimos que responden `404` y mantiene todas las operaciones en T-032 (49 tras M-06); C-03 incorpora el bloqueo por terminación contractual al backlog y excluye la baja como procedimiento operativo manual. Las 43 tareas trazan a una HU o a un requisito transversal, el grafo de dependencias no tiene ciclos y los totales, el esfuerzo y la ruta crítica coinciden con un recálculo independiente. M-09 queda cerrado documentalmente por decisión del 2026-11-10 (pregunta 51, opción B): se conserva el historial del contacto eliminado. M-11 queda cerrado documentalmente por decisión de alcance del 2026-11-10: RN-151 y RN-257 corresponden a la gestión interna de VenceYa fuera del backlog, con pendiente operativo y legal previo al lanzamiento en la pregunta 31. M-10 queda cerrado documentalmente por la enmienda E-014 del 2026-11-10, que retira la aprobación humana específica de casos de referencia y mantiene pruebas automáticas trazables a las reglas de negocio. M-04 queda cerrado documentalmente el 2026-11-10: T-006, T-013, T-014 y T-015 cubren el rechazo y el tiempo de espera del correo de invitación. M-03 queda cerrado documentalmente el 2026-11-10: T-013 recoge el límite de recuperaciones, el desbloqueo y la política de contraseñas, y pasa a tamaño L. M-02 queda cerrado documentalmente el 2026-11-10: T-031 pasa a ser una suite dirigida por tabla que cubre también las lecturas sin identificador, depende de T-022, y T-034 y T-036 prueban sus endpoints con la bandera encendida. M-01 queda cerrado documentalmente el 2026-11-10: T-012 construye el servicio común de auditoría e historial (C15), que es la única vía de escritura de `auditoria_eventos` e `historial_ediciones`, y las tareas posteriores se renumeraron (de T-012 a T-036 pasaron a T-013 a T-037). M-05 queda cerrado documentalmente el 2026-11-10: por decisión del usuario se retira la verificación y NO_VERIFICABLE, los errores y tiempos de espera permiten otro envío manual como «No Enviado», y T-024 cubre RN-155 con exclusión parcial o SIN_CUOTAS_APTAS sin intento. M-06 queda cerrado documentalmente el 2026-11-10 por aprobación del usuario: HU-017 incorpora el historial compartido, T-034/T-035 cubren visibilidad de promesas y T-038/T-039 implementarán consulta y vista. Se amplía el contrato y su registro mínimo a 49 operaciones. M-08 queda cerrado por rediseño el 2026-11-10 (enmienda E-015): se retira el cifrado por campo y la gestión de claves de datos, de modo que no hay rotación ni reindexación que implementar; la prueba de recuperación de RN-240 se simplifica, y se agrega T-040 para la trazabilidad de accesos del art. 46 del D.S. 016-2024-JUS. M-07 queda cerrado documentalmente el 2026-11-10: T-001 incluye el repositorio remoto, T-002 configura y verifica la protección de main, y T-041 a T-043 cubren ambientes separados, despliegue y aprobación humana de producción; los dominios web pendientes se registran en la pregunta 53. No quedan hallazgos mayores abiertos; siguen pendientes las sugerencias, incluidos criterios de HUs Must que no llegaron a las tareas. El cierre documental no acredita implementación ni pruebas ejecutadas.

| Indicador | Valor |
|---|---|
| Reglas del catálogo | 264 IDs: 31 retiradas y 233 vigentes (203 MUST, 30 SHOULD); recálculo tras E-015, que retira 23 reglas MUST de cifrado y claves y agrega RN-262 a RN-266 |
| Reglas MUST con traza a HUs aprobadas o requisitos transversales | 200 de 203 (98.5 %): 171 en HUs aprobadas (incluido el bloqueo de RN-152, C-03) y 29 solo como requisito transversal (*Definition of Done*), entre ellas RN-262 a RN-266 (E-015). La traza no acredita implementación. |
| Reglas MUST operativas sin HU por diseño | 2: RN-151 y RN-257, gestión interna de VenceYa fuera del alcance funcional y del backlog de desarrollo (M-11 cerrado documentalmente); pendiente operativo y legal en la pregunta 31. |
| Regla MUST con cobertura funcional diferida | 1: RN-079, solo aplica al entregar S4 y figura en HUs sugeridas. RN-152 ya tiene el bloqueo en HUs aprobadas; su constancia y baja son operativas (C-03). |
| HUs aprobadas | 13 (10 Must y 3 Should, incluida HU-017); las 13 tienen componente y tareas |
| Componentes de arquitectura | 16; los 16 tienen tareas (C15 Auditoría, historiales y trazabilidad la construye T-012, M-01 cerrado documentalmente; C13 pasa a Servicio de hash por E-015) |
| Tareas | 43 (37 Must y 6 Should), sin tareas huérfanas; 7 tareas de infraestructura trazan a principios y no a una HU |
| Dependencias | DAG válido: ninguna tarea depende de otra con un número mayor |
| Esfuerzo y ruta crítica | 68 h (57.5 h Must y 10.5 h Should); ruta crítica hasta producción de 22 h, sin esperas externas. M-07 suma 7 h: T-002 pasa a L y se agregan T-041/T-042/T-043 (L). La construcción y pruebas hasta T-033 conservan 20 h; S1 completa termina en la hora 21 sin límite de recursos |
| **Hallazgos** | **3 críticos cerrados documentalmente (0 abiertos) · 11 mayores (0 abiertos; M-01/M-02/M-03/M-04/M-05/M-06/M-07/M-09/M-10/M-11 cerrados documentalmente y M-08 cerrado por rediseño) · 12 sugerencias** |

**Orden de resolución recomendado:**

1. Críticos: C-01, C-02 y C-03 cerrados documentalmente el 2026-11-10; verificar sus criterios al implementar las tareas correspondientes.
2. Planificación del MVP: M-07 cerrado documentalmente con T-001/T-002 y T-041 a T-043; ejecutar y verificar esos controles antes de habilitar producción. M-01 queda cerrado documentalmente (T-012 es el servicio de auditoría e historial).
3. Durante el sprint, antes de empezar cada tarea afectada: los criterios pendientes, ajustando los criterios de completitud. M-08 queda cerrado por rediseño (E-015): sin cifrado por campo no hay rotación ni reindexación, y T-040 cubre la trazabilidad de accesos. M-01 queda cerrado documentalmente (T-012 y sus consumidoras T-013, T-014, T-015, T-016, T-017 y T-021). M-02 queda cerrado documentalmente (T-031 cubre las lecturas sin identificador y T-034 y T-036 se prueban con la bandera encendida). M-03 queda cerrado documentalmente (T-013 ya recoge el límite de recuperaciones, el desbloqueo y la política de contraseñas). M-04 queda cerrado documentalmente (T-006, T-013, T-014 y T-015 ya cubren la falla del correo de invitación). M-05 queda cerrado documentalmente por simplificación del flujo y cobertura de RN-155 en T-024. M-06 queda cerrado documentalmente con HU-017 aprobada, visibilidad en T-034/T-035 e historial en T-038/T-039; no liberar S1 antes de cumplir las cuatro tareas. M-09 queda cerrado documentalmente (pregunta 51, opción B) y su criterio ya está en T-016. M-10 queda cerrado documentalmente por E-014, sin pendiente de aprobación de casos. M-11 queda cerrado documentalmente por decisión de alcance; la pregunta 31 conserva el pendiente operativo y legal previo al lanzamiento, sin ser una dependencia de desarrollo.

---

## 2. Hallazgos

### 2.1 Críticos (bloquean la implementación)

#### C-01: No está definido cómo funciona la autenticación bajo RLS

**Estado (2026-11-10): ✅ cerrado.** Se aplicó la acción propuesta con tres refuerzos: `sesiones` y `enlaces_acceso` llevan `empresa_id` y las tres tablas quedan bajo RLS; las tres funciones `SECURITY DEFINER` devuelven también `terminacion_efectiva_en` (necesario para C-03); y las funciones pertenecen a un rol dedicado sin login, con `search_path` fijo y ejecución solo para `venceya_app`. Quedó en `07-architecture.md` §3.1, §3.3, ADR-002 y ADR-009, y en los criterios de T-003, T-011, T-013 y T-031. T-003 sigue en tamaño L y no se re-estimó; si supera 2 h, las funciones se separan en una tarea M.

- **Dónde:** `07-architecture.md` §3.3 (RLS) y ADR-009; `08-backlog.md` T-003, T-011 y T-013.
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
  3. Agregar a T-031 un caso que confirme que esas funciones no exponen datos de otra empresa.

#### C-02: La prueba de contrato de T-032 falla con el código del MVP

**Estado (2026-11-10): ✅ cerrado documentalmente.** Por decisión del usuario se adoptó la opción (a). M-06 amplía el mismo patrón: T-005 registra incondicionalmente las operaciones Should 40, 41, 43 y 49 con controladores mínimos, banderas apagadas por defecto y respuesta `404` con el formato de error común, sin efectos sobre los datos incluso ante una activación accidental antes de implementar su lógica. T-032 compara los 49 pares método + ruta sin exclusiones por bandera y debe pasar con el MVP sin T-034, T-036 ni T-038, detectando la eliminación individual de cada una de las cuatro operaciones. T-034/T-036/T-038 incorporan la lógica a esos controladores. Las operaciones 40/41 requieren S1, la 43 S5 y la 49 S1 o S4. M-05 retiró la antigua operación 49 de verificación de avisos; la nueva 49 es el historial de cuota de M-06 y no recupera la ruta retirada. La verificación ejecutable queda en las tareas; el cierre no acredita software implementado.

**Antecedente de auditoría (previo a la corrección):**

- **Dónde:** `08-backlog.md` T-032; `07-openapi.yaml` (operaciones 40, 41 y 43).
- **Hallazgo:** T-032 (Must) compara las rutas registradas con las 49 operaciones del YAML y debe fallar «si falta una operación del YAML». Pero las operaciones 40 y 41 (S1) y la 43 (S5) se implementan recién en T-034 y T-036, que son Should. Con el código del MVP solo existen 46 rutas, así que la prueba nunca pasa en verde. El YAML tampoco tiene una marca (por ejemplo `x-funcionalidad`) que permita excluir esas operaciones.
- **Impacto:** el CI queda en rojo desde que se integra T-032, y eso bloquea los merges del MVP (PRINCIPIO-012 exige la rama protegida). Es contradictorio con el propio criterio de T-032: «el test pasa con el código actual».
- **Acción:** elegir una de dos opciones y reflejarla en T-005 o en T-032.
  - **(a) Recomendada:** registrar en T-005 controladores mínimos para las operaciones 40, 41 y 43 detrás de `FUNCIONALIDAD_S1` y `FUNCIONALIDAD_S5`, que respondan `404`. El criterio de T-005 ya prevé ese comportamiento.
  - **(b)** Agregar `x-funcionalidad: S1` o `S5` a esas operaciones del YAML y hacer que T-032 las excluya mientras su bandera no esté implementada.

#### C-03: RN-152 (terminación contractual) es MUST y no tiene HU aprobada ni tareas

**Estado (2026-11-10): ✅ cerrado.** El bloqueo está incorporado a las HUs, al contrato y a las tareas. Por decisión del usuario (pregunta 52), la constancia y la baja son un procedimiento operativo manual del equipo de VenceYa, fuera del alcance del proyecto.

- **Dónde:** `03-reglas-de-negocio.md` RN-152 (y RN-150, RN-101, RN-149); `06-user-stories.md` HU-002, HU-010 y HU-018 (sugerida, **Must**); `07-architecture.md` §3.1 (`empresas.terminacion_efectiva_en`), ADR-002, ADR-007 y §6.3; `07-openapi.yaml` (no definía ningún código de error para este caso); `08-backlog.md` §alcance.
- **Hallazgo:** RN-152 tiene dos partes de naturaleza distinta, y el backlog las excluyó juntas al dejar fuera HU-018:
  - **A. Bloqueo desde la terminación efectiva:** rechazar el inicio de sesión, invalidar las sesiones y rechazar las operaciones y los avisos pendientes, aunque el usuario esté ACTIVO. Es comportamiento de la API pública, y RN-101 y RN-149 lo exigen dentro de HU-002, que está aprobada. **No depende de la aprobación de HU-018.**
  - **B. Constancia y baja:** registrar la terminación, eliminar todos los datos dentro de 30 días, dejar el registro externo y controlar las restauraciones. Es el procedimiento interno de HU-018 (ADR-007).

  Ninguna tarea leía `terminacion_efectiva_en`, y el OpenAPI no tenía un código para el rechazo.
- **Impacto:** una regla MUST de origen legal y contractual (E-008, E-011) quedaba sin implementar en el MVP en la nube. Agregarla después obligaría a rehacer los guards de T-011 y las validaciones de T-024.
- **Acción:**
  1. ✅ **Parte A en las HUs:** se agregó un criterio de terminación contractual a HU-002 (login, sesión abierta y enlaces) y a HU-010 (originalmente envío y verificación de SIN_CONFIRMAR; tras M-05, envío, reenvío y reintento), y RN-152 a sus reglas relacionadas. HU-018 queda acotada a la parte B.
  2. ✅ **Contrato:** `07-openapi.yaml` agrega el código `CONTRATO_TERMINADO`:
     - `403` en las operaciones 1, 4 y 6. En el login solo se devuelve con la contraseña correcta, para no romper la respuesta neutra de RN-103.
     - `401` en una sesión abierta, que queda cerrada.
     - `409` en la operación 8.
     - La operación 5 mantiene su respuesta neutra y no envía correo.

     C-03 mantuvo las 49 operaciones; M-05 retira después la verificación y deja 48; M-06 agrega el historial y vuelve a 49. T-032 se ajusta al inventario vigente.
  3. ✅ **Arquitectura:**
     - La terminación se evalúa como `terminacion_efectiva_en <= ahora`, con el reloj inyectado. Se eliminó `estado_contrato`, que habría quedado desfasado si nadie lo actualiza a la hora exacta.
     - ADR-002 describe el cierre de la sesión desde el guard.
     - §6.3 deja la baja como procedimiento operativo manual (ver el punto 5).
  4. ✅ **Backlog:** el alcance distingue las dos partes, y se ampliaron los criterios de T-011, T-013, T-014, T-024 (con la comprobación repetida dentro de la transacción 1) y T-031 (tercera empresa sembrada como terminada). T-011 mantiene el tamaño L; si al estimarla supera las 2 horas, separar el chequeo del contrato en una tarea M.
  5. ✅ **Parte B (pregunta 52, resuelta el 2026-11-10):** HU-018 no se desarrolla. Fijar `terminacion_efectiva_en`, conservar la constancia, limpiar los datos, llevar el registro externo de bajas y reaplicarlas al restaurar un respaldo son un procedimiento operativo manual con un script propio del equipo, fuera del backlog y de la API interna. La baja la ejecuta una sola persona autorizada, sin segunda aprobación (RN-152 actualizada). El historial del proveedor de correo queda en la pregunta 31.
  6. ✅ `07-architecture.md` §3.3, ADR-007 y §6.3 se alinearon con esa decisión. Queda una nota para el script operativo: los triggers de inmutabilidad impiden el `DELETE`, así que debe ejecutarse con el rol dueño de la base.

### 2.2 Mayores (reducen la calidad)

#### M-01: C15 (Auditoría e historiales) no tiene una tarea que construya el servicio común

**Estado (2026-11-10): ✅ cerrado documentalmente.** Se aplicó la acción con tres ajustes, porque el análisis mostró que la acción original no bastaba:

- **Tarea nueva T-012** (C15, tamaño M, dependencias T-004 y T-005): «Implementar el servicio de auditoría e historial por campo». Las tareas que seguían se renumeraron (de T-012 a T-036 pasaron a T-013 a T-037) y se actualizaron las referencias en `08-backlog.md`, en este informe, en la pregunta 52 de `05-preguntas-abiertas.md` y en la enmienda E-014 de `00-constitucion.md`. Los totales pasan a 37 tareas (33 Must y 4 Should), 16 M, 19 L, 2 S y 55 h (49.5 h Must). La ruta crítica de 20 h no cambia: T-012 termina en la hora 6, antes que T-011 (hora 7). Si T-012 supera 1 h y pasa a L, termina en la hora 7 y tampoco la mueve.
- **Ajuste 1, consumidoras:** la acción decía «antes de T-014», pero la primera consumidora es T-013, que escribe `INVITACION_ENVIADA` e `INVITACION_FALLIDA`. T-013, T-014, T-015, T-016, T-017 y T-021 pasan a depender de T-012, y sus descripciones indican que escriben con ese servicio. Ninguna otra tarea inserta en `auditoria_eventos` ni en `historial_ediciones`.
- **Ajuste 2, dos modos de transacción:** el criterio de la acción («una falla al auditar revierte el cambio») solo cubre el modo normal. Tras el cierre de M-04, los eventos del resultado de un envío se escriben en una transacción propia y su falla no revierte nada. El servicio ofrece ambos modos y T-012 prueba los dos.
- **Ajuste 3, garantías centralizadas:** un registro cerrado de campos sensibles (PRINCIPIO-004) decide si el valor va cifrado o en claro, un campo no clasificado se rechaza y una lista cerrada de claves de `datos` por tipo de evento impide registrar tokens, hashes o credenciales. Así «solo cifrado» y «sin secretos» se verifican en un solo lugar.
- **Correcciones a la lista del hallazgo:** la lista de tareas que escriben auditoría incluía la anulación de pagos y comprobantes (hoy T-019) y omitía a T-013. Según RN-029 a RN-032, el registro de anulación ya guarda motivo, usuario y fecha, así que no escribe un evento de C15; la arquitectura sí lista HU-007 entre las HUs de C15, y si el PO quiere además un evento, se agrega al servicio sin cambiar su diseño. RN-166 se citó de forma tangencial; las reglas que gobiernan el servicio son RN-129, RN-161, RN-189 y RN-211.

El cierre no acredita implementación ni pruebas ejecutadas.

**Antecedente de auditoría (previo a la corrección):**

- **Dónde:** `08-backlog.md` §2.4 (nota sobre C15); `07-architecture.md` C15.
- **Hallazgo:** el backlog reparte la auditoría entre T-014, T-015, T-016, T-017, T-019 y T-021. Sin embargo, ninguna tarea construye el servicio común que escribe `auditoria_eventos` y `historial_ediciones` en la transacción del caller y que guarda **solo cifradas** las copias de los campos sensibles (PRINCIPIO-004; RN-129, RN-166).
- **Impacto:** se corre el riesgo de seis implementaciones distintas. Además, no queda probado que una copia de un campo cifrado no termine en `valor_anterior` en claro.
- **Acción:** crear una tarea «Implementar el servicio de auditoría e historial por campo» (C15, tamaño M, dependencias T-004 y T-005) antes de T-014. Su criterio: «al editar el correo de un contacto, `historial_ediciones` solo llena `valor_anterior_cifrado` y `valor_nuevo_cifrado`, y una falla al auditar revierte el cambio».

#### M-02: La suite de aislamiento (T-031) deja fuera las lecturas agregadas y los endpoints Should

**Estado (2026-11-10): ✅ cerrado documentalmente.** Se aplicó la acción con ampliaciones, porque el análisis mostró que una prueba de `404` solo detecta fugas en recursos pedidos por identificador:

- **Problema de fondo:** las 8 lecturas sin identificador (`listarUsuarios`, `listarContactos`, `listarComprobantes`, `obtenerPanelCartera`, `obtenerTiempoPromedioCobro`, `listarCuotasPorAvisar`, `listarIntentosAviso` y `obtenerListasCopias`) no devuelven un error cuando falta el filtro por empresa, devuelven datos ajenos. Además, la descripción de T-031 decía «todos los endpoints» y su criterio, «recursos con identificador».
- **T-031:** pasa a una suite dirigida por tabla que clasifica las 49 operaciones vigentes tras M-06 («por identificador», «lectura sin identificador», «sin datos de empresa») y falla si una queda sin clasificar. Las lecturas sin identificador se prueban con datos distintos por empresa y un control positivo (la empresa A ve lo suyo y nada de la B; con S/ 9,000.00 vencidos solo en la B, el panel de A muestra S/ 0.00). Los identificadores ajenos en el cuerpo (contacto 88, usuario 77, cuota 900) quedan explícitos. Se agrega T-022 a sus dependencias; no mueve la ruta crítica (T-031 termina en la hora 19, con 1 h de holgura). Se conserva el tamaño L con la nota «si supera 2 h, separar en una tarea M las lecturas sin identificador y la inspección de logs»; no se dividió para no cambiar los totales de ese momento (dividirla habría dado 37 tareas y 55 h; esos fueron los totales tras la tarea T-012 de M-01; M-06 los actualiza a 39 tareas y 60 h).
- **Ajuste a la acción 2:** T-034 (operaciones 40 y 41) y T-036 (operación 43) se prueban en `aislamiento.e2e` **con la bandera encendida**. Con la bandera apagada el `404` es automático (C-02) y la prueba pasaría sin demostrar aislamiento. M-06 agrega T-038 (operación 49) y la lectura de 44 con promesas activas en T-034. En T-031 las cuatro operaciones Should figuran como «pendiente de bandera». No se agregó T-031 como dependencia de T-034 ni de T-036: son Should y posteriores al MVP.

El cierre no acredita implementación ni pruebas ejecutadas.

**Antecedente de auditoría (previo a la corrección):**

- **Dónde:** `08-backlog.md` T-031, T-034 y T-036; HU-008, HU-011 y HU-012 (criterios de aislamiento).
- **Hallazgo:** T-031 solo recorre los «endpoints de recursos con identificador» y no depende de T-022 (panel). Quedan sin prueba de aislamiento `GET /panel`, `GET /avisos/cuotas-por-avisar`, los listados paginados y los endpoints 40, 41 y 43. Esto incluye los criterios de aislamiento de HU-008 («otra empresa con S/ 9,000.00 vencidos no suma»), de HU-011 y de HU-012.
- **Acción:**
  1. Agregar T-022 a las dependencias de T-031 y ampliar su criterio: «los listados, el panel y las cuotas por avisar no incluyen filas de la empresa sembrada B».
  2. Agregar a T-034 y T-036 el criterio «el endpoint queda cubierto por `aislamiento.e2e`».

#### M-03: T-013 no recoge el límite de recuperaciones ni otras reglas de HU-002

**Estado (2026-11-10): ✅ cerrado documentalmente.** Se aplicó la acción con ampliaciones, porque el análisis mostró que faltaban más comportamientos exigidos por HU-002 y por el contrato:

- **Corrección de cita:** el desbloqueo de la cuenta al restablecer la contraseña no está en RN-102 (que solo exige cerrar las sesiones) sino en RN-103, en la HU-002 y en `07-openapi.yaml`.
- **T-013, descripción y criterio:** recoge el límite de 3 enlaces de recuperación por 60 minutos (RN-260), con el ejemplo de RN-260 (10:00, 10:10 y 10:20; la solicitud de las 10:30 no envía y la de las 11:00:00 sí) en lugar de «a los 30 minutos». El conteo incluye los enlaces revocados, que `enlaces_acceso` ya conserva, así que no cambia el esquema. El conteo y la emisión van en una transacción que bloquea la fila del usuario, para evitar que dos solicitudes simultáneas emitan un cuarto enlace.
- **También recoge:** el desbloqueo y el reinicio del contador al restablecer (RN-103); la política de contraseñas con un validador único para activación y restablecimiento, ejecutado en el servidor antes de consumir el enlace (RN-246 a RN-253); la revocación del enlace anterior (RN-259); el envío solo a usuarios ACTIVOS con respuesta idéntica en los demás casos (RN-258); el rechazo al canjear si el usuario fue desactivado (RN-102); y los bordes exactos de vigencia (RN-098, RN-102).
- **Tamaño:** T-013 pasa de M a L (decisión del usuario, en lugar de dividirla). El esfuerzo total sube de 53 a 54 h (Must de 47.5 a 48.5 h) y los tamaños pasan de 16 M y 18 L a 15 M y 19 L. La ruta crítica de 20 h no cambia, porque T-013 no está en ella; la holgura de la cadena de usuarios baja de 3 h a 2 h. Si al estimar T-013 supera las 2 h, el servicio de invitación se separa en una tarea M (junto con M-01).

El cierre no acredita implementación ni pruebas ejecutadas.

**Antecedente de auditoría (previo a la corrección):**

- **Dónde:** `08-backlog.md` T-013; HU-002; RN-260, RN-102 y RN-243 a RN-253. El límite ya está en `07-openapi.yaml` (línea 218).
- **Hallazgo:** ni la descripción ni el criterio de T-013 mencionan:
  - el máximo de 3 enlaces de recuperación por usuario en 60 minutos (RN-260);
  - el desbloqueo de la cuenta al restablecer la contraseña (RN-102);
  - la política de contraseñas (de 8 a 128 caracteres, sin recortar ni normalizar, validada en el servidor; RN-243 a RN-253).
- **Acción:** agregar al criterio de T-013: «una cuarta solicitud a los 30 minutos responde igual, no envía correo y no revoca el enlace vigente; tras restablecer, la cuenta bloqueada queda desbloqueada; una contraseña de 7 o de 129 caracteres responde `422` sin consumir el enlace».

#### M-04: La falla del correo de invitación (QA-08) no está en T-014 ni en T-015

**Estado (2026-11-10): ✅ cerrado documentalmente.** Se aplicó la acción con ajustes, porque el criterio propuesto mezclaba el rechazo con el tiempo de espera y no cubría los reenvíos:

- **T-006:** el puerto de correo devuelve `ENVIADO`, `RECHAZADO` o `SIN_CONFIRMAR` y no reintenta (se desactivan los reintentos del cliente). Su criterio prueba el rechazo, el tiempo de espera de 10 s y que hay una sola llamada.
- **T-013:** incorpora el servicio compartido de invitación. Emite el enlace en la transacción de negocio, envía el correo fuera de ella y registra el resultado en una transacción propia (`INVITACION_ENVIADA` o `INVITACION_FALLIDA` con `datos.resultado`, sin el token ni su hash). Si falla la escritura de ese evento, no se revierte la creación: se responde igual con el resultado del envío y el error queda en logs con `idSolicitud` y `empresa_id` (decisión del usuario, opción a). El costo aceptado es que ese intento podría quedar sin evento de auditoría. Si T-013 supera las 2 h, el servicio se separa en una tarea M, junto con la de M-01.
- **T-014 y T-015:** usan ese servicio. Sus criterios exigen `201` con `RECHAZADO` o `SIN_CONFIRMAR`, usuario INVITADO con enlace vigente, evento `INVITACION_FALLIDA` sin el token, ausencia de segundo intento y reenvío con enlace nuevo que revoca el anterior. T-015 cubre también la reactivación sin contraseña y el rechazo de una nueva invitación al mismo correo.
- **`07-architecture.md`:** C15 y la tabla `auditoria_eventos` aclaran que estos eventos se escriben en una transacción propia, como excepción a «misma transacción que el cambio».

El cierre no acredita implementación ni pruebas ejecutadas.

**Antecedente de auditoría (previo a la corrección):**

- **Dónde:** `08-backlog.md` T-014 y T-015; HU-001 y HU-003 (criterios QA-08 de rechazo y de tiempo de espera); `07-architecture.md` §3.1 (`INVITACION_FALLIDA`).
- **Hallazgo:** las HUs exigen que, si Resend rechaza el envío o no responde a tiempo, la empresa y el usuario se conserven, el usuario quede INVITADO con su enlace vigente, no haya reintento automático y el intento quede auditado sin el enlace. Las tareas describen el alta atómica, pero no dicen que el correo va fuera de la transacción ni cómo se audita la falla.
- **Acción:** agregar a T-014 y a T-015 el criterio: «con Resend simulado que rechaza el envío o agota el tiempo de espera, el usuario queda INVITADO, existe el evento `INVITACION_FALLIDA` sin el token y la respuesta indica que el correo no se envió».

#### M-05: Simplificar fallos de avisos y cubrir la exclusión de cuotas no aptas — cerrado documentalmente

**Estado (2026-11-10): ✅ cerrado documentalmente por decisión del usuario y ajuste del backlog.** El hallazgo y la acción siguientes se conservan como **antecedente histórico superado** respecto de RN-159; la cobertura de RN-155 se incorpora a T-024. No se acredita implementación ni ejecución de pruebas.

- **Dónde (auditoría original):** `08-backlog.md` T-024; RN-155 y RN-159; HU-010. `07-openapi.yaml` ya define `NO_VERIFICABLE`, `advertenciaNoVerificable` y `SIN_CUOTAS_APTAS`.
- **Hallazgo:** T-024 no cubre:
  - el paso a `NO_VERIFICABLE` cuando vence la ventana de 24 horas de la clave de Resend (RN-159);
  - el envío de un aviso nuevo con advertencia después de ese paso;
  - la exclusión de las cuotas que dejaron de ser aptas al confirmar, con su motivo, y el rechazo `SIN_CUOTAS_APTAS` sin registrar un intento (RN-155).

  T-030 muestra la advertencia en la interfaz, pero ninguna tarea del backend la produce.
- **Acción:** agregar a T-024: «un intento sin confirmar con más de 24 horas pasa a `NO_VERIFICABLE` al verificarlo; si todas las cuotas seleccionadas quedaron canceladas, la respuesta es `SIN_CUOTAS_APTAS` y no se crea el intento; si se cancela una de dos, el correo sale con la otra y la respuesta informa la excluida». Si T-024 supera las 2 horas, dividirla.

**Resolución aplicada (2026-11-10):**
- El usuario sustituye el flujo anterior: rechazo, error o tiempo de espera del servidor terminan como NO_ENVIADO y permiten otro intento manual, sin verificación, espera de 24 horas ni advertencia adicional. Se retira RN-159, sin reutilizar su ID.
- Se conservan historial, datos y destinatarios de cada intento, revalidación al confirmar y bloqueo solo mientras un intento EN_PROCESO mantiene su plazo de 10 s. El cierre libera las cuotas; la caída del proceso y las respuestas tardías se resuelven según ADR-006 sin otra acción del usuario.
- T-023 y T-030 muestran «No Enviado» y «Enviar aviso» cuando no existe éxito vigente. Un intento fallido posterior no borra la marca ni la fecha del último envío exitoso.
- T-024 cubre exclusión parcial con motivo, cuotas de comprobantes anulados, saldo actualizado, contacto desactivado y 422 SIN_CUOTAS_APTAS sin intento ni llamada al proveedor cuando ninguna cuota sigue apta. La exclusión no invalida por sí misma los destinatarios confirmados de los grupos sobrevivientes.
- Se ajustan alcance, reglas, glosario, HU-010, arquitectura, contrato y tareas. OpenAPI pasa a 48 operaciones al retirar la antigua 49; T-031 y T-032 conservan todas las rutas vigentes. Las 37 tareas, sus tamaños, dependencias y previsión de 55 h se mantienen; T-024 indica dividir si una nueva estimación supera 2 h.
- El adaptador compartido mantiene sus diagnósticos ENVIADO/RECHAZADO/SIN_CONFIRMAR para no cambiar invitaciones. C11 los traduce al resultado de avisos; no hay flujo de verificación.
- Se documenta que un tiempo de espera puede corresponder a una solicitud recibida por el proveedor y que un intento manual posterior puede repetir el correo, como consecuencia aceptada de la simplificación.
- Validación documental: Postman CLI valida la sintaxis OpenAPI sin incidencias; se comprueban 48 operaciones tanto en el YAML como en §4.2, 512 referencias internas resueltas, los ejemplos afectados y ausencia de obligaciones vigentes de verificación. La validación ampliada de ejemplos con reglas Spectral de Postman requiere iniciar sesión y no se ejecutó. Este cierre no acredita software implementado ni pruebas funcionales ejecutadas.

#### M-06: S1 no puede entregarse completa con T-034 y T-035

**Estado (2026-11-10): ✅ cerrado documentalmente.** El usuario autorizó el paquete propuesto, incluida la aprobación de HU-017. Se mantiene el alcance, sin excepción ni adelanto de S4 al MVP.

- **Promesas activas:** T-034 extiende la operación 44 y T-035 muestra fecha prometida y creador en notificaciones para los tres roles de su empresa. Incluyen pruebas de cambios de clasificación y aislamiento con S1 encendida; T-035 depende además de T-030 y pasa de M a L.
- **Historial compartido:** HU-017 se incorpora al conjunto aprobado y RN-078 a la traza de HU-011. T-038 (L, C15/C7/C12; depende de T-012/T-019) implementa la consulta cronológica en un solo corte; T-039 (L, C1; depende de T-028/T-038) agrega la vista. No se confunden con el historial por campo de T-012 ni con la lista de promesas. Se conservan los hechos y se recalculan transiciones, orden y empates conforme a RN-078. T-038 no depende de T-034 y se reutiliza si S4 llega primero.
- **Contrato y registro:** se agrega `GET /cuotas/{cuotaId}/historial`, operación 49, con disponibilidad `FUNCIONALIDAD_S1 || FUNCIONALIDAD_S4`. S4 se configura apagada y reservada; no se implementan su reporte ni exportaciones. T-005 registra el controlador mínimo desde el MVP y T-031/T-032 contemplan las 49 operaciones. T-038 prueba aislamiento con solo S1 y con solo S4 habilitada, además del `404` con ambas apagadas; así se mantiene cerrado C-02.
- **Aceptación:** no liberar S1 hasta completar T-034, T-035, T-038 y T-039 con sus verificaciones. La visibilidad y el historial siguen siendo parte de S1 aunque S4 no esté entregada. Las nuevas vistas incluyen criterios de teclado y axe-core.
- **Planificación:** 39 tareas (33 Must, 6 Should), 2 S/15 M/22 L; 60 h (49.5 Must, 10.5 Should). El incremento es 5 h; la ruta crítica del MVP conserva 20 h. Sin límite de recursos, T-035 determina S1 completa en la hora 21; T-039 termina en la 18.
- **Validación documental:** se verifican sintaxis YAML con analizador local (sin errores ni advertencias), 524 referencias internas resueltas, los 49 pares método/ruta iguales al inventario, los tres ejemplos 200 y el ejemplo 404 de historial contra sus esquemas mediante comprobación local de sus restricciones, y recálculo de totales y dependencias (DAG válido). Postman CLI no está disponible en el PATH de esta sesión; no se acredita un lint nuevo con esa herramienta. No se ejecutaron pruebas funcionales: el repositorio contiene especificaciones.

**Antecedente de auditoría (previo a la corrección):**

- **Dónde:** `02-alcance.md` §3.1; HU-011 (criterio de visibilidad de promesas); RN-036 y RN-078; HU-017 (sugerida); `08-backlog.md` T-034 y T-035.
- **Hallazgo:** el alcance dice que, al entregarse S1, «se aplican todas sus validaciones, la visibilidad de promesas de RN-036 y el historial de RN-078». Ninguna tarea implementa la visibilidad de las promesas activas en el panel de notificaciones (RN-036, un criterio de HU-011). Tampoco hay tarea para el historial cronológico de la cuota (RN-078), porque HU-017 no está aprobada.
- **Acción:**
  1. Agregar a T-034 y T-035 la visibilidad de las promesas activas para todos los roles (el YAML ya la prevé en las cuotas por avisar, línea 2304).
  2. Pedir al PO que apruebe HU-017 antes de liberar `FUNCIONALIDAD_S1`, o que registre la excepción.

#### M-07: No hay tareas de despliegue, ambientes ni protección de producción

**Estado (2026-11-10): ✅ cerrado documentalmente por decisión del usuario.** Se cubre la omisión de planificación con T-001 (crear y vincular el repositorio GitHub), T-002 (configurar y verificar la protección de `main`, de M a L) y tres tareas nuevas Must de tamaño L: T-041 prepara Railway US East y Neon `us-east-1`, separa bases y secretos y configura la aprobación humana de producción; T-042 despliega pruebas y verifica TLS/HSTS, conexión cifrada y API interna privada; T-043 exige las verificaciones Must, restaura un respaldo aislado según RN-240 y promueve a producción el artefacto validado, con aprobación humana y sin vías automáticas que la eludan. Se actualizan totales y grafo: 43 tareas (37 Must y 6 Should), 2 S/15 M/26 L y 68 h (57.5 Must, 10.5 Should). La ruta crítica técnica hasta producción pasa a 22 h; no incluye esperas externas. El cierre no acredita recursos aprovisionados, protecciones configuradas, aprobación de un despliegue ni pruebas ejecutadas.

**Corrección del análisis original:** ADR-002 exige compartir sitio (mismo dominio registrable), sin exigir por sí solo un único hostname. Por decisión del usuario se adopta un mismo origen HTTPS por ambiente, con SPA en `/` y API pública en `/api`, manteniendo la API interna exclusivamente privada. Los nombres y DNS pendientes se registran en la pregunta 53; la pregunta 39 corresponde solo al dominio remitente de correo. La 26 conserva el bloqueo de producción por secretos e incidentes, y la 31 mantiene la revisión operativa y legal previa al lanzamiento. La modalidad local sigue pendiente en 41 y 42. El hallazgo y la acción siguientes se conservan como antecedente histórico; la tarea única propuesta originalmente se sustituye por T-041 a T-043 para respetar el límite de 2 h por tarea.

- **Dónde:** `08-backlog.md` §1.1; `07-architecture.md` §1.2 y §6.1 (PRINCIPIO-002, 004, 011 y 012); `02-alcance.md` D1, D4 y D7; RN-012.
- **Hallazgo:** ninguna tarea cubre:
  - crear el repositorio (D4: «falta crear el repositorio»);
  - aprovisionar Railway y Neon en `us-east-1`;
  - configurar las variables y claves por ambiente;
  - TLS 1.2 o superior y HSTS (RN-012), y `sslmode=require` hacia Neon;
  - publicar `apps/api-interna` solo en la red privada (ADR-007);
  - la *environment protection* de producción (PRINCIPIO-011).

  Además, T-002 solo «documenta en el README» la protección de `main`, cuando PRINCIPIO-012 exige configurarla. La definición de dominios web para cumplir ADR-002 no tenía un pendiente propio: la referencia original de este reporte a la pregunta 39 era incorrecta, porque esa pregunta trata del correo; ahora se registra en la 53.
- **Acción:**
  1. Crear una tarea «Desplegar los ambientes de prueba y producción en Railway y Neon» (Must, dependencias T-002, T-014 y T-024). Su criterio: «una conexión TLS 1.1 se rechaza, la respuesta incluye HSTS, `/api/v1/interno` no responde desde Internet y el despliegue a producción espera una aprobación manual».
  2. Cambiar en T-002 «documentar» por «configurar y verificar» la protección de `main`.

#### M-08: No hay tareas para la rotación de claves ni para la prueba de recuperación de respaldos

**Estado (2026-11-10): ✅ cerrado por rediseño.** Al analizar el hallazgo se vio que la rotación exigía una segunda referencia por columna para no romper la unicidad. Además, el D.S. 016-2024-JUS no exige cifrado en reposo ni por campo. Por decisión del usuario, la enmienda E-015 retira el cifrado por campo, las referencias HMAC y la gestión de claves de datos: RN-011, RN-142, RN-189 a RN-192, RN-219, RN-220, RN-223, RN-224, RN-226, RN-229, RN-231 a RN-239, RN-241 y RN-242. La unicidad pasa a índices únicos sobre el valor normalizado (T-003). T-004 queda como servicio de hash y normalización (M). RN-240 se mantiene como prueba de restauración aislada sin claves, conforme al art. 51 del reglamento. Como no hay claves de datos, el entregable documental de RN-237 a RN-242 deja de ser necesario; la custodia de secretos y el procedimiento de incidentes siguen en la pregunta 26, que bloquea el paso a producción. Se agrega además T-040 (M) y se amplía T-012 a L para la trazabilidad de accesos del art. 46 (RN-263 a RN-266). El cierre documental no acredita implementación ni pruebas ejecutadas. La acción original se conserva como antecedente.

- **Dónde:** RN-141, RN-142, RN-226 y RN-235 a RN-242; `07-architecture.md` ADR-003 («rotar exige recifrar en segundo plano»); `08-backlog.md` T-004.
- **Hallazgo:** T-004 carga las claves por versión y lleva el contador `claves_uso`, pero no existen:
  - el proceso de recifrado y reindexación de referencias durante una rotación, manteniendo la unicidad (RN-226);
  - la prueba de recuperación conjunta de datos, claves y referencias (RN-240);
  - el procedimiento operativo con responsable, plazo y límites, que RN-237 exige **antes de producción**.
- **Acción:**
  1. Agregar a T-004 el criterio «con dos versiones de clave activas, un correo indexado con la versión 1 impide crear un duplicado con la versión 2».
  2. Crear una tarea Must «Implementar el recifrado por rotación y la prueba de restauración» (C13 y C16).
  3. Crear un entregable documental para RN-237 a RN-242, con responsable asignado en `05-preguntas-abiertas.md` (preguntas 26 y 41).

#### M-09: La eliminación de contactos (T-016) depende de la pregunta 51, todavía abierta

**Estado (2026-11-10): ✅ cerrado documentalmente.** Por decisión del usuario se adopta la opción B de la pregunta 51: eliminar un contacto sin comprobantes retira el registro, el correo cifrado y sus `correo_ref`, y conserva sin cambios, cifrado, su historial de ediciones; el contacto nuevo que reutiliza el correo no lo hereda. Se descartaron borrar o anonimizar el historial, porque RN-255 establece que la eliminación ordinaria no supone eliminar todas las copias históricas de datos personales; esas copias se atienden por el procedimiento interno de RN-151 (pregunta 31), fuera del alcance. Quedó en RN-130, pregunta 51, HU-004 (QA-13), `07-architecture.md` §3.1 y §6.3, y en la descripción y el criterio de T-016. El cierre no acredita implementación ni pruebas ejecutadas.

**Antecedente de auditoría (previo a la decisión; la acción original queda sustituida):**

- **Dónde:** `08-backlog.md` T-016; RN-127, RN-129 y RN-130; `07-architecture.md` §6.3; pregunta 51 (QA-13).
- **Hallazgo:** la arquitectura elige por ahora conservar el historial del contacto eliminado. Pero RN-127 exige que eliminar el contacto libere el correo «retirando el valor cifrado y todas sus referencias de búsqueda vigentes». El historial guarda copias cifradas del correo, y la conservación de historiales es un requisito transversal. T-016 no define qué pasa con esas copias.
- **Acción:** resolver la pregunta 51 antes de empezar T-016. Mientras tanto, agregar a T-016 el criterio mínimo: «tras eliminar, no queda ningún `correo_ref` del contacto y el mismo correo se acepta en un contacto nuevo», y aislar la decisión sobre el historial en un solo método del caso de uso.

#### M-10: La aprobación humana de los casos de referencia no está modelada como dependencia

**Estado (2026-11-10): ✅ cerrado documentalmente por cambio del requisito.** Por decisión del usuario, E-014 retira de PRINCIPIO-007 la aprobación humana específica de los casos de referencia; la acción original de añadir una aprobación en el PR y una dependencia bloqueante de QA-10 queda sustituida. T-010 y T-036 mantienen pruebas automáticas con entradas y resultados esperados trazables a reglas y criterios, determinismo y cobertura mínima del 80 % en los módulos de dominio. La aceptación humana se realiza sobre el aplicativo por historia o entrega; las ambigüedades de negocio no resueltas se consultan a la persona encargada del proyecto. Se mantiene PRINCIPIO-012 sobre revisión humana de cada merge.

**Verificación del cierre:** constitución, alcance, reglas, preguntas abiertas, HUs, arquitectura, backlog y notas de actualización de antecedentes alineados con E-014. No queda una aprobación de casos pendiente para cerrar T-010 o T-036. El cierre documental no acredita pruebas ejecutadas ni aceptación funcional realizada.

**Antecedente de auditoría (previo a E-014; la acción original queda sustituida por el cierre anterior):**

- **Dónde:** PRINCIPIO-007; `08-backlog.md` T-010 y T-036; HU-012 (QA-10: «casos de referencia pendientes de aprobación»).
- **Hallazgo:** T-010 exige un archivo `casos-referencia` aprobado por la persona encargada del proyecto, y T-036 usa los casos de redondeo de HU-012, que siguen sin aprobar. Ningún entregable ni dependencia representa esa aprobación, así que las tareas pueden cerrarse con casos no aprobados.
- **Acción:** agregar a T-010 y a T-036 el criterio «el pull request que agrega o cambia `casos-referencia` tiene la aprobación registrada de la persona encargada del proyecto», y registrar la aprobación de QA-10 como pendiente bloqueante de T-036.

#### M-11: RN-151 y RN-257 son MUST y no tienen HU ni tareas

**Estado (2026-11-10): ✅ cerrado documentalmente respecto de la cobertura del backlog.** Por decisión del usuario, las solicitudes formales de eliminación de datos personales son gestionadas internamente por el equipo de VenceYa, en coordinación con la empresa cliente. RN-151 y RN-257 mantienen su prioridad MUST como obligaciones operativas, fuera del alcance funcional y del backlog de desarrollo, sin HU, pantalla, endpoint, componente ni tarea técnica. Una automatización posterior sería un requerimiento nuevo.

La definición operativa y revisión legal permanecen abiertas en la pregunta 31 antes del lanzamiento; no bloquean las tareas de desarrollo. El cierre no acredita el procedimiento como operativo, cumplimiento legal ni autorización de lanzamiento. La propuesta original de asignar una persona concreta y una fecha calendario se sustituye por este tratamiento, por decisión del usuario; no es condición de este cierre. Se registra la gestión a cargo del equipo de VenceYa sin inventar designaciones o fechas de compromiso.

**Verificación del cierre:** alcance §5.2, RN-151 y su contexto, glosario #53, pregunta 31 y su respuesta parcial, HU-004 y las tablas de cobertura QA, arquitectura §6.3, criterios del backlog y diseño de seguridad alineados. Se mantiene RN-257 sobre textos libres y el mantenimiento ordinario de RN-127/RN-130. La pregunta 51 y M-09 sobre historiales de contactos eliminados se resolvieron el 2026-11-10 (opción B: se conserva el historial). La comprobación es documental; no se implementó ni probó un procedimiento operativo.

**Antecedente de auditoría (previo a la decisión de alcance; la acción original queda sustituida por el cierre anterior):**

- **Dónde:** `03-reglas-de-negocio.md` RN-151 y RN-257; `06-user-stories.md` «Revisión QA» §5; pregunta 31.
- **Hallazgo:** el procedimiento de solicitudes de eliminación de datos personales es obligatorio y no tiene HU, componente ni tarea, porque depende de la revisión legal de la pregunta 31.
- **Acción:** asignar un responsable y una fecha a la pregunta 31 en `05-preguntas-abiertas.md`, y dejar constancia en el backlog de que RN-151 y RN-257 están bloqueadas, con su efecto en el lanzamiento (Ley 29733).

### 2.3 Sugerencias (mejoran la calidad)

| # | Dónde | Hallazgo | Acción |
|---|---|---|---|
| S-01 | `07-architecture.md` C7 · `08-backlog.md` T-019 | La arquitectura asigna la anulación de comprobantes a C7, pero T-019 la implementa en C8. | Alinear: actualizar C7 y C8 en la arquitectura o cambiar el componente de T-019 a «C7 / C8». |
| S-02 | `07-architecture.md` C16 · T-003 | C16 dice «migraciones TypeORM» y T-003, «migraciones SQL versionadas». | Fijar la herramienta en T-003 (por ejemplo, migraciones TypeORM que contienen SQL explícito). |
| S-03 | T-011 | El criterio prueba la inactividad con 31 minutos; HU-002 define el borde exacto (09:29:59 vigente, 30:00 cerrada) y el cierre a las 12 horas. | Usar los valores de borde de HU-002 y agregar el caso de las 12 horas con actividad continua. |
| S-04 | T-001, T-002, T-003, T-032 | Estas tareas indican «Infraestructura» y no nombran a qué principio o requisito transversal responden. | Indicar la traza, por ejemplo T-003 → PRINCIPIO-003, PRINCIPIO-006 y RN-007; T-002 → PRINCIPIO-011 y PRINCIPIO-012. |
| S-05 | T-026 | Construye la pantalla de preferencias (HU-008, endpoints 16 y 17), pero solo indica HU-003 y HU-009. | Agregar HU-008 a «HU relacionada». |
| S-06 | T-010 | La suite de referencia no incluye `clasificarTipoAviso` (HU-010) ni los valores rechazados de la ventana (por ejemplo, 30). | Agregar los ejemplos de tipo de aviso de HU-010 y de la ventana de HU-008. |
| S-07 | T-033, T-035, T-037 | Las pruebas de accesibilidad solo cubren las pantallas Must; las Should quedan sin control de PRINCIPIO-010. | Agregar a T-035 y T-037 el criterio «axe-core sin violaciones graves y operable con el teclado». |
| S-08 | HU-006 y HU-008 · RN-071 | RN-071 (fecha efectiva) es MUST y la usa el MVP (T-008), pero solo figura en la lista de reglas de HU-011 (Should). Lo mismo ocurre con RN-080 y RN-118, aunque en esas dos el alcance §3.1 lo permite. | Agregar RN-071 a las reglas relacionadas de HU-006 y HU-008. |
| S-09 | T-015, T-021, T-023, T-024 | Hay criterios de HU que no figuran en las tareas: la reactivación según tenga o no contraseña (QA-09), la revocación del enlace al desactivar, la copia única cuando el correo administrativo coincide con alguien de la lista, el usuario inactivo dentro de una lista y el comentario de hasta 500 caracteres en mayúsculas (QA-04). | Agregarlos a los criterios de completitud correspondientes. |
| S-10 | `07-architecture.md` §6.2 | No hay tareas para las métricas de errores 5xx e intentos NO_ENVIADO por motivo (ajustado por M-05), ni para verificar el rendimiento (p95 < 500 ms en el panel con 5,000 cuotas). | Crear una tarea S o M de observabilidad y una prueba de carga del panel con datos ficticios. |
| S-11 | `08-backlog.md` §2.7 | El grafo omite las aristas T-004 → T-016, T-006 → T-024, T-007 → T-017 y T-008 → T-018. | Completar el grafo o aclarar que solo muestra las dependencias principales. |
| S-12 | `06-user-stories.md` «Revisión QA» §5 | Los conteos de la segunda pasada no cuadran: dice 180 reglas referenciadas por las HU-001 a HU-012 (el recálculo da 181) y pone RN-150 como «solo en HUs sugeridas», aunque figura en «Requisitos transversales». | Recalcular la tabla con el script de trazabilidad y corregir las cifras. |

### 2.4 Verificaciones que pasan

| Verificación | Resultado |
|---|---|
| El stack respeta la constitución (PRINCIPIO-002) | ✅ Node.js 22, NestJS 10, PostgreSQL 16, React 18 con shadcn/ui, Neon y Railway. Las librerías elegidas (TypeORM, decimal.js, pino, Recharts, Resend, Playwright y axe-core) no agregan otro motor de base de datos ni otro framework de frontend. T-002 prohíbe Redis, colas, SMS y pasarelas de pago (PRINCIPIO-009 y PRINCIPIO-011). |
| Alineación de prioridades | ✅ M1 a M6 → HU-001 a HU-010 (Must) → T-001 a T-033 y T-040 a T-043 (Must, incluidos controles transversales y despliegue). S1/S5 e historial compartido → HU-011, HU-012 y HU-017 (Should) → T-034 a T-039 (Should). Las Could (C1 y C3) y lo fuera de alcance (O1 a O19) no tienen tareas. |
| Orden de dependencias (DAG) | ✅ Ninguna tarea depende de otra con un número mayor. |
| Totales del backlog | ✅ Las sumas por prioridad (37 + 6), por tipo (7 + 18 + 12 + 6), por componente (43) y por tamaño (2 S, 15 M y 26 L) cuadran. |
| Esfuerzo | ✅ 2 × 0.5 + 15 × 1 + 26 × 2 = 68 h (M-07); Must = 57.5 h y Should = 10.5 h. |
| Ruta crítica | ✅ Recalculada sin límite de recursos ni esperas externas: T-041 termina en la hora 5, T-042 en la 19, T-033 en la 20 y T-043 en la 22. La cadena de construcción y pruebas hasta T-033 conserva 20 h; la entrega de producción añade T-043. |
| Inventario de operaciones | ✅ 49 `operationId` en `07-openapi.yaml`, iguales al inventario de §4.2 y a lo que dice el backlog. |
| Valores numéricos repetidos en varios documentos | ✅ Iguales en alcance, reglas, HUs, arquitectura y backlog: de 2 a 120 cuotas; hasta 12 dígitos enteros y 2 decimales; ventana de 7, 10 o 15 días; sesión de 30 minutos de inactividad y 12 horas absolutas; bloqueo tras 5 fallos por 15 minutos; invitación de 72 horas y recuperación de 60 minutos; motivo y comentario de hasta 500 caracteres; Argon2id con 19 MiB, 2 iteraciones y paralelismo 1; cobertura ≥ 80 %; tiempo de espera de Resend de 10 s; plazo de 10 s del servidor por intento de aviso. La espera de 24 horas se retira por M-05. |
| Ejemplos de los criterios de completitud | ✅ Reparto 333.33, 333.33 y 333.34; vencimientos 2026-02-28, 2026-03-31 y 2026-04-30; diferencia de S/ 66.67; saldo de S/ 600.00 tras la anulación; carrera entre S/ 400.00 y S/ 300.00. Todos coinciden con las HUs. |
| Referencias a reglas | ✅ Ninguna HU, tarea ni sección de la arquitectura cita una regla inexistente o retirada. |

---

## 3. Matriz de trazabilidad

### 3.1 Alcance → HUs → componentes → tareas

| Alcance | HU | Componentes (`07-architecture.md` §2) | Tareas | Estado |
|---|---|---|---|---|
| M6 | HU-001 Alta de empresa y primer administrador | C4, C13, C14, C15, C16 | T-014 (con T-004, T-006, T-012 y T-013) | ✅ M-04 y M-01 cerrados documentalmente |
| M6 | HU-002 Activar cuenta, iniciar sesión y recuperar contraseña | C1, C3, C13, C14 | T-011, T-013, T-025 | ✅ C-01 cerrado · M-03 cerrado documentalmente |
| M6 | HU-003 Administrar usuarios y roles | C1, C5, C13, C14, C15 | T-015, T-026 (con T-012) | ✅ M-04 y M-01 cerrados documentalmente · ⚠️ S-09 |
| M1 | HU-004 Gestionar el catálogo de contactos | C1, C6, C13, C15 | T-016, T-027 (con T-012) | ✅ M-09 cerrado documentalmente (pregunta 51, opción B) · M-01 cerrado documentalmente |
| M1, M2 | HU-005 Registrar y editar comprobantes con cuotas | C1, C7, C12, C15 | T-007, T-010, T-017, T-027 (con T-012) | ✅ M-01 cerrado documentalmente |
| M3 | HU-006 Registrar un cobro o pago | C1, C8, C12 | T-008, T-010, T-018, T-020, T-028 | ✅ |
| M3, M6 | HU-007 Anular un pago o un comprobante | C1, C7 (S-01), C8, C12, C15 | T-008, T-010, T-019, T-020, T-028 | ✅ |
| M4 | HU-008 Consultar el panel de cartera | C1, C5, C10, C12 | T-009, T-010, T-021, T-022, T-029 | ✅ M-02 cerrado documentalmente |
| M5, M6 | HU-009 Configurar el correo administrativo y las copias | C1, C5, C13, C15 | T-021, T-026 (con T-012) | ✅ M-01 cerrado documentalmente · ⚠️ S-09 |
| M5 | HU-010 Enviar avisos de vencimiento | C1, C11, C12, C13, C14 | T-009, T-023, T-024, T-030 | ✅ M-05 cerrado documentalmente |
| S1 | HU-011 Reprogramar con promesa de pago | C1, C9, C11, C12 | T-034, T-035 (entrega junto con T-038/T-039) | ✅ M-06 cerrado documentalmente |
| S1 / S4 | HU-017 Historial cronológico de cuota | C1, C7, C12, C15 | T-038, T-039 | ✅ M-06 cerrado documentalmente; compartido y reutilizable |
| S5 | HU-012 Tiempo promedio de cobro | C1, C10, C12 | T-036, T-037 | ✅ M-10 cerrado documentalmente (E-014) |
| Transversal | Requisitos transversales (*Definition of Done*) | C2, C13, C15, C16, infraestructura | T-001 a T-006, T-012, T-031, T-032, T-033, T-040 a T-043 | ✅ C-02, M-01, M-07 y M-08 cerrados documentalmente; despliegue pendiente de ejecución |
| S3 | HU-013 (sugerida) | — | — | Sin aprobación del PO |
| S4 | HU-014 a HU-016 (sugeridas) | — (reporte y exportaciones previstos en §6.3) | — | Reporte/exportaciones sin aprobación; HU-017 ya aprobada y trazada por separado (M-06). |
| Procedimiento interno | HU-018 (no se desarrolla) | — (bloqueo en C3 y C11) | Bloqueo: T-011, T-013, T-014, T-024 y T-031 · Constancia y baja: procedimiento operativo manual fuera del alcance | ✅ C-03 cerrado (pregunta 52) |
| Procedimiento interno de solicitudes de eliminación (RN-151, RN-257) | Sin HU por diseño | No requiere componente | Fuera del backlog de desarrollo; gestión interna de VenceYa coordinada con la empresa cliente | ✅ M-11 cerrado documentalmente; pendiente operativo y legal previo al lanzamiento en pregunta 31 |
| C1, C3 | — | — | — | Could, sin diseño técnico |
| O1 a O19 | — | — | — | Fuera de alcance |

### 3.2 Reglas → HUs → componentes → tareas

| HU | Reglas relacionadas (de `06-user-stories.md`) | Cantidad (MUST/total) | Componentes | Tareas |
|---|---|---|---|---|
| HU-001 | RN-005, RN-094 a RN-100, RN-139, RN-160, RN-162, RN-165, RN-211, RN-217, RN-222 | 15/15 | C4, C13, C14, C15 | T-014, T-004, T-006, T-012 |
| HU-002 | RN-098, RN-101 a RN-103, RN-139, RN-140, RN-143, RN-149, RN-152 (bloqueo), RN-243 a RN-253, RN-258 a RN-260 | 23/23 | C3, C13, C14, C1 | T-011, T-013, T-025 (RN-260 en T-013; M-03 cerrado documentalmente) |
| HU-003 | RN-008 a RN-010, RN-060, RN-070, RN-097 a RN-100, RN-139, RN-160, RN-161 | 12/12 | C5, C3, C15, C1 | T-015, T-011, T-012, T-026 |
| HU-004 | RN-006, RN-044, RN-126 a RN-130, RN-139, RN-160, RN-162, RN-254 a RN-256 | 13/13 | C6, C13, C15, C1 | T-016, T-027, T-012 |
| HU-005 | RN-001 a RN-005, RN-008, RN-015 a RN-020, RN-057, RN-081 a RN-083, RN-093, RN-121, RN-122, RN-130 a RN-133, RN-153, RN-154, RN-160, RN-162 | 27/27 | C7, C12, C15, C1 | T-007, T-010, T-017, T-027, T-012 |
| HU-006 | RN-008, RN-021, RN-022, RN-024 a RN-026, RN-063, RN-084, RN-088, RN-089, RN-091, RN-092, RN-153, RN-156, RN-157, RN-160 | 16/16 | C8, C12, C1 | T-008, T-010, T-018, T-020, T-028 |
| HU-007 | RN-003, RN-008, RN-027 a RN-032, RN-058 a RN-062, RN-084, RN-090, RN-091, RN-123, RN-124, RN-160, RN-162 | 20/20 | C7, C8, C12, C15, C1 | T-008, T-019, T-020, T-028 |
| HU-008 | RN-007, RN-008, RN-021, RN-022, RN-046 a RN-049, RN-069, RN-105 a RN-111, RN-119, RN-120, RN-169 a RN-174, RN-180 a RN-182, RN-198, RN-201, RN-205 a RN-210 | 35/35 | C10, C5, C12, C1 | T-009, T-010, T-021, T-022, T-029 |
| HU-009 | RN-008, RN-042, RN-060, RN-104, RN-134, RN-135, RN-164 a RN-168, RN-175 a RN-179 | 16/16 | C5, C13, C15, C1 | T-021, T-026, T-012 |
| HU-010 | RN-008, RN-013, RN-039, RN-041 a RN-043, RN-045, RN-066, RN-067, RN-075, RN-104, RN-112 a RN-117, RN-120, RN-130, RN-136 a RN-138, RN-152 (bloqueo), RN-155, RN-157 y RN-158, RN-162, RN-164, RN-178, RN-212 a RN-215 | 33/33 | C11, C14, C12, C13, C1 | T-006, T-009, T-023, T-024, T-030 (M-05 cerrado documentalmente; RN-159 retirada) |
| HU-011 | RN-008, RN-021, RN-033 a RN-036, RN-045, RN-071 a RN-074, RN-078, RN-080, RN-085, RN-118, RN-160, RN-162, RN-198 | 9/18 | C9, C11, C12, C1 | T-034, T-035; historial de entrega en T-038/T-039 (M-06) |
| HU-012 | RN-008, RN-025, RN-053, RN-084, RN-088 a RN-090, RN-147, RN-198, RN-205, RN-206 | 9/11 | C10, C12, C1 | T-036, T-037 |
| HU-017 | RN-008, RN-060, RN-078, RN-083, RN-084, RN-088, RN-198, RN-205, RN-206 | 8/9 | C15, C7, C12, C1 | T-038, T-039 |

**Unión de las HUs aprobadas:** 182 reglas vigentes (171 MUST y 11 SHOULD), tras retirar RN-159 por M-05, incluido el bloqueo de RN-152 incorporado por C-03. RN-151 y RN-257 se trazan al procedimiento interno en §3.4, no a las HUs ni a las tareas; su exclusión funcional no acredita su cumplimiento operativo.

### 3.3 Reglas transversales (solo *Definition of Done*) → componentes → tareas

| Grupo | Reglas (solo transversales) | Componentes | Tareas | Estado |
|---|---|---|---|---|
| Aislamiento por empresa | RN-052 (más RN-007 y RN-008, que también están en HUs) | C2, C16 | T-003, T-005, T-031 | ✅ C-01 cerrado · M-02 cerrado documentalmente |
| Protección de datos, unicidad, secretos y trazabilidad (E-015) | RN-139 a RN-141, RN-143, RN-216 a RN-218, RN-221, RN-222, RN-225, RN-227, RN-228, RN-230, RN-240, RN-262 a RN-266 | C13, C15, C16, infraestructura | T-003, T-004, T-012, T-040, T-041, T-043 | ✅ M-08 cerrado por rediseño y M-07 cerrado documentalmente · RN-240 se verifica en T-043 para la nube; operación local pendiente en pregunta 41 |
| Datos personales fuera de logs y errores | RN-014, RN-193 a RN-197 | C2 | T-005, T-031 | ✅ |
| TLS 1.2 o superior | RN-012 | Infraestructura | T-041, T-042, T-043 | ✅ M-07 cerrado documentalmente; verificación de TLS, HSTS y conexión a Neon pendiente de ejecución |
| Fecha de cálculo inyectada | RN-023, RN-199, RN-200, RN-202 a RN-204 | C12, C2 | T-001 (lint), T-007 a T-010 | ✅ |
| Conservación y baja | RN-150 (más RN-028, que también está en HU-007) | C16 | T-003, T-020 | ✅ El bloqueo desde la terminación efectiva está en T-011, T-013, T-014, T-024 y T-031; la baja a 30 días es un procedimiento operativo manual fuera del alcance (C-03, pregunta 52) |

**Total solo transversales:** 47 reglas MUST.

### 3.4 Reglas operativas o con cobertura funcional diferida

| Regla | Prioridad | HU | Componente | Tareas | Hallazgo |
|---|---|---|---|---|---|
| RN-152 | MUST | Bloqueo: HU-002 y HU-010 · Constancia y baja: procedimiento operativo (HU-018 no se desarrolla) | C3, C11 | Bloqueo: T-011, T-013, T-014, T-024, T-031 · Baja: fuera del alcance | C-03 cerrado (pregunta 52) |
| RN-151, RN-257 | MUST (obligaciones operativas) | Sin HU por diseño | No requiere componente | Fuera del backlog; gestión interna del equipo de VenceYa coordinada con la empresa cliente | M-11 cerrado documentalmente; pregunta 31 abierta por definición operativa y revisión legal previas al lanzamiento |
| RN-079 | MUST (aplica al entregar S4) | HU-014 a HU-016 (sugeridas) | — | — | Sin acción en el MVP: no existe ningún endpoint de exportación. |
| RN-054 a RN-056, RN-148, RN-261 | SHOULD (S3) | HU-013 (sugerida) | — | — | Pendiente de aprobación del PO |
| RN-050, RN-051, RN-076, RN-077, RN-144 a RN-146, RN-163, RN-183 a RN-188 | SHOULD (S4) | HU-014 a HU-016 (sugeridas) | — | — | Reporte/exportaciones pendientes del PO |
| RN-078 | SHOULD (S1 o S4, primera entrega) | HU-017 aprobada; referenciada por HU-011 | C15, C7, C12, C1 | T-038, T-039 | M-06 cerrado documentalmente |

### 3.5 Trazabilidad backward: tareas → HU

| Tarea | HU | Tarea | HU | Tarea | HU |
|---|---|---|---|---|---|
| T-001 | Infraestructura (S-04) | T-014 | HU-001 | T-027 | HU-004, HU-005 |
| T-002 | Infraestructura (S-04) | T-015 | HU-003 | T-028 | HU-006, HU-007 |
| T-003 | Infraestructura (S-04) | T-016 | HU-004 | T-029 | HU-008 |
| T-004 | Transversal (HU-001 a HU-004, HU-009, HU-010) | T-017 | HU-005 | T-030 | HU-010 |
| T-005 | Transversal (todas) | T-018 | HU-006 | T-031 | HU-001 a HU-010 |
| T-006 | Transversal (HU-001 a HU-003, HU-010) | T-019 | HU-007 | T-032 | Infraestructura (S-04) |
| T-007 | HU-005 | T-020 | HU-006, HU-007 | T-033 | HU-002 a HU-010 |
| T-008 | HU-006, HU-007 | T-021 | HU-008, HU-009 | T-034 | HU-011 |
| T-009 | HU-008, HU-010 | T-022 | HU-008 | T-035 | HU-011 |
| T-010 | HU-005 a HU-008 | T-023 | HU-010 | T-036 | HU-012 |
| T-011 | HU-002 | T-024 | HU-010 | T-037 | HU-012 |
| T-012 | Transversal (HU-001, HU-003, HU-004, HU-005, HU-009) | T-025 | HU-002 | T-038 | HU-017 |
| T-013 | HU-002 | T-026 | HU-003, HU-009 (S-05) | T-039 | HU-017 |
| T-040 | Transversal (HU-001 a HU-010; trazabilidad) | T-041 | Infraestructura (PRINCIPIO-002, PRINCIPIO-004 y PRINCIPIO-011) | T-042 | Infraestructura (despliegue y verificación de pruebas) |
| T-043 | Infraestructura (entrega Must con aprobación humana) | — | — | — | — |

**Resultado:** no hay tareas huérfanas. Hay 7 tareas de infraestructura (T-001, T-002, T-003, T-032 y T-041 a T-043); las tres nuevas trazan a los requisitos de despliegue y protección. S-04 se conserva como sugerencia de explicitar los principios en las cuatro tareas originales.

### 3.6 Componentes → tareas

| Componente | Tareas | Componente | Tareas |
|---|---|---|---|
| C1 SPA web | T-025 a T-030, T-033, T-035, T-037, T-039 | C9 Reprogramaciones | T-034 |
| C2 Capa transversal | T-005, T-031, T-032 | C10 Panel | T-022, T-036 |
| C3 Autenticación | T-011, T-013 | C11 Avisos | T-023, T-024; participa en T-034 |
| C4 Operaciones internas | T-014 | C12 Dominio puro | T-007 a T-010 |
| C5 Usuarios y configuración | T-015, T-021 | C13 Servicio de hash | T-004 |
| C6 Contactos | T-016 | C14 Correo | T-006 |
| C7 Comprobantes | T-017; participa en T-038 | C15 Auditoría e historiales | T-012 (escritura), T-038 (consulta cronológica) y T-040 (trazabilidad) |
| C8 Pagos y anulaciones | T-018, T-019, T-020 | C16 Base de datos | T-003 (también la prueban T-020 y T-031) |

La infraestructura transversal corresponde a T-001/T-002 (repositorio y CI) y T-041 a T-043 (ambientes, despliegue y protección de producción); no agrega un componente funcional a C1 a C16.
