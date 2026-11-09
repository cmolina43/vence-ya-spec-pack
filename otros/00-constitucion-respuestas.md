1. Idioma
- ¿Código, nombres de variables, comentarios, mensajes de commit y documentación en español, inglés, o mixto? 
  En español.
- ¿La interfaz de usuario será solo en español, o también en otro idioma?
  En español.

2. Stack tecnológico
- ¿Tienen preferencia de lenguaje, framework, base de datos y hosting? ¿O quieren que lo definamos después?
  backend: nodejs con nestjs
  base de datos: postgres
  frontend: react con shadcnui
- ¿Es obligatorio que la base de datos esté en Perú o en una región específica?
  cuando el proyecto sea publicado en produccion, la base de datos estara en un proveedor de servicio en la nube, se usara Neon.

3. Regulación aplicable (Perú)
- ¿Aplica la Ley de Protección de Datos Personales (Ley 29733) y su reglamento (D.S. 003-2013-JUS)? ¿Manejarán datos de personas naturales (RUC de independientes, DNI, teléfonos, correos)?
  si usaremos datos de las empresas, del contacto, y de las facturas sujetas a credito.
- ¿Procesarán datos de tarjetas o pagos electrónicos? Si sí, ¿con qué pasarela?
  no realizara procesamiento de pagos electronicos, solo registrara el abono o el cargo como informacion para poder tener el control de vencimientos.
- ¿La evaluación de comportamiento de pago es "decisión automatizada" para el cliente final? ¿Debe ser explicable y recurrible?
  el sistema debe evauar el comportamiento de pago con los datos historicos
  no es necesario tener una explicacion amplia sobre el motivo de la evaluacion.
- ¿Hay requisitos de facturación electrónica SUNAT que el sistema deba respetar (comprobantes, montos, retenciones)?
  si pero no debe ser tan estricto, como validar si el comprobante esta registrado en SUNAT, eso podria ser mas adelante como un requerimiento adicional, pero por ahora no es necesario.

4. Privacidad y seguridad de datos
- ¿Qué datos son sensibles para ustedes (DNI, RUC, teléfono, dirección, historial de pagos)?
- ¿Cifrado en reposo y en tránsito: qué algoritmo y versión mínima? (Por ejemplo, AES-256-GCM en reposo y TLS 1.2 o superior en tránsito.)
- ¿Política de retención y borrado: cuánto tiempo se guarda el historial de pagos y qué pasa al pedir eliminación?
- ¿Multi-tenant? Es decir, ¿cada empresa cliente de VenceYa debe quedar aislada de las demás?
- Por defecto sugerido: aislamiento estricto por empresa; cifrado AES-256 en reposo y TLS 1.2+ en tránsito; los datos sensibles nunca en logs.
  cada empresa (usuarios) que utilicen el sistema, solo puede controlar la gestion de cobranzan y pagos de la empresa.

5. Accesibilidad
- ¿Exigen cumplimiento de WCAG? ¿Qué nivel (AA es lo habitual)?
- ¿Uso previsto en móvil, tablet o escritorio? ¿Se usará en campo o en oficina?
- Por defecto sugerido: WCAG 2.2 nivel AA, diseño responsive y navegable por teclado.

6. Acciones prohibidas para agentes de IA
- ¿Qué NO puede hacer un agente de IA en el repositorio? Propuestas para que confirmes o cambies:
  - Modificar o borrar registros de pagos ya confirmados sin registro de auditoría.
  - Desplegar a producción sin aprobación humana.
  - Subir secretos, credenciales o datos reales de clientes al repositorio o a prompts.
  - Modificar la lógica de cálculo de indicadores de comportamiento de pago sin un test que lo cubra.
  - Desactivar tests o reglas de lint para "hacer pasar" un cambio.
- ¿Un agente puede enviar notificaciones reales a clientes (WhatsApp, correo, SMS)? ¿Quién autoriza eso?
  - el agente no tiene permitido enviar notificaciones reales a los clientes, pero para un entorno de pruebas, se podria usar una cuenta de correo definida por el usuario, por ahora no tenemos cobertura al envio de notifgicaciones por Whatsapp, Telegram, SMS, solo estara disponible el envio de notificacion por correo electronico y la visibilidad de las notificaciones a traves del sistema.

7. Calidad y testing
- ¿Cobertura mínima de tests exigida? (Por ejemplo, 80% en lógica de negocio.)
- ¿Los cálculos financieros (saldos, intereses, mora) requieren pruebas con casos de referencia aprobados por contabilidad?
- ¿Revisión humana obligatoria para todo cambio, o solo para algunos módulos?
- Por defecto sugerido: cobertura mínima 80% en lógica de negocio; cálculos financieros con casos de prueba de oro; todo merge con revisión humana.

8. Formato de documentación
- ¿Markdown como formato base para toda la documentación? ¿Los XML se mantienen como artefactos de entrada para agentes?
- ¿Cada principio debe tener un ID fijo (PRINCIPIO-001…) que se referencie desde otros documentos (reglas de negocio, alcance, QA)?
- Por defecto sugerido: sí a ambos.