# 00 - Constitución del proyecto VenceYa

Principios no negociables. Ningún agente de IA ni ningún humano puede violarlos. Cambiar un principio requiere una enmienda explícita de este documento.

Todos los principios están vigentes desde su publicación. Una marca de pendiente señala un valor o una aprobación por confirmar, no suspende el principio: se aplica con el valor escrito hasta que una enmienda lo cambie. Una marca de pendiente no bloquea un merge salvo que el principio diga lo contrario.

---

PRINCIPIO-001: Idioma único en español
Todo el código (identificadores, comentarios), los mensajes de commit, la documentación y la interfaz de usuario están en español. Verificable con revisión humana y con una regla de lint que marque identificadores en inglés en el código de dominio.
Ejemplo de cumplimiento: `function calcularSaldoPendiente(cuenta)` y el commit `feat: agregar cálculo de saldo pendiente por cuota`.
Ejemplo de violación: `function calculateBalance(account)` o un commit `fix: update invoice logic`.

PRINCIPIO-002: Stack tecnológico fijo
El backend es Node.js con NestJS, la base de datos es PostgreSQL y el frontend es React con shadcn/ui. La producción admite dos modalidades de instalación con el mismo stack: en la nube, con la base de datos PostgreSQL alojada en Neon y el backend y el frontend en Railway; o local (on-premise), con la base de datos, el backend y el frontend en el servidor de la empresa cliente. Verificable revisando `package.json` y la configuración de conexión en cada merge; cualquier dependencia de otro motor de base de datos o framework de frontend falla la revisión.
Ejemplo de cumplimiento: un módulo nuevo de cobranzas implementado como controlador y servicio de NestJS que consulta PostgreSQL.
Ejemplo de violación: añadir MongoDB o Vue para una pantalla nueva sin enmienda de este documento.

PRINCIPIO-003: Aislamiento total por empresa
Cada empresa que usa VenceYa solo puede gestionar las cobranzas y pagos de su propia empresa. Toda consulta a datos de negocio filtra por el identificador de empresa del usuario autenticado. Verificable con tests automatizados que intentan leer o modificar datos de otra empresa y deben recibir 403 o 404.
Ejemplo de cumplimiento: un usuario de la empresa A pide el cliente 42 de la empresa B y recibe 404, igual que si el cliente no existiera.
Ejemplo de violación: un endpoint `GET /clientes/:id` que devuelve el cliente sin validar la empresa del token.

PRINCIPIO-004: Cifrado de datos sensibles
Se confirma AES-256-GCM para cifrar antes de persistir los siguientes campos: correo, teléfono y dirección de contactos cuando existan; RUC y correo administrativo de empresas; y correo de acceso de usuarios. La obligación también cubre las copias persistidas de esos campos en historiales, destinatarios de avisos y auditorías. No se solicitan DNI ni RUC a los contactos. Las contraseñas se almacenan mediante hash específico para contraseñas con sal individual, nunca con cifrado reversible. Todo el tráfico usa TLS 1.2 o superior.
Las comparaciones exactas sobre correo y RUC usan referencias protegidas, sin copias en texto plano: correo de contacto dentro de su empresa, correo de usuario y RUC de empresa con unicidad global. El acceso requiere solo correo y contraseña. Las claves de cifrado y búsqueda se custodian fuera de la base de datos y del repositorio, separadas por propósito y ambiente, con acceso restringido, versiones y rotación que preserve la lectura y recuperación de respaldos. El cifrado exige un valor de inicialización que no se repita con la misma clave y verificación de integridad al descifrar.
Verificable mediante pruebas de almacenamiento, acceso con correo cifrado, unicidad por ámbito, rechazo de datos cifrados alterados y rotación y recuperación de datos. El diseño y los criterios de aceptación se detallan en `06-diseno-seguridad-datos.md` y RN-139 a RN-143.
Ejemplo de cumplimiento: la columna `ruc` guarda un valor cifrado con AES-256-GCM y la API responde solo por HTTPS.
Ejemplo de violación: guardar el correo de acceso en texto plano, conservar una copia sin cifrar para buscarlo o exponer la API por HTTP.

PRINCIPIO-005: Datos personales fuera de logs, prompts y repositorio
Los datos personales reales de clientes, proveedores y personas de contacto nunca se escriben en logs, en prompts de agentes de IA, en fixtures del repositorio ni en mensajes de error. La protección comprende toda información que identifique o permita identificar a una persona natural, así como información económica vinculada a ella: por ejemplo, nombres, DNI, RUC cuando identifica a una persona natural, teléfono, correo, dirección, deudas, saldos y pagos. Esta lista es ilustrativa, no exhaustiva; también comprende esos datos dentro de objetos completos. En los campos de texto libre que completa el usuario (comentarios, motivos u otros), quien los ingresa decide y responde por el contenido que escribe: el sistema no lo busca, depura ni sustituye, y ese texto sigue sin escribirse en logs, mensajes de error, prompts ni fixtures. La mención de DNI y RUC no exige solicitarlos a los contactos.
Para diagnóstico se usan eventos, identificadores internos y códigos de error, sin adjuntar datos personales ni importes vinculados a personas. Los fixtures y los ejemplos de desarrollo usan datos ficticios, sin copiar registros reales. Los identificadores internos no se consideran anónimos por sí mismos: su uso en diagnóstico se limita a la referencia necesaria, sin adjuntar información personal o económica.
Esta restricción no impide el uso funcional previsto de los datos en pantallas, reportes y avisos autorizados, sujeto a los permisos, destinatarios y aislamiento por empresa. No amplía por sí misma los campos sujetos a cifrado en reposo de PRINCIPIO-004. Verificable mediante revisión de logs, mensajes de error, prompts y fixtures, con controles automatizados en CI donde corresponda.
Ejemplo de cumplimiento: el log registra `evento=pago_rechazado contacto_id=42 codigo=IMPORTE_SUPERA_SALDO`; los fixtures contienen contactos ficticios con correos del dominio `example.com`.
Ejemplo de violación: un log o mensaje de error revela el nombre de una persona y su deuda; se copia un contacto real a un prompt de IA o a un fixture del repositorio.

PRINCIPIO-006: Pagos confirmados inmutables y auditados
Mientras el contrato de la empresa esté vigente, ningún dato de un pago confirmado se modifica y su registro no se elimina. Las correcciones se realizan mediante un registro de anulación separado que referencia el pago original y guarda el motivo, el usuario y la fecha. Registrar un pago de reemplazo es opcional.
La única excepción a la conservación es la baja contractual (RN-152): al terminar el contrato de una empresa en la modalidad en la nube, se eliminan todos sus datos juntos mediante un procedimiento interno del equipo de VenceYa, dentro de los 30 días siguientes a la terminación efectiva. La empresa es responsable de exportar y conservar los históricos disponibles mediante las funciones existentes antes de la terminación efectiva y del bloqueo de acceso. La baja no depende de que la empresa haya exportado ni de una constancia de entrega. La baja nunca elimina registros sueltos, no está disponible desde la aplicación para ningún rol y no permite modificar datos.
La anulación se registra en una entidad separada que referencia el pago original; su efecto se obtiene de esa relación sin actualizar el pago.
Verificable mediante pruebas que rechazan cualquier UPDATE o DELETE sobre un pago confirmado hecho por la aplicación, que comprueban que anularlo crea el registro correspondiente sin alterar el pago original, y mediante una prueba del procedimiento de baja que elimina todos los datos de una empresa sin afectar a ninguna otra (PRINCIPIO-003).
Ejemplo de cumplimiento: se anula el pago 1001 creando un registro separado con referencia al original, motivo, usuario y fecha; el pago original permanece intacto.
Ejemplo de violación: cambiar el importe o la fecha de un pago confirmado para corregirlo en lugar de registrar su anulación.
Ejemplo de violación: un ADMINISTRADOR elimina desde la aplicación los pagos antiguos de su empresa, o el procedimiento de baja borra solo los pagos y conserva los contactos y los usuarios.

PRINCIPIO-007: Cálculos financieros deterministas y probados
Los cálculos de saldo, estado de las cuotas, días de atraso, DSO e indicador de comportamiento de pago son funciones puras y reproducibles: la misma entrada produce siempre la misma salida, y la fecha de cálculo se recibe como parámetro. Cada regla de cálculo tiene casos de prueba de referencia aprobados por la persona encargada del proyecto, tomados de los ejemplos y contraejemplos de `03-reglas-de-negocio.md`; una revisión contable es opcional. Los módulos de dominio (cuotas, saldos, estados, vencimientos, DSO e indicador) tienen una cobertura mínima de 80 %. Verificable en CI con reporte de cobertura, que falla por debajo del 80 % en esos módulos, y con la suite de casos de referencia. El sistema no calcula intereses de mora en esta versión (alcance O18).
Aplicación por entrega (E-012): la mención de una capacidad en este principio no adelanta su prioridad en el alcance. Todo cálculo implementado queda sujeto inmediatamente a determinismo, casos de referencia aprobados y cobertura mínima del 80 % en sus módulos de dominio, aunque la capacidad todavía no se haya publicado. No se exige crear módulos de capacidades aún no implementadas para aceptar el MVP.
Ejemplo de cumplimiento: una cuota de S/ 1,000.00 con fecha efectiva de vencimiento 2026-10-28 y fecha de cálculo 2026-11-05 da siempre VENCIDA con 8 días de atraso en cada ejecución del test de referencia.
Ejemplo de violación: cambiar la regla de cálculo del saldo sin un caso de prueba nuevo, o calcular con la fecha actual del servidor sin recibirla como parámetro.

PRINCIPIO-008: Evaluación de comportamiento de pago basada en histórico
El indicador de comportamiento de pago se calcula solo con los datos históricos registrados en el sistema y se puede reproducir a partir de esos datos. No usa fuentes externas ni datos que el sistema no tenga registrados. Verificable con un test que recalcula el indicador desde un histórico de referencia y compara el resultado.
Ejemplo de cumplimiento: el indicador de un cliente se recalcula desde sus 12 últimos pagos y da el mismo valor.
Ejemplo de violación: incorporar una consulta a un servicio externo de historial crediticio para ajustar el indicador.

PRINCIPIO-009: Notificaciones solo por correo y dentro del sistema
En esta versión, las notificaciones de vencimiento y compromisos de pago se envían únicamente por correo electrónico y se muestran en el sistema. No existe envío por WhatsApp, Telegram ni SMS. Verificable revisando que los únicos canales de salida configurados sean correo y la bandeja interna.
Ejemplo de cumplimiento: un usuario selecciona una cuota por vencer, envía el aviso por correo al contacto de la empresa y el envío queda registrado en la bandeja interna.
Ejemplo de violación: añadir un cliente de SMS para notificar vencimientos sin una enmienda de este documento.

PRINCIPIO-010: Accesibilidad WCAG 2.2 nivel AA
Todas las pantallas cumplen WCAG 2.2 nivel AA, son navegables por teclado y se adaptan a móvil, tablet y escritorio. Los gráficos ofrecen la misma información en una tabla accesible o en texto alternativo. Los correos de aviso no son pantallas y quedan fuera de esta obligación. Verificable con una auditoría automatizada de accesibilidad en CI y con revisión manual de navegación por teclado en cada pantalla nueva.
Ejemplo de cumplimiento: el formulario de registro de un pago se completa solo con teclado y cada campo tiene una etiqueta asociada; la proyección de próximos vencimientos ofrece una tabla con los mismos importes por día.
Ejemplo de violación: un botón de icono sin texto alternativo o un contraste de texto inferior a 4.5:1.

PRINCIPIO-011: Límites explícitos del agente de IA
Un agente de IA nunca puede: desplegar a producción sin aprobación humana; subir secretos, credenciales o datos reales de clientes al repositorio o a prompts; desactivar tests, reglas de lint o validaciones para que un cambio pase; enviar notificaciones reales a clientes (solo puede usar la cuenta de correo de prueba definida por el usuario); ni integrar pasarelas de pago electrónico. Verificable con revisión humana de cada pull request y con un escáner de secretos en CI.
Ejemplo de cumplimiento: el agente propone un cambio, lo deja en un pull request y espera la aprobación humana antes de desplegar.
Ejemplo de violación: el agente cambia `jest.config` para excluir un test que falla, o hace push de un `.env` con una contraseña.

PRINCIPIO-012: Revisión humana en cada merge
Todo cambio se integra mediante pull request revisado por una persona, sin excepciones, incluidos los cambios generados por agentes de IA. Verificable con la regla de protección de la rama principal, que exige una aprobación humana antes del merge.
Ejemplo de cumplimiento: un pull request del agente con un revisor que aprueba antes de fusionar.
Ejemplo de violación: fusionar directamente a la rama principal con un push forzado o sin aprobación.

---

## Fuera de alcance por ahora

- Validación de comprobantes contra SUNAT: se considerará como requerimiento adicional posterior.
- Procesamiento de pagos electrónicos: el sistema solo registra pagos como información de control.
- Conciliación bancaria y registro o importación de extractos y sus movimientos: excluidos de esta versión (O19).
- Explicación detallada del indicador de comportamiento de pago: no es requerida.

## Decisiones pendientes de confirmación

- Validación legal, antes del lanzamiento, del alcance de la política de datos personales y de los datos tratados (PRINCIPIO-005; Brief R2). La alineación documental no acredita por sí sola cumplimiento legal.
- Formato de documentación: Markdown como base y IDs fijos PRINCIPIO-NNN referenciados desde otros documentos.

## Registro de enmiendas

- **E-001 (2026-11-04):** terminología. Se reemplazan "abono" y "cargo" por "pago" en PRINCIPIO-006, PRINCIPIO-008, el ejemplo de PRINCIPIO-010 y la sección "Fuera de alcance". No cambia ninguna obligación.
- **E-002 (2026-11-05):** ejemplo de PRINCIPIO-009. Se reemplaza el ejemplo de cumplimiento, que describía un aviso automático al vencer la cuota, por uno de aviso manual, en coherencia con el alcance M5 y O16 (auditoría QA A-03). No cambia ninguna obligación ni el canal.
- **E-003 (2026-11-06):** protección de datos (auditoría QA A-15; decisión del usuario). Se amplía y precisa PRINCIPIO-005 para clientes, proveedores y personas de contacto, con nombres e información económica vinculada a personas y una enumeración no exhaustiva. Se unifican los canales restringidos, los datos ficticios de prueba y el diagnóstico mediante referencias internas; se aclara el uso funcional autorizado y se mantiene separado el alcance del cifrado de PRINCIPIO-004. La validación legal continúa pendiente antes del lanzamiento.
- **E-004 (2026-11-06):** inmutabilidad y conciliación de pagos (auditoría QA A-19; decisión del usuario). Se explicita en PRINCIPIO-006 que la inmutabilidad cubre todo el registro del pago y que la anulación y la conciliación se guardan en registros separados. La condición de conciliado se obtiene de la relación y su vigencia, sin modificar el pago ni el movimiento bancario; el pago de reemplazo es opcional. Se actualizan los ejemplos y los criterios de verificación en coherencia con RN-027, RN-029, RN-037, RN-038 y RN-124.
- **E-005 (2026-11-06):** cifrado y búsquedas protegidas (auditoría QA A-20; decisión del usuario). Se confirma AES-256-GCM en PRINCIPIO-004, se precisa el alcance por entidad y sus copias persistidas, se separa el hash de contraseñas y se exige comparación protegida con el ámbito de unicidad correspondiente. Se incorpora gestión de claves, rotación y recuperación, desarrolladas en RN-139 a RN-143 y `06-diseno-seguridad-datos.md`.
- **E-006 (2026-11-06):** vigencia de los principios, cálculos y accesibilidad (auditoría QA A-23; decisión del usuario). Se declara en el encabezado que todos los principios rigen desde su publicación y que una marca de pendiente no los suspende. En PRINCIPIO-007 se confirma la cobertura mínima de 80 % sobre los módulos de dominio, los casos de referencia pasan a aprobarlos la persona encargada del proyecto (la revisión contable queda opcional) y se retira la mora, porque el cálculo de intereses de mora sale del alcance (O18). En PRINCIPIO-010 se confirma WCAG 2.2 nivel AA y se precisa la alternativa accesible de los gráficos. Se reemplaza el ejemplo de commit de PRINCIPIO-001 que mencionaba la mora. No se agrega ninguna obligación a funcionalidades ya definidas.
- **E-007 (2026-11-06):** modalidades de instalación (preguntas abiertas 26 y 28; decisión del usuario). En PRINCIPIO-002 se mantiene el stack y se admiten dos modalidades de producción: en la nube (Neon para la base de datos; Railway para el backend y el frontend) o local en el servidor de la empresa cliente. Se retira de las decisiones pendientes la política de retención y borrado, resuelta en RN-150 y RN-151. Las obligaciones de PRINCIPIO-003 a PRINCIPIO-012 rigen igual en ambas modalidades.
- **E-008 (2026-11-06):** baja contractual (auditoría QA2-01; decisión del usuario). En PRINCIPIO-006 se limita la prohibición de eliminar al tiempo en que el contrato esté vigente. Se admite una sola excepción: la eliminación total de los datos de una empresa al terminar su contrato en la nube (RN-150, RN-152), mediante un procedimiento interno, con exportación previa y sin registros sueltos. La prohibición de modificar no cambia. Se amplía la verificación para incluir el procedimiento de baja y su aislamiento por empresa.

- **E-009 (2026-11-07):** retiro de la conciliación bancaria por decisión del usuario (QA2-09). Se retiran de PRINCIPIO-006 sus obligaciones, ejemplos y verificaciones específicos de conciliación; se conservan íntegros la inmutabilidad de pagos, las anulaciones auditadas y la excepción de baja contractual. Sustituye únicamente lo relativo a conciliación de E-004; esa enmienda se conserva como antecedente histórico. Se retiran S2, K6 y RN-037, RN-038, RN-125, sin reutilizar sus identificadores, y se incorpora O19. QA2-09 se cierra documentalmente por exclusión de la funcionalidad, no por implementación. Se mantiene cada pago limitado al saldo de una sola cuota y se documenta la prevención de registros duplicados (RN-156).
- **E-010 (2026-11-07):** textos libres (auditoría QA2-16; decisión del usuario). En PRINCIPIO-005 se acota la mención de «textos libres»: en los campos de texto libre que completa el usuario, el contenido lo decide y responde por él quien lo ingresa, y el sistema no lo busca, depura ni sustituye. Se mantiene que ese texto no se escribe en logs, mensajes de error, prompts ni fixtures, y no se modifica ninguna otra obligación. No se crea una excepción a la inmutabilidad de PRINCIPIO-006. Sustituye la parte de E-003 que extendía la protección a «datos dentro de textos libres». La validación legal sigue pendiente.
- **E-011 (2026-11-08):** exportación a cargo del cliente (QA2-12; decisión del usuario). En PRINCIPIO-006 se retira la entrega de exportación con evidencia como requisito de baja. La empresa exporta y conserva los históricos disponibles mediante las funciones existentes antes de la terminación efectiva y del bloqueo de acceso. VenceYa no genera ni entrega un paquete contractual adicional ni verifica la descarga o recepción. La eliminación se mantiene dentro de los 30 días posteriores a la terminación efectiva, aunque la empresa no haya exportado. No se amplían las exportaciones de S4 ni se promete una copia completa de todos los datos. Sustituye únicamente la obligación de exportación previa por VenceYa de E-008 y las condiciones de entrega de QA2-29; se conservan las demás obligaciones de baja, aislamiento e inmutabilidad.

- **E-012 (2026-11-09):** trazabilidad por entrega (QA2-33; decisión del usuario). Se precisa la aplicación de PRINCIPIO-007 a los cálculos implementados, sin adelantar funcionalidades Should al MVP ni diferir sus controles de calidad hasta su publicación. DSO se asigna a la funcionalidad S5 del alcance.
