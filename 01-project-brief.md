# Project Brief: VenceYa

**Estado:** Preliminar (fase de descubrimiento)
**Fuente:** Rondas 1 a 4 de preguntas y respuestas con el equipo de negocio
**País de operación:** Perú

---

## 1. Problema y oportunidad

Las pymes peruanas de los sectores comercial y de servicios gestionan sus cuentas por cobrar y por pagar en **Excel**. Algunas empresas usan además un software que no fue diseñado para gestionar cuentas. Para la mayoría, no existe una herramienta especializada: el software a medida es la alternativa habitual, pero tiene costo y tiempo de implementación altos.

**Lo que se pierde hoy:**

- **Liquidez:** cuando una cuota de un cliente vence sin que nadie la gestione, la empresa deja de cobrar a tiempo y se afecta su flujo de caja.
- **Confianza:** cuando un pago a proveedor vence sin aviso, la empresa incumple compromisos y pierde credibilidad.
- **Visibilidad:** el control en Excel es difícil de mantener al día. Los vencimientos se detectan tarde, y el seguimiento de pagos recibidos es manual.

**Oportunidad:** con una lista de cuotas por avisar, avisos de vencimiento por correo y un registro centralizado, es menos probable que una operación no se informe a tiempo.

**Volumen de referencia:** unas 80 operaciones al mes (aproximadamente 1,000 al año) por empresa típica, sujetas a crédito y con plazo de vencimiento.

---

## 2. Usuarios y segmentos objetivo

**Segmento principal:** micro, pequeñas y medianas empresas peruanas de los sectores comercial y de servicios que necesitan controlar los vencimientos de sus cuentas por cobrar y por pagar. Se usará la clasificación de la Ley MYPE (Ley 30056) para definir micro, pequeña y mediana empresa según ventas anuales.

**Roles dentro de la pyme:**

| Rol | Necesidad principal |
|---|---|
| Encargado de cobranzas | Saber qué cobros vencen, cuáles están atrasados y a quién notificar. |
| Encargado de pagos | Saber qué pagos a proveedores vencen y cuáles están pendientes. |
| Contador | Consultar y exportar el estado y saldo de las cuotas, con acceso al historial de cobros y pagos registrados. |
| Dueño / directiva | Visibilidad consolidada mediante paneles, reportes y consultas, sin depender del detalle operativo. |

**Usuario que decide la compra:** no está confirmado. Hoy el dueño es el usuario de visibilidad, pero la decisión de contratar puede recaer en él, en la directiva o en el contador. Se asume que la pyme contrata directamente (ver sección 4).

**Estudios contables:** no son segmento objetivo por ahora.

---

## 3. Propuesta de valor

**Propuesta central:** dar a las pymes un registro único y confiable de sus cuentas por cobrar y por pagar, con aviso anticipado de vencimientos, para que ningún compromiso se pierda sin gestionar.

**Por qué usarían VenceYa en lugar de lo que tienen hoy:**

- Reemplaza un control manual en Excel que es difícil de mantener.
- Evita depender de un software a medida, con costo y tiempo de implementación que muchas pymes no pueden asumir.
- La lista de cuotas por avisar y el envío de avisos por correo reducen el riesgo de omitir un vencimiento.

**Lo que aún no está validado:** qué los haría cambiar de Excel. Las pymes entrevistadas aún no se han identificado, así que esta propuesta es una hipótesis.

---

## 4. Modelo de negocio preliminar

**Cliente que paga:** la pyme directamente. Se descarta por ahora el estudio contable como canal principal.

**Opciones consideradas (sin decisión):**

- **A. Suscripción mensual por pyme, por tramos según número de operaciones.** Simple de explicar. Riesgo: una pyme pequeña puede verla como costosa frente a Excel, que es gratuito.
- **B. Licencia para estudios contables.** Descartada como modelo principal por ahora.
- **C. Modelo mixto:** versión de prueba o básica, y cobro por cuentas, usuarios u operaciones adicionales. Riesgo: más complejo de comunicar y de calcular.

**Recomendación para validar:** partir de una suscripción por tramos (opción A) y medir la disposición a pagar con pymes reales antes de cerrar el precio. El precio en soles aún no está definido.

---

## 5. Métricas de éxito (KPIs)

Para cada indicador se indica la fuente de la necesidad. Las metas son propuestas y deben ajustarse una vez medida la línea base.

**Métricas de negocio para la pyme (visibilidad del dueño):**

| # | Indicador | Definición medible | Meta propuesta |
|---|---|---|---|
| K1 | Cartera vencida por cobrar | Suma de saldos vencidos de comprobantes por cobrar, en S/ y US$ por separado. | Reducción de al menos 15 % en 6 meses, sujeta a línea base. |
| K2 | Cartera pendiente de cobro | Suma de saldos no vencidos por cobrar, en S/ y US$. | Medida informativa. |
| K3 | Cartera pendiente de pago | Suma de saldos no vencidos por pagar a proveedores, en S/ y US$. | Medida informativa. |
| K4 | Proyección de próximos vencimientos | Monto esperado de cobro y pago, agrupado por día, dentro de la ventana de 7, 10 o 15 días que seleccione el usuario. La vista inicial es de 7 días. | 100 % de los vencimientos de los próximos 7 días visibles al lunes en la vista inicial. |

**Métricas operativas de control:**

| # | Indicador | Definición medible | Meta propuesta |
|---|---|---|---|
| K5 | Vencimientos avisados a tiempo | Porcentaje de cuotas que vencen con al menos un aviso aceptado para envío por Resend antes de su fecha efectiva de vencimiento. La aceptación no confirma la entrega al destinatario. | Medida informativa mientras el aviso sea manual; la meta se define cuando exista el aviso automático (alcance O16). |
| K6 | Retirado (2026-11-07) | La conciliación bancaria queda fuera de esta versión (QA2-09; O19). Identificador reservado. | No aplica; se retira la meta. |
| K7 | Reprogramaciones registradas | Número de reprogramaciones con fecha de nueva promesa de pago, por mes. | Registro del 100 % de reprogramaciones. |
| K8 | Días promedio de cobro (DSO) | Promedio de días entre la emisión del comprobante y su cobro total. | Reducción frente a la línea base. |

**Línea base:** no disponible. Se medirá con las primeras pymes que participen.

---

## 6. Riesgos identificados y supuestos

### Riesgos

| # | Riesgo | Impacto | Mitigación propuesta |
|---|---|---|---|
| R1 | Las pymes prefieren seguir con Excel porque es gratuito y conocido. | Alto: no hay adopción. | Validar la disposición a pagar y el costo del problema con entrevistas antes del desarrollo. |
| R2 | Protección de datos personales: los datos de clientes, proveedores y correos son personales cuando son personas naturales o contactos de empresas. | Alto: incumplimiento de la Ley 29733. | Definir roles y contrato de encargo, informar a los titulares, y registrar los bancos de datos en la ANPD cuando corresponda. Revisión legal antes del lanzamiento. |
| R3 | El sistema no valida el número de documento contra SUNAT. | Medio: errores de registro que el usuario debe corregir. | Aceptado como responsabilidad del usuario. Se valida solo que no se duplique el mismo documento: por empresa en cuentas por cobrar y por proveedor en cuentas por pagar. |
| R4 | Conversión de moneda: el usuario debe convertir manualmente porque los tipos de cambio varían según banco o plataforma. | Medio: posibles diferencias en reportes en US$. | Registrar siempre en la moneda original del comprobante. |
| R5 | Las notificaciones solo por correo pueden no ser leídas a tiempo. | Medio: un vencimiento puede pasar sin gestión. | Validar con las pymes si el correo es suficiente o si se requiere otro canal. |
| R6 | Falta de línea base: no se conoce el atraso actual de la cartera. | Medio: no se puede demostrar mejora. | Medir en las primeras pymes antes de fijar metas. |
| R7 | Un modelo de precio no validado puede no ser viable. | Alto: sin ingresos no hay sostenibilidad. | Probar disposición a pagar con pymes reales. |

### Supuestos a validar

- **S1:** las pymes del segmento llevan sus cuentas por cobrar y por pagar en Excel, y el problema de vencimientos sin gestionar es frecuente.
- **S2:** las pymes contratarían la herramienta directamente, sin intermediación de estudios contables.
- **S3:** la pyme tiene capacidad de pago por una suscripción mensual, y el monto es un factor de decisión.
- **S4:** el correo electrónico es un canal suficiente para notificar a clientes, proveedores y al dueño.
- **S5:** los comprobantes sujetos a crédito se pagan en cuotas mensuales de importes proporcionales al total, con posibilidad de modificarlas.
- **S6:** la pyme aceptará registrar datos de clientes y proveedores en un tercero, bajo un acuerdo de tratamiento de datos.

---

## 7. Restricciones conocidas

### Restricciones de negocio y alcance

- **Mercado:** exclusivamente Perú, con enfoque en micro, pequeñas y medianas empresas de los sectores comercial y de servicios.
- **Tipo de operaciones:** comprobantes de pago sujetos a crédito, con plazo de vencimiento. No se gestiona contabilidad completa ni emisión de comprobantes.
- **Registro de pagos:** el operador registra fecha real e importe de un pago sobre una sola cuota. Un importe menor que su saldo lo reduce; uno igual deja la cuota CANCELADA; uno mayor se rechaza y no se reparte entre cuotas (RN-092; O14). La misma operación no genera pagos duplicados por doble clic o reintento (RN-156). No se registran extractos ni movimientos bancarios ni se concilian pagos con el banco (O19).
- **Orden de los pagos:** se registran en orden cronológico por cuota, conservando su fecha real; se permiten varios pagos del mismo día. Un pago anterior a la mayor fecha de los pagos no anulados de esa cuota se rechaza. Para incorporar un pago omitido anterior, se anulan los pagos vigentes de fechas posteriores y se registran nuevamente en orden junto con el omitido, conservando fechas reales e historial (RN-089). Registrar o anular pagos no modifica el vencimiento acordado del crédito; la cancelación real indica cuándo se completó el pago (RN-088).
- **Volumen de referencia:** unas 80 operaciones al mes y aproximadamente 1,000 al año por empresa.
- **Monedas:** soles y dólares. La conversión entre monedas es responsabilidad del usuario, y el sistema registra cada operación en la moneda original del comprobante.
- **Cuotas:** el sistema debe ayudar a definir cuotas. El caso habitual es cuota mensual de importe proporcional, editable por el usuario.
- **Reprogramaciones:** el sistema permite registrar el cambio sin autorización previa. La aprobación interna corresponde a la directiva, y el usuario es responsable de lo que ingresa.
- **Notificaciones:** por correo electrónico, enviadas manualmente por el usuario desde una lista de cuotas por avisar, dirigidas al cliente o proveedor y con copia al correo administrativo de la empresa y a los usuarios que el administrador configure en copia, de forma separada para los avisos a clientes y a proveedores.

### Restricciones de datos

- **No se almacenan ni solicitan números de cuenta ni CCI** de clientes o proveedores.
- **No se valida el número de documento contra SUNAT.** La responsabilidad de la información registrada es del usuario. El sistema sí valida duplicados por número de documento: por empresa en cuentas por cobrar y por proveedor en cuentas por pagar.
- **Protección de datos personales:** se aplica la Ley 29733 y su reglamento vigente (D.S. 016-2024-JUS, que reemplaza al D.S. 003-2013-JUS). El producto se instala en la nube o en el servidor de la empresa cliente (constitución, E-007). En la nube, los servicios operan en Virginia, Estados Unidos (alcance D1, D2 y D7). El rol de VenceYa en cada modalidad está decidido de forma provisional (alcance D5) y debe confirmarlo la revisión legal.

### Restricciones de validación

- No hay entrevistas con pymes programadas todavía.
- No hay línea base de cartera vencida.
- No hay precio definido.

---

## Preguntas abiertas para la siguiente fase

1. ¿VenceYa actúa como encargado del tratamiento de datos? (Recomendado: sí, a confirmar con asesoría legal.)
2. ¿Cuál es el perfil de la pyme objetivo en número de empleados, ventas anuales y sector específico?
3. ¿Qué precio mensual en soles estarían dispuestas a pagar las pymes?
4. ¿Cuántas pymes o contadores podrían participar en entrevistas de validación?
5. ¿El correo electrónico es suficiente como canal de notificación, o se necesita otro canal para esta audiencia?
