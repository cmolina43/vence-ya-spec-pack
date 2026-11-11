# 06 - Diseño de seguridad de datos

Decisión E-015 aprobada el 2026-11-10; sustituye el diseño de cifrado de A-20 (E-005). Complementa PRINCIPIO-004, PRINCIPIO-005, RN-139 a RN-141, RN-143, RN-216 a RN-218, RN-221, RN-222, RN-225, RN-227, RN-228, RN-230, RN-240, RN-243 a RN-253 y RN-262 a RN-266. Especifica el diseño; no acredita una implementación ni pruebas ejecutadas.

Este documento sirve de base para el documento de seguridad del art. 47 del D.S. 016-2024-JUS. Ese documento debe aprobarse formalmente con fecha cierta e incluir los procedimientos organizativos pendientes en las preguntas 26, 31 y 41; este archivo por sí solo no lo sustituye.

## Inventario de datos personales y sistemas

| Entidad o copia | Datos personales | Titulares | Comparación requerida |
|---|---|---|---|
| Contacto | Nombre; correo; teléfono y dirección cuando existan; información económica vinculada (comprobantes, cuotas, saldos, pagos y avisos) | Clientes y proveedores personas naturales y personas de contacto de empresas | Correo normalizado, único dentro de su empresa, incluidos desactivados |
| Empresa | RUC y razón social cuando identifican a una persona natural con negocio; correo administrativo | Empresa cliente o su titular | RUC de 11 dígitos, único globalmente |
| Usuario | Correo de acceso; rol y estado; hash de contraseña | Usuarios de las empresas clientes | Correo normalizado, único globalmente en todos los estados |
| Copias | Historial de ediciones, eventos de auditoría, destinatarios de avisos y contenido de los avisos (nombre e importes) | Los mismos titulares | No aplica |
| Registros de acceso | Ninguno: solo identificadores internos, acción y fecha y hora (RN-264) | Usuarios, indirectamente por su identificador | No aplica |

No se tratan datos sensibles. Los contactos no registran DNI ni RUC (RN-126) y no se guardan números de cuenta ni CCI (RN-006). Sistemas que tratan los datos en la modalidad en la nube: Neon (base de datos y respaldos, `us-east-1`), Railway (backend, frontend y secretos, US East) y Resend (envío de correos; recibe nombres, correos e importes de los avisos). El flujo transfronterizo hacia Estados Unidos se revisa en la pregunta 31.

## Medidas de protección

Referencias: PRINCIPIO-004, E-015.

No se aplica cifrado por campo en la aplicación: el reglamento no lo exige y la protección se basa en el aislamiento por empresa con RLS (PRINCIPIO-003), los permisos por rol (RN-060), la trazabilidad de accesos (RN-263 a RN-266), TLS 1.2 o superior y la custodia de las credenciales de base de datos. En la modalidad en la nube se asume el cifrado en reposo del almacenamiento de Neon; se verifica en su documentación antes del lanzamiento (pregunta 26). En la modalidad local, el cifrado del disco y de los respaldos lo decide la empresa cliente y se le recomienda.

Una copia de la base o de un respaldo contiene los datos personales en claro. Por eso el acceso directo a la base de producción se limita al personal operativo habilitado, con credenciales propias y separadas por ambiente, y nunca se copian datos reales a desarrollo, pruebas, fixtures o prompts (PRINCIPIO-005).

## Comparaciones exactas

Referencias: RN-139, RN-140, RN-216 a RN-218, RN-221, RN-222 y RN-225.

La normalización quita espacios exteriores y convierte el correo a minúsculas; no elimina puntos ni sufijos con signo +. Usar una única función en altas, cambios, autenticación y recuperación, y guardar el correo ya normalizado. Tratar el RUC como cadena de 11 dígitos sin conversión numérica.

La unicidad la garantizan índices únicos de PostgreSQL: `usuarios (correo)` y `empresas (ruc)` globales, y `contactos (empresa_id, correo)`. Una restricción `CHECK` impide guardar un correo sin normalizar. Las restricciones únicas impiden carreras entre solicitudes; una comprobación previa por sí sola no basta. Al editar se excluye el propio registro de la comprobación de duplicados.

## Inicio de sesión

1. Normalizar el correo ingresado.
2. Localizar la cuenta sin filtrar por una empresa suministrada por el solicitante; el correo de usuario es globalmente único.
3. Verificar contraseña y estado ACTIVO; aplicar las restricciones de acceso vigentes.
4. Establecer la empresa desde la cuenta autenticada. Todas las consultas posteriores a contactos quedan limitadas a esa empresa.
5. Registrar el inicio de sesión en los registros de acceso (RN-263).

No solicitar RUC ni correo administrativo. La recuperación de acceso usa la misma localización por correo. No exponer si un correo pertenece a otra empresa en mensajes de autenticación o de recuperación.

## Autorización y cambios de rol

Aplicar en el servidor la matriz de RN-060: comprobar sesión vigente, rol, empresa y propiedad de las preferencias personales. Los roles de negocio no conceden acceso a secretos (RN-230) ni facultan omitir validaciones de negocio.

Todo cambio efectivo de rol cierra las sesiones del afectado en todos sus dispositivos y pestañas, incluso si gana permisos o cambia su propio rol. Guardar el mismo rol no exige este cierre. El rol, la invalidación y la auditoría se guardan como una unidad (RN-161 y RN-160), protegiendo al último administrador activo (RN-100). El nuevo rol se usa tras un nuevo inicio de sesión. El servidor rechaza las credenciales de sesiones anteriores desde la confirmación del cambio; su fecha de vencimiento original no puede mantenerlas válidas.

Ordenar consistentemente el cambio y las operaciones concurrentes que modifican registros: si la operación se completa primero, conserva sus efectos válidos; si el cambio se completa primero, la operación de la sesión anterior se rechaza sin efectos de negocio. No basta comprobar permisos al recibir la solicitud ni ocultar botones. Verificar con los casos de aceptación del cierre QA2-15.

El reglamento exige verificar los privilegios asignados al menos cada seis meses (art. 46). Esa revisión es un procedimiento organizativo del documento de seguridad (pregunta 31); la aplicación ya permite al ADMINISTRADOR consultar los usuarios de su empresa y sus roles.

## Contraseñas y tokens

Referencias: RN-143, RN-243 a RN-253 y RN-262.

Usar Argon2id con sal aleatoria individual generada por la biblioteca. Guardar el hash codificado con su sal, versión y parámetros; como base mínima, 19 MiB de memoria, 2 iteraciones y paralelismo 1. Medir el costo en el ambiente de despliegue y aumentarlo si es viable; no disminuir esa base sin revisión del diseño. No aplicar al secreto la normalización de correos. Un cambio o recuperación genera un nuevo hash, nunca recupera el anterior.

Los tokens de sesión, invitación y recuperación son aleatorios de 256 bits, generados con un generador criptográfico. En la base solo se guarda su SHA-256; el valor original viaja únicamente en la cookie o en el enlace enviado.

## Trazabilidad de accesos

Referencias: PRINCIPIO-005, RN-263 a RN-266; art. 46 del D.S. 016-2024-JUS.

Un interceptor común escribe en `registros_acceso` el inicio y cierre de sesión y cada consulta, alta, edición, anulación, eliminación o exportación de contactos, comprobantes, cuotas, pagos, avisos o usuarios. Cada fila guarda usuario, empresa, acción, entidad o recurso, identificador afectado cuando existe y fecha y hora; nunca datos personales, importes, criterios de búsqueda ni textos libres. En las escrituras se guarda en la misma transacción que el cambio; en las consultas y exportaciones, antes de entregar la respuesta. Si la escritura falla, la operación no se completa.

La aplicación solo inserta: un trigger rechaza UPDATE y DELETE, y ningún rol de negocio los consulta. Se conservan al menos dos años y están disponibles de inmediato para el personal operativo, que los consulta directamente en la base. Al cumplirse el plazo pueden eliminarse mediante un procedimiento operativo documentado. Como no contienen datos personales, la baja contractual no los elimina antes de los dos años; esta conservación se confirma en la revisión legal (pregunta 31).

## Secretos

Referencias: RN-141, RN-227, RN-228 y RN-230.

Los secretos (clave de firma de sesiones, clave de Resend y credenciales de base de datos) se generan con aleatoriedad criptográfica cuando los genera el equipo, se custodian en variables de entorno fuera de PostgreSQL y del repositorio, y se separan por ambiente. Solo el servicio autorizado y el personal operativo habilitado acceden a ellos; los roles ADMINISTRADOR, SUPERVISOR y OPERADOR no conceden ese acceso. El escáner de secretos en CI impide subirlos al repositorio (PRINCIPIO-011). Ante la sospecha de compromiso de un secreto, se reemplaza y se invalidan las sesiones afectadas, según el procedimiento de incidentes pendiente en la pregunta 26.

## Respaldos y recuperación

Referencias: RN-240; art. 51 del D.S. 016-2024-JUS.

Los respaldos se realizan con frecuencia mínima semanal y se verifica su integridad. En la nube los realiza Neon dentro de la ventana de restauración de su plan; en la modalidad local los responsables se definen en la pregunta 41. Una prueba de recuperación restaura un respaldo en una base aislada y verifica la integridad de los datos, el inicio de sesión de un usuario y la unicidad de correos y RUC antes de darlo por válido. Toda restauración que vaya a habilitarse completa además el control manual de bajas contractuales descrito a continuación (RN-152; QA2-11).

## Permisos de eliminación y baja contractual

Decidido el 2026-11-06 (QA2-01, E-008). El rol de base de datos que usa la aplicación no tiene permiso de DELETE sobre pagos, anulaciones de pagos y de comprobantes ni usuarios, ni de UPDATE sobre pagos confirmados. Las pruebas de PRINCIPIO-006 se ejecutan con ese rol. La baja contractual (RN-152) se ejecuta con un rol separado, reservado al procedimiento interno del equipo de VenceYa, cuyo uso queda auditado y que ningún endpoint de la aplicación puede invocar. El registro de baja se conserva en el archivo operativo de bajas del equipo de VenceYa, fuera de la base de datos del sistema y de su proceso de restauración. El equipo operativo es responsable de mantenerlo actualizado, bajo acceso restringido y recuperable junto con las constancias que sustentan las bajas. Puede mantenerse como un registro manual en el repositorio documental operativo; no requiere una pantalla ni un módulo nuevo. Debe conservarse mientras exista cualquier respaldo administrado capaz de recuperar datos de la empresa eliminada.

## Control manual de bajas antes de habilitar una restauración

**Ampliación QA2-29 y ajuste QA2-12 (2026-11-08), servicio en la nube:** conservar en el archivo operativo externo, desde su formalización, las constancias de terminación con su fecha y hora efectiva, fundamento, evidencia y responsable, bajo acceso restringido. Al hacerse efectiva la terminación, impedir nuevos accesos, invalidar sesiones y bloquear operaciones y avisos pendientes de la empresa, aun con usuarios ACTIVO. La baja se gestiona internamente según RN-152; conservar los datos íntegros hasta su ejecución. La empresa exporta y conserva los históricos disponibles mediante las funciones existentes antes de la terminación efectiva; VenceYa no genera ni entrega un paquete contractual ni verifica descargas o recepciones. La baja no requiere constancia de entrega de exportación. Antes de habilitar una restauración, revisar también terminaciones efectivas cuya baja esté pendiente y reaplicar sus bloqueos; las eliminaciones se rigen por el procedimiento de baja. Si no puede verificarse el registro de terminaciones, mantener la copia aislada. La restauración no reinicia los 30 días contados desde la terminación efectiva, y que el cliente no haya exportado no amplía ese plazo (E-011).

Decisión del usuario (2026-11-07; QA2-11). El responsable autorizado de la restauración debe:

1. Mantener la copia restaurada aislada, con accesos de usuarios, integraciones y trabajadores de avisos detenidos. Este control se aplica a toda copia administrada que se restaure, incluidas las de contingencia o validación.
2. Consultar el registro externo vigente de bajas y sus constancias; no usar solo un registro recuperado junto con el respaldo. Si no está disponible o no puede verificarse su vigencia, mantener bloqueada la apertura.
3. Identificar las bajas posteriores al momento del respaldo y volver a ejecutar la eliminación completa de RN-152 sobre esas empresas. Comprobar además que ninguna empresa dada de baja en el registro permanezca en la copia. Si una empresa ya está ausente, no requiere otra eliminación.
4. Verificar que no queden datos ni usuarios habilitados de las empresas dadas de baja. Descartar sus avisos pendientes recuperados y sanear cualquier cola, caché o copia derivada administrada que pudiera volver a exponerlos. Mantener intactos los datos de las demás empresas.
5. Registrar el respaldo utilizado, la revisión del registro vigente, las referencias internas de las bajas reaplicadas o la ausencia de bajas que reaplicar, el resultado, la fecha y el responsable. Hacer una revisión final del registro antes de abrir; cualquier baja ejecutada durante la recuperación debe quedar cubierta.
6. Habilitar accesos y trabajadores solo tras completar satisfactoriamente la revisión. Si falla una eliminación o verificación, mantener la restauración aislada y corregir o repetir el procedimiento.

Los respaldos originales no se depuran registro por registro: caducan conforme a su retención. El control se realiza sobre las copias restauradas antes de habilitarlas y no concede a la empresa dada de baja una opción de recuperación. Las solicitudes formales de eliminación de datos personales (RN-151, RN-257) son gestionadas internamente por el equipo de VenceYa, en coordinación con la empresa cliente, fuera del alcance funcional y del backlog de desarrollo (M-11, decisión del usuario del 2026-11-10). La definición operativa y revisión legal permanecen pendientes antes del lanzamiento en la pregunta 31; este diseño de restauración de bajas contractuales no las resuelve. El cierre documental de M-11 no acredita ese procedimiento como operativo.

## Parámetros operativos por modalidad

Decididos el 2026-11-06 (pregunta 26) y ajustados por E-015 (2026-11-10):

| Parámetro | En la nube | Local (on-premise) |
|---|---|---|
| Secretos | Variables de entorno de Railway, en un entorno separado para producción, pruebas y desarrollo. | Pendiente (pregunta 41). |
| Cifrado en reposo | Supuesto: almacenamiento de Neon cifrado por el proveedor; se verifica antes del lanzamiento (pregunta 26). | Recomendado; lo decide la empresa cliente. |
| Respaldos | La ventana de restauración del plan contratado en Neon, con frecuencia al menos semanal. | Responsables y frecuencia pendientes (pregunta 41); al menos semanal. |
| Registros de acceso | Al menos dos años en la base de datos de producción. | Igual que en la nube. |

## Pendientes organizativos

Se concretan antes de producción y forman parte del documento de seguridad o de los procedimientos del equipo; no son funcionalidades por desarrollar:

- Pregunta 26: quién administra los secretos y el procedimiento ante incidentes de seguridad de datos personales (documentación de todo incidente, aviso inmediato a la empresa cliente cuando VenceYa actúa como encargado y notificación a la ANPD dentro de 48 horas en los supuestos del art. 34).
- Pregunta 31: documento de seguridad aprobado con fecha cierta, revisión semestral de privilegios, inscripción de bancos de datos, flujo transfronterizo, procedimiento de derechos ARCO con sus plazos y aviso de privacidad.
- Pregunta 41: secretos y respaldos de la modalidad local.

## Criterios de aceptación

- El mismo correo normalizado se acepta como contacto en empresas distintas y se rechaza como segundo contacto en la misma, incluso con solicitudes concurrentes.
- Correos de usuarios duplicados y RUC duplicados se rechazan globalmente por índice único.
- El acceso funciona con espacios exteriores y diferencias de mayúsculas en el correo; no pide empresa ni RUC y rechaza usuarios no activos.
- Recuperación y registro de usuarios aplican la misma normalización.
- Dos contraseñas iguales generan hashes distintos y ambas se verifican correctamente.
- La base guarda solo el hash de los tokens de sesión, invitación y recuperación; un token recibido se valida por su hash.
- Cada inicio y cierre de sesión y cada consulta, alta, edición, anulación, eliminación o exportación de datos personales genera su registro de acceso, sin datos personales; si el registro falla, la operación no se completa.
- Con el rol de la aplicación, un UPDATE o DELETE sobre un registro de acceso, un pago o una anulación se rechaza.
- Ningún secreto está en la base de datos ni en el repositorio; producción y pruebas usan secretos distintos.
- Un respaldo restaurado en una base aislada conserva la integridad de los datos, permite iniciar sesión y mantiene la unicidad.
- El procedimiento de baja elimina todos los datos de negocio de una empresa y no cambia los de otra, dentro de los 30 días desde la terminación efectiva; no exige registro de exportación ni confirmación de descarga o recepción. La empresa es responsable de exportar los históricos disponibles antes del bloqueo, mediante las funciones existentes (QA2-12; E-011).
- Una respuesta de error del API por un pago que supera el saldo no contiene importes, y el log tampoco.
- Restaurar un respaldo anterior a una baja no restablece datos, acceso ni avisos de esa empresa: se revisa el registro externo, se reaplica la baja y se deja constancia antes de habilitar el servicio.
- Si el registro externo no está disponible o la reaplicación falla, la copia permanece aislada; repetir el procedimiento no afecta a otras empresas ni falla porque una empresa ya esté ausente.

## Referencias técnicas y normativas

Las medidas de seguridad, la trazabilidad, el documento de seguridad, los respaldos y la notificación de incidentes siguen el [D.S. 016-2024-JUS, Reglamento de la Ley 29733](https://www3.congreso.gob.pe/Docs/DGP/DIDP/files/ds_016-2024-jus.pdf) (art. 34 a 36 y 46 a 52). El almacenamiento de contraseñas y la configuración base de Argon2id se apoyan en [OWASP: Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). Los ámbitos de unicidad son decisiones de VenceYa establecidas en RN-096, RN-097 y RN-127.
