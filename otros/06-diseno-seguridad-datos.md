# 06 - Diseño de seguridad de datos

Decisión A-20 aprobada el 2026-11-06. Complementa PRINCIPIO-004, RN-011, RN-139 a RN-143 y sus obligaciones extraídas por QA2-31: RN-189 a RN-192 y RN-216 a RN-253. Especifica el diseño; no acredita una implementación ni pruebas ejecutadas.

## Alcance

| Entidad | Campos cifrados | Comparación requerida |
|---|---|---|
| Contacto | Correo; teléfono y dirección cuando existan | Correo normalizado, único dentro de su empresa, incluidos desactivados |
| Empresa | RUC y correo administrativo | RUC de 11 dígitos, único globalmente |
| Usuario | Correo de acceso | Correo normalizado, único globalmente en todos los estados |

Las copias persistidas de estos valores en auditorías, historiales y destinatarios de avisos también se cifran. Los contactos no registran DNI ni RUC. El correo administrativo no requiere un índice de búsqueda por esta decisión. No se agregan búsquedas parciales por correo o RUC ni se restringen las búsquedas por nombre. Los datos se descifran solo para usos funcionales autorizados; siguen vigentes los permisos y el aislamiento por empresa.

## Cifrado y almacenamiento

Referencias: RN-011 y RN-189 a RN-192.

Usar AES-256-GCM mediante una biblioteca criptográfica mantenida. Guardar por valor: texto cifrado, identificador de clave, versión del formato, IV de 96 bits y etiqueta de autenticación de 128 bits. Asegurar que el IV no se repita bajo la misma clave, también entre procesos y después de restaurar respaldos.

El IV se genera aleatoriamente con un generador criptográfico en cada operación de cifrado; no se usan contadores ni valores derivados del registro. Cada versión de clave admite como máximo 2³² operaciones de cifrado (NIST SP 800-38D para IV aleatorios). El sistema cuenta las operaciones por versión de clave y exige rotar antes de alcanzar el límite. Con el volumen previsto (supuesto S7, unas 80 operaciones al mes por empresa) el límite queda muy por encima del uso, pero el contador debe existir y probarse.

Vincular mediante datos autenticados adicionales el ambiente, la entidad, el identificador estable del registro, el campo y la empresa cuando corresponda. Un cambio de contexto o una etiqueta inválida debe impedir el descifrado. No usar cifrado determinista con un IV fijo para permitir búsquedas. No persistir valores normalizados en texto plano como auxiliares.

## Comparaciones exactas

Referencias: RN-139, RN-140 y RN-216 a RN-226.

La normalización quita espacios exteriores y convierte el correo a minúsculas; no elimina puntos ni sufijos con signo +. Usar una única función versionada en altas, cambios y autenticación. Tratar el RUC como cadena de 11 dígitos sin conversión numérica.

Calcular HMAC-SHA-256 completo sobre una codificación inequívoca de una tupla con versión, ambiente, propósito, ámbito y valor normalizado. Usar una clave de búsqueda distinta de la de cifrado. Propósitos separados: correo de contacto, correo de usuario y RUC de empresa. Para contactos, el ámbito incluye el identificador de empresa; para usuarios y empresas es global.

Guardar referencia y versión de clave en una estructura indexable. Exigir unicidad por propósito, ámbito y versión de clave. Las referencias revelan igualdad dentro de su ámbito: son información protegida, no anonimización. No devolverlas a clientes ni registrarlas en logs.

Registrar o editar el dato cifrado y sus referencias en una transacción. Las restricciones únicas deben impedir carreras entre solicitudes; una comprobación previa por sí sola no basta. Al editar se excluye el propio registro de la comprobación de duplicados.

## Inicio de sesión

1. Normalizar el correo ingresado y calcular su referencia de usuario.
2. Localizar la cuenta sin filtrar por una empresa suministrada por el solicitante; el correo de usuario es globalmente único.
3. Verificar contraseña y estado ACTIVO; aplicar las restricciones de acceso vigentes.
4. Establecer la empresa desde la cuenta autenticada. Todas las consultas posteriores a contactos quedan limitadas a esa empresa.

No solicitar RUC ni correo administrativo. La recuperación de acceso usa la misma localización por correo. No exponer si un correo pertenece a otra empresa en mensajes de autenticación o de recuperación.

## Autorización y cambios de rol

Aplicar en el servidor la matriz de RN-060: comprobar sesión vigente, rol, empresa y propiedad de las preferencias personales. Los roles de negocio no conceden acceso a claves (RN-230) ni facultan omitir validaciones de negocio.

Todo cambio efectivo de rol cierra las sesiones del afectado en todos sus dispositivos y pestañas, incluso si gana permisos o cambia su propio rol. Guardar el mismo rol no exige este cierre. El rol, la invalidación y la auditoría se guardan como una unidad (RN-161 y RN-160), protegiendo al último administrador activo (RN-100). El nuevo rol se usa tras un nuevo inicio de sesión. El servidor rechaza las credenciales de sesiones anteriores desde la confirmación del cambio; su fecha de vencimiento original no puede mantenerlas válidas.

Ordenar consistentemente el cambio y las operaciones concurrentes que modifican registros: si la operación se completa primero, conserva sus efectos válidos; si el cambio se completa primero, la operación de la sesión anterior se rechaza sin efectos de negocio. No basta comprobar permisos al recibir la solicitud ni ocultar botones. Verificar con los casos de aceptación del cierre QA2-15.

## Contraseñas

Referencias: RN-143 y RN-243 a RN-253.

Usar Argon2id con sal aleatoria individual generada por la biblioteca. Guardar el hash codificado con su sal, versión y parámetros; como base mínima, 19 MiB de memoria, 2 iteraciones y paralelismo 1. Medir el costo en el ambiente de despliegue y aumentarlo si es viable; no disminuir esa base sin revisión del diseño. No aplicar al secreto la normalización de correos. Un cambio o recuperación genera un nuevo hash, nunca recupera el anterior.

## Custodia y rotación

Referencias: RN-141, RN-142 y RN-227 a RN-242.

El equipo operativo de VenceYa administra un gestor externo de secretos o claves. Separar producción, pruebas y desarrollo, y claves de cifrado y búsqueda. Autorizar al servicio por identidad y mínimo privilegio; los roles ADMINISTRADOR, SUPERVISOR y OPERADOR no conceden acceso al gestor. Auditar operaciones administrativas sin incluir secretos.

Para cifrado: nuevas escrituras usan la versión nueva; las lecturas eligen la versión guardada. Migrar en lotes verificables sin cambiar el valor de negocio. Para búsqueda: desplegar lectura de ambas versiones y escritura de ambas referencias, manteniendo la referencia antigua obligatoria para toda escritura mientras se completa la nueva. Rellenar las referencias nuevas, verificar cobertura y unicidad, pasar las consultas a la nueva versión y retirar la anterior solo después de que todos los escritores y registros usen la nueva. No habilitar escritores que produzcan solo una versión incompatible con los demás.

Conservar las claves necesarias para respaldos retenidos bajo acceso controlado. Una restauración se realiza aislada, valida versiones, reconstruye referencias y migra antes de abrir el servicio. Además, debe completar el control manual de bajas contractuales descrito a continuación (RN-152; QA2-11). Conservar el formato de normalización utilizado o proporcionar una migración explícita. Ante compromiso, restringir acceso a la versión afectada, activar sustitución y migración; no mantenerla disponible para uso ordinario solo por compatibilidad.

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

Los respaldos originales no se depuran registro por registro: caducan conforme a su retención. El control se realiza sobre las copias restauradas antes de habilitarlas y no concede a la empresa dada de baja una opción de recuperación. Las solicitudes de eliminación de datos personales de RN-151 siguen sujetas al procedimiento pendiente de la pregunta 31; esta decisión no lo define.

## Parámetros operativos por modalidad

Decididos el 2026-11-06 (pregunta 26):

| Parámetro | En la nube | Local (on-premise) |
|---|---|---|
| Gestor de secretos | Variables de entorno de Railway, en un entorno de Railway separado para producción, pruebas y desarrollo, con claves distintas por propósito (cifrado y búsqueda). | Pendiente (pregunta 41). |
| Rotación | Como máximo cada 12 meses, o antes si se acerca el límite de uso o ante sospecha de compromiso. | Igual que en la nube. |
| Asignación de IV y límite de uso | IV aleatorio de 96 bits; máximo 2³² cifrados por versión de clave. | Igual que en la nube. |
| Retención de respaldos | La ventana de restauración del plan contratado en Neon. Las claves necesarias para esa ventana se conservan según RN-239. | La define la empresa (RN-150); pendiente cómo se custodian las claves de sus respaldos (pregunta 41). |

Siguen pendientes (pregunta 26) quién administra los secretos, el procedimiento ante incidentes y la verificación de que Railway permite auditar los accesos y cambios de variables, como exigen RN-232 y RN-233. Si no lo permite, debe definirse un control complementario. Si el gestor no está disponible, rechazar la operación dependiente sin guardar datos en claro.

## Criterios de aceptación

- El almacenamiento y sus copias históricas no contienen los campos protegidos en texto plano.
- El mismo correo normalizado se acepta como contacto en empresas distintas y se rechaza como segundo contacto en la misma, incluso con solicitudes concurrentes.
- Correos de usuarios duplicados y RUC duplicados se rechazan globalmente.
- El acceso funciona con correo cifrado, espacios exteriores y diferencias de mayúsculas; no pide empresa ni RUC y rechaza usuarios no activos.
- Recuperación y registro de usuarios aplican la misma normalización.
- Cambiar etiqueta, texto cifrado o contexto autenticado impide el descifrado.
- La falta de claves no activa almacenamiento en claro ni revela datos en errores.
- La rotación mantiene lectura, acceso y unicidad mientras conviven versiones y tras retirar la anterior.
- Un respaldo anterior a la rotación se restaura de forma aislada y queda utilizable tras migrar.
- Dos contraseñas iguales generan hashes distintos y ambas se verifican correctamente.
- Con el rol de la aplicación, un DELETE sobre un pago o una anulación se rechaza.
- El procedimiento de baja elimina todos los datos de una empresa y no cambia los de otra, dentro de los 30 días desde la terminación efectiva; no exige registro de exportación ni confirmación de descarga o recepción. La empresa es responsable de exportar los históricos disponibles antes del bloqueo, mediante las funciones existentes (QA2-12; E-011).
- Una respuesta de error del API por un pago que supera el saldo no contiene importes, y el log tampoco.
- Restaurar un respaldo anterior a una baja no restablece datos, acceso ni avisos de esa empresa: se revisa el registro externo, se reaplica la baja y se deja constancia antes de habilitar el servicio.
- Si el registro externo no está disponible o la reaplicación falla, la copia permanece aislada; repetir el procedimiento no afecta a otras empresas ni falla porque una empresa ya esté ausente.

## Referencias técnicas

La elección de cifrado autenticado, la separación de claves y su custodia se apoya en [OWASP: Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html). El almacenamiento de contraseñas y la configuración base de Argon2id se apoyan en [OWASP: Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). Los ámbitos de unicidad son decisiones de VenceYa establecidas en RN-096, RN-097 y RN-127.
