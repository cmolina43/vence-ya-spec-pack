> **Actualización (2026-11-10, E-014; M-10):** las menciones históricas de aprobación pendiente de casos de referencia, incluidas QA-10 y QA-11, quedan sustituidas por pruebas automáticas con entradas y resultados esperados trazables a las reglas de negocio. No se requiere aprobación humana específica de esos casos. La aceptación humana se realiza sobre el aplicativo por historia o entrega; PRINCIPIO-012 sigue vigente. Esta actualización no acredita ejecución de pruebas ni aceptación funcional. Las respuestas anteriores se conservan como antecedentes.

## Crédito y cuotas

1. **Número de cuotas:** ¿el usuario elige cuántas cuotas tiene un comprobante, o el sistema lo propone? (RN-015)
el usuario elige
2. **Redondeo:** cuando el total no se divide exacto, ¿qué cuota absorbe la diferencia de céntimos? Ejemplo: S/ 1 000,00 en 3 cuotas. (RN-016)
la ultima cuota
3. **Cambios después de confirmar:** ¿se puede cambiar una cuota después de confirmar el comprobante, o solo con una reprogramación? (RN-017, RN-018)
si se puede cambiar
> **Precisada (2026-11-05, auditoría QA C-01):** modelo mixto. El comprobante se edita mientras no tenga pagos (incluidos los anulados) ni reprogramaciones. Después, las fechas se corrigen por reprogramación y el resto anulando pagos y comprobante para volver a registrarlo. Se pueden editar todos los campos. (RN-017, RN-018, RN-081 a RN-083)
4. **Definición de "confirmar":** ¿qué acción vuelve definitivo un comprobante, una cuota o un pago? (Glosario, término 20)
cuando el comprobante es pagado en su totalidad, es decir el credito destinado del comprobante ha sido cancelado en su totalidad.
> **Reemplazada (2026-11-05, auditoría QA C-01):** no hay confirmación de comprobantes ni rol que confirme. Al guardar el crédito, el comprobante ya admite pagos, reprogramaciones y anulación. Solo el SUPERVISOR o el ADMINISTRADOR pueden anular. Un comprobante anulado libera su número de documento (C-05). Los pagos se confirman al registrarlos, y "pago confirmado" equivale a "pago registrado", sin enmendar la constitución. (RN-003, RN-063, glosario #20; RN-064 retirada)
5. **Comprobante sin cuotas:** la regla RN-057 asume que un comprobante sin cuotas tiene una única cuota por el total. ¿Es correcto? (RN-057)
asi es, el usuario puede seleccionar el pago en cuotas o pago unico

## Pagos

6. **Sobrepago:** ¿un pago puede superar el saldo de la cuota? (no definido; no hay regla)
no debe superar, no debe haber sobrepago.
> **Precisada (2026-11-05, auditoría QA C-04):** el pago se valida contra el saldo vigente de la cuota, de modo que la suma de pagos no anulados nunca supera su importe. Un pago igual al saldo se acepta; el cero y los negativos se rechazan. La amortización del crédito queda fuera de alcance (O14). (RN-024, RN-092)
7. **Promesa de pago:** ¿cuándo deja de estar activa? ¿Al cumplirse, al vencer la fecha prometida, o al registrar otra reprogramación? (RN-036)

## Notificaciones

8. **Plazo de aviso:** ¿con cuántos días de anticipación se envía el aviso de vencimiento? Este valor define RN-040 y afecta M5 y C3. (RN-040)
con 3 dias de anticipacion
> **Reemplazada (2026-11-05, auditoría QA A-03):** el aviso es manual; no hay plazo de anticipación que dispare envíos. La lista de cuotas por avisar usa el plazo de "por vencer" de RN-075. (RN-065 retirada, RN-112)
9. **Contacto sin correo:** ¿el correo del contacto es obligatorio al registrarlo? (RN-044)
si debe ser obligatorio
10. **Fallo de envío:** ¿qué pasa si el proveedor de correo no entrega el aviso? ¿Se reintenta, y cuántas veces? (no definido)
que me recomiendas, como se maneja este tema?
> **Reemplazada (2026-11-05, auditoría QA A-03):** con el aviso manual no hay reintentos automáticos. Un envío fallido queda como "no entregado" y el usuario puede reenviarlo. (RN-066, RN-067; RN-068 retirada)
> **Actualizada (2026-11-10, M-05):** el usuario decide que también el tiempo de espera se trate como «No Enviado» y permita otro intento manual, sin verificación ni espera adicional. Sustituye la parte de avisos del cierre QA2-06 del 2026-11-07; véase el registro M-05 al final. «No Enviado» es un resultado de la aplicación, no un estado de entrega al destinatario.

## Fechas y panel

11. **Zona horaria:** ¿la fecha de cálculo se toma en America/Lima? 
la zona horaria es America/Lima
12. **Agrupación de los 7 días:** ¿el panel agrupa por cada día, o por un rango que define la empresa? (RN-048)
que me recomiendas? la idea es mostrar esta informacion de manera grafica, como un visor de vencimientos totalizados agrupados por dias

## Usuarios y roles

13. **Permisos por rol:** ¿qué pantallas y acciones tiene el rol OPERADOR? Ya están definidos los permisos de ADMINISTRADOR (todos) y SUPERVISOR (anular pagos confirmados) en RN-058 a RN-060.
El operador son todas las opciones, excepto el de anular pagos
14. **Creación de usuarios:** ¿quién puede crear usuarios dentro de una empresa: solo el ADMINISTRADOR
15. **Varios roles:** ¿un usuario puede tener más de un rol a la vez? (RN-010): No

**Decidido:** las promesas de pago activas son visibles para todos los roles de la empresa (RN-036). Los paneles de cartera (RN-046 a RN-048) no se restringen a un rol.

**Decidido:** los roles son ADMINISTRADOR (todos los permisos), OPERADOR y SUPERVISOR (puede anular pagos confirmados). Reemplazan a DUEÑO, COBRANZAS, PAGOS y CONTADOR (RN-010, RN-058 a RN-060).

## Reportes

18. **DSO:** decimales respondidos (dos, RN-053). El DSO salió del reporte de vencimientos (S4). Pendiente: ¿en qué pantalla se muestra para medir K8 y su periodo filtra por fecha de emisión o por fecha de cobro total? (RN-053)
> **Resuelta (2026-11-06):** el periodo filtra por fecha de cobro total, por mes calendario (inicia en el último mes completo). Solo cuentas por cobrar. Se muestra en una tarjeta propia del panel de cartera, visible para todos los roles e independiente del selector de moneda. (RN-053, RN-147, RN-069)

## Roles (nuevas)

21. **Roles anteriores:** ¿COBRANZAS, PAGOS y CONTADOR desaparecen, o alguno corresponde a OPERADOR o SUPERVISOR? (RN-010; el alcance M6 ya usa los roles nuevos)
los roles anteriores ya no deben existir, solo tenemos los roles "ADMINISTRADOR", "SUPERVISOR" y "OPERADOR"
22. **Alcance del OPERADOR:** ¿puede registrar cobros y pagos de cuentas por cobrar y por pagar, o solo de uno de los dos tipos? (RN-035)
si puede hacer estas operaciones
23. **Exportaciones y reporte:** ¿qué roles pueden ver y exportar el reporte de vencimientos, en CSV o Excel? Las reglas RN-050, RN-051 y RN-077 hoy dicen "un usuario". (RN-050, RN-051, RN-076, RN-077)
el supervisor y el administrador.
Aclaración (2026-11-06): el supervisor y el administrador pueden exportar el reporte. Todos los roles, incluido el operador, pueden verlo en pantalla.

## Reprogramaciones (nuevas)

24. **Aviso tras reprogramar:** RN-040 y RN-045 asumen que una cuota reprogramada recibe un nuevo aviso para su fecha de promesa, aunque ya haya recibido uno para la fecha original. ¿Es correcto? (RN-040, RN-045)
si es correcto, las reprogramaciones tambien deben ser notificadas.
> **Precisada (2026-11-05, auditoría QA A-03):** el aviso es manual. Tras una reprogramación cambia la fecha efectiva y la cuota vuelve a poder avisarse sin advertencia de duplicado. (RN-040 retirada, RN-045, RN-112)
25. **Fecha mínima de una reprogramación:** ¿la nueva fecha puede ser anterior o igual al vencimiento pactado? (RN-080)
no. Una reprogramación solo es válida si la nueva fecha es posterior al vencimiento pactado; no se puede adelantar el plazo (ej.: vence a 30 días, el día 25 no se puede reprogramar al día 27). Si la cuota ya tiene una promesa, la nueva fecha debe ser posterior a la promesa vigente. Una fecha igual también se rechaza.

## Indicador de comportamiento de pago

16. **Fórmula:** ¿cómo se calcula el indicador a partir de los últimos 12 pagos? (RN-055)
me puedes proponer una formula, para ello analiza el proyecto antes de proponer la formula.
> **Resuelta (2026-11-06):** solo cuentas por cobrar. Cada pago recibe un puntaje según sus días de atraso respecto de la fecha de vencimiento original: 100 (0 días), 75 (1 a 7), 50 (8 a 30), 25 (31 a 60), 0 (más de 60). El indicador es el promedio simple, redondeado a entero (0 a 100), con etiquetas "Buen pagador" (80 a 100), "Regular" (50 a 79) y "Riesgoso" (0 a 49); con menos de 3 elementos, "Sin historial suficiente". (RN-055, RN-148)
17. **Cuotas sin pagos:** ¿las cuotas sin ningún pago cuentan igual que las pagadas? (RN-055)
no entiendo
> **Resuelta (2026-11-06):** cada cuota VENCIDA con saldo cuenta como un elemento más del promedio, con atraso medido hasta la fecha de cálculo, para que un cliente que deja de pagar no conserve un buen indicador. El resultado es reproducible con el mismo histórico y la misma fecha de cálculo. (RN-055, RN-056, RN-148)

## Seguridad, privacidad y operación

**Decidido (2026-11-06):** el proyecto admite dos modalidades de instalación. En la modalidad local (on-premise), la base de datos, el backend y el frontend se instalan en el servidor de la empresa. En la nube, el backend y el frontend van en Railway, la base de datos en Neon, y Railway custodia los secretos. (E-007; alcance D7 y D8)

20. **Región y rol de VenceYa:**
usa el nuevo reglamento
> **Precisada (2026-11-06):** se cita el D.S. 016-2024-JUS como reglamento vigente de la Ley 29733. La región y el rol siguen pendientes y la pregunta se reformuló según las dos modalidades.

si segun lo que viste en su documentacion, cambia las regiones acorde a lo que revisaste
> **Precisada (2026-11-06):** la base de datos queda en la misma zona que el backend para limitar la latencia: Railway en US East (Virginia), Neon en AWS `us-east-1` y Resend en `us-east-1`. Solo queda pendiente el rol de VenceYa. (alcance D1, D2 y D7)

si, ciérrala con tu propuesta
> **Resuelta (2026-11-06):** el rol se adopta como decisión provisional sujeta a la revisión legal de la pregunta 31. En la nube, VenceYa es encargado del tratamiento de los datos de los contactos de cada empresa y responsable de los datos de sus propios usuarios. En la modalidad local es encargado solo si accede a los datos para dar soporte (pregunta 42). (alcance D5)
21. **Bloqueo tras cinco intentos fallidos:**
aplica segun lo recomendado
> **Resuelta (2026-11-06):** bloqueo de 15 minutos con desbloqueo automático; el contador se reinicia con un acceso correcto, y la recuperación de contraseña desbloquea la cuenta. Solo el personal operativo configura el periodo, y la respuesta no revela si la cuenta existe. (RN-103)
26. **Custodia de claves:**
el backend en produccion va correr en railway
> **Resuelta en parte (2026-11-06):** en la nube, las claves se guardan en las variables de entorno de Railway, separadas por entorno y propósito. La rotación es como máximo cada 12 meses, el IV es aleatorio de 96 bits con un límite de 2³² cifrados por versión de clave, y la retención de respaldos sigue la ventana de Neon. Quedan pendientes el responsable, el procedimiento de incidentes y la auditoría en Railway; la modalidad local pasa a la pregunta 41. (`06-diseno-seguridad-datos.md`)
27. **Duración de la sesión:**
aplica segun lo recomendado
> **Resuelta (2026-11-06):** cierre tras 30 minutos sin actividad y duración máxima de 12 horas. (RN-149)
28. **Retención y eliminación:**
aplica segun lo recomendado
> **Resuelta (2026-11-06):** no hay depuración automática durante el contrato. En la nube, al terminar el contrato se entrega una exportación y los datos se eliminan dentro de 30 días; los respaldos caducan con su ventana. Las solicitudes de eliminación se atienden a través de la empresa y se resuelven seudonimizando al contacto, sin tocar los pagos. (RN-150, RN-151)
> **Actualización posterior (2026-11-08, QA2-12; E-011):** la entrega de exportación por VenceYa queda retirada. La empresa exporta y conserva los históricos disponibles mediante las funciones existentes antes de la terminación efectiva y del bloqueo de acceso. La baja se ejecuta dentro de los 30 días siguientes a la terminación, haya exportado o no, sin constancia de entrega. Esta nota sustituye solo lo relativo a exportación de la respuesta histórica; el tratamiento vigente de solicitudes de eliminación se consulta en RN-151 y QA2-10.
32. **Proveedor de correo:**
se usara Resend para el envio de correos
> **Resuelta (2026-11-06):** Resend, con webhooks de entrega y rebote para el estado por destinatario. El dominio remitente pasa a la pregunta 39. (alcance D2)
> **Actualizada (2026-11-06, decisión QA2-05):** se mantiene Resend como proveedor, pero el MVP deja de procesar webhooks de entrega y rebote. «Enviado» indica aceptación de la solicitud por Resend, sin seguimiento de entrega por destinatario. El dominio remitente sigue en la pregunta 39. (alcance M5 y D2; RN-137)
33. **Cuenta de correo de prueba:**
aplica segun tu recomendacion
> **Resuelta (2026-11-06):** buzón dedicado del proyecto, no personal. El código bloquea cualquier otro destinatario. (RN-013; glosario #33 y #39)
34. **Repositorio y CI:**
aplica segun tu recomendacion
> **Resuelta (2026-11-06):** GitHub con protección de la rama principal, aprobación humana obligatoria y gitleaks en GitHub Actions. (alcance D4)

## Revisión de la decisión sobre contactos — QA2-10 (2026-11-07)

Decisión del usuario: se adopta la eliminación ordinaria solo para contactos sin comprobantes, con confirmación y liberación del correo. Los contactos con comprobantes, incluidos los anulados, solo se editan, desactivan o reactivan. Se mantienen únicamente ACTIVO y DESACTIVADO; la desactivación conserva los datos, la reserva del correo y la posibilidad de avisar cuotas aptas. Esta decisión sustituye la seudonimización prevista en la respuesta histórica de la pregunta 28 y la versión anterior de RN-151. Las solicitudes de eliminación de datos personales quedan separadas del mantenimiento, con procedimiento interno pendiente en la pregunta 31.

## Permisos y sesiones — QA2-15 (2026-11-07)

40. **Cambio de rol:** ¿se cierran las sesiones abiertas de un usuario cuando un ADMINISTRADOR le cambia el rol?
> **Resuelta por decisión del usuario:** sí, al guardar cualquier cambio efectivo de rol, tanto al aumentar como al reducir permisos, se cierran todas las sesiones del usuario afectado en todos sus dispositivos y pestañas. Debe iniciar sesión de nuevo con el rol vigente. El cambio de rol, la invalidación y la auditoría son una sola operación; si el cambio se confirma antes que una operación pendiente de la sesión anterior, esta se rechaza sin efectos de negocio. Si la operación se completó antes, se conserva. Se protege al último administrador activo. Guardar el mismo rol no genera este cierre. (RN-100, RN-149, RN-160 y RN-161)

**Precisada la decisión histórica de permisos (preguntas 13 y 23):** la matriz de RN-060 sustituye las expresiones «todos los permisos» o «todas las opciones» como autorización genérica. Todos los roles operan dentro de su empresa y bajo las validaciones de negocio; OPERADOR no anula ni exporta, SUPERVISOR y ADMINISTRADOR sí pueden hacerlo sobre operaciones elegibles. Solo ADMINISTRADOR administra usuarios, roles y configuración de empresa. Moneda y ventana personales son propias, y los roles de negocio no conceden acceso a claves. Las funcionalidades Should conservan su alcance de entrega.

## Redondeo del DSO — QA-10 (2026-11-09)

49. **Método de redondeo del DSO a dos decimales:**
> **Resuelta por decisión del usuario:** redondeo al más cercano con empates hacia arriba (ROUND_HALF_UP), aplicado una sola vez al promedio final desde la suma exacta de días dividida entre la cantidad de comprobantes elegibles, sin redondeos intermedios (RN-053, RN-147; glosario #35; HU-012).

**Casos de referencia propuestos, pendientes de aprobación según PRINCIPIO-007:** 92 / 3 → 30.67; 91 / 3 → 30.33; 245 / 8 = 30.625 → 30.63; 75 / 2 → 37.50; 0 / 1 → 0.00. Sin comprobantes elegibles: «Sin datos». La decisión del método no equivale a aprobar estos casos ni a acreditar pruebas ejecutadas. La pregunta 50 sobre meses seleccionables permanece abierta.
## Falla en el envío de la invitación — QA-08 (2026-11-09)

47. **Qué ocurre si falla el envío del correo de invitación (QA-08):**
> **Resuelta por decisión del usuario:** no se revierte la creación. El usuario (o el primer administrador con su empresa) queda INVITADO con su enlace vigente, la pantalla informa que el correo no se envió o no se pudo confirmar, y el reenvío es solo manual, sin reintentos automáticos. El reenvío genera un enlace nuevo de 72 horas y revoca el anterior; para el primer administrador lo hace el equipo de VenceYa (RN-095). El intento fallido se audita sin registrar el enlace. RN-211 no aplica a este fallo (RN-098; HU-001, HU-003).

48. **Estado al reactivar un usuario DESACTIVADO (QA-09):**
> **Resuelta con la regla vigente de RN-098:** un usuario que ya definió su contraseña vuelve directamente a ACTIVO con ella, sin enlace ni correo. Uno que nunca la definió pasa a INVITADO y recibe un enlace nuevo de 72 horas; no puede quedar ACTIVO sin contraseña. Solo un ADMINISTRADOR reactiva. HU-003 incorpora los dos criterios.

## Denominación, alcance y meses del indicador S5 (2026-11-09)

50. **Meses seleccionables (QA-11), resuelta por decisión del usuario:** se admiten meses anteriores y el mes actual, con el último mes completo seleccionado al abrir. El actual muestra «Mes en curso — datos parciales», incluso sin datos. Los futuros se impiden en pantalla y se rechazan en el backend. La fecha de cálculo usa America/Lima; meses sin comprobantes elegibles muestran «Sin datos». Los resultados usan el corte coherente de la consulta y los meses terminados pueden cambiar por pagos registrados posteriormente o anulaciones (RN-088, RN-147, RN-198, RN-205, RN-206; HU-012).

**Denominación y alcance aprobados:** se conserva el promedio simple global por empresa bajo el nombre «Tiempo promedio de cobro de comprobantes saldados», sin ponderación por importe. Complementa los indicadores de cartera; las deudas aún pendientes no participan y una reducción no demuestra por sí sola mejora de cobranza. La consulta, filtro o desglose por cliente o proveedor y el DSO financiero quedan fuera del proyecto. Se mantiene S5 como Should posterior al MVP. Esta decisión sustituye la denominación DSO y el estado pendiente de la pregunta 50 en respuestas históricas; no modifica la fórmula ni el redondeo ya decidido. Los casos de referencia continúan sujetos a aprobación según PRINCIPIO-007.
## Razón social de la empresa — QA-06 (2026-11-09)

45. **Formato de la razón social al dar de alta la empresa (QA-06):**
> **Resuelta por decisión del usuario:** la razón social sigue el mismo formato que el nombre del contacto. Es obligatoria y se valida en el servidor con el procedimiento de RN-162: TRIM, conversión a mayúsculas, espacios internos reducidos a uno, de 1 a 250 caracteres sobre el valor normalizado, con letras (incluidas tildes, ñ y ü), dígitos, espacios y los signos «.», «,», «&», «-», «'», «(», «)» y «/», y al menos una letra. No se trunca ni se corrige en silencio. No es única ni se coteja con el RUC ni con SUNAT (RN-005, RN-096). Si se rechaza, no se crean la empresa ni su primer administrador (RN-211). La misma validación aplica a cualquier modificación del dato que se habilite, sin decidir aquí quién puede modificarla. Las comillas dobles no se admiten. Se acepta que la razón social aparezca en mayúsculas en los avisos. Cuando corresponde al nombre de una persona natural con negocio, se trata como dato personal según RN-014 y se incorpora a la revisión legal de la pregunta 31; no se agrega a los campos cifrados de RN-011 (RN-094, RN-162; glosario #49; HU-001).

## Motivo de anulación — QA-03 (2026-11-09)

44. **Validación del motivo de anulación de pago o de comprobante (QA-03):**
> **Resuelta por decisión del usuario:** el motivo se valida en el servidor con el procedimiento de RN-162: TRIM, conversión a mayúsculas como los demás campos de texto, obligatorio y de 1 a 500 caracteres sobre el valor normalizado. El TRIM quita también tabulaciones, saltos de línea y espacios no separables, de modo que un motivo de solo espacios se trata como vacío y se rechaza. Los espacios internos se conservan y no hay otra restricción de caracteres ni se exige al menos una letra. No se trunca ni se corrige en silencio, y el mensaje de rechazo no repite el texto ingresado (RN-014). Como la anulación es inmutable (RN-029), el motivo solo se valida al crearla. Aplica igual a la anulación de pagos y de comprobantes (RN-030, RN-061, RN-162; glosario #22; HU-007).

## Reenvío de la invitación del primer administrador — QA-07 (2026-11-09)

46. **Cuándo puede VenceYa reenviar la invitación del primer administrador y qué ocurre si está DESACTIVADO:**
> **Resuelta por decisión del usuario:** el equipo de VenceYa solo puede reenviar manualmente la invitación del primer administrador cuando se cumplen ambas condiciones: sigue INVITADO y la empresa no tiene ningún ADMINISTRADOR ACTIVO. Se comprueban al ejecutar el reenvío. Puede reenviarse aunque el enlace no haya vencido; cada reenvío emite un enlace nuevo de 72 horas, revoca el anterior y queda auditado sin registrar el enlace. Un usuario ACTIVO utiliza recuperación de contraseña si la olvidó. El reenvío nunca reactiva a un DESACTIVADO. Si existe otro ADMINISTRADOR ACTIVO, la gestión de invitaciones y reactivaciones corresponde a los administradores de la empresa mediante HU-003: quien ya definió contraseña vuelve a ACTIVO con ella, sin invitación; quien nunca la definió pasa a INVITADO con enlace nuevo. Si el primer administrador está DESACTIVADO y no existe ningún ADMINISTRADOR ACTIVO, se rechaza el reenvío y se trata como incidencia para revisión interna, sin reactivación automática. Este estado no debe surgir mediante los flujos normales, porque la desactivación requiere un administrador activo y RN-100 protege al último administrador activo. No se incorpora un mecanismo de recuperación administrativa excepcional como parte del reenvío (RN-095, RN-098, RN-099, RN-100, RN-160; HU-001, HU-003).

## Límite exacto de los enlaces — QA-01 (2026-11-09)

43. **¿Es válido un enlace de invitación usado a las 72:00:00 exactas, o uno de recuperación a los 60:00 minutos exactos (QA-01)?**
> **Resuelta por decisión del usuario:** no. El límite es exclusivo, con el mismo criterio que el bloqueo (RN-103) y la sesión (RN-149): el enlace es válido mientras no se haya cumplido el plazo y está vencido desde el instante exacto en que se cumple. El plazo se mide con el reloj del servidor desde la emisión del enlace (cuando se genera y registra, no cuando llega el correo). La vigencia se comprueba al canjear el enlace, cuando el servidor recibe la contraseña, y no solo al abrirlo; no se aplica margen de tolerancia de reloj porque emisión y canje usan el mismo reloj. Se sigue la práctica habitual de tokens con vencimiento (por ejemplo, el claim `exp` de RFC 7519: no se acepta en o después del vencimiento). Casos de referencia: invitación emitida a las 10:00:00 del día 1 → aceptada el día 4 a las 09:59:59 y rechazada a las 10:00:00; recuperación emitida a las 08:00:00 → aceptada a las 08:59:59 y rechazada a las 09:00:00 (RN-098, RN-102; HU-002).

## Solicitudes formales de eliminación de datos personales — M-11 (2026-11-10)

31. **Resolución parcial por decisión del usuario: alcance funcional y gestión interna.**
> Las solicitudes formales de eliminación de datos personales son gestionadas internamente por el equipo de VenceYa, en coordinación con la empresa cliente, fuera del alcance funcional de la aplicación y del backlog de desarrollo. RN-151 y RN-257 mantienen su prioridad MUST como obligaciones operativas; no requieren HU, pantalla, endpoint, componente ni tarea técnica. Una automatización posterior sería un requerimiento nuevo.

El mantenimiento ordinario conserva sus reglas: un contacto puede vincularse a varios comprobantes de su empresa; desactivarlo impide seleccionarlo para nuevos comprobantes, conserva sus datos y relaciones, y no impide avisar sus cuotas pendientes elegibles. La eliminación física solo se admite sin comprobantes, incluidos los anulados, con confirmación y liberación del correo (RN-127, RN-130). Desactivar no acredita atención de una solicitud formal (RN-254).

Se mantiene PRINCIPIO-005, E-010 y RN-257: quien ingresa textos libres responde por su contenido; el procedimiento no busca ni sustituye datos personales dentro de esos textos. Esta decisión no autoriza borrar registros económicos ni introduce una excepción a su conservación.

La pregunta 31 permanece abierta por la definición operativa y revisión legal previas al lanzamiento, incluidos sus demás asuntos (datos tratados, proveedores, roles y flujo transfronterizo). Se asigna la gestión al equipo de VenceYa, sin designar ahora una persona concreta ni una fecha calendario como condición para cerrar M-11. Las designaciones de ejecución siguen pendientes. M-11 se cierra documentalmente respecto de la cobertura del backlog; no se acredita el procedimiento como operativo, cumplimiento legal ni autorización de lanzamiento. La pregunta 51 y M-09 sobre historiales del contacto eliminado se resolvieron después (ver más abajo).

### Pregunta 51 (QA-13; M-09), resuelta el 2026-11-10

Decisión del usuario (opción B): al eliminar un contacto sin comprobantes se retiran el registro, el correo cifrado y sus referencias de búsqueda; el historial de ediciones del contacto se conserva sin cambios y cifrado, y no se vincula a un contacto nuevo que reutilice el correo. Se descartaron borrar el historial y conservarlo sin datos personales: RN-255 ya establece que la eliminación ordinaria no supone eliminar todas las copias históricas de datos personales, y esas copias se atienden con el procedimiento interno de RN-151 (pregunta 31).

## Simplificación de los fallos de avisos — M-05 (2026-11-10)

**Decisión explícita del usuario:** «si el proceso agota el tiempo de espera, entonces es como si no se hubiera enviado». El usuario autorizó aplicar la propuesta de simplificación documental.

- El plazo del intento pertenece al servidor y es de 10 s desde su creación. La respuesta exitosa registrada produce ENVIADO; rechazo, error o vencimiento sin éxito registrado producen NO_ENVIADO, con su motivo y el historial conservado.
- El listado muestra «No Enviado» y «Enviar aviso» cuando no hay un envío exitoso para el tipo y vencimiento vigentes. Un intento fallido posterior no borra un éxito previo ni su fecha.
- Cada intento nuevo lo inicia el usuario, con datos y destinatarios vigentes, nueva clave y exclusión de cuotas no aptas (RN-155). Si ninguna es apta, 422 SIN_CUOTAS_APTAS sin correo ni intento.
- Se retiran RN-159, «Verificar envío», NO_VERIFICABLE, la espera de 24 horas, la advertencia adicional y el endpoint de verificación. Se mantiene el bloqueo contra envíos simultáneos únicamente mientras el plazo del intento EN_PROCESO sigue vigente. Una caída o una respuesta tardía no prolonga ese bloqueo.
- Un tiempo de espera no permite asegurar que el proveedor no recibiera la solicitud; un intento manual posterior puede repetir ese correo. La aplicación adopta «No Enviado» como resultado funcional sin agregar comprobaciones ni pasos al usuario.
- La simplificación corresponde a avisos. El puerto compartido conserva diagnósticos para invitaciones; no se cambia su flujo ni el de pagos.

Se actualizan 02-alcance.md, 03-reglas-de-negocio.md, 04-glosario.md, 05-preguntas-abiertas.md, 06-user-stories.md, 07-architecture.md, 07-openapi.yaml y 08-backlog.md. M-05 se cierra documentalmente en 08-backlog-reporte.md; la parte de avisos de QA2-06 se conserva como antecedente sustituido. No se acredita implementación ni ejecución de pruebas funcionales.
