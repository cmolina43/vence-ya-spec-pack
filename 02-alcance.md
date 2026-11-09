# 02 - Alcance del producto VenceYa

**Estado:** Borrador para validación
**Fuentes:** `01-project-brief.md`, `00-constitucion.md`, respuestas de ronda 1 a 4 (`01-project-brief-respuestas.md`) y respuestas de constitución (`00-constitucion-respuestas.md`)
**Fecha:** 2026-11-04

> Los principios citados (PRINCIPIO-NNN) son obligatorios según `00-constitucion.md`. Este documento no los modifica.

---

## 1. IN-SCOPE

### 1.1 Funcionalidades Must (M)

Máximo 6. Sin cualquiera de ellas, la primera versión no resuelve el problema de vencimientos sin gestionar.

| ID | Funcionalidad | Descripción en una frase | Principios / KPI relacionados |
|---|---|---|---|
| M1 | Registro de contactos y comprobantes a crédito | Los usuarios comparten el catálogo de contactos de su empresa (nombre y correo único dentro de ella, incluidos los desactivados; teléfono y dirección opcionales; un mismo contacto puede ser cliente y proveedor), pueden crearlos, editarlos, desactivarlos y reactivarlos, y eliminarlos con confirmación solo si no tienen comprobantes, incluidos los anulados; al registrar comprobantes seleccionan un contacto activo de su empresa. La empresa registra comprobantes por cobrar o por pagar con su moneda original (S/ o US$), y el sistema rechaza un mismo número de documento repetido dentro de la empresa en cuentas por cobrar, o dentro del mismo proveedor en cuentas por pagar. | PRINCIPIO-003, PRINCIPIO-005; R3, R4 |
| M2 | Cuotas y vencimientos | Al registrar un comprobante, el usuario elige pago único o ingresa una cantidad entera de 2 a 120 cuotas, sin superar los céntimos del total; en el segundo caso el sistema propone cuotas mensuales de importe proporcional al total. El usuario puede editar fechas e importes mientras el comprobante no tenga pagos ni reprogramaciones. Los importes ingresados usan el formato numérico peruano (por ejemplo «1,000.50»: punto decimal y coma de miles obligatoria desde 1,000), admiten hasta dos decimales, hasta 12 dígitos enteros y no se redondean por su cuenta. Un comprobante guardado conserva entre 1 y 120 cuotas. | PRINCIPIO-007; supuesto S5 (§4); RN-153, RN-154 |
| M3 | Pagos con anulación auditada | El usuario registra cobros y pagos recibidos o realizados en orden cronológico por cuota: se rechaza una fecha anterior a la mayor fecha de sus pagos no anulados y se permiten pagos del mismo día (RN-089). Registrar o anular pagos no modifica el vencimiento acordado; la cancelación real se calcula al quedar el saldo en cero (RN-088). Cada pago se aplica a una sola cuota: reduce su saldo, la cancela al cubrirlo exactamente y se rechaza si lo supera, sin reparto entre cuotas (RN-092). El frontend deshabilita el botón durante el envío y el backend impide registrar dos veces la misma operación por doble clic o reintento (RN-156). Una corrección se hace con una única anulación total e irreversible que guarda motivo, usuario y fecha, sin modificar el original. El pago de reemplazo es opcional e independiente; incorporar un pago omitido anterior requiere anular los pagos vigentes de fechas posteriores y registrar nuevamente los pagos en orden con sus fechas reales. | PRINCIPIO-006; K1, K3 |
| M4 | Panel de cartera y vencimientos | Todos los roles de la empresa ven la cartera vencida por cobrar, la vencida por pagar, la pendiente de cobro y la pendiente de pago, una proyección gráfica agrupada por día para los próximos 7, 10 o 15 días según la preferencia del usuario (saldos, con cobros y pagos en series separadas), y un listado completo de movimientos (una fila por cuota) pendientes, vencidos y cancelados, todo en la moneda elegida en un selector de moneda del panel (S/ por defecto; el ADMINISTRADOR la configura para la empresa y cada usuario puede definir la suya en sus preferencias de usuario; nunca se suman monedas distintas). El selector indica si la otra moneda tiene cuotas vencidas. El listado excluye comprobantes anulados y sus cuotas por defecto; solo los muestra al activar «Incluir comprobantes anulados», con comprobante ANULADO y cuotas ANULADAS, sin estado de pago vigente (RN-049). Esa inclusión no los incorpora a los cálculos de cartera ni a los indicadores. Cada resultado identifica su momento de corte con «Datos al DD/MM/AAAA, HH:mm» en America/Lima y presenta datos coherentes para ese corte (RN-205 a RN-210). | K1, K2, K3, K4 |
| M5 | Notificación de vencimientos | El sistema muestra una lista completa de cuotas con saldo por avisar (pendientes y vencidas, por cobrar y por pagar), sin limitarla a la ventana del gráfico. El usuario selecciona las cuotas y envía el aviso por correo al contacto (cliente o proveedor), con copia al correo administrativo de la empresa y a los usuarios en copia que el ADMINISTRADOR configura por separado para avisos por cobrar y por pagar (solo ADMINISTRADOR o SUPERVISOR), usando una maqueta fija según el tipo de aviso y un comentario opcional. Cuando Resend acepta el correo, el listado marca cada cuota incluida como «Enviado» con la fecha del último envío y ofrece «Reenviar aviso» con confirmación; la bandeja interna conserva cada intento. Un error confirmado se muestra al usuario y no marca la cuota. El reenvío y el reintento generan un aviso nuevo con los datos y destinatarios vigentes, y solo incluyen cuotas que sigan siendo aptas para aviso (RN-155). Mientras se envía, el botón queda deshabilitado; el sistema guarda el intento antes de llamar a Resend y no permite otro envío de las mismas cuotas mientras ese intento siga sin confirmar, aunque lo intente otro usuario. Un resultado sin confirmar se resuelve con «Verificar envío», que repite la misma solicitud sin enviar un segundo correo; si ya no puede verificarse, el usuario puede enviar un aviso nuevo con advertencia (RN-157, RN-158, RN-159). «Enviado» no confirma la entrega al destinatario. El envío es manual. | PRINCIPIO-009; K5; S4, R5; O16 |
| M6 | Usuarios por empresa con roles | Cada empresa administra sus propios usuarios, con los roles ADMINISTRADOR, OPERADOR y SUPERVISOR, y ningún usuario ve datos de otra empresa. Los permisos se rigen por la matriz acotada de RN-060 y las validaciones de cada operación. Una empresa puede tener varios ADMINISTRADORES; solo ellos administran usuarios, roles y configuración de empresa. El SUPERVISOR y el ADMINISTRADOR pueden anular pagos y comprobantes elegibles; el OPERADOR no. Cada usuario cambia solo sus preferencias personales y ningún rol de negocio concede acceso a claves. Todo cambio efectivo de rol cierra todas las sesiones del afectado y exige iniciar sesión nuevamente; el cambio, la invalidación y la auditoría se guardan como una unidad, protegiendo al último administrador activo (RN-100, RN-161). El equipo de VenceYa crea la empresa y su primer administrador; este crea a los demás usuarios por invitación, y el ciclo de vida incluye inicio de sesión, recuperación de contraseña y desactivación (RN-094 a RN-104; atomicidad del alta en RN-211). | PRINCIPIO-003, PRINCIPIO-004 |

### 1.2 Funcionalidades Should (S)

Máximo 4. Valiosas, se construyen después del MVP.

| ID | Funcionalidad | Descripción en una frase | Principios / KPI relacionados |
|---|---|---|---|
| S1 | Reprogramación con promesa de pago | El usuario registra una nueva fecha de pago para una cuota sin aprobación previa (puede repetirlo), y el sistema la conserva como promesa activa con su fecha original y deja la cuota marcada como reprogramada. Tanto la primera reprogramación como las posteriores requieren saldo vigente mayor que cero y un comprobante no anulado; al guardar se verifican esas condiciones y las restricciones de fecha. Una cuota reabierta por anulación de un pago puede reprogramarse si vuelve a cumplirlas. | K7; sección 7 del brief (restricciones de reprogramaciones); RN-033, RN-073, RN-080, RN-091, RN-118, RN-160 |
| S3 | Evaluación de comportamiento de pago | El sistema calcula un indicador de comportamiento de pago por contacto a partir de sus últimos pagos registrados, sin fuentes externas y sin explicación detallada. | PRINCIPIO-008; RN-054 a RN-056, RN-148 |
| S4 | Reporte de vencimientos y exportación de movimientos | Los usuarios de la empresa (operador, supervisor y administrador) ven en pantalla, y el supervisor y el administrador descargan en Excel o CSV, el reporte de vencimientos (cuotas por vencer, vencidas, reprogramadas y canceladas del periodo), con el historial de cada cuota disponible como detalle, para controlar su cartera y contrastar la información fuera de VenceYa. El reporte tiene una fila por cuota, columnas propias y cantidad e importe por grupo y moneda: los tres primeros grupos suman saldos vigentes y canceladas suma importes completos de cuotas saldadas. Su periodo válido e inclusivo filtra solo las canceladas; los demás grupos muestran la cartera actual. El reporte y su exportación siempre excluyen comprobantes anulados y sus cuotas. RN-076 y RN-077 definen fechas, resultados vacíos, metadatos y exportación. El supervisor y el administrador también descargan en Excel o CSV el listado de movimientos de un periodo: una fila por cuota de los comprobantes emitidos en ese periodo, con su estado de pago y saldo actuales para los no anulados (RN-050, RN-051, RN-144 a RN-146 y RN-183 a RN-188). El listado exportado excluye anulados por defecto; solo al solicitar «Incluir comprobantes anulados» incluye sus cuotas, con estado de pago vacío y columna «Comprobante anulado» igual a «Sí», sin representar obligaciones vigentes. CSV y Excel aplican el mismo criterio. Cada resultado identifica su momento de corte con «Datos al DD/MM/AAAA, HH:mm» en America/Lima y presenta datos coherentes para ese corte (RN-205 a RN-210). | K7; uso del contador (brief, sección 2) |
| S5 | Indicador DSO | Todos los roles ven en una tarjeta propia del panel los días promedio de cobro de comprobantes por cobrar saldados en el mes elegido, con dos decimales, último mes completo por defecto y «Sin datos» si no hay comprobantes elegibles; incluye ambas monedas y es independiente del selector de moneda. | K8; PRINCIPIO-007; RN-053, RN-147 |

**Identificadores:** «funcionalidad S5» designa el DSO; «supuesto S5 (§4)» designa las cuotas mensuales. Sus espacios de identificación son independientes.

**S2 retirada (2026-11-07):** conciliación bancaria excluida mediante O19 por decisión del usuario (QA2-09; E-009). Su identificador funcional no se reutiliza; el supuesto S2 de la sección 4 es independiente.

### 1.3 Funcionalidades Could (C)

Máximo 4. Solo si sobra capacidad después de S.

| ID | Funcionalidad | Descripción en una frase | Principios / KPI relacionados |
|---|---|---|---|
| C1 | Importación desde Excel | El usuario sube su archivo Excel existente con clientes, proveedores y comprobantes, y el sistema valida y carga las filas correctas. | R1 (reduce la barrera de cambio desde Excel) |
| C3 | Maquetas de aviso editables | La empresa puede editar el texto de las maquetas de correo de los avisos. | PRINCIPIO-009; R5 |

---

## 2. OUT-OF-SCOPE

Estas funcionalidades no se construyen en esta versión. Algunas tienen línea que la constitución ya fija.

| # | Funcionalidad | Razón |
|---|---|---|
| O1 | Validación de comprobantes contra SUNAT | La constitución la deja como requerimiento adicional posterior. El usuario es responsable del número de documento registrado (R3). |
| O2 | Emisión de comprobantes electrónicos | El producto gestiona cuentas por cobrar y pagar, no factura. El brief indica que no se emiten comprobantes. |
| O3 | Procesamiento de pagos electrónicos o pasarelas | La constitución (PRINCIPIO-011) prohíbe integrar pasarelas de pago. El sistema solo registra pagos como control. |
| O4 | Notificaciones por WhatsApp, Telegram o SMS | PRINCIPIO-009 limita los canales a correo y bandeja interna en esta versión. Cualquier otro canal requiere enmienda de la constitución. |
| O5 | Almacenamiento de números de cuenta o CCI | Las respuestas de negocio y el brief excluyen explícitamente estos datos (restricciones de datos). |
| O6 | Conversión automática de moneda por tipo de cambio | Los tipos de cambio varían por banco o plataforma. El usuario convierte y el sistema registra la moneda original (R4). |
| O7 | Contabilidad completa (plan contable, libro mayor, estados financieros) | El producto solo controla vencimientos y cobranzas. La contabilidad completa es otro producto. |
| O8 | Gestión de varios clientes para estudios contables | El estudio contable no es segmento objetivo por ahora (brief, secciones 2 y 4). Requeriría un modelo multiempresa distinto. |
| O9 | Cobro de suscripción dentro de la aplicación | El precio no está definido (brief, sección 4) y el cobro implicaría una pasarela de pago, excluida por PRINCIPIO-011. |
| O10 | Aprobación formal de reprogramaciones (flujo de autorización) | El brief indica que el sistema registra el cambio sin autorización previa y la aprobación es interna de la directiva. |
| O11 | Aplicación nativa para móvil | PRINCIPIO-010 exige diseño responsive en la web. Una app nativa duplica el trabajo sin evidencia de necesidad. |
| O12 | Gestión de cheques | Según las respuestas de la ronda 1, el cheque casi no se usa en el segmento. |
| O13 | Interfaz en idioma distinto al español | PRINCIPIO-001 y las respuestas de idioma fijan el español. |
| O14 | Amortización del crédito (sobrepagos aplicados a otras cuotas, pagos repartidos entre cuotas) | Cada pago se registra contra una sola cuota y no puede superar su saldo (RN-092). Podrá añadirse más adelante como requerimiento nuevo (decisión del usuario, auditoría QA C-04). |
| O15 | Registro abierto de empresas (autoalta) | Para evitar cuentas falsas y datos sucios, el equipo de VenceYa crea cada empresa y su primer administrador (RN-094, RN-095). Podrá añadirse cuando exista un filtro, como el cobro de suscripción o la aprobación manual de cuentas (decisión del usuario, auditoría QA C-07). |
| O16 | Aviso automático de vencimientos | En esta versión el usuario selecciona y envía los avisos manualmente (M5). El envío programado, con su horario, recuperación de ejecuciones perdidas y reintentos, podrá añadirse más adelante como requerimiento nuevo (decisión del usuario, auditoría QA A-03). |
| O17 | Exportación de pagos por fecha de pago | La exportación de movimientos lista cuotas por fecha de emisión del comprobante (RN-144). Un archivo con una fila por cobro o pago, filtrado por fecha de pago, para cuadrar caja o banco, podrá añadirse más adelante como requerimiento nuevo (decisión del usuario, auditoría QA A-21). |
| O18 | Cálculo de mora por cuota (intereses por atraso con una tasa) | El sistema identifica las cuotas vencidas y sus días de atraso, pero no calcula intereses ni recargos por mora. Podrá añadirse más adelante como requerimiento nuevo, con una tasa y casos de referencia aprobados (antes C2; decisión del usuario, auditoría QA A-23). |
| O19 | Conciliación bancaria y registro de extractos | No se registran ni importan extractos o movimientos bancarios, no se vinculan con pagos ni se gestionan pendientes de conciliación. El operador registra directamente el pago realizado sobre una cuota. Podrá incorporarse como requerimiento adicional (antes S2; decisión del usuario, QA2-09; E-009). |

---

## 3. MVP (Minimum Viable Product)

Con solo los Must (M1 a M6), el equipo de VenceYa da de alta a la pyme y a su administrador, y este puede invitar a sus usuarios, crear sus clientes y proveedores, y registrar sus comprobantes a crédito en soles o dólares. El sistema le propone cuotas mensuales que puede ajustar. Cada cobro o pago que recibe o realiza queda registrado, y las correcciones se hacen con anulaciones auditadas. Cada mañana ve en el panel de cartera cuánto tiene vencido, cuánto espera cobrar y pagar, y una proyección de lo que vence en los próximos 7, 10 o 15 días. Desde una lista completa de cuotas pendientes y vencidas con saldo, envía por correo los avisos de vencimiento al contacto afectado, con copia al correo administrativo de la empresa y a los usuarios que el ADMINISTRADOR configure en copia. Con el MVP no puede registrar reprogramaciones formales ni exportar a Excel; esas funcionalidades se incorporan después mediante S1 y S4. La conciliación bancaria queda fuera de toda esta versión (O19).

---

### 3.1 Entregas y dependencias funcionales — QA2-33 (2026-11-09)

Las funcionalidades S1, S3, S4 y S5 se entregan después del MVP. Las referencias a ellas en reglas MUST establecen controles obligatorios cuando corresponda la capacidad, sin adelantar su entrega. Las obligaciones compartidas de seguridad, auditoría y cálculo siguen aplicándose al MVP.

| Capacidad | MVP sin esa capacidad | Dependencias y aceptación posterior |
|---|---|---|
| S1 — Reprogramación | No se crean promesas ni se ofrece reprogramar. La fecha efectiva es el vencimiento original vigente, incluidas las ediciones permitidas por RN-081. Estados, atraso, cartera, proyección y avisos usan esa fecha. | Requiere las cuotas y pagos del MVP. Al entregarse S1, se aplican todas sus validaciones, la visibilidad de promesas de RN-036 y el historial de RN-078; no requiere S4. |
| S3 — Comportamiento de pago | No se presenta el puntaje ni su clasificación. | Usa pagos y cuotas vencidas del MVP conforme a RN-055 y RN-148. Puede entregarse sin S1, S4 ni S5. |
| S4 — Reporte y exportaciones | Permanecen el panel y listado de M4; no se ofrece el reporte de S4 ni exportación CSV o Excel. | Puede entregarse sin S1: reprogramadas queda sin filas y con resúmenes en cero, marca de reprogramación falsa y campos de promesa vacíos; vencimiento efectivo igual al original vigente. Incluye el historial RN-078. |
| S5 — DSO | No aparece la tarjeta DSO; permanecen los cuatro indicadores de cartera. | Usa comprobantes por cobrar y cobros del MVP. Puede entregarse sin S1, S3 ni S4; no forma parte del reporte S4. |

El historial cronológico consultable de RN-078 se entrega con S1 o S4, la que llegue primero, y se reutiliza al entregar la otra. Desde el MVP se conservan los registros obligatorios de pagos, anulaciones y ediciones (RN-083), aunque esa vista todavía no exista. Las transiciones derivadas se calculan conforme a RN-078.

**Corrección de vencimientos sin S1:** si el comprobante no está anulado y nunca tuvo pagos, puede editarse conforme a RN-081. Si tuvo algún pago, incluso anulado, la edición permanece bloqueada. Para corregir su fecha sin S1 se anulan los pagos vigentes, se anula el comprobante elegible y se registra uno nuevo, cumpliendo RN-029, RN-061, RN-082 y sus validaciones; el original y su auditoría se conservan. La ausencia de S1 no habilita edición directa ni promesas implícitas.

## 4. Supuestos

Lo que damos por cierto sin haberlo validado. Cada uno debe confirmarse antes de cerrar la fase de construcción.

| ID | Supuesto | Fuente | Cómo validarlo |
|---|---|---|---|
| S1 | Las pymes llevan sus cuentas por cobrar y pagar en Excel, y los vencimientos sin gestionar son frecuentes. | Brief, sección 6 (S1) | Entrevistas con pymes y contadores. |
| S2 | Las pymes contratan directamente, sin intermediación de estudios contables. | Brief, sección 6 (S2); respuesta de ronda 3 sin decisión | Entrevistas; registrar el canal de compra. |
| S3 | La pyme puede pagar una suscripción mensual, y el monto influye en la decisión. | Brief, sección 6 (S3) | Medir disposición a pagar con precios de prueba. |
| S4 | El correo electrónico es suficiente para avisar a clientes y proveedores, con copia a la empresa (correo administrativo y usuarios en copia). | Brief, sección 6 (S4); R5 | Validar con las primeras pymes si el correo se lee a tiempo. |
| S5 | Los comprobantes a crédito se pagan en cuotas mensuales proporcionales al total, con posibilidad de editarlas. | Respuesta de ronda 2 (pregunta 5); brief (S5) | Revisar con pymes reales los casos de cuotas. |
| S6 | Las pymes aceptan registrar datos de clientes y proveedores en un tercero bajo un acuerdo de tratamiento de datos. | Brief, sección 6 (S6); R2 | Preguntar en las entrevistas y validar con asesoría legal. |
| S7 | Un volumen de unas 80 operaciones al mes por empresa basta para dimensionar el sistema. | Respuesta de ronda 1 (pregunta 5); brief, sección 1 | Medir el volumen real con las primeras pymes. |
| S8 | La línea base de cartera vencida puede medirse con las primeras pymes que participen. | Brief, sección 5 y R6 | Medir antes de fijar metas de K1. |

---

## 5. Restricciones

### 5.1 Técnicas

- **Stack fijo:** backend Node.js con NestJS, base de datos PostgreSQL, frontend React con shadcn/ui (PRINCIPIO-002).
- **Modalidades de instalación en producción** (PRINCIPIO-002, E-007): en la nube, con la base de datos en Neon y el backend y el frontend en Railway, cuyos secretos se custodian en las variables de entorno de Railway; o local (on-premise), con la base de datos, el backend y el frontend en el servidor de la empresa cliente. La empresa elige la modalidad al contratar.
- **Idioma único:** código, comentarios, commits, documentación e interfaz en español (PRINCIPIO-001).
- **Aislamiento:** toda consulta de datos de negocio filtra por empresa del usuario autenticado (PRINCIPIO-003).
- **Cifrado:** AES-256-GCM en reposo para correo, teléfono y dirección de contactos, RUC y correo administrativo de empresas y correo de acceso de usuarios; contraseñas con hash específico; TLS 1.2 o superior en tránsito (PRINCIPIO-004, E-005).
- **Auditoría:** pagos confirmados inmutables, con registro de anulación, mientras el contrato esté vigente; al terminar, solo la baja contractual elimina los datos de la empresa completa (PRINCIPIO-006, E-008).
- **Accesibilidad:** WCAG 2.2 nivel AA, navegable por teclado, responsive; los gráficos con tabla accesible o texto alternativo (PRINCIPIO-010, E-006).
- **Cobertura:** mínimo 80 % en los módulos de dominio, con casos de referencia aprobados por la persona encargada del proyecto para los cálculos financieros (PRINCIPIO-007, E-006).
- **Revisión humana:** todo merge con aprobación de una persona (PRINCIPIO-012).

### 5.2 Legales y de datos

- **Terminación contractual en la nube (QA2-29 y QA2-12, 2026-11-08):** personal autorizado de VenceYa la formaliza mediante un procedimiento interno, con sustento y fecha y hora efectiva; el rol ADMINISTRADOR no acredita representación contractual. Desde ese instante se bloquean accesos, sesiones y operaciones de negocio, incluidos avisos pendientes, y se cuentan los 30 días para ejecutar la baja. La empresa es responsable de exportar y conservar los históricos disponibles mediante las funciones existentes antes de la terminación efectiva. Se mantienen los permisos, formatos, filtros y contenido de S4, sin prometer una copia completa ni ampliar el MVP. VenceYa no genera ni entrega un paquete contractual adicional; la baja no requiere evidencia de descarga o entrega, y la falta de exportación no amplía el plazo. Los datos se conservan íntegros hasta la baja. La solicitud, el cierre de sesiones y la desactivación de usuarios no terminan el contrato (RN-150, RN-152; E-011).

- **Ley 29733** y su reglamento vigente (D.S. 016-2024-JUS, que reemplaza al D.S. 003-2013-JUS) aplican a clientes, proveedores y contactos.
- **Retención y eliminación:** sin depuración automática durante el contrato; exportación de los históricos disponibles a cargo del cliente antes de la terminación efectiva y eliminación dentro de los 30 días siguientes a la terminación en la nube, independientemente de que el cliente haya exportado (QA2-12; E-011); antes de habilitar cualquier respaldo restaurado, el equipo de VenceYa revisa manualmente el registro de bajas conservado fuera de la base y reaplica las eliminaciones, sin restablecer accesos ni avisos de empresas dadas de baja (RN-152; QA2-11); la eliminación ordinaria de contactos solo se permite sin comprobantes y libera su correo (RN-127, RN-130). Las solicitudes de eliminación de datos personales se atienden a través de la empresa mediante un procedimiento interno separado, pendiente de definición en la pregunta 31; no se incluye seudonimización en el mantenimiento (RN-150, RN-151, RN-152, RN-254 a RN-257; decisión QA2-10, 2026-11-07).
- **No se almacenan números de cuenta ni CCI.**
- **No se valida el número de documento contra SUNAT.** El sistema solo impide duplicados por empresa en cuentas por cobrar y por proveedor en cuentas por pagar, entre comprobantes no anulados.
- **Datos personales fuera de logs, prompts y repositorio** (PRINCIPIO-005).
- **Los agentes de IA no pueden** desplegar sin aprobación humana, subir secretos ni datos reales, desactivar pruebas, enviar notificaciones reales ni integrar pasarelas de pago (PRINCIPIO-011).

### 5.3 De negocio y recursos

- **Mercado:** solo Perú, con foco en micro, pequeñas y medianas empresas de comercio y servicios.
- **Monedas:** soles y dólares. Cada operación se registra en su moneda original.
- **Notificaciones:** solo correo y bandeja interna (PRINCIPIO-009).
- **Validación previa:** no hay entrevistas programadas con pymes, no hay línea base y no hay precio definido.

---

## 6. Dependencias

| # | Sistema o servicio | Para qué | Estado |
|---|---|---|---|
| D1 | Neon (PostgreSQL alojado) | Base de datos de producción en la modalidad en la nube. | Definido en la constitución (E-007). Región AWS `us-east-1` (Virginia del Norte), junto al backend en Railway. |
| D2 | Resend (correo transaccional) | Envío de avisos de vencimiento (M5), invitaciones y recuperación de contraseña. Para los avisos, VenceYa registra la aceptación o el rechazo confirmado de la solicitud de envío; el MVP no procesa webhooks de entrega ni de rebote. Cada intento de aviso se envía con una clave de idempotencia de Resend, válida por 24 horas, que permite verificar un resultado sin confirmar sin duplicar el correo (RN-158, RN-159). | Definido (pregunta 32; decisión QA2-05 del 2026-11-06). Región `us-east-1`. Dominio remitente pendiente (pregunta 39). |
| D3 | Cuenta de correo de prueba | Buzón dedicado del proyecto, único destinatario permitido en pruebas (PRINCIPIO-011, RN-013). | Definido (pregunta 33). La persona encargada del proyecto indica la dirección. |
| D4 | GitHub con GitHub Actions | Protección de la rama principal con una aprobación humana obligatoria antes del merge, y escáner de secretos gitleaks en CI (PRINCIPIO-011, PRINCIPIO-012). | Definido (pregunta 34). Falta crear el repositorio. |
| D5 | Asesoría legal | Revisión de la Ley 29733 y su reglamento (D.S. 016-2024-JUS) antes del lanzamiento, incluido el flujo transfronterizo hacia Estados Unidos, y confirmación del rol de VenceYa. Rol provisional (pregunta 20): en la nube, encargado del tratamiento de los datos de los contactos de cada empresa y responsable de los datos de sus propios usuarios; en la modalidad local, encargado solo si accede a los datos para dar soporte (pregunta 42) y, si no accede, no trata datos de la empresa. | Pendiente de revisión legal (pregunta 31). |
| D6 | Librerías del stack: NestJS, React, shadcn/ui | Base técnica del producto. | Definido en la constitución. |
| D7 | Railway | Backend, frontend y custodia de secretos en la modalidad en la nube. | Definido (E-007). Región US East (Virginia). |
| D8 | Servidor de la empresa cliente | Base de datos, backend y frontend en la modalidad local. | Definido (E-007). Operación pendiente (preguntas 41 y 42). |

**Sin dependencia:** SUNAT (excluido en esta versión), pasarelas de pago (excluidas), tipos de cambio (responsabilidad del usuario).

---

## 7. Decisiones pendientes que afectan el alcance

Estas decisiones no bloquean la redacción del alcance, pero sí su construcción.

1. **Precio mensual en soles** (brief, sección 4 y pregunta 3). Afecta S3 y O9.
2. **Canal de notificación:** si el correo no basta, habría que reabrir PRINCIPIO-009 (R5). Afecta M5 y C3.
3. **Rol de VenceYa en el tratamiento según la modalidad de instalación:** decidido de forma provisional (2026-11-06; brief, pregunta 1) y sujeto a la revisión legal de la pregunta abierta 31. Afecta D5.
4. **Región de los servicios en la nube:** resuelta (2026-11-06). Railway, Neon y Resend operan en Virginia, Estados Unidos (D1, D2 y D7). El flujo transfronterizo de datos se revisa con la asesoría legal (pregunta abierta 31).
5. **Perfil exacto de la pyme objetivo** (brief, pregunta 2). Permite confirmar si los límites de M son suficientes.
6. **Operación de la modalidad local:** custodia de claves, respaldos, instalación y actualizaciones (preguntas abiertas 41 y 42). Afecta D8.
