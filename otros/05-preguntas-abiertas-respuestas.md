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
