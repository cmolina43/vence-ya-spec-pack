Ronda 1: problema y usuarios

1. Quién sufre el problema: ¿Quién en la empresa maneja hoy las cobranzas y los pagos: el dueño, el contador, un área administrativa o alguien de ventas? ¿Lo hace una persona a tiempo completo o es una tarea secundaria?
lo hace el encargado de cobranzas y el de pagos, tambien el contador.
el dueño del negocio debe tener visibilidad como el dashboard, reportes, y consultas.
2. Cómo lo resuelven hoy: ¿Qué herramientas usan para llevar las cuentas de clientes y proveedores? 
mayormente utilizan excel y algunas empresas utilizan algun tipo de software cuyo objetivo no es el de gestionar efectivamente las cuentas.
3. Qué pierden: ¿Qué pasa concretamente cuando una cuota vence sin aviso o un pago no queda registrado? 
cuando una cuota o un cobro / pago vence sin avisar, el problema que puede ocasionar es de un problema de liquidez (cuando no se gestiona la cobranza) o de confianza (cuando no se realiza el pago a sus proveedores a tiempo).
de cierta forma, se tiene visibilidad para poder gestionar y notificar alguna reprogramacion que sea necesaria.
4. Medios de pago: ¿Cómo les pagan sus clientes: Yape, Plin, transferencia (BCP, BBVA, Interbank), depósito, efectivo o cheque? 
cuando se transfiere de un banco a otro, si suele demorar hasta dos dias habiles
muy poco se suele utilizar el pago con cheque o casi nunca
para los demas casos, es rapido la transferencia.
el usuario luego tiene que conciliar los cobros o pagos realizados en el sistema.
5. Tamaño del negocio: ¿Cuántos clientes activos y proveedores maneja una empresa típica de su segmento, cuántas cuotas o compromisos de pago registra al mes, y en qué rango de facturación anual se ubican (micro, pequeña o mediana)? 
el proyecto debe estar enfocado a las PYMES, pequeños y medianos negocios que requieran tener un control de vencimientos de sus cuentas por cobrar y pagar.
al mes pueden tener alrededor de 80 operaciones.
al año pueden tener aproximadamente unas 1000 operaciones.
se debe tener en cuenta que lo que se va a gestionar son comprobantes de pago que estan sujeto a credito, es decir que tienen un plazo de vencimiento.


Ronda 2: propuesta de valor, modelo de negocio, métricas y riesgos

1. Propuesta de valor: Hoy usan Excel y, en algunos casos, un software que no está pensado para gestionar cuentas. ¿Qué es lo que más les duele de eso? ¿Qué tendría que pasar para que el encargado de cobranzas, el de pagos y el contador dejen de usar Excel para este control? 
No conozco si utilizan algun software similar, ya que para esto lo que normalmente utilizarias es software a medida
Por ahora la mayoria de empresas pequeñas o medianas utilizan Excel para gestionar sus cobros y pagos de los comprobantes sujetos a credito.
2. Modelo de negocio: ¿Quién debería pagar por la herramienta: la pyme directamente, el estudio contable que la atiende, o ambos? ¿Cuánto pagan hoy en soles al mes por software de facturación o gestión, y cuánto estarían dispuestos a pagar por controlar vencimientos y cobranzas? ¿Prefieren una tarifa fija o una que dependa del número de operaciones?
No lo se, sobre este tema me puedes sugerir, o en su defecto se vera despues.
3. Métricas de éxito: Dijiste que el dueño necesita visibilidad mediante dashboards, reportes y consultas. ¿Qué tres o cuatro indicadores revisaría primero cada semana? 
cartera vencida en soles / dolares
cartera pendiente de cobro en soles / dolares
cartera pendiente de pago en soles /dolares
un panel con los proximos vencimientos (proximos 7 dias) donde muestre el cobro o pago esperado por rangos de fecha
un panel de notificaciones sobre las cuentas vencidas, cuantas estan por vencer hoy y promesas de pago activas (cuando se reprograma)
un panel para el listado de movimiento de cuentas para tener visibilidad de los registros que estan pendientes, vencidas y las ya canceladas.
4. Riesgos y supuestos: Para usar un sistema así tendrían que registrar comprobantes, datos de clientes y datos bancarios en un tercero. ¿Qué nivel de preocupación tienen por la confidencialidad de esa información? ¿Emiten comprobantes electrónicos con SUNAT y los exportan a Excel, o los registran a mano? ¿Qué pasaría si los datos de SUNAT no coincidieran con lo que registran?
es responsabilidad del usuario de la informacion que registra, el sistema no contempla una validacion del numero de documento en SUNAT
pero si se puede validar si un usuario ingresa el mismo documento en un mismo tipo de movimiento de cuenta
5. Definición de "crédito" y cuotas: Cuando hablas de comprobantes sujetos a crédito, ¿el cliente paga el total en una sola fecha de vencimiento o paga por cuotas y abonos parciales? ¿Eso mismo ocurre con los proveedores? Un mismo comprobante puede tener varios pagos parciales, así que necesito saber cómo lo manejan hoy.
si el credito puede darse en cuotas con pagos parciales o tambien el total de la factura.
el sistema debe ayudar al usuario a definir las cuotas, lo normal es que el cobro de cada cuota sea mensual con importes proporcionales al total, pero el usuario puede cambiar o modificar esa definicion.

Ronda 3: profundizar en lo que falta

1. Modelo de negocio: De las tres opciones, ¿cuál se acerca más a la forma en que les gustaría contratar? ¿Los estudios contables son un canal que te interesa atender, o el foco es la pyme directamente?
PYME directamente.
2. Moneda y tipo de cambio: Gestionan cartera en soles y en dólares. ¿Registran cada comprobante en su moneda original y convierten al momento del cobro o pago, o fijan el tipo de cambio al emitir la factura? ¿Usan el tipo de cambio SUNAT o uno pactado con el cliente? ¿Ha ocurrido que un cliente pague en soles una factura en dólares?
se entiende que la conversion de la moneda lo realiza el usuario, ya que para esos casos se suele utilizar un tipo de cambio distinto que varia de acuerdo al banco, o de alguna otra plataforma, para hacerlo mas simple solo debe permitir registrar el abono o cargo de acuerdo a la moneda origen del comprobante.
3. Promesas de pago y reprogramaciones: Mencionaste que una reprogramación se notifica y queda registrada. ¿Cómo se acuerda hoy: por escrito, WhatsApp, llamada? ¿Quién la aprueba dentro de la empresa, y cuántas veces al mes ocurre? ¿Qué pasa con la cuota original cuando se reprograma?
por ahora solo se notificara por correo electronico, se debe informar al cliente o proveedor y al correo administrativo (dueño del negocio)
de manera interna, la aprobacion de una reprogramacion lo lleva la directiva de la empresa, pero se canaliza luego al usuario, el sistema debe permitir el cambio de reprogramacion sin autorizacion, el usuario es responsable de lo que ingresa.
4. Protección de datos: ¿Conocen la Ley 29733 de Protección de Datos Personales y su reglamento? ¿Les exigirían que los datos se almacenen en Perú o en un proveedor con un contrato que lo garantice, o no es un tema prioritario para las pymes que conoces?
no lo se, me puedes sugerir
5. Validación del problema: Para comprobar que el problema es real y no solo una percepción, ¿cuántas pymes o contadores podrías presentarnos para entrevistas? Y, en tu experiencia, ¿cuántas veces al mes se entera la empresa de un vencimiento o un pago no registrado cuando ya es tarde?
al llevar el registro en excel, es mas complicado llevar un control, al contar con notificaciones automatizadas, es menos probable a que ciertas operaciones no se lleguen a informar a tiempo.