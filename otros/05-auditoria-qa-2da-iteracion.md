# 05 - Auditoría QA del Spec Pack VenceYa

Fecha: 2026-11-06. Resultado: **madurez 3/5; necesita resolver conflictos y completar casos antes de delegar una implementación integral a agentes**.

Se ejecuta la tarea de `05-auditoria-qa.xml`: auditoría documental, sin modificar decisiones de negocio. Fuentes: `00-constitucion.md`, `01-project-brief.md` (referido sin extensión en el XML), `02-alcance.md`, `03-reglas-de-negocio.md` y `04-glosario.md`. Se contrastaron también el registro de preguntas abiertas y `06-diseno-seguridad-datos.md`, incorporado por referencia en la constitución. El análisis anterior se conserva porque contiene respuestas humanas. Los IDs QA2 son propios de esta revisión y no sustituyen los IDs de aquella auditoría.

Las ubicaciones RN remiten a `03-reglas-de-negocio.md`; PRINCIPIO a `00-constitucion.md`; las entradas numeradas del glosario a `04-glosario.md`. Las sugerencias requieren decisión del equipo cuando cambian comportamiento. No son nuevas reglas aprobadas. Esta revisión evalúa coherencia documental; no acredita cumplimiento legal, seguridad implementada ni pruebas de software.

## Estado de los hallazgos revisados posteriormente

| ID | Estado | Registro de cierre |
|---|---|---|
| QA2-03 | Resuelto | Decisión del usuario (2026-11-07) incorporada en RN-041, RN-066, RN-113, RN-138 y RN-155 (elegibilidad comprobada al confirmar cada envío o reenvío; una cuota que dejó de ser apta se excluye y el usuario ve el motivo). Glosario #30c alineado. Véase el cierre al final. |
| QA2-04 | Resuelto | Decisión del usuario (2026-11-07) incorporada en RN-113, RN-136 y RN-138 (dirección aplicable en el reenvío y conservación del historial). Véase el cierre al final. |
| QA2-05 | Resuelto | Decisión sobre avisos en el MVP documentada al final de esta auditoría. |
| QA2-06 | Resuelto | Pagos en RN-156; botones en RN-157; avisos en RN-067, RN-112, RN-137, RN-158 y RN-159. Alcance M3, M5 y D2 y glosario alineados; véase el cierre al final. |
| QA2-07 | Resuelto | Regla general RN-160 y ejemplos de concurrencia en RN-003, RN-062, RN-073, RN-082, RN-091 y RN-100. Glosario alineado; véase el cierre al final. |
| QA2-08 | Resuelto documentalmente | RN-088 define la cancelación económica; RN-089 exige orden cronológico por cuota y corrección mediante anulación y nuevo registro. RN-053, RN-074, RN-076 y glosario #35 y #60 alineados. Véanse los casos de referencia al final. |
| QA2-09 | Cerrado documentalmente por exclusión | Conciliación y extractos fuera de esta versión mediante O19 y E-009; S2, K6, RN-037, RN-038 y RN-125 retirados sin reutilizar sus IDs. Véase el cierre al final. |
| QA2-10 | Cerrado documentalmente por simplificación del mantenimiento | Decisión del usuario (2026-11-07): solo ACTIVO y DESACTIVADO; eliminación con confirmación únicamente sin comprobantes y liberación del correo; se retira la seudonimización. RN-127, RN-129, RN-130, RN-151, RN-112 y RN-155, alcance y glosario alineados. Véase el cierre al final. |
| QA2-11 | Cerrado documentalmente mediante control operativo manual | Decisión del usuario (2026-11-07): registro de bajas fuera de la base restaurada; revisión y reaplicación antes de habilitar accesos o avisos. RN-150, RN-152, alcance §5.2 y diseño de seguridad alineados. Véase el cierre al final. |
| QA2-12 | Cerrado documentalmente por simplificación del alcance | Decisión del usuario (2026-11-08): la empresa exporta y conserva los históricos disponibles mediante las funciones existentes antes de la terminación efectiva. Se retiran el paquete contractual, la entrega por VenceYa y la evidencia de recepción como requisito de baja. Se mantienen los 30 días desde la terminación, haya exportado o no. PRINCIPIO-006 (E-011), RN-152, alcance, glosario y seguridad alineados. Véase el cierre al final. |
| QA2-13 | Resuelto documentalmente | Decisión del usuario (2026-11-07): reenvío por el equipo de VenceYa para el primer administrador y revocación del enlace anterior, con auditoría. RN-095 y RN-098 alineadas; glosario #50. Véase el cierre al final. |
| QA2-14 | Resuelto documentalmente | Decisión del usuario (2026-11-07): enlace de un solo uso y único vigente, estado comprobado al canjearlo, reactivación según haya o no contraseña y política de 8 a 128 caracteres. RN-098, RN-099, RN-102 y RN-143; glosario #50 y #51. Véase el cierre al final. |
| QA2-15 | Resuelto documentalmente | Decisión del usuario (2026-11-07): matriz acotada en RN-060 y cambio efectivo de rol con cierre de todas las sesiones, auditoría y orden consistente de operaciones concurrentes en RN-161. M6, RN-010, RN-100, RN-149, glosario, diseño de seguridad y pregunta 40 alineados. Véase el cierre al final. |
| QA2-16 | Resuelto documentalmente | Decisión del usuario (2026-11-07): el contenido de los campos de texto libre es responsabilidad de quien lo ingresa; el sistema no lo busca, depura ni sustituye. PRINCIPIO-005 (E-010), RN-014, RN-151 y glosario #38 alineados. Véase el cierre al final. |
| QA2-17 | Resuelto | Validaciones numéricas y límites operativos documentados al final de esta auditoría; formato numérico peruano, contrato del API, límites aprobados y casos de aceptación en «Cierre documental de QA2-17 — 2026-11-08». |
| QA2-18 | Resuelto documentalmente | Decisión del usuario (2026-11-08): el comprobante anulado es de solo lectura (estado terminal), con una sola anulación. RN-061, RN-062, RN-081, RN-082 y RN-091 alineadas; glosario #8 y #48. Véase el cierre al final. |
| QA2-19 | Resuelto documentalmente | Decisión del usuario (2026-11-08): la primera reprogramación y las posteriores requieren saldo vigente positivo y comprobante no anulado, con validación al guardar. RN-033 y RN-073, alcance S1 y glosario #23 alineados; véase el cierre al final. |
| QA2-20 | Resuelto documentalmente | Decisión del usuario (2026-11-08): contrato propio del reporte en RN-076 y RN-077; totales de saldo para los grupos 1 a 3 e importe completo de cuotas para canceladas, fechas inclusivas y validadas, columnas, resultados vacíos y reapertura por anulación. Alcance S4 y glosario #46 alineados; véase el cierre al final. |
| QA2-21 | Resuelto documentalmente | Decisión del usuario (2026-11-08): el historial se ordena por la fecha del hecho y muestra la fecha de registro de los eventos; las transiciones a VENCIDA, CANCELADA y reapertura son derivadas y se recalculan; los eventos registrados se conservan; orden fijo de empates. RN-078 (con referencia en RN-088) y glosario #47 alineados; véase el cierre al final. |
| QA2-23 | Resuelto documentalmente | Decisión del usuario (2026-11-08): los intentos durante el bloqueo no lo prolongan y las peticiones automáticas no son actividad. Eventos y fronteras definidos en RN-103, RN-149 y glosario #66 a #68; véase el cierre al final. |
| QA2-24 | Resuelto documentalmente | Decisión del usuario (2026-11-08): contrato de entrada en la regla nueva RN-162 (TRIM, mayúsculas en el servidor, vacío tras normalizar, límites, caracteres y formato de correo). RN-093, RN-126, RN-131, RN-044, RN-115, RN-129, RN-139, edición de comprobantes y glosario #5 alineados. Véase el cierre al final. |
| QA2-25 | Resuelto documentalmente | Decisión del usuario (2026-11-08): contrato común en RN-163, referenciado en RN-050, RN-051 y RN-077: CSV UTF-8 con BOM, delimitador y escape, fechas AAAA-MM-DD, tipos explícitos en Excel con fechas DD/MM/AAAA y protección de textos. Glosario #37 alineado; véase el cierre al final. |
| QA2-26 | Resuelto documentalmente | Decisión incorporada en RN-023, RN-069, RN-076, RN-077 y RN-144: momento de corte, lectura coherente y recálculo en cada consulta o exportación. Alcance y glosario alineados; véase el cierre al final. |
| QA2-27 | Resuelto documentalmente | Corrección del 2026-11-08: alcance §3 (síntesis del MVP) y supuesto S4 ahora distinguen el correo administrativo de la empresa de los usuarios en copia configurados (RN-042, RN-104, RN-134); glosario #4 aclara que el rol ADMINISTRADOR no recibe copia por sí mismo. Alcance M5 y glosario #30, #31 y #31a ya estaban alineados. Véase el cierre al final. |
| QA2-28 | Resuelto documentalmente | Decisión del usuario (2026-11-08): comprobante sin pagos vigentes anulable, con todas sus cuotas ANULADAS por consecuencia; listado y exportación excluyen anulados por defecto y solo los incluyen por solicitud explícita. RN-021, RN-022, RN-084, RN-049, RN-062, RN-090, RN-091 y RN-144 a RN-146, alcance M4 y S4 y glosario alineados; véase el cierre al final. |
| QA2-29 | Resuelto documentalmente | Decisión del usuario (2026-11-08): contrato vigente y terminación definidos en RN-150 y RN-152; formalización por personal autorizado de VenceYa, fecha efectiva, bloqueo de accesos y plazo de baja. Sesión y actividad resueltas en QA2-23; extractos excluidos por QA2-09. QA2-12 sustituye posteriormente las condiciones de entrega: exportación a cargo del cliente y entrada #70 retirada, sin condicionar la baja. Véanse ambos cierres al final. |
| QA2-30 | Resuelto documentalmente | Decisión del usuario (2026-11-08): corregidos los patrones EARS de RN-017, RN-018, RN-104 a RN-106, RN-119, RN-134 y RN-146; RN-150 conserva State-driven y separa su contexto. Obligaciones extraídas en RN-164 a RN-188, con matriz de trazabilidad y aceptación al final. No cambia prioridades ni comportamiento. QA2-31 y QA2-32 cuentan con cierres documentales propios; QA2-33 cuenta con cierre documental posterior (2026-11-09). |
| QA2-31 | Resuelto documentalmente | Decisión del usuario (2026-11-08): obligaciones separadas con IDs estables RN-189 a RN-257, conservando los IDs principales, fuentes y prioridades. RN-150 ya atómica tras QA2-30. Matriz de 81 obligaciones/casos de aceptación en el cierre al final; QA2-33 cuenta con cierre documental posterior (2026-11-09). |
| QA2-32 | Resuelto documentalmente | Decisión del usuario (2026-11-08): cabecera y capacidades redactadas como obligaciones del sistema, con permisos y prioridades independientes. RN-017/RN-018 ya corregidas por QA2-30; RN-037 sigue retirada. RN-050, RN-051 y RN-077 conservan SHOULD y S4. Se revisan los demás usos de PUEDE y se añaden casos de aceptación en el cierre al final. QA2-31 se cerró documentalmente en su revisión posterior; QA2-33 cuenta con cierre documental posterior (2026-11-09). |
| QA2-33 | Resuelto documentalmente | Decisión del usuario (2026-11-09): DSO asignado a la funcionalidad S5; K8 desvinculado de S3; matriz de entregas y dependencias en alcance §3.1; historial compartido S1/S4 y corrección de vencimientos sin S1 explícitos; PRINCIPIO-007 precisado mediante E-012. Véanse trazabilidad y casos CA33-01 a CA33-12 al final. |
| QA2-34 | Cerrado documentalmente por diferimiento a fases posteriores | Decisión del usuario (2026-11-09): el framework BMAD no exige fechas ni metas técnicas en el spec pack de producto. Responsables, métricas de cobertura, accesibilidad y carga, operación local, dominio remitente y criterios por etapa se definen más adelante (arquitectura, diseño de pruebas y controles de preparación). Las preguntas abiertas conservan su estado. Véase el cierre al final. |
| QA2-35 | Resuelto | Las entradas 29c y 30 del glosario ya están en filas separadas, con cuatro columnas cada una. Véase la nota de cierre al final. |

Los hallazgos originales y el puntaje de la auditoría se conservan como registro histórico.
Las obligaciones históricas de entregar una exportación completa y exigir evidencia de entrega antes de la baja, así como los pendientes sobre esa entrega, quedan sustituidos por el cierre de QA2-12 y E-011 (2026-11-08). No representan obligaciones vigentes.

## CRÍTICAS

### QA2-01 — Contradicción: eliminación contractual frente a conservación absoluta

- **Ubicación:** PRINCIPIO-006; RN-028, RN-099, RN-124, RN-125 y RN-150; alcance §5.2.
- **Problema:** RN-150 exige eliminar los datos del servicio al terminar el contrato, pero la constitución prohíbe eliminar pagos sin excepción y otras reglas prohíben borrar usuarios, anulaciones y conciliaciones. No existe una implementación que cumpla literalmente ambas obligaciones. El alcance declara expresamente que no modifica la constitución.
- **Sugerencia:** decidir y aprobar una enmienda que distinga inmutabilidad durante la operación de la eliminación por baja contractual; precisar autoridad, objetos afectados, evidencia de exportación y borrado, y tratamiento de respaldos. No resolverlo con una excepción implícita en código.

### QA2-02 — Contradicción: información económica en errores

- **Ubicación:** PRINCIPIO-005; RN-014 frente a RN-016 y RN-092.
- **Problema:** RN-014 prohíbe importes personales en mensajes de error y su ejemplo excluye expresamente el saldo. RN-092 obliga a informar el saldo vigente al rechazar un pago; RN-016 exige informar la diferencia al rechazar cuotas. En contactos personas naturales, una respuesta de validación puede cumplir estas reglas financieras y violar la constitución.
- **Sugerencia:** separar explícitamente el error sin datos económicos de la presentación funcional autorizada del saldo o diferencia, o aprobar el cambio de política pertinente. Añadir un caso con persona natural y verificar tanto respuesta técnica como interfaz.

## ALTAS

| ID | Tipo | Ubicación | Problema y caso de fallo | Sugerencia |
|---|---|---|---|---|
| QA2-03 | Contradicción | RN-041, RN-090, RN-113, RN-138, RN-151 | El reenvío de una entrega fallida debe conservar el contenido original, pero la cuota puede haberse pagado, el comprobante anulado o el contacto seudonimizado. Reenviar literalmente infringe las prohibiciones de avisar. | Establecer precedencia de elegibilidad y qué sucede con el intento excluido; probar los tres cambios entre envío y reenvío. |
| QA2-04 | Ambigüedad | RN-129, RN-135 a RN-138 | Si cambia el correo del contacto o el administrativo tras un fallo, no se sabe si reenviar al destinatario histórico o al nuevo. RN-129 manda los avisos posteriores al nuevo; RN-138 no distingue actualización de dirección de conservación de contenido. | Decidir dirección aplicable por tipo de destinatario, qué se muestra para confirmar y cómo conservar el historial. |
| QA2-05 | Regla faltante | RN-066, RN-067, RN-137; alcance D2 | Solo existen enviado/no entregado, aunque los estados dependen de eventos de entrega y rebote. Falta definir aceptación por proveedor, espera de confirmación, tiempo de espera incierto y eventos tardíos, repetidos o fuera de orden. | Especificar máquina de estados y criterio de éxito, correlación y deduplicación de eventos, validación de su origen y transición ante rebote posterior. No equiparar automáticamente aceptación con entrega. |
| QA2-06 | Regla faltante | RN-024 a RN-029, RN-045, RN-092, RN-113 | La concurrencia de pagos que exceden saldo está cubierta, pero no el doble envío de una misma solicitud: dos pagos duplicados de 100 con saldo 500 pueden guardarse. Tampoco hay tratamiento del envío de correo confirmado por el proveedor cuando falla el registro local. | Definir identidad de la operación y resultado de reintentos, doble clic y recuperación tras respuesta perdida, sin confundir dos pagos legítimos iguales con un duplicado. |
| QA2-07 | Regla faltante | RN-003, RN-062, RN-073, RN-081, RN-091, RN-100 | Faltan resultados atómicos para editar mientras se paga, anular comprobante mientras se registra pago, dos reprogramaciones simultáneas, altas simultáneas del mismo documento y desactivar simultáneamente a los dos administradores. | Extender los invariantes de concurrencia ya usados en RN-092/RN-123 a estas operaciones y especificar rechazo sin efectos parciales. |
| QA2-08 | Ambigüedad | RN-053, RN-074, RN-076, RN-088, RN-089; glosario #35 | “Último pago que dejó sin saldo” puede ser último por registro o por fecha económica. Se permite registrar pagos retroactivos. Ejemplo: pago de 60 fechado 20/10, luego pago de 40 fechado 10/10: el segundo registro cierra el saldo, pero económicamente el cobro total se alcanza el 20/10. Afecta DSO, canceladas del periodo y promesas. | Definir una única fecha económica de cancelación independiente del orden de carga, tratamiento de anulaciones y casos de referencia con pagos retroactivos. |
| QA2-09 | Regla faltante | RN-037, RN-038, RN-125; alcance S2 y O5 | Se referencia un movimiento bancario, pero no se define cómo existe en el sistema, sus campos, moneda, sentido, unicidad ni criterio de coincidencia. Tampoco si admite varios pagos, cómo corregir una conciliación equivocada ni cómo listar pendientes. | Completar el contrato de conciliación y de registro del extracto, evitando incorporar números de cuenta/CCI excluidos; decidir cardinalidad y corrección con historial. |
| QA2-10 | Contradicción / regla faltante | RN-151 frente a RN-127, RN-129, RN-130; glosario #53 | El contacto seudonimizado queda desactivado y no debe recibir avisos, pero RN-130 permite reactivar contactos y RN-129 editar sus datos. No se distingue desactivación ordinaria de seudonimización. Tampoco se determina si conserva la referencia del correo original o libera su unicidad. | Definir estado y transiciones permitidas, permisos y sustitutos únicos; decidir tratamiento de referencias protegidas y prohibición o condiciones de reactivación. |
| QA2-11 | Regla faltante | RN-150, RN-151; diseño §Custodia y rotación | RN-151 exige reaplicar seudonimizaciones tras restaurar, pero no define dónde recuperar decisiones posteriores al respaldo. RN-150 no exige reaplicar bajas contractuales: una restauración anterior puede revivir una empresa eliminada. | Diseñar registro de supresiones recuperable fuera del punto restaurado, alcance sobre copias y bloqueo de reapertura hasta reaplicar las bajas y seudonimizaciones. |
| QA2-12 | Regla faltante | RN-150; alcance O17 y S4 | “Exportación completa” de salida no tiene formato, contenido, destinatario autorizado ni mecanismo de entrega. Las exportaciones ordinarias son listados de cuotas y no cubren todos los pagos, usuarios, auditorías y avisos. | Especificar el paquete de salida por separado, sus relaciones, protección, validación y relación temporal con el borrado; decidir qué ocurre si la entrega falla. |
| QA2-13 | Regla faltante | RN-094, RN-095, RN-098 | Si vence la invitación del primer administrador, solo un ADMINISTRADOR puede reenviarla, pero aún no existe ninguno activo. Tampoco se define recuperación de una invitación que no llegó. | Añadir recuperación mediante el procedimiento interno autorizado, con auditoría y revocación del enlace anterior. |
| QA2-14 | Regla faltante | RN-098 a RN-102, RN-143 | La invitación no exige explícitamente uso único; faltan reglas para enlaces simultáneos, desactivar al invitado y reactivarlo sin contraseña. El hash está definido, pero no la aceptación de contraseñas vacías, longitud o límites. | Especificar consumo y revocación de enlaces, comprobación de estado al canjearlos, transiciones INVITADO/DESACTIVADO y política de contraseñas aprobada. |
| QA2-15 | Contradicción / pendiente conocido | RN-060, RN-105, RN-119, RN-141; alcance M6; pregunta 40 | “Todas las acciones” solo exceptúa la moneda ajena, aunque la ventana es propia y las claves no corresponden a roles de negocio. La vigencia de permisos tras cambiar el rol sigue pendiente; una sesión puede conservar privilegios retirados. | Expresar permisos como matriz acotada por reglas y resolver pregunta 40 con criterio verificable de aplicación del nuevo rol. |
| QA2-16 | Ambigüedad | RN-151; PRINCIPIO-005; glosario #38 | La seudonimización enumera cuatro campos y sus copias, mientras la política reconoce datos identificativos también en textos libres. No se determina cómo localizar nombres/correos dentro de comentarios, motivos o contenido de avisos; tampoco cómo compatibilizarlo con registros inmutables. | Definir inventario de ubicaciones y procedimiento para textos libres, referencias e historial, con decisión explícita sobre excepciones a inmutabilidad cuando corresponda. |
| QA2-17 | Ambigüedad / regla faltante | RN-016, RN-024, RN-122, RN-132 | Dos decimales se expresan para cuotas, pero no se define rechazo o redondeo de un pago 0,001, precisión máxima de importes, ni número de cuotas cero, negativo o fraccionario. | Definir dominio numérico de cada entrada, rechazo o normalización y límites aprobados; probar valores límite y evitar que la implementación decida el resultado financiero. |
| QA2-18 | Regla faltante | RN-061, RN-081, RN-091, RN-124 | Un comprobante anulado sin pagos/reprogramaciones todavía satisface la condición de edición de RN-081. RN-091 prohíbe pagos, reprogramaciones y reversión, pero no edición ni segunda anulación. RN-124 trata explícitamente anulaciones de pagos. | Precisar estado terminal del comprobante, edición y unicidad de su anulación; incluir dos solicitudes simultáneas. |

## MEDIAS

| ID | Tipo | Ubicación | Problema | Sugerencia |
|---|---|---|---|---|
| QA2-19 | Ambigüedad | RN-033, RN-073, RN-074 | La primera reprogramación no está condicionada expresamente a saldo positivo; puede crear una promesa “activa” en una cuota cancelada, que RN-074 clasificaría cumplida. | Hacer explícita la elegibilidad común de primera y siguientes reprogramaciones. |
| QA2-20 | Ambigüedad | RN-076, RN-077 | No se define qué suma el total de canceladas (saldo cero, importe o cobros), límites inclusivos del periodo, columnas completas ni validación de fechas del reporte. RN-144 cubre otra exportación. | Definir contrato propio del reporte y casos de periodo vacío/invertido, reapertura por anulación y total de canceladas. |
| QA2-21 | Ambigüedad | RN-078, RN-023, RN-088 | El historial mezcla fechas económicas con fechas de registro. Un pago retroactivo puede borrar una transición a vencida observada anteriormente o mantener una transición que ya no corresponde al cálculo económico. | Distinguir cronología auditada y reconstrucción económica; decidir cómo se muestran transiciones derivadas, correcciones y empates. |
| QA2-22 | Ambigüedad | RN-055, RN-148, RN-071 | “Por orden de registro” no fija sentido ni desempate estable al cortar 12 pagos. Además, reprogramar quita una cuota del conjunto VENCIDAS y puede mejorar el indicador aunque se diga que las reprogramaciones no reducen el atraso. | Precisar desempate total y añadir ejemplo de indicador antes/después de reprogramar una deuda sin pagos. Confirmar el efecto de selección sin cambiar por cuenta propia la fórmula aprobada. |
| QA2-23 | Resuelto documentalmente | RN-103, RN-149 | No se define si el contador vuelve a cero al terminar el bloqueo, si intentos durante el bloqueo lo prolongan ni qué actividad reinicia la sesión (peticiones automáticas, varias pestañas). | Definir eventos y fronteras temporales con pruebas de reloj; conservar los plazos ya aprobados. |
| QA2-24 | Regla faltante | RN-093, RN-126, RN-131, RN-139 | No hay contrato de longitud y caracteres para documento/nombre/comentario; “obligatorio” no aclara cadenas de espacios. La normalización de correo no sustituye su validación sintáctica. | Definir validaciones de entrada homogéneas para alta y edición, valores vacíos tras normalización y límites, sin imponer formato SUNAT. |
| QA2-25 | Regla faltante | RN-050, RN-051, RN-077, RN-145 | Faltan codificación, delimitador, escape de CSV, tipos en Excel y tratamiento de textos que parecen fórmulas. Nombre y documento son entradas del usuario. | Especificar interoperabilidad y salida literal segura, con casos de comillas, saltos de línea, ceros iniciales y texto iniciado por signo igual. |
| QA2-26 | Ambigüedad | RN-077, RN-144; PRINCIPIO-007 | Una fecha de cálculo común no garantiza las mismas filas entre pantalla y exportación si hubo pagos entre ambas. Tampoco se define coherencia entre tarjetas y listado consultados concurrentemente. | Acordar si se usa una instantánea común o recálculo visible y cómo se informa el momento de datos; probar una actualización intermedia. |
| QA2-27 | Glosario / contradicción | Glosario #4; alcance §3 frente a RN-042, RN-104, RN-134 | El glosario afirma que el Administrador recibe el correo administrativo y el MVP dice copia al administrador. El correo es independiente y los administradores no se incluyen automáticamente en las listas. | Corregir la síntesis y definición para distinguir rol, buzón administrativo y usuario configurado en copia. |
| QA2-28 | Glosario / contradicción | Glosario #29c; RN-049, RN-145 | El glosario describe estado de cuota más marca ANULADO; RN-049 manda mostrar anulados sin estado de cuota; RN-145 usa ANULADO dentro de la columna de estado. | Definir representación por superficie y aclarar que la exportación no introduce un cuarto estado del dominio. |
| QA2-29 | Glosario incompleto | RN-037, RN-066, RN-103, RN-149, RN-150; glosario | “Movimiento del extracto”, “entrega”, “sesión”, “actividad”, “contrato vigente” y “terminación” no tienen definición operativa suficiente. El movimiento se menciona dentro de conciliación, sin contrato de datos propio. | Incorporar definiciones enlazadas a las decisiones de QA2-05, 09, 12 y 23; definir quién y qué evento termina el contrato. |
| QA2-30 | Formato EARS | RN-104 a RN-106, RN-134, RN-146; RN-150 | Se usa Optional con DONDE para acciones/eventos, en lugar de presencia de una característica; RN-150 declara Event-driven pero combina estado, evento y excepciones. | Usar CUANDO para eventos, MIENTRAS para estado y DONDE para características opcionales; dividir obligaciones conservando trazabilidad. |
| QA2-31 | Formato compuesto | RN-011, RN-014, RN-023, RN-094, RN-113, RN-139 a RN-143, RN-150, RN-151 | Un ID agrupa múltiples obligaciones, prohibiciones y excepciones. Un ejemplo no cubre todas y un test aprobado puede ocultar obligaciones sin verificar. | Separar criterios atómicos con subidentificadores estables y matriz obligación/caso de aceptación; no reutilizar IDs retirados. |
| QA2-32 | Ambigüedad normativa | Cabecera de reglas; RN-017, RN-018, RN-037, RN-050, RN-051, RN-077 | PUEDE está definido como opcional, pero se usa para conceder capacidades exigidas por Must/Should. Un agente puede interpretar que no necesita implementarlas. | Separar permiso del actor de opcionalidad del producto: “DEBE permitir al rol…” y mantener prioridad de entrega aparte. |
| QA2-33 | Trazabilidad de alcance | Alcance S3, §1.2 y §3; RN-053, RN-147; PRINCIPIO-007 | El DSO tiene reglas y obligación de pruebas, pero no una funcionalidad clara en la tabla de alcance; K8 está enlazado a comportamiento de pago. Los Must referencian reprogramaciones Should sin detallar aceptación del MVP sin ellas. | Asignar DSO a una entrega y documentar dependencias y comportamiento sin cada Should. No convertir toda referencia normativa en obligación de entrega en el MVP. |
| QA2-34 | Verificabilidad / pendientes conocidos | PRINCIPIO-007, PRINCIPIO-010; alcance §4 y §7; preguntas 26, 31, 35 a 37, 39, 41, 42 | Faltan responsables efectivos y evidencia de aprobación de casos, medida de cobertura (líneas/ramas/etc.), carga y tiempos objetivo. Operación local, dominio remitente y controles operativos siguen pendientes. No hay criterios de salida por etapa para distinguir construcción, piloto y producción. | Asignar responsables, fechas y puertas por etapa; concretar pruebas de cobertura, accesibilidad y carga sin sustituir las decisiones ya confirmadas de 80 % y AA. |

## BAJAS

| ID | Tipo | Ubicación | Problema | Sugerencia |
|---|---|---|---|---|
| QA2-35 | Formato | Glosario #29c y #30 | Las dos entradas están en la misma línea de tabla, unidas por `|| 30`; se rompe la tabla y la entrada de aviso puede perderse al procesarla. | Separarlas en dos filas y validar número de columnas. |
| QA2-36 | Glosario / trazabilidad | Glosario #1 y #49; alcance S1 a S4 y supuestos S1 a S8 | Empresa está definida dos veces; S1/S4 identifican tanto funcionalidades como supuestos, creando referencias ambiguas. | Unificar Empresa y usar prefijos distintos para supuestos, con referencias actualizadas. |
| QA2-37 | Ejemplos / formato | RN-047 frente a RN-046/RN-069; RN-057 frente a RN-131; alcance encabezado y brief preguntas | RN-047 ejemplifica dos totales de monedas simultáneos aunque el panel solo muestra una; “sin cuotas” de RN-057 significa pago único pero se exige una cuota. La fecha del alcance precede cambios y el brief conserva abierta la pregunta sobre rol del tratamiento ya decidida provisionalmente. | Aclarar ejemplos como vistas separadas/pago único, fechar revisión y enlazar pendientes vigentes al registro central. |
| QA2-38 | Ambigüedad técnica documental | PRINCIPIO-001 y PRINCIPIO-002 | “Todo el código” en español no distingue identificadores propios de APIs obligatorias de bibliotecas. La prohibición de dependencias de otros motores no distingue dependencias transitivas o herramientas de prueba. | Precisar fronteras verificables del lint y revisión sin cambiar idioma de dominio ni stack aprobado. |

## Cobertura y decisiones ya resueltas

Se revisaron registro, crédito, saldo y estados, pagos/anulaciones, reprogramación, conciliación, avisos, panel, reportes, indicador, permisos, edición, alta y acceso, cifrado, retención y glosario. Los hallazgos cubren las cinco categorías solicitadas; algunos afectan varias a la vez.

No se reabren como vacíos: confirmación inmediata del pago y vigencia del comprobante; saldo con pagos no anulados; reapertura; exclusión de comprobantes anulados; sobrepago y su carrera específica; reparto a céntimos y vencimientos mensuales; envío manual; rol exportador; fórmula aprobada del indicador; mes inicial del DSO; normalización y cifrado; duración de sesión; nivel AA y cobertura del 80 %. Las observaciones de esta revisión se refieren a interacciones, excepciones o aceptación aún no determinadas.

No se detectó un término de dominio inequívocamente definido pero totalmente sin uso que justifique eliminarlo. Las duplicidades y definiciones inconsistentes sí se enumeran. La ausencia de una definición técnica no exige convertir todo vocabulario de infraestructura en glosario: se señalan los términos que alteran resultados o permisos.

Los pendientes operativos y legales ya registrados no se presentan como descubrimientos nuevos. La pregunta 31 sigue siendo una revisión humana pendiente; aquí se detectan conflictos entre documentos, no se dictamina qué política satisface la ley.

## Puntaje y orden de resolución

**3 de 5.** Escala: 1 = intención sin reglas; 2 = reglas parciales; 3 = estructura sólida con conflictos/casos críticos pendientes; 4 = coherente y verificable con pendientes operativos delimitados; 5 = listo para agentes con decisiones y aceptación completas.

El pack tiene IDs, ejemplos, prioridades y decisiones recientes detalladas. No alcanza 4 porque conserva obligaciones incompatibles, flujos no cerrados y resultados financieros dependientes de interpretación. El volumen documental no compensa esos vacíos.

Orden sugerido: resolver QA2-01/02 y las interacciones de avisos/seudonimización; cerrar integridad transaccional, fechas económicas y acceso; completar conciliación y salida contractual; luego alinear glosario, formato y trazabilidad. Para cerrar cada hallazgo, registrar la decisión del equipo, actualizar todas sus ubicaciones y añadir casos de aceptación, incluidos los bordes descritos. No se implementó software ni se ejecutaron pruebas de aplicación porque el repositorio contiene el Spec Pack y la tarea solicitada es su auditoría.

## Resolución posterior de QA2-05

**2026-11-06, decisión del usuario:** se simplifica el seguimiento de avisos en el MVP. La lista de cuotas muestra «Enviado» y la fecha del último aviso del tipo y vencimiento vigentes solo cuando Resend acepta la solicitud; ofrece «Reenviar aviso» con confirmación y conserva los intentos en la bandeja interna. Un rechazo confirmado muestra un error y no marca la cuota. El MVP no procesa webhooks de entrega ni rebote ni muestra estados de entrega por destinatario. «Enviado» no significa entregado o leído. Se actualizaron M5, D2, K5, RN-043, RN-045, RN-066, RN-067, RN-112, RN-137, RN-138 y el glosario. El caso de respuesta incierta de Resend se conserva en RN-067; su mecanismo de verificación y recuperación sigue pendiente en QA2-06. El hallazgo original se conserva arriba como antecedente y el puntaje histórico de esta auditoría no se recalcula.

## Resolución posterior de QA2-17

**2026-11-06, decisión del usuario y límites operativos propuestos:** el usuario pidió importes numéricos sin negativos y con hasta dos cifras decimales, y una cantidad numérica de cuotas. Se fijan en esta resolución límites operativos de 12 dígitos enteros por importe y 120 cuotas por comprobante; estos límites pueden revisarse si la validación con pymes muestra una necesidad distinta. Los valores negativos y los que exceden la precisión se rechazan, sin redondeo ni truncamiento de entradas del usuario; la interfaz impide ingresar negativos y el API valida por separado. Para «En cuotas» se exige una cantidad entera de 2 a 120, sin superar los céntimos del total; «Pago único» crea una cuota sin pedir la cantidad. Se actualizaron M2, RN-015, RN-016, RN-024, RN-057, RN-122, RN-132 y el glosario; RN-153 y RN-154 concentran las nuevas validaciones. El hallazgo original se conserva arriba y el puntaje histórico no se recalcula.

## Cierre posterior de QA2-35

**2026-11-06, verificación documental:** las entradas 29c («Listado de movimientos») y 30 («Aviso de vencimiento») de `04-glosario.md` ya aparecen en filas independientes, ambas con cuatro columnas. No se requiere otro cambio en el glosario por este hallazgo.

## Cierre posterior de QA2-26

**2026-11-06, decisión del usuario:** se conserva el comportamiento actual: cada consulta calcula con la fecha actual en America/Lima y con los datos registrados al momento de consultarlos. Dos consultas del mismo día, por ejemplo una al comenzar la jornada y otra al terminarla, pueden mostrar resultados distintos si hubo pagos u otros cambios entre ellas. El usuario aprobó que el reporte indique el momento de consulta con una leyenda como «Datos al 06/11/2026, 17:30». Esa hora identifica el corte de los datos consultados y se distingue de la fecha de cálculo usada para clasificar vencimientos. La decisión se incorpora a las reglas mediante la actualización documental descrita a continuación.

**2026-11-06, aplicación autorizada de los ajustes documentales:** RN-023 distingue la fecha de cálculo del momento de corte con fecha, hora y zona horaria y exige una lectura coherente por respuesta. RN-069 y RN-076 aplican ese corte al panel y al reporte y muestran «Datos al DD/MM/AAAA, HH:mm» en America/Lima. RN-077 y RN-144 establecen una nueva consulta por exportación y la identificación de su propio corte; un archivo puede diferir de una pantalla anterior si hubo cambios. M4 y S4 del alcance y las entradas 37, 46, 56 y 57 del glosario quedan alineadas. Se incorporan ejemplos de un pago entre pantalla y exportación, un pago durante la generación y una consulta que cruza medianoche. El cierre acredita coherencia documental; no acredita implementación ni pruebas de software. El hallazgo original se conserva como registro histórico.

## Cierre posterior de QA2-06

**2026-11-07, decisión del usuario:** el doble clic se bloquea en el frontend deshabilitando el botón mientras la solicitud está en curso, pero la garantía contra efectos duplicados la da el backend, porque una solicitud repetida puede llegar desde otra pestaña, por un reintento del navegador o por una llamada directa.

- **Pagos:** RN-156 identifica cada operación con una clave de operación. Un reintento con la misma clave devuelve el pago original sin un segundo descuento; dos pagos reales con claves distintas se guardan aunque coincidan en cuota, fecha e importe.
- **Botones:** RN-157 exige deshabilitar los botones de registro de cobro o pago, «Enviar aviso», «Reenviar aviso» y «Verificar envío», sin que esa protección sea la única.
- **Avisos:** RN-158 guarda el intento «sin confirmar» antes de llamar a Resend, con una clave de idempotencia propia, y rechaza otro envío de las mismas cuotas mientras siga sin confirmar, incluso de otro usuario. Si Resend acepta y falla el registro local, el intento no se pierde. RN-159 define «Verificar envío»: lo dispara el usuario y repite la misma solicitud con la misma clave, sin enviar un segundo correo. Pasadas 24 horas o si cambian los datos del correo, el intento queda «No verificable» y se permite un aviso nuevo con advertencia. RN-067, RN-112 y RN-137 se alinearon.
- La ventana de 24 horas y el rechazo de una clave reutilizada con otro contenido se verificaron en la documentación de Resend sobre claves de idempotencia (2026-11-07).
- Alcance M3, M5 y D2 y glosario (entradas 32, 61 y 62) alineados. Sin cambios en la constitución ni en el brief.

## Cierre posterior de QA2-07

**2026-11-07, decisión del usuario:** RN-160 establece que cada operación guarda todos sus efectos o ninguno, que las condiciones se evalúan al guardar y que, entre dos operaciones simultáneas incompatibles, se guarda solo la primera y la otra se rechaza sin efectos parciales. Además, una edición, un pago o una reprogramación preparados sobre un comprobante o una cuota que cambiaron desde que el usuario los consultó se rechazan con `DATOS_DESACTUALIZADOS`, aunque también fueran válidos con los datos nuevos.

- Se agregaron ejemplos de concurrencia a RN-003 (altas simultáneas del mismo número), RN-062 y RN-091 (anulación del comprobante frente a un pago o una reprogramación), RN-073 (dos reprogramaciones), RN-082 (edición frente a un pago o una reprogramación) y RN-100 (dos administradores que se desactivan entre sí).
- Glosario alineado (entrada 63). Sin cambios en la constitución, el brief ni el alcance.
- Fuera de este cierre: la edición o segunda anulación de un comprobante anulado sigue en QA2-18.

## Cierre posterior de QA2-03 y QA2-04

**2026-11-07, verificación documental:** ambos hallazgos fueron revisados y corregidos mediante decisiones del usuario del 2026-11-07, ya registradas en `03-reglas-de-negocio.md` (QA2-03: RN-041, RN-066, RN-113, RN-138, RN-155; QA2-04: RN-113, RN-136, RN-138) y en el glosario (#30c). Se marcan como resueltos. El cierre acredita coherencia documental; no acredita implementación ni pruebas de software. Los hallazgos originales se conservan arriba como registro histórico y el puntaje no se recalcula.

QA2-05 ya figuraba como resuelto (véase «Resolución posterior de QA2-05»).

## Cierre posterior de QA2-08

**2026-11-07, verificación documental:** las decisiones ya registradas en RN-088 y RN-089 sustituyen el supuesto del hallazgo original de que pueden cargarse pagos en cualquier orden. Se admiten fechas pasadas dentro de los límites de RN-089, pero nunca anteriores a la mayor fecha de los pagos no anulados de la misma cuota. Para incorporar un pago omitido anterior se anulan los posteriores y se registran nuevamente en orden, con sus fechas reales e historial conservado. La cancelación real solo existe con saldo vigente cero y es la mayor fecha de pago no anulado; para un comprobante no anulado totalmente saldado es la mayor cancelación real de sus cuotas. No depende del orden de registro entre cuotas ni modifica el vencimiento.

RN-053, RN-074 y RN-076 aplican esa fecha a DSO, promesas y canceladas del periodo. Una anulación recalcula el saldo y elimina la cancelación vigente si reaparece deuda; las consultas posteriores pueden modificar los resultados de periodos anteriores según RN-023. El alcance M3, el brief y el glosario #35 y #58 a #60 recogen estas distinciones.

Casos de referencia para aceptación (no ejecutados como pruebas de software):

1. Cuota de 100, emitida el 01/10/2026: registrado 60 con fecha 20/10, se rechaza cargar 40 con fecha 10/10 mientras el primero siga vigente. Tras anular el de 60, registrar 40 del día 10 y el reemplazo de 60 del día 20 deja cancelación real el 20/10. El DSO, si es el único comprobante elegible de octubre, es 19,00 días.
2. La misma cuota cargada inicialmente en orden (40 del día 10, 60 del día 20) produce la misma cancelación y DSO. Dos pagos del mismo día están permitidos si cumplen las demás validaciones.
3. Anular el pago vigente de 60 reabre saldo de 60: desaparece la cancelación, sale de canceladas y del DSO del periodo. Un reemplazo real del 05/11 deja cancelación el 05/11 y DSO de noviembre de 35,00 días si es el único elegible.
4. Con promesa al 15/10, cancelar el 20/10 la deja INCUMPLIDA. Con promesa al 20/10 queda CUMPLIDA; si se reabre saldo, vuelve a ACTIVA o INCUMPLIDA según la fecha de cálculo. Las promesas REEMPLAZADAS no se reactivan.
5. Un comprobante con cuotas canceladas el 20/10 y el 05/11 se cobra totalmente el 05/11, aunque los pagos de la primera se registren después de los de la segunda.

## Cierre posterior de QA2-09

**2026-11-07, verificación documental:** la decisión ya registrada en E-009 y O19 excluye la conciliación bancaria y el registro o importación de extractos y movimientos de toda esta versión. Por tanto, no corresponde completar aquí campos, cardinalidad, coincidencias, pendientes ni correcciones de conciliaciones. Si se reincorpora la funcionalidad como requerimiento adicional, deberá definirse ese contrato antes de implementarla; O5 sigue excluyendo números de cuenta y CCI.

Se verifican el retiro de S2 funcional, K6, RN-037, RN-038, RN-125 y glosario #25, y la alineación del brief, M3 y PRINCIPIO-006. Se retiran del diseño de seguridad las referencias residuales a permisos y pruebas sobre conciliaciones. El supuesto S2 de la sección 4 del alcance es independiente y sigue vigente.

Criterios de aceptación documental: no hay un flujo vigente de importación de extractos, vinculación bancaria ni listado de pendientes de conciliación; cada pago se registra directamente sobre una sola cuota, sin superar su saldo (RN-092), con prevención de duplicados por operación (RN-156). Los identificadores retirados se conservan para trazabilidad.

Ambos cierres acreditan coherencia documental, no implementación ni ejecución de pruebas de aplicación. Se conservan los hallazgos originales y el puntaje histórico.

## Cierre documental de QA2-10 — 2026-11-07

El usuario aprobó la opción 1: mantenimiento con ACTIVO y DESACTIVADO. Cualquier usuario de la empresa comparte y mantiene sus contactos. Un contacto sin comprobantes puede eliminarse, activo o desactivado, previa confirmación y validación del servidor al guardar; se elimina el registro y se libera su correo y sus referencias de búsqueda vigentes. Un contacto con comprobantes, incluidos los anulados, no puede eliminarse; admite edición, desactivación y reactivación. La desactivación conserva datos, historial y reserva del correo e impide selección para nuevos comprobantes, pero no avisar cuotas aptas.

Se retira la seudonimización como estado, acción y sustitución automática del mantenimiento. Se actualizan RN-127, RN-129, RN-130, RN-151, RN-112 y RN-155, alcance M1 y §5.2, glosario #5, #30a, #30c y #53 y el registro de preguntas. La versión anterior de RN-151 queda sustituida y el concepto #53 retirado sin reutilizar su ID. Los hallazgos originales y decisiones históricas se conservan; las referencias históricas a seudonimización en QA2-03 y QA2-04 deben interpretarse conforme a esta decisión posterior.

QA2-10 queda cerrado documentalmente por simplificación del mantenimiento, no por implementación. Las solicitudes de eliminación de datos personales siguen separadas en RN-151 y su procedimiento queda pendiente en la pregunta 31. En el momento de este cierre de QA2-10, QA2-11 seguía abierto; su resolución posterior consta al final de este documento; QA2-16 sigue abierto para alcance sobre textos libres, copias e historial del procedimiento pendiente. No se presupone resuelta una solicitud de eliminación por desactivar un contacto.

Casos de aceptación para la futura implementación (no ejecutados):

| Caso | Resultado requerido |
|---|---|
| Eliminar un contacto activo o desactivado sin comprobantes | Pide confirmación; cancelar no cambia nada; confirmar elimina el registro y libera el correo para un nuevo contacto con otro ID |
| Eliminar un contacto con un comprobante vigente o anulado | Rechazo sin borrar contacto, documentos ni historial |
| Desactivar y reactivar un contacto con comprobantes | Conserva sus datos e historial y la reserva del correo; solo ACTIVO se selecciona en nuevos comprobantes |
| Avisar una cuota de contacto desactivado | Permitido si sigue apta según RN-155; la desactivación no la excluye |
| Registrar otro contacto con el correo de uno desactivado | Rechazo por duplicidad dentro de la misma empresa |
| Registrar un comprobante mientras otro usuario elimina su contacto | Validación atómica: solo una operación se completa; no queda un comprobante sin contacto |
| Eliminar durante rotación de referencias protegidas | Se liberan todas las referencias de búsqueda vigentes del contacto eliminado |
| Usuario de otra empresa intenta consultar o eliminar el contacto | Rechazo por aislamiento de empresa |

## Cierre documental de QA2-11 — 2026-11-07

El usuario aprobó un control manual de restauración: el equipo de VenceYa conserva un registro de bajas y sus constancias fuera de la base de datos y de su proceso de restauración. Antes de abrir una copia restaurada, la persona autorizada consulta el registro vigente, reaplica las bajas posteriores al respaldo y comprueba que ninguna empresa dada de baja permanezca en la copia. Verifica eliminación de datos, bloqueo de acceso y ausencia de avisos pendientes de esas empresas, y deja constancia de la revisión. Si no puede verificar el registro o completar la limpieza, no habilita el servicio. Las bajas ejecutadas durante la recuperación también se cubren antes de abrir.

Se actualizan RN-150, RN-152, la referencia de RN-151, alcance §5.2 y el diseño de seguridad (§Custodia y rotación, §Permisos de eliminación y baja contractual, procedimiento manual y criterios de aceptación). No se agrega una funcionalidad de aplicación. El registro y sus constancias permanecen recuperables mientras haya respaldos administrados que puedan recuperar los datos eliminados; los respaldos caducan con su retención habitual y cualquier copia restaurada pasa por el control.

QA2-11 queda cerrado documentalmente por el procedimiento operativo acordado, no por ejecución de una recuperación real. La parte original relativa a seudonimización quedó retirada por la decisión QA2-10. El procedimiento de solicitudes de eliminación de datos personales de RN-151 continúa pendiente en la pregunta 31 y QA2-16; el formato y entrega de la exportación contractual siguen en QA2-12. Los hallazgos originales se conservan como registro histórico.

Casos de aceptación del procedimiento (pendientes de ejecución operativa):

| Caso | Resultado requerido |
|---|---|
| Respaldo del lunes, baja del martes, restauración del miércoles | Se reaplica la baja antes de habilitar usuarios o avisos; datos de otras empresas intactos y revisión registrada |
| No hay bajas posteriores al respaldo | Se verifica que no haya empresas dadas de baja presentes y se deja constancia antes de abrir |
| Registro externo inaccesible o no verificable | La copia permanece aislada |
| Eliminación o verificación incompleta | No se habilita el servicio hasta corregirla |
| Empresa ya ausente o procedimiento repetido | No se recrea la empresa ni se afectan otras; la comprobación se registra |
| Baja ejecutada durante la restauración | La revisión final la incluye antes de abrir |
| Cola o caché recuperada contiene datos o avisos de empresa dada de baja | Se sanea o descarta antes de habilitarla |

## Cierre documental de QA2-13 y QA2-14 — 2026-11-07

**Decisiones del usuario:**

- **QA2-13:** el equipo de VenceYa puede reenviar la invitación del primer administrador, venza o no el enlace, mientras siga INVITADO y la empresa no tenga administradores activos. Usa el procedimiento interno de RN-095, el enlace anterior queda revocado y el reenvío se audita (quién, a qué usuario, fecha y hora ISO 8601). Con un administrador activo, reenvía ese administrador. Un administrador puede reenviar también cuando el correo no llegó, no solo cuando venció.
- **QA2-14, enlaces:** cada usuario INVITADO tiene un único enlace vigente, de un solo uso. Reenviar o desactivar lo revoca. Al canjearlo se comprueba que el usuario siga INVITADO (o ACTIVO en la recuperación de RN-102) y que el enlace sea el vigente; si no, se rechaza sin efectos parciales (RN-160).
- **QA2-14, transiciones:** reactivar a un usuario que nunca definió contraseña lo devuelve a INVITADO con un enlace nuevo de 72 horas; si ya la tenía, vuelve a ACTIVO. Nunca queda ACTIVO sin contraseña.
- **QA2-14, contraseña:** de 8 a 128 caracteres, cualquier carácter, sin reglas de composición. Se rechazan las vacías, las de solo espacios y las fuera de rango, sin truncar ni normalizar. La validación es del servidor y un rechazo no consume el enlace.

**Aplicado en:** RN-095, RN-098 (con ejemplos de concurrencia), RN-099, RN-102 y RN-143; glosario #50 y #51. Sin cambios en la constitución, el brief ni el alcance.

**Fuera de este cierre:** la política de bloqueo y sesiones sigue en QA2-23; el cambio de rol y sesiones se resolvió posteriormente mediante QA2-15 y RN-161 (pregunta 40). La longitud mínima de 8 caracteres se eligió pese a que se recomendaba 10; puede revisarse si el equipo de seguridad lo pide (pregunta 31).

Casos de aceptación (no ejecutados):

| Caso | Resultado requerido |
|---|---|
| Primer administrador INVITADO, enlace vencido, sin administradores activos | El equipo reenvía por el procedimiento interno; enlace anterior revocado; auditoría registrada |
| Invitación que nunca llegó | El reenvío es posible antes de las 72 horas |
| Un ADMINISTRADOR intenta reenviar a un usuario ya ACTIVO | Rechazo |
| Se usa un enlace dos veces o tras un reenvío | Rechazo del segundo uso o del enlace revocado |
| Usuario canjea el enlace mientras lo desactivan | Se guarda solo la primera operación; si gana la desactivación, el canje se rechaza |
| Desactivar y reactivar a un INVITADO sin contraseña | Vuelve a INVITADO con enlace nuevo; el viejo no funciona |
| Desactivar y reactivar a un usuario con contraseña | Vuelve a ACTIVO con la suya |
| Contraseña de 7, 129, vacía, 8 espacios o 200 caracteres | Rechazo con motivo, sin recortar; el enlace sigue vigente |
| Contraseña de 8 y de 128 caracteres, con espacios | Aceptadas |
| Usuario desactivado canjea un enlace de recuperación | Rechazo |

## Cierre documental de QA2-15 — 2026-11-07

El usuario aprobó sustituir la autorización genérica «todas las acciones» por la matriz de RN-060, sujeta a la empresa, la propiedad de las preferencias y las validaciones de negocio. Ningún rol de negocio concede acceso a claves. Las funcionalidades Should conservan su prioridad de entrega.

Se resuelve la pregunta 40 mediante RN-161: cualquier cambio efectivo de rol, tanto al ganar como al perder permisos, cierra todas las sesiones del afectado y exige iniciar sesión nuevamente. Cambio, invalidación y auditoría son una sola operación. El servidor rechaza las sesiones anteriores desde la confirmación; ante concurrencia, si la operación se completa primero conserva sus efectos válidos, y si el cambio se completa primero la operación anterior se rechaza sin efectos de negocio. Guardar el mismo rol no activa este cierre. Se mantiene la protección del último administrador activo.

Se alinean RN-010, RN-060, RN-100, RN-149 y la nueva RN-161, alcance M6, glosario #4 y #64, diseño de seguridad y registros de preguntas y respuestas. Los hallazgos y las respuestas originales se conservan como historia, sujetos a esta decisión posterior. QA2-15 queda resuelto documentalmente; no se acredita implementación ni ejecución de pruebas. QA2-23 conserva sus pendientes sobre actividad y bloqueo.

Casos de aceptación para la futura implementación (no ejecutados):

| Caso | Resultado requerido |
|---|---|
| SUPERVISOR pasa a OPERADOR con sesiones en dos dispositivos y varias pestañas | Todas las sesiones anteriores quedan invalidadas; solicitudes directas al servidor se rechazan aunque su credencial no haya vencido |
| Sesión anterior intenta anular desde una pantalla abierta | Rechazo sin anulación ni efectos de negocio; se exige nuevo inicio de sesión |
| Nuevo inicio de sesión como OPERADOR | Puede registrar pagos; no puede anular ni exportar |
| OPERADOR pasa a SUPERVISOR | También se cierran sus sesiones; tras iniciar sesión puede anular un pago elegible |
| Anulación concurrente con cambio de rol | Si se completa primero la anulación, se conserva; si se completa primero el cambio, se rechaza la anulación de la sesión anterior sin efectos parciales |
| Falla la invalidación o el registro de auditoría | No se guarda el cambio de rol ni efectos parciales |
| Administrador cambia su propio rol y queda otro administrador activo | Cambio permitido, auditado y cierre de todas sus sesiones |
| Cambio deja a la empresa sin administrador activo, incluidos dos cambios simultáneos | Rechazo conforme a RN-100 y RN-160 |
| Se guarda el mismo rol | No se trata como cambio efectivo ni cierra sesiones por RN-161 |
| Usuario sin rol ADMINISTRADOR intenta cambiar roles o configuración de empresa | Rechazo del servidor sin cambios |
| ADMINISTRADOR intenta cambiar moneda o ventana ajenas, acceder a claves por su rol o consultar otra empresa | Rechazo; los permisos de negocio no conceden esas facultades |
| ADMINISTRADOR intenta editar un comprobante con pagos | Rechazo por RN-082 aunque tenga permiso general de edición |
| Cambio válido | Auditoría identifica actor, afectado, empresa, rol anterior y nuevo, fecha y hora ISO 8601; sin credenciales ni secretos de sesión |

## Cierre documental de QA2-16 — 2026-11-07

**Decisión del usuario:** el contenido que se escribe en cada campo de texto libre es responsabilidad de quien lo ingresa. El sistema no localiza, depura ni sustituye datos personales dentro de comentarios, motivos u otros textos libres.

**Efecto sobre el hallazgo:** la parte referida a la seudonimización quedó obsoleta con QA2-10. La parte sobre textos libres se resuelve con esta decisión: no se requiere inventario de ubicaciones ni procedimiento de búsqueda y sustitución, y no se crea ninguna excepción a la inmutabilidad de PRINCIPIO-006 ni a RN-150.

**Aplicado en:** PRINCIPIO-005 y la enmienda E-010 de `00-constitucion.md`; RN-014 y RN-151 de `03-reglas-de-negocio.md`; glosario #38. E-010 sustituye la parte de E-003 que extendía la protección a «datos dentro de textos libres».

**Se mantiene:** ese texto sigue sin escribirse en logs, mensajes de error, prompts de IA ni fixtures (RN-014). Los datos de campos estructurados conservan toda su protección.

**Fuera de este cierre:** el procedimiento de solicitudes de eliminación de datos personales y su alcance sobre historiales, copias y respaldos siguen en la pregunta 31; la validación legal sigue pendiente antes del lanzamiento. El cierre acredita coherencia documental, no implementación ni pruebas. Una advertencia visible en los campos libres no se incorporó como regla; queda como sugerencia de interfaz sujeta a decisión.

## Cierre documental de QA2-17 — 2026-11-08

**Decisiones del usuario:**

- **Formato numérico peruano:** el usuario escribe y ve los importes con punto decimal y coma de miles, por ejemplo «1,000.50». El separador de miles es **obligatorio** desde 1,000 («1000.50» se rechaza).
- **Contrato del API:** cada importe viaja como cadena decimal canónica con punto, sin separador de miles ni signo («1000.50»). No se aceptan números JSON de coma flotante ni importes con coma de miles. La interfaz convierte lo que escribe el usuario y se recomienda que inserte las comas mientras escribe o al salir del campo; el servidor valida siempre.
- **Límites aprobados:** 12 dígitos enteros por importe (máximo 999,999,999,999.99) y 120 cuotas por comprobante. Sustituyen la condición de «propuestos» de la resolución anterior.
- **Migración:** los ejemplos de los documentos vigentes pasan del formato anterior («S/ 1 000,00») al peruano («S/ 1,000.00»). Esta auditoría, la primera iteración, las respuestas y la propuesta 07 conservan el formato anterior como registro histórico; sus importes se interpretan conforme a RN-153.

**Aplicado en:** RN-153 (formato, API canónico, límites), RN-154 (vigencia en la edición: un comprobante conserva de 1 a 120 cuotas), RN-122 (total menor de 2 céntimos: solo «Pago único»), RN-081 (remisión a RN-153 y RN-154), ejemplos de `03-reglas-de-negocio.md`, `00-constitucion.md` y `01-project-brief.md`, alcance M2 y glosario #65. Sin cambios en decisiones de negocio distintas de las anteriores.

El cierre acredita coherencia documental, no implementación ni pruebas. El hallazgo original y el puntaje histórico se conservan.

Casos de aceptación para la futura implementación (no ejecutados):

| Caso | Resultado requerido |
|---|---|
| Pago de 0.001 | Rechazo; no se redondea ni trunca |
| Pago de 0.01 | Aceptado si no supera el saldo |
| `100`, `100.5`, `100.50` | Mismo importe válido (10,000 o 10,050 céntimos) |
| `1,000.50` escrito por el usuario | Aceptado; el API recibe «1000.50» |
| `1000.50` o `1000` escrito por el usuario | Rechazo por falta del separador de miles |
| `1,00`, `10,00.5`, `1,0000`, `12,34,567` | Rechazo: la coma no agrupa de a tres cifras |
| `1.000,50`, `1 000.50`, `.5`, `100.`, `+5`, `-0.00`, vacío | Rechazo |
| `999,999,999,999.99` | Aceptado (máximo) |
| `1,000,000,000,000.00` (13 dígitos enteros) | Rechazo |
| `1e3`, «cien», `-1.00` | Rechazo |
| Llamada directa al API con número JSON `1000.5` o con «1,000.50» | Rechazo; solo se acepta la cadena canónica |
| Cuotas 0, 1, -2, 2.5, `3.0`, «tres», 121 con «En cuotas» | Rechazo |
| Cuotas 2 y 120 con «En cuotas» y total suficiente | Aceptadas |
| Total de S/ 0.01 con «En cuotas» | Informa que solo procede «Pago único» |
| Edición que deja 0 o 121 cuotas | Rechazo |
| Edición que deja 1 o 2 cuotas válidas con suma igual al total | Aceptada |
| Total 0.00 o negativo | Rechazo (RN-132) |

## Cierre documental de QA2-18 — 2026-11-08

**Decisión del usuario:** la anulación es el estado terminal del comprobante. Un comprobante anulado queda de solo lectura: no se edita, no se anula otra vez, no admite pagos ni reprogramaciones y la anulación no se revierte. Un comprobante tiene como máximo una anulación. La corrección sigue siendo registrar uno nuevo con el mismo número (RN-003).

**Aplicado en:** RN-091 (estado terminal, edición y segunda anulación prohibidas, ejemplo de concurrencia edición/anulación); RN-081 (solo comprobantes no anulados); RN-082 (el estado anulado bloquea la edición); RN-061 (máximo una anulación, rechazo sin segundo registro, ejemplo de concurrencia entre dos SUPERVISORES); RN-062 (solo comprobantes no anulados); glosario #8 y #48. Sin cambios en la constitución, el brief ni el alcance.

**Fuera de este cierre:** el cierre acredita coherencia documental, no implementación ni pruebas. El hallazgo original se conserva como registro histórico y el puntaje no se recalcula.

Casos de aceptación (no ejecutados):

| Caso | Resultado requerido |
|---|---|
| Editar el total o el número de un comprobante anulado sin pagos ni reprogramaciones | Rechazo; sin registro de edición (RN-083) |
| SUPERVISOR anula un comprobante ya anulado | Rechazo; no se crea un segundo registro de anulación |
| Dos SUPERVISORES anulan el mismo comprobante a la vez | Se guarda una anulación; la otra se rechaza sin efectos parciales (RN-160) |
| Edición concurrente con anulación | Gana la primera; si es la anulación, la edición se rechaza por `DATOS_DESACTUALIZADOS` |
| OPERADOR intenta anular un comprobante, anulado o no | Rechazo por rol (RN-061) |
| Registrar de nuevo el número de un comprobante anulado | Permitido como comprobante nuevo (RN-003, RN-091) |

## Cierre documental de QA2-19 — 2026-11-08

**Decisión del usuario:** toda reprogramación, sea la primera o una posterior, requiere que la cuota tenga saldo vigente mayor que cero, calculado con los pagos no anulados (RN-025), y que su comprobante no esté anulado (RN-091). Al guardar se verifican estas condiciones y las restricciones de fecha de RN-080 y RN-118 con el estado vigente, conforme a RN-160. Si no se cumplen, la operación se rechaza sin crear una promesa ni modificar el historial o la marca de reprogramación.

Una cuota reabierta por anulación de un pago puede reprogramarse si recuperó saldo positivo y cumple las demás condiciones. La cancelación posterior de una cuota válidamente reprogramada conserva su historial y su marca (RN-072); el estado de sus promesas sigue calculándose según RN-074 y RN-085.

**Aplicado en:** RN-033 (elegibilidad común, rechazo sin efectos, cuota reabierta y pago total concurrente); RN-073 (remisión a la elegibilidad común); alcance S1 y glosario #23. RN-074 se conserva: su condición de saldo positivo para una promesa ACTIVA ya es coherente con la nueva condición de registro.

QA2-19 queda resuelto documentalmente. El cierre acredita coherencia documental, no implementación ni ejecución de pruebas. El hallazgo original y el puntaje histórico se conservan.

Casos de aceptación para la futura implementación (no ejecutados):

| Caso | Resultado requerido |
|---|---|
| Primera reprogramación con saldo positivo, comprobante no anulado y fechas válidas | Se registra una promesa ACTIVA y se marca la cuota como reprogramada |
| Reprogramación posterior con saldo positivo, comprobante no anulado y fechas válidas | Se registra la nueva promesa ACTIVA; la anterior queda REEMPLAZADA y se conserva en el historial (RN-073) |
| Primera reprogramación sobre una cuota con saldo cero | Rechazo; no se crea promesa ni se modifica el historial o la marca |
| Reprogramación posterior sobre una cuota con saldo cero | Rechazo; no se reemplaza la promesa anterior ni se modifica el historial o la marca |
| Cuota reabierta por anulación de un pago, con saldo positivo y demás condiciones válidas | Se permite la primera reprogramación o una posterior; si existe promesa anterior, se aplica RN-073 |
| Cuota con saldo positivo de un comprobante anulado | Rechazo conforme a RN-091, sin efectos de reprogramación |
| Reprogramación, primera o posterior, con fecha que incumple RN-080 o RN-118 | Rechazo sin crear promesa ni modificar el historial o la marca |
| Pago total guardado después de consultar la cuota y antes de guardar la reprogramación | Rechazo con `DATOS_DESACTUALIZADOS` (RN-160), sin efectos de reprogramación |
| Cuota reprogramada válidamente que después queda cancelada | Conserva historial y marca; su promesa no reemplazada se clasifica según RN-074 |

## Cierre documental de QA2-20 — 2026-11-08

**Decisión del usuario:** aplicar la propuesta de contrato propio del reporte de vencimientos y cerrar el hallazgo. Los grupos por vencer, vencidas y reprogramadas con promesa activa totalizan saldos vigentes. Canceladas del periodo totaliza el importe completo de las cuotas seleccionadas por su cancelación real vigente, no los cobros o pagos del periodo ni sus saldos cero. Se muestran cantidades e importes separados por grupo y moneda, sin total general que mezcle deuda con importes cancelados.

**Aplicado en:** RN-076 (validación y límites inclusivos del periodo, totales, ambas monedas, columnas y resultados vacíos); RN-077 (mismo contrato en CSV y Excel, metadatos y resúmenes); alcance S4 y glosario #46. Se mantienen la reapertura y la cancelación económica de RN-084 y RN-088, la exclusión de comprobantes anulados de RN-090 y el corte coherente de RN-023. RN-144 a RN-146 siguen regulando otro archivo: el listado de movimientos por fecha de emisión. El historial de cada cuota permanece como detalle de RN-078.

**Estado:** resuelto documentalmente. Se conserva la fila original como registro histórico. Este cierre verifica la especificación; no acredita implementación ni ejecución de pruebas de software. El formato técnico de CSV y Excel señalado en QA2-25 conserva su tratamiento independiente.

Casos de aceptación para la futura implementación (no ejecutados). Salvo indicación contraria, se consulta por cobrar, con corte posterior al periodo y sin cambios entre las lecturas comparadas:

| Caso | Resultado requerido |
|---|---|
| Periodo 01/10/2026 a 31/10/2026; cancelaciones el 01/10 y el 31/10 | Ambas se incluyen; cancelaciones del 30/09 y 01/11 se excluyen |
| Inicio y fin 20/10/2026 | Periodo válido de un día; incluye canceladas con cancelación real ese día, sin filtrar los grupos 1 a 3 |
| Falta inicio, falta fin o faltan ambos | Rechazo con motivo en pantalla y exportación; no se genera resultado ni archivo para ese periodo |
| Fecha inexistente 31/02/2026 o texto que no representa una fecha | Rechazo con motivo, sin resultado ni archivo |
| Inicio 31/10/2026 y fin 01/10/2026 | Rechazo por periodo invertido, sin resultado ni archivo |
| Periodo completamente futuro respecto del corte | Se acepta; canceladas queda en cero y los grupos 1 a 3 muestran la cartera vigente, sin proyectar pagos |
| Ninguna cancelación en el periodo y una vencida de S/ 300.00 | Canceladas: cantidad 0 e importe 0.00; vencidas conserva la cuota y suma S/ 300.00 |
| Ninguna cuota elegible en los cuatro grupos | Pantalla «Sin resultados»; ceros por grupo y moneda; CSV y Excel con encabezados, metadatos y resúmenes, sin filas de cuotas |
| Cuota de S/ 1,000.00 pagada con S/ 400.00 en septiembre y S/ 600.00 en octubre | En octubre cuenta una cancelada por S/ 1,000.00, pagado acumulado S/ 1,000.00 y saldo 0.00; en septiembre no cuenta como cancelada |
| Cuota de S/ 1,000.00 con pago parcial de S/ 400.00 y saldo S/ 600.00 | No entra en canceladas; aporta S/ 600.00 al grupo vigente correspondiente |
| Cuota cancelada con pagos 400 + 600; se anula el pago de 600 | Nueva consulta: sale de canceladas, fecha de cancelación real vacía, saldo S/ 600.00 y grupo según estado y promesa vigentes |
| Tras la reapertura se paga nuevamente S/ 600.00 en noviembre | Cancelación real en noviembre; no participa en canceladas de octubre y aporta S/ 1,000.00 en noviembre |
| Comprobante con dos cuotas de S/ 500.00; solo una cancelada en octubre | Cantidad 1 e importe S/ 500.00 en canceladas; no se suma el total del comprobante |
| Una cancelada de S/ 100.00 y otra de US$ 50.00, con panel en S/ | Pantalla y archivo incluyen ambas; cantidad 1 por moneda y totales separados S/ 100.00 y US$ 50.00 |
| Cuota sin promesa o sin cancelación real vigente | Campos correspondientes vacíos; no se inventan fechas ni estados de promesa |
| Cuota reprogramada con promesa incumplida | Grupo vencidas, marca de reprogramación, fecha y estado INCUMPLIDA visibles; una sola fila |
| Comprobante anulado | Sus cuotas se excluyen de todos los grupos y resúmenes |
| Pantalla, CSV y Excel con mismos datos, filtros, periodo y corte | Mismas cuotas, grupos, columnas en el orden de RN-076, fechas, cantidades y totales; archivo con periodo, sentido, fecha de cálculo y corte propios |
| Consulta por pagar | Mismo contrato de fechas, columnas, agrupación y totales, únicamente para cuotas por pagar |

## Cierre documental de QA2-21 — 2026-11-08

**Decisión del usuario:** aclarar el historial de la cuota sin agregar pantallas ni vistas nuevas. El historial se ordena por la fecha del hecho (RN-088), no por la fecha de registro, y cada evento registrado muestra además su fecha y hora de registro como dato informativo. El paso a VENCIDA, a CANCELADA y la reapertura son transiciones derivadas: no se guardan, se recalculan en cada consulta con los pagos no anulados y las reprogramaciones vigentes (RN-084, RN-088, RN-023). Un pago retroactivo, o una anulación con reemplazo, puede quitar o mover una transición mostrada antes; el sistema no conserva ni reconstruye lo que mostró una consulta anterior. Los pagos, anulaciones, ediciones y reprogramaciones registrados nunca desaparecen, de modo que toda corrección es trazable.

**Empates:** con la misma fecha del hecho, el orden es emisión, edición, reprogramación, pago (por fecha y hora de registro, luego identificador), anulación de pago, VENCIDA, CANCELADA y reapertura. VENCIDA solo aparece si, tras los pagos de ese día, la cuota conserva saldo positivo; un pago que la deja en cero el día siguiente al vencimiento efectivo la cancela sin mostrar VENCIDA.

**Aplicado en:** RN-078 (contrato de fechas y transiciones, con ejemplos de pago retroactivo, corrección y empate), referencia cruzada en RN-088 y glosario #47. Sin cambios en RN-023, RN-084, en las columnas del reporte de RN-076 ni en el alcance. La pantalla o el acceso desde donde se consulta el historial no se definen en este cierre; RN-076 solo establece que se consulta como detalle de la cuota. La visibilidad por rol sigue la matriz vigente («historiales de negocio»).

**Estado:** resuelto documentalmente. Se conserva la fila original como registro histórico. Este cierre verifica la especificación; no acredita implementación ni ejecución de pruebas de software.

Casos de aceptación para la futura implementación (no ejecutados):

| Caso | Resultado requerido |
|---|---|
| Cuota de S/ 1,000.00 que vence el 15/10; pago de 400 del 10/10; consulta del 20/10 | Historial: emitida, pago de 400 (10/10), VENCIDA (16/10) |
| Se registra el 25/10 un pago de 600 con fecha 14/10; consulta del 26/10 | Historial: emitida, pago de 400, pago de 600 (14/10, registrado el 25/10), CANCELADA (14/10); sin VENCIDA |
| El pago de 600 se muestra con su fecha de registro | Se ordena por el 14/10; el 25/10 aparece solo como fecha de registro |
| Se anula un pago y se registran el omitido y el reemplazo | El pago original y su anulación permanecen, marcados; el historial refleja la cancelación recalculada |
| Pago de S/ 100.00 el 16/10 a una cuota de S/ 100.00 que vencía el 15/10 | Pago y CANCELADA el 16/10, sin VENCIDA |
| Pago de S/ 40.00 el 16/10 a esa misma cuota | Pago y luego VENCIDA el 16/10 |
| Dos pagos del mismo día | Orden por fecha y hora de registro y luego identificador, de forma repetible |
| Se anula el último pago y reaparece saldo | Reapertura y, si corresponde, VENCIDA recalculadas; el pago anulado se conserva |
| Dos consultas con el mismo corte y los mismos datos | Mismo historial y mismo orden |

## Cierre documental de QA2-23 — 2026-11-08

**Decisiones del usuario:** (1) los intentos hechos durante el bloqueo no lo prolongan; (2) las peticiones automáticas no cuentan como actividad. Se conservan los plazos aprobados: 5 fallos, 15 minutos, 30 minutos de inactividad y 12 horas.

**Aplicado en:** RN-103 (fallos por cuenta; bloqueo fijo de 15 minutos desde el quinto fallo; intentos durante el bloqueo rechazados, sin contarse ni extenderlo; contador en cero al desbloquearse), RN-149 (reloj del servidor; actividad solo si es acción del usuario con sesión vigente; una sesión por inicio de sesión, compartida por sus pestañas; 12 horas sin renovación) y glosario #66 a #68. Aporta a QA2-29 las definiciones de «sesión» y «actividad». No se acredita implementación ni ejecución de pruebas.

Casos de aceptación para la futura implementación (con reloj controlado, no ejecutados):

| Caso | Resultado requerido |
|---|---|
| Quinto fallo en t=0; intento en t=14:59 con la contraseña correcta | Rechazo; no cuenta como fallo ni extiende el bloqueo |
| Intento en t=15:00 con la contraseña correcta | Inicio de sesión permitido |
| Intento en t=15:00 con contraseña incorrecta | Primer fallo de una nueva serie; sin bloqueo |
| Cuatro fallos y un acierto | Contador en cero |
| Veinte intentos durante el bloqueo | El bloqueo termina igualmente a los 15:00 |
| Respuesta a fallo, cuenta bloqueada y correo inexistente | Indistinguibles entre sí |
| Recuperación de contraseña durante el bloqueo | Cuenta desbloqueada y contador en cero |
| Sondeo automático a los 29 minutos, sin acción del usuario | La sesión se cierra a los 30:00 desde la última acción |
| Acción del usuario a los 29:59 | Plazo de inactividad renovado |
| Pestaña A inactiva, pestaña B con actividad | La sesión sigue abierta |
| Mismo usuario en otro dispositivo | Sesión independiente, con su propio contador |
| Actividad continua hasta las 12:00:00 | Sesión cerrada |
| Petición en vuelo al cumplirse un plazo | Rechazo sin efectos de negocio |
| Petición con la sesión vencida | Rechazo y no renueva nada |

## Cierre documental de QA2-27 — 2026-11-08

**Hallazgo:** la síntesis del MVP decía «con copia al administrador» y el supuesto S4 incluía «al administrador» como destinatario del aviso, mientras RN-042, RN-104 y RN-134 definen el correo administrativo como un dato de la empresa, independiente de cualquier usuario, y las listas de copias como configuración explícita de usuarios ADMINISTRADOR o SUPERVISOR activos.

**Aplicado en:** `02-alcance.md` (síntesis del MVP y S4) y glosario #4 (el rol ADMINISTRADOR no recibe copia por serlo; solo si su dirección es el correo administrativo o si fue agregado a una lista de copias).

**Estado:** resuelto documentalmente. Se conserva la fila original como registro histórico. Este cierre verifica la especificación; no acredita implementación ni ejecución de pruebas de software.

## Cierre documental de QA2-24 — 2026-11-08

**Hallazgo:** no había contrato de longitud, caracteres ni valor vacío para número de documento, nombre, correo y comentario; «obligatorio» no aclaraba las cadenas de espacios y la normalización del correo (RN-139) no validaba su sintaxis.

**Decisiones del usuario:**

- **Número de documento:** TRIM, mayúsculas, 1 a 30 caracteres; solo letras, dígitos, «-» y «_».
- **Nombre del contacto:** TRIM, mayúsculas, 1 a 250 caracteres; solo letras y espacios.
- **Correo del contacto:** TRIM, formato de correo válido, hasta 250 caracteres.
- **Comentario del aviso:** TRIM, mayúsculas, 0 a 500 caracteres; si queda vacío se trata como sin comentario.

**Criterios del redactor, a confirmar si se desea otro:** el servidor también convierte a mayúsculas (la interfaz es solo comodidad), así una llamada directa al API guarda el mismo valor y la unicidad de RN-093 no depende del cliente; los espacios repetidos del nombre se reducen a uno; «letra» incluye tildes, ñ y ü; los valores inválidos se rechazan con motivo, sin truncar; el correo se guarda en minúsculas según RN-139; el comentario no tiene otra restricción de caracteres (QA2-16).

**Aplicado en:** regla nueva RN-162 (sección Registro, tras RN-131); referencias en RN-093, RN-126, RN-131, RN-044, RN-115, RN-129, RN-139, la regla de edición de comprobantes y glosario #5.

**Consecuencia:** «solo letras y espacios» rechaza nombres con punto, dígitos, guion o apóstrofo (por ejemplo «Cía. Perú S.A.C.» o «Pérez-Gómez»); el usuario deberá escribir «CIA PERU SAC». Es una decisión del usuario.

**Fuera de este cierre:** el correo de los usuarios (alta, invitación, inicio de sesión) sigue regido por RN-139 sin la validación sintáctica de RN-162, que se definió solo para contactos; teléfono y dirección siguen sin contrato. Este cierre verifica la especificación; no acredita implementación ni ejecución de pruebas.

Casos de aceptación para la futura implementación (no ejecutados):

| Caso | Resultado requerido |
|---|---|
| Documento « f001-00045 » | Se guarda «F001-00045» |
| Documento «   », «F001/45», «F001 45», 31 caracteres | Rechazo |
| Documento «A_1-b» o 30 caracteres válidos | Aceptado, en mayúsculas |
| Nombre «  cliente   sac » | Se guarda «CLIENTE SAC» |
| Nombre «ÑANDÚ PERÚ» o 250 letras | Aceptado |
| Nombre «   », «Cía. Perú 2», 251 caracteres | Rechazo |
| Correo « Ana.Lopez+pagos@Empresa.example » | Se guarda en minúsculas |
| Correo «abc», «ana@», «ana@empresa», «ana@@x.pe», «a b@x.pe», 251 caracteres | Rechazo |
| Comentario «   » | Sin comentario; el aviso se envía |
| Comentario de 500 / 501 caracteres | Aceptado / rechazo sin truncar |
| Llamada directa al API con «f001-1» | Se guarda «F001-1» |
| Edición de contacto o comprobante con valores inválidos | Mismo rechazo que en el alta |

## Cierre documental de QA2-25 — 2026-11-08

**Hallazgo:** las exportaciones tenían columnas y criterios de selección, pero no contrato de codificación, delimitador, escape, tipos de celda ni tratamiento de textos interpretables como fórmulas.

**Decisión del usuario:** aplicar la recomendación revisada en la conversación: CSV UTF-8 con BOM, coma, CRLF, campos entre comillas dobles y duplicación de comillas internas; importes con punto y dos decimales sin miles; fechas calendario AAAA-MM-DD en CSV y fechas reales mostradas como DD/MM/AAAA en Excel. En .xlsx, documentos y nombres son texto explícito; importes y cantidades son números. No se generan fórmulas ni macros, ni hipervínculos o referencias externas derivados de textos.

**Salida literal y límites:** el CSV antepone un apóstrofo de transporte a los textos con los prefijos de riesgo definidos en RN-163 antes del escape, sin cambiar el dato almacenado. El apóstrofo puede verse en otros lectores y no garantiza el comportamiento de todas las aplicaciones. CSV no declara tipos: conserva ceros y dígitos en el archivo, pero requiere importación como texto para evitar reinterpretarlos; para abrir directamente conservando tipos se recomienda .xlsx. La ayuda de descarga debe informar estas condiciones. El momento de corte mantiene su leyenda con hora y zona; no se sustituye por una fecha calendario.

**Aplicado en:** regla nueva RN-163, referencias en RN-050, RN-051 y RN-077, y glosario #37. RN-145 conserva las columnas del listado y RN-076 las del reporte; el contrato común no agrega campos ni cambia cálculos.

**Relación con QA2-24:** RN-162 ya rechaza comillas, saltos de línea y signos como igual en nombres y documentos. No se flexibilizan esas entradas; los casos especiales se prueban directamente en el componente exportador. Un documento numérico con ceros iniciales o de 30 dígitos sí es válido. Un documento iniciado por guion también es válido y recibe protección en CSV.

Casos de aceptación para la futura implementación (no ejecutados):

| Caso | Resultado requerido |
|---|---|
| Nombre ÑANDÚ PERÚ | Acentos y ñ conservados en ambos formatos; CSV con BOM UTF-8 |
| Documento 000123 y documento de 30 dígitos | CSV conserva los caracteres; Excel los guarda como texto sin perder ceros ni precisión |
| Documento -001 | CSV agrega apóstrofo; Excel conserva -001 como texto; dato almacenado intacto |
| Fecha del 8 de noviembre de 2026 | CSV: 2026-11-08; Excel: fecha real mostrada como 08/11/2026 |
| Fecha ausente | Campo CSV y celda Excel vacíos, sin fecha cero ni texto null |
| Importe 1000.50, cantidad 2 | CSV sin miles; Excel numérico con dos decimales visibles solo para el importe |
| Campo con coma, comillas y salto de línea, probado en el exportador | El analizador CSV recupera el campo completo sin columnas ni registros adicionales; comillas internas duplicadas |
| Texto =1+1, +1, -1 o @SUM(A1), probado en el exportador | CSV agrega apóstrofo antes del escape; Excel conserva texto literal sin evaluación |
| Espacios o controles antes de un signo de riesgo | Protección según RN-163 sin quitar contenido original |
| Texto iniciado por tabulador, CR o LF | Apóstrofo antes del contenido original y escape CSV correcto |
| Registro de nombre o documento con comillas, salto de línea o = | Rechazo conforme a RN-162 |
| Listado y reporte, incluidos metadatos y resúmenes | Mismo contrato de formato y protección sin cambiar cuotas ni cálculos |
| Archivo .xlsx | Sin fórmulas ni macros, ni hipervínculos o referencias externas derivados de textos |
| Ayuda de descarga CSV | Explica UTF-8, coma, importación de columnas como texto, apóstrofo y alternativa .xlsx |

**Referencias técnicas:** [Microsoft: apertura de CSV UTF-8](https://support.microsoft.com/en-gb/excel/opening-csv-utf-8-files-correctly-in-excel) y [OWASP: CSV Injection](https://community.owasp.org/attacks/CSV_Injection).

**Estado:** resuelto documentalmente. La fila original se conserva como registro histórico. Este cierre verifica la especificación; no acredita implementación ni ejecución de pruebas de software.

## Cierre documental de QA2-28 — 2026-11-08

**Hallazgo:** el glosario describía estado de cuota más marca ANULADO; RN-049 exigía mostrar anulados sin estado de cuota, mientras RN-145 y RN-146 usaban ANULADO como valor de estado en la exportación.

**Decisión del usuario:** los comprobantes anulados y sus cuotas se excluyen por defecto del listado de movimientos y de su exportación. Solo se incluyen al solicitar explícitamente «Incluir comprobantes anulados». No se permite anular un comprobante si alguna cuota tiene pagos vigentes, parciales o totales. Si no tiene pagos o todos fueron anulados, puede anularse aunque tenga cuotas PENDIENTES o VENCIDAS. La condición se verifica al guardar, también ante operaciones simultáneas.

**Efecto de la anulación:** todas las cuotas quedan ANULADAS por consecuencia del comprobante, sin estado de pago vigente y de solo lectura. No existe anulación independiente por cuota. PENDIENTE, VENCIDA y CANCELADA siguen siendo los tres estados de pago; CANCELADA significa pagada y ANULADA es una condición heredada, no un cuarto estado de pago. No se borran registros, no se registran pagos ni se pone artificialmente el saldo a cero. Se conservan datos e historial.

**Representación por superficie:** en pantalla, al solicitar su inclusión, se muestra comprobante ANULADO y cuota ANULADA por anulación del comprobante, sin estado de pago vigente. En CSV y Excel, cada fila de cuota incluida tiene «Estado de pago de la cuota» vacío y «Comprobante anulado» igual a «Sí»; las filas no anuladas tienen uno de los tres estados y «No». La opción de inclusión es visible en las opciones de exportación. Se mantienen periodo de emisión, sentido, monedas, corte y formato definidos por sus reglas. Incluir anulados en el listado no los incorpora a cálculos de cartera, gráfico, indicadores ni avisos. El reporte de vencimientos y su exportación siempre los excluyen.

**Aplicado en:** RN-021, RN-022 y RN-084 (estados de pago solo para comprobantes no anulados); RN-049 (consulta); RN-062 (elegibilidad); RN-090 y RN-091 (cuotas anuladas y restricciones); RN-144 a RN-146 (selección y columnas de exportación); alcance M4 y S4; glosario #8, #13, #18, #21, #29c y #37. Los XML son instrucciones de generación, no copias de las reglas o del alcance; no requieren sincronización de estas decisiones.

Casos de aceptación para la futura implementación (no ejecutados):

| Caso | Resultado requerido |
|---|---|
| Comprobante con cuotas PENDIENTES sin pagos | Se permite anularlo; todas sus cuotas quedan ANULADAS |
| Comprobante con cuotas VENCIDAS sin pagos | Se permite anularlo; el vencimiento pasado no lo impide |
| Una cuota tiene pago parcial vigente | Se rechaza la anulación sin efectos parciales |
| Una cuota está CANCELADA por pago total vigente | Se rechaza la anulación |
| Todos los pagos registrados están anulados | Se permite anular el comprobante; se conservan pagos y anulaciones |
| Pago y anulación simultáneos | Si se guarda el pago primero se rechaza la anulación; si se guarda la anulación primero se rechaza el pago, conforme a RN-062 y RN-160 |
| Consulta del listado sin activar inclusión | No aparecen comprobantes anulados ni sus cuotas |
| Consulta con «Incluir comprobantes anulados» | Incluye también sus cuotas respetando moneda y demás filtros; muestra comprobante ANULADO y cuota ANULADA, sin estado de pago vigente |
| CSV y Excel sin activar inclusión | Ambos excluyen comprobantes anulados y sus cuotas |
| CSV y Excel con inclusión explícita, mismo corte y filtros | Mismas filas y columnas; las anuladas tienen estado de pago vacío y comprobante anulado «Sí»; las no anuladas tienen estado de pago y «No» |
| Comprobante anulado fuera del periodo o del sentido elegido | Sigue excluido aunque se active la inclusión |
| Cuota anulada de 500.00 sin pagos | Conserva importe y saldo calculado 500.00 y pagado 0.00; no representa deuda vigente ni suma en cartera |
| Inclusión de anulados en el listado | No cambia totales de cartera, gráfico, indicadores, avisos ni reporte de vencimientos |
| Reporte de vencimientos en pantalla o exportado | Siempre excluye comprobantes anulados y sus cuotas; no ofrece incluirlos |
| Intento de pagar, reprogramar o reactivar una cuota anulada | Rechazo; comprobante y cuotas son de solo lectura |
| Historial de comprobante y cuotas anuladas | Se conserva y puede consultarse con los permisos vigentes |

**Verificación documental:** revisadas las diez reglas afectadas, las seis entradas del glosario, las filas M4 y S4 y la ausencia del criterio anterior de inclusión por defecto y de ANULADO como valor de estado de pago en las reglas vigentes. Se conserva la fila original QA2-28 como registro histórico.

## Cierre documental de QA2-29 — 2026-11-08

**Actualización posterior, QA2-12 y E-011 (2026-11-08):** este cierre se conserva como antecedente. Quedan sustituidas sus condiciones sobre exportación contractual y evidencia de entrega, incluidos los casos 2, 3 y 5 en lo relativo a esa entrega. La empresa exporta los históricos disponibles mediante las funciones existentes antes de la terminación efectiva. Se mantienen la definición de terminación, sus responsables, el bloqueo de accesos, el plazo de 30 días y el control de restauraciones. Véase el cierre de QA2-12 a continuación.

**Decisión del usuario:** se autoriza incorporar la propuesta de definiciones operativas y terminación contractual. Se conserva el hallazgo original como antecedente; su estado actual se registra en la tabla de cierres.

- **Movimiento del extracto:** no aplica a esta versión. QA2-09 excluyó conciliación y extractos mediante O19 y E-009 y retiró RN-037, RN-038 y RN-125. No se crea un contrato de datos excluido. El listado de movimientos del glosario #29c representa cuotas y no movimientos bancarios.
- **Entrega:** QA2-05 distingue aceptación por Resend de entrega al destinatario. Las entradas #69 y #70 separan entrega de correo y entrega de exportación contractual. QA2-12 conserva sus pendientes sobre contenido, formato, destinatario autorizado, mecanismo, evidencia y entrega fallida; QA2-29 no los resuelve ni elimina la prohibición de borrar sin evidencia de entrega.
- **Sesión y actividad:** ya definidas por QA2-23 en RN-103, RN-149 y glosario #66 a #68. Se añade la terminación en la nube como causa de invalidación de sesiones, con referencia a RN-152.
- **Contrato vigente y terminación:** RN-150 y RN-152 y glosario #71 y #72 definen el evento y sus responsables. Personal autorizado de VenceYa lo formaliza con sustento de un representante autorizado de la empresa o una causa prevista en el contrato, evidencia y fecha y hora efectiva en America/Lima. Ser ADMINISTRADOR no acredita representación contractual. No se admite formalización retroactiva. Una solicitud, inactividad o desactivación de usuarios no termina el contrato.
- **Efectos en la nube:** desde el instante efectivo se bloquean accesos, sesiones y operaciones de negocio, incluidos avisos pendientes; comienza el plazo de 30 días para la baja. Se conservan íntegros los datos hasta ejecutar la baja, posterior a la entrega acreditada de la exportación, mediante el procedimiento interno. El registro externo conserva las terminaciones y permite reaplicar los bloqueos al restaurar, incluso antes de ejecutarse la baja. No se extiende el control operativo de VenceYa a instalaciones locales.

**Aplicado en:** RN-150, RN-152 y referencias en RN-101 y RN-149; glosario #66 y #69 a #72; alcance §5.2; diseño de seguridad, control previo a habilitar restauraciones.

**Casos de aceptación documental:**

1. Una solicitud recibida el 20/03 no termina por sí sola el contrato. Si se formaliza con fecha efectiva 31/03 a las 18:00, sigue vigente hasta ese instante y se bloquea desde entonces.
2. Con terminación efectiva 31/03 a las 18:00, el plazo de baja vence el 30/04 a las 18:00 America/Lima; entregar la exportación el 02/04 no desplaza ese plazo.
3. Un usuario ACTIVO con sesión abierta pierde acceso al hacerse efectiva la terminación. No puede iniciar otra sesión ni enviar avisos; los datos se conservan hasta la baja con evidencia de entrega.
4. Una restauración anterior a la terminación reaplica el bloqueo antes de habilitarse, aunque la baja esté pendiente. No elimina anticipadamente los datos ni reinicia el plazo.
5. «Enviado» por aceptación de Resend no acredita entrega al buzón ni entrega de la exportación contractual. Sin evidencia de esta última no se ejecuta la baja; el tratamiento de fallos continúa pendiente en QA2-12.

**Resultado:** QA2-29 queda resuelto documentalmente en sus definiciones y referencias. No se acredita implementación ni pruebas de software ni se cierra QA2-12. El puntaje histórico de la auditoría no se recalcula.

**Estado:** resuelto documentalmente. Este cierre verifica la especificación; no acredita implementación ni ejecución de pruebas de software.

## Cierre documental de QA2-12 — 2026-11-08

**Decisión del usuario:** la exportación y conservación de los históricos disponibles es responsabilidad del cliente mediante las funciones existentes, antes de la terminación efectiva y del bloqueo de acceso. No se agregan funcionalidades de salida contractual. Se retira la promesa de una exportación completa por VenceYa, su entrega gestionada y la obligación de acreditar descarga o recepción para ejecutar la baja.

Las exportaciones conservan el contenido, formatos, filtros, exclusiones y permisos definidos en S4 y RN-050, RN-051, RN-077, RN-079 y RN-144 a RN-146, con RN-163 para el formato. No equivalen a una copia completa de todos los datos: no se incorporan exportaciones de todos los pagos, usuarios, auditorías o avisos ni se amplía el MVP. O17 conserva su exclusión de la exportación de pagos por fecha de pago.

VenceYa ejecuta la baja dentro de los 30 días contados desde la terminación efectiva, aunque la empresa no haya exportado. No se exige fecha ni constancia de entrega en el registro de baja, no se amplía el plazo por falta de descarga y no se reabre acceso para exportar después de la terminación. Se mantienen la eliminación total y aislada por empresa, el registro externo y los controles de restauración. La constancia de terminación contractual se conserva y no debe confundirse con la condición de entrega retirada.

**Aplicado en:** PRINCIPIO-006 y nueva E-011 (sustituye la condición de exportación previa por VenceYa de E-008); RN-152; alcance §5.2; glosario #54, #69 y #72 y retiro de #70 sin reutilizar su identificador; diseño de seguridad y criterio de aceptación de baja. La propuesta anterior de QA2-01/02 se identifica como antecedente en lo relativo a exportación. Se conservan los hallazgos y decisiones anteriores como historia, sujetos a esta decisión posterior.

**Casos de aceptación documental:**

| Caso | Resultado requerido |
|---|---|
| Cliente exporta antes de la terminación efectiva | Utiliza las funciones existentes con sus permisos, contenido y filtros; conserva sus archivos bajo su responsabilidad |
| Cliente no exporta | La terminación y la baja siguen su curso; no se exige confirmación ni evidencia de entrega |
| Cliente pide un paquete completo o la exportación de entidades sin descarga prevista | No se incorpora una funcionalidad adicional ni se promete una copia completa como parte de la baja |
| Terminación efectiva el 31/03 a las 18:00 America/Lima | Se bloquean accesos y avisos desde ese instante y la baja se ejecuta como máximo el 30/04 a las 18:00, haya exportado o no |
| Cliente solicita exportar después de la terminación | No se reabre el acceso ni se establece una entrega gestionada por VenceYa |
| Registro de baja sin fecha ni constancia de entrega de exportación | Es válido si cumple los datos y controles restantes de RN-152 |
| Restauración de un respaldo anterior a terminación o baja | Se reaplican los bloqueos y las bajas antes de habilitar el servicio; no se reinicia el plazo ni se verifica una exportación |

**Resultado:** QA2-12 queda cerrado documentalmente por simplificación del alcance, no por implementación de un paquete de salida. No se modifica la prioridad de S4 ni se acredita implementación o ejecución de pruebas de software. La revisión general pendiente de la pregunta 31 permanece sin cambios. El puntaje histórico de la auditoría no se recalcula.

## Cierre documental de QA2-30 — 2026-11-08

**Decisión del usuario:** aplicar la propuesta de corrección EARS, conservando las decisiones de negocio, permisos, valores predeterminados y prioridades de entrega. Se incluyen RN-017, RN-018 y RN-119 por presentar el mismo uso incorrecto de Optional. El hallazgo original se conserva como antecedente: su referencia a RN-150 como Event-driven ya estaba desactualizada antes de este ajuste.

**Criterio aplicado:** CUANDO identifica un evento; MIENTRAS, un estado; DONDE se reserva para la presencia de una característica opcional del producto. La decisión del usuario de configurar una preferencia o una lista no convierte la capacidad en Optional. La clasificación EARS no reemplaza la prioridad MoSCoW. Las ramas de una misma decisión (por ejemplo, la precedencia de moneda personal, empresa y S/) se conservan juntas; las obligaciones verificables por separado se extraen.

**Trazabilidad:** cada ID original conserva su obligación principal. Las obligaciones extraídas reciben los IDs nuevos RN-164 a RN-188, posteriores a RN-163, sin reutilizar IDs retirados. Las fuentes originales se conservan en las reglas principales y se referencian en las extraídas. RN-150 mantiene su prohibición durante el contrato como State-driven; definiciones, justificación y referencias operativas quedan en un párrafo de contexto separado. RN-152 y el cierre posterior de QA2-12 no se modifican.

La matriz siguiente vincula cada obligación con su caso de aceptación. El identificador estable CA30-NNN corresponde a los ejemplos y contraejemplos de RN-NNN: el caso positivo debe cumplirse y el negativo debe rechazarse o no producirse. Son casos documentados para la futura implementación, no pruebas de software ejecutadas.

| Origen | Obligación | Regla resultante | Caso de aceptación y resultado requerido |
|---|---|---|---|
| RN-017 | Edición de vencimiento mientras sea elegible | RN-017 — State-driven, MUST | CA30-017: sin pagos ni reprogramaciones y no anulado, permite cambiar el vencimiento; con reprogramación, rechaza la edición directa |
| RN-018 | Edición de importes mientras sea elegible | RN-018 — State-driven, MUST | CA30-018: permite redistribuir S/ 1,000.00 sin cambiar la suma; con pago registrado, rechaza la edición directa |
| RN-104 | Copia al correo administrativo vigente | RN-104 — Event-driven, MUST | CA30-104: tras cambiar el correo el 08/11, el aviso del 09/11 usa el nuevo en copia, no el anterior |
| RN-104 | Dirección de respuesta vigente | RN-164 — Event-driven, MUST | CA30-164: el aviso posterior al cambio usa el nuevo Reply-To |
| RN-104 | Correo obligatorio y válido al crear o editar | RN-165 — Ubiquitous, MUST | CA30-165: acepta cobranzas@empresa1.example; rechaza ausencia o «abc» |
| RN-104 | Independencia del dato de empresa | RN-166 — Ubiquitous, MUST | CA30-166: desactivar uno de dos administradores no borra ni sustituye el correo administrativo |
| RN-104 | Permiso de modificación | RN-167 — Ubiquitous, MUST | CA30-167: permite el cambio al ADMINISTRADOR de la empresa; no al OPERADOR |
| RN-104 | Auditoría del cambio | RN-168 — Event-driven, MUST | CA30-168: registra ambos valores protegidos, usuario y fecha y hora; no omite el valor anterior |
| RN-105 | Precedencia al abrir el panel | RN-105 — Event-driven, MUST | CA30-105: usa preferencia personal, luego empresa y luego S/; la empresa no sustituye una preferencia personal |
| RN-105 y RN-119 | Capacidad de cambiar preferencias propias | RN-169 — Ubiquitous, MUST | CA30-169: los tres roles pueden guardar su propia moneda y ventana válidas |
| RN-105 | Privacidad de la preferencia de moneda | RN-170 — Ubiquitous, MUST | CA30-170: un ADMINISTRADOR solo consulta su propia preferencia, no la de Ana |
| RN-105 y RN-119 | Prohibición de modificar preferencias ajenas | RN-171 — Ubiquitous, MUST | CA30-171: el cambio de Ana no altera a Luis; ningún ADMINISTRADOR modifica las preferencias de Ana |
| RN-105 | Selección temporal sin persistencia | RN-172 — Event-driven, MUST | CA30-172: Ana consulta en S/ y vuelve a abrir en su preferencia US$ |
| RN-106 | Configuración de moneda de empresa | RN-106 — Event-driven, MUST | CA30-106: cambiar a US$ afecta al siguiente ingreso de Luis sin preferencia y conserva la preferencia S/ de Ana |
| RN-106 | Moneda inicial de empresa | RN-173 — State-driven, MUST | CA30-173: una empresa sin otra configuración usa S/, no US$ |
| RN-106 | Permiso de modificación | RN-174 — Ubiquitous, MUST | CA30-174: permite cambiarla al ADMINISTRADOR; no al OPERADOR ni al SUPERVISOR |
| RN-134 | Dos listas independientes | RN-134 — Ubiquitous, MUST | CA30-134: agregar al usuario 25 a cobrar no lo agrega a pagar ni le envía esas copias |
| RN-134 | Permiso de modificación | RN-175 — Ubiquitous, MUST | CA30-175: el ADMINISTRADOR agrega al usuario elegible 25; el SUPERVISOR no se agrega a sí mismo |
| RN-134 | Auditoría de listas | RN-176 — Event-driven, MUST | CA30-176: conserva usuario agregado o quitado, lista, autor y fecha y hora ISO 8601 |
| RN-134 | Admisión de listas vacías | RN-177 — Ubiquitous, MUST | CA30-177: ambas listas pueden guardarse sin usuarios; no exige un SUPERVISOR |
| RN-134 | Destinatarios con lista vacía | RN-178 — Event-driven, MUST | CA30-178: dirige al contacto con copia solo al correo administrativo, sin omitir este último |
| RN-134 | Conservación de avisos enviados | RN-179 — Event-driven, MUST | CA30-179: quitar al usuario 25 el 08/11 no cambia los destinatarios históricos del aviso del 07/11 |
| RN-119 | Guardado de ventana personal | RN-119 — Event-driven, MUST | CA30-119: guarda 15 días y conserva ese valor al volver a abrir |
| RN-119 | Valores admitidos | RN-180 — Ubiquitous, MUST | CA30-180: admite 7, 10 y 15 días; no admite 0 ni 20 |
| RN-119 | Aplicación exclusiva al gráfico | RN-181 — Ubiquitous, MUST | CA30-181: una ventana de 7 días no oculta de avisos la cuota del 01/12 |
| RN-119 | Ventana inicial | RN-182 — State-driven, MUST | CA30-182: sin preferencia usa 7 días, no 15 |
| RN-146 | Elección y aplicación del sentido | RN-146 — Event-driven, SHOULD | CA30-146: inicia en ambos; al elegir cobrar solo exporta cuotas por cobrar |
| RN-146 | Opción de anulados visible y desactivada | RN-183 — Event-driven, SHOULD | CA30-183: muestra la casilla desactivada al abrir opciones, no oculta ni activada por defecto |
| RN-146 | Exclusión sin selección explícita | RN-184 — Event-driven, SHOULD | CA30-184: CSV y Excel excluyen F001-00050 anulado aunque el listado en pantalla lo muestre |
| RN-146 | Inclusión explícita con filtros y representación | RN-185 — Event-driven, SHOULD | CA30-185: incluye anulados del periodo y sentido elegidos con estado vacío y «Sí»; no incluye los de noviembre al exportar octubre |
| RN-146 | Exportación de ambas monedas | RN-186 — Event-driven, SHOULD | CA30-186: con el panel en S/ también exporta la cuota elegible de US$ 100.00 identificando su moneda |
| RN-146 | Prohibición de totales entre monedas | RN-187 — Ubiquitous, SHOULD | CA30-187: no suma S/ 500.00 y US$ 100.00 en un total común de 600.00 |
| RN-146 | Opción exclusiva del listado | RN-188 — Ubiquitous, SHOULD | CA30-188: el reporte de vencimientos y su exportación no ofrecen incluir anulados y siguen excluyéndolos |
| RN-150 | Conservación durante contrato vigente | RN-150 — State-driven, MUST | CA30-150: conserva en 2028 los pagos de 2026 de una empresa con contrato vigente; no los depura por antigüedad |

**Referencias afectadas:** se actualizan la matriz de permisos de RN-060 y las entradas pertinentes del glosario para apuntar a las obligaciones extraídas. Se añade en el alcance la correspondencia de las reglas de exportación de S4, sin ampliar su entrega. Las referencias históricas de auditorías y enmiendas se conservan; el diseño de seguridad no requiere cambios, porque no se trasladaron sus obligaciones.

**Estado:** resuelto documentalmente. Este ajuste aporta a la atomicidad de QA2-31 y a los permisos de QA2-32 únicamente en las reglas tratadas; no los cerró en esa revisión; sus cierres documentales posteriores constan al final. Los XML de generación mantienen su formato. No se acredita implementación ni ejecución de pruebas de software ni se recalcula el puntaje histórico.

## Cierre documental de QA2-32 — 2026-11-08

**Decisión del usuario:** corregir el uso de las palabras normativas conforme a `03-reglas-de-negocio.xml` y cerrar el hallazgo documentalmente, conservando el comportamiento aprobado. El XML define DEBE como obligatorio, NO DEBE como prohibido y PUEDE como opcional; el defecto estaba en usar PUEDE para capacidades exigidas. No se modifica el XML.

**Criterio aplicado:** las capacidades exigidas se expresan como «el sistema DEBE permitir…» o «DEBE admitir…», con el actor, condiciones y validaciones vigentes. La decisión de un usuario de ejercer un permiso no convierte en opcional su implementación. MUST/SHOULD/COULD siguen definiendo la prioridad de entrega. En particular, RN-050, RN-051 y RN-077 conservan SHOULD: las exportaciones son exigibles al entregar S4, sin incorporarse al MVP. RN-079 conserva MUST como restricción de permisos, sin anticipar la entrega del reporte de S4.

**Referencias originales:** RN-017 y RN-018 ya usan DEBE permitir tras QA2-30 y no requieren otra modificación. RN-037 continúa retirada por QA2-09; no se reutiliza su ID. RN-050, RN-051 y RN-077 ahora exigen proporcionar las capacidades de exportación a SUPERVISOR y ADMINISTRADOR. Su clasificación pasa de Optional a Ubiquitous para expresar la capacidad exigida en S4, sin confundir prioridad de entrega con característica opcional.

**Revisión complementaria:** se explicitan capacidades y permisos en RN-015, RN-023, RN-069, RN-079, RN-081, RN-095, RN-098 a RN-100, RN-115, RN-127, RN-128, RN-130 y RN-156. Se conservan sus IDs, categorías, fuentes, prioridades y validaciones; la división general de reglas compuestas sigue correspondiendo a QA2-31. En RN-130 se expresa la exclusión mutua de operaciones concurrentes como garantía obligatoria, sin usar PUEDE. En RN-077 y RN-078 las variaciones entre consultas se describen como consecuencias del corte y del recálculo, no como decisiones opcionales del implementador.

**Usos conservados de PUEDE:** RN-014 permite la presentación funcional autorizada de datos económicos fuera del mensaje de error; esa autorización no exige mostrarlos en toda operación ni elimina las obligaciones concretas de RN-016 y RN-092. RN-152 admite la ejecución manual del control de restauración: el método manual está permitido y el control sigue siendo obligatorio. RN-143 aclara que anticipar la validación en la interfaz es complementario y opcional, mientras que la validación en el servidor sigue siendo obligatoria. Los usos narrativos en ejemplos y las descripciones de efectos posibles no establecen opcionalidad de entrega.

### Casos de aceptación documental

Son criterios para la futura implementación, no pruebas de software ejecutadas. En los casos con operaciones válidas se presuponen sesión, empresa, estado y demás validaciones satisfechos; los permisos no permiten omitirlas.

| Caso | Reglas | Resultado requerido |
|---|---|---|
| CA32-01: comprobante sin pagos ni reprogramaciones y no anulado | RN-017, RN-018 | Permite editar vencimientos e importes conforme a sus validaciones; la capacidad no se omite por ser una decisión del usuario |
| CA32-02: S4 entregado; SUPERVISOR y ADMINISTRADOR exportan octubre de 2026 | RN-050, RN-051, RN-060 | Ambos roles disponen de CSV y Excel para el listado; no basta entregar uno de los formatos |
| CA32-03: S4 entregado; ambos roles exportan el reporte de vencimientos | RN-077, RN-060 | Disponibles CSV y Excel con el contrato del reporte, filtros y corte vigentes |
| CA32-04: OPERADOR consulta y luego intenta exportar tras entregar S4 | RN-079, RN-060 | Consulta permitida; exportación CSV y Excel rechazada sin generar archivos |
| CA32-05: evaluación del MVP antes de incorporar S4 | Cabecera, RN-050, RN-051, RN-077, RN-079 | No exige implementar S4; la restricción MUST de permisos no adelanta su entrega |
| CA32-06: contacto con el mismo correo en empresas 1 y 2; luego duplicado dentro de empresa 1 | RN-127 | Admite el registro en empresas distintas y rechaza el duplicado dentro de la misma empresa |
| CA32-07: contacto 42 eliminado sin comprobantes; contacto nuevo 43 reutiliza su correo | RN-127, RN-130 | Admite el correo liberado sin recuperar automáticamente el historial del contacto eliminado |
| CA32-08: un contacto tiene comprobantes por cobrar y por pagar | RN-128 | Mantiene un único contacto como cliente y proveedor; no obliga a duplicarlo |
| CA32-09: los tres roles gestionan sus contactos; uno tiene comprobantes | RN-130, RN-060 | Permite crear, editar, desactivar y reactivar; rechaza eliminar el contacto con comprobantes y conserva la aptitud para aviso según RN-155 |
| CA32-10: ADMINISTRADOR reenvía una invitación vencida de un usuario INVITADO de su empresa | RN-098, RN-060 | Permite reenviar, genera enlace de 72 horas y revoca el anterior; no concede esta administración a OPERADOR o SUPERVISOR |
| CA32-11: ADMINISTRADOR reactiva a un usuario DESACTIVADO de su empresa | RN-099, RN-098, RN-060 | Permite reactivar con el estado y enlace correspondientes a si ya definió contraseña; no elimina el historial |
| CA32-12: alta de otro administrador y cambio de rol del último administrador activo | RN-100, RN-070, RN-060, RN-161 | Permite varios administradores y la asignación autorizada; rechaza dejar la empresa sin administrador activo |
| CA32-13: dos operaciones distintas con misma cuota, fecha e importe | RN-156 | Las admite si cumplen saldo y cronología; un reintento de la misma operación no crea otro pago |
| CA32-14: consulta con corte nuevo o pago retroactivo que cambia una transición derivada | RN-077, RN-078 | El resultado refleja obligatoriamente su corte y recálculo; conservar una transición obsoleta no es una alternativa permitida |
| CA32-15: presentación económica autorizada, restauración manual y validación de contraseña | RN-014, RN-152, RN-143 | La autorización de presentación no impone mostrar datos en todo error; el control de restauración se cumple aunque sea manual; omitir validación anticipada en la interfaz no permite omitir la del servidor |

**Verificación y cierre:** contrastadas las capacidades con la matriz RN-060 y la entrega de S4 en `02-alcance.md`; conservadas las cabeceras de reglas (IDs, categorías, prioridades y fuentes), las referencias y los IDs retirados. Se añaden contraejemplos específicos de omisión de exportaciones y ejemplos de reutilización de correo. El alcance, el glosario y los XML no requieren cambios porque no se trasladan obligaciones ni se modifica su significado. El hallazgo original y los cierres anteriores se conservan como antecedentes; este cierre establece el estado actual de QA2-32.

**Estado:** resuelto documentalmente. No se acredita implementación ni ejecución de pruebas de software. QA2-31 y QA2-33 seguían abiertos en esa revisión y se cerraron documentalmente después; el puntaje histórico no se recalcula.


## Cierre documental de QA2-31 — 2026-11-08

**Decisión del usuario:** separar las obligaciones compuestas y cerrar el hallazgo tras verificar su trazabilidad. Se conserva el formato RN-NNN del XML; los subidentificadores estables se aplican a los casos de aceptación CA31-NNN-01. El XML no se modifica.

**Criterio aplicado:** los IDs originales conservan su obligación principal y sus metadatos. Las obligaciones extraídas reciben RN-189 a RN-257, posteriores al último ID existente RN-188, sin reutilizar ningún ID retirado. Cada regla tiene patrón EARS, ejemplo y contraejemplo propios. Las definiciones, explicaciones y pendientes se separan del enunciado normativo. Una transacción o rechazo sin efectos parciales se verifica como una garantía indivisible, cubriendo todos sus efectos: dividir sus objetos no autoriza resultados parciales. La enumeración de campos o registros de una misma política tampoco introduce capacidades distintas; se verifica por cada campo, copia y canal aplicable.

**Correspondencia:** RN-011 conserva el cifrado de campos; RN-014, la prohibición de exposición; RN-023, la obtención del momento actual; RN-094, el alta conjunta; RN-113, el envío confirmado de cuotas aptas; RN-139, la normalización de correos; RN-140, el uso de referencias HMAC; RN-141, la generación de claves; RN-142, la activación de nuevas escrituras; RN-143, el almacenamiento de contraseñas; RN-151, la derivación por procedimiento interno. RN-150 ya contiene una sola prohibición tras QA2-30 y no se divide nuevamente.

**Límites conservados:** no se agregan capacidades, prioridades ni condiciones de entrega. Las reglas extraídas mantienen MUST como sus originales; sus referencias a reportes, exportaciones o reprogramaciones SHOULD solo aplican cuando se entregue la capacidad correspondiente. RN-197 y RN-252 mantienen alternativas expresamente opcionales, sin volver opcionales los controles obligatorios. La pregunta 31 sigue abierta: no se inventan responsables, autorizaciones ni cobertura de eliminación sobre copias. Los pendientes operativos del diseño de seguridad también permanecen pendientes. No se modifica RN-152 ni se reabren las decisiones de QA2-10, QA2-12, QA2-16, QA2-30 o QA2-32.

**Matriz obligación/caso de aceptación:** cada fila identifica un criterio documental independiente con caso positivo y negativo. En las políticas con varios campos o canales, el caso se parametriza por cada campo, copia o canal indicado; pasar una variante no acredita las demás. Los casos no representan pruebas de software ejecutadas.

| Regla original | Obligación verificable | Regla vigente | Caso de aceptación estable | Resultado de aceptación / rechazo |
|---|---|---|---|---|
| RN-011 | El sistema DEBE cifrar con AES-256-GCM, antes de persistir, el correo, teléfono y dirección de los contactos cuando existan; el RUC y correo administrativo de las empresas; y el correo de acceso de los usuarios. | RN-011 | CA31-011-01 | Aceptar: El RUC 20601234567 se guarda cifrado con AES-256-GCM. Rechazar: La columna ruc guarda 20601234567 en texto plano. |
| RN-011 | El sistema DEBE aplicar el cifrado de RN-011 a las copias persistidas de esos campos en historiales, destinatarios de avisos y auditorías. | RN-189 | CA31-189-01 | Aceptar: El destinatario ana@example.com queda cifrado también en el aviso 501 y su auditoría. Rechazar: El contacto está cifrado, pero el historial del aviso 501 conserva su correo legible. |
| RN-011 | El sistema DEBE usar un valor de inicialización que no se repita con la misma clave de cifrado. | RN-190 | CA31-190-01 | Aceptar: Dos cifrados del correo ana@example.com con la clave versión 1 usan IV distintos. Rechazar: Dos procesos reutilizan el mismo IV con la clave versión 1. |
| RN-011 | CUANDO descifra un valor protegido por RN-011, el sistema DEBE verificar su integridad. | RN-191 | CA31-191-01 | Aceptar: Al leer el contacto 42 se comprueba la etiqueta de autenticación antes de utilizar su correo. Rechazar: Se descifra el correo del contacto 42 sin comprobar su etiqueta. |
| RN-011 | SI falla la verificación de integridad de un valor cifrado, el sistema NO DEBE devolver el contenido ni recurrir a una copia en texto plano como alternativa. | RN-192 | CA31-192-01 | Aceptar: La etiqueta alterada del contacto 42 impide devolver su correo. Rechazar: Una etiqueta alterada provoca que se devuelva el correo desde una columna auxiliar legible. |
| RN-014 | El sistema y el trabajo de desarrollo NO DEBEN exponer datos personales reales en logs, mensajes de error, prompts de agentes de IA ni fixtures del repositorio, incluidos los datos contenidos en objetos completos y en textos libres. | RN-014 | CA31-014-01 | Aceptar: El error de la cuota 12 indica IMPORTE_SUPERA_SALDO sin nombres ni importes. Rechazar: El cuerpo del error de la cuota 12 contiene el nombre del contacto o saldo_vigente=600.00. |
| RN-014 | Para diagnóstico se DEBEN usar eventos, identificadores internos y códigos de error, sin adjuntar datos personales ni importes vinculados a personas. | RN-193 | CA31-193-01 | Aceptar: Se registra evento=pago_rechazado contacto_id=42 codigo=IMPORTE_SUPERA_SALDO. Rechazar: El mismo evento registra contacto_id=42 saldo=600.00. |
| RN-014 | Los fixtures y ejemplos de desarrollo DEBEN usar datos ficticios, sin copiar registros reales. | RN-194 | CA31-194-01 | Aceptar: Un fixture del contacto 42 usa el correo ficticio contacto@example.com. Rechazar: El fixture copia el registro real del contacto 42 aunque cambie su nombre. |
| RN-014 | El sistema NO DEBE buscar, depurar ni sustituir datos personales dentro de los campos de texto libre que completa el usuario (PRINCIPIO-005, E-010). | RN-195 | CA31-195-01 | Aceptar: El comentario del aviso 501 conserva el texto ingresado, sujeto únicamente a su contrato de entrada RN-162. Rechazar: El sistema busca nombres dentro del comentario 501 y los sustituye automáticamente. |
| RN-014 | El uso funcional de datos personales en pantallas, reportes y avisos DEBE respetar los permisos, destinatarios y aislamiento por empresa establecidos para cada funcionalidad. | RN-196 | CA31-196-01 | Aceptar: El reporte de la empresa 1 muestra sus contactos únicamente a sus usuarios autorizados. Rechazar: Un usuario de la empresa 2 consulta los datos del contacto 42 de la empresa 1. |
| RN-014 | Al rechazar una operación, la interfaz PUEDE mostrar al usuario autorizado datos económicos de esa operación obtenidos de una consulta autorizada o calculados con sus propios datos de entrada, fuera del mensaje de error; esta alternativa no incorpora esos datos al error de RN-014. | RN-197 | CA31-197-01 | Aceptar: Tras el rechazo, la pantalla consulta la cuota 12 y muestra Saldo vigente: S/ 600.00 junto al error genérico. Rechazar: La pantalla obtiene S/ 600.00 del cuerpo de la respuesta de error en vez de una fuente autorizada separada. |
| RN-023 | CUANDO inicia una consulta u operación en producción, la capa de aplicación DEBE obtener automáticamente el momento actual, con fecha, hora y zona horaria. | RN-023 | CA31-023-01 | Aceptar: Una consulta iniciada el 2026-11-06T23:59:59-05:00 toma ese momento aunque termine el día 7. Rechazar: Una consulta iniciada el 2026-11-06 toma el momento del día 7 al terminar. |
| RN-023 | La capa de aplicación DEBE proporcionar a las funciones de negocio, como parámetro explícito, la fecha de cálculo sin hora derivada del momento de RN-023 en America/Lima o, para resultados con corte, del mismo corte de RN-205. | RN-198 | CA31-198-01 | Aceptar: Un corte 2026-11-07T04:59:59Z proporciona la fecha 2026-11-06. Rechazar: El mismo corte proporciona 2026-11-07 por usar UTC como fecha de cálculo. |
| RN-023 | El sistema NO DEBE permitir al usuario ingresar, elegir ni modificar la fecha de cálculo en producción. | RN-199 | CA31-199-01 | Aceptar: El usuario elige un periodo de emisión, pero la fecha de cálculo sigue siendo 2026-11-06. Rechazar: El formulario permite elegir 2026-10-31 como fecha de cálculo. |
| RN-023 | Las funciones de negocio NO DEBEN leer el reloj directamente para obtener la fecha de cálculo. | RN-200 | CA31-200-01 | Aceptar: calcularEstadoCuota(cuota, '2026-11-04') usa el parámetro recibido. Rechazar: calcularEstadoCuota(cuota) ejecuta new Date() para resolver el estado. |
| RN-023 | El sistema DEBE usar la fecha de cálculo de RN-198 para evaluar estados, promesas, próximos vencimientos y días de atraso en el panel, reporte de vencimientos, lista de cuotas por avisar y avisos, con los pagos, anulaciones y reprogramaciones registrados y visibles en la lectura de datos de la consulta u operación. | RN-201 | CA31-201-01 | Aceptar: Con fecha 2026-11-04, una cuota impaga vencida el 2026-11-03 resulta VENCIDA; con promesa vigente al 2026-11-10 resulta PENDIENTE. Rechazar: La lista usa la fecha 2026-11-04, pero el aviso usa la fecha del día en que se abrió la pantalla. |
| RN-023 | El sistema NO DEBE ofrecer una fecha de cálculo pasada ni reconstruir una cartera histórica en producción. | RN-202 | CA31-202-01 | Aceptar: Un reporte del periodo de emisión octubre usa los pagos visibles al corte 2026-11-06. Rechazar: El reporte elimina del cálculo los pagos de noviembre para reconstruir el saldo al 2026-10-31. |
| RN-023 | El sistema DEBE admitir una fecha de cálculo distinta de la actual exclusivamente desde pruebas automatizadas para obtener resultados deterministas. | RN-203 | CA31-203-01 | Aceptar: Una prueba pasa 2026-11-04 y obtiene VENCIDA para una cuota impaga vencida el 2026-11-03. Rechazar: La prueba no puede fijar la fecha y depende del día de ejecución. |
| RN-023 | El sistema NO DEBE exponer al usuario en producción la capacidad de inyectar fechas de cálculo de pruebas de RN-203. | RN-204 | CA31-204-01 | Aceptar: Una solicitud de producción no permite sustituir la fecha actual por 2026-10-31. Rechazar: Un parámetro del API público activa la fecha de pruebas 2026-10-31. |
| RN-023 | CUANDO genera una consulta del panel, reporte de vencimientos o exportación, el sistema DEBE establecer un momento de corte con fecha, hora y zona horaria asociado al inicio de una lectura coherente de datos. | RN-205 | CA31-205-01 | Aceptar: El reporte comienza su lectura con corte 2026-11-06T10:00:00-05:00. Rechazar: El reporte fija el corte al terminar de escribir el archivo a las 10:05. |
| RN-023 | Todas las filas, grupos, indicadores y totales de una misma respuesta DEBEN usar la lectura coherente de su corte; los cambios registrados durante su generación quedan para una nueva consulta. | RN-206 | CA31-206-01 | Aceptar: Un pago de S/ 100.00 posterior al inicio de la lectura no cambia ninguna fila ni total de esa respuesta. Rechazar: El pago posterior reduce el total, pero la fila conserva el saldo anterior. |
| RN-023 | La leyenda «Datos al DD/MM/AAAA, HH:mm» DEBE representar el corte de RN-205 en America/Lima, no la hora de finalización. | RN-207 | CA31-207-01 | Aceptar: Una generación de 10:00 a 10:05 muestra Datos al 06/11/2026, 10:00. Rechazar: El mismo resultado muestra Datos al 06/11/2026, 10:05. |
| RN-023 | El valor interno del corte DEBE conservar su precisión temporal aunque la leyenda solo muestre minutos. | RN-208 | CA31-208-01 | Aceptar: Los cortes 2026-11-06T10:00:01-05:00 y 2026-11-06T10:00:45-05:00 conservan sus instantes distintos. Rechazar: Se redondean ambos cortes a las 10:00 y se consideran la misma lectura. |
| RN-023 | CUANDO vuelve a consultar un resultado con corte, el sistema DEBE obtener un nuevo corte y actualizar conjuntamente sus datos y leyenda. | RN-209 | CA31-209-01 | Aceptar: Actualizar a las 10:05 sustituye todos los componentes del panel y su leyenda por los del nuevo corte. Rechazar: Se actualiza la leyenda a las 10:05, pero el gráfico conserva datos de las 10:00. |
| RN-023 | MIENTRAS no se actualice una pantalla ya abierta, el sistema DEBE conservar el corte correspondiente a los datos mostrados. | RN-210 | CA31-210-01 | Aceptar: La pantalla de las 10:00 conserva esa leyenda aunque una exportación posterior use las 10:05. Rechazar: La pantalla cambia su leyenda a las 10:05 sin volver a consultar sus datos. |
| RN-094 | CUANDO el equipo de VenceYa registra una empresa con razón social, RUC, correo administrativo y correo del primer administrador, el sistema DEBE crear la empresa junto con ese usuario en rol ADMINISTRADOR y estado INVITADO. | RN-094 | CA31-094-01 | Aceptar: Se registra Empresa 1 SAC, RUC 20601234567, correo oficina@empresa1.example y primer administrador admin@empresa1.example; el usuario queda INVITADO con rol ADMINISTRADOR. Rechazar: La empresa se registra con un primer usuario OPERADOR o ACTIVO sin definir contraseña. |
| RN-094 | SI falla la creación de la empresa o de su primer administrador de RN-094, el sistema NO DEBE persistir ninguno de los dos. | RN-211 | CA31-211-01 | Aceptar: Falla el alta del administrador admin@empresa1.example y no queda creada Empresa 1 SAC ni su usuario. Rechazar: Falla el alta del administrador, pero Empresa 1 SAC queda persistida. |
| RN-113 | CUANDO el usuario selecciona cuotas de la lista por avisar y confirma el envío, el sistema DEBE enviar un aviso al contacto por las cuotas que sigan siendo aptas según RN-155, después de las comprobaciones RN-212 y RN-213 y con la agrupación de RN-214. | RN-113 | CA31-113-01 | Aceptar: La cuota 12 sigue apta al confirmar y se genera su aviso al contacto 42. Rechazar: Se omite sin motivo el aviso de la cuota 12 que sigue apta después de confirmar. |
| RN-113 | CUANDO el usuario confirma un envío, el sistema DEBE obtener de nuevo la fecha de cálculo actual y recalcular saldo, estado, tipo de aviso, días de atraso y aptitud de cada cuota seleccionada antes de generar los correos (RN-155, RN-198, RN-201). | RN-212 | CA31-212-01 | Aceptar: Se abre la lista el 2026-11-05 y se confirma el 2026-11-06; el aviso utiliza el saldo vigente y los días de atraso del día 6. Rechazar: Una cuota saldada después de abrir la lista se envía con su saldo anterior. |
| RN-113 | CUANDO el usuario confirma un envío, el sistema DEBE volver a obtener los destinatarios vigentes antes de generar los correos, conforme a RN-136 y su exigencia de nueva confirmación si cambiaron. | RN-213 | CA31-213-01 | Aceptar: El correo del contacto 42 cambia de ana@example.com a nueva@example.com antes de confirmar; se muestran los destinatarios vigentes para confirmar otra vez. Rechazar: Se envía a ana@example.com usando los destinatarios guardados al abrir la lista. |
| RN-113 | CUANDO una selección confirmada contiene varias cuotas aptas del mismo contacto y del mismo tipo de aviso de RN-114, el sistema DEBE agruparlas en un solo correo por contacto y tipo. | RN-214 | CA31-214-01 | Aceptar: Las cuotas 1 y 2 de F001-00045, por cobrar por vencer del contacto 42, van en un correo; una vencida va en otro. Rechazar: Se envían dos correos para las cuotas 1 y 2 del mismo contacto y tipo, o se mezcla una por pagar con una por cobrar. |
| RN-113 | El sistema NO DEBE enviar avisos sin confirmación de un usuario. | RN-215 | CA31-215-01 | Aceptar: La cuota 12 vence el 2026-11-07 y no genera correo hasta que el usuario confirma. Rechazar: La cuota 12 genera un correo automático el 2026-11-07. |
| RN-139 | El sistema DEBE normalizar los correos de contactos y usuarios quitando los espacios exteriores y convirtiendo a minúsculas con el mismo procedimiento al registrar, editar, comprobar duplicados, iniciar sesión y recuperar acceso. | RN-139 | CA31-139-01 | Aceptar: ' Ana@Empresa.example ' y 'ana@empresa.example' coinciden en el alta y el inicio de sesión. Rechazar: El alta quita espacios, pero el inicio de sesión los conserva. |
| RN-139 | El sistema NO DEBE eliminar puntos, sufijos con signo + ni espacios interiores para hacer coincidir direcciones distintas. | RN-216 | CA31-216-01 | Aceptar: ana+ventas@example.com no se hace coincidir con ana@example.com; a.na@example.com conserva el punto. Rechazar: Se elimina +ventas y se localiza la cuenta ana@example.com como si fuera la misma dirección. |
| RN-139 | El sistema DEBE comparar el RUC como cadena de exactamente 11 dígitos, conservando los ceros iniciales. | RN-217 | CA31-217-01 | Aceptar: El valor de comparación 00601234567 conserva sus 11 dígitos. Rechazar: Se convierte 00601234567 a número y se pierden sus ceros iniciales. |
| RN-139 | Las comparaciones de correo y RUC de RN-139 y RN-217 DEBEN ser exactas, no coincidencias por fragmentos. | RN-218 | CA31-218-01 | Aceptar: ana@example.com no coincide con juana@example.com. Rechazar: Se localiza juana@example.com buscando el fragmento ana@example.com. |
| RN-140 | El sistema DEBE realizar las comparaciones exactas de RN-127, RN-096 y RN-097 y la localización de cuentas de RN-101 y RN-102 mediante referencias HMAC-SHA-256. | RN-140 | CA31-140-01 | Aceptar: La cuenta ana@example.com se localiza por su referencia HMAC-SHA-256. Rechazar: Se descifran todos los correos para localizar la cuenta o se usa un hash sin clave. |
| RN-140 | El sistema DEBE usar para HMAC-SHA-256 una clave independiente de la clave de cifrado. | RN-219 | CA31-219-01 | Aceptar: La referencia del contacto 42 usa la clave de búsqueda B1 y el cifrado usa C1. Rechazar: La misma clave C1 se usa para cifrar y calcular HMAC. |
| RN-140 | El sistema NO DEBE mantener copias en texto plano de correo o RUC como auxiliares de comparación o localización. | RN-220 | CA31-220-01 | Aceptar: El contacto 42 tiene valor cifrado y referencias protegidas, sin correo_normalizado legible. Rechazar: Se guarda ana@example.com en una columna auxiliar para buscarla. |
| RN-140 | El ámbito de las referencias de contactos DEBE incluir la empresa gestionada. | RN-221 | CA31-221-01 | Aceptar: ana@example.com puede existir como contacto en las empresas 1 y 2. Rechazar: Una referencia sin empresa impide registrar el mismo correo en la empresa 2. |
| RN-140 | Las referencias de usuarios y RUC de empresas DEBEN aplicar unicidad global. | RN-222 | CA31-222-01 | Aceptar: ana@example.com no se duplica como usuario en la empresa 2; el RUC 20601234567 no se duplica. Rechazar: Se acepta el mismo usuario o RUC por estar en otra empresa. |
| RN-140 | El sistema NO DEBE exponer las referencias protegidas en logs, errores ni interfaces. | RN-223 | CA31-223-01 | Aceptar: El error del contacto 42 usa un código genérico, sin su HMAC. Rechazar: El API devuelve el HMAC del contacto 42 como si fuera información anónima. |
| RN-140 | CUANDO guarda o modifica un dato cifrado, el sistema DEBE persistir atómicamente el valor y sus referencias de comparación. | RN-224 | CA31-224-01 | Aceptar: Si falla la referencia nueva del contacto 42, se conserva completo su valor anterior. Rechazar: Se guarda el correo nuevo del contacto 42 con la referencia del correo anterior. |
| RN-140 | El sistema DEBE mantener la unicidad de RN-096, RN-097 y RN-127 ante solicitudes concurrentes. | RN-225 | CA31-225-01 | Aceptar: Dos altas simultáneas de ana@example.com en la empresa 1 producen un solo contacto. Rechazar: Una comprobación previa permite persistir ambos contactos simultáneos. |
| RN-140 | MIENTRAS convivan versiones de claves durante una rotación, el sistema DEBE mantener la unicidad de RN-096, RN-097 y RN-127. | RN-226 | CA31-226-01 | Aceptar: Una cuenta ana@example.com indexada con B1 impide crear otra con B2. Rechazar: La misma cuenta se duplica porque sus referencias B1 y B2 son distintas. |
| RN-141 | Las claves DEBEN generarse con aleatoriedad criptográfica. | RN-141 | CA31-141-01 | Aceptar: La clave C1 se genera con un generador criptográfico. Rechazar: La clave C1 se deriva de la fecha 2026-11-08 sin aleatoriedad criptográfica. |
| RN-141 | Las claves DEBEN custodiarse en un gestor de secretos o claves externo a PostgreSQL y al repositorio. | RN-227 | CA31-227-01 | Aceptar: La clave C1 se obtiene del gestor externo y no está en las tablas ni en archivos versionados. Rechazar: La clave C1 se guarda en una tabla de PostgreSQL o en el repositorio. |
| RN-141 | Las claves DEBEN estar separadas por ambiente. | RN-228 | CA31-228-01 | Aceptar: Producción y pruebas utilizan claves C1 y C2 distintas. Rechazar: Pruebas reutiliza la clave C1 de producción. |
| RN-141 | Las claves DEBEN estar separadas por propósito de cifrado y búsqueda. | RN-229 | CA31-229-01 | Aceptar: Producción tiene una clave C1 de cifrado y una B1 de búsqueda. Rechazar: Una sola clave se usa para ambos propósitos. |
| RN-141 | El acceso a uso o administración de claves DEBE limitarse al servicio autorizado y al personal operativo expresamente habilitado según su función; los roles de negocio no conceden ese acceso. | RN-230 | CA31-230-01 | Aceptar: Un ADMINISTRADOR de la empresa 1 no accede a C1 por su rol. Rechazar: El rol ADMINISTRADOR permite descargar C1 desde la aplicación. |
| RN-141 | Cada valor cifrado y referencia DEBE identificar la versión de clave correspondiente. | RN-231 | CA31-231-01 | Aceptar: El correo cifrado del contacto 42 indica C2 y su referencia indica B2. Rechazar: El contacto 42 depende de adivinar la clave porque no guarda su versión. |
| RN-141 | CUANDO ocurre un acceso administrativo o cambio de claves, el sistema DEBE auditarlo. | RN-232 | CA31-232-01 | Aceptar: La rotación C1 a C2 registra el acceso y el cambio autorizados. Rechazar: Se cambia C1 por C2 sin registro de auditoría. |
| RN-141 | La auditoría de claves NO DEBE registrar secretos ni datos personales. | RN-233 | CA31-233-01 | Aceptar: El registro de rotación C1 a C2 contiene referencias de versiones, sin el material secreto. Rechazar: El registro incluye la clave C2 o el correo personal del contacto 42. |
| RN-141 | SI no está disponible una clave necesaria, el sistema DEBE rechazar la operación dependiente sin persistir texto plano. | RN-234 | CA31-234-01 | Aceptar: Falta C2 y se rechaza el cambio del correo del contacto 42 sin guardarlo legible. Rechazar: Al faltar C2 se guarda ana@example.com en texto plano para completar la operación. |
| RN-142 | CUANDO se rota una clave, el sistema DEBE activar la nueva versión para escrituras. | RN-142 | CA31-142-01 | Aceptar: Tras activar C2, un nuevo correo se cifra con C2. Rechazar: Después de activar C2 se sigue escribiendo con C1 como versión ordinaria. |
| RN-142 | MIENTRAS existan valores que necesiten versiones anteriores durante una rotación, el sistema DEBE conservar su lectura con las versiones correspondientes. | RN-235 | CA31-235-01 | Aceptar: Tras activar C2, el contacto 42 todavía cifrado con C1 sigue siendo legible para un uso autorizado. Rechazar: Activar C2 vuelve inaccesible el contacto 42 antes de migrarlo. |
| RN-142 | CUANDO rota una clave, el sistema DEBE migrar los datos y referencias sin perder unicidad ni acceso. | RN-236 | CA31-236-01 | Aceptar: La migración B1 a B2 conserva una sola cuenta ana@example.com accesible. Rechazar: La migración deja una cuenta inaccesible o admite una segunda ana@example.com. |
| RN-142 | Antes de producción, el procedimiento operativo DEBE fijar responsable, plazo de rotación y límites de uso de claves. | RN-237 | CA31-237-01 | Aceptar: El procedimiento asigna responsable operativo, rotación máxima de 12 meses y límite de 2³² cifrados por versión conforme al diseño. Rechazar: Se habilita producción sin responsable o sin plazo o límite de uso definidos. |
| RN-142 | CUANDO existe sospecha de compromiso de una clave, el procedimiento operativo DEBE activar su rotación anticipada. | RN-238 | CA31-238-01 | Aceptar: La sospecha sobre C1 activa su sustitución antes del plazo ordinario de 12 meses. Rechazar: Se espera al plazo ordinario de 12 meses pese a sospechar el compromiso de C1. |
| RN-142 | MIENTRAS existan datos o respaldos retenidos que requieran una clave anterior, esta NO DEBE destruirse, salvo migración o reemplazo verificados de esos datos o respaldos. | RN-239 | CA31-239-01 | Aceptar: Un respaldo cifrado con C1 conserva su clave bajo acceso controlado hasta dejar de necesitarla. Rechazar: Se destruye C1 al activar C2 aunque un respaldo retenido todavía la requiere. |
| RN-142 | Las pruebas de recuperación DEBEN comprobar conjuntamente datos, claves y reconstrucción de referencias. | RN-240 | CA31-240-01 | Aceptar: Se restaura un respaldo C1, se reconstruyen referencias B2 y se verifica acceso y unicidad antes de abrir el servicio. Rechazar: La prueba solo comprueba que PostgreSQL arranca, sin descifrar datos ni reconstruir referencias. |
| RN-142 | CUANDO existe compromiso de una clave, el procedimiento operativo DEBE restringir de inmediato el uso de la versión afectada. | RN-241 | CA31-241-01 | Aceptar: C1 comprometida deja de estar disponible para uso ordinario al conocerse el incidente. Rechazar: C1 sigue disponible para uso ordinario hasta la siguiente rotación anual. |
| RN-142 | CUANDO existe compromiso de una clave, el procedimiento operativo DEBE preservar la recuperación de los datos dependientes mediante acceso controlado. | RN-242 | CA31-242-01 | Aceptar: La recuperación autorizada de un respaldo C1 usa acceso restringido mientras se sustituye la clave. Rechazar: Se destruye C1 sin migración y se pierde la recuperación del respaldo retenido. |
| RN-143 | El sistema DEBE almacenar las contraseñas mediante un algoritmo específico de hash de contraseñas con sal aleatoria individual y parámetros de costo registrados, excluyendo texto plano, hash rápido genérico y cifrado reversible. | RN-143 | CA31-143-01 | Aceptar: Dos usuarios con la contraseña 'mi clave larga 2026' tienen hashes distintos y parámetros de costo registrados. Rechazar: La contraseña se guarda con SHA-256 genérico o mediante AES reversible. |
| RN-143 | CUANDO verifica una contraseña, el sistema DEBE usar la función de verificación de la biblioteca elegida. | RN-243 | CA31-243-01 | Aceptar: La biblioteca verifica 'mi clave larga 2026' contra su hash almacenado. Rechazar: El sistema descifra una contraseña o compara hashes mediante una rutina propia en vez del verificador elegido. |
| RN-143 | CUANDO se define o recupera una contraseña según RN-098 o RN-102, el sistema DEBE generar un hash nuevo. | RN-244 | CA31-244-01 | Aceptar: Recuperar con 'mi clave larga 2026' genera un nuevo hash con su sal individual. Rechazar: La recuperación reutiliza el hash anterior como si fuera una contraseña temporal. |
| RN-143 | El sistema NO DEBE recuperar ni enviar la contraseña anterior. | RN-245 | CA31-245-01 | Aceptar: La recuperación de ana@example.com envía un enlace, sin la contraseña anterior. Rechazar: Se envía por correo la contraseña anterior de ana@example.com. |
| RN-143 | CUANDO se define o recupera una contraseña, el sistema DEBE exigir una longitud entre 8 y 128 caracteres, ambos extremos incluidos. | RN-246 | CA31-246-01 | Aceptar: Se admiten 'abcdefgh' de 8 caracteres y una contraseña de 128 caracteres. Rechazar: Se admite 'abcdefg' de 7 caracteres o una contraseña de 129. |
| RN-143 | CUANDO se define o recupera una contraseña, el sistema DEBE aceptar cualquier carácter, incluidos espacios y símbolos, sujeto a RN-246 y RN-249. | RN-247 | CA31-247-01 | Aceptar: Se admite 'mi clave larga 2026' de 19 caracteres y 'abcd! ef' de 8. Rechazar: Se rechaza 'abcd! ef' únicamente por contener un espacio o un símbolo. |
| RN-143 | El sistema NO DEBE exigir mayúsculas, números ni símbolos como condiciones de composición de una contraseña. | RN-248 | CA31-248-01 | Aceptar: Se admite 'abcdefgh' de 8 caracteres sin exigir otros tipos de carácter. Rechazar: Se rechaza 'abcdefgh' por no tener número o mayúscula. |
| RN-143 | SI una contraseña está vacía, contiene solo espacios o queda fuera del rango de RN-246, el sistema DEBE rechazarla informando el motivo. | RN-249 | CA31-249-01 | Aceptar: Se rechazan ocho espacios o 'abcde' indicando el motivo de cada rechazo. Rechazar: Se aceptan ocho espacios o se rechaza 'abcde' sin informar el motivo. |
| RN-143 | El sistema NO DEBE truncar, recortar ni normalizar las contraseñas. | RN-250 | CA31-250-01 | Aceptar: La contraseña ' abcdefg ' conserva sus espacios como parte del secreto. Rechazar: Se recorta una contraseña de 200 caracteres a 128 o se aplica TRIM a ' abcdefg '. |
| RN-143 | La validación de contraseñas de RN-246 a RN-250 DEBE aplicarse en el servidor. | RN-251 | CA31-251-01 | Aceptar: Una llamada directa al API con 'abcde' se rechaza aunque omita la interfaz. Rechazar: El API acepta 'abcde' porque solo valida el navegador. |
| RN-143 | La interfaz PUEDE anticipar la validación de contraseña como complemento opcional, sin sustituir la validación obligatoria del servidor de RN-251. | RN-252 | CA31-252-01 | Aceptar: El navegador anticipa que 'abcde' es corta y el servidor también la rechaza en una llamada directa; omitir la anticipación es válido. Rechazar: Se omite la validación del servidor porque el navegador ya comprueba la longitud. |
| RN-143 | SI se rechaza la definición o recuperación de una contraseña, el sistema NO DEBE dejar efectos parciales: se conserva el estado INVITADO o la contraseña anterior, según corresponda, y el enlace no se consume. | RN-253 | CA31-253-01 | Aceptar: Luis introduce 'abcde', sigue INVITADO y puede reintentar con el mismo enlace; una recuperación fallida conserva la contraseña anterior. Rechazar: Rechazar 'abcde' consume el enlace o activa al usuario sin contraseña válida. |
| RN-151 | CUANDO un contacto solicita la eliminación de sus datos personales, la solicitud DEBE atenderse a través de la empresa mediante un procedimiento interno separado del mantenimiento ordinario de contactos. | RN-151 | CA31-151-01 | Aceptar: La solicitud sobre el contacto 42 se deriva a la empresa para evaluación mediante el procedimiento interno. Rechazar: El mantenimiento ordinario considera suficiente tramitar la solicitud como una desactivación. |
| RN-151 | La desactivación de un contacto NO DEBE presentarse como atención de una solicitud de eliminación de datos personales. | RN-254 | CA31-254-01 | Aceptar: Desactivar al contacto 42 conserva sus datos y no marca como atendida su solicitud de eliminación. Rechazar: Se declara atendida la solicitud del contacto 42 únicamente porque quedó DESACTIVADO. |
| RN-151 | La eliminación ordinaria de contactos DEBE limitarse a los casos admitidos por RN-130, sin autorizar el borrado de registros económicos ni suponer la eliminación de todas las copias históricas de datos personales. | RN-255 | CA31-255-01 | Aceptar: El contacto 42 con comprobantes no se borra desde el mantenimiento. Rechazar: Se elimina el pago 1001 para permitir borrar al contacto 42 o se promete borrar todas sus copias por eliminarlo del mantenimiento. |
| RN-151 | El mantenimiento NO DEBE ofrecer seudonimización como estado, acción de usuario ni sustitución automática de datos. | RN-256 | CA31-256-01 | Aceptar: El contacto 42 solo ofrece ACTIVO y DESACTIVADO, sin acción de seudonimización. Rechazar: Se ofrece el estado SEUDONIMIZADO o se sustituyen automáticamente los datos del contacto 42. |
| RN-151 | El procedimiento de solicitudes de eliminación NO DEBE buscar ni sustituir datos personales dentro de textos libres ingresados por el usuario (PRINCIPIO-005, E-010). | RN-257 | CA31-257-01 | Aceptar: La solicitud del contacto 42 no busca ni sustituye datos dentro de comentarios de avisos. Rechazar: El procedimiento recorre el comentario del aviso 501 y sustituye automáticamente nombres. |
| RN-150 | No eliminar registros protegidos durante el contrato vigente | RN-150 (sin modificación) | CA31-150-01 | Aceptar: la empresa con contrato vigente conserva en 2028 pagos de 2026. Rechazar: los elimina automáticamente por antigüedad. Verificar por cada clase protegida: comprobantes, cuotas, pagos, anulaciones, contactos con comprobantes, usuarios e historiales. |

**Variantes de aceptación obligatorias:** los 81 criterios anteriores son bases de trazabilidad. Las variantes siguientes tienen resultados independientes; el criterio solo se acepta cuando todas sus variantes aplicables cumplen. Los sufijos se agregan al ID base, por ejemplo `CA31-011-01.CON-COR`. Una variante que no aplique requiere justificación; no se infiere que esté aprobada por pasar otra. Estas variantes conservan una sola política por regla y hacen explícita su cobertura.

| Criterio base | Sufijos estables y cobertura exigida |
|---|---|
| CA31-011-01 | `CON-COR`, `CON-TEL`, `CON-DIR`, `EMP-RUC`, `EMP-COR`, `USR-COR`: verificar cada campo protegido en su entidad, cuando exista. |
| CA31-189-01 | Sufijo compuesto `<campo>.<copia>`: los campos anteriores y `HIST`, `DEST`, `AUD`, para cada copia persistida aplicable en historiales, destinatarios y auditorías. |
| CA31-190-01 | `SECUENCIAL`, `CONCURRENTE`, `RESTAURACION`: ausencia de repetición de IV con la misma clave en operaciones sucesivas, procesos simultáneos y tras restaurar. |
| CA31-014-01 | `LOG`, `ERROR-TEXTO`, `ERROR-CUERPO`, `EXCEPCION`, `PROMPT`, `FIXTURE`: ausencia de datos reales en cada canal. Repetir con datos directos, objetos completos y textos libres que los contengan. |
| CA31-197-01 | `CONSULTA`, `ENTRADA`, `ERROR`: las fuentes autorizadas separadas del error son válidas; trasladar importes al cuerpo del error es inválido. La ausencia de visualización opcional no incumple este criterio, sin perjuicio de RN-092. |
| CA31-198-01 | `ZONA`, `MEDIANOCHE`: derivación en America/Lima y conservación de la fecha inicial si la consulta termina después del cambio de día. |
| CA31-201-01 | `PANEL`, `REPORTE`, `LISTA`, `AVISO`: misma política de fecha y datos visibles en cada capacidad cuando corresponda a su entrega. |
| CA31-206-01 | `FILAS`, `GRUPOS`, `INDICADORES`, `TOTALES`: el cambio concurrente no se incorpora parcialmente a ninguna sección de la respuesta. |
| CA31-209-01 | `PANEL`, `REPORTE`, `EXPORTACION`: nueva lectura y correspondencia entre todos los componentes y la leyenda, cuando se entregue cada capacidad. |
| CA31-211-01 | `FALLA-EMPRESA`, `FALLA-USUARIO`: ninguno de los dos registros queda persistido, cualquiera que sea el componente que falla. |
| CA31-212-01 | `FECHA`, `SALDO`, `ESTADO`, `TIPO`, `ATRASO`, `APTITUD`: cada dato se vuelve a obtener o calcular al confirmar. |
| CA31-214-01 | `MISMO-GRUPO`, `OTRO-CONTACTO`, `OTRO-TIPO`: agrupar el mismo contacto y tipo; separar los contactos o tipos distintos. |
| CA31-139-01 | `ALTA`, `EDICION`, `DUPLICADOS`, `LOGIN`, `RECUPERACION`: mismo recorte exterior y conversión a minúsculas en todos los flujos aplicables a contactos o usuarios. |
| CA31-216-01 | `PUNTO`, `PLUS`, `ESPACIO-INTERIOR`: no eliminar cada carácter para provocar coincidencias; esto no convierte una dirección sintácticamente inválida en válida. |
| CA31-222-01 | `USUARIO`, `RUC`: comprobar la unicidad global para cada entidad. |
| CA31-225-01 | `CONTACTO`, `USUARIO`, `RUC`: solicitudes simultáneas preservan la unicidad en el ámbito correspondiente. |
| CA31-226-01 | `CONTACTO`, `USUARIO`, `RUC`: repetir la comprobación mientras conviven versiones de referencias. |
| CA31-227-01 | `POSTGRESQL`, `REPOSITORIO`: no custodiar claves en ninguno de esos dos lugares. |
| CA31-230-01 | `SERVICIO`, `PERSONAL`, `ADMINISTRADOR`, `SUPERVISOR`, `OPERADOR`: servicio y personal solo según habilitación expresa; ningún rol de negocio concede acceso. |
| CA31-231-01 | `CIFRADO`, `REFERENCIA`: ambos valores identifican sus respectivas versiones. |
| CA31-232-01 | `ACCESO`, `CAMBIO`: cada clase de operación administrativa queda auditada. |
| CA31-233-01 | `SECRETO`, `DATO-PERSONAL`: la auditoría no incluye ninguna de las dos clases de información. |
| CA31-237-01 | `RESPONSABLE`, `PLAZO`, `LIMITE`: cada parámetro queda definido antes de producción, con los valores ya establecidos en el diseño. |
| CA31-240-01 | `DATOS`, `CLAVES`, `REFERENCIAS`: la recuperación comprueba conjuntamente las tres dependencias. |
| CA31-143-01 | `ALGORITMO`, `SAL`, `COSTO`, `TEXTO-PLANO`, `HASH-RAPIDO`, `REVERSIBLE`: algoritmo de contraseñas, sales individuales y costo registrado; rechazar cada forma de almacenamiento prohibida. |
| CA31-246-01 | `L7`, `L8`, `L128`, `L129`: rechazo de 7 y 129 caracteres; aceptación de 8 y 128, sujetos a las demás reglas. |
| CA31-248-01 | `MAYUSCULA`, `NUMERO`, `SIMBOLO`: la ausencia de cada clase no provoca rechazo. |
| CA31-249-01 | `VACIA`, `SOLO-ESPACIOS`, `CORTA`, `LARGA`: rechazo con motivo en cada caso. |
| CA31-250-01 | `TRUNCAR`, `RECORTAR`, `NORMALIZAR`: no aplicar ninguna transformación al secreto. |
| CA31-253-01 | `ALTA`, `RECUPERACION`: el rechazo conserva respectivamente INVITADO o contraseña anterior; en ambos casos el enlace sigue utilizable. |
| CA31-150-01 | `COMPROBANTE`, `CUOTA`, `PAGO`, `ANULACION`, `CONTACTO-CON-COMPROBANTES`, `USUARIO`, `HISTORIAL`: conservación de cada clase durante el contrato vigente. |

**Verificación documental:** se revisa la cobertura de las obligaciones originales, conservación de cabeceras originales, ausencia de IDs duplicados o referencias inexistentes y presencia de patrón, ejemplo y contraejemplo en las reglas resultantes. Se actualizan las referencias activas del catálogo, alcance, glosario y diseño de seguridad. La matriz identifica 81 criterios: 11 obligaciones principales conservadas, 69 extraídas y RN-150 ya simplificada, con las variantes de cobertura anteriores. Los hallazgos y cierres históricos se conservan como antecedentes, sin recalcular el puntaje de la auditoría.

**Estado:** QA2-31 resuelto y cerrado documentalmente. No se acredita implementación ni ejecución de pruebas de software. QA2-33 seguía abierto en esa revisión y se cerró documentalmente el 2026-11-09. Las decisiones expresamente pendientes ajenas a estos cierres conservan su estado.

---

## Cierre documental de QA2-33 — 2026-11-09

**Decisión del usuario:** asignar DSO a la funcionalidad S5 posterior al MVP y explicitar el comportamiento sin cada Should y las dependencias entre entregas. Se aprueban las precisiones sobre historial, corrección de vencimientos sin S1 e identificación de la funcionalidad S5 frente al supuesto S5.

### Trazabilidad de entrega

| Entrega | Reglas y referencias | Condición |
|---|---|---|
| MVP M1–M6 | RN-071, RN-075, RN-081 a RN-083; alcance §3.1 | Sin promesas, vencimiento efectivo igual al original vigente; cartera, estados, proyección y avisos operativos. Se conservan los registros obligatorios. |
| S1 | RN-033 a RN-036, RN-071 a RN-074, RN-078, RN-080, RN-118 | Reprogramaciones y promesas con todas sus validaciones e historial, sin requerir S4. |
| S3 | PRINCIPIO-008; RN-054 a RN-056, RN-148 | Indicador por contacto; independiente de S1, S4 y S5. Se retira su asociación incorrecta con K8. |
| S4 | RN-050, RN-051, RN-076 a RN-078, RN-144 a RN-146, RN-163 | Reporte y exportaciones; admite entrega sin S1 con reprogramadas en cero y campos de promesa vacíos. |
| Funcionalidad S5 | K8; RN-053, RN-147 | DSO mensual en tarjeta propia, independiente de S1, S3 y S4. El supuesto S5 sigue designando cuotas mensuales. |
| Calidad de cálculos | PRINCIPIO-007; E-012 | Todo cálculo implementado cumple determinismo, casos aprobados y cobertura mínima del 80 % desde su implementación; no se adelanta la entrega funcional. |

### Casos de aceptación documental

Son criterios para la futura implementación; no representan pruebas de software ejecutadas.

| Caso | Escenario | Resultado requerido |
|---|---|---|
| CA33-01 | MVP sin S1: cuota de S/ 500 con vencimiento 2026-11-10 y saldo positivo | PENDIENTE el día 10; VENCIDA con un día de atraso el 11. Estados, cartera, proyección y avisos usan el vencimiento original vigente. No hay creación de promesas. |
| CA33-02 | MVP sin S1: pago parcial y posterior pago total de esa cuota | El parcial reduce saldo sin cambiar vencimiento; el total la cancela. Una anulación que reabre saldo vuelve a clasificarla según su vencimiento original y fecha de cálculo. |
| CA33-03 | MVP: comprobante sin pagos y no anulado cambia su vencimiento mediante edición válida | Se aplica RN-081 y se guarda la auditoría RN-083; la fecha efectiva usa el vencimiento editado. |
| CA33-04 | MVP sin S1: comprobante con pago registrado, incluso si luego se anula | La edición de fecha sigue bloqueada. La corrección exige anular pagos vigentes, anular el comprobante elegible y registrar uno nuevo con sus validaciones. Se conservan original y auditoría. |
| CA33-05 | S1 sin S4: cuota con saldo, vencimiento 2026-11-10, reprogramada válidamente el 2026-11-08 al día 20 | Conserva el vencimiento original, usa el día 20 como efectivo, queda PENDIENTE hasta ese día y VENCIDA el 21 si conserva saldo. Promesa e historial disponibles sin reporte S4. |
| CA33-06 | S1: nueva fecha igual o anterior al vencimiento efectivo, o anterior al día de registro | Se rechaza conforme a RN-080 y RN-118. Una entrega posterior no vuelve opcionales estas validaciones. |
| CA33-07 | S4 sin S1: consulta y exportación CSV y Excel | Reprogramadas sin filas y resúmenes cero por moneda; marca falsa, campos de promesa vacíos y vencimiento efectivo igual al original vigente. Los otros grupos, columnas e historial cumplen su contrato. |
| CA33-08 | MVP sin S3, S4 ni S5 | Panel y listado M4 disponibles, sin puntaje de comportamiento, reporte S4, exportaciones CSV/Excel ni tarjeta DSO. Una cuota futura fuera del gráfico sigue disponible para avisar conforme a RN-075. |
| CA33-09 | S3 sin S1: contacto con tres pagos a tiempo y sin cuotas vencidas con saldo | Indicador 100, «Buen pagador», conforme a RN-055 y RN-148, sin exigir promesas. |
| CA33-10 | S5 sin S1, S3 ni S4: octubre tiene dos comprobantes elegibles con 30 y 45 días hasta cobro total | DSO 37.50 días para todos los roles; al abrir el 2026-11-06 se selecciona octubre. Cambiar moneda no altera el DSO; un mes sin elegibles muestra «Sin datos». |
| CA33-11 | S1 o S4 incorpora la vista de historial después del MVP | Incluye los registros previos de pagos, anulaciones y ediciones; calcula las transiciones derivadas según RN-078. La entrega de la otra capacidad reutiliza la vista. |
| CA33-12 | Se implementa un cálculo de DSO o indicador antes de publicar la funcionalidad | Ya cumple casos de referencia aprobados, determinismo y cobertura mínima del 80 %; la publicación posterior no difiere esos controles. No se exigen módulos no implementados para aceptar el MVP. |

**Verificación documental:** alcance, reglas, constitución y glosario alineados; referencias RN e identificadores revisados. Se conserva el hallazgo original como antecedente y se contextualizan las menciones históricas a su estado pendiente.

**Estado:** QA2-33 resuelto y cerrado documentalmente. Se mantienen M1–M6 como MVP y S1, S3, S4 y S5 como entregas posteriores. No se acredita implementación ni ejecución de pruebas de software ni se recalcula el puntaje histórico. Las decisiones pendientes ajenas a este hallazgo conservan su estado.

## Cierre documental de QA2-34 — 2026-11-09

**Decisión del usuario:** cerrar el hallazgo sin cambios en el spec pack. El framework BMAD, cuyos roles se usan en la elaboración de este pack, no exige planificar fechas ni fijar metas técnicas en los documentos de producto. Estos temas se tratarán más adelante.

| Tema del hallazgo | Tratamiento |
|---|---|
| Responsables y fechas de las preguntas 26, 31, 35 a 37, 39, 41 y 42 | Siguen en `05-preguntas-abiertas.md` con su estado actual. No se fijan fechas. |
| Evidencia de aprobación de casos de referencia | Se mantiene PRINCIPIO-007; su mecanismo de registro se definirá al preparar la implementación. |
| Tipo de cobertura (líneas, ramas u otros) y herramienta de accesibilidad | Se concretan en la arquitectura y el diseño de pruebas. Siguen vigentes el 80 % en módulos de dominio y WCAG 2.2 nivel AA (E-006). |
| Carga y tiempos objetivo | Se definen en la arquitectura y la evaluación de requisitos no funcionales, a partir del supuesto S7. |
| Operación local, dominio remitente y controles operativos | Siguen pendientes en las preguntas 26, 39, 41 y 42 y en las dependencias D2 y D8. |
| Criterios de salida por etapa (construcción, piloto, producción) | Se cubren con los controles de preparación para implementar y de QA por historia de BMAD, cuando corresponda. |

**Estado:** QA2-34 cerrado documentalmente por diferimiento. No se modifican la constitución, el alcance, las reglas ni el glosario. Las decisiones pendientes no se dan por resueltas ni autorizan a asumir respuestas durante la implementación. Se conserva el hallazgo original como antecedente y no se recalcula el puntaje histórico.
