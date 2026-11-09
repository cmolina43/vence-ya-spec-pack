# 03 - Catálogo de reglas de negocio de VenceYa

**Alcance:** funcionalidades Must (M1 a M6) y Should (S1, S3, S4 y S5; S2 retirada) de `02-alcance.md`, más las reglas de `00-constitucion.md` que aplican a ellas.
**Formato:** EARS. Palabras normativas: DEBE (obligatorio), NO DEBE (prohibido), PUEDE (opcional, exclusivamente para alternativas expresamente admitidas). Las capacidades y permisos exigidos se redactan como «el sistema DEBE permitir al rol…», sujetos a sus validaciones; el actor decide si los utiliza. PUEDE no autoriza a omitir esas capacidades. MUST/SHOULD/COULD indican la prioridad de entrega, independientemente de la palabra normativa: las capacidades de S4 se exigen al entregar S4, sin incorporarlas al MVP (QA2-32, 2026-11-08).
**Aplicación por entrega (QA2-33, 2026-11-09):** cada regla se aplica a la capacidad entregada según alcance §3.1. Referenciar una capacidad SHOULD desde una regla MUST no adelanta su entrega. Los controles compartidos siguen siendo obligatorios en el MVP; las validaciones exclusivas de S1, incluidas RN-080 y RN-118, son obligatorias cuando se entregue S1. RN-053 y RN-147 pertenecen a la funcionalidad S5. La vista de RN-078 se entrega con S1 o S4, la que llegue primero; los registros obligatorios del MVP se conservan desde su creación. Todo cálculo implementado cumple PRINCIPIO-007 desde su implementación (E-012).

**Criterio EARS (QA2-30, 2026-11-08):** CUANDO identifica un evento; MIENTRAS, un estado; DONDE se reserva para la presencia de una característica opcional del producto. Una configuración que el usuario decide usar no convierte la capacidad en Optional ni modifica su prioridad MUST/SHOULD. Las divisiones de QA2-30 conservan el ID original para la obligación principal; su correspondencia y casos de aceptación se registran en el cierre de la auditoría.
**Atomicidad y trazabilidad (QA2-31, 2026-11-08):** cada obligación verificable tiene un ID RN-NNN, patrón EARS y ejemplos propios. Se conserva el ID original para su obligación principal y se asignan RN-189 a RN-257 a las obligaciones extraídas, sin reutilizar IDs retirados. Las referencias anteriores a una regla dividida se interpretan junto con su contexto y la matriz de correspondencia del cierre QA2-31; las referencias específicas se actualizan a la obligación correspondiente. Las definiciones y decisiones pendientes quedan fuera del enunciado normativo. Una garantía atómica de transacción o de rechazo conserva juntos sus efectos inseparables; no autoriza implementaciones parciales.
**Montos:** en la moneda original del comprobante (S/ o US$). **Fechas:** ISO 8601 (AAAA-MM-DD).
**Decisiones de la revisión QA de HUs (2026-11-09; `06-user-stories.md`, «Revisión QA»):** QA-02, la recuperación de contraseña responde igual exista o no la cuenta, con un solo enlace vigente y un máximo de 3 envíos por hora (RN-258, RN-259 y RN-260). QA-04, el comentario del aviso se guarda y envía en mayúsculas (RN-162). QA-05, el nombre del contacto admite también dígitos y los signos «.», «,», «&», «-», «'», «(», «)» y «/» (RN-162). QA-06, la razón social de la empresa sigue el mismo formato que el nombre del contacto (RN-162 y RN-094). QA-12, todos los roles consultan el indicador de comportamiento de pago (RN-261 y RN-060).
**Decisión QA2-10 (2026-11-07):** el mantenimiento usa solo ACTIVO y DESACTIVADO; la eliminación ordinaria se limita a contactos sin comprobantes (RN-127, RN-129, RN-130). Se retira la seudonimización y se sustituye RN-151; el procedimiento interno de solicitudes de eliminación de datos personales queda pendiente en la pregunta 31.

**Preguntas abiertas:** el registro central de decisiones pendientes, con responsable por asignar y estado, está en `05-preguntas-abiertas.md`. El bloqueo de acceso (21), la duración de la sesión (27), la retención y eliminación de datos (28) y la cuenta de correo de prueba (33) se resolvieron el 2026-11-06 (RN-013, RN-103, RN-149, RN-150, RN-151). La fórmula del indicador, el tratamiento de cuotas sin pagos y el tiempo promedio de cobro (preguntas 16, 17 y 18) se resolvieron el 2026-11-06 (RN-053, RN-055, RN-056, RN-147, RN-148). La aptitud y los destinatarios de los reenvíos y reintentos de avisos (auditoría QA2-03 y QA2-04) se resolvieron el 2026-11-07 (RN-155 y ajustes en RN-041, RN-066, RN-112, RN-113, RN-130, RN-136 y RN-138). Las reglas que dependen de decisiones pendientes se marcan con `[pendiente de confirmación]`. Las respuestas históricas se conservan en `05-preguntas-abiertas-respuestas.md`.

---

## Registro

**RN-001** | Categoría: Registro | Prioridad: MUST | Fuente: Alcance M1; Brief §7 (Monedas); R4
Patrón EARS: Ubiquitous
El sistema DEBE registrar cada comprobante en la moneda original del comprobante.
✅ **Ejemplo:** la factura F001-00045 por US$ 1,200.00 se guarda con moneda USD y monto 1200.00.
❌ **Contraejemplo:** la factura F001-00045 por US$ 1,200.00 se guarda como S/ 4,320.00 convertida con tipo de cambio 3.60.

**RN-002** | Categoría: Registro | Prioridad: MUST | Fuente: Brief §7 (Monedas); Alcance M1
Patrón EARS: Unwanted
SI el usuario registra un comprobante en una moneda distinta de S/ o US$, el sistema NO DEBE guardarlo.
✅ **Ejemplo:** un comprobante en EUR 500.00 es rechazado con el mensaje de moneda no soportada.
❌ **Contraejemplo:** un comprobante en EUR 500.00 se guarda como moneda "EUR".

**RN-003** | Categoría: Registro | Prioridad: MUST | Fuente: Alcance M1; Brief R3; Respuesta ronda 2, pregunta 4; decisión del usuario (modelo mixto de corrección, 2026-11-05)
Patrón EARS: Unwanted
SI el usuario registra un comprobante cuyo número de documento (RN-093) ya existe en un comprobante no anulado de la misma empresa y del mismo tipo de movimiento, el sistema NO DEBE guardarlo. En un comprobante por pagar, la comparación se hace además dentro del mismo proveedor: dos proveedores distintos pueden tener el mismo número de documento.
✅ **Ejemplo:** existe F001-00045 por cobrar; un nuevo intento con F001-00045 por cobrar es rechazado.
✅ **Ejemplo:** F001-00045 por cobrar fue anulado; un nuevo F001-00045 por cobrar se guarda.
✅ **Ejemplo:** existe F001-00045 por pagar del proveedor "Distribuidora Ejemplo SAC"; un F001-00045 por pagar del proveedor "Comercial Muestra SAC" se guarda.
❌ **Contraejemplo:** se guardan dos registros F001-00045 por cobrar no anulados en la misma empresa.
❌ **Contraejemplo:** se guardan dos registros F001-00045 por pagar no anulados del mismo proveedor.
❌ **Contraejemplo:** F001-00045 por cobrar fue anulado y el nuevo registro con F001-00045 por cobrar es rechazado.
❌ **Contraejemplo:** F001-00045 por pagar de "Comercial Muestra SAC" es rechazado porque ya existe F001-00045 por pagar de "Distribuidora Ejemplo SAC".
✅ **Ejemplo de concurrencia:** dos usuarios registran a la vez F001-00045 por cobrar, o uno lo registra mientras otro edita un comprobante y le cambia el número a F001-00045. Se guarda la primera operación y la otra se rechaza como duplicada (RN-160). La unicidad la garantiza el almacenamiento, no una consulta previa.
❌ **Contraejemplo:** dos altas simultáneas dejan dos F001-00045 por cobrar no anulados.

**RN-004** | Categoría: Registro | Prioridad: MUST | Fuente: Brief R3; Respuesta ronda 2, pregunta 4
Patrón EARS: Ubiquitous
El sistema DEBE permitir el mismo número de documento en tipos de movimiento distintos dentro de la misma empresa.
✅ **Ejemplo:** F001-00045 por cobrar y F001-00045 por pagar se guardan como dos comprobantes válidos.
❌ **Contraejemplo:** al registrar F001-00045 por pagar, el sistema lo rechaza porque ya existe F001-00045 por cobrar.

**RN-093** | Categoría: Registro | Prioridad: MUST | Fuente: Auditoría QA C-06; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
El sistema DEBE guardar el número de documento sin espacios al inicio ni al final y en mayúsculas, y DEBE compararlo en esa forma para la unicidad (RN-003). El sistema NO DEBE completar ceros ni cambiar el formato, y NO DEBE aceptar espacios dentro del número. Longitud y caracteres permitidos: RN-162.
✅ **Ejemplo:** el usuario escribe " f001-00045 " y el sistema guarda "F001-00045".
✅ **Ejemplo:** existe F001-00045 por cobrar; el intento con "f001-00045" se rechaza como duplicado.
✅ **Ejemplo:** existe F001-00045 por cobrar; "F001-45" se guarda porque es un número distinto.
❌ **Contraejemplo:** "f001-00045" y "F001-00045" se guardan como dos comprobantes por cobrar no anulados.
❌ **Contraejemplo:** el sistema convierte "F001-45" en "F001-00045".
❌ **Contraejemplo:** se guarda el número "F001 00045" con un espacio interno.

**RN-005** | Categoría: Registro | Prioridad: MUST | Fuente: Brief R3; Alcance O1; Respuesta ronda 2, pregunta 4
Patrón EARS: Unwanted
El sistema NO DEBE consultar el número de documento en SUNAT al registrar un comprobante.
✅ **Ejemplo:** el comprobante F999-00000001 se guarda sin ninguna llamada externa.
❌ **Contraejemplo:** el comprobante F999-00000001 es rechazado porque no se encontró en SUNAT.

**RN-006** | Categoría: Datos | Prioridad: MUST | Fuente: Brief §7 (Restricciones de datos); Alcance O5
Patrón EARS: Unwanted
El sistema NO DEBE solicitar ni almacenar números de cuenta ni CCI de clientes o proveedores.
✅ **Ejemplo:** el formulario de proveedor "Distribuidora Ejemplo SAC" no muestra ningún campo de CCI.
❌ **Contraejemplo:** el formulario de proveedor muestra un campo "CCI" y guarda el valor "00219300000000000000".

**RN-126** | Categoría: Registro | Prioridad: MUST | Fuente: Auditoría QA A-14; decisión del usuario (2026-11-06); Alcance M1
Patrón EARS: Event-driven
CUANDO se registra un contacto, el sistema DEBE exigir el nombre (de la persona o razón social) y el correo electrónico (RN-044). El teléfono y la dirección son opcionales. El sistema NO DEBE solicitar DNI ni RUC del contacto. Un nombre o correo que queda vacío tras quitar los espacios exteriores se considera faltante; su longitud, caracteres y formato se validan según RN-162.
✅ **Ejemplo:** el contacto "Cliente SAC" se guarda con nombre y "cliente@cliente.example", sin teléfono ni dirección.
❌ **Contraejemplo:** el sistema guarda un contacto sin nombre, o el formulario de contacto exige el RUC.

**RN-127** | Categoría: Registro | Prioridad: MUST | Fuente: Auditoría QA A-14; decisión del usuario (2026-11-06); PRINCIPIO-003
Patrón EARS: Unwanted
SI el correo de un contacto, comparado sin espacios al inicio ni al final y sin distinguir mayúsculas de minúsculas, ya pertenece a otro contacto de la misma empresa, incluidos los contactos desactivados (RN-130), el sistema NO DEBE guardarlo. El sistema DEBE admitir el mismo correo en contactos de empresas distintas, sujeto a las demás validaciones del contacto. La comparación exacta DEBE funcionar con el correo cifrado mediante RN-139 y RN-140, siempre limitada a la empresa gestionada, tanto al registrar como al editar y sin revelar contactos de otras empresas. Desactivar un contacto conserva la reserva de su correo; eliminarlo conforme a RN-130 DEBE liberar esa reserva, retirando el valor cifrado y todas sus referencias de búsqueda vigentes (RN-140, RN-224 y RN-226), también durante una rotación. El sistema DEBE permitir reutilizar el correo liberado en un contacto nuevo con otro identificador, sin recuperar automáticamente el historial del eliminado.
✅ **Ejemplo:** la empresa 1 tiene el contacto con "cliente@cliente.example"; el registro de otro contacto con "Cliente@Cliente.example " es rechazado.
✅ **Ejemplo:** la empresa 2 registra un contacto con "cliente@cliente.example", que ya existe en la empresa 1, y se guarda.
✅ **Ejemplo:** tras eliminar el contacto 42 sin comprobantes, la empresa 1 registra el contacto nuevo 43 con el correo liberado; no recupera el historial del contacto 42.
❌ **Contraejemplo:** la empresa 1 guarda dos contactos con "cliente@cliente.example".
❌ **Contraejemplo:** se rechaza el contacto de la empresa 2 solo porque su correo existe en la empresa 1, o se mantiene reservado el correo del contacto 42 eliminado.

**RN-128** | Categoría: Registro | Prioridad: MUST | Fuente: Auditoría QA A-14; decisión del usuario (2026-11-06)
Patrón EARS: Ubiquitous
El sistema NO DEBE asignar al contacto un tipo fijo de cliente o proveedor. Un contacto es cliente cuando tiene comprobantes por cobrar y proveedor cuando tiene comprobantes por pagar. El sistema DEBE admitir ambas condiciones simultáneas en un único contacto.
✅ **Ejemplo:** "Comercial Muestra SAC" tiene F001-00045 por cobrar y F002-00010 por pagar; aparece como cliente y como proveedor con un solo registro y un solo correo.
❌ **Contraejemplo:** el sistema obliga a registrar "Comercial Muestra SAC" dos veces, una como cliente y otra como proveedor.

**RN-129** | Categoría: Datos | Prioridad: MUST | Fuente: Auditoría QA A-14; decisión del usuario (2026-11-06); PRINCIPIO-006
Patrón EARS: Event-driven
CUANDO un usuario edita un contacto ACTIVO o DESACTIVADO, el sistema DEBE permitir cambiar su nombre, correo, teléfono y dirección aunque tenga cuotas con saldo, DEBE aplicar las mismas validaciones que al registrarlo (RN-126, RN-127, RN-162) y DEBE guardar, por cada campo cambiado, el valor anterior, el valor nuevo, el identificador del usuario y la fecha y hora de la edición en formato ISO 8601. Los avisos posteriores a la edición se envían al correo nuevo.
✅ **Ejemplo:** el correo de "Cliente SAC" cambia de "pagos@cliente.example" a "tesoreria@cliente.example"; se guardan ambos valores, el usuario_id = 7 y "2026-11-06T10:00:00-05:00".
❌ **Contraejemplo:** el sistema rechaza la edición del correo porque el contacto tiene una cuota VENCIDA, o la guarda sin registrar el valor anterior.

**RN-130** | Categoría: Registro | Prioridad: MUST | Fuente: Auditoría QA A-14; decisión del usuario (2026-11-06); auditoría QA2-03; decisión del usuario (2026-11-07); PRINCIPIO-006
Patrón EARS: Unwanted
El contacto DEBE tener uno de dos estados: ACTIVO o DESACTIVADO; se crea ACTIVO. El sistema DEBE permitir a cualquier usuario de la empresa crear, editar, desactivar y reactivar sus contactos, conforme a RN-060 y las validaciones de cada operación. El catálogo es compartido por los usuarios de esa empresa y NO DEBE mostrar contactos de otras empresas. Al registrar o cambiar el contacto de un comprobante, el usuario DEBE buscar y seleccionar un contacto ACTIVO de su empresa.
SI un contacto tiene al menos un comprobante registrado, incluidos los anulados, el sistema NO DEBE eliminarlo; el sistema DEBE permitir su edición, desactivación o reactivación, sujetas a las validaciones de cada operación. Desactivar conserva sus datos, comprobantes, cuotas e historial y la reserva de su correo. Sus cuotas con saldo siguen en la lista de cuotas por avisar; el sistema DEBE permitir avisarlas si cumplen RN-155 y las demás validaciones del envío.
CUANDO un usuario de la empresa solicita eliminar un contacto sin comprobantes, ACTIVO o DESACTIVADO, el sistema DEBE pedir confirmación. Al confirmar, DEBE verificar de nuevo en el servidor que no tenga comprobantes y eliminar el registro y liberar su correo como una sola operación (RN-127, RN-160). Si se registra un comprobante concurrentemente, el sistema DEBE garantizar que se complete como máximo una de las dos operaciones: NO DEBE dejar un comprobante sin contacto ni eliminar un contacto con comprobantes. La eliminación ordinaria NO DEBE borrar ni modificar comprobantes, cuotas o pagos. La excepción por baja contractual de toda la empresa se rige por RN-152.
✅ **Ejemplo:** un usuario elimina, tras confirmar, un contacto sin comprobantes; su correo queda disponible para un contacto nuevo de la misma empresa, con otro identificador.
✅ **Ejemplo:** un contacto con un comprobante anulado no puede eliminarse; puede desactivarse y luego reactivarse conservando sus datos e historial.
✅ **Ejemplo:** un contacto desactivado no aparece al seleccionar contacto para un comprobante nuevo, pero sus cuotas con saldo siguen disponibles para avisar conforme a RN-155.
❌ **Contraejemplo:** el sistema elimina un contacto con comprobantes o permite seleccionar uno desactivado para un comprobante nuevo.
❌ **Contraejemplo:** la confirmación usa solo la validación del navegador y elimina un contacto al que otro usuario acaba de registrar un comprobante.

**RN-131** | Categoría: Registro | Prioridad: MUST | Fuente: Auditoría QA A-14; decisión del usuario (2026-11-06); Alcance M1
Patrón EARS: Unwanted
SI al registrar un comprobante falta el tipo de movimiento, el contacto, el número de documento, la moneda, el total, la fecha de emisión o al menos una cuota, el sistema NO DEBE guardarlo. Un número de documento que queda vacío tras quitar los espacios exteriores se considera faltante; su validación completa está en RN-162.
✅ **Ejemplo:** F001-00045 por cobrar de "Cliente SAC" en S/, por S/ 3,000.00, emitido el 2026-11-04 y con 3 cuotas, se guarda.
❌ **Contraejemplo:** el sistema guarda F001-00045 sin fecha de emisión.

**RN-162** | Categoría: Registro | Prioridad: MUST | Fuente: Auditoría QA2-24; decisión del usuario (2026-11-08); RN-093; RN-126; RN-139; decisiones QA-03, QA-04, QA-05 y QA-06 de la revisión QA de HUs (2026-11-09)
Patrón EARS: Unwanted
El sistema DEBE validar en el servidor, con el mismo procedimiento al registrar y al editar, los campos de texto siguientes, en este orden: (1) quitar los espacios exteriores (TRIM); (2) convertir a mayúsculas, salvo el correo, que se convierte a minúsculas conforme a RN-139; (3) comprobar que no quede vacío cuando el campo es obligatorio; (4) comprobar la longitud máxima; (5) comprobar los caracteres permitidos. Un campo obligatorio que queda vacío tras el TRIM se considera faltante (RN-131, RN-126, RN-044). SI un valor incumple alguna comprobación, el sistema NO DEBE guardarlo, NO DEBE truncarlo ni corregirlo en silencio y DEBE informar el motivo. La conversión a mayúsculas que hace la interfaz es solo una comodidad: el servidor DEBE aplicarla siempre, de modo que una llamada directa al API guarde el mismo valor. «Letra» incluye las vocales con tilde, la ñ y la ü. Los límites cuentan caracteres, no bytes, y se miden sobre el valor ya recortado y convertido a mayúsculas o minúsculas, que es el que se guarda; la conversión no depende de la configuración regional del servidor.

| Campo | Obligatorio | Longitud | Caracteres permitidos |
|---|---|---|---|
| Número de documento | Sí | 1 a 30 | Letras, dígitos, «-» y «_»; sin espacios (RN-093) |
| Nombre del contacto | Sí | 1 a 250 | Letras, dígitos, espacios y los signos «.», «,», «&», «-», «'» (apóstrofo recto), «(», «)» y «/»; DEBE contener al menos una letra; los espacios repetidos entre palabras se reducen a uno (QA-05) |
| Razón social de la empresa | Sí | 1 a 250 | Los mismos que el nombre del contacto: letras, dígitos, espacios y los signos «.», «,», «&», «-», «'» (apóstrofo recto), «(», «)» y «/»; DEBE contener al menos una letra; los espacios repetidos entre palabras se reducen a uno (QA-06) |
| Correo del contacto | Sí | 1 a 250 | Formato de correo electrónico válido: una sola «@», parte local y dominio no vacíos, dominio con al menos un punto, sin espacios; no se verifica que el buzón exista |
| Comentario del aviso | No | 0 a 500 | Texto simple; sin otra restricción de caracteres (PRINCIPIO-005, RN-014). Se convierte a mayúsculas como los demás campos de texto (paso 2) y se guarda y envía así (QA-04) |
| Motivo de anulación (pago o comprobante) | Sí | 1 a 500 | Texto simple; sin otra restricción de caracteres (PRINCIPIO-005, RN-014). Los espacios internos se conservan. Se convierte a mayúsculas como los demás campos de texto (paso 2) y se guarda así (QA-03) |

Si el comentario queda vacío tras el TRIM, se trata como «sin comentario»: el aviso se envía igual y no se guarda texto. Esta regla no impone formato SUNAT ni completa ceros (RN-093). La validación sintáctica del correo no sustituye la normalización de RN-139 ni la unicidad de RN-127. La razón social se valida al crear la empresa (RN-094) y en cualquier modificación de ese dato que se habilite; esta regla no define quién puede modificarla. La razón social no es única ni se coteja con el RUC ni con SUNAT (RN-005, RN-096): la empresa se identifica por su RUC. Si la razón social se rechaza, el alta no crea la empresa ni su primer administrador (RN-211). Una razón social puede ser el nombre de una persona natural con negocio y se trata como dato personal según RN-014 (QA-06). Un motivo de anulación vacío tras el TRIM se considera faltante y la anulación no se crea (RN-030, RN-061); para este campo, el TRIM quita también tabulaciones, saltos de línea y espacios no separables, de modo que un motivo formado solo por ellos se rechaza. La anulación es inmutable (RN-029): el motivo solo se valida al crearla. El mensaje de rechazo informa la causa sin repetir el texto del motivo (RN-014) (QA-03).
✅ **Ejemplo:** el usuario escribe " f001-00045 " como número de documento y el sistema guarda "F001-00045".
✅ **Ejemplo:** el nombre "  cliente   sac " se guarda como "CLIENTE SAC".
✅ **Ejemplo:** el nombre "ÑANDÚ PERÚ" se guarda; el correo " Ana.Lopez+pagos@Empresa.example " se guarda como "ana.lopez+pagos@empresa.example".
✅ **Ejemplo:** el comentario "   " se trata como sin comentario y el aviso se envía; un comentario de exactamente 500 caracteres se acepta.
✅ **Ejemplo (QA-04):** el comentario "Favor confirmar fecha de pago" se guarda y se envía en el correo como "FAVOR CONFIRMAR FECHA DE PAGO".
✅ **Ejemplo (QA-05):** los nombres "Cía. Perú 2", "Comercial Andina S.A.C.", "3M Perú S.A.", "Pérez & Hijos E.I.R.L.", "D'Onofrio" y "Transportes (Lima) / Sur" se guardan como "CÍA. PERÚ 2", "COMERCIAL ANDINA S.A.C.", "3M PERÚ S.A.", "PÉREZ & HIJOS E.I.R.L.", "D'ONOFRIO" y "TRANSPORTES (LIMA) / SUR".
✅ **Ejemplo (QA-03):** el motivo de anulación "  digitación errónea " se guarda como "DIGITACIÓN ERRÓNEA"; un motivo de exactamente 500 caracteres se acepta.
❌ **Contraejemplo:** se guarda un número de documento "   " (vacío tras el TRIM), "F001/45", "F001 45" o de 31 caracteres.
❌ **Contraejemplo (QA-03):** se crea una anulación con el motivo "   ", con un motivo formado solo por tabulaciones o saltos de línea, o con un motivo de 501 caracteres truncado a 500.
❌ **Contraejemplo:** se guarda el nombre "123" o "..." (sin letras), "Cliente #1", "Cliente@SAC" o "Cliente_SAC" (caracteres no permitidos), "   " o de 251 caracteres.
✅ **Ejemplo (QA-06):** las razones sociales "  comercial   andina s.a.c. ", "Pérez & Hijos E.I.R.L.", "3M Perú S.A." y "D'Onofrio" se guardan como "COMERCIAL ANDINA S.A.C.", "PÉREZ & HIJOS E.I.R.L.", "3M PERÚ S.A." y "D'ONOFRIO".
❌ **Contraejemplo (QA-06):** se crea una empresa con la razón social "   ", "123", "Empresa #1", "Empresa_SAC" o una de 251 caracteres, o se crea su primer administrador aunque la razón social se haya rechazado.
❌ **Contraejemplo:** el comentario "Favor confirmar fecha de pago" se guarda o se envía en minúsculas, o una llamada directa al API lo guarda sin convertir a mayúsculas.
❌ **Contraejemplo:** se guarda el correo "abc", "ana@", "ana@empresa", "ana@@empresa.example", "ana lopez@empresa.example" o uno de 251 caracteres.
❌ **Contraejemplo:** el sistema recorta un comentario de 600 caracteres a 500 y lo guarda, o una llamada directa al API guarda "f001-1" en minúsculas.

**RN-132** | Categoría: Registro | Prioridad: MUST | Fuente: Auditoría QA A-14; decisión del usuario (2026-11-06); Alcance M1
Patrón EARS: Unwanted
SI el total de un comprobante es igual o menor que cero, el sistema NO DEBE guardarlo. También se aplica la validación de formato y precisión de RN-153.
✅ **Ejemplo:** un comprobante por US$ 0.01 se guarda.
❌ **Contraejemplo:** el sistema guarda un comprobante por S/ 0.00 o por S/ -100.00.

**RN-133** | Categoría: Registro | Prioridad: MUST | Fuente: Auditoría QA A-14; decisión del usuario (2026-11-06); Alcance M1
Patrón EARS: Unwanted
SI la fecha de emisión de un comprobante es posterior a la fecha en que se registra o edita, el sistema NO DEBE guardarlo.
✅ **Ejemplo:** el 2026-11-06 se registra un comprobante emitido el 2026-11-06 o el 2026-10-20, y se guarda.
❌ **Contraejemplo:** el 2026-11-06 se guarda un comprobante con fecha de emisión 2026-11-10.

---

## Seguridad

**RN-007** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003
Patrón EARS: Ubiquitous
El sistema DEBE filtrar cada consulta de datos de negocio por el identificador de empresa del usuario autenticado.
✅ **Ejemplo:** un usuario de la empresa 1 lista sus clientes y recibe solo los registros con empresa_id = 1.
❌ **Contraejemplo:** un usuario de la empresa 1 lista clientes y recibe también los registros con empresa_id = 2.

**RN-008** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003
Patrón EARS: Event-driven
CUANDO un usuario solicita un registro que pertenece a otra empresa, el sistema DEBE responder HTTP 404 con el mismo cuerpo que para un registro inexistente.
✅ **Ejemplo:** un usuario de la empresa 1 solicita el cliente 42 (empresa 2) y recibe 404; el cuerpo coincide con la respuesta para el cliente 9999 inexistente.
❌ **Contraejemplo:** un usuario de la empresa 1 solicita el cliente 42 (empresa 2) y recibe 403 con el mensaje "el cliente 42 pertenece a otra empresa".

**RN-009** | Categoría: Seguridad | Prioridad: MUST | Fuente: Alcance M6; PRINCIPIO-003
Patrón EARS: Ubiquitous
El sistema DEBE crear usuarios solo dentro de la empresa del usuario que realiza la creación.
✅ **Ejemplo:** el usuario de la empresa 1 crea "ana@empresa1.example" con empresa_id = 1.
❌ **Contraejemplo:** el usuario de la empresa 1 crea "ana@empresa2.example" con empresa_id = 2.

**RN-070** | Categoría: Seguridad | Prioridad: MUST | Fuente: Decisión de la pregunta 14
Patrón EARS: Unwanted
SI un usuario sin rol ADMINISTRADOR intenta crear otro usuario, el sistema NO DEBE crear el usuario.
✅ **Ejemplo:** un usuario con rol SUPERVISOR intenta crear "luis@empresa1.example" y recibe un error de permiso; el usuario no se crea.
❌ **Contraejemplo:** un usuario con rol SUPERVISOR crea "luis@empresa1.example" y el usuario queda activo.

**RN-010** | Categoría: Seguridad | Prioridad: MUST | Fuente: Alcance M6
Patrón EARS: Ubiquitous
El sistema DEBE ofrecer los roles ADMINISTRADOR, OPERADOR y SUPERVISOR al asignar un rol a un usuario, y DEBE asignar exactamente un rol a cada usuario. Cambiar el rol de un usuario reemplaza el anterior y no lo suma; el cambio efectivo cierra sus sesiones según RN-161.
✅ **Ejemplo:** el selector de rol de un usuario muestra exactamente ADMINISTRADOR, OPERADOR y SUPERVISOR. Un usuario que pasa de OPERADOR a SUPERVISOR deja de tener el rol OPERADOR.
❌ **Contraejemplo:** el selector de rol muestra el rol VENTAS, que no está definido en el alcance. Un usuario tiene OPERADOR y SUPERVISOR a la vez.

**RN-011** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06)
Patrón EARS: Ubiquitous
El sistema DEBE cifrar con AES-256-GCM, antes de persistir, el correo, teléfono y dirección de los contactos cuando existan; el RUC y correo administrativo de las empresas; y el correo de acceso de los usuarios.
✅ **Ejemplo:** El RUC 20601234567 se guarda cifrado con AES-256-GCM.
❌ **Contraejemplo:** La columna ruc guarda 20601234567 en texto plano.

**RN-189** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-011 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE aplicar el cifrado de RN-011 a las copias persistidas de esos campos en historiales, destinatarios de avisos y auditorías.
✅ **Ejemplo:** El destinatario ana@example.com queda cifrado también en el aviso 501 y su auditoría.
❌ **Contraejemplo:** El contacto está cifrado, pero el historial del aviso 501 conserva su correo legible.

**RN-190** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-011 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE usar un valor de inicialización que no se repita con la misma clave de cifrado.
✅ **Ejemplo:** Dos cifrados del correo ana@example.com con la clave versión 1 usan IV distintos.
❌ **Contraejemplo:** Dos procesos reutilizan el mismo IV con la clave versión 1.

**RN-191** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-011 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO descifra un valor protegido por RN-011, el sistema DEBE verificar su integridad.
✅ **Ejemplo:** Al leer el contacto 42 se comprueba la etiqueta de autenticación antes de utilizar su correo.
❌ **Contraejemplo:** Se descifra el correo del contacto 42 sin comprobar su etiqueta.

**RN-192** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-011 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Unwanted
SI falla la verificación de integridad de un valor cifrado, el sistema NO DEBE devolver el contenido ni recurrir a una copia en texto plano como alternativa.
✅ **Ejemplo:** La etiqueta alterada del contacto 42 impide devolver su correo.
❌ **Contraejemplo:** Una etiqueta alterada provoca que se devuelva el correo desde una columna auxiliar legible.

**Contexto de RN-011:** no se exige solicitar DNI ni RUC de contactos (RN-126). Las contraseñas siguen RN-143 y RN-243 a RN-253. El alcance de cifrado no se amplía por la definición de datos personales. Véase `otros/06-diseno-seguridad-datos.md`.

**RN-012** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004
Patrón EARS: Unwanted
SI una conexión a la API utiliza una versión de TLS inferior a 1.2, el sistema NO DEBE aceptarla.
✅ **Ejemplo:** una conexión con TLS 1.3 responde normalmente.
❌ **Contraejemplo:** una conexión con TLS 1.0 recibe respuesta 200.

**RN-013** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-011; Respuesta constitución, pregunta 6; decisión de la pregunta 33 (2026-11-06)
Patrón EARS: Unwanted
SI el sistema opera en un entorno de pruebas, el sistema NO DEBE enviar avisos de vencimiento ni ningún otro correo a direcciones de clientes, proveedores o usuarios reales. La cuenta de correo de prueba es un buzón dedicado del proyecto, no una cuenta personal, que define la persona encargada del proyecto. El código DEBE aplicar una lista de destinatarios permitidos que contenga solo esa cuenta y DEBE bloquear el envío a cualquier otra dirección, también en copias, aunque la configuración del entorno indique otra cosa.
✅ **Ejemplo:** en pruebas, el aviso de la cuota 2 de F001-00045 se envía solo a la cuenta de prueba del proyecto.
❌ **Contraejemplo:** en pruebas, el aviso de la cuota 2 de F001-00045 se envía a "compras@cliente-real.example", o se envía la copia al correo administrativo real de una empresa.

---

## Datos

**RN-014** | Categoría: Datos | Prioridad: MUST | Fuente: PRINCIPIO-005; Auditoría QA A-15; decisión del usuario (2026-11-06)
Patrón EARS: Ubiquitous
El sistema y el trabajo de desarrollo NO DEBEN exponer datos personales reales en logs, mensajes de error, prompts de agentes de IA ni fixtures del repositorio, incluidos los datos contenidos en objetos completos y en textos libres.
✅ **Ejemplo:** El error de la cuota 12 indica IMPORTE_SUPERA_SALDO sin nombres ni importes.
❌ **Contraejemplo:** El cuerpo del error de la cuota 12 contiene el nombre del contacto o saldo_vigente=600.00.

**RN-193** | Categoría: Datos | Prioridad: MUST | Fuente: PRINCIPIO-005; Auditoría QA A-15; decisión del usuario (2026-11-06); RN-014 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Para diagnóstico se DEBEN usar eventos, identificadores internos y códigos de error, sin adjuntar datos personales ni importes vinculados a personas.
✅ **Ejemplo:** Se registra evento=pago_rechazado contacto_id=42 codigo=IMPORTE_SUPERA_SALDO.
❌ **Contraejemplo:** El mismo evento registra contacto_id=42 saldo=600.00.

**RN-194** | Categoría: Datos | Prioridad: MUST | Fuente: PRINCIPIO-005; Auditoría QA A-15; decisión del usuario (2026-11-06); RN-014 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Los fixtures y ejemplos de desarrollo DEBEN usar datos ficticios, sin copiar registros reales.
✅ **Ejemplo:** Un fixture del contacto 42 usa el correo ficticio contacto@example.com.
❌ **Contraejemplo:** El fixture copia el registro real del contacto 42 aunque cambie su nombre.

**RN-195** | Categoría: Datos | Prioridad: MUST | Fuente: PRINCIPIO-005; Auditoría QA A-15; decisión del usuario (2026-11-06); RN-014 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE buscar, depurar ni sustituir datos personales dentro de los campos de texto libre que completa el usuario (PRINCIPIO-005, E-010).
✅ **Ejemplo:** El comentario del aviso 501 conserva el texto ingresado, sujeto únicamente a su contrato de entrada RN-162.
❌ **Contraejemplo:** El sistema busca nombres dentro del comentario 501 y los sustituye automáticamente.

**RN-196** | Categoría: Datos | Prioridad: MUST | Fuente: PRINCIPIO-005; Auditoría QA A-15; decisión del usuario (2026-11-06); RN-014 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El uso funcional de datos personales en pantallas, reportes y avisos DEBE respetar los permisos, destinatarios y aislamiento por empresa establecidos para cada funcionalidad.
✅ **Ejemplo:** El reporte de la empresa 1 muestra sus contactos únicamente a sus usuarios autorizados.
❌ **Contraejemplo:** Un usuario de la empresa 2 consulta los datos del contacto 42 de la empresa 1.

**RN-197** | Categoría: Datos | Prioridad: MUST | Fuente: PRINCIPIO-005; Auditoría QA A-15; decisión del usuario (2026-11-06); RN-014 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Al rechazar una operación, la interfaz PUEDE mostrar al usuario autorizado datos económicos de esa operación obtenidos de una consulta autorizada o calculados con sus propios datos de entrada, fuera del mensaje de error; esta alternativa no incorpora esos datos al error de RN-014.
✅ **Ejemplo:** Tras el rechazo, la pantalla consulta la cuota 12 y muestra Saldo vigente: S/ 600.00 junto al error genérico.
❌ **Contraejemplo:** La pantalla obtiene S/ 600.00 del cuerpo de la respuesta de error en vez de una fuente autorizada separada.

**Contexto de RN-014:** son datos personales toda información que identifica o permite identificar a una persona natural y la información económica vinculada a ella: nombres, DNI, RUC cuando identifica a una persona natural, teléfono, correo, dirección, deudas, saldos y pagos, sin lista exhaustiva. La política se aplica a todos los contactos porque el sistema no distingue personas naturales (RN-126), sin exigir DNI ni RUC. Un mensaje de error comprende texto y cuerpo de respuestas de error del API, excepciones y registros técnicos. Los identificadores internos de diagnóstico no garantizan anonimato. Quien ingresa textos libres decide y responde por su contenido (QA2-16, E-010); RN-195 no elimina la prohibición de exponerlos de RN-014 ni el contrato de entrada RN-162. RN-196 y RN-197 no amplían los campos cifrados de RN-011 ni convierten en opcional una visualización exigida por otra regla, como RN-092.

**RN-150** | Categoría: Datos | Prioridad: MUST | Fuente: decisión de la pregunta 28 (2026-11-06); Ley 29733 y su reglamento (D.S. 016-2024-JUS); PRINCIPIO-006 (E-008); auditoría QA2-01
Patrón EARS: State-driven
MIENTRAS el contrato de la empresa esté vigente, el sistema NO DEBE depurar ni eliminar comprobantes, cuotas, pagos, anulaciones, contactos con comprobantes, usuarios ni historiales.
✅ **Ejemplo:** una empresa con el contrato vigente conserva en 2028 los pagos que registró en 2026.
❌ **Contraejemplo:** el sistema borra automáticamente los pagos de hace dos años de una empresa con contrato vigente.

**Contexto de RN-150 (QA2-29):** contrato vigente es la relación de servicio cuya fecha y hora efectiva de terminación formalizada aún no se ha alcanzado; sin terminación formalizada, sigue vigente. Desactivar usuarios, cerrar sesiones o dejar de usar el sistema no termina el contrato. La formalización, eliminación y reaplicación de bajas al restaurar se rigen por RN-152, con las condiciones vigentes de QA2-12. La conservación permite a la empresa atender su obligación tributaria; en la modalidad local, la empresa administra la retención de su instalación y respaldos.

**RN-151** | Categoría: Datos | Prioridad: MUST | Fuente: decisión de la pregunta 28 (2026-11-06), revisada por decisión del usuario sobre QA2-10 (2026-11-07); PRINCIPIO-005; PRINCIPIO-006
Patrón EARS: Event-driven
CUANDO un contacto solicita la eliminación de sus datos personales, la solicitud DEBE atenderse a través de la empresa mediante un procedimiento interno separado del mantenimiento ordinario de contactos.
✅ **Ejemplo:** La solicitud sobre el contacto 42 se deriva a la empresa para evaluación mediante el procedimiento interno.
❌ **Contraejemplo:** El mantenimiento ordinario considera suficiente tramitar la solicitud como una desactivación.

**RN-254** | Categoría: Datos | Prioridad: MUST | Fuente: decisión de la pregunta 28 (2026-11-06), revisada por decisión del usuario sobre QA2-10 (2026-11-07); PRINCIPIO-005; PRINCIPIO-006; RN-151 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
La desactivación de un contacto NO DEBE presentarse como atención de una solicitud de eliminación de datos personales.
✅ **Ejemplo:** Desactivar al contacto 42 conserva sus datos y no marca como atendida su solicitud de eliminación.
❌ **Contraejemplo:** Se declara atendida la solicitud del contacto 42 únicamente porque quedó DESACTIVADO.

**RN-255** | Categoría: Datos | Prioridad: MUST | Fuente: decisión de la pregunta 28 (2026-11-06), revisada por decisión del usuario sobre QA2-10 (2026-11-07); PRINCIPIO-005; PRINCIPIO-006; RN-151 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
La eliminación ordinaria de contactos DEBE limitarse a los casos admitidos por RN-130, sin autorizar el borrado de registros económicos ni suponer la eliminación de todas las copias históricas de datos personales.
✅ **Ejemplo:** El contacto 42 con comprobantes no se borra desde el mantenimiento.
❌ **Contraejemplo:** Se elimina el pago 1001 para permitir borrar al contacto 42 o se promete borrar todas sus copias por eliminarlo del mantenimiento.

**RN-256** | Categoría: Datos | Prioridad: MUST | Fuente: decisión de la pregunta 28 (2026-11-06), revisada por decisión del usuario sobre QA2-10 (2026-11-07); PRINCIPIO-005; PRINCIPIO-006; RN-151 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El mantenimiento NO DEBE ofrecer seudonimización como estado, acción de usuario ni sustitución automática de datos.
✅ **Ejemplo:** El contacto 42 solo ofrece ACTIVO y DESACTIVADO, sin acción de seudonimización.
❌ **Contraejemplo:** Se ofrece el estado SEUDONIMIZADO o se sustituyen automáticamente los datos del contacto 42.

**RN-257** | Categoría: Datos | Prioridad: MUST | Fuente: decisión de la pregunta 28 (2026-11-06), revisada por decisión del usuario sobre QA2-10 (2026-11-07); PRINCIPIO-005; PRINCIPIO-006; RN-151 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El procedimiento de solicitudes de eliminación NO DEBE buscar ni sustituir datos personales dentro de textos libres ingresados por el usuario (PRINCIPIO-005, E-010).
✅ **Ejemplo:** La solicitud del contacto 42 no busca ni sustituye datos dentro de comentarios de avisos.
❌ **Contraejemplo:** El procedimiento recorre el comentario del aviso 501 y sustituye automáticamente nombres.

**Pendiente de RN-151:** el procedimiento interno, sus responsables, autorizaciones y alcance sobre historiales, copias y respaldos siguen [pendiente de confirmación: pregunta 31]. La separación de RN-254 a RN-257 no define ese procedimiento ni lo acredita como operativo. La retirada de la seudonimización sustituye su versión anterior (QA2-10); la responsabilidad sobre textos libres sigue QA2-16 y E-010. La restauración tras bajas contractuales sigue RN-152 y el diseño de seguridad (QA2-11).

**RN-152** | Categoría: Datos | Prioridad: MUST | Fuente: decisión de la pregunta 28 (2026-11-06); auditoría QA2-01; decisión del usuario (2026-11-06); decisión QA2-11 (2026-11-07); decisiones QA2-29 y QA2-12 (2026-11-08); PRINCIPIO-003; PRINCIPIO-006 (E-008, E-011)
Patrón EARS: Event-driven
Por decisión QA2-29 (2026-11-08), la terminación contractual DEBE formalizarla una persona autorizada del equipo de VenceYa mediante un procedimiento interno, sustentado en una solicitud de un representante autorizado de la empresa o en una causa prevista en el contrato. El rol ADMINISTRADOR de la aplicación no acredita por sí solo esa representación ni permite terminar el contrato desde la aplicación. La constancia DEBE identificar la empresa, fundamento, evidencia, responsable de la formalización, fecha y hora del registro y fecha y hora efectiva de terminación, con zona horaria America/Lima. DEBE registrarse antes o en el momento de hacerse efectiva; NO DEBE fijarse retroactivamente. La solicitud por sí sola NO termina el contrato.
CUANDO se alcanza esa fecha y hora efectiva en la modalidad en la nube, el contrato termina y VenceYa DEBE bloquear el acceso de los usuarios de la empresa, invalidar sus sesiones y rechazar sin efectos sus operaciones de negocio, incluidos los avisos pendientes de envío. La restricción rige también al iniciar sesión (RN-101) y al comprobar una sesión existente (RN-149), aunque el usuario esté ACTIVO. La baja se gestiona mediante el procedimiento interno autorizado. Los datos DEBEN conservarse íntegros hasta la baja; la terminación no permite editarlos ni borrarlos parcialmente.
Por decisión QA2-12 (2026-11-08), la empresa es responsable de exportar y conservar los históricos disponibles antes de la terminación efectiva y del bloqueo de acceso, mediante las funciones de exportación existentes y sus permisos (RN-050, RN-051, RN-077 y RN-079). Se mantienen los formatos, filtros, columnas y exclusiones de S4; esta obligación del cliente NO incorpora S4 al MVP ni promete una copia completa de todos los datos. VenceYa NO DEBE incorporar un paquete de salida contractual, entrega gestionada, validación de descarga ni confirmación de recepción. No se exige que la empresa haya exportado para formalizar la terminación o ejecutar la baja, ni se reabre el acceso tras la terminación para exportar.
CUANDO termina el contrato de una empresa en la modalidad en la nube, VenceYa DEBE ejecutar su baja contractual dentro de los 30 días siguientes, contados desde la fecha y hora efectiva de terminación, no desde la solicitud ni desde una exportación. Que la empresa no haya exportado NO suspende ni amplía ese plazo. La baja:
1. DEBE ejecutarla una persona autorizada del equipo de VenceYa mediante un procedimiento interno. NO DEBE estar disponible desde la aplicación para ningún rol, tampoco para ADMINISTRADOR. `[pendiente de confirmación: si se exige la aprobación de una segunda persona]`
2. NO DEBE condicionarse a una exportación del cliente, una constancia de entrega ni una confirmación de recepción. La responsabilidad de exportar y conservar los históricos disponibles corresponde a la empresa antes de la terminación efectiva (QA2-12; E-011).
3. DEBE eliminar todos los datos de la empresa: comprobantes, cuotas, pagos, anulaciones, reprogramaciones, contactos, usuarios, avisos, configuración e historiales. NO DEBE dejar datos parciales ni afectar a ninguna otra empresa.
4. DEBE dejar un registro de baja en el archivo operativo de bajas del equipo de VenceYa, fuera de la base de datos del sistema y de su proceso de restauración. DEBE contener el identificador interno de la empresa, fecha y hora efectiva de terminación del contrato, fecha de la baja y referencia interna de la persona que la ejecutó, sin copiar datos personales de la empresa ni de sus contactos. No se exige fecha ni constancia de entrega de exportación. Las constancias o correos de baja se conservan como sustento con acceso restringido. El equipo DEBE conservar el registro actualizado y recuperable mientras exista algún respaldo administrado que pueda recuperar datos de la empresa. No basta con guardar el registro en otra tabla de la misma base.

CUANDO el equipo de VenceYa restaura un respaldo, DEBE mantener la copia aislada, sin acceso de usuarios ni envío de avisos, revisar el registro externo vigente y reaplicar las bajas contractuales posteriores al respaldo. DEBE verificar también que ninguna empresa registrada como dada de baja permanezca en la copia. Antes de habilitar el servicio, la persona autorizada DEBE verificar que los datos de esas empresas fueron eliminados y sus usuarios no pueden acceder, y dejar constancia de la revisión, las bajas reaplicadas, la fecha y el responsable, mediante referencias internas. Si el registro no está disponible o la verificación no termina satisfactoriamente, NO DEBE habilitar el servicio. Este control PUEDE ejecutarse manualmente conforme al diseño de seguridad; no requiere una función adicional de la aplicación.

La conservación de sus registros es responsabilidad de la empresa; no se transfiere mediante una entrega de exportación de VenceYa. Los respaldos NO DEBEN depurarse registro por registro: los datos eliminados desaparecen de ellos al vencer su periodo de retención. Las prohibiciones de eliminar de RN-028, RN-061, RN-099, RN-124 y RN-130 rigen mientras el contrato está vigente y no se aplican a la baja contractual.
El equipo DEBE conservar la constancia de terminación y su fecha y hora efectiva en el archivo operativo externo, con acceso restringido, desde la formalización. Antes de habilitar un respaldo restaurado DEBE reaplicar también el bloqueo de acceso, sesiones y avisos de los contratos ya terminados cuya baja aún no se haya ejecutado. La eliminación se rige por el procedimiento de baja, sin requisito de entrega de exportación. La restauración NO reinicia el plazo de 30 días. Estos controles se limitan al servicio en la nube; no conceden a VenceYa control sobre la instalación local de la empresa.
✅ **Ejemplo:** una solicitud se recibe el 2027-03-20 y se formaliza con terminación efectiva el 2027-03-31 a las 18:00 America/Lima. La empresa puede exportar los históricos disponibles mediante las funciones existentes antes de ese instante, con los permisos correspondientes. Desde ese instante se bloquean accesos y avisos. El plazo de baja vence el 2027-04-30 a las 18:00, haya exportado o no. La baja del 2027-04-20 conserva intactos los datos de otras empresas.
❌ **Contraejemplo:** se amplía el plazo de 30 días porque la empresa no descargó sus históricos, se exige evidencia de entrega para ejecutar la baja, se mantiene una sesión operativa tras la terminación o se interpreta la desactivación del último usuario como terminación contractual.
❌ **Contraejemplo:** un ADMINISTRADOR de la empresa 1 elimina el pago 1001 desde la aplicación alegando que el contrato terminó.
❌ **Contraejemplo:** la baja elimina los pagos y conserva los contactos y los usuarios de la empresa 1.
✅ **Ejemplo de restauración:** se restaura un respaldo del lunes; el registro externo contiene la baja ejecutada el martes. Antes de habilitar el servicio, el equipo vuelve a eliminar los datos de esa empresa, verifica que sus usuarios no tienen acceso y registra la revisión.
❌ **Contraejemplo:** se habilita el respaldo restaurado antes de revisar las bajas, permitiendo acceso o avisos de una empresa ya eliminada.
❌ **Contraejemplo:** el 2027-05-05 los datos de la empresa 1 siguen en producción porque el equipo espera una confirmación de descarga del cliente.

**RN-160** | Categoría: Datos | Prioridad: MUST | Fuente: Auditoría QA2-07; decisión del usuario (2026-11-07); RN-089; RN-092; RN-123; RN-156
Patrón EARS: Ubiquitous
El sistema DEBE ejecutar cada operación que crea o cambia registros como una unidad: se guardan todos sus efectos o ninguno, incluidos el registro principal, el historial de edición, la auditoría y los cambios de estado. Las condiciones de cada regla DEBEN evaluarse con el estado vigente en el momento de guardar, no con el que vio el usuario al abrir la pantalla. Cuando dos operaciones simultáneas son incompatibles, el sistema DEBE guardar solo la primera que se complete y rechazar la otra sin efectos parciales, mostrando al usuario el estado vigente.
SI el comprobante o la cuota sobre los que el usuario preparó una edición, un pago o una reprogramación cambiaron desde que los consultó, el sistema NO DEBE guardar la operación, aunque también fuera válida con los datos nuevos. DEBE rechazarla con el código `DATOS_DESACTUALIZADOS` y mostrar los datos vigentes para que el usuario decida de nuevo. Un rechazo no deja efectos ni consume la clave de operación de un pago (RN-156).
Esta regla se aplica, entre otros casos, a editar un comprobante mientras se registra un pago o una reprogramación (RN-082), anular un comprobante mientras se registra un pago o una reprogramación (RN-062, RN-091), dos reprogramaciones simultáneas de la misma cuota (RN-073), dos altas simultáneas del mismo número de documento (RN-003) y dos cambios simultáneos que dejarían a la empresa sin administrador activo (RN-100).
✅ **Ejemplo:** Luis abre la cuota 1 de F001-00045 para registrar un cobro y, antes de guardarlo, Ana edita el comprobante y cambia sus cuotas. El cobro de Luis se rechaza con «La cuota cambió; revise los datos vigentes» y no se guarda nada.
✅ **Ejemplo:** un pago y la anulación del comprobante llegan a la vez; se guarda solo uno y la operación rechazada no deja anulación, pago ni registro de historial.
❌ **Contraejemplo:** el sistema valida con los datos que el usuario vio al abrir la pantalla y guarda dos operaciones incompatibles.
❌ **Contraejemplo:** una edición rechazada deja guardado su registro de historial (RN-083) sin haber cambiado el comprobante.

---

## Crédito

**RN-015** | Categoría: Crédito | Prioridad: MUST | Fuente: Alcance M2; Respuesta ronda 2, pregunta 5; S5
Patrón EARS: Event-driven
CUANDO el usuario registra un comprobante a crédito y elige «En cuotas» e indica una cantidad válida (RN-154), el sistema DEBE proponer esa cantidad de cuotas de importe igual entre sí, proporcional al total del comprobante, salvo la diferencia de céntimos de RN-016, con vencimientos mensuales. La propuesta es solo una ayuda: el sistema DEBE permitir al usuario cambiar cualquier fecha o importe antes de guardar, sujeto a las validaciones de RN-017, RN-018 y RN-081; se guarda lo que el usuario deja. La cuota 1 propone vencer un mes calendario después de la fecha de emisión (fecha base). Las demás mantienen el mismo día del mes de la fecha base, calculadas siempre desde ella y no de cuota en cuota; si el mes no tiene ese día, se propone el último día del mes. En pago único (RN-057) se crea una cuota y el usuario indica su vencimiento.
✅ **Ejemplo:** un comprobante por US$ 3,000.00 en 3 cuotas, emitido el 2026-11-04, propone 3 cuotas de US$ 1,000.00 con vencimientos 2026-12-04, 2027-01-04 y 2027-02-04.
✅ **Ejemplo:** emisión 2026-01-31 en 4 cuotas propone los vencimientos 2026-02-28, 2026-03-31, 2026-04-30 y 2026-05-31.
✅ **Ejemplo:** emisión 2027-12-31 en 3 cuotas propone 2028-01-31, 2028-02-29 y 2028-03-31.
✅ **Ejemplo:** el pacto es a 30, 60 y 90 días; el usuario cambia las fechas propuestas y se guardan las que ingresó.
❌ **Contraejemplo:** un comprobante por US$ 3,000.00 en 2 cuotas propone US$ 2,000.00 y US$ 1,000.00.
❌ **Contraejemplo:** emisión 2026-01-31 propone 2026-02-28, 2026-03-28 y 2026-04-28, por calcular cada cuota desde la anterior.

**RN-016** | Categoría: Crédito | Prioridad: MUST | Fuente: Alcance M2; Brief S5
Patrón EARS: Ubiquitous
El sistema DEBE garantizar que la suma de los importes de las cuotas de un comprobante sea igual al total del comprobante. Los importes ingresados admiten hasta dos decimales y se validan según RN-153. En el reparto automático, el importe base de cada cuota es el total dividido entre el número de cuotas, truncado a céntimos, y la última cuota absorbe la diferencia. Si el usuario edita importes y la suma de las cuotas no es igual al total, el sistema NO DEBE guardar el comprobante ni el cambio, DEBE mostrar en el formulario la diferencia entre la suma de las cuotas y el total, calculada con los importes ingresados, y NO DEBE ajustar ninguna cuota por su cuenta. La respuesta de error del API lleva solo el código, sin importes (RN-014).
✅ **Ejemplo:** un comprobante por S/ 1,000.00 en 3 cuotas de S/ 333.33, S/ 333.33 y S/ 333.34 suma S/ 1,000.00.
✅ **Ejemplo:** un comprobante por S/ 1,000.00 en 6 cuotas propone 5 cuotas de S/ 166.66 y una última de S/ 166.70.
✅ **Ejemplo:** el usuario cambia la cuota 1 de S/ 333.33 a S/ 400.00 y la suma queda en S/ 1,066.67; el sistema rechaza el guardado e informa que sobran S/ 66.67.
❌ **Contraejemplo:** un comprobante por S/ 1,000.00 en 3 cuotas de S/ 333.33 suma S/ 999.99 y se guarda.
❌ **Contraejemplo:** el sistema reduce la última cuota en S/ 66.67 sin avisar para que la suma cuadre.
❌ **Contraejemplo:** un comprobante por S/ 1,000.00 en 6 cuotas propone 5 cuotas de S/ 166.67 y una última de S/ 166.65, por redondear en lugar de truncar.

**RN-017** | Categoría: Crédito | Prioridad: MUST | Fuente: Alcance M2; decisión del usuario (modelo mixto de corrección, 2026-11-05)
Patrón EARS: State-driven
MIENTRAS el comprobante no tenga pagos ni reprogramaciones registrados y no esté anulado, el sistema DEBE permitir al usuario cambiar la fecha de vencimiento de cada cuota, antes o después de guardar el comprobante, conforme a las validaciones de RN-081 y RN-082.
✅ **Ejemplo:** F001-00045, ya guardado y sin pagos ni reprogramaciones, cambia el vencimiento de su cuota 2 de 2026-12-04 a 2026-12-15.
❌ **Contraejemplo:** F001-00045 tiene una reprogramación registrada en la cuota 2 y el usuario edita directamente el vencimiento de esa cuota, sin registrar una reprogramación.

**RN-018** | Categoría: Crédito | Prioridad: MUST | Fuente: Alcance M2; decisión del usuario (modelo mixto de corrección, 2026-11-05)
Patrón EARS: State-driven
MIENTRAS el comprobante no tenga pagos ni reprogramaciones registrados y no esté anulado, el sistema DEBE permitir al usuario cambiar el importe de cada cuota, antes o después de guardar el comprobante, sujeto a la igualdad de la suma de cuotas y el total (RN-016) y a las validaciones de RN-081 y RN-082.
✅ **Ejemplo:** F001-00045 por S/ 1,000.00, ya guardado y sin pagos, cambia su cuota 1 de S/ 333.33 a S/ 400.00 y su cuota 2 de S/ 333.33 a S/ 266.66; con la cuota 3 de S/ 333.34, la suma sigue siendo S/ 1,000.00 (RN-016).
❌ **Contraejemplo:** F001-00045 tiene registrado el pago 1001 y la cuota 1 cambia de importe por edición directa.

**RN-122** | Categoría: Crédito | Prioridad: MUST | Fuente: Auditoría QA A-10; decisión del usuario (2026-11-05)
Patrón EARS: Unwanted
SI el total de un comprobante, expresado en céntimos, es menor que el número de cuotas indicado, el sistema NO DEBE proponer el reparto ni guardar el comprobante, y DEBE informar el número máximo de cuotas posible: el menor entre 120 y los céntimos del total (RN-019, RN-154). SI ese máximo es menor que 2 (total de S/ 0.01), «En cuotas» no es posible y el sistema DEBE informar que solo procede «Pago único» (RN-057).
✅ **Ejemplo:** un comprobante por S/ 0.02 en 2 cuotas propone dos cuotas de S/ 0.01.
✅ **Ejemplo:** un comprobante por S/ 0.05 en 3 cuotas propone S/ 0.01, S/ 0.01 y S/ 0.03.
✅ **Ejemplo:** un comprobante por S/ 0.01 solo admite «Pago único»; al elegir «En cuotas» el sistema informa que solo procede «Pago único» en lugar de ofrecer un máximo de 1 cuota.
❌ **Contraejemplo:** un comprobante por S/ 0.02 en 3 cuotas se guarda con cuotas de S/ 0.00, S/ 0.00 y S/ 0.02.

**RN-153** | Categoría: Crédito | Prioridad: MUST | Fuente: Auditoría QA2-17; decisión del usuario (2026-11-06); decisión del usuario (2026-11-08: formato numérico peruano, separador de miles obligatorio, contrato canónico del API y límites aprobados)
Patrón EARS: Unwanted
SI el usuario ingresa un total de comprobante, un importe de cuota o un importe de pago que no cumple el formato numérico peruano, es negativo, tiene más de dos cifras decimales o supera 12 dígitos enteros, el sistema NO DEBE guardarlo ni redondearlo o truncarlo silenciosamente. El formato numérico peruano que escribe y ve el usuario usa el punto como separador decimal (de cero, una o dos cifras) y la coma como separador de miles, que es obligatorio desde 1,000: la coma agrupa de a tres cifras desde la derecha y no se admite en importes menores que 1,000. No se admiten otros separadores, espacios, signos «+» o «-», notación científica, texto ni cadena vacía. Los límites de 12 dígitos enteros y de 120 cuotas (RN-154) están aprobados por el usuario (2026-11-08); el máximo válido es 999,999,999,999.99. La interfaz DEBE impedir ingresar valores negativos, DEBE indicar que se admiten hasta dos decimales y DEBERÍA insertar las comas de miles mientras el usuario escribe o al salir del campo; esa ayuda no sustituye la validación del servidor. El API DEBE aplicar la misma validación aunque se omita la interfaz y recibe cada importe como cadena decimal canónica (punto decimal, de cero a dos decimales, sin separador de miles, sin signo), por ejemplo «1000.50»; NO DEBE aceptar un número JSON de coma flotante ni importes con coma de miles. La interfaz convierte lo que escribe el usuario a esa forma antes de enviarlo. Los valores válidos se expresan en céntimos para los cálculos; cada importe sigue sujeto a las reglas de positividad RN-132, RN-019 y RN-024.
✅ **Ejemplo:** S/ 100, S/ 100.5, S/ 100.50, S/ 999.99, S/ 1,000.50 y S/ 0.01 son válidos; S/ 100 y S/ 100.50 equivalen a 10,000 y 10,050 céntimos, y el API recibe «100.50» para el último.
✅ **Ejemplo:** el usuario escribe 1,000.50 y el API recibe «1000.50».
❌ **Contraejemplo:** el sistema acepta «1000.50» o «1000» escritos por el usuario sin la coma de miles, «1,00», «10,00.5», «1,0000», «12,34,567», «1.000,50», «1 000.50», «.5», «100.», «+5», «-0.00» o la cadena vacía.
❌ **Contraejemplo:** el sistema acepta S/ -1.00, convierte S/ 0.001 en S/ 0.00, guarda el texto «cien» o la notación «1e3» como importe, o acepta S/ 1,000,000,000,000.00 con 13 dígitos enteros.
❌ **Contraejemplo:** el API recibe el importe como número JSON (1000.5) o como «1,000.50» y lo procesa.

**RN-154** | Categoría: Crédito | Prioridad: MUST | Fuente: Auditoría QA2-17; decisión del usuario (2026-11-06); decisión del usuario (2026-11-08: límites aprobados y vigencia en la edición); RN-015, RN-057, RN-122, RN-081
Patrón EARS: Unwanted
SI el usuario elige «En cuotas», el sistema DEBE exigir una cantidad numérica entera entre 2 y 120; NO DEBE aceptar cero, negativos, fracciones (incluidas «3.0» y «3,0»), notación científica ni texto. La cantidad tampoco DEBE superar los céntimos del total (RN-122). Un comprobante guardado, incluso tras editarlo (RN-081), DEBE conservar entre 1 y 120 cuotas; la edición no puede dejarlo sin cuotas ni con más de 120. Si elige «Pago único», el sistema DEBE crear exactamente una cuota (RN-057) sin pedir una cantidad. La interfaz DEBE impedir ingresar valores negativos o fraccionarios en el campo de cantidad, mostrar el máximo permitido cuando el usuario lo excede y el API DEBE aplicar la misma validación.
✅ **Ejemplo:** el usuario elige «En cuotas», indica 3 y el sistema propone tres filas editables; al elegir «Pago único» se muestra una sola fila por el total.
✅ **Ejemplo:** la cantidad 2 y la cantidad 120 son válidas en «En cuotas» si el total en céntimos las admite.
✅ **Ejemplo:** un comprobante con 3 cuotas se edita y queda con 2 cuotas, o con 1 sola; la edición se guarda si cada cuota cumple RN-019 y la suma coincide con el total (RN-016).
❌ **Contraejemplo:** el sistema propone cuotas para una cantidad de 0, 1, -2, 2.5, «3.0», «tres» o 121 en «En cuotas».
❌ **Contraejemplo:** la edición de un comprobante deja 121 cuotas o elimina todas las cuotas y se guarda.

**RN-019** | Categoría: Crédito | Prioridad: MUST | Fuente: Alcance M2; PRINCIPIO-007
Patrón EARS: Unwanted
SI el usuario ingresa un importe de cuota igual o menor que cero, el sistema NO DEBE guardar la cuota.
✅ **Ejemplo:** una cuota de US$ 0.01 se guarda.
❌ **Contraejemplo:** una cuota de US$ 0.00 se guarda.

**RN-020** | Categoría: Crédito | Prioridad: MUST | Fuente: Alcance M2
Patrón EARS: Unwanted
SI el usuario ingresa una fecha de vencimiento igual o anterior a la fecha de emisión del comprobante, el sistema NO DEBE guardar la cuota.
✅ **Ejemplo:** emisión 2026-11-04 y vencimiento 2026-12-04 se guardan.
❌ **Contraejemplo:** emisión 2026-11-04 y vencimiento 2026-11-03 se guardan.
❌ **Contraejemplo:** emisión 2026-11-04 y vencimiento 2026-11-04 se guardan.
✅ **Ejemplo:** emisión 2026-08-15 y vencimiento 2026-09-15 se guardan el 2026-11-04; la cuota queda VENCIDA desde el registro (RN-021).

**RN-121** | Categoría: Crédito | Prioridad: MUST | Fuente: Auditoría QA A-09; decisión del usuario (2026-11-05)
Patrón EARS: Unwanted
SI las fechas de vencimiento de las cuotas de un comprobante no son estrictamente crecientes según el número de cuota, el sistema NO DEBE guardar el comprobante ni el cambio. Una fecha igual o anterior a la de la cuota previa se rechaza, tanto al registrar como al editar (RN-017, RN-081).
✅ **Ejemplo:** emisión 2026-11-04; las cuotas 1 y 2 vencen 2027-01-04 y 2027-02-04 y se guardan.
✅ **Ejemplo:** F001-00045 sin pagos cambia el vencimiento de la cuota 2 de 2026-12-04 a 2026-12-15, con la cuota 1 del 2026-11-30 y la cuota 3 del 2027-01-04.
❌ **Contraejemplo:** la cuota 1 vence 2027-01-04 y la cuota 2 vence 2026-12-04.
❌ **Contraejemplo:** las cuotas 1 y 2 vencen ambas el 2027-01-04.

**RN-021** | Categoría: Crédito | Prioridad: MUST | Fuente: Alcance M4 (estados); Brief K1; Alcance S1; Auditoría QA2-28; decisión del usuario (2026-11-08)
Patrón EARS: Event-driven
CUANDO la fecha efectiva de vencimiento (RN-071) de una cuota de un comprobante no anulado con saldo pendiente es anterior a la fecha de cálculo, el sistema DEBE clasificar la cuota como VENCIDA. Una cuota VENCIDA es una cuota en mora. Las cuotas anuladas por anulación del comprobante no tienen estado de pago vigente (RN-090).
✅ **Ejemplo:** la cuota 1 con saldo S/ 600.00, vencimiento 2026-11-03 sin reprogramación y fecha de cálculo 2026-11-04 se clasifica como VENCIDA.
✅ **Ejemplo:** la cuota 1 con saldo S/ 600.00, vencimiento original 2026-11-03 y promesa de pago para 2026-11-10 se clasifica como PENDIENTE con fecha de cálculo 2026-11-04, y como VENCIDA con fecha de cálculo 2026-11-11.
❌ **Contraejemplo:** la cuota 1 con saldo S/ 600.00, vencimiento 2026-11-03 sin reprogramación y fecha de cálculo 2026-11-04 se clasifica como PENDIENTE.
❌ **Contraejemplo:** la cuota 1 con vencimiento original 2026-11-03 y promesa de pago para 2026-11-10 se clasifica como VENCIDA el 2026-11-04 por usar la fecha original.

**RN-022** | Categoría: Crédito | Prioridad: MUST | Fuente: Alcance M4 (estados); Auditoría QA2-28; decisión del usuario (2026-11-08)
Patrón EARS: State-driven
MIENTRAS el saldo de una cuota de un comprobante no anulado sea cero, el sistema DEBE clasificar la cuota como CANCELADA. CANCELADA significa pagada; no equivale a ANULADA por anulación del comprobante (RN-090).
✅ **Ejemplo:** la cuota 1 de S/ 1,000.00 con pagos de S/ 400.00 y S/ 600.00 pasa a CANCELADA al registrar el segundo pago.
❌ **Contraejemplo:** la cuota 1 de S/ 1,000.00 con saldo cero se mantiene como VENCIDA.

**RN-084** | Categoría: Crédito | Prioridad: MUST | Fuente: Auditoría QA C-02; decisión del usuario (2026-11-05); Auditoría QA2-28; decisión del usuario (2026-11-08)
Patrón EARS: State-driven
MIENTRAS el saldo de una cuota de un comprobante no anulado sea mayor que cero, el sistema DEBE clasificarla como PENDIENTE o VENCIDA según su fecha efectiva de vencimiento (RN-021), aunque antes haya estado CANCELADA. Anular un pago reabre la cuota sin otra acción del usuario. La posterior anulación del comprobante deja sus cuotas ANULADAS, sin estado de pago vigente (RN-090).
✅ **Ejemplo:** la cuota 1 queda CANCELADA con los pagos 1001 (S/ 400.00) y 1002 (S/ 600.00). Se anula el 1002: la cuota queda con saldo S/ 600.00 y pasa a VENCIDA si su fecha efectiva es anterior a la fecha de cálculo, o a PENDIENTE si no lo es.
❌ **Contraejemplo:** la cuota con saldo S/ 600.00 sigue como CANCELADA porque ya se canceló una vez.

**RN-023** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05)
Patrón EARS: Event-driven
CUANDO inicia una consulta u operación en producción, la capa de aplicación DEBE obtener automáticamente el momento actual, con fecha, hora y zona horaria.
✅ **Ejemplo:** Una consulta iniciada el 2026-11-06T23:59:59-05:00 toma ese momento aunque termine el día 7.
❌ **Contraejemplo:** Una consulta iniciada el 2026-11-06 toma el momento del día 7 al terminar.

**RN-198** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
La capa de aplicación DEBE proporcionar a las funciones de negocio, como parámetro explícito, la fecha de cálculo sin hora derivada del momento de RN-023 en America/Lima o, para resultados con corte, del mismo corte de RN-205.
✅ **Ejemplo:** Un corte 2026-11-07T04:59:59Z proporciona la fecha 2026-11-06.
❌ **Contraejemplo:** El mismo corte proporciona 2026-11-07 por usar UTC como fecha de cálculo.

**RN-199** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE permitir al usuario ingresar, elegir ni modificar la fecha de cálculo en producción.
✅ **Ejemplo:** El usuario elige un periodo de emisión, pero la fecha de cálculo sigue siendo 2026-11-06.
❌ **Contraejemplo:** El formulario permite elegir 2026-10-31 como fecha de cálculo.

**RN-200** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Las funciones de negocio NO DEBEN leer el reloj directamente para obtener la fecha de cálculo.
✅ **Ejemplo:** calcularEstadoCuota(cuota, '2026-11-04') usa el parámetro recibido.
❌ **Contraejemplo:** calcularEstadoCuota(cuota) ejecuta new Date() para resolver el estado.

**RN-201** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE usar la fecha de cálculo de RN-198 para evaluar estados, promesas, próximos vencimientos y días de atraso en el panel, reporte de vencimientos, lista de cuotas por avisar y avisos, con los pagos, anulaciones y reprogramaciones registrados y visibles en la lectura de datos de la consulta u operación.
✅ **Ejemplo:** Con fecha 2026-11-04, una cuota impaga vencida el 2026-11-03 resulta VENCIDA; con promesa vigente al 2026-11-10 resulta PENDIENTE.
❌ **Contraejemplo:** La lista usa la fecha 2026-11-04, pero el aviso usa la fecha del día en que se abrió la pantalla.

**RN-202** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE ofrecer una fecha de cálculo pasada ni reconstruir una cartera histórica en producción.
✅ **Ejemplo:** Un reporte del periodo de emisión octubre usa los pagos visibles al corte 2026-11-06.
❌ **Contraejemplo:** El reporte elimina del cálculo los pagos de noviembre para reconstruir el saldo al 2026-10-31.

**RN-203** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE admitir una fecha de cálculo distinta de la actual exclusivamente desde pruebas automatizadas para obtener resultados deterministas.
✅ **Ejemplo:** Una prueba pasa 2026-11-04 y obtiene VENCIDA para una cuota impaga vencida el 2026-11-03.
❌ **Contraejemplo:** La prueba no puede fijar la fecha y depende del día de ejecución.

**RN-204** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE exponer al usuario en producción la capacidad de inyectar fechas de cálculo de pruebas de RN-203.
✅ **Ejemplo:** Una solicitud de producción no permite sustituir la fecha actual por 2026-10-31.
❌ **Contraejemplo:** Un parámetro del API público activa la fecha de pruebas 2026-10-31.

**RN-205** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO genera una consulta del panel, reporte de vencimientos o exportación, el sistema DEBE establecer un momento de corte con fecha, hora y zona horaria asociado al inicio de una lectura coherente de datos.
✅ **Ejemplo:** El reporte comienza su lectura con corte 2026-11-06T10:00:00-05:00.
❌ **Contraejemplo:** El reporte fija el corte al terminar de escribir el archivo a las 10:05.

**RN-206** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Todas las filas, grupos, indicadores y totales de una misma respuesta DEBEN usar la lectura coherente de su corte; los cambios registrados durante su generación quedan para una nueva consulta.
✅ **Ejemplo:** Un pago de S/ 100.00 posterior al inicio de la lectura no cambia ninguna fila ni total de esa respuesta.
❌ **Contraejemplo:** El pago posterior reduce el total, pero la fila conserva el saldo anterior.

**RN-207** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
La leyenda «Datos al DD/MM/AAAA, HH:mm» DEBE representar el corte de RN-205 en America/Lima, no la hora de finalización.
✅ **Ejemplo:** Una generación de 10:00 a 10:05 muestra Datos al 06/11/2026, 10:00.
❌ **Contraejemplo:** El mismo resultado muestra Datos al 06/11/2026, 10:05.

**RN-208** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El valor interno del corte DEBE conservar su precisión temporal aunque la leyenda solo muestre minutos.
✅ **Ejemplo:** Los cortes 2026-11-06T10:00:01-05:00 y 2026-11-06T10:00:45-05:00 conservan sus instantes distintos.
❌ **Contraejemplo:** Se redondean ambos cortes a las 10:00 y se consideran la misma lectura.

**RN-209** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO vuelve a consultar un resultado con corte, el sistema DEBE obtener un nuevo corte y actualizar conjuntamente sus datos y leyenda.
✅ **Ejemplo:** Actualizar a las 10:05 sustituye todos los componentes del panel y su leyenda por los del nuevo corte.
❌ **Contraejemplo:** Se actualiza la leyenda a las 10:05, pero el gráfico conserva datos de las 10:00.

**RN-210** | Categoría: Crédito | Prioridad: MUST | Fuente: PRINCIPIO-007; Auditoría QA A-07; decisión del usuario (2026-11-05); RN-023 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: State-driven
MIENTRAS no se actualice una pantalla ya abierta, el sistema DEBE conservar el corte correspondiente a los datos mostrados.
✅ **Ejemplo:** La pantalla de las 10:00 conserva esa leyenda aunque una exportación posterior use las 10:05.
❌ **Contraejemplo:** La pantalla cambia su leyenda a las 10:05 sin volver a consultar sus datos.

**Contexto de RN-023:** RN-198 a RN-210 separan las condiciones de cálculo y de corte. El periodo elegido para un reporte o exportación no cambia la fecha de cálculo. Las referencias a este conjunto no convierten las funcionalidades SHOULD en obligaciones del MVP; cada capacidad conserva su entrega y prioridad.

**RN-057** | Categoría: Crédito | Prioridad: MUST | Fuente: Respuesta ronda 1, pregunta 5; Brief §7 (Cuotas)
Patrón EARS: Event-driven
CUANDO el usuario registra un comprobante a crédito y elige «Pago único», el sistema DEBE crear una única cuota por el total del comprobante, con la fecha de vencimiento que indique el usuario, sin pedir una cantidad de cuotas (RN-154).
✅ **Ejemplo:** un comprobante de S/ 1,000.00 con «Pago único» crea una cuota de S/ 1,000.00 con vencimiento 2026-12-04.
❌ **Contraejemplo:** un comprobante de S/ 1,000.00 con «Pago único» crea dos cuotas de S/ 500.00 o exige ingresar la cantidad 1.

**RN-071** | Categoría: Crédito | Prioridad: MUST | Fuente: Decisión del usuario sobre reprogramaciones; Alcance S1
Patrón EARS: Ubiquitous
Sin S1, el sistema DEBE usar como fecha efectiva el vencimiento original vigente, incluidas las ediciones válidas de RN-081; NO DEBE crear promesas ni ofrecer reprogramaciones. Con S1, el sistema DEBE determinar la fecha efectiva de vencimiento de una cuota como la fecha de su promesa de pago más reciente que no haya sido reemplazada o, si la cuota no tiene promesas, como su fecha de vencimiento original. Mientras la cuota tenga una promesa de esa clase, el sistema NO DEBE usar la fecha original para clasificar la cuota ni para contar su mora.
✅ **Ejemplo:** la cuota con vencimiento 2026-11-10 y sin promesas tiene fecha efectiva 2026-11-10; reprogramada a 2026-11-20, 2026-11-20; reprogramada de nuevo a 2026-11-30, 2026-11-30.
❌ **Contraejemplo:** la cuota con vencimiento original 2026-11-10 y promesa para 2026-11-20 tiene fecha efectiva 2026-11-10.

---

## Pagos

**RN-024** | Categoría: Pagos | Prioridad: MUST | Fuente: Alcance M3
Patrón EARS: Unwanted
SI el usuario registra un pago con importe igual o menor que cero, el sistema NO DEBE guardarlo. También se aplica la validación de formato y precisión de RN-153.
✅ **Ejemplo:** un pago de S/ 500.00 se guarda.
❌ **Contraejemplo:** un pago de S/ -50.00 se guarda.

**RN-092** | Categoría: Pagos | Prioridad: MUST | Fuente: Auditoría QA C-04; respuesta 6; decisión del usuario (2026-11-05)
Patrón EARS: Unwanted
SI el importe de un pago es mayor que el saldo de la cuota (RN-025) en el momento de guardarlo, el sistema NO DEBE guardarlo, DEBE rechazarlo con el código `IMPORTE_SUPERA_SALDO` y DEBE mostrar al usuario el saldo vigente de la cuota, obtenido de una consulta autorizada de la cuota y no del mensaje de error (RN-014). Un pago igual al saldo SÍ se guarda y deja la cuota CANCELADA (RN-022). Si dos pagos simultáneos sobre la misma cuota suman más que su saldo, el sistema DEBE guardar uno y rechazar el otro. La suma de los pagos no anulados de una cuota nunca supera su importe. Cada pago DEBE aplicarse a una sola cuota; un exceso NO DEBE distribuirse entre otras cuotas ni aplicarse al saldo total del comprobante (O14). La prevención de sobrepagos no sustituye la prevención de registros duplicados de RN-156.
✅ **Ejemplo:** la cuota 1 de S/ 1,000.00 tiene un pago de S/ 400.00 y saldo S/ 600.00. Un pago de S/ 600.00 se guarda y la cuota queda CANCELADA.
✅ **Ejemplo:** la cuota 1 tiene saldo S/ 600.00. Un pago de S/ 300.00 se guarda y el saldo queda en S/ 300.00.
✅ **Ejemplo:** el pago de S/ 400.00 de la cuota 1 se anula. El saldo vuelve a S/ 1,000.00 y un pago de S/ 800.00 se guarda.
✅ **Ejemplo:** dos usuarios registran a la vez un pago de S/ 600.00 sobre una cuota con saldo S/ 600.00. Se guarda uno; el otro se rechaza con `IMPORTE_SUPERA_SALDO` y la pantalla muestra el saldo vigente de S/ 0.00.
❌ **Contraejemplo:** la cuota 1 tiene saldo S/ 600.00 y se guarda un pago de S/ 800.00, porque 800 es menor que el importe de la cuota (S/ 1,000.00).
❌ **Contraejemplo:** la cuota 1 tiene saldo S/ 600.00 y se guarda un pago de S/ 600.01.
✅ **Ejemplo de deuda total:** hay tres cuotas con saldo de S/ 100.00 cada una. Un pago de S/ 300.00 sobre la primera se rechaza; para registrar lo pagado se registran tres operaciones de S/ 100.00, una por cuota. Pagar anticipadamente una cuota individual sí se permite, respetando RN-089.
❌ **Contraejemplo:** dos pagos simultáneos de S/ 600.00 se guardan y el saldo queda en S/ -600.00.

**RN-156** | Categoría: Pagos | Prioridad: MUST | Fuente: Alcance M3; decisión del usuario (2026-11-07, revisión QA2-09); auditoría QA2-06; RN-157
Patrón EARS: Event-driven
CUANDO el usuario envía una operación de registro de pago, el frontend DEBE deshabilitar el botón de envío mientras la solicitud está en curso. El backend DEBE garantizar que los envíos repetidos de la misma operación, incluidos los concurrentes y los reintentos tras una respuesta perdida, creen como máximo un pago y descuenten su importe una sola vez, aunque se omita la protección del frontend.
Cada operación DEBE identificarse con una clave estable dentro de su empresa, conservada para sus reintentos y vinculada a la cuota, fecha e importe enviados. La identificación de la operación y el guardado del pago DEBEN ser atómicos. Repetir una operación ya completada con los mismos datos DEBE devolver la referencia y el resultado del pago original, sin crear otro ni volver a aplicar su efecto; reutilizar la clave con datos diferentes DEBE rechazarse. Si el resultado del envío es incierto, el reintento DEBE conservar la clave, no iniciar otra operación. La anulación posterior no permite reutilizar esa clave para crear un pago nuevo; un reemplazo es una operación distinta. La referencia se conserva durante el contrato y se elimina con la baja contractual (RN-152).
El sistema DEBE admitir operaciones distintas con la misma cuota, fecha e importe, siempre que cumplan las validaciones de saldo y orden cronológico (RN-092, RN-089). La igualdad de esos campos por sí sola NO DEBE considerarse duplicado. La identificación no permite acceder a pagos de otra empresa (RN-007, RN-008).
✅ **Ejemplo:** cuota con saldo S/ 100.00; un pago de S/ 40.00 enviado dos veces con la misma clave genera un solo pago y deja saldo S/ 60.00, aunque hubiera saldo suficiente para guardar ambos por error.
✅ **Ejemplo:** el pago se guardó pero se perdió la respuesta; al reintentar con la misma clave y datos se obtiene el pago original, sin un segundo descuento.
✅ **Ejemplo:** dos pagos reales distintos de S/ 40.00, de la misma fecha y cuota con saldo inicial S/ 100.00, usan claves distintas y dejan saldo S/ 20.00.
❌ **Contraejemplo:** solo se deshabilita el botón y dos solicitudes concurrentes con la misma clave crean dos pagos; o una clave ya usada acepta otro importe.

**RN-088** | Categoría: Pagos | Prioridad: MUST | Fuente: Auditoría QA A-08; decisión del usuario (2026-11-05); QA2-08, decisión del usuario (2026-11-07)
Patrón EARS: Event-driven
CUANDO el usuario registra un pago, el sistema DEBE guardar la fecha de pago que ingresa el usuario y DEBE guardar aparte, de forma automática, la fecha y hora de creación del registro en formato ISO 8601. Los cálculos de negocio (RN-053, RN-074, RN-076, RN-078) usan la fecha de pago, no la fecha de creación del registro. En una cuenta por cobrar, la fecha de pago es la fecha de acreditación del dinero en la cuenta de la empresa, la que figura en su estado de cuenta; en una cuenta por pagar, es la fecha en que la empresa ejecuta el pago.
La fecha de cancelación real de una cuota DEBE existir únicamente cuando su saldo vigente sea cero y DEBE ser la mayor fecha de pago entre sus pagos no anulados. Para un comprobante no anulado, DEBE existir únicamente cuando todas sus cuotas estén saldadas y DEBE ser la mayor fecha de cancelación real de sus cuotas; en cuentas por cobrar es la fecha de cobro total. El orden de registro entre cuotas no interviene. Registrar o anular pagos NO DEBE modificar el vencimiento acordado ni la fecha efectiva de vencimiento.
CUANDO se registra o anula un pago, el sistema DEBE recalcular saldo y cancelación real con los pagos no anulados: si reaparece saldo, la cuota y el comprobante dejan de tener fecha de cancelación real vigente. tiempo promedio de cobro, canceladas del periodo y promesas DEBEN usar esta definición en la lectura coherente de RN-205 y RN-206. La fecha de anulación no sustituye la de pago y un reemplazo cumple RN-089 con su propia fecha real. Una nueva consulta puede cambiar los resultados de un periodo anterior, sin reconstruir una cartera histórica. El historial de la cuota aplica esta misma regla a sus transiciones derivadas y conserva los pagos y anulaciones registrados (RN-078, QA2-21).
✅ **Ejemplo de fechas distintas:** comprobante por cobrar de una cuota de S/ 100.00, emitido el 2026-10-01 y con vencimiento el 2026-10-15; pagos registrados en orden de 40 del 2026-10-10 y 60 del 2026-10-20. La cancelación real es 2026-10-20 y el vencimiento permanece 2026-10-15. Si es el único comprobante elegible de octubre, el tiempo promedio de cobro es 19.00 días.
✅ **Ejemplo de anulación:** en el caso anterior se anula el pago de 60: el saldo vuelve a 60, desaparece la cancelación real vigente y sale del tiempo promedio de cobro y de canceladas del periodo. Un reemplazo de 60 del 2026-11-05 produce cancelación real el 2026-11-05 y, si es el único comprobante elegible de noviembre, tiempo promedio de cobro de 35.00 días.
✅ **Ejemplo de varias cuotas:** un comprobante tiene cuotas canceladas el 2026-10-20 y el 2026-11-05. Su cancelación real es 2026-11-05 aunque los pagos de la primera cuota se hayan registrado después de los de la segunda.
❌ **Contraejemplo:** se usa la fecha de registro o el vencimiento como cancelación real, o se conserva una fecha de cancelación vigente con saldo positivo.
✅ **Ejemplo:** el usuario registra el 2026-11-22 un pago con fecha de pago 2026-11-19; el pago guarda fecha_pago = 2026-11-19 y creado_en = "2026-11-22T09:10:00-05:00", y cumple la promesa del 2026-11-20.
✅ **Ejemplo:** por cobrar, el cliente ordena una transferencia el viernes 2026-11-20 y el dinero se acredita el lunes 2026-11-23; el usuario registra fecha de pago 2026-11-23 y la promesa del 2026-11-20 queda INCUMPLIDA.
✅ **Ejemplo:** por pagar, la empresa ejecuta la transferencia al proveedor el 2026-11-20 y se acredita el 2026-11-23; el usuario registra fecha de pago 2026-11-20.
❌ **Contraejemplo:** el pago registrado el 2026-11-22 con fecha de pago 2026-11-19 deja la promesa del 2026-11-20 como INCUMPLIDA por usar la fecha de creación del registro.
❌ **Contraejemplo:** por cobrar, el usuario registra fecha de pago 2026-11-20 (fecha en que el cliente ordenó la transferencia) aunque el dinero se acreditó el 2026-11-23.

**RN-089** | Categoría: Pagos | Prioridad: MUST | Fuente: Auditoría QA A-08; decisión del usuario (2026-11-05); QA2-08, decisión del usuario (2026-11-07)
Patrón EARS: Unwanted
SI la fecha de pago ingresada es posterior a la fecha de cálculo, anterior a la fecha de emisión del comprobante o anterior a la mayor fecha de pago entre los pagos no anulados de la misma cuota, el sistema NO DEBE guardar el pago. Se permiten pagos con la misma fecha. Si la cuota no tiene pagos vigentes, se aplican únicamente los límites de emisión y fecha de cálculo. La validación DEBE realizarse al guardar, junto con la del saldo (RN-092), también ante registros simultáneos. Los pagos de otras cuotas no intervienen.
Para incorporar un pago omitido anterior, primero se DEBEN anular los pagos vigentes de esa cuota con fechas posteriores, mediante los permisos y auditoría de RN-029 a RN-032 y RN-058 a RN-059. Después se DEBEN registrar el pago omitido y los pagos correspondientes a los anulados en orden cronológico, con sus fechas reales y todas las validaciones de pagos. Los originales y sus anulaciones se conservan; NO DEBE cambiarse una fecha real para superar la validación. Esta corrección no modifica el vencimiento acordado.
✅ **Ejemplo de rechazo:** con fecha de cálculo 2026-11-04 y emisión 2026-10-01, existe un pago vigente del 2026-11-03; se rechaza un nuevo pago del 2026-11-02 en esa cuota.
✅ **Ejemplo de igualdad:** otro pago del 2026-11-03 en esa cuota se permite si no supera el saldo.
✅ **Ejemplo de independencia:** otra cuota sin pagos del mismo comprobante admite un pago del 2026-11-02 aunque la primera tenga un pago del 2026-11-03.
✅ **Ejemplo de corrección:** una cuota de S/ 100.00 tiene un pago de 60 del 2026-10-20 y se detecta un pago omitido de 40 del 2026-10-10. Un SUPERVISOR o ADMINISTRADOR anula el de 60 con motivo; se registra primero el de 40 del día 10 y luego el reemplazo de 60 del día 20. El original y su anulación permanecen en el historial; la cancelación real es el día 20.
❌ **Contraejemplo de orden:** se guarda un pago del día 10 mientras sigue vigente otro del día 20 en esa cuota, o se cambia su fecha real al día 20 para evitar el rechazo.
❌ **Contraejemplo:** un pago con fecha de pago 2026-11-10 se guarda el 2026-11-04; o un pago con fecha 2026-09-30 se guarda en un comprobante emitido el 2026-10-01.

**RN-025** | Categoría: Pagos | Prioridad: MUST | Fuente: Alcance M3; Auditoría QA C-02
Patrón EARS: Ubiquitous
El sistema DEBE calcular el saldo de una cuota como su importe menos la suma de sus pagos no anulados.
✅ **Ejemplo:** la cuota 1 de S/ 1,000.00 con un pago de S/ 400.00 queda con saldo S/ 600.00.
✅ **Ejemplo:** la cuota 1 de S/ 1,000.00 con el pago 1001 de S/ 400.00 anulado tiene saldo S/ 1,000.00.
❌ **Contraejemplo:** la cuota 1 de S/ 1,000.00 con un pago de S/ 400.00 conserva saldo S/ 1,000.00.
❌ **Contraejemplo:** el pago 1001 de S/ 400.00 está anulado y el saldo de la cuota sigue en S/ 600.00.

**RN-026** | Categoría: Pagos | Prioridad: MUST | Fuente: Brief R4; Alcance O6
Patrón EARS: Unwanted
SI el usuario registra un pago en una moneda distinta a la moneda de la cuota, el sistema NO DEBE guardarlo.
✅ **Ejemplo:** un pago de US$ 800.00 sobre una cuota de US$ 800.00 se guarda.
❌ **Contraejemplo:** un pago de S/ 2,880.00 sobre una cuota de US$ 800.00 se guarda con conversión implícita.

**RN-027** | Categoría: Pagos | Prioridad: MUST | Fuente: PRINCIPIO-006
Patrón EARS: Unwanted
El sistema NO DEBE modificar ningún dato de un pago confirmado. La anulación (RN-029) se registra en una entidad separada que referencia el pago y no altera su registro original.
✅ **Ejemplo:** un intento de UPDATE sobre el importe o la fecha del pago 1001 confirmado es rechazado; su anulación se guarda en un registro separado.
❌ **Contraejemplo:** el pago 1001 confirmado con S/ 500.00 cambia a S/ 450.00 mediante UPDATE, o se modifica directamente su fecha para corregirla.

**RN-028** | Categoría: Pagos | Prioridad: MUST | Fuente: PRINCIPIO-006
Patrón EARS: Unwanted
El sistema NO DEBE eliminar un pago confirmado. Excepción: baja contractual de la empresa (RN-152).
✅ **Ejemplo:** un intento de DELETE sobre el pago 1001 confirmado es rechazado con error.
❌ **Contraejemplo:** el pago 1001 confirmado desaparece de la tabla de pagos.

**RN-029** | Categoría: Pagos | Prioridad: MUST | Fuente: PRINCIPIO-006; Alcance M3
Patrón EARS: Event-driven
CUANDO un usuario autorizado corrige un pago CONFIRMADO no anulado, el sistema DEBE crear un registro de anulación que referencia el pago original, conservar el pago sin modificarlo ni borrarlo y tratarlo desde entonces como ANULADO para todos los cálculos de saldo. La transición CONFIRMADO → ANULADO es irreversible.
✅ **Ejemplo:** para corregir el pago 1001 de S/ 500.00 se crea la anulación 2001 que lo referencia; el pago 1001 se conserva en el historial y deja de reducir el saldo de la cuota.
❌ **Contraejemplo:** para corregir el pago 1001 se cambia su importe a S/ 450.00, se elimina el pago o se mantiene su efecto sobre el saldo después de anularlo.

**RN-123** | Categoría: Pagos | Prioridad: MUST | Fuente: Auditoría QA A-13; decisión del usuario (2026-11-06)
Patrón EARS: Unwanted
SI un pago ya está ANULADO, el sistema NO DEBE permitir crear otra anulación que lo referencie. Cada pago admite como máximo una anulación; si dos solicitudes intentan anularlo simultáneamente, el sistema DEBE crear una sola anulación y rechazar la otra sin efectos parciales.
✅ **Ejemplo:** dos supervisores intentan anular al mismo tiempo el pago 1001; se crea la anulación 2001 y la segunda solicitud se rechaza porque el pago ya está ANULADO.
❌ **Contraejemplo:** las anulaciones 2001 y 2002 referencian el mismo pago 1001, o una solicitud rechazada deja dos registros incompletos.

**RN-124** | Categoría: Pagos | Prioridad: MUST | Fuente: Auditoría QA A-13; decisión del usuario (2026-11-06)
Patrón EARS: Unwanted
El sistema NO DEBE permitir anular parcialmente un pago, anular un registro de anulación, ni modificar, eliminar o revertir una anulación. La anulación afecta el importe completo del pago original. Registrar un pago de reemplazo es opcional, se realiza como una operación independiente y queda sujeto a las validaciones vigentes del saldo. La prohibición de eliminar una anulación no se aplica a la baja contractual (RN-152).
✅ **Ejemplo:** para corregir de S/ 500.00 a S/ 450.00 se anula por completo el pago original de S/ 500.00 y, si corresponde, se registra después un pago nuevo de S/ 450.00.
✅ **Ejemplo:** se anula un pago duplicado y no se registra reemplazo.
❌ **Contraejemplo:** se anulan solo S/ 50.00 del pago 1001; se revierte la anulación 2001; o el sistema exige crear un reemplazo para poder guardar la anulación.

**RN-030** | Categoría: Pagos | Prioridad: MUST | Fuente: PRINCIPIO-006
Patrón EARS: Ubiquitous
El registro de anulación DEBE guardar el motivo escrito por el usuario, validado según RN-162 (QA-03).
✅ **Ejemplo:** la anulación 2001 guarda el motivo "DIGITACIÓN ERRÓNEA", ingresado como "digitación errónea".
❌ **Contraejemplo:** la anulación 2001 se guarda con motivo vacío "", con un motivo de solo espacios "   " o con un motivo de 501 caracteres.

**RN-031** | Categoría: Datos | Prioridad: MUST | Fuente: PRINCIPIO-006
Patrón EARS: Ubiquitous
El registro de anulación DEBE guardar el identificador del usuario que realiza la anulación.
✅ **Ejemplo:** la anulación 2001 guarda usuario_id = 7.
❌ **Contraejemplo:** la anulación 2001 se guarda sin usuario_id.

**RN-032** | Categoría: Datos | Prioridad: MUST | Fuente: PRINCIPIO-006
Patrón EARS: Ubiquitous
El registro de anulación DEBE guardar la fecha y hora de la anulación en formato ISO 8601.
✅ **Ejemplo:** la anulación 2001 guarda "2026-11-04T10:15:00-05:00".
❌ **Contraejemplo:** la anulación 2001 guarda "04/11/2026 10:15".

**RN-033** | Categoría: Pagos | Prioridad: SHOULD | Fuente: Alcance S1; Respuesta ronda 3, pregunta 3; Auditoría QA2-19; decisión del usuario (2026-11-08)
Patrón EARS: Event-driven
CUANDO el usuario solicita registrar una reprogramación, sea la primera o una posterior, el sistema DEBE permitirla únicamente si la cuota tiene saldo vigente mayor que cero, calculado con sus pagos no anulados (RN-025), y su comprobante no está anulado (RN-091). Estas condiciones y las restricciones de fecha de RN-080 y RN-118 DEBEN verificarse con el estado vigente al guardar (RN-160). Si no se cumplen, el sistema DEBE rechazar la operación sin crear una promesa ni modificar el historial o la marca de reprogramación. Si se cumplen y la operación se guarda, DEBE registrar la nueva fecha como promesa de pago ACTIVA (RN-074); si existe una promesa anterior, se aplica RN-073. Una cuota reabierta por anulación de un pago puede reprogramarse si recuperó saldo positivo y cumple las demás condiciones.
✅ **Ejemplo:** la cuota con saldo positivo y vencimiento 2026-11-10 se reprograma el 2026-11-08 a 2026-11-20 y queda una promesa de pago ACTIVA para 2026-11-20.
✅ **Ejemplo:** una cuota cancelada recupera saldo positivo al anularse un pago; puede registrar su primera reprogramación o una posterior si cumple las condiciones de comprobante y fechas.
❌ **Contraejemplo:** se registra una primera reprogramación o una posterior en una cuota con saldo cero, creando una promesa sobre una deuda ya cancelada.
✅ **Ejemplo de concurrencia:** Luis prepara una reprogramación y Ana registra antes el pago total de la cuota. Al guardar, la reprogramación de Luis se rechaza con `DATOS_DESACTUALIZADOS` (RN-160), sin crear promesa ni modificar el historial o la marca de reprogramación.
❌ **Contraejemplo:** la cuota se reprograma a 2026-11-20 sin registrar ninguna promesa de pago.

**RN-034** | Categoría: Pagos | Prioridad: SHOULD | Fuente: Alcance S1; Brief §7 (Reprogramaciones)
Patrón EARS: Ubiquitous
El sistema DEBE conservar la fecha de vencimiento original de una cuota reprogramada. La mora de la cuota se cuenta desde la fecha de la promesa (RN-071), no desde la fecha original.
✅ **Ejemplo:** la promesa de la cuota 1 guarda fecha_original = 2026-11-10 y fecha_promesa = 2026-11-20; la cuota sin pago pasa a VENCIDA el 2026-11-21, no el 2026-11-11.
❌ **Contraejemplo:** la promesa de la cuota 1 sobrescribe la fecha de vencimiento 2026-11-10 con 2026-11-20 y no guarda la original.

**RN-035** | Categoría: Pagos | Prioridad: SHOULD | Fuente: Brief §7 (Reprogramaciones); Alcance O10
Patrón EARS: Unwanted
El sistema NO DEBE exigir aprobación previa para registrar una reprogramación.
✅ **Ejemplo:** una reprogramación registrada por un usuario con rol OPERADOR se guarda sin aprobador.
❌ **Contraejemplo:** una reprogramación se rechaza con el mensaje "requiere aprobación de la directiva".

**RN-036** | Categoría: Notificaciones | Prioridad: SHOULD | Fuente: Respuesta ronda 2, pregunta 3 (panel de notificaciones); decisión del usuario sobre visibilidad por rol
Patrón EARS: State-driven
MIENTRAS una promesa de pago esté activa, el sistema DEBE mostrarla en el panel de notificaciones a todos los usuarios de la empresa, sin importar su rol.
✅ **Ejemplo:** la promesa de la cuota 1 para 2026-11-20 aparece en el panel del usuario con rol OPERADOR y en el del usuario con rol SUPERVISOR el 2026-11-15.
❌ **Contraejemplo:** la promesa activa para 2026-11-20 aparece solo en el panel del usuario con rol ADMINISTRADOR el 2026-11-15.

**RN-072** | Categoría: Pagos | Prioridad: SHOULD | Fuente: Decisión del usuario (marca de reprogramación); Alcance S1, S4
Patrón EARS: Ubiquitous
El sistema DEBE marcar como reprogramada a toda cuota con al menos una reprogramación registrada, guardando su fecha de vencimiento original y la fecha de su promesa más reciente. La marca NO DEBE cambiar el estado de la cuota (PENDIENTE, VENCIDA o CANCELADA) y DEBE permanecer aunque la cuota se cancele o la promesa se incumpla.
✅ **Ejemplo:** la cuota 1 con vencimiento 2026-11-10, reprogramada a 2026-11-20, se muestra PENDIENTE con la marca de reprogramación (fecha_original = 2026-11-10, fecha_promesa = 2026-11-20); tras cobrarse el 2026-11-18 se muestra CANCELADA y conserva la marca.
❌ **Contraejemplo:** la cuota 1 reprogramada se muestra con un estado "REPROGRAMADA" que reemplaza a PENDIENTE, o pierde la marca al cancelarse.

**RN-073** | Categoría: Pagos | Prioridad: SHOULD | Fuente: Decisión del usuario (reprogramaciones múltiples); Alcance S1
Patrón EARS: Event-driven
CUANDO el usuario registra una reprogramación en una cuota que ya tiene una promesa y cumple la elegibilidad común de RN-033, el sistema DEBE marcar la promesa anterior como reemplazada, conservarla en el historial y mantener una sola promesa activa por cuota. La fecha de vencimiento original no cambia. Una cuota VENCIDA por una promesa incumplida vuelve a PENDIENTE si la nueva fecha no es anterior a la fecha de cálculo.
✅ **Ejemplo:** la cuota 1 (vencimiento 2026-11-10, promesa 1 para 2026-11-20) se reprograma el 2026-11-18 a 2026-11-30; la promesa 1 queda reemplazada, la promesa 2 queda activa para 2026-11-30 y la fecha original sigue siendo 2026-11-10.
❌ **Contraejemplo:** al registrar la promesa 2, la promesa 1 se elimina o ambas quedan activas.
✅ **Ejemplo de concurrencia:** la cuota 1 tiene una promesa activa al 2026-11-20. Ana y Luis abren la cuota y la reprograman a la vez, a 2026-11-30 y a 2026-12-05. Se guarda la de Ana; la de Luis se rechaza por datos desactualizados (RN-160), aunque su fecha también sea posterior, y Luis ve la promesa vigente al 2026-11-30 antes de decidir.
❌ **Contraejemplo:** las dos reprogramaciones reemplazan a la misma promesa y quedan dos promesas ACTIVAS, o la de Luis reemplaza en silencio la promesa que Ana acordó con el cliente.

**RN-080** | Categoría: Pagos | Prioridad: MUST | Fuente: Decisión del usuario (reprogramación solo hacia adelante); pregunta 25
Patrón EARS: Unwanted
SI la nueva fecha de una reprogramación no es posterior a la fecha efectiva de vencimiento de la cuota (RN-071), el sistema NO DEBE registrar la reprogramación. Una fecha igual a la fecha efectiva también se rechaza. Esto aplica aunque la reprogramación se registre antes de que la cuota venza.
✅ **Ejemplo:** la cuota 1 (vencimiento 2026-11-10, sin promesas) se reprograma el 2026-11-05 a 2026-11-20; se registra la promesa porque 2026-11-20 es posterior a 2026-11-10.
✅ **Ejemplo:** la cuota 1 (vencimiento 2026-11-10, promesa activa para 2026-11-20) se reprograma el 2026-11-18 a 2026-11-30; se registra porque 2026-11-30 es posterior a la promesa vigente.
❌ **Contraejemplo:** la cuota 1 (vencimiento 2026-11-10, sin promesas) se reprograma el 2026-11-05 a 2026-11-08; el sistema la rechaza porque acortaría el plazo pactado.
❌ **Contraejemplo:** la cuota 1 (vencimiento 2026-11-10, promesa activa para 2026-11-20) se reprograma a 2026-11-15, o a 2026-11-20; el sistema la rechaza porque no es posterior a la promesa vigente.

**RN-118** | Categoría: Pagos | Prioridad: MUST | Fuente: Auditoría QA A-04; decisión del usuario (2026-11-05); RN-080
Patrón EARS: Unwanted
SI la nueva fecha de una reprogramación es anterior a la fecha actual del día de su registro en America/Lima, el sistema NO DEBE registrar la reprogramación. Una fecha igual a ese día SÍ se permite, siempre que también sea posterior a la fecha efectiva de vencimiento vigente (RN-080). El sistema DEBE proporcionar la fecha actual como parámetro a la función de validación; no es una fecha elegida por el usuario y la función no lee el reloj del servidor (PRINCIPIO-007).
✅ **Ejemplo:** con fecha actual 2026-11-20 y fecha efectiva de vencimiento 2026-11-10, se permite reprogramar al 2026-11-20 o al 2026-11-25. La promesa para el 2026-11-20 queda ACTIVA ese día y pasa a INCUMPLIDA el 2026-11-21 si conserva saldo y no fue reemplazada (RN-074).
❌ **Contraejemplo:** el 2026-11-20 se guarda una reprogramación al 2026-11-15 porque es posterior al vencimiento efectivo 2026-11-10, aunque la fecha propuesta ya pasó.
❌ **Contraejemplo:** el 2026-11-20 se permite reprogramar al mismo 2026-11-20 una cuota cuyo vencimiento efectivo es 2026-11-25; cumple el límite de hoy, pero incumple RN-080.

**RN-074** | Categoría: Pagos | Prioridad: SHOULD | Fuente: Decisión del usuario (ciclo de la promesa); Alcance S1
Patrón EARS: State-driven
El sistema DEBE clasificar como REEMPLAZADA una promesa sustituida por una nueva reprogramación (RN-073), con prioridad sobre los demás estados. Para una promesa no reemplazada, DEBE clasificarla ACTIVA mientras la cuota tenga saldo positivo y la fecha prometida no sea anterior a la fecha de cálculo; CUMPLIDA si el saldo vigente es cero y la fecha de cancelación real (RN-088) es igual o anterior a la prometida; o INCUMPLIDA si tiene saldo positivo y la fecha prometida es anterior a la fecha de cálculo, o si tiene saldo cero con cancelación real posterior a la prometida. Se recalcula con los pagos no anulados (RN-085); una anulación no reactiva promesas REEMPLAZADAS (QA2-08, decisión del usuario del 2026-11-07).
✅ **Ejemplo:** la promesa para 2026-11-20 es ACTIVA el 2026-11-15 con saldo positivo, CUMPLIDA si el saldo es cero y la cancelación real es 2026-11-18, e INCUMPLIDA el 2026-11-21 si la cuota sigue con saldo.
❌ **Contraejemplo:** la promesa para 2026-11-20 sigue ACTIVA el 2026-11-21 con la cuota con saldo, o pasa a CUMPLIDA por un pago del 2026-11-25.

**RN-085** | Categoría: Pagos | Prioridad: SHOULD | Fuente: Auditoría QA C-02; decisión del usuario (2026-11-05)
Patrón EARS: State-driven
MIENTRAS una promesa de pago no esté REEMPLAZADA, el sistema DEBE calcular su estado (RN-074) con el saldo que resulta de los pagos no anulados. Una promesa CUMPLIDA cuyo pago se anula vuelve a ACTIVA si su fecha no es anterior a la fecha de cálculo, o pasa a INCUMPLIDA si lo es.
✅ **Ejemplo:** la promesa para 2026-11-20 está CUMPLIDA por un pago del 2026-11-18. Se anula ese pago el 2026-11-19 y la promesa vuelve a ACTIVA; si se anula el 2026-11-22, queda INCUMPLIDA.
❌ **Contraejemplo:** la promesa sigue CUMPLIDA después de anular el pago, con la cuota con saldo.

**RN-037** | **Retirada (2026-11-07)** | Fuente: decisión del usuario, QA2-09; E-009; Alcance O19
Se retira la regla de conciliación bancaria al quedar la funcionalidad fuera de esta versión. Identificador reservado para trazabilidad; no establece una obligación vigente.

**RN-038** | **Retirada (2026-11-07)** | Fuente: decisión del usuario, QA2-09; E-009; Alcance O19
Se retira la regla de conciliación bancaria al quedar la funcionalidad fuera de esta versión. Identificador reservado para trazabilidad; no establece una obligación vigente.

**RN-125** | **Retirada (2026-11-07)** | Fuente: decisión del usuario, QA2-09; E-009; Alcance O19
Se retira la regla de conciliación bancaria al quedar la funcionalidad fuera de esta versión. Identificador reservado para trazabilidad; no establece una obligación vigente.

---

## Notificaciones

**RN-039** | Categoría: Notificaciones | Prioridad: MUST | Fuente: PRINCIPIO-009; Alcance M5; PRINCIPIO-011
Patrón EARS: Unwanted
El sistema NO DEBE enviar avisos de vencimiento por WhatsApp, Telegram ni SMS.
✅ **Ejemplo:** el aviso de la cuota 2 de F001-00045 se envía por correo y queda registrado en la bandeja interna.
❌ **Contraejemplo:** el aviso de la cuota 2 de F001-00045 se envía por SMS al número +51 900000001.

**RN-040** | **Retirada (2026-11-05)** | Fuente: Decisión del usuario (auditoría QA, A-03)
Los avisos dejan de enviarse automáticamente: el usuario selecciona las cuotas y envía el aviso desde la lista de cuotas por avisar (RN-112, RN-113). El aviso automático queda como requerimiento futuro (alcance O16). La regla ya no aplica y su ID no se reutiliza.

**RN-041** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Alcance M5; decisión del usuario (2026-11-05); auditoría QA2-03; decisión del usuario (2026-11-07)
Patrón EARS: Unwanted
SI una cuota está CANCELADA, el sistema NO DEBE incluirla en la lista de cuotas por avisar (RN-112) ni enviar avisos de esa cuota. Si la cuota pasa a CANCELADA después de que el usuario la seleccionó y antes de que confirme el envío, el reenvío o el reintento, el sistema DEBE excluirla del envío según RN-155.
✅ **Ejemplo:** la cuota 1 cancelada el 2026-11-08 no aparece en la lista de cuotas por avisar el 2026-11-09.
✅ **Ejemplo:** el usuario selecciona las cuotas 1 y 2 de F001-00045; antes de confirmar, la cuota 1 se cancela. El aviso se envía solo con la cuota 2.
❌ **Contraejemplo:** la cuota 1 cancelada el 2026-11-08 aparece en la lista de cuotas por avisar el 2026-11-09 o recibe un aviso.

**RN-042** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Alcance M5; Brief §3; Auditoría QA A-17; decisión del usuario (2026-11-06)
Patrón EARS: Event-driven
CUANDO el sistema envía un aviso de vencimiento, el sistema DEBE enviarlo al contacto como destinatario principal y DEBE enviar copia del mismo aviso al correo administrativo de la empresa (RN-104) y a los usuarios configurados en copia para el sentido del aviso (RN-134): avisos por cobrar o avisos por pagar. El contacto NO DEBE poder excluirse del envío. Si una misma dirección figura más de una vez entre los destinatarios, el sistema DEBE enviarla una sola vez.
✅ **Ejemplo:** el aviso por cobrar de la cuota 2 se envía a "cliente@cliente.example", con copia a "admin@empresa1.example" y a "jefe.cobranzas@empresa1.example", configurado en copia para avisos por cobrar.
✅ **Ejemplo:** el aviso por pagar de E001-00123 se envía a "proveedor@proveedor.example", con copia a "admin@empresa1.example" y a "jefe.pagos@empresa1.example"; "jefe.cobranzas@empresa1.example" no recibe copia.
❌ **Contraejemplo:** el aviso de la cuota 2 se envía solo a "cliente@cliente.example", o se envía solo a las copias sin el contacto.

**RN-043** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Alcance M5; PRINCIPIO-009; decisión del usuario (2026-11-05); Auditoría QA A-17 (2026-11-06)
Patrón EARS: Event-driven
CUANDO un usuario confirma el envío de un aviso de vencimiento, el sistema DEBE registrar cada intento en la bandeja interna con fecha y hora en formato ISO 8601, usuario, contacto, cuotas incluidas, tipo de aviso (RN-114), comentario si lo hay (RN-115), destinatario principal, destinatarios en copia al momento del intento y resultado de la solicitud a Resend (RN-137). Los usuarios con cualquier rol DEBEN poder ver este historial. Si Resend acepta el correo, el sistema DEBE mostrar una notificación breve «Aviso enviado»; si lo rechaza, DEBE mostrar un error persistente con la posibilidad de volver a intentar (RN-066).
✅ **Ejemplo:** Ana envía el 2026-11-05 a las 09:10 el aviso de la cuota 2 de F001-00045; Resend lo acepta y la bandeja muestra "2026-11-05T09:10:00-05:00 · Ana · Cliente SAC · F001-00045 cuota 2 · Por cobrar, por vencer · Enviado".
❌ **Contraejemplo:** Resend rechaza el correo, pero la interfaz muestra «Aviso enviado» o la bandeja no conserva el intento.

**RN-044** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Alcance M5; decisión de la pregunta 9
Patrón EARS: Ubiquitous
CUANDO se registra un contacto, el sistema DEBE exigir un correo electrónico con formato válido y de hasta 250 caracteres (RN-162). Esto aplica a clientes y a proveedores.
✅ **Ejemplo:** el registro del proveedor "Proveedor SAC" se guarda con "proveedor@proveedor.example".
❌ **Contraejemplo:** el sistema guarda el contacto "Proveedor SAC" sin correo electrónico.

**RN-045** | Categoría: Notificaciones | Prioridad: MUST | Fuente: K5; Alcance M5; decisión de la pregunta 24; decisión del usuario (2026-11-05); Auditoría QA A-17 (2026-11-06)
Patrón EARS: Unwanted
SI una cuota ya tiene un aviso aceptado por Resend del mismo tipo (RN-114) para la misma fecha efectiva de vencimiento (RN-071), el sistema NO DEBE enviar otro aviso hasta que el usuario vea la fecha y el usuario del último envío aceptado y confirme «Reenviar aviso». El reenvío genera un nuevo aviso con los datos vigentes (RN-113, RN-138). Un intento rechazado no activa esta confirmación ni marca la cuota como «Enviado»; un resultado sin confirmar se trata según RN-067. Una reprogramación cambia la fecha efectiva y la cuota vuelve a poder avisarse sin advertencia (pregunta 24).
✅ **Ejemplo:** la cuota 2 de F001-00045 tiene un aviso por vencer enviado el 2026-11-05 por Ana. El 2026-11-07 un usuario la selecciona de nuevo; el sistema muestra "Último aviso: 2026-11-05, Ana" y pide confirmar antes de enviar.
✅ **Ejemplo:** la cuota 2 se reprograma a 2026-11-20. Al seleccionarla de nuevo, el sistema no muestra advertencia porque no hay aviso para esa fecha efectiva.
✅ **Ejemplo:** Resend rechazó el intento anterior; la cuota sigue sin marca «Enviado» y el usuario puede volver a intentar después de ver el error.
❌ **Contraejemplo:** el sistema reenvía a "cliente@cliente.example" el aviso de la cuota 2, ya avisada para la misma fecha efectiva, sin advertir al usuario; o impide el reenvío aunque el usuario confirme.

**RN-065** | **Retirada (2026-11-05)** | Fuente: Decisión del usuario (auditoría QA, A-03)
El plazo de anticipación deja de disparar avisos, porque el usuario decide cuándo avisar. La lista de cuotas por avisar muestra todas las cuotas pendientes y vencidas con saldo (RN-112) y no depende de la ventana del gráfico (RN-119). La regla ya no aplica y su ID no se reutiliza.

**RN-066** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Decisión de la pregunta 10; decisión del usuario (2026-11-05); Auditoría QA A-17 (2026-11-06); auditoría QA2-03; decisión del usuario (2026-11-07)
Patrón EARS: Event-driven
CUANDO Resend rechaza de forma confirmada una solicitud de envío de aviso, el sistema NO DEBE crear una marca «Enviado» a partir de ese intento ni quitar una marca de un envío anterior aceptado. DEBE conservar el intento rechazado, mostrar al usuario un error persistente con la acción de volver a intentar y NO DEBE reintentarlo automáticamente. Volver a intentar genera un aviso nuevo con los datos y destinatarios vigentes (RN-138); no repite el intento rechazado. El mensaje y los registros técnicos NO DEBEN incluir direcciones de correo ni importes (RN-014).
✅ **Ejemplo:** Resend rechaza el aviso 118; la cuota continúa sin marca «Enviado», la pantalla informa que el aviso no se envió y permite volver a intentar.
❌ **Contraejemplo:** Resend rechaza el aviso, pero la cuota aparece como «Enviado» o el sistema reintenta automáticamente.

**RN-067** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Decisión de la pregunta 10; PRINCIPIO-004; decisión del usuario (2026-11-05); Auditoría QA A-17 (2026-11-06)
Patrón EARS: Unwanted
SI una solicitud de envío termina sin respuesta concluyente de Resend, por ejemplo por tiempo de espera, el sistema NO DEBE clasificar el intento como aceptado ni rechazado, ni marcar las cuotas como «Enviado». DEBE conservar el intento como resultado sin confirmar y mostrar al usuario «No se pudo confirmar el envío». NO DEBE ofrecer un reintento inmediato de ese mismo aviso hasta verificar si Resend aceptó la solicitud; la verificación y la recuperación se rigen por RN-159. El mismo tratamiento DEBE aplicarse cuando Resend aceptó la solicitud pero el sistema no logró guardar la aceptación (RN-158). Este resultado no constituye un estado de entrega al destinatario.
✅ **Ejemplo:** la solicitud del aviso 118 agota el tiempo de espera; la cuota no se marca «Enviado» y la interfaz informa que el resultado debe verificarse antes de reintentar.
✅ **Ejemplo:** Resend acepta el aviso 118, pero falla el guardado de su respuesta; el intento sigue «sin confirmar» en la bandeja y la cuota muestra que debe verificarse.
❌ **Contraejemplo:** tras el tiempo de espera, el sistema afirma que Resend rechazó el aviso y lo reenvía inmediatamente, con riesgo de duplicarlo.

**RN-158** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA2-06; decisión del usuario (2026-11-07); RN-045; RN-067; RN-112; RN-157
Patrón EARS: Event-driven
CUANDO el usuario confirma un envío, un reenvío o un reintento de aviso, el sistema DEBE guardar el intento en la bandeja interna como «sin confirmar», con su contenido, sus cuotas y sus destinatarios, **antes** de enviar la solicitud a Resend. La comprobación de que ninguna cuota incluida tiene otro intento sin confirmar del mismo tipo de aviso (RN-114) y la misma fecha efectiva de vencimiento (RN-071), y el guardado del intento, DEBEN ser atómicos. La solicitud a Resend DEBE llevar una clave de idempotencia propia de ese intento, que no se reutiliza para ningún otro intento.
SI llega otra solicitud de envío para alguna de esas cuotas mientras el intento sigue sin confirmar, sea del mismo usuario, de otra pestaña o de otro usuario, el sistema NO DEBE enviar otro correo: DEBE rechazarla sin registrar un intento y mostrar el intento existente. Cuando Resend responde, el sistema registra el resultado (RN-137) sin modificar el contenido ni los destinatarios guardados. SI Resend acepta la solicitud pero el sistema no logra registrar la aceptación, el intento DEBE permanecer «sin confirmar» (RN-067); NO DEBE existir un correo aceptado por Resend sin su intento en la bandeja.
✅ **Ejemplo:** Ana confirma el aviso de la cuota 2 de F001-00045 y, al mismo tiempo, Luis confirma el mismo aviso desde su sesión. Se guarda y se envía solo el intento de Ana; Luis recibe «Ya hay un envío en curso para esta cuota» y ve el intento de Ana.
✅ **Ejemplo:** la misma solicitud de envío llega dos veces por un doble clic que el frontend no bloqueó; solo se guarda un intento y solo sale un correo.
❌ **Contraejemplo:** dos solicitudes simultáneas de la misma cuota encuentran que no hay un aviso previo, ninguna pide confirmar «Reenviar aviso» y el contacto recibe dos correos.
❌ **Contraejemplo:** el sistema llama a Resend y guarda el intento solo después de recibir la respuesta; al fallar el guardado, el correo llegó al contacto y la bandeja no tiene registro.

**RN-159** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA2-06; decisión del usuario (2026-11-07); RN-067; RN-113; RN-155; documentación de Resend sobre claves de idempotencia (ventana de 24 horas)
Patrón EARS: Event-driven
CUANDO el usuario elige «Verificar envío» en un intento sin confirmar, el sistema DEBE repetir la solicitud a Resend con la misma clave de idempotencia, el mismo contenido y los mismos destinatarios guardados en el intento, sin recalcular datos ni excluir cuotas. La verificación es una acción del usuario: el sistema NO DEBE ejecutarla automáticamente. Antes de verificar, DEBE informar al usuario que, si Resend no recibió la solicitud original, el correo se enviará en ese momento. El resultado se registra en el mismo intento (RN-137):
1. Si Resend responde que ya había aceptado la solicitud, o la acepta en ese momento, el intento pasa a aceptado y sus cuotas muestran «Enviado» con la fecha y hora del intento. No se envía un segundo correo.
2. Si Resend la rechaza de forma confirmada, se aplica RN-066.
3. Si Resend informa que la solicitud original sigue en proceso, o vuelve a no responder de forma concluyente, el intento sigue sin confirmar.

SI pasaron 24 horas desde el intento, que es la ventana en que Resend reconoce la clave, o si cambió alguno de los datos del correo de una cuota incluida (saldo, estado, tipo de aviso o fecha efectiva de vencimiento) o la cuota dejó de ser apta para aviso (RN-155), el sistema NO DEBE repetir la solicitud. DEBE marcar el intento como «No verificable», desbloquear esas cuotas y permitir un aviso nuevo con los datos vigentes, después de advertir al usuario que el aviso anterior pudo haber llegado al contacto. Un intento «No verificable» no crea ni quita la marca «Enviado».
✅ **Ejemplo:** el aviso 118 quedó sin confirmar a las 09:10. A las 09:30 el usuario elige «Verificar envío»; Resend responde que ya lo había aceptado, no sale otro correo y la cuota muestra «Enviado · 2026-11-07 09:10».
✅ **Ejemplo:** el aviso 118 quedó sin confirmar y antes de verificarlo se registra un pago parcial en la cuota. El intento pasa a «No verificable»; el usuario ve la advertencia y envía un aviso nuevo con el saldo vigente.
❌ **Contraejemplo:** la verificación genera un correo nuevo con otro contenido, se ejecuta sola en segundo plano o envía dos días después un aviso con un saldo que ya no es el vigente.

**RN-068** | **Retirada (2026-11-05)** | Fuente: Decisión del usuario (auditoría QA, A-03)
Con el envío manual no hay reintentos automáticos ni intentos que agotar. El rechazo confirmado y el resultado sin confirmar se tratan en RN-066 y RN-067. La regla ya no aplica y su ID no se reutiliza.

**RN-112** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-03; Alcance M5; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
El sistema DEBE ofrecer una lista de cuotas por avisar con todas las cuotas PENDIENTES o VENCIDAS que tengan saldo, sin limitarla a la ventana de proyección del gráfico (RN-181). Para cada cuota DEBE mostrar el sentido (por cobrar o por pagar), el contacto, el número de comprobante y de cuota, la fecha efectiva de vencimiento (RN-071), el saldo con su moneda y, si existe un aviso aceptado por Resend del tipo vigente para esa fecha efectiva, la marca «Enviado» con fecha y hora del último envío aceptado. Una cuota sin esa marca muestra «Enviar aviso»; una cuota marcada muestra «Reenviar aviso» (RN-045). Si hay un intento posterior sin confirmación, el sistema DEBE indicar que se debe verificar ese intento, ofrecer «Verificar envío» (RN-159) y bloquear la acción de envío para esas cuotas (RN-067, RN-158), sin borrar una marca «Enviado» anterior. Un intento «No verificable» deja de bloquear el envío. El historial conserva los envíos anteriores, incluidos los de otras fechas efectivas. La lista NO DEBE incluir cuotas CANCELADAS (RN-041) ni cuotas de comprobantes anulados (RN-090). Las cuotas de contactos desactivados sí se incluyen (RN-130).
✅ **Ejemplo:** con fecha de cálculo 2026-11-05, la lista muestra una cuota VENCIDA el 2026-10-28, una cuota PENDIENTE que vence el 2026-11-10 y otra cuota PENDIENTE que vence el 2026-12-20, aunque el usuario tenga seleccionada una proyección gráfica de 7 días. La cuota con un aviso aceptado muestra «Enviado · 2026-11-05 09:10» y «Reenviar aviso».
❌ **Contraejemplo:** la lista omite la cuota PENDIENTE que vence el 2026-12-20 porque está fuera de la ventana del gráfico, o incluye una cuota CANCELADA.

**RN-120** | Categoría: UX | Prioridad: MUST | Fuente: Auditoría QA A-06; decisión del usuario (2026-11-05); Alcance M4, M5
Patrón EARS: Ubiquitous
El listado de movimientos del panel y la lista de cuotas por avisar (RN-112), cuando muestran cuotas con saldo, DEBEN ordenar primero las cuotas VENCIDAS por fecha efectiva de vencimiento ascendente (la más antigua primero) y después las cuotas PENDIENTES por fecha efectiva de vencimiento ascendente (la que vence más pronto primero).
✅ **Ejemplo:** con fecha de cálculo 2026-11-05, las cuotas con fechas efectivas 2026-10-20 (VENCIDA), 2026-11-02 (VENCIDA), 2026-11-07 (PENDIENTE) y 2026-12-15 (PENDIENTE) aparecen en ese orden.
❌ **Contraejemplo:** la cuota PENDIENTE que vence el 2026-12-15 aparece antes que la que vence el 2026-11-07, o una cuota VENCIDA aparece después de las PENDIENTES.

**RN-113** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-03; Alcance M5; decisión del usuario (2026-11-05); auditoría QA2-03 y QA2-04; decisión del usuario (2026-11-07)
Patrón EARS: Event-driven
CUANDO el usuario selecciona cuotas de la lista por avisar y confirma el envío, el sistema DEBE enviar un aviso al contacto por las cuotas que sigan siendo aptas según RN-155, después de las comprobaciones RN-212 y RN-213 y con la agrupación de RN-214.
✅ **Ejemplo:** La cuota 12 sigue apta al confirmar y se genera su aviso al contacto 42.
❌ **Contraejemplo:** Se omite sin motivo el aviso de la cuota 12 que sigue apta después de confirmar.

**RN-212** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-03; Alcance M5; decisión del usuario (2026-11-05); auditoría QA2-03 y QA2-04; decisión del usuario (2026-11-07); RN-113 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO el usuario confirma un envío, el sistema DEBE obtener de nuevo la fecha de cálculo actual y recalcular saldo, estado, tipo de aviso, días de atraso y aptitud de cada cuota seleccionada antes de generar los correos (RN-155, RN-198, RN-201).
✅ **Ejemplo:** Se abre la lista el 2026-11-05 y se confirma el 2026-11-06; el aviso utiliza el saldo vigente y los días de atraso del día 6.
❌ **Contraejemplo:** Una cuota saldada después de abrir la lista se envía con su saldo anterior.

**RN-213** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-03; Alcance M5; decisión del usuario (2026-11-05); auditoría QA2-03 y QA2-04; decisión del usuario (2026-11-07); RN-113 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO el usuario confirma un envío, el sistema DEBE volver a obtener los destinatarios vigentes antes de generar los correos, conforme a RN-136 y su exigencia de nueva confirmación si cambiaron.
✅ **Ejemplo:** El correo del contacto 42 cambia de ana@example.com a nueva@example.com antes de confirmar; se muestran los destinatarios vigentes para confirmar otra vez.
❌ **Contraejemplo:** Se envía a ana@example.com usando los destinatarios guardados al abrir la lista.

**RN-214** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-03; Alcance M5; decisión del usuario (2026-11-05); auditoría QA2-03 y QA2-04; decisión del usuario (2026-11-07); RN-113 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO una selección confirmada contiene varias cuotas aptas del mismo contacto y del mismo tipo de aviso de RN-114, el sistema DEBE agruparlas en un solo correo por contacto y tipo.
✅ **Ejemplo:** Las cuotas 1 y 2 de F001-00045, por cobrar por vencer del contacto 42, van en un correo; una vencida va en otro.
❌ **Contraejemplo:** Se envían dos correos para las cuotas 1 y 2 del mismo contacto y tipo, o se mezcla una por pagar con una por cobrar.

**RN-215** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-03; Alcance M5; decisión del usuario (2026-11-05); auditoría QA2-03 y QA2-04; decisión del usuario (2026-11-07); RN-113 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE enviar avisos sin confirmación de un usuario.
✅ **Ejemplo:** La cuota 12 vence el 2026-11-07 y no genera correo hasta que el usuario confirma.
❌ **Contraejemplo:** La cuota 12 genera un correo automático el 2026-11-07.

**Contexto de RN-113:** RN-212 a RN-215 conservan las comprobaciones y límites del envío manual. RN-136 regula la nueva confirmación de destinatarios; RN-155, la exclusión de cuotas no aptas y el caso sin cuotas aptas; RN-159, el control de intentos sin resultado confirmado.

**RN-114** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-03; Alcance M5; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
El sistema DEBE usar cuatro maquetas de correo fijas, una por cada tipo de aviso: por cobrar por vencer, por cobrar vencida, por pagar por vencer y por pagar vencida. En las maquetas por cobrar, la empresa recuerda al cliente el pago de lo que le debe; en las maquetas por pagar, la empresa informa al proveedor sobre un pago que ella le debe, sin pedirle ningún pago. Toda maqueta DEBE incluir el nombre del contacto, el nombre de la empresa, el número del comprobante, el número de cuota, la fecha efectiva de vencimiento (RN-071), el saldo y su moneda. Las maquetas de cuotas vencidas DEBEN incluir además los días de atraso, que son los días calendario entre la fecha efectiva de vencimiento y la fecha de cálculo. Un correo con varias cuotas NO DEBE mostrar un total que sume importes en S/ con importes en US$ (RN-047).
✅ **Ejemplo:** aviso por cobrar vencida de la cuota 1 de F001-00044 a "Cliente SAC", con fecha de cálculo 2026-11-05: el correo dice que la cuota venció el 28 de octubre de 2026, con 8 días de atraso y saldo vencido S/ 3,000.00, y pide regularizar el pago.
✅ **Ejemplo:** aviso por pagar por vencer de E001-00123 a "Proveedor SAC": informa que la cuota 1 vence el 12 de noviembre de 2026 y está programada para pago, con saldo por pagar US$ 300.00.
❌ **Contraejemplo:** al proveedor se le envía la maqueta de cobro ("Le agradecemos regularizar el pago a la brevedad"), o el correo de una cuota vencida omite los días de atraso.

**RN-115** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-03; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
Al enviar un aviso, el sistema DEBE permitir al usuario ingresar un comentario opcional, que se incluye en el correo como texto simple y se guarda en el registro del aviso (RN-043), con las reglas de TRIM, mayúsculas y longitud máxima de 500 caracteres de RN-162. Un comentario que queda vacío tras el TRIM se trata como sin comentario. En el aviso de una cuenta por pagar vencida, el campo de comentario DEBE mostrarse desde el inicio; en los demás tipos, el sistema DEBE permitir al usuario agregarlo si lo desea. El comentario NO DEBE ser obligatorio.
✅ **Ejemplo:** al avisar la cuota 1 de E001-00123 (por pagar, vencida) a "Proveedor SAC", el usuario escribe "Estamos regularizando el pago y lo realizaremos el 8 de noviembre." y el correo lo incluye, en mayúsculas, bajo "Comentario de Empresa 1 SAC".
✅ **Ejemplo:** el usuario envía el mismo aviso sin comentario y el aviso se envía igual.
❌ **Contraejemplo:** el sistema impide enviar el aviso de una cuenta por pagar vencida porque el comentario está vacío, o ese aviso no ofrece dónde escribir el comentario.

**RN-116** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA A-03; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
Los usuarios con cualquier rol (ADMINISTRADOR, SUPERVISOR y OPERADOR) DEBEN poder ver la lista de cuotas por avisar (RN-112) y enviar avisos (RN-113).
✅ **Ejemplo:** un usuario con rol OPERADOR abre la lista de cuotas por avisar y envía el aviso de la cuota 2 de F001-00045.
❌ **Contraejemplo:** un usuario con rol OPERADOR no ve la lista de cuotas por avisar porque su rol no lo permite.

**RN-117** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-03; RN-042; RN-104; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
El correo de cada aviso DEBE llevar como dirección de respuesta el correo administrativo de la empresa (RN-164), para que el contacto responda a la empresa y no a una dirección del sistema.
✅ **Ejemplo:** el contacto "cliente@cliente.example" responde al aviso y la respuesta llega a "admin@empresa1.example".
❌ **Contraejemplo:** el aviso sale con la dirección de respuesta "no-reply@venceya.example".

**RN-134** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-17; decisión del usuario (2026-11-06); PRINCIPIO-006
Patrón EARS: Ubiquitous
El sistema DEBE mantener para cada empresa dos listas independientes de usuarios en copia: una para avisos por cobrar a clientes y otra para avisos por pagar a proveedores, con la elegibilidad de RN-135.
✅ **Ejemplo:** el usuario 25 está solo en la lista por cobrar; recibe copia del aviso por cobrar de F001-00045, no del aviso por pagar de P001-00020.
❌ **Contraejemplo:** agregar al usuario 25 a la lista por cobrar lo agrega también a la lista por pagar.

**RN-175** | Categoría: Notificaciones | Prioridad: MUST | Fuente: RN-134; Auditoría QA A-17; decisión del usuario (2026-11-06); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE permitir modificar las listas de copias únicamente a los usuarios ADMINISTRADOR de la empresa, conforme a RN-060 y RN-135.
✅ **Ejemplo:** el ADMINISTRADOR 10 agrega al usuario elegible 25 a la lista por cobrar de su empresa.
❌ **Contraejemplo:** el SUPERVISOR 25 se agrega a sí mismo a esa lista.

**RN-176** | Categoría: Notificaciones | Prioridad: MUST | Fuente: RN-134; PRINCIPIO-006; decisión del usuario (2026-11-06); QA2-30 (2026-11-08)
Patrón EARS: Event-driven
CUANDO un ADMINISTRADOR modifica una lista de copias, el sistema DEBE auditar el cambio con el usuario agregado o quitado, la lista afectada, el usuario que hizo el cambio y la fecha y hora ISO 8601.
✅ **Ejemplo:** se registra que el usuario 10 agregó al usuario 25 a la lista por cobrar el 2026-11-08T09:00:00-05:00.
❌ **Contraejemplo:** se agrega al usuario 25 sin registrar quién lo hizo ni la lista afectada.

**RN-177** | Categoría: Notificaciones | Prioridad: MUST | Fuente: RN-134; decisión del usuario (2026-11-06); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE admitir que cualquiera de las dos listas de copias esté vacía.
✅ **Ejemplo:** la empresa 1 guarda ambas listas sin usuarios.
❌ **Contraejemplo:** el sistema exige agregar al menos un SUPERVISOR a cada lista.

**RN-178** | Categoría: Notificaciones | Prioridad: MUST | Fuente: RN-134; RN-042; decisión del usuario (2026-11-06); QA2-30 (2026-11-08)
Patrón EARS: Event-driven
CUANDO el sistema genera un aviso cuya lista aplicable no tiene usuarios en copia, DEBE dirigirlo al contacto con copia únicamente al correo administrativo de la empresa, conforme a RN-042 y RN-136.
✅ **Ejemplo:** la lista por pagar está vacía; el aviso se dirige a proveedor@example.com con copia solo a admin@empresa1.example.
❌ **Contraejemplo:** el sistema omite el correo administrativo porque la lista por pagar está vacía.

**RN-179** | Categoría: Notificaciones | Prioridad: MUST | Fuente: RN-134; decisión del usuario (2026-11-06); QA2-30 (2026-11-08)
Patrón EARS: Event-driven
CUANDO cambia una lista de copias, el sistema NO DEBE modificar los avisos ya enviados; la configuración vigente se aplica a los nuevos avisos según RN-136 y RN-138.
✅ **Ejemplo:** quitar al usuario 25 el 2026-11-08 no cambia los destinatarios históricos del aviso enviado el 2026-11-07.
❌ **Contraejemplo:** quitar al usuario 25 borra su dirección del historial del aviso del 2026-11-07.

**RN-135** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-17; decisión del usuario (2026-11-06); PRINCIPIO-003; PRINCIPIO-004
Patrón EARS: Unwanted
SI el ADMINISTRADOR intenta agregar a una lista de copias (RN-134) a alguien que no es un usuario ACTIVO de la misma empresa con rol ADMINISTRADOR o SUPERVISOR, el sistema NO DEBE permitirlo. Las listas NO DEBEN aceptar direcciones de correo escritas a mano. CUANDO un usuario de una lista pasa a DESACTIVADO (RN-099) o cambia a rol OPERADOR, el sistema DEBE dejar de enviarle copias desde ese momento y DEBE mostrarlo en la configuración como inactivo hasta que el ADMINISTRADOR lo quite o el usuario recupere un rol y un estado válidos.
✅ **Ejemplo:** el administrador agrega a la lista de avisos por pagar al SUPERVISOR "jefe.pagos@empresa1.example", usuario ACTIVO de la empresa.
✅ **Ejemplo:** "jefe.cobranzas@empresa1.example" es desactivado; el siguiente aviso por cobrar no le llega y la configuración lo muestra como inactivo.
❌ **Contraejemplo:** el administrador escribe "contador@externo.example" en la lista de copias, agrega a un OPERADOR o a un usuario de otra empresa.

**RN-136** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-17; decisión del usuario (2026-11-06); auditoría QA2-04; decisión del usuario (2026-11-07)
Patrón EARS: Event-driven
CUANDO el usuario va a confirmar el envío, el reenvío o el reintento de un aviso (RN-113, RN-138), el sistema DEBE mostrarle el destinatario principal y todos los destinatarios en copia que recibirán cada correo: el correo administrativo de la empresa y los usuarios de la lista del sentido del aviso. El usuario que envía NO DEBE poder quitar, agregar ni reemplazar destinatarios en copia desde la pantalla de envío. Al confirmar, el sistema DEBE volver a obtener los destinatarios vigentes: el correo del contacto (RN-129), el correo administrativo (RN-104) y la lista de copias (RN-134, RN-135). Si no coinciden con los mostrados, el sistema NO DEBE enviar el correo y DEBE mostrar los destinatarios vigentes para que el usuario confirme otra vez. En un reenvío o un reintento, el sistema DEBE marcar cada destinatario que cambió desde el último intento de esa cuota e indicar el valor anterior.
✅ **Ejemplo:** antes de confirmar, Luis (OPERADOR) ve "Para: cliente@cliente.example · Copia: admin@empresa1.example, jefe.cobranzas@empresa1.example" y confirma el envío.
✅ **Ejemplo:** Luis tiene abierta la pantalla de confirmación; mientras tanto, otro usuario cambia el correo de "Cliente SAC" a "tesoreria@cliente.example". Al confirmar, el sistema no envía, muestra "Para: tesoreria@cliente.example" y pide confirmar otra vez.
✅ **Ejemplo:** al reenviar la cuota 2, la pantalla muestra "Para: tesoreria@cliente.example (antes: pagos@cliente.example)".
❌ **Contraejemplo:** Luis quita a "admin@empresa1.example" de la copia antes de enviar, o escribe una dirección adicional en copia.
❌ **Contraejemplo:** la pantalla muestra "pagos@cliente.example", el correo del contacto cambia antes de confirmar y el aviso se envía a "tesoreria@cliente.example" sin que Luis lo vea.

**RN-137** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-17; decisión del usuario (2026-11-06); PRINCIPIO-006
Patrón EARS: Ubiquitous
El sistema DEBE conservar por cada intento de aviso su clave de idempotencia (RN-158) y el resultado de la solicitud a Resend: aceptado, rechazado de forma confirmada, sin confirmación o no verificable (RN-066, RN-067, RN-159). Si Resend acepta la solicitud y devuelve un identificador de correo, el sistema DEBE guardar ese identificador y considerar «Enviado» a cada cuota incluida en el correo para su tipo y fecha efectiva de vencimiento en ese intento. «Enviado» significa aceptado para envío por Resend, NO confirma entrega ni lectura por el destinatario. El MVP NO DEBE mostrar estados de entrega por destinatario ni procesar webhooks de entrega o rebote. La bandeja DEBE conservar el destinatario principal y las copias de cada intento aunque la configuración cambie después.
✅ **Ejemplo:** Resend acepta el aviso 118, dirigido al contacto con copia al correo administrativo y a un supervisor; las cuotas incluidas muestran «Enviado» y la bandeja conserva el identificador devuelto y los destinatarios del intento.
✅ **Ejemplo:** Resend rechaza el aviso 118; ninguna de sus cuotas muestra «Enviado» y el intento rechazado permanece en el historial.
❌ **Contraejemplo:** el aviso figura «Enviado» antes de recibir la aceptación de Resend, o la aplicación interpreta «Enviado» como confirmación de recepción en el buzón del contacto.

**RN-138** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA A-17; decisión del usuario (2026-11-06); auditoría QA2-03 y QA2-04; decisión del usuario (2026-11-07)
Patrón EARS: Event-driven
CUANDO el usuario confirma «Reenviar aviso» para una cuota ya marcada «Enviado» (RN-045) o vuelve a intentar un aviso rechazado de forma confirmada (RN-066), el sistema DEBE generar un nuevo aviso manual con los datos, el tipo y los destinatarios vigentes al confirmar, aplicando otra vez RN-113, RN-135, RN-136 y RN-155. NO DEBE reenviar el contenido ni los destinatarios guardados del intento anterior. DEBE registrar el nuevo intento junto a los anteriores sin modificar su contenido ni sus destinatarios históricos. Si Resend lo acepta, la lista DEBE mostrar la fecha y hora de ese último envío; si lo rechaza, DEBE conservar la fecha del último envío aceptado, si existe, y mostrar el error (RN-066). Ni el reenvío ni el reintento son automáticos.
✅ **Ejemplo:** la cuota 2 ya muestra «Enviado · 2026-11-05 09:10»; el usuario confirma el reenvío el 2026-11-06 y Resend lo acepta. La lista muestra «Enviado · 2026-11-06» y la bandeja conserva ambos intentos.
✅ **Ejemplo:** el supervisor que recibió copia del primer aviso ya no es apto para recibirla; el reenvío usa los destinatarios vigentes y conserva la lista histórica del primer envío.
✅ **Ejemplo:** Resend rechaza el aviso de la cuota 2 dirigido a "pagos@cliente.example"; después el correo del contacto cambia a "tesoreria@cliente.example". El reintento se envía a "tesoreria@cliente.example" y la bandeja conserva el intento rechazado con "pagos@cliente.example".
✅ **Ejemplo:** el correo administrativo cambia a "cobranzas@empresa1.example" antes del reenvío; el nuevo aviso lleva ese correo en copia y como dirección de respuesta (RN-104, RN-117, RN-164).
❌ **Contraejemplo:** el reenvío repite el saldo antiguo sin recalcularlo, borra el aviso anterior del historial o se efectúa sin confirmación del usuario.
❌ **Contraejemplo:** el reintento de un aviso rechazado reutiliza el correo guardado y lo envía a la dirección anterior del contacto, o incluye una cuota cuyo comprobante se anuló después del primer intento.

**RN-155** | Categoría: Notificaciones | Prioridad: MUST | Fuente: auditoría QA2-03; decisión del usuario (2026-11-07); RN-041; RN-090; RN-130; decisión QA2-10 (2026-11-07)
Patrón EARS: Unwanted
Una cuota es **apta para aviso** cuando está PENDIENTE o VENCIDA con saldo, su comprobante no está anulado (RN-090). Un contacto desactivado no impide el aviso (RN-130). SI al confirmar un envío (RN-113), un reenvío o un reintento (RN-138) una cuota seleccionada no es apta, el sistema NO DEBE incluirla en el correo, aunque tenga intentos anteriores o el usuario haya confirmado. DEBE enviar las cuotas que sigan siendo aptas y mostrar al usuario qué cuotas excluyó y el motivo: cuota cancelada o comprobante anulado. Si ninguna cuota sigue siendo apta, el sistema NO DEBE enviar ningún correo ni registrar un intento. La exclusión NO DEBE modificar los intentos anteriores ni la marca «Enviado» que la cuota tuviera.
✅ **Ejemplo:** Resend rechazó el aviso de las cuotas 1 y 2 de F001-00045; antes del reintento se registra un pago que cancela la cuota 1. El reintento se envía solo con la cuota 2 y la pantalla informa "Cuota 1 de F001-00045 no incluida: cuota cancelada".
✅ **Ejemplo:** antes del reenvío, la cuota 2 recibe un pago parcial; sigue siendo apta y el correo muestra el saldo recalculado (RN-113).
✅ **Ejemplo:** el usuario va a reenviar el aviso de la cuota 2 de F001-00045, pero el comprobante se anula antes de confirmar. No se envía ningún correo, no se registra un intento y la pantalla informa "comprobante anulado".
✅ **Ejemplo:** el contacto de la cuota 2 se desactiva después de un intento rechazado; si la cuota sigue pendiente o vencida con saldo y el comprobante no está anulado, se puede reintentar el aviso al correo vigente del contacto.
❌ **Contraejemplo:** el reintento de un aviso rechazado se envía con la cuota 1, que ya está CANCELADA, porque estaba incluida en el intento original.
❌ **Contraejemplo:** el sistema registra un intento vacío cuando todas las cuotas seleccionadas fueron excluidas.

---

## UX

**RN-157** | Categoría: UX | Prioridad: MUST | Fuente: Auditoría QA2-06; decisión del usuario (2026-11-07); RN-156; RN-158; RN-159
Patrón EARS: Event-driven
CUANDO el usuario pulsa el botón que registra un cobro o un pago, «Enviar aviso», «Reenviar aviso» o «Verificar envío», el frontend DEBE deshabilitar ese botón e indicar que la solicitud está en curso hasta recibir la respuesta o agotar el tiempo de espera. Esta protección evita el doble clic, pero NO DEBE ser la única garantía: el backend DEBE impedir el efecto duplicado aunque la solicitud llegue repetida desde otra pestaña, por un reintento del navegador o por una llamada que no pase por la pantalla (RN-156 para pagos; RN-158 y RN-159 para avisos). Al volver a habilitarse tras un tiempo de espera, el botón NO DEBE iniciar una operación nueva: un pago se reintenta con la misma clave (RN-156) y un aviso sin confirmar solo ofrece «Verificar envío» (RN-112).
✅ **Ejemplo:** Ana pulsa dos veces seguidas «Enviar aviso»; el botón queda deshabilitado con el texto «Enviando…» desde el primer clic y sale un solo correo.
✅ **Ejemplo:** Ana tiene abierta la misma cuota en dos pestañas y registra el mismo cobro en ambas con la misma clave; el backend devuelve el cobro original en la segunda.
❌ **Contraejemplo:** el botón sigue activo mientras se espera la respuesta, o el sistema confía solo en el botón deshabilitado y dos solicitudes desde pestañas distintas generan dos correos.

**RN-046** | Categoría: UX | Prioridad: MUST | Fuente: Alcance M4; K1; Respuesta ronda 1, pregunta 3
Patrón EARS: Ubiquitous
El panel de cartera DEBE mostrar cuatro indicadores: la cartera vencida por cobrar (RN-107), la vencida por pagar (RN-108), la pendiente de cobro (RN-109) y la pendiente de pago (RN-110), en la moneda seleccionada en el selector de moneda del panel (RN-069). Cada indicador se muestra aunque su total sea cero. Las cuotas CANCELADAS no suman en ningún indicador.
✅ **Ejemplo:** con el selector en S/, el panel muestra "Vencida por cobrar: S/ 4,500.00", "Vencida por pagar: S/ 0.00", "Pendiente de cobro: S/ 8,000.00" y "Pendiente de pago: S/ 2,000.00". Al cambiar a US$, muestra los cuatro indicadores en US$.
❌ **Contraejemplo:** el panel omite "Vencida por pagar" porque su total es cero, o muestra "Vencida por cobrar: S/ 4,500.00" y "Vencida por cobrar: US$ 1,200.00" a la vez, o muestra "Vencida por cobrar: S/ 5,700.00".

**RN-047** | Categoría: UX | Prioridad: MUST | Fuente: Alcance M4; Brief §1 (Monedas)
Patrón EARS: Unwanted
El panel de cartera NO DEBE mostrar ningún total que sume importes en S/ con importes en US$.
✅ **Ejemplo:** el panel muestra "Pendiente de pago: S/ 2,000.00" y "Pendiente de pago: US$ 300.00" por separado.
❌ **Contraejemplo:** el panel muestra "Pendiente de pago total: S/ 2,300.00".

**RN-048** | Categoría: UX | Prioridad: MUST | Fuente: Alcance M4; K4; Respuesta ronda 1, pregunta 3; decisión de la pregunta 12
Patrón EARS: Ubiquitous
El panel de cartera DEBE mostrar una proyección gráfica de los vencimientos de los próximos 7, 10 o 15 días, según la ventana seleccionada por el usuario (RN-119), a partir de la fecha de cálculo incluida y usando la fecha efectiva de vencimiento (RN-071). El gráfico DEBE agrupar los saldos por día, mostrar cada día de la ventana aunque no tenga vencimientos y separar los cobros de los pagos en dos series, sin mezclarlos en un solo total.
✅ **Ejemplo:** con fecha de cálculo 2026-11-04 y ventana de 10 días, el gráfico muestra del 04 al 13 de noviembre. El 07 no tiene vencimientos y aparece con cobros S/ 0.00 y pagos S/ 0.00. El 06 tiene una cuota por cobrar de S/ 1,000.00 con un pago parcial de S/ 400.00, y una cuota por pagar de S/ 300.00: muestra cobros S/ 600.00 y pagos S/ 300.00.
❌ **Contraejemplo:** con fecha de cálculo 2026-11-04 y ventana de 10 días, el gráfico termina el 14 de noviembre, omite el 07 porque no tiene cuotas, usa el importe original en vez del saldo o mezcla cobros y pagos en un solo total.

**RN-119** | Categoría: UX | Prioridad: MUST | Fuente: Auditoría QA A-06; decisión del usuario (2026-11-05); Alcance M4
Patrón EARS: Event-driven
CUANDO un usuario selecciona una ventana válida de proyección, el sistema DEBE guardar la selección como preferencia propia para el gráfico de RN-048, con los permisos de RN-169 y RN-171.
✅ **Ejemplo:** Ana selecciona 15 días; al volver a abrir el panel el 2026-11-04, su gráfico abarca del 2026-11-04 al 2026-11-18.
❌ **Contraejemplo:** Ana guarda 15 días y al volver a abrir el panel obtiene 7 días.

**RN-180** | Categoría: UX | Prioridad: MUST | Fuente: RN-119; Auditoría QA A-06; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE admitir únicamente 7, 10 o 15 días como valores de la ventana personal de proyección.
✅ **Ejemplo:** se aceptan las selecciones de 7, 10 y 15 días.
❌ **Contraejemplo:** el sistema acepta una ventana de 0 o 20 días.

**RN-181** | Categoría: UX | Prioridad: MUST | Fuente: RN-119; Alcance M4; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE aplicar la ventana personal de proyección exclusivamente al gráfico de RN-048, sin limitar por ella el listado de movimientos, la lista de cuotas por avisar, el reporte de vencimientos, los estados de las cuotas ni los avisos enviados.
✅ **Ejemplo:** con ventana de 7 días el 2026-11-04, la cuota con saldo que vence el 2026-12-01 sigue en la lista de cuotas por avisar.
❌ **Contraejemplo:** elegir 7 días oculta esa cuota de la lista de cuotas por avisar.

**RN-182** | Categoría: UX | Prioridad: MUST | Fuente: RN-119; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: State-driven
MIENTRAS el usuario no tenga una ventana personal de proyección definida, el sistema DEBE usar 7 días para su gráfico.
✅ **Ejemplo:** Luis, sin preferencia, abre el panel el 2026-11-04 y ve del 2026-11-04 al 2026-11-10.
❌ **Contraejemplo:** Luis, sin preferencia, obtiene inicialmente 15 días.

**RN-069** | Categoría: UX | Prioridad: MUST | Fuente: Decisión de la pregunta 12
Patrón EARS: Ubiquitous
El panel DEBE mostrar «Datos al DD/MM/AAAA, HH:mm» en America/Lima y usar un mismo corte y lectura coherente para sus indicadores, gráfico y listado, según RN-205 a RN-209. Al actualizar el panel, sus componentes y la leyenda DEBEN corresponder al nuevo corte.
✅ **Ejemplo de pago concurrente:** si se registra un pago después del corte mientras se genera el panel, ni el listado ni los totales de esa respuesta incluyen ese pago. Una nueva consulta lo incorpora en ambos.
El panel de cartera DEBE mostrar un selector de moneda general, con S/ seleccionado por defecto. El ADMINISTRADOR DEBE poder configurar la moneda por defecto de la empresa (RN-106), y el sistema DEBE permitir a cada usuario definir su propia preferencia, con prioridad sobre la de la empresa (RN-105, RN-169). La moneda seleccionada DEBE aplicarse a todo el panel: los totales de cartera (RN-046), el gráfico de próximos vencimientos (RN-048) y el listado de movimientos. El tiempo promedio de cobro (RN-147), expresado en días, no depende del selector. Los totales, el gráfico y el listado DEBEN incluir solo las cuotas en la moneda seleccionada. Cuando la moneda no seleccionada tenga al menos una cuota VENCIDA con saldo, el selector DEBE mostrar un indicador de vencidos junto a esa moneda, sin mostrar importes ni sumar monedas distintas (RN-047).
✅ **Ejemplo:** con el selector en S/, una cuota de US$ 500 con vencimiento el 2026-11-06 no suma en la barra del 06 de noviembre, no aparece en el listado y no suma en las tarjetas de cartera. Si hay cuotas vencidas en US$, la opción "US$" del selector muestra el indicador de vencidos.
❌ **Contraejemplo:** la barra del 06 de noviembre suma S/ 600 y US$ 500 en un mismo total. El selector en S/ no muestra el indicador aunque hay una cuota vencida en US$. El indicador muestra "US$ 1,200.00" junto al selector.

**RN-049** | Categoría: UX | Prioridad: MUST | Fuente: Alcance M4; Respuesta ronda 1, pregunta 3; Auditoría QA2-28; decisión del usuario (2026-11-08)
Patrón EARS: Ubiquitous
El listado de movimientos DEBE mostrar el estado de pago de cada cuota de un comprobante no anulado como PENDIENTE, VENCIDA o CANCELADA, y DEBE mostrar la marca de reprogramación (RN-072) en las cuotas reprogramadas. Por defecto, el listado DEBE excluir los comprobantes anulados y todas sus cuotas. Solo cuando el usuario active explícitamente «Incluir comprobantes anulados», DEBE incluir también sus filas, conservando los demás filtros: marca ANULADO a nivel de comprobante y ANULADA por anulación del comprobante a nivel de cuota, sin estado de pago vigente. ANULADA es una condición heredada del comprobante, no un cuarto estado de pago ni una anulación independiente de cuota. Incluir esas filas NO DEBE incorporarlas a los cálculos de cartera, indicadores, avisos ni reporte de vencimientos (RN-090).
✅ **Ejemplo:** la cuota 2 de F001-00045 aparece con estado VENCIDA; la cuota 1, reprogramada, aparece con estado PENDIENTE y la marca de reprogramación.
❌ **Contraejemplo:** la cuota 2 de F001-00045 aparece con estado "EN REVISIÓN".
✅ **Ejemplo de inclusión:** F001-00050 está anulado y sus cuotas no aparecen al abrir el listado. Al activar «Incluir comprobantes anulados», aparecen con las marcas ANULADO y ANULADA por anulación del comprobante, sin estado de pago vigente.
❌ **Contraejemplo:** se muestran cuotas anuladas sin solicitarlo, o se las presenta como VENCIDAS al activar su inclusión.

**RN-075** | Categoría: UX | Prioridad: MUST | Fuente: Decisión del usuario (clasificación "por vencer"); Alcance S4; Auditoría QA A-03 (RN-112) y A-06
Patrón EARS: Ubiquitous
El sistema DEBE clasificar como por vencer a toda cuota PENDIENTE con saldo, sin aplicar un límite máximo de días futuros. "Por vencer" es una clasificación del reporte y de la lista de cuotas por avisar, no un estado de la cuota, y no depende de la ventana de proyección seleccionada en RN-119 (RN-181).
✅ **Ejemplo:** con fecha de cálculo 2026-11-04, una cuota PENDIENTE con fecha efectiva 2026-12-20 se clasifica como por vencer y aparece en el reporte aunque el gráfico muestre solo 7 días.
✅ **Ejemplo de MVP sin S4:** una cuota PENDIENTE con saldo y vencimiento 2026-12-20 aparece en la lista de cuotas por avisar el 2026-11-04 aunque esté fuera del gráfico de 7 días; no se exige el reporte S4.
❌ **Contraejemplo:** la cuota PENDIENTE del 2026-12-20 se excluye del reporte porque está fuera de la ventana gráfica de 7 días.

---

## Reportes

**RN-050** | Categoría: Datos | Prioridad: SHOULD | Fuente: Alcance S4; Auditoría QA A-21; decisión del usuario (2026-11-06)
Patrón EARS: Ubiquitous
El sistema DEBE permitir al usuario con rol SUPERVISOR o ADMINISTRADOR exportar el listado de movimientos de un periodo en formato CSV, con el periodo, las columnas y los filtros definidos en RN-144 a RN-146 y RN-183 a RN-188 y el contrato de formato y salida literal de RN-163.
✅ **Ejemplo:** un usuario con rol SUPERVISOR exporta el listado de movimientos de los comprobantes emitidos del 2026-10-01 al 2026-10-31 a un archivo .csv.
❌ **Contraejemplo:** la exportación del periodo 2026-10-01 a 2026-10-31 incluye una cuota de un comprobante emitido el 2026-11-01.
❌ **Contraejemplo:** se entrega S4 sin permitir exportar en CSV al SUPERVISOR o al ADMINISTRADOR, alegando que la capacidad es opcional.

**RN-051** | Categoría: Datos | Prioridad: SHOULD | Fuente: Alcance S4; Auditoría QA A-21; decisión del usuario (2026-11-06)
Patrón EARS: Ubiquitous
El sistema DEBE permitir al usuario con rol SUPERVISOR o ADMINISTRADOR exportar el listado de movimientos de un periodo en formato Excel (.xlsx), con las mismas filas y columnas que la exportación en CSV (RN-050) para el mismo periodo y filtros. Los tipos de celda, formatos y salida literal DEBEN cumplir RN-163; la equivalencia de datos no exige una representación textual idéntica entre formatos.
✅ **Ejemplo:** un usuario con rol ADMINISTRADOR exporta a .xlsx el listado de movimientos de los comprobantes emitidos en octubre de 2026 y obtiene las mismas filas que en el .csv.
❌ **Contraejemplo:** la exportación en .xlsx incluye una fila sin fecha de emisión, o tiene filas distintas que el .csv del mismo periodo y filtros.
❌ **Contraejemplo:** se entrega S4 con CSV pero sin Excel, o se niega la exportación Excel al SUPERVISOR por reservarla al ADMINISTRADOR.

**RN-144** | Categoría: Datos | Prioridad: SHOULD | Fuente: Auditoría QA A-21; decisión del usuario (2026-11-06); Alcance S4; RN-023; Auditoría QA2-28; decisión del usuario (2026-11-08)
Patrón EARS: Event-driven
Cada exportación DEBE consultar los datos vigentes con un nuevo corte y una lectura coherente según RN-205 y RN-206. El archivo DEBE identificar su corte con «Datos al DD/MM/AAAA, HH:mm» en America/Lima. Dos exportaciones del mismo periodo pueden diferir si hubo cambios entre sus cortes; el periodo de emisión no determina el momento de corte.
CUANDO el usuario exporta el listado de movimientos (RN-050, RN-051), el sistema DEBE exigir una fecha inicial y una fecha final, ambas incluidas y en America/Lima, y DEBE rechazar el periodo si la fecha inicial es posterior a la final. El sistema DEBE incluir todas las cuotas de los comprobantes cuya fecha de emisión esté dentro del periodo y que cumplan los filtros de RN-146, RN-184 y RN-185; por defecto se excluyen los anulados. La selección NO DEBE depender de su fecha de vencimiento, sus reprogramaciones ni sus fechas de pago. El estado de pago de las cuotas de comprobantes no anulados, el pagado acumulado y el saldo DEBEN calcularse a la fecha de cálculo actual (RN-198 y RN-201); la exportación NO DEBE reconstruir la situación de una fecha pasada. Para cuotas anuladas incluidas expresamente, DEBE aplicarse la representación de RN-145, sin estado de pago vigente.
✅ **Ejemplo:** un comprobante emitido el 2026-09-25, con una cuota que vence el 2026-10-15 y se paga el 2026-11-02, aparece solo en la exportación del periodo 2026-09-01 a 2026-09-30, con estado CANCELADA si se exporta el 2026-11-05.
❌ **Contraejemplo:** esa cuota aparece en la exportación de octubre por su fecha de vencimiento o en la de noviembre por su fecha de pago; o el sistema acepta el periodo 2026-10-31 a 2026-10-01.

**RN-145** | Categoría: Datos | Prioridad: SHOULD | Fuente: Auditoría QA A-21; decisión del usuario (2026-11-06); Alcance S4; PRINCIPIO-004; Auditoría QA2-28; decisión del usuario (2026-11-08)
Patrón EARS: Ubiquitous
La exportación del listado de movimientos DEBE tener una fila por cuota seleccionada según RN-144, RN-146, RN-184 y RN-185, con estas columnas: sentido (por cobrar o por pagar), nombre del contacto, número de documento, fecha de emisión, moneda, total del comprobante, número de cuota, importe de la cuota, vencimiento pactado, vencimiento efectivo (RN-071), marca de reprogramación (RN-072), pagado acumulado (suma de pagos no anulados), saldo, estado de pago de la cuota (PENDIENTE, VENCIDA o CANCELADA para comprobantes no anulados), comprobante anulado (Sí o No) y mayor fecha de pago entre los pagos no anulados de la cuota (vacía si no tiene pagos; no equivale a cancelación real mientras conserve saldo). Si el usuario solicita incluir comprobantes anulados, sus filas DEBEN tener vacío el estado de pago y «Sí» en comprobante anulado; esta columna identifica que todas sus cuotas están ANULADAS por consecuencia del comprobante (RN-090), sin introducir un cuarto estado de pago. La anulación NO DEBE poner artificialmente el saldo a cero ni registrar pagos: los importes conservan su cálculo de RN-025, pero esas filas no representan obligaciones vigentes. La exportación NO DEBE incluir el correo, el teléfono ni la dirección del contacto. CSV y Excel DEBEN aplicar las mismas columnas y el mismo criterio de inclusión y representación para el mismo corte y filtros, con los formatos de RN-163.
✅ **Ejemplo:** la fila de la cuota 2 de F001-00045 dice: por cobrar · Cliente SAC · F001-00045 · 2026-10-01 · S/ · 1,000.00 · 2 · 500.00 · 2026-11-01 · 2026-11-20 · reprogramada · 200.00 · 300.00 · VENCIDA · No · 2026-10-28.
✅ **Ejemplo de anulado incluido:** la cuota de S/ 500.00 de F001-00050 anulado, sin pagos, tiene importe 500.00, pagado acumulado 0.00, saldo 500.00, estado de pago vacío, comprobante anulado «Sí» y fecha de pago vacía; ese saldo no integra la cartera vigente.
❌ **Contraejemplo:** una fila tiene ANULADO o ANULADA en la columna de estado de pago, o saldo cero únicamente por haberse anulado el comprobante.
❌ **Contraejemplo:** la exportación tiene una fila por comprobante sin detalle de cuotas, omite el saldo o incluye "cliente@cliente.example".

**RN-146** | Categoría: Datos | Prioridad: SHOULD | Fuente: Auditoría QA A-21; decisión del usuario (2026-11-06); Alcance S4; RN-047; Auditoría QA2-28; decisión del usuario (2026-11-08)
Patrón EARS: Event-driven
CUANDO un usuario autorizado solicita exportar el listado de movimientos (RN-050, RN-051), el sistema DEBE ofrecer la selección de sentido entre por cobrar, por pagar o ambos, con ambos seleccionado por defecto, para filtrar las cuotas según RN-144.
✅ **Ejemplo:** al solicitar octubre de 2026, aparece ambos como sentido inicial; el supervisor elige por cobrar y el archivo solo contiene cuotas por cobrar.
❌ **Contraejemplo:** la opción inicial es por pagar o el archivo ignora el sentido por cobrar seleccionado.

**RN-183** | Categoría: Datos | Prioridad: SHOULD | Fuente: RN-146; Alcance S4; QA2-28; decisión del usuario (2026-11-08); QA2-30
Patrón EARS: Event-driven
CUANDO un usuario autorizado abre las opciones de exportación del listado de movimientos, el sistema DEBE mostrar «Incluir comprobantes anulados» desactivado por defecto.
✅ **Ejemplo:** al abrir las opciones para octubre de 2026, la casilla es visible y está desactivada.
❌ **Contraejemplo:** la opción está oculta o aparece activada por defecto.

**RN-184** | Categoría: Datos | Prioridad: SHOULD | Fuente: RN-146; Alcance S4; QA2-28; decisión del usuario (2026-11-08); QA2-30
Patrón EARS: Event-driven
CUANDO se genera la exportación del listado sin selección explícita de «Incluir comprobantes anulados», el sistema DEBE excluir los comprobantes anulados y todas sus cuotas, tanto en CSV como en Excel.
✅ **Ejemplo:** sin activar la casilla, ninguno de los dos formatos incluye las cuotas del comprobante anulado F001-00050.
❌ **Contraejemplo:** el CSV incluye F001-00050 porque el listado en pantalla mostraba anulados, sin selección explícita en la exportación.

**RN-185** | Categoría: Datos | Prioridad: SHOULD | Fuente: RN-146; Alcance S4; QA2-28; decisión del usuario (2026-11-08); QA2-30
Patrón EARS: Event-driven
CUANDO se genera la exportación del listado con «Incluir comprobantes anulados» seleccionado explícitamente, el sistema DEBE incluir también sus cuotas que cumplan el periodo y sentido elegidos, con la representación de RN-145 en CSV y Excel.
✅ **Ejemplo:** al exportar octubre de 2026 por cobrar con la opción activa, F001-00050 anulado, emitido en octubre y por cobrar, aparece con estado de pago vacío y comprobante anulado «Sí» en ambos formatos.
❌ **Contraejemplo:** se incluye un anulado emitido en noviembre o una cuota anulada aparece con estado de pago CANCELADA.

**RN-186** | Categoría: Datos | Prioridad: SHOULD | Fuente: RN-146; RN-069; decisión del usuario (2026-11-06); QA2-30 (2026-11-08)
Patrón EARS: Event-driven
CUANDO se genera la exportación del listado de movimientos, el sistema DEBE incluir las cuotas seleccionadas de ambas monedas, S/ y US$, identificando la moneda en cada fila y sin filtrar por el selector de moneda del panel.
✅ **Ejemplo:** con el panel en S/, el archivo contiene las cuotas elegibles de S/ 500.00 y US$ 100.00, cada una con su moneda.
❌ **Contraejemplo:** el archivo omite la cuota elegible de US$ 100.00 porque el panel está en S/.

**RN-187** | Categoría: Datos | Prioridad: SHOULD | Fuente: RN-146; RN-047; decisión del usuario (2026-11-06); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El archivo exportado del listado de movimientos NO DEBE contener filas de total que sumen importes de S/ y US$.
✅ **Ejemplo:** el archivo conserva S/ 500.00 y US$ 100.00 sin agregarlos en un total común.
❌ **Contraejemplo:** el archivo muestra «Total: 600.00» sumando S/ 500.00 y US$ 100.00.

**RN-188** | Categoría: Datos | Prioridad: SHOULD | Fuente: RN-146; RN-076, RN-077, RN-090; QA2-28; decisión del usuario (2026-11-08); QA2-30
Patrón EARS: Ubiquitous
El sistema NO DEBE ofrecer «Incluir comprobantes anulados» en el reporte de vencimientos ni en su exportación, que siempre los excluyen según RN-076, RN-077 y RN-090.
✅ **Ejemplo:** el reporte de octubre de 2026 y su exportación excluyen F001-00050 anulado y no ofrecen una opción para incluirlo.
❌ **Contraejemplo:** el reporte permite activar la inclusión de F001-00050 anulado.

**RN-163** | Categoría: Datos y seguridad | Prioridad: SHOULD | Fuente: Auditoría QA2-25; decisión del usuario (2026-11-08); RN-050, RN-051, RN-077
Patrón EARS: Ubiquitous
Cuando se incorporen las exportaciones de S4, el sistema DEBE aplicar este contrato al listado de movimientos y al reporte de vencimientos, incluidas sus cabeceras, metadatos y resúmenes. Las columnas y los criterios de selección y cálculo siguen definidos en RN-145 y RN-076 a RN-077.

**CSV:** el archivo DEBE usar UTF-8 con BOM, coma como delimitador y CRLF como final de registro. Todos los campos, incluidos los vacíos, DEBEN encerrarse entre comillas dobles; cada comilla doble interna DEBE duplicarse. Las comas y los saltos de línea que formen parte de un valor DEBEN conservarse dentro del campo citado, sin crear columnas ni registros adicionales al leerlo con un analizador CSV. Los importes DEBEN escribirse con punto decimal, exactamente dos decimales y sin separador de miles (por ejemplo, «1000.50»); la moneda permanece en su columna. Las cantidades y los números de cuota DEBEN expresarse como enteros decimales. Las fechas calendario DEBEN escribirse como AAAA-MM-DD; una fecha ausente DEBE ser un campo vacío. El momento de corte conserva la leyenda y la zona horaria exigidas por RN-207, RN-077 y RN-144: no se reduce a una fecha calendario.

**Excel (.xlsx):** los nombres, documentos y demás campos textuales DEBEN escribirse como celdas de tipo texto explícito, conservando el valor guardado, sus ceros iniciales y todos sus dígitos. Aplicar solo un formato visual de texto a un valor numérico NO satisface esta condición. Los importes DEBEN ser celdas numéricas con dos decimales visibles; las cantidades y los números de cuota, celdas numéricas enteras. Las fechas calendario DEBEN ser fechas reales de Excel mostradas como DD/MM/AAAA, sin desplazamientos por zona horaria; las ausentes DEBEN quedar vacías. Los textos NO DEBEN convertirse en fórmulas, hipervínculos ni referencias externas, aunque parezcan tales. Los totales DEBEN exportarse como valores calculados por el sistema, sin fórmulas en el archivo; el archivo NO DEBE contener macros.

**Protección de textos en CSV:** antes del escape CSV, el exportador DEBE anteponer un apóstrofo ASCII (U+0027) a cada valor textual cuyo primer carácter sea «=», «+», «-» o «@», o un tabulador, retorno de carro o salto de línea. También DEBE hacerlo si el primer carácter distinto de espacios o controles es uno de esos cuatro signos. La comprobación NO DEBE quitar ni modificar los caracteres originales; el apóstrofo se agrega al principio del valor completo. Esta protección se aplica a los campos textuales, no a los importes, fechas ni cantidades generados por el sistema, y NO DEBE alterar los datos almacenados. El escape con comillas dobles por sí solo NO sustituye esta protección. El sistema NO DEBE usar fórmulas como ="000123" para conservar identificadores.

El CSV NO declara tipos de celda: el archivo DEBE conservar literalmente los ceros y dígitos de los documentos, pero su apertura automática en una hoja de cálculo puede reinterpretarlos. La descarga DEBE indicar que, para conservar tipos al abrir directamente en Excel, se use .xlsx; para importar CSV, se seleccione UTF-8, delimitador coma y tipo texto en las columnas textuales, especialmente documentos. La ayuda DEBE explicar el apóstrofo de protección, que puede verse en algunos lectores y que no ofrece una garantía universal frente a la interpretación de cualquier programa. La equivalencia CSV/Excel se refiere a los valores de origen y a los cálculos; admite las diferencias de fecha y la protección de transporte definidas aquí, sin incorporar el apóstrofo al dato de negocio.

Esta regla NO amplía los caracteres admitidos por RN-162 ni agrega campos a los reportes. Los casos con comillas, saltos de línea o signos rechazados por esa regla se verifican directamente en el componente exportador; en los formularios se verifica su rechazo.
✅ **Ejemplo:** el documento «000123» se escribe como «"000123"» en CSV y como texto «000123» en .xlsx; una fecha del 8 de noviembre de 2026 se escribe como «"2026-11-08"» en CSV y se muestra como «08/11/2026» en Excel.
✅ **Ejemplo:** en una prueba del exportador, el texto =1+1 se serializa en CSV como «"'=1+1"» y en Excel como texto literal «=1+1», sin evaluación; A"B se serializa en CSV como «"A""B"».
❌ **Contraejemplo:** el .xlsx guarda el documento como número y pierde ceros o dígitos, exporta una fecha como texto, o el CSV introduce una fórmula para conservar ceros.

**RN-052** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003; Alcance S4
Patrón EARS: Unwanted
El sistema NO DEBE incluir en una exportación movimientos de otra empresa.
✅ **Ejemplo:** la exportación de la empresa 1 contiene solo registros con empresa_id = 1.
❌ **Contraejemplo:** la exportación de la empresa 1 contiene el registro de la empresa 2.

**RN-053** | Categoría: Datos | Prioridad: SHOULD | Fuente: Alcance funcionalidad S5; K8; decisión del usuario sobre decimales; decisión de la pregunta 18 (2026-11-06)
Patrón EARS: Ubiquitous
El sistema DEBE calcular el tiempo promedio de cobro global de la empresa de un periodo como el promedio de los días entre la fecha de emisión y la fecha de cobro total de cada comprobante por cobrar saldado cuya fecha de cobro total esté dentro del periodo, y DEBE mostrarlo con dos decimales mediante redondeo al más cercano con empates hacia arriba (ROUND_HALF_UP), aplicado una sola vez al promedio final, desde la suma exacta de días enteros dividida entre la cantidad de comprobantes elegibles y sin redondeos intermedios (pregunta 49 / QA-10, decisión del usuario del 2026-11-09). La fecha de cobro total es la fecha de cancelación real del comprobante (RN-088): solo existe cuando todas sus cuotas tienen saldo vigente cero y es la mayor fecha de cancelación real de sus cuotas, calculada con los pagos no anulados de la lectura de RN-205 y RN-206, sin usar el orden de registro entre cuotas (QA2-08, decisión del usuario del 2026-11-07). Los comprobantes por pagar y los anulados (RN-090) no participan. El tiempo promedio de cobro no forma parte del reporte de vencimientos (RN-076).
✅ **Ejemplo:** para octubre de 2026, un comprobante emitido el 2026-10-01 y saldado con pago el 2026-10-31 tiene 30 días; otro emitido el 2026-08-17 y saldado el 2026-10-01 tiene 45 días; el tiempo promedio de cobro de octubre es 37.50. Un comprobante emitido en octubre y saldado el 2026-11-03 cuenta en noviembre, no en octubre.
❌ **Contraejemplo:** el tiempo promedio de cobro se calcula con la fecha de vencimiento 2026-10-15 en lugar de la fecha de emisión y da 14 días; filtra los comprobantes por fecha de emisión; incluye comprobantes por pagar; o se muestra como 37.5 o 38.

✅ **Casos de referencia propuestos de redondeo (QA-10; pendientes de aprobación según PRINCIPIO-007):** 92 / 3 → 30.67; 91 / 3 → 30.33; 245 / 8 = 30.625 → 30.63 (empate exacto); 75 / 2 → 37.50; 0 / 1 → 0.00. El numerador es la suma de días y el denominador la cantidad de comprobantes elegibles. Sin comprobantes: «Sin datos» (RN-147).
❌ **Contraejemplo de redondeo:** mostrar 30.66 para 92 / 3 por truncamiento, o 30.62 para 245 / 8 por redondeo al par.

El promedio DEBE asignar el mismo peso a cada comprobante, sin ponderar por importe. Su consulta, filtro o desglose por cliente o proveedor quedan fuera del alcance. Es complementario de la cartera, excluye las deudas aún pendientes y no constituye un DSO financiero ni una medida suficiente de la salud de la cartera (decisión del usuario, 2026-11-09).

**RN-147** | Categoría: UX | Prioridad: SHOULD | Fuente: Alcance funcionalidad S5; K8; decisión de la pregunta 18 (2026-11-06)
Patrón EARS: Ubiquitous
El panel de cartera DEBE mostrar el tiempo promedio de cobro (RN-053) en una tarjeta propia, separada de los cuatro indicadores de cartera (RN-046), visible para todos los roles. La tarjeta DEBE titularse «Tiempo promedio de cobro de comprobantes saldados» y ser complementaria de los indicadores de cartera existentes. La tarjeta DEBE ofrecer un selector de mes calendario, con el último mes completo seleccionado al abrir el panel según la fecha de cálculo en America/Lima (RN-198). El selector DEBE admitir los meses anteriores y el mes actual según la fecha de cálculo en America/Lima. Al seleccionar el actual, DEBE mostrar «Mes en curso — datos parciales», incluso sin datos. Los meses futuros NO DEBEN poder seleccionarse y el backend DEBE rechazarlos. Los meses anteriores sin comprobantes elegibles DEBEN poder consultarse. Los resultados DEBEN usar la lectura coherente del corte (RN-205, RN-206); los meses terminados pueden cambiar con pagos registrados posteriormente o anulaciones conforme a RN-088 (pregunta 50 / QA-11, decisión del usuario del 2026-11-09). El tiempo promedio de cobro se muestra con dos decimales y redondeo mitad hacia arriba conforme a RN-053, se expresa en días e incluye comprobantes en S/ y en US$, por lo que no depende del selector de moneda (RN-069). Si ningún comprobante por cobrar se saldó en el mes elegido, la tarjeta DEBE mostrar "Sin datos" en lugar de un valor.
✅ **Ejemplo:** con fecha de cálculo 2026-11-06, la tarjeta abre con octubre de 2026 y muestra "Tiempo promedio de cobro de comprobantes saldados: 37.50 días"; el usuario elige septiembre y ve el valor de ese mes. Con el selector de moneda en US$, el tiempo promedio de cobro de octubre sigue siendo 37.50.
❌ **Contraejemplo:** la tarjeta abre con noviembre, que está incompleto; el tiempo promedio de cobro cambia al pasar el selector de moneda de S/ a US$; o un mes sin comprobantes saldados muestra "0.00 días".

**RN-076** | Categoría: Datos | Prioridad: SHOULD | Fuente: Decisión del usuario (reporte de vencimientos); Alcance S4; Auditoría QA A-07; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
Contrato completado por Auditoría QA2-20 y decisión del usuario (2026-11-08).
El reporte en pantalla DEBE mostrar «Datos al DD/MM/AAAA, HH:mm» en America/Lima. Todas sus cuotas, grupos y totales DEBEN corresponder al mismo corte y lectura coherente de RN-205 y RN-206; cada nueva consulta DEBE actualizar los resultados y la leyenda conjuntamente.
El sistema DEBE ofrecer en pantalla un reporte de vencimientos, por tipo de movimiento (por cobrar o por pagar), calculado automáticamente con la fecha actual en America/Lima (RN-198) y con un periodo elegido por el usuario, que agrupe las cuotas en cuatro grupos que no se superponen: (1) por vencer: cuotas clasificadas por vencer según RN-075 y sin promesa activa; (2) vencidas: cuotas VENCIDAS, con la marca de reprogramación y la indicación "promesa incumplida" cuando corresponda; (3) reprogramadas con promesa activa: cuotas con promesa ACTIVA (RN-074), con su fecha original y su fecha de promesa; (4) canceladas del periodo: cuotas con saldo vigente cero cuya fecha de cancelación real (RN-088) esté dentro del periodo, incluidos ambos extremos, con su marca de reprogramación si la tienen. Una cuota reabierta por anulación deja el grupo 4 y se clasifica según su saldo y promesa vigentes (QA2-08, decisión del usuario del 2026-11-07). Los grupos 1 a 3 se evalúan a la fecha de cálculo actual y el periodo filtra solo el grupo 4; el periodo NO cambia la fecha de cálculo ni convierte el reporte en una reconstrucción histórica. Los totales de cada grupo se muestran por moneda, sin sumar S/ con US$ (RN-047).
✅ **Ejemplo:** con fecha de cálculo 2026-11-04, la cuota 1 de F001-00046 (vencimiento original 2026-11-06, promesa 2026-11-15) aparece solo en "reprogramadas con promesa activa"; la cuota 1 de F001-00040 con promesa incumplida del 2026-11-02 aparece en "vencidas".
❌ **Contraejemplo:** la cuota 1 de F001-00046 aparece a la vez en "por vencer" y en "reprogramadas", y su saldo se suma dos veces; el reporte muestra un total único de S/ + US$; o el usuario elige una fecha de cálculo pasada para reconstruir la cartera de ese día.

El reporte DEBE exigir fecha inicial y fecha final válidas, sin hora, interpretadas como fechas calendario en America/Lima. Tanto la consulta en pantalla como la exportación DEBEN rechazar fechas faltantes, inexistentes o un inicio posterior al fin, indicando el motivo y sin generar un resultado ni un archivo para ese periodo inválido. Inicio igual al fin DEBE aceptarse como un periodo de un solo día. Se admiten fechas futuras como extremos del filtro, sin cambiar la fecha de cálculo actual ni proyectar cancelaciones futuras. El filtro inclusivo se aplica exclusivamente a la fecha de cancelación real vigente de la cuota, no a su emisión, vencimiento ni a cada pago parcial.

Para cada grupo, el reporte DEBE mostrar la cantidad de cuotas y los importes separados por moneda (S/ y US$). En los grupos por vencer, vencidas y reprogramadas con promesa activa, el total monetario DEBE ser la suma de sus saldos vigentes. En canceladas del periodo, DEBE ser la suma de los importes de las cuotas seleccionadas, una sola vez por cuota, con la etiqueta «Importe de cuotas canceladas en el periodo»; NO DEBE sumar sus saldos cero ni solo los cobros o pagos realizados dentro del periodo. El reporte NO DEBE mostrar un total general que sume los saldos de los grupos 1 a 3 con los importes cancelados del grupo 4.

Pantalla y exportación DEBEN incluir ambas monedas, identificadas en cada fila, sin depender del selector de moneda del panel. Si un grupo no tiene cuotas en una moneda, DEBE mostrar cantidad 0 e importe 0.00 para esa moneda. Un periodo sin canceladas NO DEBE ocultar los grupos 1 a 3. Si no hay cuotas en ninguno de los cuatro grupos, la pantalla DEBE mostrar «Sin resultados», conservando el periodo, el sentido seleccionado, el corte y los resúmenes en cero; la exportación DEBE permitirse con sus encabezados, metadatos y resúmenes en cero, sin filas de cuotas.

El reporte DEBE tener una fila por cuota y estas columnas, en este orden: grupo; sentido (por cobrar o por pagar); nombre del contacto; número del comprobante; fecha de emisión; número de cuota; moneda; importe de la cuota; pagado acumulado (suma de pagos no anulados); saldo vigente; vencimiento original; vencimiento efectivo (RN-071); marca de reprogramación (RN-072); fecha de la promesa más reciente no reemplazada; estado de esa promesa (RN-074); estado de la cuota (PENDIENTE, VENCIDA o CANCELADA); fecha de cancelación real vigente (RN-088). Los campos sin dato aplicable DEBEN quedar vacíos; una cuota reabierta NO DEBE conservar fecha de cancelación real vigente. La marca de reprogramación y el estado de promesa DEBEN permitir identificar una promesa incumplida. Los comprobantes anulados se excluyen según RN-090. El reporte NO DEBE incluir correo, teléfono ni dirección del contacto. El historial cronológico se consulta como detalle de la cuota según RN-078 y no agrega filas al reporte tabular.

Aplicación sin S1 (QA2-33): al entregar S4 antes de S1, el grupo de reprogramadas DEBE quedar sin filas y con cantidad e importe cero por moneda; la marca de reprogramación DEBE ser falsa y los campos de fecha y estado de promesa DEBEN quedar vacíos. El vencimiento efectivo DEBE coincidir con el original vigente. Pantalla y ambas exportaciones conservan el contrato de columnas y grupos; los otros grupos y el historial siguen disponibles.

✅ **Ejemplo de total:** una cuota de S/ 1,000.00 recibe S/ 400.00 en septiembre y S/ 600.00 en octubre, quedando cancelada en octubre. En el reporte de octubre aporta una cuota y S/ 1,000.00 al importe de canceladas, con pagado acumulado S/ 1,000.00 y saldo 0.00; no aporta solo S/ 600.00. Si se anula el pago de S/ 600.00, una nueva consulta la retira de canceladas y suma su saldo de S/ 600.00 al grupo vigente que corresponda.
✅ **Ejemplo de periodo vacío:** no hay cancelaciones en octubre, pero existe una cuota vencida con saldo S/ 300.00. Canceladas muestra cantidad 0 e importe 0.00; vencidas conserva esa cuota y su saldo.
❌ **Contraejemplo:** se acepta el 31/02/2026 o un periodo invertido, se excluye una cancelación del último día, se suman pagos parciales como cuotas canceladas o se vacía toda la cartera porque no hubo cancelaciones en el periodo.

**RN-077** | Categoría: Datos | Prioridad: SHOULD | Fuente: Decisión del usuario (pantalla y exportación); Alcance S4; respuesta a la pregunta 23; Auditoría QA2-20; decisión del usuario (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE permitir al usuario con rol SUPERVISOR o ADMINISTRADOR exportar el reporte de vencimientos en CSV y en Excel (.xlsx), con una columna que indica el grupo de cada fila. Cada exportación DEBE realizar una nueva consulta de los datos vigentes con los filtros y el periodo seleccionados, según RN-205 a RN-209 y RN-076, e identificar en el archivo su propio corte mediante «Datos al DD/MM/AAAA, HH:mm» en America/Lima. Pantalla y archivo DEBEN aplicar los mismos criterios de selección, agrupación y cálculo; con los mismos datos, filtros, periodo y corte DEBEN producir las mismas cuotas, grupos, fechas y totales. Si entre la consulta de pantalla y la exportación se registran cambios que afectan el resultado, el archivo refleja los datos de su nuevo corte y la pantalla que quedó abierta conserva los de su consulta anterior, aunque ambos tengan la misma fecha de cálculo y periodo.
CSV y Excel DEBEN usar las columnas y el orden de RN-076 y conservar como metadatos las fechas inicial y final, el sentido seleccionado, la fecha de cálculo y el momento de corte en America/Lima. Ambos formatos DEBEN incluir los resúmenes de cantidad e importe por grupo y moneda, diferenciados de las filas de cuotas. Este contrato es propio del reporte de vencimientos; RN-144 a RN-146 regulan la exportación del listado de movimientos y no sustituyen estas condiciones.
Los dos formatos DEBEN cumplir RN-163 en codificación, delimitador, escape, representación de fechas e importes, tipos de celda y protección de textos. Las diferencias de representación allí previstas no cambian las cuotas, grupos ni totales del reporte.
✅ **Ejemplo:** a las 08:00 la pantalla muestra una cuota vencida con saldo S/ 500.00. A las 12:00 se registra su pago total con fecha de pago incluida en el periodo seleccionado. Al exportar a las 17:30, el archivo muestra esa cuota en canceladas del periodo, saldo cero y «Datos al 06/11/2026, 17:30»; la pantalla sin actualizar conserva el resultado y el corte de las 08:00.
❌ **Contraejemplo de corte:** el archivo incluye el pago de las 12:00 pero muestra el corte de las 08:00, o mezcla filas anteriores al pago con totales posteriores al pago.
❌ **Contraejemplo:** la exportación omite la fecha original y la fecha de promesa de las cuotas reprogramadas que sí muestra la pantalla.
❌ **Contraejemplo:** al entregar S4, el reporte no ofrece CSV o Excel al SUPERVISOR o al ADMINISTRADOR porque se interpretó la exportación como opcional.

**RN-078** | Categoría: Datos | Prioridad: SHOULD | Fuente: Decisión del usuario (movimiento de cuentas); Alcance S1, S4; Auditoría QA2-21; decisión del usuario (2026-11-08)
Patrón EARS: Ubiquitous
Al entregar S1 o S4, la que llegue primero, el sistema DEBE mostrar, para cada cuota, un historial cronológico con la emisión del comprobante, cada edición del comprobante (RN-083), cada reprogramación (fecha anterior y fecha nueva), cada pago (ordenado por su fecha de pago, RN-088) y cada anulación de pago con su importe, el paso a VENCIDA (el día siguiente a la fecha efectiva de vencimiento) el paso a CANCELADA y la reapertura de la cuota (RN-084).
Disponibilidad por entrega (QA2-33): S1 incluye esta vista aunque S4 no esté entregada; S4 la incluye aunque S1 no esté entregada. Sin S1 no se muestran eventos de reprogramación inexistentes. Los registros obligatorios de pagos, anulaciones y ediciones se conservan desde el MVP; diferir la vista no permite perder esos registros.
Contrato de fechas y transiciones (QA2-21):
1. **Orden.** El historial se ordena por la fecha del hecho (fecha de pago, vencimiento efectivo, fecha de la reprogramación o de la emisión), nunca por la fecha de registro. Cada evento registrado por un usuario (pago, anulación de pago, edición, reprogramación) DEBE mostrar además su fecha y hora de registro (RN-088), solo como dato informativo.
2. **Transiciones derivadas.** El paso a VENCIDA, a CANCELADA y la reapertura NO son eventos guardados: se calculan en cada consulta con los pagos no anulados y las reprogramaciones vigentes, según RN-084, RN-088 y la lectura coherente de RN-205 y RN-206. Tras un pago retroactivo o una anulación seguida de un reemplazo, el sistema DEBE recalcular las transiciones derivadas; una transición que una consulta anterior mostró desaparece o cambia de fecha cuando así resulta del recálculo. El sistema NO DEBE conservar ni reconstruir lo que mostró una consulta anterior.
3. **Eventos conservados.** Los eventos registrados NO DEBEN desaparecer ni reordenarse por la fecha de registro de otros. El pago anulado y su anulación permanecen en el historial, marcados como anulados, junto con el reemplazo; así la corrección es trazable aunque ya no aparezca la transición derivada.
4. **Empates.** Con la misma fecha del hecho, el orden es: emisión, edición, reprogramación, pago (por fecha y hora de registro y luego por identificador), anulación de pago, VENCIDA, CANCELADA y reapertura. El paso a VENCIDA solo aparece si, tras los pagos de ese día, la cuota conserva saldo positivo; un pago que la deja en cero el día siguiente al vencimiento efectivo la cancela sin mostrar VENCIDA.
✅ **Ejemplo:** el historial de F001-00046 cuota 1 muestra: 2026-10-20 emitida (vence 2026-11-06); 2026-11-03 reprogramada a 2026-11-15; 2026-11-16 vencida; 2026-11-18 cobro de S/ 800.00 y cancelada.
✅ **Ejemplo de pago retroactivo:** cuota de S/ 1,000.00 que vence el 2026-10-15, con un pago de S/ 400.00 de fecha 2026-10-10. El 2026-10-20 el historial muestra: emitida, pago de 400 (10/10) y VENCIDA (16/10). El 2026-10-25 se registra un pago de S/ 600.00 con fecha 2026-10-14. En la consulta del 2026-10-26 el historial muestra: emitida, pago de 400 (10/10), pago de 600 (14/10, registrado el 2026-10-25) y CANCELADA (14/10); ya no muestra VENCIDA.
✅ **Ejemplo de corrección:** se anula un pago de S/ 60.00 de fecha 2026-10-20 y se registra un pago omitido de S/ 40.00 de fecha 2026-10-10 y el reemplazo de S/ 60.00 de fecha 2026-10-20. El historial conserva el pago original con su anulación, el pago de 40, el reemplazo y CANCELADA el 2026-10-20.
✅ **Ejemplo de empate:** una cuota de S/ 100.00 vence el 2026-10-15 y recibe el 2026-10-16 un pago de S/ 100.00. El historial muestra el pago y CANCELADA el 16/10, sin VENCIDA. Si el pago del 16/10 fuera de S/ 40.00, muestra el pago y luego VENCIDA el 16/10.
❌ **Contraejemplo:** el historial muestra el pago de S/ 600.00 en el 2026-10-25 por su fecha de registro; conserva VENCIDA (16/10) en la consulta del 2026-10-26 aunque el saldo era cero desde el 14/10; o elimina el pago anulado del historial.
❌ **Contraejemplo:** el historial muestra solo el estado actual y omite la reprogramación.

---

## Indicador de comportamiento de pago

**RN-054** | Categoría: Datos | Prioridad: SHOULD | Fuente: PRINCIPIO-008
Patrón EARS: Unwanted
El sistema NO DEBE usar fuentes externas para calcular el indicador de comportamiento de pago.
✅ **Ejemplo:** el indicador del contacto 42 se calcula solo con las tablas de cuotas y pagos de VenceYa.
❌ **Contraejemplo:** el indicador del contacto 42 se ajusta con una consulta a un servicio externo de historial crediticio.

**RN-055** | Categoría: Datos | Prioridad: SHOULD | Fuente: Alcance S3; PRINCIPIO-008; decisión de las preguntas 16 y 17 (2026-11-06)
Patrón EARS: Ubiquitous
El sistema DEBE calcular el indicador de cada contacto solo con sus cuentas por cobrar, a partir de dos tipos de elementos: (1) sus últimos 12 pagos no anulados, ordenados por fecha de pago (RN-088) de la más reciente a la más antigua y, a igual fecha de pago, por orden de registro; y (2) cada una de sus cuotas VENCIDAS con saldo a la fecha de cálculo. Los días de atraso de un pago son la diferencia en días calendario entre su fecha de pago y la fecha de vencimiento original de su cuota (RN-020), o 0 si pagó en esa fecha o antes. Los días de atraso de una cuota VENCIDA con saldo son la diferencia entre la fecha de cálculo en America/Lima (RN-198) y su fecha de vencimiento original. Las reprogramaciones no reducen los días de atraso. Las cuotas de comprobantes anulados (RN-090) y las cuentas por pagar no participan.
✅ **Ejemplo:** un contacto con 15 pagos no anulados de cuentas por cobrar y 2 cuotas por cobrar VENCIDAS con saldo se calcula con 14 elementos: sus 12 pagos más recientes y las 2 cuotas. Un pago del 2026-11-20 sobre una cuota con vencimiento original 2026-11-10 y promesa al 2026-11-20 tiene 10 días de atraso.
❌ **Contraejemplo:** el contacto se calcula con sus 15 pagos; omite las cuotas VENCIDAS con saldo; incluye los pagos que la empresa le hizo como proveedor; o el pago del 2026-11-20 cuenta con 0 días de atraso porque coincidió con la fecha de promesa.

**RN-148** | Categoría: Datos | Prioridad: SHOULD | Fuente: Alcance S3; PRINCIPIO-008; decisión de las preguntas 16 y 17 (2026-11-06)
Patrón EARS: Ubiquitous
El sistema DEBE asignar a cada elemento del indicador (RN-055) un puntaje según sus días de atraso: 100 con 0 días, 75 de 1 a 7, 50 de 8 a 30, 25 de 31 a 60 y 0 con más de 60. El indicador DEBE ser el promedio simple de esos puntajes, sin ponderar por importe, redondeado al entero más cercano (las fracciones de 0.5 hacia arriba), en una escala de 0 a 100. El sistema DEBE mostrar junto al valor la etiqueta "Buen pagador" de 80 a 100, "Regular" de 50 a 79 y "Riesgoso" de 0 a 49. Si el contacto tiene menos de 3 elementos, el sistema NO DEBE mostrar un valor y DEBE mostrar "Sin historial suficiente".
✅ **Ejemplo:** 8 pagos a tiempo, 2 con 5 días de atraso y 2 con 20 días dan (800 + 150 + 100) / 12 = 87.5, que se muestra como 88, "Buen pagador". Si además tiene una cuota VENCIDA con 45 días de atraso y otra con 70 días, da 1,075 / 14 = 76.79, que se muestra como 77, "Regular".
❌ **Contraejemplo:** el indicador pondera por importe y suma pagos en S/ con pagos en US$; muestra 87.5 o 87; o muestra un valor para un contacto con 2 pagos.

**RN-056** | Categoría: Datos | Prioridad: SHOULD | Fuente: PRINCIPIO-008; PRINCIPIO-007; decisión de la pregunta 17 (2026-11-06)
Patrón EARS: Ubiquitous
El sistema DEBE devolver el mismo valor del indicador de comportamiento de pago cada vez que lo recalcula desde el mismo histórico y con la misma fecha de cálculo. La fecha de cálculo es un dato explícito del cálculo, en America/Lima (RN-198), y no la hora del servidor.
✅ **Ejemplo:** dos recálculos del contacto 42 con el mismo histórico y fecha de cálculo 2026-11-06 devuelven el mismo valor. Con fecha de cálculo 2026-11-07, el valor puede cambiar si el contacto tiene cuotas VENCIDAS con saldo.
❌ **Contraejemplo:** dos recálculos del contacto 42 con el mismo histórico y la misma fecha de cálculo devuelven valores distintos según la hora del servidor.

**RN-261** | Categoría: Seguridad | Prioridad: SHOULD | Fuente: Alcance S3; revisión QA de HUs, QA-12; decisión del usuario (2026-11-09); RN-060
Patrón EARS: Ubiquitous
Al entregar S3, el sistema DEBE permitir a los usuarios con cualquier rol (ADMINISTRADOR, SUPERVISOR y OPERADOR) consultar el indicador de comportamiento de pago (RN-148) de los contactos de su propia empresa, en el detalle del contacto y en el catálogo de contactos. El indicador NO DEBE mostrarse para contactos de otra empresa (RN-008).
✅ **Ejemplo:** un OPERADOR abre el contacto «Cliente SAC» y ve «88 · Buen pagador», igual que un SUPERVISOR.
❌ **Contraejemplo:** el OPERADOR recibe un error de permiso al ver el indicador, o un usuario consulta el indicador de un contacto de otra empresa.

---

## Permisos por rol

**RN-058** | Categoría: Seguridad | Prioridad: MUST | Fuente: Decisión del usuario sobre roles; Constitución PRINCIPIO-006
Patrón EARS: Unwanted
SI un usuario con rol OPERADOR intenta anular un pago o un comprobante, el sistema NO DEBE crear el registro de anulación.
✅ **Ejemplo:** el usuario con rol OPERADOR intenta anular el pago 1001 y recibe un error de permiso; el pago 1001 queda sin cambios.
❌ **Contraejemplo:** el usuario con rol OPERADOR anula el pago 1001 o el comprobante F001-00045, y se crea la anulación 2001.

**RN-059** | Categoría: Seguridad | Prioridad: MUST | Fuente: Decisión del usuario sobre roles; Alcance M3
Patrón EARS: Ubiquitous
El sistema DEBE permitir al usuario con rol SUPERVISOR crear un registro de anulación de un pago CONFIRMADO no anulado, sujeto a las demás validaciones de RN-029, RN-030, RN-123 y RN-124. El permiso del rol no permite volver a anular un pago ANULADO ni anular una anulación.
✅ **Ejemplo:** el usuario con rol SUPERVISOR anula el pago confirmado 1001 con el motivo "DIGITACIÓN ERRÓNEA" y se crea la anulación 2001.
❌ **Contraejemplo:** el usuario con rol SUPERVISOR recibe un error de permiso al anular un pago elegible, o crea una segunda anulación sobre el pago 1001 ya ANULADO.

**RN-060** | Categoría: Seguridad | Prioridad: MUST | Fuente: Decisión del usuario sobre roles; auditoría QA2-15; decisión del usuario (2026-11-07)
Patrón EARS: Ubiquitous
El sistema DEBE conceder los permisos de cada rol exclusivamente conforme a la siguiente matriz y dentro de su propia empresa. El ADMINISTRADOR administra las funciones de negocio autorizadas; ningún permiso permite omitir validaciones, estados, restricciones de concurrencia ni condiciones de las demás reglas. Las funcionalidades Should conservan su prioridad de entrega: figurar en esta matriz no las incorpora al MVP. Una acción sin permiso expreso NO DEBE autorizarse por una interpretación de «todas las acciones».

| Acción | OPERADOR | SUPERVISOR | ADMINISTRADOR | Condiciones y referencias |
|---|---|---|---|---|
| Crear, editar, desactivar, reactivar y eliminar contactos | Sí | Sí | Sí | Eliminación solo sin comprobantes, incluidos los anulados, y con confirmación; RN-127 a RN-130 |
| Registrar y editar comprobantes y cuotas | Sí | Sí | Sí | Validaciones de registro y cuotas; RN-081 y RN-082 |
| Registrar cobros y pagos | Sí | Sí | Sí | RN-024, RN-089, RN-092 y RN-156 |
| Registrar reprogramaciones, cuando se incorpore S1 | Sí | Sí | Sí | RN-033 a RN-036, RN-073 y RN-080 |
| Consultar el indicador de comportamiento de pago, cuando se incorpore S3 | Sí | Sí | Sí | RN-148 y RN-261 (QA-12, 2026-11-09) |
| Consultar panel, movimientos e historiales de negocio | Sí | Sí | Sí | Solo datos de su empresa; RN-043, RN-046 a RN-049 y RN-078 |
| Enviar, reenviar, reintentar y verificar avisos | Sí | Sí | Sí | RN-112, RN-138 y RN-155 a RN-159 |
| Anular pagos o comprobantes elegibles | No | Sí | Sí | RN-029 a RN-032, RN-058, RN-059, RN-061, RN-062, RN-123 y RN-124 |
| Consultar reporte de vencimientos, cuando se incorpore S4 | Sí | Sí | Sí | RN-076 y RN-079 |
| Exportar movimientos o reporte de vencimientos, cuando se incorpore S4 | No | Sí | Sí | RN-050, RN-051, RN-077 y RN-079 |
| Invitar, reenviar invitaciones, desactivar, reactivar y cambiar roles de usuarios | No | No | Sí | RN-070, RN-095, RN-098 a RN-100 y RN-161; el equipo de VenceYa da de alta al primer administrador según RN-094 y RN-095 |
| Cambiar correo administrativo, moneda por defecto de empresa y listas de copias | No | No | Sí | RN-104, RN-106 y RN-134; permisos en RN-167, RN-174 y RN-175 |
| Ver o cambiar preferencia personal de moneda | Solo propia | Solo propia | Solo propia | RN-105; permisos y restricciones en RN-169 a RN-171 |
| Cambiar ventana personal de proyección | Solo propia | Solo propia | Solo propia | RN-119; permisos y restricciones en RN-169 y RN-171 |
| Acceder o administrar claves por el rol de negocio | No | No | No | RN-230; habilitación operativa independiente |

El sistema DEBE comprobar en el servidor la sesión vigente, el rol autorizado, la empresa y, para preferencias personales, el propietario; ocultar una opción en la interfaz no sustituye esta comprobación. Un rechazo NO DEBE producir efectos de negocio. La matriz no otorga acceso a datos de otras empresas ni a procedimientos operativos internos.
✅ **Ejemplo:** un ADMINISTRADOR invita a un usuario de su empresa, anula un pago elegible y, cuando se incorpora S4, exporta un periodo válido. Cada operación cumple sus reglas.
❌ **Contraejemplo:** un ADMINISTRADOR cambia la ventana de otro usuario, accede a claves por su rol o edita un comprobante con pagos alegando tener todos los permisos.
❌ **Contraejemplo:** el usuario con rol ADMINISTRADOR recibe un error de permiso al crear un usuario de su empresa.

**RN-161** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA2-15; pregunta 40; decisión del usuario (2026-11-07)
Patrón EARS: Event-driven
CUANDO un ADMINISTRADOR guarda un cambio efectivo de rol de un usuario de su empresa, el sistema DEBE reemplazar el rol y cerrar todas las sesiones del usuario afectado, en todos sus dispositivos y pestañas, tanto al aumentar como al reducir permisos. El usuario DEBE volver a iniciar sesión para operar con el nuevo rol. Guardar el mismo rol no constituye un cambio efectivo. Esto también aplica si el administrador cambia su propio rol, siempre que quede otro ADMINISTRADOR activo (RN-100).
El cambio, la invalidación de sesiones y la auditoría DEBEN completarse como una sola operación, o no dejar ningún efecto (RN-160). La auditoría DEBE identificar al usuario que realiza el cambio, al usuario afectado, su empresa, el rol anterior, el nuevo y la fecha y hora en ISO 8601, sin registrar credenciales ni secretos de sesión.
El servidor DEBE rechazar las solicitudes de las sesiones anteriores desde que se confirma el cambio, aunque la pantalla siga abierta o la credencial de sesión no haya alcanzado su vencimiento original. Una operación que cambia registros y el cambio de rol concurrente DEBEN tener un orden consistente al guardar: si la operación se completa primero, conserva sus efectos válidos; si el cambio de rol se completa primero, la operación de la sesión anterior DEBE rechazarse sin efectos de negocio. Validar permisos solo al iniciar la petición no es suficiente.
✅ **Ejemplo:** Ana pasa de SUPERVISOR a OPERADOR. Sus sesiones anteriores en dos dispositivos quedan invalidadas; una anulación desde una pantalla abierta se rechaza sin crear registros. Tras iniciar sesión, puede registrar pagos, pero no anularlos.
✅ **Ejemplo:** Luis pasa de OPERADOR a SUPERVISOR. Sus sesiones anteriores también se cierran; solo tras iniciar sesión de nuevo puede anular un pago elegible.
✅ **Ejemplo de concurrencia:** si una anulación se guarda antes del cambio de rol, se conserva; si el cambio se guarda primero, la anulación pendiente de la sesión anterior se rechaza sin efectos parciales.
❌ **Contraejemplo:** una sesión conserva permiso de anulación hasta que vence su credencial o se recarga la pantalla.
❌ **Contraejemplo:** se cambia el rol, pero falla el cierre de sesiones o la auditoría y el cambio queda guardado de todas formas.

**RN-079** | Categoría: Seguridad | Prioridad: MUST | Fuente: Respuesta a la pregunta 23 (aclarada); Constitución PRINCIPIO-006; Auditoría QA A-12; decisión del usuario (2026-11-06)
Patrón EARS: Unwanted
SI un usuario con rol OPERADOR intenta exportar movimientos (RN-050, RN-051) o el reporte de vencimientos (RN-077), el sistema NO DEBE generar el archivo. Cuando se incorpore S4, el sistema DEBE permitir al OPERADOR consultar el reporte de vencimientos en pantalla (RN-076), conforme a RN-060; este permiso no incorpora S4 al MVP.
✅ **Ejemplo:** el usuario con rol OPERADOR abre el reporte de vencimientos en pantalla, intenta exportarlo a .xlsx y recibe un error de permiso; no se genera ningún archivo.
❌ **Contraejemplo:** el usuario con rol OPERADOR descarga el reporte de vencimientos en .csv; o el OPERADOR recibe un error de permiso al abrir el reporte en pantalla.

---

## Edición de comprobantes

**RN-081** | Categoría: Registro | Prioridad: MUST | Fuente: Decisión del usuario (modelo mixto de corrección, 2026-11-05); Alcance M1, M2
Patrón EARS: Event-driven
CUANDO un usuario edita un comprobante no anulado y sin pagos ni reprogramaciones registrados, el sistema DEBE permitir cambiar el contacto, el número de documento, la moneda, la fecha de emisión, el total y las cuotas, y DEBE aplicar las mismas validaciones que al registrarlo (RN-002, RN-003, RN-016, RN-019, RN-020, RN-130, RN-131, RN-132, RN-133, RN-153, RN-154, RN-162). El sistema DEBE permitir esta edición a cualquier rol de la empresa, sujeto a RN-060 y a las validaciones anteriores.
✅ **Ejemplo:** un usuario con rol OPERADOR corrige el número F001-00054 a F001-00045 en un comprobante sin pagos y el cambio se guarda.
❌ **Contraejemplo:** un usuario edita el total de F001-00045 de S/ 1,000.00 a S/ 1,200.00 y las cuotas siguen sumando S/ 1,000.00.
❌ **Contraejemplo:** F001-00045 está anulado y no tiene pagos ni reprogramaciones; un usuario cambia su número o su total (RN-091).

**RN-082** | Categoría: Registro | Prioridad: MUST | Fuente: Decisión del usuario (modelo mixto de corrección, 2026-11-05); PRINCIPIO-006
Patrón EARS: Unwanted
SI un comprobante está anulado (RN-091) o tiene al menos un pago o una reprogramación registrados, incluidos los pagos anulados, el sistema NO DEBE permitir editarlo. Con S1 entregada, las fechas se corrigen mediante una reprogramación válida. Sin S1, la corrección de fechas requiere anular los pagos vigentes (RN-029), anular el comprobante elegible (RN-061) y registrarlo de nuevo (RN-003), conservando el original y su auditoría. Ese procedimiento también se aplica para corregir cualquier otro dato. Anular los pagos no habilita la edición directa.
✅ **Ejemplo:** F001-00045 con el pago 1001 registrado: el intento de editar su total es rechazado.
❌ **Contraejemplo:** F001-00045 con la cuota 1 reprogramada cambia su moneda de S/ a US$ por edición directa.
✅ **Ejemplo de concurrencia:** Ana edita F001-00045 mientras Luis registra un pago en su cuota 1. Si el pago se guarda primero, la edición se rechaza y no deja ningún registro de edición (RN-083). Si la edición se guarda primero, el pago se rechaza por datos desactualizados (RN-160) y Luis ve las cuotas vigentes. Lo mismo vale para una reprogramación en lugar del pago.
❌ **Contraejemplo:** se guardan la edición y el pago, y el pago queda aplicado a una cuota cuyo importe o fecha cambió sin que Luis lo viera.

**RN-083** | Categoría: Datos | Prioridad: MUST | Fuente: Decisión del usuario (modelo mixto de corrección, 2026-11-05); PRINCIPIO-006
Patrón EARS: Event-driven
CUANDO un usuario edita un comprobante, el sistema DEBE guardar, por cada campo cambiado, el valor anterior, el valor nuevo, el identificador del usuario y la fecha y hora de la edición en formato ISO 8601.
✅ **Ejemplo:** la edición de F001-00054 a F001-00045 guarda valor_anterior = "F001-00054", valor_nuevo = "F001-00045", usuario_id = 7 y "2026-11-05T09:30:00-05:00".
❌ **Contraejemplo:** el número del comprobante cambia y no queda registro del valor anterior ni de quién lo cambió.

---

## Anulación de comprobantes

**RN-061** | Categoría: Seguridad | Prioridad: MUST | Fuente: Decisión del usuario sobre anulación de comprobantes; PRINCIPIO-006
Patrón EARS: Event-driven
CUANDO un usuario con rol SUPERVISOR o ADMINISTRADOR anula un comprobante no anulado, el sistema DEBE crear un registro de anulación que referencia el comprobante original, guarda el motivo, el usuario y la fecha, y NO DEBE modificar ni borrar el comprobante. Un comprobante tiene como máximo una anulación: si ya está anulado, el sistema DEBE rechazar una nueva solicitud sin crear otro registro (RN-091). No borrar el comprobante rige mientras el contrato esté vigente; excepción: baja contractual (RN-152).
✅ **Ejemplo:** el usuario con rol SUPERVISOR anula F001-00045 con el motivo "IMPORTE DE CUOTA ERRADO"; el comprobante se conserva y queda la anulación con usuario_id y fecha.
❌ **Contraejemplo:** el usuario con rol OPERADOR anula F001-00045 y se crea la anulación.
❌ **Contraejemplo:** un SUPERVISOR anula F001-00045, que ya está anulado, y se crea una segunda anulación con otro motivo.
✅ **Ejemplo de concurrencia:** dos SUPERVISORES anulan F001-00045 al mismo tiempo. Se crea una sola anulación y la otra solicitud se rechaza porque el comprobante ya está anulado, sin dejar registros parciales (RN-160).

**RN-062** | Categoría: Pagos | Prioridad: MUST | Fuente: Decisión del usuario sobre anulación de comprobantes; PRINCIPIO-006; Auditoría QA2-28; decisión del usuario (2026-11-08)
Patrón EARS: Unwanted
El sistema solo DEBE permitir anular un comprobante no anulado cuando ninguna de sus cuotas tenga pagos vigentes, parciales o totales: no tiene pagos registrados o todos sus pagos registrados están ANULADOS. Puede tener cuotas PENDIENTES o VENCIDAS; que haya pasado el vencimiento no impide la anulación. La condición DEBE verificarse al guardar (RN-160). Al anularlo, todas sus cuotas quedan ANULADAS por consecuencia del comprobante (RN-090).
✅ **Ejemplo:** F001-00045 sin pagos registrados se puede anular.
✅ **Ejemplo:** F001-00045 tiene una cuota PENDIENTE y otra VENCIDA, ambas sin pagos; puede anularse y ambas quedan ANULADAS.
❌ **Contraejemplo:** se anula F001-00045 cuando alguna de sus cuotas tiene un pago parcial vigente o está CANCELADA por pago total vigente.
✅ **Ejemplo:** F001-00045 tuvo los pagos 1001 y 1002, ambos ANULADOS; el comprobante se puede anular.
❌ **Contraejemplo:** F001-00045 se anula con el pago 1001 CONFIRMADO y no anulado.
❌ **Contraejemplo:** F001-00045 tiene el pago 1001 ANULADO y el pago 1002 CONFIRMADO; el comprobante se anula sin anular primero el pago 1002.
✅ **Ejemplo de concurrencia:** un SUPERVISOR anula F001-00045 mientras Luis registra un pago en la cuota 1. Si el pago se guarda primero, la anulación se rechaza porque hay un pago vigente; si la anulación se guarda primero, el pago se rechaza (RN-091). La condición se evalúa al guardar (RN-160).
❌ **Contraejemplo:** ambas operaciones se guardan y F001-00045 queda anulado con el pago 1003 CONFIRMADO.

**RN-090** | Categoría: Crédito | Prioridad: MUST | Fuente: Auditoría QA C-03; decisión del usuario (2026-11-05); Auditoría QA2-28; decisión del usuario (2026-11-08)
Patrón EARS: State-driven
MIENTRAS un comprobante esté anulado, todas sus cuotas DEBEN quedar ANULADAS por consecuencia del comprobante, sin estado de pago vigente. ANULADA es una condición heredada, no un cuarto estado de pago ni una operación independiente por cuota. El sistema NO DEBE borrar las cuotas, registrar pagos ni poner artificialmente su saldo a cero por esa anulación; sus datos y el cálculo de RN-025 se conservan para consulta e historial, sin representar obligaciones vigentes.
El sistema DEBE excluir esas cuotas de los cálculos de cartera y del gráfico (RN-046 a RN-048, RN-069), la lista de cuotas por avisar (RN-112), la clasificación "por vencer" y el reporte de vencimientos y su exportación (RN-075 a RN-077), el tiempo promedio de cobro (RN-053) y el indicador de comportamiento (RN-055). El listado de movimientos y su exportación DEBEN excluirlas por defecto y solo mostrarlas cuando el usuario solicite incluir comprobantes anulados (RN-049, RN-145, RN-146, RN-184, RN-185); esa inclusión NO cambia las exclusiones de cálculo ni habilita operaciones. Sus promesas de pago no se muestran como activas. El historial (RN-078) y los avisos ya enviados se conservan y pueden consultarse con los permisos vigentes.
✅ **Ejemplo:** F001-00045 se anula con una cuota de S/ 500.00 que vencía el 2026-11-10. La cartera vencida y el visor de 7 días no suman esos S/ 500.00 y la cuota no aparece en la lista de cuotas por avisar el 2026-11-07.
✅ **Ejemplo:** F001-00045 tenía una promesa ACTIVA al 2026-11-20. Tras la anulación no aparece entre las promesas activas, pero sí en el historial.
❌ **Contraejemplo:** F001-00045 está anulado y su cuota 2 sigue sumando en "Vencida por cobrar".
❌ **Contraejemplo:** F001-00045 está anulado y sus cuotas siguen apareciendo en la lista de cuotas por avisar.

**RN-091** | Categoría: Crédito | Prioridad: MUST | Fuente: Auditoría QA C-03; decisión del usuario (2026-11-05); Auditoría QA2-28; decisión del usuario (2026-11-08)
Patrón EARS: Unwanted
SI un comprobante está anulado, el sistema NO DEBE permitir registrar pagos ni reprogramaciones sobre sus cuotas, editarlo (RN-081, RN-082), anularlo de nuevo (RN-061, RN-062) ni revertir la anulación. La anulación es el estado terminal del comprobante: este y todas sus cuotas ANULADAS quedan de solo lectura. Las cuotas heredan la anulación del comprobante; el sistema NO DEBE ofrecer una operación independiente para anular o reactivar una cuota. Para corregirlo, el usuario registra de nuevo el comprobante con el mismo número de documento (RN-003).
✅ **Ejemplo:** F001-00045 anulado se vuelve a registrar como un comprobante nuevo con el número F001-00045.
❌ **Contraejemplo:** se registra un pago de S/ 100.00 sobre la cuota 1 de F001-00045 anulado.
❌ **Contraejemplo:** un SUPERVISOR revierte la anulación de F001-00045 para recuperar el comprobante original.
❌ **Contraejemplo:** un usuario edita el total de F001-00045 anulado, o un SUPERVISOR lo anula por segunda vez.
✅ **Ejemplo de concurrencia:** Ana edita F001-00045 mientras un SUPERVISOR lo anula. Si la anulación se guarda primero, la edición se rechaza por datos desactualizados (RN-160) y no deja registro de edición (RN-083); si la edición se guarda primero, la anulación procede sobre los datos editados.
✅ **Ejemplo de concurrencia:** Luis reprograma la cuota 2 de F001-00045 mientras un SUPERVISOR anula el comprobante. Si la anulación se guarda primero, la reprogramación se rechaza; si la reprogramación se guarda primero, la anulación procede según RN-062 y la promesa deja de mostrarse activa (RN-090). Nunca queda una promesa ACTIVA en un comprobante anulado (RN-160).

---

## Alta y ciclo de vida de usuarios

**RN-094** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA C-07; Alcance M6; decisión del usuario (2026-11-05); decisión QA-06 de la revisión QA de HUs (2026-11-09)
Patrón EARS: Event-driven
CUANDO el equipo de VenceYa registra una empresa con razón social, RUC, correo administrativo y correo del primer administrador, el sistema DEBE crear la empresa junto con ese usuario en rol ADMINISTRADOR y estado INVITADO. La razón social se valida y normaliza según RN-162.
✅ **Ejemplo:** Se registra Empresa 1 SAC, RUC 20601234567, correo oficina@empresa1.example y primer administrador admin@empresa1.example; el usuario queda INVITADO con rol ADMINISTRADOR.
❌ **Contraejemplo:** La empresa se registra con un primer usuario OPERADOR o ACTIVO sin definir contraseña.

**RN-211** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA C-07; Alcance M6; decisión del usuario (2026-11-05); RN-094 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Unwanted
SI falla la creación de la empresa o de su primer administrador de RN-094, el sistema NO DEBE persistir ninguno de los dos.
✅ **Ejemplo:** Falla el alta del administrador admin@empresa1.example y no queda creada Empresa 1 SAC ni su usuario.
❌ **Contraejemplo:** Falla el alta del administrador, pero Empresa 1 SAC queda persistida.

**Contexto de RN-094:** empresa y primer administrador forman una única unidad de alta; RN-211 especifica su garantía ante fallos, sin permitir altas parciales.

**RN-095** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA C-07; decisión del usuario (2026-11-05)
Patrón EARS: Unwanted
El sistema NO DEBE ofrecer el registro abierto de empresas. El sistema DEBE reservar la creación de una empresa y su primer administrador al equipo de VenceYa, mediante un procedimiento interno que no forma parte de las pantallas de los roles de la empresa. Ese mismo procedimiento DEBE permitir al equipo reenviar la invitación del primer administrador únicamente mientras este siga INVITADO y la empresa no tenga ningún ADMINISTRADOR ACTIVO (RN-098). El reenvío NO DEBE reactivar usuarios DESACTIVADOS. Si existe un ADMINISTRADOR ACTIVO, la gestión de invitaciones y reactivaciones corresponde a los administradores de la empresa (RN-098, RN-099). Si el primer administrador está DESACTIVADO y no existe ningún ADMINISTRADOR ACTIVO, el procedimiento DEBE rechazar el reenvío sin cambiar el estado ni emitir un enlace; el caso se trata como una incidencia para revisión interna, sin reactivación automática. Ese estado no debe producirse mediante los flujos normales: la desactivación requiere un administrador activo y RN-100 protege al último administrador activo (decisión del usuario, 2026-11-09, QA-07).
✅ **Ejemplo:** la pantalla de inicio de sesión no tiene ningún enlace "Crear mi empresa".
❌ **Contraejemplo:** una persona sin invitación crea la empresa "Empresa Falsa SAC" desde la web pública.

**RN-096** | Categoría: Datos | Prioridad: MUST | Fuente: Auditoría QA C-07; decisión del usuario (2026-11-05); RN-005
Patrón EARS: Unwanted
SI el RUC de una empresa no tiene exactamente 11 dígitos, o ya pertenece a otra empresa, el sistema NO DEBE crearla. El sistema NO DEBE consultar el RUC en SUNAT (RN-005). La comprobación de unicidad global DEBE comparar exactamente los 11 dígitos mediante referencias protegidas (RN-140, RN-217, RN-220 y RN-222), sin guardar una copia en texto plano ni convertir el RUC a número.
✅ **Ejemplo:** el RUC 20601234567 se acepta para "Empresa 1 SAC".
❌ **Contraejemplo:** se crea una segunda empresa con el RUC 20601234567.
❌ **Contraejemplo:** se crea una empresa con el RUC "2060123".

**RN-097** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA C-07; decisión del usuario (2026-11-05); RN-009
Patrón EARS: Unwanted
SI el correo de un usuario ya pertenece a otro usuario de cualquier empresa, el sistema NO DEBE crear el usuario. Cada correo pertenece a un solo usuario y a una sola empresa. La comparación DEBE usar la normalización de RN-139 y referencias protegidas (RN-140), incluidos los usuarios INVITADOS y DESACTIVADOS; cualquier cambio de correo permitido DEBE respetar la misma unicidad.
✅ **Ejemplo:** "ana@empresa1.example" se crea una sola vez.
❌ **Contraejemplo:** "ana@empresa1.example" se crea también como usuario de la empresa 2.

**RN-098** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA C-07; RN-070; decisión del usuario (2026-11-05); Auditoría QA2-13 y QA2-14; decisión del usuario (2026-11-07); revisión QA de HUs, QA-01; decisión del usuario (2026-11-09)
Patrón EARS: Event-driven
CUANDO se crea un usuario, sea el primer administrador (RN-094) o un usuario creado por un ADMINISTRADOR (RN-070), el sistema DEBE dejarlo en estado INVITADO y enviarle un correo con un enlace válido por 72 horas. CUANDO el usuario abre el enlace y define su contraseña, el sistema DEBE pasarlo a estado ACTIVO. El administrador NO DEBE conocer la contraseña.

Un usuario INVITADO tiene como máximo un enlace de invitación vigente. El enlace es de un solo uso: una vez usado, vencido o revocado, el sistema DEBE rechazarlo. Al canjearlo, el sistema DEBE comprobar en ese momento que el usuario sigue en estado INVITADO y que el enlace es el vigente; si no, DEBE rechazarlo sin cambiar nada (RN-160).

El plazo de 72 horas se mide con el reloj del servidor desde el instante en que se emite el enlace, es decir, cuando se genera y registra, no cuando llega el correo. El límite es exclusivo: el enlace es válido mientras no se hayan cumplido 72:00:00 desde su emisión y está vencido desde ese instante exacto, con el mismo criterio que RN-103 y RN-149. La vigencia DEBE comprobarse al canjear el enlace, cuando el servidor recibe la contraseña definida, y no solo al abrirlo; no se aplica margen de tolerancia de reloj (decisión del usuario, 2026-11-09, QA-01).

MIENTRAS el usuario esté en estado INVITADO, haya vencido o no su enlace, o no le haya llegado el correo, el sistema DEBE permitir a un ADMINISTRADOR de su empresa reenviar la invitación. Al reenviarla, el sistema DEBE generar un enlace nuevo de 72 horas y revocar el anterior en la misma operación. CUANDO el primer administrador sigue INVITADO y la empresa no tiene ningún ADMINISTRADOR ACTIVO, el reenvío DEBE hacerlo el equipo de VenceYa mediante el procedimiento interno de RN-095, con el mismo efecto sobre el enlace anterior. Ambas condiciones son obligatorias y se comprueban al ejecutar el reenvío (RN-160). Si existe un ADMINISTRADOR ACTIVO, el reenvío corresponde a un administrador de la empresa. El reenvío NO DEBE proceder para usuarios ACTIVOS o DESACTIVADOS; la reactivación es una operación distinta, reservada a un ADMINISTRADOR ACTIVO de la empresa según RN-099 (decisión del usuario, 2026-11-09, QA-07). El sistema DEBE auditar cada reenvío con quién lo hizo, a qué usuario, y la fecha y hora en formato ISO 8601. El sistema NO DEBE revelar ni registrar el enlace en la auditoría.

SI falla el envío del correo de invitación, o su resultado no se puede confirmar, al crear un usuario (RN-070) o a la empresa con su primer administrador (RN-094), el sistema NO DEBE revertir la creación ni aplicar RN-211 a ese fallo. El usuario DEBE quedar INVITADO con su enlace vigente, y la pantalla DEBE informar que el correo no se envió o no se pudo confirmar y que la invitación puede reenviarse. El reenvío es solo manual: el sistema NO DEBE reintentar automáticamente. El reenvío sigue las reglas de este artículo (enlace nuevo de 72 horas y revocación del anterior) y, para el primer administrador, el procedimiento interno de RN-095. El sistema DEBE auditar el intento fallido o no confirmado sin registrar el enlace (decisión del usuario, 2026-11-09, QA-08).

CUANDO se desactiva a un usuario INVITADO (RN-099), el sistema DEBE revocar su enlace vigente. CUANDO se reactiva a un usuario que nunca definió una contraseña, el sistema DEBE dejarlo en estado INVITADO y enviarle un enlace nuevo de 72 horas; el usuario NO DEBE quedar ACTIVO sin contraseña. Un usuario que ya definió una contraseña vuelve a ACTIVO con ella.
✅ **Ejemplo:** el administrador crea a "luis@empresa1.example" con rol OPERADOR; Luis recibe el enlace, define su contraseña dentro de 72 horas y queda ACTIVO.
✅ **Ejemplo de límite:** el enlace de Luis se emite el día 1 a las 10:00:00; si define su contraseña el día 4 a las 09:59:59 (71:59:59), queda ACTIVO; si la envía el día 4 a las 10:00:00 (72:00:00 exactas), el sistema la rechaza por enlace vencido y Luis permanece INVITADO.
❌ **Contraejemplo:** Luis abre el enlace a las 71:59, envía su contraseña a las 72:01 y el sistema la acepta porque la vigencia solo se comprobó al abrirlo.
✅ **Ejemplo:** el enlace de Luis venció o nunca llegó; el administrador lo reenvía y el enlace anterior deja de funcionar.
✅ **Ejemplo:** el correo del primer administrador "admin@empresa1.example" no llegó y la empresa no tiene administradores activos; el equipo de VenceYa reenvía la invitación con su procedimiento interno, el enlace anterior queda revocado y el reenvío queda auditado.
✅ **Ejemplo:** Luis, INVITADO, es desactivado y luego reactivado por el administrador; el enlace viejo ya no sirve, Luis vuelve a INVITADO y recibe un enlace nuevo.
✅ **Ejemplo de concurrencia:** Luis abre el enlace mientras el administrador lo desactiva, o mientras lo reenvía. Se guarda solo la primera operación; si el administrador gana, Luis ve un rechazo y no queda ACTIVO (RN-160).
✅ **Ejemplo:** Resend rechaza el correo de invitación de Luis al crearlo; Luis queda INVITADO, Ana ve «Usuario creado, correo no enviado» con la acción Reenviar y, al usarla, se emite un enlace nuevo y se revoca el anterior.
❌ **Contraejemplo:** falla el envío del correo y el sistema elimina a Luis, o lo reintenta automáticamente sin acción del administrador.
❌ **Contraejemplo:** el administrador escribe la contraseña de Luis al crearlo.
❌ **Contraejemplo:** Luis define su contraseña con un enlace de hace cuatro días.
❌ **Contraejemplo:** Luis usa el mismo enlace dos veces, o usa el enlace anterior después de un reenvío.
❌ **Contraejemplo:** Luis define su contraseña con un enlace emitido antes de que lo desactivaran y pasa a ACTIVO.
❌ **Contraejemplo:** el administrador reactiva a un usuario que nunca definió contraseña y queda ACTIVO sin ella.

**RN-099** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA C-07; PRINCIPIO-006; decisión del usuario (2026-11-05)
Patrón EARS: Event-driven
CUANDO un ADMINISTRADOR desactiva a un usuario, el sistema DEBE pasarlo a estado DESACTIVADO, cerrar sus sesiones abiertas y conservar todo su historial (pagos, anulaciones y ediciones) con su identidad. El sistema NO DEBE eliminar usuarios, salvo en la baja contractual de su empresa (RN-152). El sistema DEBE permitir al ADMINISTRADOR reactivar a un usuario DESACTIVADO de su empresa; el estado resultante y el tratamiento del enlace de invitación siguen RN-098.
✅ **Ejemplo:** el administrador desactiva a "luis@empresa1.example"; Luis pierde su sesión y los pagos que registró siguen mostrando su nombre.
❌ **Contraejemplo:** el sistema elimina a Luis y sus pagos quedan sin usuario.

**RN-100** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA C-07; decisión del usuario (2026-11-05); Auditoría QA A-17; decisión del usuario (2026-11-06)
Patrón EARS: Unwanted
El sistema DEBE admitir varios usuarios con rol ADMINISTRADOR en una empresa. El sistema DEBE permitir a un ADMINISTRADOR crear otros administradores (RN-070) o asignar ese rol a un usuario existente de su empresa, sujeto a RN-060, RN-100 y RN-161. SI una empresa tiene un solo ADMINISTRADOR activo, el sistema NO DEBE permitir desactivarlo ni cambiarle el rol. El sistema DEBE permitir a un administrador desactivarse o cambiarse de rol únicamente si queda otro ADMINISTRADOR activo de la empresa, sujeto a RN-060, RN-099 y RN-161. Todo cambio efectivo de rol cierra las sesiones del afectado y queda auditado según RN-161.
✅ **Ejemplo:** la empresa tiene dos administradores activos; uno pasa a SUPERVISOR y queda uno.
❌ **Contraejemplo:** el único administrador activo cambia su rol a OPERADOR y la empresa queda sin administrador.
✅ **Ejemplo de concurrencia:** la empresa tiene dos administradores activos y cada uno desactiva al otro al mismo tiempo, o cada uno se quita el rol. Se guarda la primera operación; la segunda se rechaza porque dejaría a la empresa sin administrador activo (RN-160).
❌ **Contraejemplo:** las dos operaciones se guardan porque cada una vio a otro administrador activo al empezar, y la empresa queda sin administrador.

**RN-101** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA C-07; decisión del usuario (2026-11-05)
Patrón EARS: State-driven
MIENTRAS un usuario esté en estado ACTIVO, el sistema DEBE permitirle iniciar sesión con su correo y su contraseña. El sistema NO DEBE permitir iniciar sesión a un usuario INVITADO o DESACTIVADO. DEBE localizar la cuenta por coincidencia exacta del correo normalizado (RN-139, RN-140) y verificar la contraseña según RN-243. NO DEBE solicitar RUC ni selección de empresa para iniciar sesión: la empresa se obtiene de la cuenta autenticada. El correo almacenado permanece cifrado.
✅ **Ejemplo:** "ana@empresa1.example" ACTIVO inicia sesión con su contraseña.
En la modalidad en la nube, esta autorización está sujeta además a RN-152: desde la terminación contractual efectiva, el sistema NO DEBE permitir iniciar sesión a ningún usuario de esa empresa, aunque esté ACTIVO (QA2-29, 2026-11-08).
❌ **Contraejemplo:** un usuario DESACTIVADO inicia sesión con una contraseña correcta.

**RN-102** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA C-07; decisión del usuario (2026-11-05); revisión QA de HUs, QA-01; decisión del usuario (2026-11-09)
Patrón EARS: Event-driven
CUANDO un usuario ACTIVO solicita recuperar su contraseña, el sistema DEBE enviarle un enlace de un solo uso, válido por 1 hora. CUANDO el usuario define la nueva contraseña con ese enlace, el sistema DEBE validarla según RN-246 a RN-251 y cerrar sus sesiones abiertas. El sistema DEBE comprobar al canjear el enlace que el usuario sigue ACTIVO; si lo desactivaron, DEBE rechazarlo. El plazo de 1 hora se mide con el reloj del servidor desde la emisión del enlace (cuando se genera y registra) y el límite es exclusivo: el enlace es válido mientras no se hayan cumplido 60:00 minutos y está vencido desde ese instante exacto, con el mismo criterio que RN-098, RN-103 y RN-149. La vigencia DEBE comprobarse al canjear el enlace, cuando el servidor recibe la nueva contraseña, y no solo al abrirlo; no se aplica margen de tolerancia de reloj (decisión del usuario, 2026-11-09, QA-01).
✅ **Ejemplo:** Ana usa el enlace a los 20 minutos, define la nueva contraseña y sus sesiones anteriores se cierran.
✅ **Ejemplo de límite:** el enlace de Ana se emite a las 08:00:00; si envía la nueva contraseña a las 08:59:59, se acepta; si la envía a las 09:00:00 exactas, se rechaza por enlace vencido y su contraseña anterior no cambia.
❌ **Contraejemplo:** Ana usa el mismo enlace dos veces, o lo usa a las 2 horas.

**RN-258** | Categoría: Seguridad | Prioridad: MUST | Fuente: revisión QA de HUs, QA-02; decisión del usuario (2026-11-09); RN-102; RN-103
Patrón EARS: Event-driven
CUANDO se solicita recuperar una contraseña, el sistema DEBE responder siempre con el mismo código HTTP, el mismo cuerpo y el mensaje «Si el correo pertenece a una cuenta activa, recibirás un enlace para restablecer tu contraseña», exista o no la cuenta y sea cual sea su estado o bloqueo. El sistema DEBE enviar el enlace de RN-102 solo a un usuario ACTIVO; NO DEBE enviar ningún correo si el correo no pertenece a un usuario, o si el usuario está INVITADO o DESACTIVADO. La cuenta se localiza con la normalización de RN-139 y las referencias protegidas de RN-140.
✅ **Ejemplo:** «ana@empresa1.example» (ACTIVO) y «nadie@empresa1.example» (inexistente) reciben la misma respuesta; solo Ana recibe el correo con el enlace.
✅ **Ejemplo:** «luis@empresa1.example» (INVITADO) recibe la misma respuesta y ningún correo; debe usar su invitación (RN-098).
❌ **Contraejemplo:** la pantalla responde «Este correo no está registrado», o el API responde 404 para un correo inexistente y 200 para uno existente.

**RN-259** | Categoría: Seguridad | Prioridad: MUST | Fuente: revisión QA de HUs, QA-02; decisión del usuario (2026-11-09); RN-102
Patrón EARS: Event-driven
CUANDO el sistema emite un nuevo enlace de recuperación para un usuario, DEBE revocar en la misma operación el enlace de recuperación vigente anterior de ese usuario. Un usuario tiene como máximo un enlace de recuperación vigente.
✅ **Ejemplo:** Ana solicita la recuperación a las 10:00 y otra vez a las 10:20; el enlace de las 10:00 se rechaza y el de las 10:20 es válido hasta las 11:20.
❌ **Contraejemplo:** Ana puede usar indistintamente los enlaces de las 10:00 y de las 10:20.

**RN-260** | Categoría: Seguridad | Prioridad: MUST | Fuente: revisión QA de HUs, QA-02; decisión del usuario (2026-11-09); RN-102; RN-258
Patrón EARS: Unwanted
SI un usuario ACTIVO ya recibió 3 enlaces de recuperación en los últimos 60 minutos, medidos con el reloj del servidor, el sistema NO DEBE emitir ni enviar otro enlace hasta que se cumplan 60 minutos desde el más antiguo de esos 3. La respuesta DEBE ser la misma de RN-258. Una solicitud rechazada por este límite NO DEBE revocar el enlace vigente ni contarse como un envío.
✅ **Ejemplo:** Ana recibe enlaces a las 10:00, 10:10 y 10:20; a las 10:30 recibe la misma respuesta, ningún correo, y el enlace de las 10:20 sigue vigente; a las 11:00:00 una nueva solicitud sí envía un enlace.
❌ **Contraejemplo:** a las 10:30 se envía un cuarto enlace, o la solicitud de las 10:30 revoca el enlace de las 10:20.

**RN-103** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA C-07; decisión del usuario (2026-11-05); decisión de la pregunta 21 (2026-11-06)
Patrón EARS: Unwanted
SI una cuenta acumula 5 inicios de sesión fallidos consecutivos, el sistema NO DEBE permitirle iniciar sesión durante un periodo de bloqueo de 15 minutos fijos, medido con el reloj del servidor desde el quinto fallo. Los fallos se cuentan por cuenta. Durante el bloqueo, todo intento (incluso con la contraseña correcta) DEBE rechazarse, NO DEBE contarse como fallo y NO DEBE prolongar ni reiniciar el periodo. A los 15 minutos exactos la cuenta DEBE desbloquearse sola y el contador de fallos DEBE volver a cero; el siguiente fallo es el primero de una nueva serie. Un inicio de sesión correcto DEBE reiniciar el contador de fallos. Definir una nueva contraseña mediante recuperación (RN-102) DEBE desbloquear la cuenta y reiniciar el contador. La duración del periodo es un parámetro de configuración de la instalación que administra solo el personal operativo; los roles ADMINISTRADOR, SUPERVISOR y OPERADOR NO DEBEN poder cambiarlo. La respuesta a un intento fallido, a una cuenta bloqueada y a un correo inexistente NO DEBE revelar si la cuenta existe ni si está bloqueada.
✅ **Ejemplo:** tras 5 contraseñas incorrectas seguidas, el sexto intento se rechaza aunque la contraseña sea correcta; 15 minutos después, Ana inicia sesión con su contraseña correcta.
✅ **Ejemplo:** Ana falla 4 veces, acierta en el quinto intento y su contador vuelve a cero.
✅ **Ejemplo:** el quinto fallo ocurre a las 10:00:00; un intento a las 10:14:59 se rechaza sin contarse ni extender el bloqueo; a las 10:15:00 Ana puede intentar y, si falla, es su primer fallo de la nueva serie.
❌ **Contraejemplo:** un tercero repite intentos durante el bloqueo y mantiene a Ana bloqueada más de 15 minutos; o el sexto fallo, tras terminar el bloqueo, la bloquea de nuevo de inmediato.
❌ **Contraejemplo:** el sistema permite 50 intentos consecutivos sin bloqueo, o un ADMINISTRADOR de la empresa reduce el periodo de bloqueo a cero.
❌ **Contraejemplo:** con un correo inexistente el sistema responde "La cuenta no existe" y con uno registrado "Contraseña incorrecta".

**RN-149** | Categoría: Seguridad | Prioridad: MUST | Fuente: decisión de la pregunta 27 (2026-11-06); RN-101; RN-102
Patrón EARS: State-driven
MIENTRAS una sesión esté abierta, el sistema DEBE cerrarla tras 30 minutos sin actividad del usuario y, en cualquier caso, a las 12 horas de haberse iniciado, aunque haya actividad. Ambos plazos se miden con el reloj del servidor: la sesión está cerrada desde el instante en que se cumplen 30:00 sin actividad o 12:00:00 desde el inicio, y el plazo de 12 horas NO se renueva. Cada inicio de sesión crea una sesión independiente con su propio contador. Es actividad del usuario únicamente una acción iniciada por el usuario (navegar, consultar, guardar, registrar) que el servidor recibe con sesión vigente; la actividad en cualquier pestaña de esa sesión la renueva. NO es actividad las peticiones automáticas (sondeos, refrescos o actualizaciones periódicas) ni las peticiones rechazadas por sesión vencida. Una petición que llega con la sesión ya cerrada DEBE rechazarse sin efectos de negocio. Tras el cierre, el usuario DEBE volver a iniciar sesión (RN-101). Estos plazos se suman a los cierres ya definidos al recuperar la contraseña (RN-102), al desactivar al usuario (RN-099) y al guardar un cambio efectivo de rol (RN-161); no los reemplazan.
✅ **Ejemplo:** Ana inicia sesión a las 08:00, trabaja hasta las 10:00 y no usa el sistema hasta las 10:40; su sesión se cerró a las 10:30 y debe volver a iniciarla.
✅ **Ejemplo:** Luis inicia sesión a las 08:00 y trabaja sin pausas; a las 20:00 su sesión se cierra.
En la modalidad en la nube, la terminación contractual efectiva DEBE invalidar todas las sesiones de la empresa y bloquear sus operaciones según RN-152, aunque no hayan vencido los plazos de inactividad o duración máxima (QA2-29, 2026-11-08).
✅ **Ejemplo:** Ana deja una pestaña con actualización automática y trabaja en otra; la actividad en la segunda mantiene viva la sesión. Si no toca ninguna, la sesión se cierra a los 30:00 aunque la actualización automática siga llegando.
❌ **Contraejemplo:** una sesión iniciada el lunes sigue abierta el martes porque el usuario dejó la pestaña activa.

**RN-104** | Categoría: Notificaciones | Prioridad: MUST | Fuente: Auditoría QA C-07; RN-042; decisión del usuario (2026-11-05); Auditoría QA A-17; decisión del usuario (2026-11-06); PRINCIPIO-006
Patrón EARS: Event-driven
CUANDO el sistema genera un nuevo aviso, DEBE usar como copia el correo administrativo vigente de la empresa, conforme a RN-042 y RN-136.
✅ **Ejemplo:** tras cambiar admin@empresa1.example por cobranzas@empresa1.example el 2026-11-08, el aviso del 2026-11-09 usa cobranzas@empresa1.example en copia.
❌ **Contraejemplo:** el aviso del 2026-11-09 usa el correo administrativo anterior al cambio.

**RN-164** | Categoría: Notificaciones | Prioridad: MUST | Fuente: RN-104; RN-117; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: Event-driven
CUANDO el sistema genera un nuevo aviso, DEBE usar como dirección de respuesta el correo administrativo vigente de la empresa, conforme a RN-117.
✅ **Ejemplo:** tras cambiar el correo el 2026-11-08, el aviso del 2026-11-09 tiene Reply-To cobranzas@empresa1.example.
❌ **Contraejemplo:** ese aviso conserva admin@empresa1.example como dirección de respuesta.

**RN-165** | Categoría: Notificaciones | Prioridad: MUST | Fuente: RN-104; RN-094; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE exigir un correo administrativo no vacío y con formato de correo válido al crear la empresa (RN-094) y al modificar ese dato.
✅ **Ejemplo:** se acepta cobranzas@empresa1.example al crear o editar la empresa 1.
❌ **Contraejemplo:** la empresa 1 se crea sin correo administrativo o se guarda «abc» al editarlo.

**RN-166** | Categoría: Notificaciones | Prioridad: MUST | Fuente: RN-104; Auditoría QA A-17; decisión del usuario (2026-11-06); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE mantener el correo administrativo como un dato propio de la empresa, independiente de los correos de acceso y de la cantidad, cambios o desactivaciones de sus administradores.
✅ **Ejemplo:** la empresa 1 tiene dos administradores; desactivar a uno conserva cobranzas@empresa1.example como correo administrativo.
❌ **Contraejemplo:** desactivar al administrador 10 borra o sustituye automáticamente el correo administrativo de la empresa 1.

**RN-167** | Categoría: Notificaciones | Prioridad: MUST | Fuente: RN-104; RN-060; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE permitir cambiar el correo administrativo únicamente a los usuarios ADMINISTRADOR de la empresa.
✅ **Ejemplo:** el ADMINISTRADOR 10 cambia el correo administrativo de su empresa 1.
❌ **Contraejemplo:** el OPERADOR 20 cambia ese correo.

**RN-168** | Categoría: Notificaciones | Prioridad: MUST | Fuente: RN-104; PRINCIPIO-006; decisión del usuario (2026-11-06); QA2-30 (2026-11-08)
Patrón EARS: Event-driven
CUANDO cambia el correo administrativo, el sistema DEBE auditar el valor anterior, el nuevo, el usuario que lo cambió y la fecha y hora ISO 8601, con la protección de RN-189 y RN-014.
✅ **Ejemplo:** el cambio del usuario 10 del 2026-11-08T09:00:00-05:00 conserva ambos valores protegidos en la auditoría autorizada.
❌ **Contraejemplo:** la auditoría del cambio solo conserva el correo nuevo y omite el anterior.

**RN-105** | Categoría: UX | Prioridad: MUST | Fuente: Auditoría QA A-01; RN-069; decisión del usuario (2026-11-05)
Patrón EARS: Event-driven
CUANDO un usuario ingresa al panel de cartera, el sistema DEBE inicializar el selector de moneda con su preferencia personal; si no tiene una, con la moneda por defecto de la empresa; y, si tampoco existe esa configuración, con S/ (RN-069).
✅ **Ejemplo:** Ana tiene US$ y su empresa S/: abre en US$. Luis no tiene preferencia y su empresa usa US$: abre en US$. Si ninguno tiene configuración, abre en S/.
❌ **Contraejemplo:** Ana tiene US$ y abre en S/ por la configuración de la empresa, o un usuario sin ninguna configuración abre en US$.

**RN-169** | Categoría: UX | Prioridad: MUST | Fuente: RN-105; RN-119; RN-060; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE permitir a todos los roles cambiar sus propias preferencias personales de moneda y ventana de proyección, conforme a RN-069 y RN-180.
✅ **Ejemplo:** Ana (OPERADOR), Luis (SUPERVISOR) y Eva (ADMINISTRADOR) guardan US$ y 15 días en sus propias preferencias.
❌ **Contraejemplo:** el sistema impide a Ana cambiar su propia moneda o su ventana por ser OPERADOR.

**RN-170** | Categoría: UX | Prioridad: MUST | Fuente: RN-105; RN-060; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE permitir que un usuario vea la preferencia personal de moneda de otro usuario, tampoco si tiene rol ADMINISTRADOR.
✅ **Ejemplo:** Eva (ADMINISTRADOR) solo puede consultar su propia preferencia de moneda.
❌ **Contraejemplo:** Eva consulta que Ana tiene US$ como preferencia personal.

**RN-171** | Categoría: UX | Prioridad: MUST | Fuente: RN-105; RN-119; RN-060; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE permitir a ningún usuario cambiar las preferencias personales de moneda o ventana de proyección de otro usuario, tampoco al ADMINISTRADOR.
✅ **Ejemplo:** Ana cambia su ventana a 15 días; Luis conserva su preferencia de 7 días.
❌ **Contraejemplo:** Eva (ADMINISTRADOR) cambia a S/ la moneda de Ana o a 10 días su ventana.

**RN-172** | Categoría: UX | Prioridad: MUST | Fuente: RN-105; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: Event-driven
CUANDO un usuario cambia la moneda del selector para una consulta del panel, el sistema NO DEBE persistir esa última selección como preferencia o como moneda de apertura; cada nuevo ingreso aplica RN-105.
✅ **Ejemplo:** Ana prefiere US$, consulta en S/ el 2026-11-08 y vuelve a abrir en US$ el 2026-11-09.
❌ **Contraejemplo:** la consulta en S/ cambia la moneda con la que Ana vuelve a abrir el panel.

**RN-106** | Categoría: UX | Prioridad: MUST | Fuente: Auditoría QA A-01; RN-069; decisión del usuario (2026-11-05)
Patrón EARS: Event-driven
CUANDO un ADMINISTRADOR cambia la moneda por defecto de su empresa, el sistema DEBE guardar la nueva moneda como configuración de empresa para los siguientes ingresos al panel de usuarios sin preferencia propia, según RN-105 y RN-069.
✅ **Ejemplo:** el ADMINISTRADOR cambia S/ por US$; Luis, sin preferencia, vuelve a ingresar y ve US$, mientras Ana conserva su preferencia S/.
❌ **Contraejemplo:** el cambio de empresa sustituye la preferencia S/ de Ana o Luis sigue abriendo en S/ sin preferencia propia.

**RN-173** | Categoría: UX | Prioridad: MUST | Fuente: RN-106; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: State-driven
MIENTRAS la empresa no tenga otra moneda por defecto configurada, el sistema DEBE usar S/ como su moneda por defecto.
✅ **Ejemplo:** la empresa 1 recién creada, sin cambio de moneda, tiene S/ por defecto.
❌ **Contraejemplo:** la empresa 1 sin configuración obtiene US$ por defecto.

**RN-174** | Categoría: UX | Prioridad: MUST | Fuente: RN-106; RN-060; decisión del usuario (2026-11-05); QA2-30 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE permitir cambiar la moneda por defecto de la empresa únicamente a sus usuarios ADMINISTRADOR.
✅ **Ejemplo:** Eva (ADMINISTRADOR) cambia a US$ la moneda de su empresa 1.
❌ **Contraejemplo:** Ana (OPERADOR) o Luis (SUPERVISOR) cambia la moneda por defecto de la empresa 1.

**RN-107** | Categoría: UX | Prioridad: MUST | Fuente: Auditoría QA A-02; K1; RN-046; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
El panel de cartera DEBE mostrar la cartera vencida por cobrar como la suma de los saldos de las cuotas por cobrar en estado VENCIDA, en la moneda seleccionada (RN-069).
✅ **Ejemplo:** con el selector en S/, hay dos cuotas por cobrar VENCIDAS con saldos S/ 3,000.00 y S/ 1,500.00. El panel muestra "Vencida por cobrar: S/ 4,500.00".
❌ **Contraejemplo:** el total incluye una cuota PENDIENTE por cobrar, una cuota por pagar o una cuota en US$.

**RN-108** | Categoría: UX | Prioridad: MUST | Fuente: Auditoría QA A-02; RN-046; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
El panel de cartera DEBE mostrar la cartera vencida por pagar como la suma de los saldos de las cuotas por pagar en estado VENCIDA, en la moneda seleccionada (RN-069).
✅ **Ejemplo:** con el selector en S/, una cuota por pagar VENCIDA tiene saldo S/ 700.00. El panel muestra "Vencida por pagar: S/ 700.00".
❌ **Contraejemplo:** la cuota por pagar vencida se suma en "Pendiente de pago", o no aparece en ningún indicador.

**RN-109** | Categoría: UX | Prioridad: MUST | Fuente: Auditoría QA A-02; K2; RN-046; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
El panel de cartera DEBE mostrar la cartera pendiente de cobro como la suma de los saldos de las cuotas por cobrar en estado PENDIENTE, en la moneda seleccionada (RN-069).
✅ **Ejemplo:** con el selector en S/, hay cuotas por cobrar PENDIENTES con saldos S/ 5,000.00 y S/ 3,000.00. El panel muestra "Pendiente de cobro: S/ 8,000.00".
❌ **Contraejemplo:** el total incluye una cuota por cobrar VENCIDA.

**RN-110** | Categoría: UX | Prioridad: MUST | Fuente: Auditoría QA A-02; K3; RN-046; decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
El panel de cartera DEBE mostrar la cartera pendiente de pago como la suma de los saldos de las cuotas por pagar en estado PENDIENTE, en la moneda seleccionada (RN-069).
✅ **Ejemplo:** con el selector en S/, hay cuotas por pagar PENDIENTES con saldos S/ 1,200.00 y S/ 800.00. El panel muestra "Pendiente de pago: S/ 2,000.00".
❌ **Contraejemplo:** el total incluye una cuota por pagar VENCIDA, que corresponde a "Vencida por pagar" (RN-108).

**RN-111** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA A-02; Respuesta ronda 2 (paneles de cartera no restringidos por rol); decisión del usuario (2026-11-05)
Patrón EARS: Ubiquitous
Los usuarios con cualquier rol (ADMINISTRADOR, SUPERVISOR y OPERADOR) DEBEN poder ver los cuatro indicadores de cartera (RN-046), la proyección gráfica de vencimientos (RN-048) y el listado de movimientos del panel de cartera.
✅ **Ejemplo:** un OPERADOR abre el panel y ve "Vencida por pagar" y "Pendiente de pago".
❌ **Contraejemplo:** un OPERADOR abre el panel y no ve los indicadores por pagar porque su rol no lo permite.

---

## Comparaciones protegidas y gestión de claves

**RN-139** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA A-20; decisión del usuario (2026-11-06)
Patrón EARS: Ubiquitous
El sistema DEBE normalizar los correos de contactos y usuarios quitando los espacios exteriores y convirtiendo a minúsculas con el mismo procedimiento al registrar, editar, comprobar duplicados, iniciar sesión y recuperar acceso.
✅ **Ejemplo:** ' Ana@Empresa.example ' y 'ana@empresa.example' coinciden en el alta y el inicio de sesión.
❌ **Contraejemplo:** El alta quita espacios, pero el inicio de sesión los conserva.

**RN-216** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA A-20; decisión del usuario (2026-11-06); RN-139 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE eliminar puntos, sufijos con signo + ni espacios interiores para hacer coincidir direcciones distintas.
✅ **Ejemplo:** ana+ventas@example.com no se hace coincidir con ana@example.com; a.na@example.com conserva el punto.
❌ **Contraejemplo:** Se elimina +ventas y se localiza la cuenta ana@example.com como si fuera la misma dirección.

**RN-217** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA A-20; decisión del usuario (2026-11-06); RN-139 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE comparar el RUC como cadena de exactamente 11 dígitos, conservando los ceros iniciales.
✅ **Ejemplo:** El valor de comparación 00601234567 conserva sus 11 dígitos.
❌ **Contraejemplo:** Se convierte 00601234567 a número y se pierden sus ceros iniciales.

**RN-218** | Categoría: Seguridad | Prioridad: MUST | Fuente: Auditoría QA A-20; decisión del usuario (2026-11-06); RN-139 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Las comparaciones de correo y RUC de RN-139 y RN-217 DEBEN ser exactas, no coincidencias por fragmentos.
✅ **Ejemplo:** ana@example.com no coincide con juana@example.com.
❌ **Contraejemplo:** Se localiza juana@example.com buscando el fragmento ana@example.com.

**Contexto de RN-139:** normalizar no equivale a validar el formato. RN-162 define la validación sintáctica del correo de contactos. RN-216 a RN-218 precisan conservación de caracteres, RUC y coincidencia exacta.

**RN-140** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003; PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06)
Patrón EARS: Ubiquitous
El sistema DEBE realizar las comparaciones exactas de RN-127, RN-096 y RN-097 y la localización de cuentas de RN-101 y RN-102 mediante referencias HMAC-SHA-256.
✅ **Ejemplo:** La cuenta ana@example.com se localiza por su referencia HMAC-SHA-256.
❌ **Contraejemplo:** Se descifran todos los correos para localizar la cuenta o se usa un hash sin clave.

**RN-219** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003; PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-140 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE usar para HMAC-SHA-256 una clave independiente de la clave de cifrado.
✅ **Ejemplo:** La referencia del contacto 42 usa la clave de búsqueda B1 y el cifrado usa C1.
❌ **Contraejemplo:** La misma clave C1 se usa para cifrar y calcular HMAC.

**RN-220** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003; PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-140 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE mantener copias en texto plano de correo o RUC como auxiliares de comparación o localización.
✅ **Ejemplo:** El contacto 42 tiene valor cifrado y referencias protegidas, sin correo_normalizado legible.
❌ **Contraejemplo:** Se guarda ana@example.com en una columna auxiliar para buscarla.

**RN-221** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003; PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-140 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El ámbito de las referencias de contactos DEBE incluir la empresa gestionada.
✅ **Ejemplo:** ana@example.com puede existir como contacto en las empresas 1 y 2.
❌ **Contraejemplo:** Una referencia sin empresa impide registrar el mismo correo en la empresa 2.

**RN-222** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003; PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-140 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Las referencias de usuarios y RUC de empresas DEBEN aplicar unicidad global.
✅ **Ejemplo:** ana@example.com no se duplica como usuario en la empresa 2; el RUC 20601234567 no se duplica.
❌ **Contraejemplo:** Se acepta el mismo usuario o RUC por estar en otra empresa.

**RN-223** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003; PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-140 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE exponer las referencias protegidas en logs, errores ni interfaces.
✅ **Ejemplo:** El error del contacto 42 usa un código genérico, sin su HMAC.
❌ **Contraejemplo:** El API devuelve el HMAC del contacto 42 como si fuera información anónima.

**RN-224** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003; PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-140 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO guarda o modifica un dato cifrado, el sistema DEBE persistir atómicamente el valor y sus referencias de comparación.
✅ **Ejemplo:** Si falla la referencia nueva del contacto 42, se conserva completo su valor anterior.
❌ **Contraejemplo:** Se guarda el correo nuevo del contacto 42 con la referencia del correo anterior.

**RN-225** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003; PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-140 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema DEBE mantener la unicidad de RN-096, RN-097 y RN-127 ante solicitudes concurrentes.
✅ **Ejemplo:** Dos altas simultáneas de ana@example.com en la empresa 1 producen un solo contacto.
❌ **Contraejemplo:** Una comprobación previa permite persistir ambos contactos simultáneos.

**RN-226** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-003; PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-140 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: State-driven
MIENTRAS convivan versiones de claves durante una rotación, el sistema DEBE mantener la unicidad de RN-096, RN-097 y RN-127.
✅ **Ejemplo:** Una cuenta ana@example.com indexada con B1 impide crear otra con B2.
❌ **Contraejemplo:** La misma cuenta se duplica porque sus referencias B1 y B2 son distintas.

**Contexto de RN-140:** las referencias son datos protegidos, no anónimos. RN-219 a RN-226 detallan sus garantías. Este conjunto no agrega pantallas ni búsquedas parciales por correo o RUC ni restringe búsquedas por nombre.

**RN-141** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06)
Patrón EARS: Ubiquitous
Las claves DEBEN generarse con aleatoriedad criptográfica.
✅ **Ejemplo:** La clave C1 se genera con un generador criptográfico.
❌ **Contraejemplo:** La clave C1 se deriva de la fecha 2026-11-08 sin aleatoriedad criptográfica.

**RN-227** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-141 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Las claves DEBEN custodiarse en un gestor de secretos o claves externo a PostgreSQL y al repositorio.
✅ **Ejemplo:** La clave C1 se obtiene del gestor externo y no está en las tablas ni en archivos versionados.
❌ **Contraejemplo:** La clave C1 se guarda en una tabla de PostgreSQL o en el repositorio.

**RN-228** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-141 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Las claves DEBEN estar separadas por ambiente.
✅ **Ejemplo:** Producción y pruebas utilizan claves C1 y C2 distintas.
❌ **Contraejemplo:** Pruebas reutiliza la clave C1 de producción.

**RN-229** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-141 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Las claves DEBEN estar separadas por propósito de cifrado y búsqueda.
✅ **Ejemplo:** Producción tiene una clave C1 de cifrado y una B1 de búsqueda.
❌ **Contraejemplo:** Una sola clave se usa para ambos propósitos.

**RN-230** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-141 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El acceso a uso o administración de claves DEBE limitarse al servicio autorizado y al personal operativo expresamente habilitado según su función; los roles de negocio no conceden ese acceso.
✅ **Ejemplo:** Un ADMINISTRADOR de la empresa 1 no accede a C1 por su rol.
❌ **Contraejemplo:** El rol ADMINISTRADOR permite descargar C1 desde la aplicación.

**RN-231** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-141 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Cada valor cifrado y referencia DEBE identificar la versión de clave correspondiente.
✅ **Ejemplo:** El correo cifrado del contacto 42 indica C2 y su referencia indica B2.
❌ **Contraejemplo:** El contacto 42 depende de adivinar la clave porque no guarda su versión.

**RN-232** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-141 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO ocurre un acceso administrativo o cambio de claves, el sistema DEBE auditarlo.
✅ **Ejemplo:** La rotación C1 a C2 registra el acceso y el cambio autorizados.
❌ **Contraejemplo:** Se cambia C1 por C2 sin registro de auditoría.

**RN-233** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-141 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
La auditoría de claves NO DEBE registrar secretos ni datos personales.
✅ **Ejemplo:** El registro de rotación C1 a C2 contiene referencias de versiones, sin el material secreto.
❌ **Contraejemplo:** El registro incluye la clave C2 o el correo personal del contacto 42.

**RN-234** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-141 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Unwanted
SI no está disponible una clave necesaria, el sistema DEBE rechazar la operación dependiente sin persistir texto plano.
✅ **Ejemplo:** Falta C2 y se rechaza el cambio del correo del contacto 42 sin guardarlo legible.
❌ **Contraejemplo:** Al faltar C2 se guarda ana@example.com en texto plano para completar la operación.

**Contexto de RN-141:** RN-227 a RN-234 separan custodia, separación, autorización, versiones, auditoría y rechazo por falta de clave. Los responsables y controles operativos aún pendientes en el diseño de seguridad no se consideran resueltos por esta división.

**RN-142** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06)
Patrón EARS: Event-driven
CUANDO se rota una clave, el sistema DEBE activar la nueva versión para escrituras.
✅ **Ejemplo:** Tras activar C2, un nuevo correo se cifra con C2.
❌ **Contraejemplo:** Después de activar C2 se sigue escribiendo con C1 como versión ordinaria.

**RN-235** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-142 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: State-driven
MIENTRAS existan valores que necesiten versiones anteriores durante una rotación, el sistema DEBE conservar su lectura con las versiones correspondientes.
✅ **Ejemplo:** Tras activar C2, el contacto 42 todavía cifrado con C1 sigue siendo legible para un uso autorizado.
❌ **Contraejemplo:** Activar C2 vuelve inaccesible el contacto 42 antes de migrarlo.

**RN-236** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-142 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO rota una clave, el sistema DEBE migrar los datos y referencias sin perder unicidad ni acceso.
✅ **Ejemplo:** La migración B1 a B2 conserva una sola cuenta ana@example.com accesible.
❌ **Contraejemplo:** La migración deja una cuenta inaccesible o admite una segunda ana@example.com.

**RN-237** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-142 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Antes de producción, el procedimiento operativo DEBE fijar responsable, plazo de rotación y límites de uso de claves.
✅ **Ejemplo:** El procedimiento asigna responsable operativo, rotación máxima de 12 meses y límite de 2³² cifrados por versión conforme al diseño.
❌ **Contraejemplo:** Se habilita producción sin responsable o sin plazo o límite de uso definidos.

**RN-238** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-142 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO existe sospecha de compromiso de una clave, el procedimiento operativo DEBE activar su rotación anticipada.
✅ **Ejemplo:** La sospecha sobre C1 activa su sustitución antes del plazo ordinario de 12 meses.
❌ **Contraejemplo:** Se espera al plazo ordinario de 12 meses pese a sospechar el compromiso de C1.

**RN-239** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-142 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: State-driven
MIENTRAS existan datos o respaldos retenidos que requieran una clave anterior, esta NO DEBE destruirse, salvo migración o reemplazo verificados de esos datos o respaldos.
✅ **Ejemplo:** Un respaldo cifrado con C1 conserva su clave bajo acceso controlado hasta dejar de necesitarla.
❌ **Contraejemplo:** Se destruye C1 al activar C2 aunque un respaldo retenido todavía la requiere.

**RN-240** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-142 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
Las pruebas de recuperación DEBEN comprobar conjuntamente datos, claves y reconstrucción de referencias.
✅ **Ejemplo:** Se restaura un respaldo C1, se reconstruyen referencias B2 y se verifica acceso y unicidad antes de abrir el servicio.
❌ **Contraejemplo:** La prueba solo comprueba que PostgreSQL arranca, sin descifrar datos ni reconstruir referencias.

**RN-241** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-142 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO existe compromiso de una clave, el procedimiento operativo DEBE restringir de inmediato el uso de la versión afectada.
✅ **Ejemplo:** C1 comprometida deja de estar disponible para uso ordinario al conocerse el incidente.
❌ **Contraejemplo:** C1 sigue disponible para uso ordinario hasta la siguiente rotación anual.

**RN-242** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); RN-142 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO existe compromiso de una clave, el procedimiento operativo DEBE preservar la recuperación de los datos dependientes mediante acceso controlado.
✅ **Ejemplo:** La recuperación autorizada de un respaldo C1 usa acceso restringido mientras se sustituye la clave.
❌ **Contraejemplo:** Se destruye C1 sin migración y se pierde la recuperación del respaldo retenido.

**Contexto de RN-142:** RN-235 a RN-242 precisan continuidad, migración, procedimiento, retención, recuperación e incidente. Los parámetros operativos existentes siguen en `otros/06-diseno-seguridad-datos.md`; no se fijan valores nuevos por QA2-31.

**RN-143** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07)
Patrón EARS: Ubiquitous
El sistema DEBE almacenar las contraseñas mediante un algoritmo específico de hash de contraseñas con sal aleatoria individual y parámetros de costo registrados, excluyendo texto plano, hash rápido genérico y cifrado reversible.
✅ **Ejemplo:** Dos usuarios con la contraseña 'mi clave larga 2026' tienen hashes distintos y parámetros de costo registrados.
❌ **Contraejemplo:** La contraseña se guarda con SHA-256 genérico o mediante AES reversible.

**RN-243** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO verifica una contraseña, el sistema DEBE usar la función de verificación de la biblioteca elegida.
✅ **Ejemplo:** La biblioteca verifica 'mi clave larga 2026' contra su hash almacenado.
❌ **Contraejemplo:** El sistema descifra una contraseña o compara hashes mediante una rutina propia en vez del verificador elegido.

**RN-244** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO se define o recupera una contraseña según RN-098 o RN-102, el sistema DEBE generar un hash nuevo.
✅ **Ejemplo:** Recuperar con 'mi clave larga 2026' genera un nuevo hash con su sal individual.
❌ **Contraejemplo:** La recuperación reutiliza el hash anterior como si fuera una contraseña temporal.

**RN-245** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE recuperar ni enviar la contraseña anterior.
✅ **Ejemplo:** La recuperación de ana@example.com envía un enlace, sin la contraseña anterior.
❌ **Contraejemplo:** Se envía por correo la contraseña anterior de ana@example.com.

**RN-246** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO se define o recupera una contraseña, el sistema DEBE exigir una longitud entre 8 y 128 caracteres, ambos extremos incluidos.
✅ **Ejemplo:** Se admiten 'abcdefgh' de 8 caracteres y una contraseña de 128 caracteres.
❌ **Contraejemplo:** Se admite 'abcdefg' de 7 caracteres o una contraseña de 129.

**RN-247** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Event-driven
CUANDO se define o recupera una contraseña, el sistema DEBE aceptar cualquier carácter, incluidos espacios y símbolos, sujeto a RN-246 y RN-249.
✅ **Ejemplo:** Se admite 'mi clave larga 2026' de 19 caracteres y 'abcd! ef' de 8.
❌ **Contraejemplo:** Se rechaza 'abcd! ef' únicamente por contener un espacio o un símbolo.

**RN-248** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE exigir mayúsculas, números ni símbolos como condiciones de composición de una contraseña.
✅ **Ejemplo:** Se admite 'abcdefgh' de 8 caracteres sin exigir otros tipos de carácter.
❌ **Contraejemplo:** Se rechaza 'abcdefgh' por no tener número o mayúscula.

**RN-249** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Unwanted
SI una contraseña está vacía, contiene solo espacios o queda fuera del rango de RN-246, el sistema DEBE rechazarla informando el motivo.
✅ **Ejemplo:** Se rechazan ocho espacios o 'abcde' indicando el motivo de cada rechazo.
❌ **Contraejemplo:** Se aceptan ocho espacios o se rechaza 'abcde' sin informar el motivo.

**RN-250** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
El sistema NO DEBE truncar, recortar ni normalizar las contraseñas.
✅ **Ejemplo:** La contraseña ' abcdefg ' conserva sus espacios como parte del secreto.
❌ **Contraejemplo:** Se recorta una contraseña de 200 caracteres a 128 o se aplica TRIM a ' abcdefg '.

**RN-251** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
La validación de contraseñas de RN-246 a RN-250 DEBE aplicarse en el servidor.
✅ **Ejemplo:** Una llamada directa al API con 'abcde' se rechaza aunque omita la interfaz.
❌ **Contraejemplo:** El API acepta 'abcde' porque solo valida el navegador.

**RN-252** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Ubiquitous
La interfaz PUEDE anticipar la validación de contraseña como complemento opcional, sin sustituir la validación obligatoria del servidor de RN-251.
✅ **Ejemplo:** El navegador anticipa que 'abcde' es corta y el servidor también la rechaza en una llamada directa; omitir la anticipación es válido.
❌ **Contraejemplo:** Se omite la validación del servidor porque el navegador ya comprueba la longitud.

**RN-253** | Categoría: Seguridad | Prioridad: MUST | Fuente: PRINCIPIO-004; Auditoría QA A-20; decisión del usuario (2026-11-06); Auditoría QA2-14; decisión del usuario (2026-11-07); RN-143 (obligación extraída); QA2-31 (2026-11-08)
Patrón EARS: Unwanted
SI se rechaza la definición o recuperación de una contraseña, el sistema NO DEBE dejar efectos parciales: se conserva el estado INVITADO o la contraseña anterior, según corresponda, y el enlace no se consume.
✅ **Ejemplo:** Luis introduce 'abcde', sigue INVITADO y puede reintentar con el mismo enlace; una recuperación fallida conserva la contraseña anterior.
❌ **Contraejemplo:** Rechazar 'abcde' consume el enlace o activa al usuario sin contraseña válida.

**Contexto de RN-143:** RN-243 a RN-253 separan verificación, renovación y contrato de entrada de contraseñas. La anticipación opcional en interfaz de RN-252 no permite omitir la validación del servidor. El diseño de seguridad mantiene el algoritmo y parámetros ya decididos.

---

## Confirmación de registros

**RN-063** | Categoría: Pagos | Prioridad: MUST | Fuente: Decisión del usuario sobre confirmación de pagos; PRINCIPIO-006
Patrón EARS: Ubiquitous
El sistema DEBE confirmar cada pago en el momento de registrarlo. En este catálogo y en la constitución, "pago confirmado" significa "pago registrado".
✅ **Ejemplo:** el pago 1001 de S/ 400.00 se registra y queda confirmado en la misma operación.
❌ **Contraejemplo:** el pago 1001 se registra en estado sin confirmar y puede editarse.

**RN-064** | **Retirada (2026-11-05)** | Fuente: Decisión del usuario (auditoría QA, C-01)
Un comprobante queda vigente al guardarlo: no existe un estado "sin confirmar" ni un rol que lo confirme. Desde que se guarda admite pagos, reprogramaciones y anulación. La regla ya no aplica y su ID no se reutiliza.
