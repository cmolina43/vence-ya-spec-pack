# 06 - Historias de Usuario de VenceYa

**Fase BMAD:** planificación — Agente PO.
**País de operación:** Perú. **Zona horaria de negocio:** America/Lima.
**Fuentes (Spec Pack v0.2):** `02-alcance.md` y `03-reglas-de-negocio.md` (en función de PRD), `00-constitucion.md`, `01-project-brief.md` (beneficios y KPI) y `04-glosario.md` (terminología).
**Fecha:** 2026-11-09.
**Revisión QA [NUEVO]:** Agente QA Funcional, 2026-11-09 (`06-user-stories-qa.xml`). Los criterios agregados se marcan con [NUEVO] y, entre paréntesis, su tipo de escenario (positivo, negativo o borde). Los hallazgos están en «Revisión QA» y las propuestas, en «HUs sugeridas», al final del documento. [NUEVO] Segunda pasada QA el 2026-11-09, con las mismas convenciones: corrige datos desactualizados de la revisión y agrega escenarios de aislamiento, concurrencia y falla técnica.

---

## Criterios de esta versión

- **Enfoque (decisión del usuario, opción b):** 10 HUs Must que cubren el MVP completo (M1 a M6) y 3 HUs Should (HU-011, HU-012 y HU-017). Total: 13 HUs aprobadas. Decisión M-06 del usuario (2026-11-10): se aprueba HU-017 como historial compartido de S1 y S4, sin incorporar el resto de S4 ni adelantarlo al MVP.
- **Prioridad:** MoSCoW según `02-alcance.md`. No se incluyen HUs *Won't*: lo que está fuera de alcance (O1 a O19) no genera historias.
- **Trazabilidad:** cada HU indica su funcionalidad de alcance (M/S) y las reglas RN que la sustentan. Las HUs Must se trazan a reglas MUST.
- **Convenciones de los criterios:**
  - Importes en formato numérico peruano: «S/ 1,000.00», «US$ 3,000.00» (punto decimal, coma de miles obligatoria desde 1,000; RN-153).
  - Fechas de negocio en ISO 8601 (AAAA-MM-DD), como el catálogo de reglas; la leyenda de corte se muestra «Datos al DD/MM/AAAA, HH:mm».
  - «Fecha de cálculo» es la fecha actual en America/Lima que el sistema provee (RN-198); en los criterios se fija para que sean reproducibles.
  - Todos los datos de ejemplo son ficticios y usan dominios `.example` (PRINCIPIO-005, RN-194).
- **Roles:** ADMINISTRADOR, SUPERVISOR y OPERADOR (RN-010, matriz RN-060). El alta de empresas la hace el **equipo de VenceYa** (RN-095).

### Requisitos transversales (aplican a todas las HUs)

No se redactan como HUs porque no son capacidades que un usuario solicite, sino condiciones de la *Definition of Done* de cada historia:

| Requisito | Reglas / principios |
|---|---|
| Aislamiento por empresa: toda consulta filtra por la empresa del usuario autenticado; un registro de otra empresa responde HTTP 404 igual que uno inexistente. | PRINCIPIO-003; RN-007, RN-008, RN-052 |
| Protección de datos (E-015): TLS, contraseñas con hash, tokens de invitación y recuperación guardados solo como hash, secretos fuera de la base y del repositorio, sin cifrado por campo; unicidad de correo y RUC con índices únicos sobre el valor normalizado. | PRINCIPIO-004; RN-139 a RN-141, RN-143, RN-216 a RN-218, RN-221, RN-222, RN-225, RN-227, RN-228, RN-230, RN-240, RN-262 |
| Trazabilidad de accesos (art. 46 del D.S. 016-2024-JUS): inicio y cierre de sesión y cada consulta, alta, edición, anulación, eliminación o exportación de datos personales generan un registro sin datos personales, conservado al menos dos años; si el registro falla, la operación no se completa. | PRINCIPIO-005; RN-263 a RN-266 |
| Sin datos personales en logs, errores, prompts ni fixtures; diagnóstico con eventos, IDs y códigos. | PRINCIPIO-005; RN-014, RN-193 a RN-197 |
| Cada operación se guarda como unidad (todo o nada) y sus condiciones se evalúan con el estado vigente al guardar. | RN-160 |
| La fecha de cálculo se inyecta como parámetro; las funciones de negocio no leen el reloj. | PRINCIPIO-007; RN-023, RN-198 a RN-204 |
| Los cálculos implementados cuentan con pruebas automáticas de referencia trazables a reglas, ejemplos y resultados esperados, y cobertura mínima del 80 % en sus módulos de dominio. La aceptación humana se realiza sobre el aplicativo por historia o entrega, sin aprobación separada de cada caso de referencia; las ambigüedades de negocio no resueltas se consultan a la persona encargada del proyecto. | PRINCIPIO-007; E-014 |
| Pantallas WCAG 2.2 AA, navegables por teclado y responsive. | PRINCIPIO-010 |
| Conservación: no se eliminan comprobantes, cuotas, pagos, anulaciones, usuarios ni historiales mientras el contrato esté vigente. | PRINCIPIO-006; RN-028, RN-150 |
| TLS 1.2 o superior. | RN-012 |

---

## Resumen del backlog

| ID | Título | Épica | Prioridad | Alcance |
|---|---|---|---|---|
| HU-001 | Alta de empresa y primer administrador | E1 Acceso y usuarios | Must | M6 |
| HU-002 | Activar cuenta, iniciar sesión y recuperar contraseña | E1 Acceso y usuarios | Must | M6 |
| HU-003 | Administrar usuarios y roles de la empresa | E1 Acceso y usuarios | Must | M6 |
| HU-004 | Gestionar el catálogo de contactos | E2 Contactos y comprobantes | Must | M1 |
| HU-005 | Registrar y editar comprobantes a crédito con sus cuotas | E2 Contactos y comprobantes | Must | M1, M2 |
| HU-006 | Registrar un cobro o pago sobre una cuota | E3 Pagos y correcciones | Must | M3 |
| HU-007 | Anular un pago o un comprobante con auditoría | E3 Pagos y correcciones | Must | M3, M6 |
| HU-008 | Consultar el panel de cartera y vencimientos | E4 Panel de cartera | Must | M4 |
| HU-009 | Configurar correo administrativo y copias de avisos | E5 Avisos de vencimiento | Must | M5, M6 |
| HU-010 | Enviar avisos de vencimiento por correo | E5 Avisos de vencimiento | Must | M5 |
| HU-011 | Reprogramar una cuota con promesa de pago | E3 Pagos y correcciones | Should | S1 |
| HU-012 | Consultar el tiempo promedio de cobro del mes | E4 Panel de cartera | Should | S5 |
| HU-017 | Consultar el historial cronológico de una cuota | E3 Pagos y correcciones | Should | S1 / S4 (primera entrega) |

---

## E1 — Acceso y usuarios (M6)

### HU-001: Alta de empresa y primer administrador

**Prioridad:** Must

**Como** integrante autorizado del equipo de VenceYa, **quiero** registrar una empresa cliente junto con su primer administrador, **para** que la pyme empiece a usar VenceYa sin un registro abierto que permita cuentas falsas o datos sucios.

**Criterios de aceptación:**

- DADO QUE no existe ninguna empresa con RUC 20123456789, CUANDO el equipo registra la razón social «COMERCIAL ANDINA SAC», el RUC 20123456789, el correo administrativo admin@andina.example y el correo del primer administrador ana@andina.example, ENTONCES el sistema crea la empresa y el usuario ana@andina.example con rol ADMINISTRADOR en estado INVITADO, y le envía un correo de invitación con un enlace válido por 72 horas.
- DADO QUE el RUC ingresado es 2012345678 (10 dígitos) o 2012345678A, CUANDO el equipo intenta registrar la empresa, ENTONCES el sistema no crea la empresa ni el usuario e informa que el RUC debe tener exactamente 11 dígitos.
- DADO QUE ya existe una empresa con RUC 20123456789, CUANDO el equipo intenta registrar otra empresa con el mismo RUC, ENTONCES el sistema rechaza el registro sin crear la empresa ni el usuario.
- DADO QUE el correo del primer administrador ya pertenece a un usuario de otra empresa (en cualquier estado, incluido INVITADO o DESACTIVADO), CUANDO el equipo registra la empresa, ENTONCES el sistema no persiste ni la empresa ni el usuario (operación atómica).
- DADO QUE el correo administrativo ingresado es «admin.andina.example» (sin «@»), CUANDO el equipo registra la empresa, ENTONCES el sistema rechaza el registro e informa que el correo administrativo no tiene formato válido.
- DADO QUE un usuario con rol ADMINISTRADOR de una empresa existente usa la aplicación, CUANDO busca una opción para registrar empresas, ENTONCES no existe ninguna pantalla ni endpoint de autoalta disponible para los roles de empresa.
- [NUEVO] (negativo, límite superior) DADO QUE el RUC ingresado tiene 12 dígitos (201234567890), CUANDO el equipo intenta registrar la empresa, ENTONCES el sistema no crea la empresa ni el usuario e informa que el RUC debe tener exactamente 11 dígitos.
- [NUEVO] (borde) DADO QUE el RUC ingresado es 00123456789 (11 dígitos con ceros iniciales), CUANDO el equipo registra la empresa, ENTONCES el sistema la crea conservando los 11 dígitos sin convertirlos a número, y un intento posterior con 00123456789 se rechaza por duplicado.
- [NUEVO] (borde) DADO QUE ana@andina.example ya es usuario de otra empresa, CUANDO el equipo registra una empresa nueva con el primer administrador « Ana@Andina.EXAMPLE », ENTONCES el sistema normaliza el correo a ana@andina.example, detecta la coincidencia y no persiste ni la empresa ni el usuario.
- [NUEVO] (negativo, falla técnica) DADO QUE durante el alta de «COMERCIAL ANDINA SAC» falla la creación del usuario ana@andina.example por un error de infraestructura (por ejemplo, se pierde la conexión con la base de datos), CUANDO termina la operación, ENTONCES no queda creada la empresa ni el usuario, y el equipo puede repetir el alta con el RUC 20123456789 sin que figure como duplicado.
- [NUEVO] (negativo, falla de correo, QA-08) DADO QUE durante el alta de «COMERCIAL ANDINA SAC» el proveedor de correo rechaza el envío de la invitación a ana@andina.example, CUANDO termina la operación, ENTONCES la empresa y el usuario siguen creados, Ana queda INVITADA con su enlace vigente, el equipo ve que el correo no se envió, el sistema no reintenta automáticamente y el intento fallido queda auditado sin el enlace; el equipo puede reenviar la invitación manualmente.
- [NUEVO] (positivo, QA-07) DADO QUE ana@andina.example es la primera administradora, sigue INVITADA y la empresa no tiene ningún ADMINISTRADOR ACTIVO, CUANDO el equipo de VenceYa reenvía manualmente la invitación desde el procedimiento interno, haya vencido o no el enlace o no haya llegado el correo, ENTONCES el sistema emite un enlace nuevo válido por 72 horas y revoca el anterior en la misma operación; audita quién lo hizo, el destinatario y la fecha y hora ISO 8601, sin registrar el enlace.
- [NUEVO] (negativo, QA-07) DADO QUE Ana ya está ACTIVA, CUANDO el equipo intenta reenviarle la invitación, ENTONCES el sistema lo rechaza sin cambiar su estado ni emitir un enlace; si olvidó su contraseña, utiliza recuperación de contraseña.
- [NUEVO] (negativo, QA-07) DADO QUE la primera administradora está DESACTIVADA, CUANDO el equipo intenta reenviarle la invitación, ENTONCES el sistema lo rechaza sin reactivarla ni emitir un enlace, exista o no otro ADMINISTRADOR ACTIVO. Si existe otro, este puede reactivarla mediante HU-003; si no existe, el caso se deriva a revisión interna como incidencia, sin reactivación automática.
- [NUEVO] (negativo, QA-07) DADO QUE la primera administradora está INVITADA y existe otro ADMINISTRADOR ACTIVO de la empresa, CUANDO el equipo de VenceYa intenta reenviar su invitación desde el procedimiento de alta, ENTONCES el sistema lo rechaza sin cambiar el estado ni los enlaces; el reenvío corresponde al administrador activo de la empresa mediante HU-003.
- [NUEVO] (positivo, normalización, QA-06) DADO QUE no existe ninguna empresa con RUC 20123456789, CUANDO el equipo registra la razón social «  comercial   andina s.a.c. », ENTONCES el sistema guarda «COMERCIAL ANDINA S.A.C.» sin espacios exteriores, con un solo espacio entre palabras y en mayúsculas, también si el alta llega por llamada directa al API.
- [NUEVO] (negativo, QA-06) DADO QUE la razón social ingresada es «   », «123», «Empresa #1» o «Empresa_SAC», CUANDO el equipo intenta registrar la empresa, ENTONCES el sistema no crea la empresa ni el usuario e informa el motivo (razón social faltante, sin letras o con caracteres no permitidos).
- [NUEVO] (borde, longitud, QA-06) DADO QUE la razón social tiene exactamente 250 caracteres tras el TRIM, CUANDO el equipo registra la empresa, ENTONCES el sistema la crea; con 251 caracteres no crea la empresa ni el usuario e informa la longitud máxima, sin truncarla.
- [NUEVO] (positivo, QA-06) DADO QUE ya existe una empresa con razón social «COMERCIAL ANDINA S.A.C.» y RUC 20123456789, CUANDO el equipo registra otra empresa con la misma razón social y el RUC 20987654321, ENTONCES el sistema la crea, porque la razón social no es única.
- [NUEVO] (negativo) DADO QUE ana@andina.example ya es usuario DESACTIVADO de otra empresa, CUANDO el equipo registra «COMERCIAL ANDINA SAC» con RUC 20123456789 y primer administrador ana@andina.example, ENTONCES el sistema no persiste ni la empresa ni el usuario e informa que el correo del primer administrador ya está registrado, sin indicar a qué empresa pertenece.
- [NUEVO] (negativo, falla de correo) DADO QUE durante el alta de «COMERCIAL ANDINA SAC» la solicitud al proveedor de correo agota el tiempo de espera y el envío de la invitación a ana@andina.example no se puede confirmar, CUANDO termina la operación, ENTONCES la empresa y el usuario siguen creados, Ana queda INVITADA con su enlace vigente, el equipo ve que el envío no se pudo confirmar, el sistema no reintenta automáticamente y el intento queda auditado sin el enlace.

**Reglas de negocio relacionadas:** RN-094, RN-095, RN-096, RN-097, RN-098, RN-099, RN-100, RN-165, RN-211, RN-005, RN-217, RN-222. Agregadas por QA [NUEVO]: RN-139, RN-160, RN-162 (QA-06).

**Notas:**
- Es un procedimiento interno del equipo de VenceYa, no forma parte de las pantallas de los roles de la empresa (RN-095). El mismo procedimiento permite reenviar la invitación del primer administrador únicamente mientras este siga INVITADO y la empresa no tenga ningún ADMINISTRADOR ACTIVO; ambas condiciones se comprueban al ejecutar el reenvío. No reactiva usuarios DESACTIVADOS. Si existe un ADMINISTRADOR ACTIVO, la gestión corresponde a los administradores de la empresa mediante HU-003 (RN-095, RN-098, RN-099, RN-100, RN-160).
- El RUC no se valida contra SUNAT (RN-005, O1) y su unicidad se comprueba con un índice único sobre los 11 dígitos (RN-096, RN-140).
- El autoregistro de empresas está fuera de alcance (O15).
- [NUEVO] Candidata a división en sprint: (a) alta de empresa y primer administrador, (b) reenvío interno de la invitación del primer administrador.

---

### HU-002: Activar cuenta, iniciar sesión y recuperar contraseña

**Prioridad:** Must

**Como** usuario de una empresa (ADMINISTRADOR, SUPERVISOR u OPERADOR), **quiero** activar mi cuenta desde la invitación, iniciar sesión con mi correo y contraseña y recuperarla si la olvido, **para** acceder de forma segura a la información de cobranzas y pagos de mi empresa.

**Criterios de aceptación:**

- DADO QUE luis@andina.example está INVITADO y su enlace se emitió hace 71 horas, CUANDO abre el enlace y define la contraseña «cobranza segura 2026» (20 caracteres), ENTONCES el sistema lo pasa a estado ACTIVO, guarda la contraseña como hash con sal individual y el enlace ya no puede reutilizarse.
- DADO QUE el enlace de invitación se emitió hace 72 horas y 1 minuto, CUANDO el usuario lo abre, ENTONCES el sistema lo rechaza y el usuario permanece INVITADO.
- DADO QUE el usuario define una contraseña de 7 caracteres, de 129 caracteres o compuesta solo por espacios, CUANDO la envía, ENTONCES el sistema la rechaza informando el motivo, conserva el estado INVITADO (o la contraseña anterior en una recuperación) y el enlace no se consume. Una contraseña de 8 o de 128 caracteres, sin mayúsculas, números ni símbolos, se acepta.
- DADO QUE ana@andina.example está ACTIVA, CUANDO ingresa « Ana@Andina.example » y su contraseña correcta, ENTONCES el sistema normaliza el correo a ana@andina.example e inicia la sesión. Un usuario INVITADO o DESACTIVADO no puede iniciar sesión.
- DADO QUE la cuenta acumula 4 fallos consecutivos, CUANDO ocurre el quinto fallo a las 10:00:00, ENTONCES la cuenta queda bloqueada hasta las 10:15:00; un intento a las 10:05:00 con la contraseña correcta se rechaza sin prolongar el bloqueo, y a las 10:15:00 la cuenta se desbloquea con el contador en cero. El mensaje es el mismo para contraseña incorrecta, cuenta bloqueada y correo inexistente.
- DADO QUE ana@andina.example está ACTIVA y solicita recuperar su contraseña, CUANDO usa el enlace a los 20 minutos y define una nueva contraseña válida, ENTONCES el sistema la guarda, cierra todas sus sesiones abiertas y desbloquea la cuenta; el mismo enlace usado a los 61 minutos, o por segunda vez, se rechaza.
- [NUEVO] (borde, QA-01) DADO QUE el enlace de invitación de luis@andina.example se emitió el día 1 a las 10:00:00, CUANDO envía una contraseña válida el día 4 a las 09:59:59 (71:59:59), ENTONCES el sistema lo pasa a ACTIVO; y si la envía el día 4 a las 10:00:00 exactas (72:00:00), ENTONCES el sistema la rechaza por enlace vencido y Luis permanece INVITADO. Si abrió el enlace antes del vencimiento y envía la contraseña después, también se rechaza, porque la vigencia se comprueba al canjear (RN-098).
- [NUEVO] (borde, QA-01) DADO QUE ana@andina.example recibió un enlace de recuperación emitido a las 08:00:00, CUANDO envía una nueva contraseña válida a las 08:59:59, ENTONCES el sistema la acepta; y si la envía a las 09:00:00 exactas, ENTONCES el sistema la rechaza por enlace vencido y conserva la contraseña anterior (RN-102).
- DADO QUE un usuario tiene una sesión abierta a las 09:00:00 sin actividad, CUANDO llegan las 09:30:00, ENTONCES la sesión queda cerrada; y una sesión iniciada a las 08:00:00 con actividad continua se cierra a las 20:00:00.
- [NUEVO] (borde) DADO QUE ana@andina.example acumula 4 fallos consecutivos, CUANDO a continuación inicia sesión con su contraseña correcta, ENTONCES el sistema inicia la sesión y reinicia el contador a cero; un fallo posterior es el primero de una nueva serie y no bloquea la cuenta.
- [NUEVO] (borde) DADO QUE luis@andina.example definió en la invitación la contraseña « abcdefg » (9 caracteres, con un espacio al inicio y otro al final), CUANDO inicia sesión con «abcdefg» sin espacios, ENTONCES el sistema rechaza el acceso porque la contraseña se guarda sin recortar ni normalizar; con « abcdefg » inicia sesión.
- [NUEVO] (negativo, permisos) DADO QUE ana@andina.example solicitó recuperar su contraseña y después un ADMINISTRADOR la desactiva, CUANDO usa el enlace a los 10 minutos, ENTONCES el sistema lo rechaza y no cambia la contraseña.
- [NUEVO] (borde) DADO QUE la última actividad de una sesión fue a las 09:00:00, CUANDO el usuario hace una consulta a las 09:29:59, ENTONCES la sesión sigue vigente y el plazo de inactividad se cuenta desde las 09:29:59; sin otra actividad, se cierra a las 09:59:59.
- [NUEVO] (negativo) DADO QUE se envía directamente al API la contraseña «abcde» (5 caracteres) sin pasar por la interfaz, CUANDO el servidor la recibe, ENTONCES la rechaza informando el motivo, el usuario sigue INVITADO y el enlace no se consume.
- [NUEVO] (negativo, QA-02) DADO QUE nadie@andina.example no pertenece a ningún usuario y luis@andina.example está INVITADO, CUANDO se solicita recuperar la contraseña para cada uno y para ana@andina.example (ACTIVA), ENTONCES las tres solicitudes reciben el mismo código HTTP, el mismo cuerpo y el mensaje «Si el correo pertenece a una cuenta activa, recibirás un enlace para restablecer tu contraseña», y solo Ana recibe el correo con el enlace.
- [NUEVO] (borde, QA-02) DADO QUE Ana solicitó la recuperación a las 10:00 y otra vez a las 10:20, CUANDO usa el enlace de las 10:00, ENTONCES el sistema lo rechaza; el enlace de las 10:20 es válido hasta las 11:20.
- [NUEVO] (borde, QA-02) DADO QUE Ana recibió enlaces de recuperación a las 10:00, 10:10 y 10:20, CUANDO vuelve a solicitarlo a las 10:30, ENTONCES recibe el mismo mensaje pero ningún correo y el enlace de las 10:20 sigue vigente; una solicitud a las 11:00:00 sí envía un enlace nuevo.
- [NUEVO] (negativo) DADO QUE luis@andina.example está INVITADO y marta@andina.example está DESACTIVADA con una contraseña definida antes, CUANDO cada uno ingresa su correo y una contraseña, ENTONCES el sistema no inicia sesión para ninguno de los dos y no crea ninguna sesión.
- [NUEVO] (negativo, terminación contractual, C-03) DADO QUE la empresa de ana@andina.example tiene terminación efectiva el 2027-03-31 a las 18:00 (America/Lima) y Ana está ACTIVA, CUANDO a las 18:00:00 inicia sesión con su contraseña correcta, usa una sesión abierta o canjea un enlace de invitación o de recuperación, ENTONCES el sistema lo rechaza informando que el contrato terminó, cierra sus sesiones y no consume el enlace; a las 17:59:59 las mismas acciones funcionan. Con una contraseña incorrecta, el mensaje es el mismo que para cualquier credencial inválida (RN-103), y una solicitud de recuperación recibe la respuesta neutra sin enviar el correo.

**Reglas de negocio relacionadas:** RN-098, RN-101, RN-102, RN-103, RN-149, RN-139, RN-140, RN-143, RN-243, RN-244, RN-245, RN-246, RN-247, RN-248, RN-249, RN-250, RN-251, RN-252, RN-253. Agregadas por QA [NUEVO]: RN-258, RN-259, RN-260, RN-152 (solo el bloqueo desde la terminación efectiva; C-03).

**Notas:**
- La duración del bloqueo (15 minutos) es un parámetro de instalación que administra solo el personal operativo; ningún rol de empresa la cambia (RN-103).
- La validación de contraseña siempre ocurre en el servidor; la interfaz puede anticiparla (RN-251, RN-252).
- Candidata a división en sprint si resulta grande: (a) activación por invitación, (b) inicio de sesión, bloqueo y sesiones, (c) recuperación de contraseña.

---

### HU-003: Administrar usuarios y roles de la empresa

**Prioridad:** Must

**Como** ADMINISTRADOR de la empresa, **quiero** invitar usuarios, asignarles un rol, cambiarlo, desactivarlos y reactivarlos, **para** controlar quién opera los cobros y pagos de mi empresa y con qué permisos.

**Criterios de aceptación:**

- DADO QUE ana@andina.example es ADMINISTRADOR ACTIVO, CUANDO invita a luis@andina.example con rol OPERADOR, ENTONCES el sistema crea el usuario en su misma empresa, en estado INVITADO y con exactamente un rol, y le envía un enlace válido por 72 horas; Ana no conoce ni define la contraseña de Luis.
- DADO QUE un usuario con rol SUPERVISOR u OPERADOR, CUANDO intenta crear un usuario, cambiar un rol o desactivar a otro usuario, ENTONCES el sistema rechaza la operación y no crea ni modifica ningún usuario.
- DADO QUE el correo carla@otra.example ya pertenece a un usuario de otra empresa, CUANDO Ana intenta invitar a carla@otra.example, ENTONCES el sistema no crea el usuario.
- DADO QUE Luis es OPERADOR con 2 sesiones abiertas (computadora y celular), CUANDO Ana cambia su rol a SUPERVISOR, ENTONCES el sistema reemplaza el rol, cierra ambas sesiones, rechaza las siguientes solicitudes de esas sesiones y audita el cambio con el administrador, el usuario afectado, la empresa, el rol anterior (OPERADOR), el nuevo (SUPERVISOR) y la fecha y hora ISO 8601. Guardar el mismo rol OPERADOR no cierra sesiones ni se audita como cambio.
- DADO QUE Ana es la única ADMINISTRADOR ACTIVA de la empresa, CUANDO intenta desactivarse o cambiar su propio rol a SUPERVISOR, ENTONCES el sistema lo rechaza; si existe un segundo ADMINISTRADOR ACTIVO, el cambio se permite.
- DADO QUE Luis registró 3 pagos, CUANDO Ana lo desactiva, ENTONCES Luis queda DESACTIVADO, pierde sus sesiones y los 3 pagos siguen mostrando su identidad; la aplicación no ofrece la opción de eliminar usuarios.
- DADO QUE Luis está INVITADO y su enlace venció, CUANDO Ana reenvía la invitación, ENTONCES el sistema genera un enlace nuevo de 72 horas y revoca el anterior en la misma operación.
- [NUEVO] (negativo, falla de correo, QA-08) DADO QUE Ana invita a luis@andina.example y el proveedor de correo rechaza el envío, CUANDO termina la operación, ENTONCES Luis queda INVITADO con su enlace vigente, Ana ve «Usuario creado, correo no enviado» con la acción Reenviar, el sistema no reintenta solo, el intento fallido queda auditado sin el enlace, y un nuevo intento de invitar a luis@andina.example se rechaza por existir ya; al reenviar, el enlace nuevo de 72 horas revoca el anterior.
- [NUEVO] (positivo, reactivación, QA-09) DADO QUE Luis ya definió su contraseña, fue DESACTIVADO y conserva su historial, CUANDO Ana lo reactiva, ENTONCES vuelve directamente a ACTIVO con su contraseña anterior, sin enlace de invitación ni correo, e inicia sesión con ella.
- [NUEVO] (positivo, reactivación, QA-09) DADO QUE Marta fue invitada, nunca definió contraseña y fue DESACTIVADA, CUANDO Ana la reactiva, ENTONCES Marta pasa a INVITADO, recibe un enlace nuevo de 72 horas, el enlace anterior sigue revocado y no puede iniciar sesión hasta definir su contraseña.
- [NUEVO] (borde) DADO QUE luis@andina.example ya existe en la empresa en estado INVITADO, CUANDO Ana invita a « LUIS@andina.example », ENTONCES el sistema normaliza el correo y no crea un segundo usuario.
- [NUEVO] (negativo, aislamiento) DADO QUE el usuario 77 pertenece a otra empresa, CUANDO Ana intenta desactivarlo o cambiar su rol usando ese identificador, ENTONCES el sistema responde HTTP 404 con el mismo cuerpo que para un usuario inexistente y no modifica nada.
- [NUEVO] (negativo, permisos) DADO QUE Luis está DESACTIVADO, CUANDO un SUPERVISOR intenta reactivarlo o reenviarle una invitación, ENTONCES el sistema lo rechaza sin efectos; solo un ADMINISTRADOR puede hacerlo.
- [NUEVO] (negativo, falla técnica) DADO QUE Ana cambia el rol de Luis de OPERADOR a SUPERVISOR y falla el registro de la auditoría, CUANDO termina la operación, ENTONCES Luis conserva el rol OPERADOR y sus 2 sesiones siguen abiertas: no queda ningún cambio parcial.
- [NUEVO] (negativo, permisos) DADO QUE luis@andina.example es OPERADOR ACTIVO, CUANDO intenta desactivar a ana@andina.example o cambiar su propio rol a ADMINISTRADOR, ENTONCES el sistema rechaza ambas operaciones: Ana sigue ADMINISTRADOR ACTIVA y Luis sigue OPERADOR.
- [NUEVO] (borde) DADO QUE luis@andina.example está INVITADO con un enlace emitido hace 2 horas, CUANDO Ana lo desactiva, ENTONCES el sistema revoca ese enlace en la misma operación y, si Luis lo usa después para definir su contraseña, se rechaza y sigue DESACTIVADO.
- [NUEVO] (negativo, concurrencia) DADO QUE Luis está INVITADO, CUANDO envía su contraseña desde el enlace mientras Ana lo desactiva, ENTONCES se guarda solo la operación que llega primero: si gana Ana, Luis ve un rechazo y queda DESACTIVADO sin contraseña; si gana Luis, queda ACTIVO y luego DESACTIVADO por Ana.
- [NUEVO] (negativo) DADO QUE Ana invita a un usuario con el correo «luis.andina.example» (sin «@»), o se envía al API una invitación con el rol «GERENTE» o sin rol, CUANDO el servidor la recibe, ENTONCES el sistema no crea el usuario ni envía ningún correo e informa el motivo.
- [NUEVO] (negativo, falla de correo) DADO QUE Ana invita a luis@andina.example y la solicitud al proveedor de correo agota el tiempo de espera, CUANDO termina la operación, ENTONCES Luis queda INVITADO con su enlace vigente, Ana ve que el envío no se pudo confirmar junto con la acción Reenviar, el sistema no reintenta solo y el intento queda auditado sin el enlace.

**Reglas de negocio relacionadas:** RN-009, RN-010, RN-060, RN-070, RN-097, RN-098, RN-099, RN-100, RN-161, RN-160. Agregadas por QA [NUEVO]: RN-008, RN-139.

**Notas:**
- Si dos administradores intentan desactivarse mutuamente al mismo tiempo, se guarda la primera operación y se rechaza la segunda (RN-100, RN-160).
- Al reactivar un usuario, el estado resultante y el tratamiento de la invitación siguen RN-098 (RN-099): con contraseña definida vuelve a ACTIVO; sin ella pasa a INVITADO con enlace nuevo.
- Desactivar o pasar a OPERADOR a un usuario incluido en una lista de copias afecta la HU-009 (RN-135).

---

## E2 — Contactos y comprobantes (M1, M2)

### HU-004: Gestionar el catálogo de contactos

**Prioridad:** Must

**Como** usuario de la empresa (cualquier rol), **quiero** crear, editar, desactivar, reactivar y eliminar los contactos de mi empresa, **para** tener un único catálogo de clientes y proveedores sobre el cual registrar comprobantes y enviar avisos.

**Criterios de aceptación:**

- DADO QUE no existe el correo ventas@distlima.example en la empresa, CUANDO el usuario registra el nombre «  Distribuidora   Lima  » y el correo « Ventas@DistLima.example » sin teléfono ni dirección, ENTONCES el sistema guarda el nombre «DISTRIBUIDORA LIMA», el correo «ventas@distlima.example», el contacto en estado ACTIVO, y no solicita DNI, RUC, número de cuenta ni CCI.
- DADO QUE el correo ventas@distlima.example ya pertenece a otro contacto de la misma empresa, incluso DESACTIVADO, CUANDO el usuario registra o edita un contacto con «VENTAS@distlima.example», ENTONCES el sistema no lo guarda; el mismo correo sí se admite en un contacto de otra empresa.
- DADO QUE el usuario ingresa un nombre de 251 caracteres, un nombre de solo espacios o el correo «ventas@distlima» (dominio sin punto), CUANDO guarda el contacto, ENTONCES el sistema lo rechaza informando el motivo, sin truncar ni corregir el valor.
- DADO QUE el contacto «DISTRIBUIDORA LIMA» tiene 1 comprobante registrado, aunque esté anulado, CUANDO el usuario intenta eliminarlo, ENTONCES el sistema lo rechaza y ofrece desactivarlo; un contacto sin comprobantes se elimina solo después de que el usuario confirma la eliminación.
- DADO QUE el contacto está DESACTIVADO, CUANDO el usuario registra un nuevo comprobante, ENTONCES el contacto no aparece en la búsqueda de contactos seleccionables; sus cuotas con saldo siguen en la lista de cuotas por avisar.
- DADO QUE el usuario cambia el teléfono del contacto de «987654321» a «912345678», CUANDO guarda la edición, ENTONCES el sistema registra el valor anterior, el nuevo, el usuario y la fecha y hora ISO 8601 de ese campo.
- [NUEVO] (borde) DADO QUE el usuario ingresa un nombre de exactamente 250 caracteres después del TRIM y un correo de exactamente 250 caracteres, CUANDO guarda el contacto, ENTONCES el sistema lo acepta; con un correo de 251 caracteres lo rechaza informando el motivo.
- [NUEVO] (borde, QA-05) DADO QUE el usuario registra los nombres «José Núñez Güemes», «Comercial Andina S.A.C.», «Pérez & Hijos E.I.R.L.», «D'Onofrio» o «Distribuidora 2000», CUANDO guarda el contacto, ENTONCES el sistema los guarda en mayúsculas («JOSÉ NÚÑEZ GÜEMES», «COMERCIAL ANDINA S.A.C.», etc.); en cambio, «123» o «...» (sin letras) y «Cliente #1» o «Cliente_SAC» (caracteres no permitidos) se rechazan informando el motivo.
- [NUEVO] (positivo) DADO QUE el contacto 51, con correo ventas@distlima.example, no tiene comprobantes, CUANDO el usuario lo elimina tras confirmar y luego registra un contacto nuevo con el mismo correo, ENTONCES el sistema guarda el contacto nuevo con otro identificador y sin el historial del eliminado.
- [NUEVO] (positivo) DADO QUE el contacto «DISTRIBUIDORA LIMA» está DESACTIVADO, CUANDO el usuario lo reactiva, ENTONCES el contacto vuelve a estado ACTIVO y aparece otra vez en la búsqueda de contactos seleccionables.
- [NUEVO] (negativo, aislamiento) DADO QUE el contacto 88 pertenece a otra empresa, CUANDO el usuario intenta consultarlo, editarlo o eliminarlo con ese identificador, ENTONCES el sistema responde HTTP 404 igual que para un contacto inexistente.
- [NUEVO] (borde, lista vacía) DADO QUE la empresa todavía no tiene contactos, CUANDO el usuario abre el catálogo o busca un contacto al registrar un comprobante, ENTONCES el sistema no muestra resultados ni contactos de otras empresas.
- [NUEVO] (negativo, concurrencia) DADO QUE el contacto 51 no tiene comprobantes, CUANDO un usuario confirma su eliminación mientras otro registra el comprobante F001-00060 para ese contacto, ENTONCES solo se completa la operación que se guarda primero: si fue la eliminación, el comprobante se rechaza; si fue el comprobante, la eliminación se rechaza y se ofrece desactivar el contacto. Nunca queda un comprobante sin contacto.

**Reglas de negocio relacionadas:** RN-126, RN-127, RN-128, RN-129, RN-130, RN-044, RN-139, RN-162, RN-006, RN-254, RN-255, RN-256. Agregadas por QA [NUEVO]: RN-160.

**Notas:**
- [NUEVO] Resuelto (QA-13, pregunta 51, 2026-11-10): eliminar un contacto sin comprobantes conserva sin cambios su historial de ediciones (RN-129, RN-130, RN-150, RN-255); no se recupera en un contacto nuevo que reutilice el correo.
- [NUEVO] (positivo, historial) DADO QUE el contacto 42 sin comprobantes tiene dos ediciones de correo, CUANDO un usuario confirma su eliminación, ENTONCES no queda el registro del contacto, el mismo correo se acepta en un contacto nuevo y el historial del contacto 42 se conserva sin cambios.
- El contacto no tiene tipo fijo: es cliente si tiene comprobantes por cobrar y proveedor si tiene comprobantes por pagar; puede ser ambos (RN-128).
- Desactivar un contacto no equivale a atender una solicitud de eliminación de datos personales; el equipo de VenceYa gestiona esa solicitud internamente, en coordinación con la empresa cliente, fuera del alcance funcional y del backlog de desarrollo (RN-151, RN-254; M-11). No existe seudonimización (RN-256).
- Nombre del contacto: 1 a 250 caracteres; letras, dígitos, espacios y los signos «.», «,», «&», «-», «'», «(», «)» y «/», con al menos una letra (RN-162; [ACTUALIZADO] por la decisión QA-05 del 2026-11-09, antes «solo letras y espacios»). Correo: 1 a 250 caracteres.

---

### HU-005: Registrar y editar comprobantes a crédito con sus cuotas

**Prioridad:** Must

**Como** usuario de la empresa (cualquier rol), **quiero** registrar un comprobante por cobrar o por pagar en su moneda original, en pago único o en cuotas, y corregirlo mientras no tenga pagos, **para** que cada vencimiento quede controlado en VenceYa en lugar de en una hoja de Excel.

**Criterios de aceptación:**

- DADO QUE el contacto «DISTRIBUIDORA LIMA» está ACTIVO, CUANDO el usuario registra el comprobante por cobrar F001-00045 por US$ 3,000.00 emitido el 2026-11-04 y elige «En cuotas» con 3 cuotas, ENTONCES el sistema propone 3 cuotas de US$ 1,000.00 con vencimientos 2026-12-04, 2027-01-04 y 2027-02-04, permite cambiarlas antes de guardar y guarda el comprobante en moneda USD sin conversión.
- DADO QUE el usuario registra un comprobante por S/ 1,000.00 en 3 cuotas, CUANDO el sistema propone el reparto, ENTONCES las cuotas son S/ 333.33, S/ 333.33 y S/ 333.34; si el usuario cambia la cuota 1 a S/ 400.00, el sistema no guarda, muestra la diferencia de S/ 66.67 entre la suma de cuotas y el total y no ajusta ninguna cuota por su cuenta.
- DADO QUE el usuario elige «Pago único» para un comprobante por S/ 1,500.00, CUANDO indica el vencimiento 2026-12-15 y guarda, ENTONCES el sistema crea una sola cuota de S/ 1,500.00 con esa fecha, sin pedir cantidad de cuotas.
- DADO QUE el usuario indica 1, 121, «3.0» o «tres» cuotas, CUANDO intenta guardar, ENTONCES el sistema lo rechaza; con un total de S/ 0.02 y 3 cuotas informa que el máximo posible es 2, y con un total de S/ 0.01 informa que solo procede «Pago único».
- DADO QUE ya existe el comprobante por cobrar no anulado F001-00045 en la empresa, CUANDO el usuario registra otro comprobante por cobrar « f001-00045 », ENTONCES el sistema lo normaliza a «F001-00045» y lo rechaza por duplicado; el mismo número sí se acepta como comprobante por pagar, y en cuentas por pagar dos proveedores distintos pueden tener el mismo número.
- DADO QUE el usuario ingresa moneda EUR, total «1000.50» (sin coma de miles), total S/ 0.00, una fecha de emisión posterior a la fecha de cálculo, un vencimiento igual a la fecha de emisión o vencimientos no estrictamente crecientes (cuota 2 el 2027-01-04 y cuota 3 el 2027-01-04), CUANDO intenta guardar, ENTONCES el sistema no guarda el comprobante e informa el motivo.
- DADO QUE F001-00045 no está anulado y nunca tuvo pagos, CUANDO el usuario cambia el vencimiento de la cuota 2 de 2027-01-04 a 2027-01-10, ENTONCES el sistema aplica las mismas validaciones del registro y guarda por cada campo cambiado el valor anterior, el nuevo, el usuario y la fecha y hora ISO 8601.
- DADO QUE F001-00045 tiene al menos un pago registrado, aunque esté anulado, o el comprobante está anulado, CUANDO el usuario intenta editarlo, ENTONCES el sistema no lo permite.
- [NUEVO] (borde) DADO QUE un comprobante emitido el 2026-01-31 se registra en 3 cuotas, CUANDO el sistema propone los vencimientos, ENTONCES propone 2026-02-28, 2026-03-31 y 2026-04-30 (último día del mes cuando no existe el día 31).
- [NUEVO] (borde) DADO QUE el usuario registra un comprobante por S/ 1,200.00 en 120 cuotas, CUANDO el sistema propone el reparto, ENTONCES propone 120 cuotas de S/ 10.00. Además, un total de S/ 999,999,999,999.99 se acepta y uno de S/ 1,000,000,000,000.00 (13 dígitos enteros) se rechaza.
- [NUEVO] (negativo) DADO QUE el usuario ingresa en la interfaz el total «100,50» (coma decimal), «1,000.505» (tres decimales), «1,00.50» (agrupación inválida), «-100.00» o «1e3», CUANDO intenta guardar, ENTONCES el sistema no guarda el comprobante ni redondea el valor; «1,000.5» y «100» se aceptan.
- [NUEVO] (borde) DADO QUE la fecha de cálculo es 2026-11-09, CUANDO el usuario registra un comprobante emitido el 2026-11-09, ENTONCES el sistema lo guarda; uno emitido el 2026-11-10 se rechaza.
- [NUEVO] (borde) DADO QUE el comprobante por cobrar F001-00045 está ANULADO, CUANDO el usuario registra un nuevo F001-00045 por cobrar, ENTONCES el sistema lo guarda como comprobante nuevo.
- [NUEVO] (negativo, concurrencia) DADO QUE dos usuarios registran al mismo tiempo el comprobante por cobrar F001-00046, CUANDO ambos guardan, ENTONCES el sistema guarda solo el primero y rechaza el segundo por duplicado.
- [NUEVO] (borde) DADO QUE el número de documento tiene 30 caracteres permitidos, CUANDO se guarda el comprobante, ENTONCES se acepta; con 31 caracteres o con «F001 00045» (espacio interno) se rechaza.
- [NUEVO] (negativo) DADO QUE el contacto «DISTRIBUIDORA LIMA» está DESACTIVADO, CUANDO se envía al API un comprobante con el identificador de ese contacto, ENTONCES el sistema no guarda el comprobante.
- [NUEVO] (negativo, al entregar S1) DADO QUE F001-00045 no tiene pagos y una de sus cuotas tiene una reprogramación registrada, CUANDO el usuario intenta editar importes o vencimientos, ENTONCES el sistema no lo permite.
- [NUEVO] (negativo, aislamiento) DADO QUE el comprobante 700 y el contacto 88 pertenecen a otra empresa, CUANDO el usuario intenta editar el comprobante 700 o registrar un comprobante con el contacto 88, ENTONCES el sistema responde HTTP 404 igual que para un registro inexistente y no guarda nada.
- [NUEVO] (negativo, falla técnica) DADO QUE el usuario registra F001-00045 por S/ 1,000.00 en 3 cuotas y falla por un error de infraestructura el guardado de la cuota 3, CUANDO termina la operación, ENTONCES no queda guardado el comprobante ni ninguna de sus cuotas, y un nuevo intento con F001-00045 no se rechaza por duplicado.

**Reglas de negocio relacionadas:** RN-001, RN-002, RN-003, RN-004, RN-093, RN-005, RN-131, RN-132, RN-133, RN-162, RN-015, RN-016, RN-017, RN-018, RN-019, RN-020, RN-057, RN-121, RN-122, RN-153, RN-154, RN-081, RN-082, RN-083, RN-130. Agregadas por QA [NUEVO]: RN-008, RN-160.

**Notas:**
- La propuesta de cuotas es una ayuda: la cuota 1 vence un mes calendario después de la emisión y las siguientes mantienen el mismo día; si el mes no tiene ese día, se usa el último día del mes (RN-015).
- El API recibe los importes como cadena decimal canónica (por ejemplo «1000.50»), mientras que la interfaz exige el formato peruano «1,000.50» (RN-153). Máximo: 999,999,999,999.99.
- Número de documento: 1 a 30 caracteres, letras, dígitos, «-» y «_», sin espacios (RN-093, RN-162). No se valida contra SUNAT (O1).
- Sin S1, corregir la fecha de un comprobante con pagos exige anular sus pagos vigentes, anular el comprobante y registrar uno nuevo (alcance §3.1, RN-082).
- Candidata a división en sprint: (a) registro con reparto de cuotas, (b) edición de comprobantes sin pagos.

---

## E3 — Pagos y correcciones (M3, S1)

### HU-006: Registrar un cobro o pago sobre una cuota

**Prioridad:** Must

**Como** usuario de la empresa (cualquier rol), **quiero** registrar el cobro recibido de un cliente o el pago realizado a un proveedor sobre una cuota, **para** conocer el saldo real de cada cuota y reducir la cartera vencida (K1).

**Criterios de aceptación:**

- DADO QUE la cuota 1 de F001-00045 tiene importe S/ 1,000.00 sin pagos y la fecha de cálculo es 2026-11-09, CUANDO el usuario registra un pago de S/ 400.00 con fecha de pago 2026-11-09, ENTONCES el sistema lo guarda confirmado, el saldo queda en S/ 600.00 y se guardan la fecha de pago ingresada y, aparte, la fecha y hora de creación en ISO 8601.
- DADO QUE la cuota tiene saldo S/ 600.00, CUANDO el usuario registra un pago de S/ 600.00, ENTONCES la cuota queda CANCELADA con saldo S/ 0.00.
- DADO QUE la cuota tiene saldo S/ 600.00, CUANDO el usuario registra un pago de S/ 600.01, ENTONCES el sistema lo rechaza con el código `IMPORTE_SUPERA_SALDO` y muestra el saldo vigente S/ 600.00 obtenido de una consulta autorizada, no del mensaje de error; el exceso no se aplica a otras cuotas.
- DADO QUE la cuota tiene un pago vigente con fecha 2026-11-08 y la fecha de cálculo es 2026-11-09, CUANDO el usuario registra un pago con fecha 2026-11-07, con fecha 2026-11-10 o con una fecha anterior a la emisión del comprobante, ENTONCES el sistema no lo guarda; un pago con fecha 2026-11-08 (misma fecha) sí se guarda.
- DADO QUE el usuario pulsa «Registrar pago», CUANDO hace doble clic o el navegador reintenta la solicitud tras perder la respuesta, ENTONCES el botón queda deshabilitado mientras la solicitud está en curso y el backend crea como máximo un pago.
- DADO QUE la cuota está en S/, CUANDO el usuario registra un pago en US$, de S/ 0.00 o sobre una cuota de un comprobante anulado, ENTONCES el sistema no guarda el pago.
- DADO QUE dos usuarios registran al mismo tiempo pagos de S/ 400.00 y S/ 300.00 sobre una cuota con saldo S/ 600.00, CUANDO ambos guardan, ENTONCES el sistema guarda uno y rechaza el otro, y la suma de pagos no anulados nunca supera el importe de la cuota.
- [NUEVO] (borde) DADO QUE la cuota 1 de F001-00045 (emitido el 2026-11-04) no tiene pagos y tiene saldo S/ 600.00, CUANDO el usuario registra un pago de S/ 0.01 con fecha 2026-11-04 (igual a la emisión), ENTONCES el sistema lo guarda y el saldo queda en S/ 599.99.
- [NUEVO] (borde) DADO QUE la cuota está CANCELADA con saldo S/ 0.00, CUANDO el usuario registra un pago de S/ 0.01, ENTONCES el sistema lo rechaza con el código `IMPORTE_SUPERA_SALDO`.
- [NUEVO] (negativo) DADO QUE el usuario ingresa en la interfaz el importe «600.001», «-50.00» o «1000.00» (sin coma de miles), CUANDO intenta guardar, ENTONCES el sistema no guarda el pago ni redondea el valor.
- [NUEVO] (positivo) DADO QUE la cuota 1 tiene fecha efectiva de vencimiento 2026-11-03, saldo S/ 600.00 y la fecha de cálculo es 2026-11-09, CUANDO el usuario registra un pago de S/ 200.00, ENTONCES la cuota sigue VENCIDA con saldo S/ 400.00 y su vencimiento acordado no cambia.
- [NUEVO] (negativo, aislamiento) DADO QUE la cuota 900 pertenece a otra empresa, CUANDO el usuario intenta registrar un pago sobre ella, ENTONCES el sistema responde HTTP 404 igual que para una cuota inexistente y no crea el pago.
- [NUEVO] (negativo, falla técnica) DADO QUE la cuota 1 tiene saldo S/ 600.00, CUANDO el usuario registra un pago de S/ 200.00 y el guardado falla por un error de infraestructura, ENTONCES no queda creado el pago, el saldo sigue en S/ 600.00 y el usuario ve que el pago no se registró.

**Reglas de negocio relacionadas:** RN-024, RN-025, RN-026, RN-063, RN-088, RN-089, RN-091, RN-092, RN-153, RN-156, RN-157, RN-021, RN-022, RN-084, RN-160. Agregadas por QA [NUEVO]: RN-008.

**Notas:**
- Registrar un pago no modifica el vencimiento acordado; la cancelación real se calcula al quedar el saldo en cero (RN-088).
- Cada pago se aplica a una sola cuota; la amortización o el reparto entre cuotas está fuera de alcance (O14). No se procesan pagos electrónicos (O3) ni se concilian extractos (O19).
- Para incorporar un pago omitido con fecha anterior se anulan antes los pagos posteriores (HU-007) y se registran de nuevo en orden (RN-089).

---

### HU-007: Anular un pago o un comprobante con auditoría

**Prioridad:** Must

**Como** SUPERVISOR o ADMINISTRADOR de la empresa, **quiero** anular un pago o un comprobante registrado por error indicando el motivo, **para** corregir la información sin alterar los registros originales y con trazabilidad de quién y por qué corrigió.

**Criterios de aceptación:**

- DADO QUE la cuota 1 de F001-00045 (S/ 1,000.00) tiene el pago 1001 de S/ 400.00 y saldo S/ 600.00, CUANDO un SUPERVISOR anula el pago 1001 con el motivo «Importe digitado erróneamente», ENTONCES el sistema crea un registro de anulación que referencia el pago con el motivo guardado como «IMPORTE DIGITADO ERRÓNEAMENTE», el usuario y la fecha y hora ISO 8601, el pago 1001 permanece sin cambios en la base de datos y el saldo vuelve a S/ 1,000.00.
- DADO QUE una cuota quedó CANCELADA con un único pago de S/ 1,000.00, CUANDO un ADMINISTRADOR anula ese pago, ENTONCES la cuota vuelve a PENDIENTE o VENCIDA según su fecha efectiva de vencimiento, sin otra acción del usuario.
- DADO QUE el usuario tiene rol OPERADOR, CUANDO intenta anular un pago o un comprobante, ENTONCES el sistema no crea el registro de anulación.
- DADO QUE el pago 1001 ya está ANULADO, CUANDO un SUPERVISOR intenta anularlo de nuevo, ENTONCES el sistema lo rechaza; si dos usuarios lo anulan al mismo tiempo, se crea una sola anulación. No existe opción para anular parcialmente, revertir o editar una anulación, ni para guardarla con el motivo vacío.
- DADO QUE F001-00045 tiene una cuota PENDIENTE y otra VENCIDA, ambas sin pagos vigentes (sin pagos o con todos sus pagos ANULADOS), CUANDO un SUPERVISOR anula el comprobante con motivo, ENTONCES el comprobante queda ANULADO, sus 2 cuotas quedan ANULADAS sin estado de pago vigente y dejan de sumar en cartera, indicadores y avisos.
- DADO QUE F001-00045 tiene un pago vigente de S/ 100.00 en la cuota 1, CUANDO un SUPERVISOR intenta anular el comprobante, ENTONCES el sistema lo rechaza.
- DADO QUE F001-00045 está ANULADO, CUANDO cualquier usuario intenta registrar un pago, editarlo, anularlo de nuevo o revertir su anulación, ENTONCES el sistema lo rechaza: el comprobante y sus cuotas son de solo lectura.
- [NUEVO] (borde) DADO QUE la cuota 1 de S/ 1,000.00 quedó CANCELADA con los pagos 1001 (S/ 400.00) y 1002 (S/ 600.00), su fecha efectiva de vencimiento es 2026-11-03 y la fecha de cálculo es 2026-11-09, CUANDO un SUPERVISOR anula el pago 1002, ENTONCES el saldo vuelve a S/ 600.00, la cuota pasa a VENCIDA y el pago 1001 sigue vigente.
- [NUEVO] (positivo) DADO QUE F001-00045 por cobrar está ANULADO, CUANDO el usuario registra un nuevo comprobante por cobrar F001-00045, ENTONCES el sistema lo guarda como comprobante nuevo y el anulado sigue siendo de solo lectura.
- [NUEVO] (negativo, concurrencia) DADO QUE un SUPERVISOR anula F001-00045, sin pagos vigentes, mientras un OPERADOR registra un pago de S/ 100.00 en su cuota 1, CUANDO ambas operaciones se guardan casi al mismo tiempo, ENTONCES solo tiene efecto la que se guarda primero: si fue el pago, la anulación se rechaza; si fue la anulación, el pago se rechaza.
- [NUEVO] (negativo, aislamiento) DADO QUE el pago 3001 pertenece a otra empresa, CUANDO un SUPERVISOR intenta anularlo, ENTONCES el sistema responde HTTP 404 igual que para un pago inexistente y no crea la anulación.
- [NUEVO] (negativo, falla técnica) DADO QUE falla el guardado de la anulación del pago 1001 por un error de infraestructura, CUANDO termina la operación, ENTONCES el pago 1001 sigue vigente y el saldo de la cuota sigue en S/ 600.00.
- [NUEVO] (borde, QA-03) DADO QUE un SUPERVISOR anula el pago 1001 con el motivo «  digitación   errónea », CUANDO confirma, ENTONCES la anulación guarda «DIGITACIÓN   ERRÓNEA»: se quitan los espacios exteriores, se conservan los internos y se convierte a mayúsculas. Un motivo de exactamente 500 caracteres tras el TRIM se acepta.
- [NUEVO] (negativo, QA-03) DADO QUE el motivo es «   », está formado solo por tabulaciones o saltos de línea, o tiene 501 caracteres tras el TRIM, CUANDO un SUPERVISOR intenta anular el pago 1001 o el comprobante F001-00045, ENTONCES el sistema no crea la anulación, no trunca el texto e informa el motivo del rechazo sin repetir el texto ingresado.
- [NUEVO] (negativo, API, QA-03) DADO QUE se envía directamente al API una anulación con el motivo «   » o de 501 caracteres, sin pasar por la interfaz, CUANDO el servidor la recibe, ENTONCES la rechaza igual que desde la interfaz y el pago o comprobante queda sin cambios.
- [NUEVO] (negativo, permisos) DADO QUE luis@andina.example es OPERADOR y la cuota 1 de F001-00045 tiene el pago 1001 de S/ 400.00 y saldo S/ 600.00, CUANDO Luis intenta anular el pago 1001 con el motivo «Error», desde la interfaz o directamente al API, ENTONCES el sistema no crea la anulación, el pago 1001 sigue vigente y el saldo sigue en S/ 600.00.

**Reglas de negocio relacionadas:** RN-027, RN-028, RN-029, RN-030, RN-031, RN-032, RN-058, RN-059, RN-060, RN-061, RN-062, RN-084, RN-090, RN-091, RN-123, RN-124, RN-160. Agregadas por QA [NUEVO]: RN-003, RN-008, RN-162 (QA-03).

**Notas:**
- La anulación es una entidad separada; ninguna operación de la aplicación hace UPDATE o DELETE sobre un pago confirmado (PRINCIPIO-006).
- El pago de reemplazo es opcional e independiente: se registra con HU-006 y sus validaciones vigentes (RN-124).
- Si un SUPERVISOR anula el comprobante mientras otro usuario registra un pago, gana la operación que se guarda primero (RN-062, RN-160).

---

### HU-011: Reprogramar una cuota con promesa de pago

**Prioridad:** Should

**Como** usuario de la empresa (cualquier rol), **quiero** registrar una nueva fecha de pago prometida por el cliente o acordada con el proveedor, **para** que el estado, la mora y los avisos de la cuota se basen en el compromiso vigente y quede registro de cada reprogramación (K7).

**Criterios de aceptación:**

- DADO QUE una cuota con saldo positivo vence el 2026-11-10 y la fecha actual es 2026-11-08, CUANDO el usuario la reprograma al 2026-11-20, ENTONCES el sistema registra una promesa ACTIVA para el 2026-11-20 sin aprobación previa, conserva el vencimiento original 2026-11-10, marca la cuota como reprogramada y usa 2026-11-20 como fecha efectiva de vencimiento.
- DADO QUE la fecha efectiva de la cuota es 2026-11-20, CUANDO el usuario la reprograma al 2026-11-20 o a una fecha anterior, ENTONCES el sistema rechaza la reprogramación; y si la nueva fecha es anterior al día de registro en America/Lima también se rechaza, mientras que la fecha del mismo día se acepta si es posterior a la fecha efectiva.
- DADO QUE la cuota tiene saldo S/ 0.00 o su comprobante está anulado, CUANDO el usuario intenta reprogramarla, ENTONCES el sistema la rechaza sin crear promesa ni cambiar el historial o la marca.
- DADO QUE la cuota tiene una promesa ACTIVA para el 2026-11-20, CUANDO el usuario la reprograma al 2026-11-30, ENTONCES la promesa anterior queda REEMPLAZADA y en el historial, existe una sola promesa ACTIVA y la fecha efectiva pasa a 2026-11-30.
- DADO QUE la promesa para el 2026-11-20 no está reemplazada, CUANDO la fecha de cálculo es 2026-11-21 y la cuota sigue con saldo, ENTONCES la promesa se clasifica INCUMPLIDA y la cuota VENCIDA con 1 día de atraso; si la cuota se canceló con pago del 2026-11-18, la promesa es CUMPLIDA.
- DADO QUE la cuota tenía un aviso «Enviado» para la fecha efectiva 2026-11-10, CUANDO se reprograma al 2026-11-20, ENTONCES la cuota puede avisarse para la nueva fecha sin la confirmación de «Reenviar aviso».
- [NUEVO] (borde) DADO QUE una cuota con saldo vence el 2026-11-05, no tiene promesas y la fecha actual es 2026-11-09, CUANDO el usuario la reprograma al 2026-11-09, ENTONCES el sistema registra la promesa y la cuota pasa de VENCIDA a PENDIENTE; una reprogramación al 2026-11-08 se rechaza.
- [NUEVO] (borde) DADO QUE la promesa para el 2026-11-20 quedó CUMPLIDA con un pago del 2026-11-18, CUANDO un SUPERVISOR anula ese pago con fecha de cálculo 2026-11-19, ENTONCES la promesa vuelve a ACTIVA; si la anulación ocurre con fecha de cálculo 2026-11-21, la promesa pasa a INCUMPLIDA.
- [NUEVO] (negativo, concurrencia) DADO QUE un usuario reprograma una cuota con saldo S/ 300.00 mientras otro registra un pago de S/ 300.00 que la cancela, CUANDO el pago se guarda primero, ENTONCES la reprogramación se rechaza sin crear promesa ni marca.
- [NUEVO] (positivo) DADO QUE una cuota reprogramada al 2026-11-20 se cancela con un pago del 2026-11-18, CUANDO el usuario consulta el listado de movimientos, ENTONCES la cuota aparece CANCELADA y conserva la marca de reprogramación.
- [NUEVO] (positivo) DADO QUE un OPERADOR registró una promesa ACTIVA, CUANDO un SUPERVISOR o un ADMINISTRADOR abre el panel de notificaciones, ENTONCES ve esa promesa.
- [NUEVO] (negativo, aislamiento) DADO QUE la cuota 900 pertenece a otra empresa, CUANDO el usuario intenta reprogramarla al 2026-11-20, ENTONCES el sistema responde HTTP 404 igual que para una cuota inexistente y no crea ninguna promesa.
- [NUEVO] (negativo) DADO QUE una cuota con saldo tiene fecha efectiva 2026-11-10, CUANDO se envía directamente al API una reprogramación con la fecha inexistente «2026-02-30» o con «20/11/2026», ENTONCES el sistema la rechaza informando el motivo y no crea promesa ni marca.

**Reglas de negocio relacionadas:** RN-033, RN-034, RN-035, RN-036, RN-045, RN-071, RN-072, RN-073, RN-074, RN-078, RN-080, RN-085, RN-118, RN-160. Agregadas por QA [NUEVO]: RN-021, RN-008, RN-162, RN-198.

**Notas:**
- Funcionalidad posterior al MVP (alcance §3.1). Al entregarla se activan las validaciones MUST RN-080 y RN-118, la visibilidad de promesas de RN-036 y el historial cronológico de RN-078 (si S4 no lo entregó antes).
- La aprobación formal de reprogramaciones está fuera de alcance (O10). No se calcula mora con intereses (O18).
- Una cuota reabierta por la anulación de un pago puede reprogramarse si vuelve a cumplir las condiciones (RN-033).
- [NUEVO] En los criterios, «fecha actual» equivale a la fecha de cálculo en America/Lima que el sistema provee como parámetro (RN-198, PRINCIPIO-007).

---

## E4 — Panel de cartera (M4, S5)

### HU-008: Consultar el panel de cartera y vencimientos

**Prioridad:** Must

**Como** usuario de la empresa (cualquier rol, incluido el dueño o directiva con rol SUPERVISOR o ADMINISTRADOR), **quiero** ver al ingresar cuánto tengo vencido y pendiente por cobrar y por pagar, la proyección de los próximos días y el listado de movimientos, **para** priorizar cada mañana qué cobrar y qué pagar (K1 a K4).

**Criterios de aceptación:**

- DADO QUE en S/ hay cuotas por cobrar VENCIDAS con saldo S/ 4,500.00, por cobrar PENDIENTES con saldo S/ 8,000.00, por pagar PENDIENTES con saldo S/ 2,000.00 y ninguna por pagar VENCIDA, CUANDO el usuario abre el panel con el selector en S/, ENTONCES ve «Vencida por cobrar: S/ 4,500.00», «Vencida por pagar: S/ 0.00», «Pendiente de cobro: S/ 8,000.00» y «Pendiente de pago: S/ 2,000.00»; las cuotas CANCELADAS no suman y ningún total mezcla S/ con US$.
- DADO QUE Ana tiene preferencia personal US$ y su empresa usa S/, y Luis no tiene preferencia, CUANDO cada uno ingresa al panel, ENTONCES el de Ana abre en US$ y el de Luis en S/; si Luis cambia el selector a US$ en esa consulta, al volver a ingresar abre otra vez en S/.
- DADO QUE la fecha de cálculo es 2026-11-04 y el usuario eligió la ventana de 10 días, CUANDO ve la proyección, ENTONCES el gráfico muestra del 2026-11-04 al 2026-11-13 con cobros y pagos en series separadas; el 2026-11-07 sin vencimientos aparece con cobros S/ 0.00 y pagos S/ 0.00, y el 2026-11-06, con una cuota por cobrar de S/ 1,000.00 que tiene un pago de S/ 400.00 y una cuota por pagar de S/ 300.00, muestra cobros S/ 600.00 y pagos S/ 300.00. La misma información está disponible en una tabla accesible.
- DADO QUE el usuario nunca eligió una ventana, CUANDO abre el panel, ENTONCES la proyección usa 7 días; solo se aceptan los valores 7, 10 y 15 (un valor de 30 se rechaza), y la ventana no limita el listado de movimientos ni la lista de cuotas por avisar.
- DADO QUE existen cuotas VENCIDAS con vencimientos 2026-10-01 y 2026-10-20 y PENDIENTES con vencimientos 2026-11-15 y 2026-11-12, CUANDO el usuario ve el listado de movimientos, ENTONCES el orden es 2026-10-01, 2026-10-20, 2026-11-12, 2026-11-15, cada fila con su estado PENDIENTE, VENCIDA o CANCELADA.
- DADO QUE existe el comprobante anulado F001-00050, CUANDO el usuario abre el listado, ENTONCES no aparece; al activar «Incluir comprobantes anulados» aparece con la marca ANULADO y sus cuotas ANULADAS, sin estado de pago vigente, y los cuatro indicadores no cambian.
- DADO QUE el panel se consulta el 2026-11-09 a las 08:15:30 en America/Lima, CUANDO se muestran los resultados, ENTONCES el panel indica «Datos al 09/11/2026, 08:15» y sus indicadores, gráfico y listado corresponden a ese mismo corte; al actualizarlo, todo y la leyenda pasan al nuevo corte.
- DADO QUE un ADMINISTRADOR cambia la moneda por defecto de la empresa a US$, CUANDO un usuario sin preferencia propia ingresa después, ENTONCES el panel abre en US$; un SUPERVISOR u OPERADOR no puede cambiar la moneda por defecto de la empresa ni ver o cambiar la preferencia personal de otro usuario.
- [NUEVO] (borde, lista vacía) DADO QUE la empresa no tiene comprobantes registrados, CUANDO el usuario abre el panel, ENTONCES ve los cuatro indicadores en S/ 0.00, el gráfico con cada día de la ventana en S/ 0.00 para cobros y para pagos, y el listado de movimientos sin filas.
- [NUEVO] (borde) DADO QUE la fecha de cálculo es 2026-11-09 y una cuota por cobrar con saldo S/ 500.00 vence el 2026-11-09, CUANDO el usuario abre el panel, ENTONCES la cuota está PENDIENTE y suma en «Pendiente de cobro»; con fecha de cálculo 2026-11-10 pasa a VENCIDA y suma en «Vencida por cobrar».
- [NUEVO] (borde) DADO QUE la fecha de cálculo es 2026-11-04 y la ventana es de 15 días, CUANDO el usuario ve la proyección, ENTONCES el gráfico va del 2026-11-04 al 2026-11-18; una cuota que vence el 2026-11-19 no aparece en el gráfico, pero sí en el listado de movimientos.
- [NUEVO] (borde) DADO QUE solo existen cuotas vencidas en US$ y el selector está en S/, CUANDO el usuario abre el panel, ENTONCES los indicadores en S/ muestran S/ 0.00 y el selector indica que US$ tiene cuotas vencidas.
- [NUEVO] (negativo, permisos) DADO QUE un OPERADOR envía directamente al API un cambio de la moneda por defecto de la empresa, o de la ventana personal de otro usuario a 10 días, CUANDO el servidor recibe la solicitud, ENTONCES la rechaza sin efectos, aunque la interfaz no muestre esa opción.
- [NUEVO] (negativo, aislamiento) DADO QUE otra empresa tiene cuotas por cobrar VENCIDAS por S/ 9,000.00 y la empresa del usuario no tiene ninguna, CUANDO el usuario abre el panel en S/, ENTONCES ve «Vencida por cobrar: S/ 0.00» y ni el gráfico ni el listado de movimientos incluyen cuotas de la otra empresa.

**Reglas de negocio relacionadas:** RN-021, RN-022, RN-046, RN-047, RN-048, RN-049, RN-069, RN-105, RN-106, RN-107, RN-108, RN-109, RN-110, RN-111, RN-119, RN-120, RN-169, RN-170, RN-171, RN-172, RN-173, RN-174, RN-180, RN-181, RN-182, RN-198, RN-201, RN-205, RN-206, RN-207, RN-208, RN-209, RN-210. Agregadas por QA [NUEVO]: RN-007, RN-008.

**Notas:**
- El selector de moneda indica si la otra moneda tiene cuotas vencidas (alcance M4).
- No hay conversión por tipo de cambio (O6); cada moneda se presenta por separado.
- Sin S1, la fecha efectiva es el vencimiento original vigente (RN-071) y la marca de reprogramación no aparece.
- Candidata a división en sprint: (a) indicadores y selector de moneda, (b) proyección gráfica, (c) listado de movimientos.

---

### HU-012: Consultar el tiempo promedio de cobro del mes

**Prioridad:** Should

**Como** dueño o directiva de la pyme (cualquier rol), **quiero** ver los días promedio de cobro de los comprobantes por cobrar saldados en un mes, **para** observar la evolución del tiempo de los cobros completados como información complementaria de la cartera (K8).

**Criterios de aceptación:**

- DADO QUE en octubre de 2026 se saldaron un comprobante por cobrar emitido el 2026-10-01 y cobrado totalmente el 2026-10-31 (30 días) y otro emitido el 2026-08-17 y cobrado totalmente el 2026-10-01 (45 días), CUANDO el usuario abre el panel con fecha de cálculo 2026-11-06, ENTONCES la tarjeta tiempo promedio de cobro abre con octubre de 2026 y muestra «Tiempo promedio de cobro de comprobantes saldados: 37.50 días».
- DADO QUE ningún comprobante por cobrar se saldó en septiembre de 2026, CUANDO el usuario elige septiembre, ENTONCES la tarjeta muestra «Sin datos».
- DADO QUE el tiempo promedio de cobro de octubre es 37.50 e incluye un comprobante en S/ y otro en US$, CUANDO el usuario cambia el selector de moneda del panel a US$, ENTONCES el tiempo promedio de cobro sigue mostrando 37.50 días.
- DADO QUE un comprobante por cobrar de 2 cuotas tiene la cuota 1 cancelada el 2026-10-10 y la cuota 2 el 2026-10-25, CUANDO se calcula el tiempo promedio de cobro de octubre, ENTONCES su fecha de cobro total es 2026-10-25; si la cuota 2 todavía tiene saldo, el comprobante no participa.
- DADO QUE existen comprobantes por pagar saldados y comprobantes anulados en octubre, CUANDO se calcula el tiempo promedio de cobro, ENTONCES ninguno de ellos participa en el cálculo.
- [NUEVO] (borde) DADO QUE un comprobante por cobrar se cobró totalmente el 2026-10-31 y otro el 2026-11-01, CUANDO se calcula el tiempo promedio de cobro de octubre de 2026, ENTONCES solo participa el primero; el segundo participa en el de noviembre.
- [NUEVO] (borde) DADO QUE el único comprobante por cobrar saldado en octubre de 2026 se emitió y se cobró totalmente el 2026-10-15, CUANDO se calcula el tiempo promedio de cobro de octubre, ENTONCES la tarjeta muestra «Tiempo promedio de cobro de comprobantes saldados: 0.00 días».
- [NUEVO] (negativo) DADO QUE el comprobante cobrado totalmente el 2026-10-31 es el único de octubre y un SUPERVISOR anula su último pago, CUANDO se recalcula el tiempo promedio de cobro de octubre, ENTONCES el comprobante deja de participar y la tarjeta muestra «Sin datos».
- [NUEVO] (positivo) DADO QUE el usuario tiene rol OPERADOR, CUANDO abre el panel, ENTONCES ve la tarjeta tiempo promedio de cobro igual que un SUPERVISOR o un ADMINISTRADOR.

**Criterios adicionales de redondeo (QA-10, decisión del usuario del 2026-11-09):**

- [NUEVO] (borde) DADO QUE los comprobantes elegibles de octubre de 2026 suman 92 días entre emisión y cobro total y son 3, CUANDO se calcula el tiempo promedio de cobro con fecha de cálculo 2026-11-09, ENTONCES la tarjeta muestra «Tiempo promedio de cobro de comprobantes saldados: 30.67 días»; con 91 días entre 3, muestra «Tiempo promedio de cobro de comprobantes saldados: 30.33 días».
- [NUEVO] (borde) DADO QUE los 8 comprobantes elegibles de octubre de 2026 suman 245 días, CUANDO se calcula el tiempo promedio de cobro con fecha de cálculo 2026-11-09, ENTONCES el promedio exacto 30.625 se muestra como «Tiempo promedio de cobro de comprobantes saldados: 30.63 días».

Los casos de redondeo de RN-053 y estos criterios definen resultados esperados para las pruebas automáticas de referencia según PRINCIPIO-007, E-014, sin aprobación humana específica. El método ya está decidido; no se acredita ejecución de pruebas.

**Criterios de selección y alcance (QA-11, decisión del usuario del 2026-11-09):**

- [NUEVO] (positivo) DADO QUE la fecha de cálculo es 2026-11-09, CUANDO se abre el panel, ENTONCES se selecciona octubre; al elegir noviembre se muestra «Mes en curso — datos parciales».
- [NUEVO] (positivo) DADO QUE los únicos comprobantes elegibles de noviembre se emitieron ambos el 2026-10-23 y se cobraron totalmente el 2026-11-02 y el 2026-11-07, CUANDO se consulta noviembre con fecha de cálculo 2026-11-09, ENTONCES se muestra 12.50 días, calculado como (10 + 15) / 2, con la etiqueta de datos parciales.
- [NUEVO] (negativo) DADO QUE la fecha de cálculo es 2026-11-09, CUANDO se intenta consultar diciembre de 2026 desde la interfaz o directamente desde el backend, ENTONCES se impide la selección o se rechaza la solicitud, respectivamente.
- [NUEVO] (borde, lista vacía) DADO QUE no hay comprobantes elegibles en el mes actual, CUANDO se selecciona ese mes, ENTONCES se muestran «Sin datos» y «Mes en curso — datos parciales»; para un mes anterior sin datos se muestra «Sin datos» sin la etiqueta de mes en curso.
- [NUEVO] (borde) DADO QUE la fecha de cálculo en America/Lima es 2027-01-01, CUANDO se abre el panel, ENTONCES se selecciona diciembre de 2026; enero está disponible como mes en curso y febrero está bloqueado.
- [NUEVO] (positivo) DADO QUE dos clientes tienen comprobantes elegibles con tiempos de 10 y 20 días, CUANDO se consulta el indicador de la empresa, ENTONCES muestra 15.00 días; no ofrece filtro ni desglose de este indicador por cliente o proveedor.
- [NUEVO] (negativo, aislamiento) DADO QUE la empresa tiene en octubre de 2026 un único comprobante elegible de 30 días y otra empresa tiene uno de 90 días, CUANDO se calcula el tiempo promedio de cobro de octubre, ENTONCES la tarjeta muestra 30.00 días: los comprobantes de la otra empresa no participan.
- [NUEVO] (negativo) DADO QUE se envía directamente al backend la consulta del mes «2026-13» o «octubre», CUANDO el servidor la recibe, ENTONCES la rechaza por mes inválido y no devuelve ningún valor.

**Alcance e interpretación:** la tarjeta se titula «Tiempo promedio de cobro de comprobantes saldados» y complementa los indicadores de cartera. Solo ofrece el promedio global de la empresa; la consulta por cliente o proveedor y el DSO financiero quedan fuera del proyecto. Los meses terminados se recalculan conforme a RN-088. Los nuevos casos de referencia se implementan como pruebas automáticas trazables a las reglas y criterios correspondientes, sin aprobación humana específica (PRINCIPIO-007, E-014).

**Reglas de negocio relacionadas:** RN-053, RN-147, RN-025, RN-088, RN-090, RN-198, RN-205, RN-206. Agregadas por QA [NUEVO]: RN-084, RN-089, RN-008.

**Notas:**
- Funcionalidad posterior al MVP; puede entregarse sin S1, S3 ni S4 y no forma parte del reporte de vencimientos (alcance §3.1).
- Cálculo puro, determinista, con pruebas automáticas de referencia trazables a las reglas de negocio y cobertura mínima de 80 % (PRINCIPIO-007, E-012, E-014).

---

## E5 — Avisos de vencimiento (M5)

### HU-009: Configurar correo administrativo y copias de avisos

**Prioridad:** Must

**Como** ADMINISTRADOR de la empresa, **quiero** definir el correo administrativo y qué supervisores o administradores reciben copia de los avisos por cobrar y por pagar, **para** que las respuestas de clientes y proveedores lleguen a la empresa y los responsables estén informados de cada aviso.

**Criterios de aceptación:**

- DADO QUE jefe.cobranzas@andina.example es un SUPERVISOR ACTIVO de la empresa, CUANDO el ADMINISTRADOR lo agrega a la lista de copias de avisos por cobrar, ENTONCES el sistema lo guarda y audita el usuario agregado, la lista afectada, el administrador que hizo el cambio y la fecha y hora ISO 8601; la lista de avisos por pagar no cambia.
- DADO QUE luis@andina.example es OPERADOR, CUANDO el ADMINISTRADOR intenta agregarlo a una lista de copias, o intenta escribir a mano la dirección externo@otro.example, ENTONCES el sistema lo rechaza.
- DADO QUE el usuario tiene rol SUPERVISOR u OPERADOR, CUANDO intenta modificar una lista de copias o el correo administrativo, ENTONCES el sistema lo rechaza.
- DADO QUE la lista de copias de avisos por pagar está vacía, CUANDO se envía un aviso por pagar, ENTONCES el correo va al proveedor con copia únicamente al correo administrativo de la empresa.
- DADO QUE jefe.cobranzas@andina.example está en la lista por cobrar, CUANDO es desactivado o cambia a rol OPERADOR, ENTONCES deja de recibir copias desde ese momento y la configuración lo muestra como inactivo hasta que el ADMINISTRADOR lo quite o recupere un rol y estado válidos.
- DADO QUE el correo administrativo es admin@andina.example, CUANDO el ADMINISTRADOR lo cambia a cobranzas@andina.example, ENTONCES el sistema audita el valor anterior, el nuevo, el usuario y la fecha y hora ISO 8601, los avisos ya enviados no se modifican y los nuevos avisos usan cobranzas@andina.example como copia y como dirección de respuesta; un valor vacío o «cobranzas.andina.example» se rechaza.
- [NUEVO] (borde, lista vacía) DADO QUE jefe.cobranzas@andina.example es el único usuario de la lista de copias por cobrar, CUANDO el ADMINISTRADOR lo quita, ENTONCES el sistema guarda la lista vacía y audita el retiro, y los siguientes avisos por cobrar llevan copia solo al correo administrativo.
- [NUEVO] (negativo) DADO QUE maria@andina.example es SUPERVISOR en estado INVITADO, CUANDO el ADMINISTRADOR intenta agregarla a una lista de copias, ENTONCES el sistema lo rechaza porque no es un usuario ACTIVO.
- [NUEVO] (borde) DADO QUE el correo administrativo es ana@andina.example y Ana, ADMINISTRADOR ACTIVA, también está en la lista de copias por cobrar, CUANDO se envía un aviso por cobrar, ENTONCES ana@andina.example recibe una sola copia.
- [NUEVO] (positivo) DADO QUE el 2026-11-05 se envió un aviso con copia a jefe.cobranzas@andina.example, CUANDO el ADMINISTRADOR lo quita de la lista el 2026-11-06, ENTONCES el registro del aviso del 2026-11-05 conserva a jefe.cobranzas@andina.example entre sus destinatarios.
- [NUEVO] (negativo, aislamiento) DADO QUE el usuario 77 es SUPERVISOR ACTIVO de otra empresa, CUANDO el ADMINISTRADOR intenta agregarlo a una lista de copias con ese identificador, ENTONCES el sistema lo rechaza sin revelar que el usuario existe.
- [NUEVO] (negativo, permisos) DADO QUE jefe.cobranzas@andina.example es SUPERVISOR ACTIVO y el correo administrativo es admin@andina.example, CUANDO intenta cambiarlo a otro@andina.example o agregarse a la lista de copias de avisos por pagar, desde la interfaz o directamente al API, ENTONCES el sistema rechaza ambas operaciones, el correo administrativo sigue siendo admin@andina.example y la lista no cambia.

**Reglas de negocio relacionadas:** RN-060, RN-104, RN-134, RN-135, RN-164, RN-165, RN-166, RN-167, RN-168, RN-175, RN-176, RN-177, RN-178, RN-179. Agregadas por QA [NUEVO]: RN-008, RN-042.

**Notas:**
- El correo administrativo es un dato propio de la empresa, independiente de los correos de acceso de sus administradores (RN-166).
- Las maquetas de correo son fijas en esta versión; su edición es la funcionalidad Could C3, no incluida en este backlog.

---

### HU-010: Enviar avisos de vencimiento por correo

**Prioridad:** Must

**Como** usuario de la empresa (cualquier rol), **quiero** seleccionar cuotas pendientes o vencidas con saldo y enviar el aviso por correo al cliente o proveedor, **para** que ningún vencimiento quede sin gestionar (K5).

**Criterios de aceptación:**

- DADO QUE existen cuotas PENDIENTES y VENCIDAS con saldo, incluida una que vence dentro de 45 días, una CANCELADA y otra de un comprobante anulado, CUANDO el usuario abre la lista de cuotas por avisar, ENTONCES ve todas las PENDIENTES y VENCIDAS con saldo (incluida la de 45 días, aunque la ventana del gráfico sea de 7), con sentido, contacto, número de comprobante y de cuota, fecha efectiva de vencimiento y saldo con moneda, ordenadas como en el listado del panel; la CANCELADA y la anulada no aparecen.
- DADO QUE el usuario selecciona las cuotas 1 y 2 de F001-00045 del cliente cliente@distlima.example, ambas por cobrar y vencidas, y escribe el comentario «Favor confirmar fecha de pago», CUANDO pulsa «Enviar aviso», ENTONCES el sistema le muestra «Para: cliente@distlima.example · Copia: admin@andina.example, jefe.cobranzas@andina.example», sin permitirle modificar las copias.
- DADO QUE el usuario confirma ese envío y Resend lo acepta, CUANDO termina la solicitud, ENTONCES se envía un solo correo con la maqueta «por cobrar vencida» que agrupa las 2 cuotas, con dirección de respuesta admin@andina.example; ambas cuotas quedan marcadas «Enviado» con la fecha y hora del envío, se muestra «Aviso enviado» y la bandeja interna registra el intento con fecha y hora ISO 8601, usuario, contacto, cuotas, tipo, comentario, destinatarios y resultado.
- DADO QUE la cuota 2 quedó CANCELADA por un pago registrado entre la selección y la confirmación, CUANDO el usuario confirma el envío, ENTONCES el sistema recalcula la aptitud y envía el correo solo con la cuota 1, devuelve la cuota 2 excluida con motivo CUOTA_CANCELADA y no cambia los intentos históricos.
- DADO QUE el correo administrativo cambió después de que el usuario vio los destinatarios, CUANDO confirma el envío, ENTONCES el sistema no envía el correo y le muestra los destinatarios vigentes para que confirme otra vez.
- DADO QUE la cuota 2 tiene un aviso «Enviado» el 2026-11-05 por Ana para la misma fecha efectiva y el mismo tipo, CUANDO el usuario la selecciona el 2026-11-07, ENTONCES el sistema muestra «Último aviso: 2026-11-05, Ana» y solo envía tras confirmar «Reenviar aviso».
- DADO QUE Resend rechaza el envío o falla la comunicación, CUANDO termina la solicitud, ENTONCES el intento queda NO_ENVIADO con motivo, las cuotas sin aviso exitoso vigente muestran «No Enviado» y «Enviar aviso», no se pierde una marca anterior, el intento queda en la bandeja y se muestra un error persistente con la acción de volver a intentar manualmente; el sistema no reintenta automáticamente.
- DADO QUE la solicitud a Resend agota el plazo de 10 segundos del servidor, CUANDO termina, ENTONCES el intento queda NO_ENVIADO con motivo TIEMPO_ESPERA, se liberan las cuotas y se permite otro intento manual con datos y destinatarios vigentes, sin verificación, espera de 24 horas ni advertencia adicional; no se crea ni elimina una marca «Enviado» anterior.
- DADO QUE el usuario escribe un comentario de 501 caracteres, CUANDO intenta enviar, ENTONCES el sistema lo rechaza; un comentario de 500 caracteres se acepta y uno de solo espacios se trata como sin comentario.
- [NUEVO] (borde, lista vacía) DADO QUE la empresa no tiene cuotas PENDIENTES ni VENCIDAS con saldo, CUANDO el usuario abre la lista de cuotas por avisar, ENTONCES la lista no muestra filas y no hay cuotas para seleccionar ni enviar.
- [NUEVO] (borde) DADO QUE el usuario seleccionó solo la cuota 2 y esta quedó CANCELADA antes de confirmar, CUANDO confirma el envío, ENTONCES el sistema responde 422 SIN_CUOTAS_APTAS, no envía ningún correo, no registra un intento e informa que excluyó la cuota 2 por estar cancelada.
- [NUEVO] (positivo) DADO QUE el usuario selecciona, del mismo cliente, la cuota 1 VENCIDA y la cuota 3 PENDIENTE, CUANDO confirma el envío y Resend lo acepta, ENTONCES salen 2 correos: uno con la maqueta «por cobrar vencida» y otro con «por cobrar por vencer».
- [NUEVO] (borde) DADO QUE el contacto está DESACTIVADO y su cuota 1 sigue VENCIDA con saldo, CUANDO el usuario envía el aviso, ENTONCES el sistema lo envía normalmente.
- [NUEVO] (borde) DADO QUE la cuota 2 tiene un aviso «Enviado» del tipo «por cobrar por vencer» para la fecha efectiva 2026-11-09, CUANDO el 2026-11-10 la cuota ya está VENCIDA y el usuario la selecciona, ENTONCES el sistema la envía con la maqueta «por cobrar vencida» sin pedir la confirmación de «Reenviar aviso», porque cambió el tipo de aviso.
- [NUEVO] (negativo) DADO QUE el correo del contacto cambió de cliente@distlima.example a pagos@distlima.example después de que el usuario vio los destinatarios, CUANDO confirma el envío, ENTONCES el sistema no envía el correo y muestra los destinatarios vigentes para una nueva confirmación.
- [NUEVO] (negativo) DADO QUE el sistema opera en un entorno de pruebas, CUANDO el usuario envía un aviso a cliente@distlima.example, ENTONCES el correo solo llega al buzón de prueba del proyecto y nunca a la dirección del contacto.
- [NUEVO] (positivo) DADO QUE el aviso es de una cuenta por pagar vencida, CUANDO el usuario abre la pantalla de envío, ENTONCES el campo de comentario se muestra desde el inicio y no es obligatorio.
- [NUEVO] (positivo, QA-04) DADO QUE el usuario escribe el comentario «Favor confirmar fecha de pago», CUANDO se envía el aviso, ENTONCES el comentario se guarda en la bandeja y aparece en el correo como «FAVOR CONFIRMAR FECHA DE PAGO»; una llamada directa al API con el texto en minúsculas guarda el mismo valor en mayúsculas.
- [NUEVO] (negativo, aislamiento) DADO QUE la cuota 900 pertenece a otra empresa, CUANDO el usuario envía al API un aviso que incluye la cuota 900, ENTONCES el sistema responde HTTP 404 igual que para una cuota inexistente, no envía ningún correo y no registra ningún intento en la bandeja.
- [NUEVO] (negativo, terminación contractual, C-03; ajustado M-05) DADO QUE la empresa tiene terminación efectiva el 2027-03-31 a las 18:00 (America/Lima), CUANDO a partir de esa hora se intenta un envío nuevo, reenvío o reintento de aviso, ENTONCES el sistema lo rechaza sin llamar al proveedor de correo ni registrar otro intento, y conserva el historial anterior.

- [NUEVO] (concurrencia, M-05) DADO QUE dos usuarios confirman las mismas cuotas al mismo tiempo, CUANDO existe un intento EN_PROCESO con plazo vigente, ENTONCES solo se guarda y envía uno, y el otro recibe INTENTO_EN_PROCESO sin intento adicional.
- [NUEVO] (recuperación, M-05) DADO QUE el proceso cayó después de guardar un intento, CUANDO vence su plazo sin éxito registrado, ENTONCES las lecturas lo muestran como NO_ENVIADO, y antes de un nuevo envío el servidor persiste el cierre y libera las cuotas sin llamar al proveedor por el intento anterior. Una respuesta tardía no modifica ese cierre.
- [NUEVO] (exclusión, M-05) DADO QUE el comprobante se anuló antes de confirmar, CUANDO se intenta enviar o volver a intentar, ENTONCES sus cuotas se excluyen con motivo COMPROBANTE_ANULADO; si no queda ninguna apta, se responde 422 SIN_CUOTAS_APTAS sin guardar intentos ni llamar al proveedor.

**Reglas de negocio relacionadas:** RN-013, RN-039, RN-041, RN-042, RN-043, RN-045, RN-066, RN-067, RN-075, RN-104, RN-112, RN-113, RN-114, RN-115, RN-116, RN-117, RN-120, RN-130, RN-136, RN-137, RN-138, RN-155, RN-157, RN-158, RN-162, RN-164, RN-178, RN-212, RN-213, RN-214, RN-215. Agregadas por QA [NUEVO]: RN-008, RN-152 (solo el rechazo de avisos desde la terminación efectiva; C-03).

**Notas:**
- «Enviado» significa que Resend aceptó el correo, no que el destinatario lo recibió (alcance M5, K5).
- El envío es siempre manual (RN-215); el aviso automático está fuera de alcance (O16). Solo se usan correo y la bandeja interna; WhatsApp, Telegram y SMS están excluidos (PRINCIPIO-009, O4).
- En entornos de prueba los correos solo se envían al buzón de prueba del proyecto (RN-013, PRINCIPIO-011).
- Decisión M-05 (2026-11-10): un intento fallido o con tiempo de espera queda «No Enviado» y permite otro intento manual. Se retira RN-159 y su flujo; el plazo pertenece al servidor, no al navegador.
- Candidata a división en sprint: (a) lista de cuotas por avisar y envío, (b) reenvío, errores/tiempos de espera y bandeja interna.

---

## Historial compartido entre S1 y S4

### HU-017: Consultar el historial cronológico de una cuota

**Prioridad:** Should (se entrega con S1 o con S4, la que llegue primero)

**Estado:** aprobada por decisión del usuario del 2026-11-10 (M-06). Capacidad compartida entre S1 y S4; no incorpora el reporte ni las exportaciones de S4.

**Como** usuario de la empresa (cualquier rol), **quiero** ver en orden cronológico todo lo que pasó con una cuota, **para** entender su situación actual sin reconstruirla a mano.

**Criterios de aceptación:**

- [NUEVO] (positivo) DADO QUE un comprobante por cobrar emitido el 2026-10-01 tiene una cuota de S/ 100.00 con vencimiento 2026-10-15 y pagos de S/ 40.00 del 2026-10-10 y S/ 60.00 del 2026-10-20, CUANDO el usuario abre el historial, ENTONCES ve en orden: emisión (2026-10-01), pago de S/ 40.00 (2026-10-10), paso a VENCIDA (2026-10-16), pago de S/ 60.00 y paso a CANCELADA (2026-10-20).
- [NUEVO] (borde) DADO QUE el pago del 2026-10-10 se registró el 2026-10-21, después del pago del 2026-10-20, CUANDO se muestra el historial, ENTONCES se ordena por la fecha del hecho y no por la de registro; la fecha y hora de registro se muestran solo como dato informativo.
- [NUEVO] (borde) DADO QUE se anula el pago de S/ 60.00, CUANDO se recalcula el historial, ENTONCES muestra la anulación con su importe y la reapertura de la cuota, y deja de mostrar el paso a CANCELADA.
- [NUEVO] (borde) DADO QUE S1 no se ha entregado, CUANDO se muestra el historial, ENTONCES no aparecen eventos de reprogramación.
- [NUEVO] (negativo, aislamiento) DADO QUE la cuota 900 pertenece a otra empresa, CUANDO el usuario solicita su historial, ENTONCES el sistema responde HTTP 404.

- [NUEVO] (positivo, roles, M-06) DADO QUE un OPERADOR registró una reprogramación del 2026-11-10 al 2026-11-20, CUANDO un OPERADOR, SUPERVISOR o ADMINISTRADOR de la misma empresa consulta el historial, ENTONCES ve la reprogramación con ambas fechas y su fecha y hora de registro.
- [NUEVO] (borde, retroactividad, M-06) DADO QUE una cuota de S/ 1,000.00 vence el 2026-10-15 y tenía un pago de S/ 400.00 del 2026-10-10, CUANDO el 2026-10-25 se registra un pago de S/ 600.00 del 2026-10-14, ENTONCES la nueva consulta muestra CANCELADA el 2026-10-14 y deja de mostrar VENCIDA el 2026-10-16, conservando las fechas de registro como información.
- [NUEVO] (borde, empates, M-06) DADO QUE una cuota de S/ 100.00 vence el 2026-10-15, CUANDO recibe un pago de S/ 100.00 el 2026-10-16, ENTONCES muestra el pago y CANCELADA, sin VENCIDA; con un pago de S/ 40.00 muestra el pago y luego VENCIDA. Los demás empates siguen el orden de RN-078.
- [NUEVO] (conservación, M-06) DADO QUE se anula un pago de S/ 60.00, CUANDO se consulta el historial, ENTONCES el pago original permanece marcado como anulado junto con su anulación y su importe; las transiciones se recalculan sin eliminar hechos registrados.
- [NUEVO] (disponibilidad, M-06) DADO QUE no se entregó S1 ni S4, CUANDO se consulta el historial, ENTONCES la ruta responde 404 y la interfaz no ofrece la vista; al entregar cualquiera de las dos capacidades, la vista está disponible sin exigir la otra.

**Reglas de negocio relacionadas:** RN-078, RN-083, RN-084, RN-088, RN-060, RN-008, RN-205, RN-206, RN-198.

---

## Verificación INVEST

| HU | I | N | V | E | S | T | Observación |
|---|---|---|---|---|---|---|---|
| HU-001 | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | Procedimiento interno; base de todas las demás HUs. [NUEVO] S pasa a ⚠️: con QA-06, QA-07 y QA-08 suma 21 criterios e incluye el reenvío interno de invitaciones. Corrección sugerida: división propuesta en notas. |
| HU-002 | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | ✅ | Depende de HU-001 o HU-003 para tener usuarios invitados. Tamaño grande: división propuesta en notas. |
| HU-003 | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | Requiere HU-002 para que el invitado active la cuenta. |
| HU-004 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Solo requiere usuarios con sesión. |
| HU-005 | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | ✅ | Requiere contactos (HU-004). Tamaño grande: división propuesta en notas. |
| HU-006 | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | Requiere comprobantes con cuotas (HU-005). |
| HU-007 | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | Requiere pagos (HU-006) para la anulación de pagos; la anulación de comprobantes sin pagos solo requiere HU-005. |
| HU-008 | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | ✅ | Lee datos de HU-005 y HU-006; puede probarse con datos de prueba. Tamaño grande: división propuesta en notas. |
| HU-009 | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | Requiere usuarios (HU-003); se puede entregar antes o junto con HU-010. [NUEVO] I pasa a ⚠️ por coherencia con la observación: depende de HU-003 para tener SUPERVISORES y ADMINISTRADORES ACTIVOS. |
| HU-010 | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | Requiere cuotas (HU-005) y configuración (HU-009). La integración con Resend aumenta la incertidumbre de estimación. Tamaño grande: división propuesta en notas. |
| HU-011 | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | Post-MVP; requiere cuotas y pagos del MVP y la entrega conjunta del historial HU-017. |
| HU-012 | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | Post-MVP; independiente de S1, S3 y S4. [NUEVO] I pasa a ⚠️: la tarjeta tiempo promedio de cobro vive en el panel de HU-008 y usa los cobros de HU-006. Corrección sugerida: probar el cálculo como función pura con casos de referencia, separado de la tarjeta. |
| HU-017 | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | ✅ | Post-MVP; usa hechos conservados del MVP y se divide en consulta y vista (T-038/T-039). Reutilizable entre S1 y S4. |

**Leyenda:** ✅ cumple · ⚠️ cumple con observación.

- **Independent:** las dependencias marcadas son de datos (orden natural del dominio: empresa → usuarios → contactos → comprobantes → pagos), no de diseño. Cada HU puede desarrollarse y probarse por separado con datos de prueba ficticios.
- **Small:** HU-002, HU-005, HU-008 y HU-010 (y, desde la revisión QA [NUEVO], HU-001) concentran funcionalidades amplias del alcance para respetar el límite original de 12 HUs; M-06 amplía el conjunto aprobado a 13 al incorporar HU-017. Cada una indica en sus notas la división recomendada para planificar sprints (Agente SM / backlog `08`).
- **Estimable:** HU-010 depende del comportamiento de Resend (aceptación, rechazo y tiempo de espera); se recomienda un *spike* técnico corto antes de estimarla.

---

## Matriz de trazabilidad y cobertura

| Funcionalidad de alcance | HUs | Estado |
|---|---|---|
| M1 Registro de contactos y comprobantes | HU-004, HU-005 | Cubierta |
| M2 Cuotas y vencimientos | HU-005 | Cubierta |
| M3 Pagos con anulación auditada | HU-006, HU-007 | Cubierta |
| M4 Panel de cartera y vencimientos | HU-008 | Cubierta |
| M5 Notificación de vencimientos | HU-009, HU-010 | Cubierta |
| M6 Usuarios por empresa con roles | HU-001, HU-002, HU-003, HU-007 (permisos de anulación), HU-009 (configuración) | Cubierta |
| S1 Reprogramación con promesa de pago | HU-011 y HU-017 | Cubierta documentalmente; la entrega exige reprogramación, visibilidad RN-036 e historial RN-078 (M-06). |
| S3 Evaluación de comportamiento de pago | HU-013 (sugerida) [NUEVO] | Pendiente para la siguiente iteración del backlog (RN-054 a RN-056, RN-148). |
| S4 Reporte de vencimientos y exportación | HU-014, HU-015 y HU-016 (sugeridas); HU-017 aprobada y compartida | Reporte y exportaciones pendientes; historial RN-078 cubierto por HU-017 y reutilizable desde S1 (M-06). |
| Procedimiento interno de baja contractual [NUEVO] | HU-018 (sugerida); bloqueo en HU-002 y HU-010 | El bloqueo desde la terminación efectiva de RN-152 está cubierto por HU-002 y HU-010 (C-03); la constancia y la baja son un procedimiento operativo manual fuera del alcance (pregunta 52, resuelta el 2026-11-10). |
| S5 Tiempo promedio de cobro de comprobantes saldados | HU-012 | Cubierta |
| C1 Importación desde Excel | — | No incluida (Could). |
| C3 Maquetas de aviso editables | — | No incluida (Could). |
| O1 a O19 | — | Fuera de alcance: sin HUs. |

**Reglas sin HU directa (por diseño):**
- Reglas transversales de seguridad, datos y cálculo listadas en «Requisitos transversales» (aplican a todas las HUs como *Definition of Done*).
- Procedimientos operativos internos sin interfaz de usuario: baja contractual (RN-152), solicitudes de eliminación de datos personales (RN-151, RN-257). La gestión operativa de claves de datos (RN-237 a RN-242) se retiró por E-015. Por decisión de alcance (M-11, 2026-11-10), RN-151 y RN-257 corresponden al equipo de VenceYa, coordinado con la empresa cliente, fuera del alcance funcional y del backlog de desarrollo; no requieren HU. Su definición operativa y revisión legal permanecen pendientes antes del lanzamiento en la pregunta 31.
- Reglas de S3 y S4, pendientes según la tabla anterior.
- RN-078 tiene HU directa aprobada: HU-017; se entrega con S1 (HU-011) o S4, la que llegue primero. Desde el MVP se conservan sus registros (RN-083).

El Agente QA (`06-user-stories-qa.xml`) validará esta cobertura e identificará reglas sin HU asociada. [NUEVO] Validación hecha el 2026-11-09: ver «Revisión QA».

---

## Revisión QA [NUEVO]

**Agente:** QA Funcional (BMAD), 2026-11-09. **Insumos:** este documento, `03-reglas-de-negocio.md` (248 reglas) y `00-constitucion.md` (PRINCIPIO-001 a PRINCIPIO-012, enmiendas E-001 a E-012). No se eliminó ninguna HU ni ningún criterio.

**Actualización M-06 (2026-11-10):** HU-017 está aprobada y tiene 10 criterios de aceptación; su evaluación se agrega a INVEST y su cobertura a la matriz vigente. Los recuentos de escenarios de HU-001 a HU-012 que siguen son antecedentes de la revisión QA, no una nueva ejecución de pruebas.

[NUEVO] **Segunda pasada (2026-11-09; actualizada M-05, 2026-11-10):** los insumos actuales son 251 reglas vigentes (sin contar las retiradas RN-037, RN-038, RN-040, RN-064, RN-065, RN-068, RN-125 y RN-159). M-05 retira RN-159 y sustituye los criterios de verificación de HU-010; no modifica las enmiendas de la constitución.

### 1. Cobertura de escenarios por HU

| HU | Criterios originales | [NUEVO] | Positivo | Negativo | Borde |
|---|---|---|---|---|---|
| HU-001 | 6 | 15 | ✅ | ✅ (incluye falla técnica y falla o timeout del correo) | ✅ |
| HU-002 | 7 | 11 | ✅ | ✅ (incluye permisos, API directa y respuesta neutra) | ✅ |
| HU-003 | 7 | 12 | ✅ | ✅ (incluye aislamiento, concurrencia, falla técnica y de correo) | ✅ |
| HU-004 | 6 | 7 | ✅ | ✅ (incluye aislamiento y concurrencia) | ✅ (incluye lista vacía) |
| HU-005 | 8 | 11 | ✅ | ✅ (incluye concurrencia, aislamiento y falla técnica) | ✅ |
| HU-006 | 7 | 6 | ✅ | ✅ (incluye aislamiento y falla técnica) | ✅ |
| HU-007 | 7 | 9 | ✅ | ✅ (incluye concurrencia, permisos y falla técnica) | ✅ |
| HU-008 | 8 | 6 | ✅ | ✅ (incluye permisos por API y aislamiento) | ✅ (incluye lista vacía) |
| HU-009 | 6 | 6 | ✅ | ✅ (incluye aislamiento y permisos) | ✅ (incluye lista vacía) |
| HU-010 | 9 | 10 | ✅ | ✅ (incluye falla de Resend, entorno de pruebas y aislamiento) | ✅ (incluye lista vacía) |
| HU-011 | 6 | 7 | ✅ | ✅ (incluye concurrencia y aislamiento) | ✅ |
| HU-012 | 5 | 14 | ✅ | ✅ (incluye aislamiento) | ✅ (incluye lista vacía) |
| **Total** | **82** | **114** | | | |

[NUEVO] Los conteos se recalcularon en la segunda pasada. Los 8 criterios de QA-10 y QA-11 en HU-012 ahora llevan la marca [NUEVO] y su tipo de escenario. La segunda pasada agregó 20 criterios.

Todas las HUs terminan con al menos 3 criterios y cubren los escenarios positivo, negativo y de borde.

### 2. Criterios existentes sin valores concretos

No se reescribieron, para respetar la restricción de solo enriquecer. Se sugiere concretarlos en la próxima revisión del PO:

| HU | Criterio | Observación | Valor sugerido |
|---|---|---|---|
| HU-001 | 4 (correo del primer administrador duplicado) | No indica qué correo ni qué mensaje se muestra. | Usar ana@andina.example (cubierto parcialmente por el [NUEVO] de normalización) y definir el mensaje. |
| HU-002 | 4, segunda oración | «Un usuario INVITADO o DESACTIVADO no puede iniciar sesión» no nombra al usuario ni la respuesta. | luis@andina.example INVITADO recibe el mismo mensaje genérico de RN-103. |
| HU-003 | 2 | No identifica usuarios ni roles concretos. | Luis (OPERADOR) intenta desactivar a carla@andina.example. |
| HU-007 | 3 | No indica qué pago o comprobante intenta anular el OPERADOR. | Pago 1001 de S/ 400.00. |
| HU-009 | 3 | No identifica al usuario ni el cambio intentado. | jefe.cobranzas@andina.example (SUPERVISOR) intenta cambiar el correo administrativo a otro@andina.example. |

[NUEVO] En la segunda pasada, cada uno de estos 5 criterios tiene un criterio [NUEVO] equivalente con valores concretos en su HU. Los criterios originales se conservan. El mensaje exacto de rechazo del correo duplicado (HU-001) queda para la redacción de UX.

### 3. Verificación contra la constitución

| Hallazgo | Principio | Resultado |
|---|---|---|
| La fila de cifrado de «Requisitos transversales» omitía el correo de acceso de usuarios. | PRINCIPIO-004; RN-011 | **Corregido** en la tabla, marcado [NUEVO]. |
| Los rechazos por registros de otra empresa responden HTTP 404 en todas las HUs. | PRINCIPIO-003 (403 o 404); RN-008 (404) | Coherente: RN-008 elige 404 dentro de lo que admite el principio. |
| HU-006 muestra el saldo vigente desde una consulta autorizada, no desde el error. | PRINCIPIO-005 | Coherente. |
| HU-007 y HU-011 nunca modifican ni borran pagos; las correcciones son registros separados. | PRINCIPIO-006 | Coherente. |
| Las fechas de cálculo se fijan como parámetro en los criterios; las sesiones (HU-002) usan el reloj del servidor por RN-149, que no es un cálculo financiero. | PRINCIPIO-007 | Coherente. |
| Avisos solo por correo y bandeja interna; las pruebas usan el buzón del proyecto. | PRINCIPIO-009, PRINCIPIO-011 | Coherente. |
| La proyección de HU-008 tiene una tabla accesible equivalente. | PRINCIPIO-010 | Coherente. |
| Los datos de ejemplo son ficticios con dominio `.example`. | PRINCIPIO-005; RN-194 | Coherente. El ejemplo de la constitución usa `example.com`; ambos son dominios reservados. |

| [NUEVO] La fila de cifrado de «Requisitos transversales» omitía las copias en destinatarios de avisos. | PRINCIPIO-004 | **Corregido** en la tabla, marcado [NUEVO]. |
| [NUEVO] HU-004 permite eliminar un contacto sin comprobantes (RN-130), pero no define qué pasa con su historial de ediciones (RN-129), cuando la conservación de historiales es un requisito transversal. | PRINCIPIO-006; RN-150 | **Resuelta (2026-11-10)**: QA-13 → pregunta 51, opción B: el historial se conserva. |
| [NUEVO] HU-011 usa «fecha actual» en lugar de «fecha de cálculo». | PRINCIPIO-007; RN-198 | Coherente en el fondo; se aclaró la equivalencia en las notas de HU-011. |

Ningún criterio, original ni [NUEVO], contradice la constitución.

### 4. Ambigüedades detectadas (para `05-preguntas-abiertas.md`)

| # | HU | Tema | Detalle |
|---|---|---|---|
| QA-01 | HU-002, HU-003 | Límite exacto de los enlaces | **Resuelta (2026-11-09):** límite exclusivo medido con el reloj del servidor desde la emisión; el enlace vence en el instante exacto de las 72:00:00 (invitación) o de los 60:00 min (recuperación) y la vigencia se comprueba al canjear (RN-098, RN-102; criterios [NUEVO] en HU-002). |
| QA-02 | HU-002 | Recuperación con correo inexistente | **Resuelta (2026-11-09):** respuesta idéntica exista o no la cuenta, envío solo a usuarios ACTIVOS, un solo enlace vigente y máximo 3 envíos por hora (RN-258, RN-259 y RN-260). |
| QA-03 | HU-007 | Motivo de anulación | **Resuelta (2026-11-09):** se valida con RN-162: TRIM (incluidas tabulaciones, saltos de línea y espacios no separables), mayúsculas, obligatorio, de 1 a 500 caracteres, espacios internos conservados y sin otra restricción de caracteres; un motivo de solo espacios se rechaza (RN-162, RN-030, glosario #22; criterios [NUEVO] en HU-007). |
| QA-04 | HU-010 | Comentario en mayúsculas | **Resuelta (2026-11-09):** el comentario se guarda y se envía en mayúsculas (RN-162; criterio [NUEVO] en HU-010). |
| QA-05 | HU-004 | Nombres de contacto | **Resuelta (2026-11-09):** se admiten también dígitos y los signos «.», «,», «&», «-», «'», «(», «)» y «/», con al menos una letra (RN-162, glosario #5). |
| QA-06 | HU-001 | Razón social de la empresa | **Resuelta (2026-11-09):** mismo formato que el nombre del contacto: obligatoria, de 1 a 250 caracteres, con TRIM, mayúsculas, espacios internos reducidos a uno, al menos una letra y los mismos signos; no es única (RN-162, RN-094, glosario #49; criterios [NUEVO] en HU-001). |
| QA-07 | HU-001 | Reenvío de la invitación del primer administrador | **Resuelta (2026-11-09):** VenceYa solo reenvía si el primer administrador sigue INVITADO y no existe ningún ADMINISTRADOR ACTIVO. El reenvío no reactiva DESACTIVADOS; con otro administrador activo, la gestión corresponde a este; sin ninguno, se trata como incidencia para revisión interna (RN-095, RN-098, RN-099, RN-100). |
| QA-08 | HU-001, HU-003 | Falla al enviar la invitación | **Resuelta (2026-11-09):** si el envío falla o no se puede confirmar, no se revierte la creación; el usuario queda INVITADO con su enlace vigente, la pantalla lo informa y el reenvío es solo manual, sin reintentos automáticos (RN-098; criterios [NUEVO] en HU-001 y HU-003). |
| QA-09 | HU-003 | Reactivación de usuarios | **Resuelta (2026-11-09):** quien ya definió su contraseña vuelve a ACTIVO con ella; quien nunca la definió pasa a INVITADO con enlace nuevo de 72 horas (RN-098, RN-099; criterios [NUEVO] en HU-003). |
| QA-10 | HU-012 | Redondeo del tiempo promedio de cobro | **Resuelta (2026-11-09):** dos decimales con redondeo mitad hacia arriba, una sola vez sobre el promedio final (RN-053, RN-147). Casos de referencia definidos como resultados esperados para las pruebas automáticas, sin aprobación humana específica (PRINCIPIO-007, E-014); ejecución pendiente. |
| QA-11 | HU-012 | Meses seleccionables | **Resuelta (2026-11-09):** meses anteriores y actual admitidos; actual con «Mes en curso — datos parciales»; futuros rechazados en interfaz y backend; último mes completo por defecto (RN-147). |
| QA-12 | HU-013 (sugerida) | Permiso del indicador S3 | **Resuelta (2026-11-09):** todos los roles lo consultan, en el detalle y en el catálogo de contactos (RN-261 y nueva fila en RN-060). |
| QA-13 [NUEVO] | HU-004 | Historial de un contacto eliminado | **Resuelta el 2026-11-10 → pregunta 51 (opción B).** RN-130 permite eliminar un contacto sin comprobantes; su historial de ediciones de campos (RN-129) se conserva sin cambios y cifrado, y las copias de datos personales se atienden por el procedimiento interno de RN-151. La fila de conservación de «Requisitos transversales» (PRINCIPIO-006, RN-150) dice que no se eliminan historiales. |

Las ambigüedades abiertas se registraron el 2026-11-09 en `05-preguntas-abiertas.md`: QA-01 → pregunta 43 (resuelta el 2026-11-09 en RN-098 y RN-102: límite exclusivo, vigencia comprobada al canjear), QA-03 → 44 (resuelta el 2026-11-09 en RN-162 y RN-030: TRIM, mayúsculas, de 1 a 500 caracteres), QA-06 → 45 (resuelta el 2026-11-09 en RN-162: mismo formato que el nombre del contacto), QA-07 → 46 (resuelta el 2026-11-09 en RN-095 y RN-098: INVITADO y sin ADMINISTRADOR ACTIVO; reenvío sin reactivación), QA-08 → 47 (resuelta el 2026-11-09 en RN-098: sin reversión, usuario INVITADO y reenvío manual), QA-09 → 48 (resuelta el 2026-11-09 con RN-098: contraseña definida → ACTIVO; sin ella → INVITADO con enlace nuevo). QA-11 → pregunta 50 se resolvió el mismo día en RN-147. QA-10 → pregunta 49 se resolvió el mismo día respecto del método; E-014 retira la aprobación humana específica de sus casos de referencia y mantiene su implementación como pruebas automáticas trazables a las reglas; no acredita ejecución. [NUEVO] QA-13 se registró el 2026-11-09 como pregunta 51 y se resolvió el 2026-11-10 (opción B: se conserva el historial).

### 5. Reglas de negocio sin HU asociada

**Antecedente histórico de las pasadas QA (previo a M-06):** los recuentos de las tablas siguientes corresponden a sus fechas y no incluyen la aprobación posterior de HU-017. M-06 agrega RN-078 a HU-011 e incorpora HU-017 (9 reglas relacionadas); la matriz de `08-backlog-reporte.md` recoge el recálculo vigente.

Se cruzaron las 248 reglas de `03-reglas-de-negocio.md` con la línea «Reglas de negocio relacionadas» de cada HU:

| Situación | Cantidad | Reglas | Tratamiento |
|---|---|---|---|
| Referenciadas por al menos una HU | 176 | — | Cubiertas. |
| Solo en «Requisitos transversales» (*Definition of Done*) | 49 | RN-007, RN-008, RN-011, RN-012, RN-014, RN-023, RN-052, RN-141, RN-142, RN-150, RN-189 a RN-197, RN-199, RN-200, RN-202 a RN-204, RN-216, RN-218 a RN-221, RN-223 a RN-242 | Correcto por diseño. RN-052 (exportación sin datos de otra empresa) se asigna además a HU-015. |
| Sin HU: S3 | 4 | RN-054, RN-055, RN-056, RN-148 | HU-013 sugerida. |
| Sin HU: S4 | 16 | RN-050, RN-051, RN-076, RN-077, RN-078, RN-079, RN-144, RN-145, RN-146, RN-163, RN-183 a RN-188 | HU-014 a HU-017 sugeridas. RN-079 es **MUST**, pero solo aplica cuando se entregue S4. |
| Procedimientos internos (recuento de la primera pasada) | 3 | RN-151, RN-152, RN-257 | Actualización de alcance: RN-151 y RN-257 quedan sin HU por diseño, como gestión interna de VenceYa fuera del backlog (M-11); la pregunta 31 conserva el pendiente operativo y legal previo al lanzamiento. RN-152: bloqueo en HU-002 y HU-010; constancia y baja como procedimiento manual, sin desarrollar HU-018 (C-03, pregunta 52). |

No hay referencias a reglas inexistentes ni retiradas (RN-037, RN-038 y RN-125).

[NUEVO] **Recuento de la segunda pasada, actualizado por M-05 (251 reglas vigentes):**

| Situación | Cantidad | Reglas | Tratamiento |
|---|---|---|---|
| Referenciadas por HU-001 a HU-012 | 181 | — | Cubiertas, incluidas RN-258 a RN-260 en HU-002 y RN-152 (solo el bloqueo desde la terminación efectiva) en HU-002 y HU-010 (C-03). |
| Solo en HUs sugeridas | 23 | S3: RN-054, RN-055, RN-056, RN-148, RN-261 · S4: RN-050, RN-051, RN-052, RN-076 a RN-079, RN-144 a RN-146, RN-163, RN-183 a RN-188 · Baja contractual: RN-150 | HU-013 a HU-018 sugeridas. Siguen pendientes de aprobación del PO. |
| Solo en «Requisitos transversales» | 27 | RN-012, RN-014, RN-023, RN-141, RN-193 a RN-197, RN-199, RN-200, RN-202 a RN-204, RN-216, RN-218, RN-221, RN-225, RN-227, RN-228, RN-230, RN-240, RN-262 a RN-266 (E-015: se retiraron RN-011, RN-142, RN-189 a RN-192, RN-219, RN-220, RN-223, RN-224, RN-226, RN-229, RN-231 a RN-239, RN-241 y RN-242) | Correcto por diseño (*Definition of Done*). |
| Sin HU por diseño: procedimiento operativo interno | 2 | RN-151, RN-257 | Gestión interna del equipo de VenceYa, coordinada con la empresa cliente, fuera del alcance funcional y del backlog de desarrollo (M-11 cerrado documentalmente). La pregunta 31 conserva la definición operativa y revisión legal previas al lanzamiento; no bloquea las tareas de desarrollo ni exige una HU. |

Las referencias funcionales no incluyen las reglas retiradas RN-040, RN-064, RN-065, RN-068 ni RN-159; esta última queda solo como antecedente de la decisión M-05. No hacen falta HUs sugeridas nuevas.

Por las decisiones del 2026-11-09 se agregaron al catálogo RN-258, RN-259 y RN-260 (cubiertas por HU-002) y RN-261 (cubierta por HU-013 sugerida), y se modificaron RN-162, RN-060 y RN-030 (QA-03), además de los ejemplos de RN-059 y RN-061. El catálogo quedó con 252 reglas vigentes; la retirada de RN-159 por M-05 (2026-11-10) lo deja en 251. El recálculo actual da 181 referenciadas por HU-001 a HU-012 y 45 solo transversales: RN-152 ya está en las HUs aprobadas y RN-007 no se cuenta otra vez como exclusiva transversal.

---

## HUs sugeridas [NUEVO]

Propuestas del Agente QA para las reglas sin cobertura. HU-017 fue aprobada por decisión del usuario del 2026-11-10 (M-06) y trasladada a «Historial compartido entre S1 y S4». HU-013 a HU-016 siguen pendientes de aprobación; HU-018 no se desarrolla por la decisión de alcance de la pregunta 52. Las propuestas pendientes requieren aprobación antes de entrar al backlog (`08-backlog.md`). Las HUs de S3 y S4 son Should y no se incorporan al MVP (alcance §3.1).

### HU-013: Consultar el indicador de comportamiento de pago de un cliente [NUEVO]

**Prioridad:** Should (S3)

**Como** usuario de la empresa (cualquier rol; decisión QA-12), **quiero** ver un puntaje de 0 a 100 y su clasificación para cada cliente en su detalle y en el catálogo de contactos, calculado con su historial de pagos en VenceYa, **para** decidir a quién dar crédito y a quién cobrar primero.

**Criterios de aceptación:**

- [NUEVO] (positivo) DADO QUE el cliente «DISTRIBUIDORA LIMA» tiene 12 pagos no anulados de cuentas por cobrar (8 a tiempo, 2 con 5 días de atraso y 2 con 20 días) y ninguna cuota VENCIDA, CUANDO el usuario consulta su indicador, ENTONCES el sistema muestra 88 «Buen pagador», que resulta de (800 + 150 + 100) / 12 = 87.5, redondeado hacia arriba.
- [NUEVO] (positivo) DADO QUE además ese cliente tiene una cuota VENCIDA con 45 días de atraso y otra con 70, CUANDO se recalcula, ENTONCES el sistema muestra 77 «Regular» (1,075 / 14 = 76.79).
- [NUEVO] (borde) DADO QUE un cliente tiene exactamente 3 pagos a tiempo, CUANDO se consulta, ENTONCES muestra 100 «Buen pagador»; con solo 2 elementos muestra «Sin historial suficiente» y ningún valor.
- [NUEVO] (borde) DADO QUE los puntajes de un cliente son 100, 75, 75, 75 y 75, CUANDO se calcula, ENTONCES muestra 80 «Buen pagador»; con 100, 100, 75, 50, 75 y 75 (79.17) muestra 79 «Regular».
- [NUEVO] (borde) DADO QUE un pago tiene 7 días de atraso, CUANDO se puntúa, ENTONCES vale 75; con 8 días vale 50, con 30 vale 50, con 31 vale 25, con 60 vale 25 y con 61 vale 0.
- [NUEVO] (borde) DADO QUE el cliente tiene 15 pagos no anulados, CUANDO se calcula, ENTONCES solo participan los 12 de fecha de pago más reciente y, a igual fecha, se desempata por orden de registro.
- [NUEVO] (negativo) DADO QUE una cuota tiene vencimiento original 2026-11-10 y promesa al 2026-11-20, CUANDO se paga el 2026-11-20, ENTONCES el pago cuenta con 10 días de atraso (puntaje 50): la reprogramación no reduce el atraso.
- [NUEVO] (negativo) DADO QUE el contacto también es proveedor y tiene pagos anulados y cuotas de comprobantes anulados, CUANDO se calcula su indicador, ENTONCES no participan los pagos de cuentas por pagar, los pagos anulados ni las cuotas de comprobantes anulados.
- [NUEVO] (positivo) DADO QUE se recalcula el indicador del contacto 42 dos veces con el mismo histórico y fecha de cálculo 2026-11-06, CUANDO se comparan los resultados, ENTONCES son idénticos y no se consultó ninguna fuente externa.
- [NUEVO] (positivo, QA-12) DADO QUE el indicador de «DISTRIBUIDORA LIMA» es 88, CUANDO un OPERADOR, un SUPERVISOR o un ADMINISTRADOR abre el detalle del contacto o el catálogo de contactos, ENTONCES todos ven «88 · Buen pagador».
- [NUEVO] (negativo, aislamiento) DADO QUE el contacto 88 pertenece a otra empresa, CUANDO el usuario solicita su indicador, ENTONCES el sistema responde HTTP 404 igual que para un contacto inexistente.

**Reglas de negocio relacionadas:** RN-054, RN-055, RN-056, RN-148, RN-261, RN-060, RN-008, RN-020, RN-088, RN-090, RN-198; PRINCIPIO-007, PRINCIPIO-008.

**Notas:** cálculo puro, con casos de referencia y cobertura mínima del 80 % (PRINCIPIO-007). La explicación detallada del indicador está fuera de alcance (constitución).

---

### HU-014: Consultar el reporte de vencimientos en pantalla [NUEVO]

**Prioridad:** Should (S4)

**Como** usuario de la empresa (cualquier rol), **quiero** ver las cuotas por cobrar o por pagar agrupadas en por vencer, vencidas, reprogramadas con promesa activa y canceladas del periodo, **para** revisar la cartera en un solo reporte con sus totales por moneda.

**Criterios de aceptación:**

- [NUEVO] (positivo) DADO QUE la fecha de cálculo es 2026-11-04, la cuota 1 de F001-00046 tiene vencimiento original 2026-11-06 y promesa ACTIVA al 2026-11-15, y la cuota 1 de F001-00040 tiene una promesa incumplida del 2026-11-02, CUANDO el usuario consulta el reporte por cobrar, ENTONCES F001-00046 aparece solo en «reprogramadas con promesa activa» y F001-00040 en «vencidas» con la indicación «promesa incumplida».
- [NUEVO] (positivo) DADO QUE el grupo «canceladas del periodo» contiene una cuota de S/ 500.00 y otra de US$ 100.00, CUANDO se muestra el reporte, ENTONCES el grupo informa sus totales por separado con la etiqueta «Importe de cuotas canceladas en el periodo», y ningún total suma S/ con US$ ni mezcla los saldos de los grupos 1 a 3 con los importes del grupo 4.
- [NUEVO] (borde) DADO QUE el usuario elige el periodo 2026-10-15 a 2026-10-15, CUANDO consulta, ENTONCES el sistema lo acepta como periodo de un solo día e incluye en «canceladas del periodo» la cuota cuya cancelación real fue el 2026-10-15.
- [NUEVO] (negativo) DADO QUE el usuario elige como inicio 2026-10-31 y como fin 2026-10-01, o la fecha inexistente 2026-02-30, CUANDO consulta, ENTONCES el sistema rechaza el periodo indicando el motivo y no muestra resultados.
- [NUEVO] (negativo) DADO QUE existe el comprobante anulado F001-00050, CUANDO el usuario abre el reporte, ENTONCES F001-00050 no aparece y no existe la opción «Incluir comprobantes anulados».
- [NUEVO] (positivo) DADO QUE el usuario tiene rol OPERADOR, CUANDO abre el reporte en pantalla, ENTONCES lo ve igual que un SUPERVISOR.
- [NUEVO] (borde) DADO QUE S1 no se ha entregado, CUANDO se consulta el reporte, ENTONCES el grupo «reprogramadas con promesa activa» no tiene filas y sus resúmenes están en cero.
- [NUEVO] (borde) DADO QUE la consulta se genera el 2026-11-09 a las 08:15:30, CUANDO se muestran los resultados, ENTONCES el reporte indica «Datos al 09/11/2026, 08:15» y todos sus grupos y totales corresponden a ese corte.

**Reglas de negocio relacionadas:** RN-076, RN-079, RN-188, RN-060, RN-071, RN-074, RN-075, RN-088, RN-090, RN-047, RN-205 a RN-209.

---

### HU-015: Exportar el listado de movimientos a CSV y Excel [NUEVO]

**Prioridad:** Should (S4)

**Como** SUPERVISOR o ADMINISTRADOR, **quiero** exportar las cuotas de los comprobantes emitidos en un periodo, **para** analizarlas fuera de VenceYa o entregarlas a contabilidad.

**Criterios de aceptación:**

- [NUEVO] (positivo) DADO QUE un SUPERVISOR elige el periodo 2026-10-01 a 2026-10-31, CUANDO exporta a CSV y a .xlsx, ENTONCES ambos archivos tienen las mismas filas, una por cuota de los comprobantes emitidos en ese periodo, y excluyen un comprobante emitido el 2026-11-01.
- [NUEVO] (borde) DADO QUE un comprobante se emitió el 2026-09-25 con una cuota que vence el 2026-10-15 y se pagó el 2026-11-02, CUANDO se exporta el 2026-11-05, ENTONCES la cuota aparece solo en la exportación de septiembre de 2026, con estado CANCELADA.
- [NUEVO] (negativo, permisos) DADO QUE el usuario tiene rol OPERADOR, CUANDO intenta exportar el listado, ENTONCES el sistema devuelve un error de permiso y no genera ningún archivo.
- [NUEVO] (negativo) DADO QUE la fecha inicial es posterior a la final, o falta alguna de las dos, CUANDO el usuario exporta, ENTONCES el sistema rechaza el periodo y no genera archivo.
- [NUEVO] (borde) DADO QUE existe F001-00050 anulado, emitido en octubre y por cobrar, CUANDO el usuario abre las opciones de exportación, ENTONCES «Incluir comprobantes anulados» está desactivada y el archivo excluye F001-00050; si la activa, F001-00050 aparece con el estado de pago vacío y «Sí» en la columna de comprobante anulado.
- [NUEVO] (borde) DADO QUE el panel está en S/ y el periodo tiene una cuota de S/ 500.00 y otra de US$ 100.00, CUANDO se exporta, ENTONCES el archivo contiene ambas cuotas con su moneda y ninguna fila de total que las sume.
- [NUEVO] (borde) DADO QUE el usuario abre las opciones de exportación, CUANDO revisa el sentido, ENTONCES está seleccionado «ambos» por defecto; si elige «por cobrar», el archivo solo contiene cuotas por cobrar.
- [NUEVO] (positivo) DADO QUE se exporta a CSV, CUANDO se abre el archivo, ENTONCES está codificado en UTF-8 con BOM, usa coma como delimitador y CRLF como fin de registro, todos los campos van entre comillas dobles, los importes se escriben como «1000.50» y las fechas como AAAA-MM-DD.
- [NUEVO] (negativo, datos) DADO QUE se exporta cualquier periodo, CUANDO se revisan las columnas, ENTONCES el archivo no incluye el correo, el teléfono ni la dirección del contacto, ni movimientos de otra empresa.
- [NUEVO] (borde) DADO QUE el número de documento es «00045» y se exporta a .xlsx, CUANDO se abre la celda, ENTONCES es una celda de texto explícito que conserva los ceros iniciales.

**Reglas de negocio relacionadas:** RN-050, RN-051, RN-052, RN-079, RN-144, RN-145, RN-146, RN-163, RN-183, RN-184, RN-185, RN-186, RN-187, RN-205 a RN-207.

---

### HU-016: Exportar el reporte de vencimientos [NUEVO]

**Prioridad:** Should (S4)

**Como** SUPERVISOR o ADMINISTRADOR, **quiero** descargar el reporte de vencimientos en CSV y Excel con sus grupos y resúmenes, **para** compartirlo con la gerencia o con contabilidad.

**Criterios de aceptación:**

- [NUEVO] (positivo) DADO QUE un ADMINISTRADOR consultó el reporte por cobrar de octubre de 2026, CUANDO lo exporta a CSV y a .xlsx, ENTONCES cada fila indica su grupo, los metadatos incluyen las fechas inicial y final, el sentido, la fecha de cálculo y el corte en America/Lima, y los resúmenes por grupo y moneda aparecen separados de las filas de cuotas.
- [NUEVO] (borde) DADO QUE entre la consulta en pantalla y la exportación se registra un pago que cancela una cuota, CUANDO se genera el archivo, ENTONCES el archivo refleja el nuevo corte con su propia leyenda «Datos al …» y la pantalla abierta conserva los datos de la consulta anterior.
- [NUEVO] (negativo, permisos) DADO QUE el usuario tiene rol OPERADOR, CUANDO intenta exportar el reporte a .xlsx, ENTONCES recibe un error de permiso y no se genera ningún archivo.
- [NUEVO] (negativo) DADO QUE el periodo es inválido (inicio posterior al fin), CUANDO el usuario exporta, ENTONCES el sistema no genera archivo e indica el motivo.
- [NUEVO] (borde) DADO QUE existe el comprobante anulado F001-00050, CUANDO se exporta el reporte, ENTONCES no aparece y no existe opción para incluirlo.

**Reglas de negocio relacionadas:** RN-077, RN-079, RN-163, RN-188, RN-076, RN-205 a RN-209.

---

### HU-018: Formalizar la terminación del contrato y la baja de una empresa [NUEVO]

**Prioridad:** Must (procedimiento interno, igual que HU-001; RN-152 es una regla MUST)

**Como** integrante autorizado del equipo de VenceYa, **quiero** registrar la terminación del contrato de una empresa y ejecutar su baja, **para** bloquear el acceso en la fecha acordada y eliminar sus datos en la nube sin afectar a otras empresas.

**Criterios de aceptación:**

- [NUEVO] (positivo) DADO QUE el representante autorizado de «COMERCIAL ANDINA SAC» solicitó la terminación, CUANDO el equipo registra la constancia con empresa, fundamento, evidencia, responsable, fecha y hora de registro, y fecha efectiva 2026-12-01 00:00 (America/Lima), ENTONCES el sistema la guarda y la empresa sigue operando con normalidad hasta esa hora.
- [NUEVO] (positivo) DADO QUE se alcanza el 2026-12-01 00:00, CUANDO un usuario ACTIVO de la empresa intenta iniciar sesión, usar una sesión abierta o enviar un aviso pendiente, ENTONCES el sistema lo rechaza sin efectos de negocio y las sesiones quedan invalidadas.
- [NUEVO] (negativo) DADO QUE el equipo intenta registrar el 2026-11-20 una terminación con fecha efectiva 2026-11-15, CUANDO guarda, ENTONCES el sistema la rechaza por ser retroactiva.
- [NUEVO] (negativo, permisos) DADO QUE un ADMINISTRADOR de la empresa usa la aplicación, CUANDO busca la opción de terminar el contrato o eliminar los datos de su empresa, ENTONCES no existe ninguna pantalla ni endpoint disponible para los roles de empresa.
- [NUEVO] (borde) DADO QUE la empresa no exportó sus históricos antes del bloqueo, CUANDO el equipo ejecuta la baja en la modalidad en la nube dentro de los 30 días siguientes a la terminación efectiva, ENTONCES se eliminan juntos todos los datos de la empresa, sin registros sueltos, y los datos de las demás empresas no cambian.
- [NUEVO] (borde) DADO QUE el contrato terminó pero la baja aún no se ejecuta, CUANDO alguien intenta editar o borrar parcialmente datos de la empresa, ENTONCES el sistema lo impide y conserva los datos íntegros.

**Reglas de negocio relacionadas:** RN-152, RN-150, RN-101, RN-149; PRINCIPIO-003, PRINCIPIO-006 (E-008, E-011).

**Notas:** [NUEVO] **No se desarrolla como funcionalidad** (decisión del usuario del 2026-11-10, pregunta 52). El bloqueo desde la terminación efectiva (acceso, sesiones, enlaces y avisos) se implementa en HU-002 y HU-010. Fijar la fecha efectiva, conservar la constancia, ejecutar la limpieza de datos y reaplicar las bajas al restaurar un respaldo son un procedimiento operativo manual del equipo de VenceYa, con un script propio fuera del backlog y sin segunda aprobación. Automatizarlo más adelante sería un requerimiento nuevo. Los criterios de esta HU se conservan como referencia de lo que ese procedimiento debe cumplir. La eliminación dentro de 30 días aplica a la modalidad en la nube; en la modalidad local, la empresa administra la retención de su instalación y respaldos (`03-reglas-de-negocio.md`). Las solicitudes formales de eliminación de datos personales de un contacto (RN-151, RN-257) no tienen HU por decisión de alcance (M-11, 2026-11-10): el equipo de VenceYa las gestiona internamente, en coordinación con la empresa cliente, fuera del alcance funcional y del backlog de desarrollo. La pregunta 31 conserva el pendiente de definición operativa y revisión legal antes del lanzamiento, no una dependencia de desarrollo. La gestión operativa de claves de datos (RN-237 a RN-242) se retiró por E-015.
