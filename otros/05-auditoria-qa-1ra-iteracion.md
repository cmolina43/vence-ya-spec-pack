CRÍTICAS

C-01 · Contradicción · Glosario #20, RN-017, RN-018, RN-064, respuestas 3 y 4
- Problema: la respuesta 4 dice que un comprobante se confirma cuando se paga por completo, pero el glosario dice que ocurre al guardarlo. Con la respuesta 4, RN-064 bloquea todo: no se puede pagar sin confirmar ni confirmar sin pagar. La respuesta 3 permite cambiar cuotas después de confirmar, mientras que el glosario dice que "no se editan libremente" y RN-017 y RN-018 solo cubren el "antes". Las reglas citan una "decisión del usuario" que no está registrada, así que no puedo saber cuál sigue vigente.
- Sugerencia: registrar la decisión final. Definir también si existe un borrador guardado y qué se puede cambiar después de confirmar, con qué rol y con qué rastro.

cuando se crea un comprobante, es decir cuando se registra el credito, no hay motivo para tener alguna confirmacion despues de guardar, pienso que debe ser mas directo, no hay ningun rol que confirme.
al guardar el credito ya se puede pagar, anular, o reprogramar segun sea el caso.

C-02 · Regla faltante · RN-025, RN-022, RN-029, RN-074, Glosario #17
- Problema: ninguna regla dice que anular un pago devuelve su importe al saldo. RN-025 y el glosario lo restan por ser "registrado", y un pago anulado sigue registrado. Tampoco está definido si una cuota CANCELADA se reabre ni si una promesa CUMPLIDA cambia de estado.
- Sugerencia: definir el saldo con pagos no anulados, y añadir reglas para la reversión de la cuota y de la promesa.

C-03 · Regla faltante · RN-061, RN-040, RN-046, RN-049, RN-053, RN-076
- Problema: no se define qué pasa con las cuotas de un comprobante anulado. Leídas literalmente, siguen con saldo, suman en la cartera y generan correos reales a contactos. Además, RN-049 solo admite tres estados.
- Sugerencia: decidir si son excluidas de cartera, avisos, reportes, DSO e indicador, y cómo se muestran en el listado.

C-04 · Regla faltante · Respuesta 6, RN-024, RN-025
- Problema: se decidió que no debe haber sobrepago, pero ninguna regla lo prohíbe. RN-024 solo rechaza importes menores o iguales a cero, por lo que un saldo puede quedar negativo. Tampoco se cubren dos pagos simultáneos sobre la misma cuota.
- Sugerencia: añadir la regla Unwanted con caso límite (pago igual al saldo) y su comportamiento ante concurrencia.

C-05 · Contradicción · RN-003 con RN-061 y RN-062
- Problema: un comprobante anulado se conserva, así que su número sigue "existiendo" y RN-003 impide volver a registrarlo. El propio ejemplo de RN-061 anula por "importe de cuota errado", y ese comprobante ya no se podría corregir.
- Sugerencia: decidir si los comprobantes anulados cuentan para la unicidad.

C-06 · Regla faltante · RN-003, RN-004, Glosario #8, Brief R3
- Problema: la unicidad no considera al emisor. Dos proveedores distintos pueden emitir F001-00045, y RN-003 rechazaría la segunda factura, que es legítima. Tampoco se define si f001-45 y F001-00045 son el mismo número. La regla coincide con la respuesta de negocio, pero esa respuesta parece no haber previsto este caso.
- Sugerencia: que el equipo decida si la clave incluye el contacto o el tipo de comprobante, y cómo se normaliza el número.

C-07 · Regla faltante · Alcance §3 y M6, RN-009, RN-070
- Problema: el MVP dice que el usuario puede "darse de alta", pero no hay reglas para crear una empresa, crear el primer administrador, iniciar sesión, recuperar la contraseña o desactivar usuarios. Como solo un administrador crea usuarios, el primero no puede existir.
- Sugerencia: añadir reglas de alta y del ciclo de vida del usuario, incluido qué pasa si se elimina o cambia de rol el último administrador.

ALTAS

A-01 · Contradicción · RN-046, RN-047, Alcance M4 y RN-069, Glosario #29
- Problema: RN-046 y M4 muestran S/ y US$ a la vez, mientras que RN-069 hace que los totales incluyan solo la moneda seleccionada. El glosario limita el selector a los 7 días, pero RN-069 lo llama "general".
- Sugerencia: definir qué elementos del panel afecta el selector.

A-02 · Regla faltante · M4, K2, K3, RN-046, RN-048, Glosario #26 a #28
- Problema: ninguna regla exige mostrar la cartera pendiente de cobro ni la de pago; solo aparecen en un ejemplo y en definiciones. No está claro si existe cartera vencida por pagar. K3 suma todos los saldos por pagar, pero el glosario #28 solo los PENDIENTES. RN-048 no dice si suma saldos o importes, ni si separa cobros de pagos. La visibilidad por rol solo figura en las respuestas.
- Sugerencia: crear una regla por indicador y alinear K3 con el glosario.

A-03 · Contradicción · RN-040
- Problema: la regla dice "3 días o menos", pero su contraejemplo prohíbe avisar a 1 día. Una cuota registrada el 2026-11-08 que vence el 2026-11-10 no podría cumplir ambos. Tampoco se define si son días calendario o hábiles, a qué hora se envía, ni qué pasa si el proceso no corrió ese día.
- Sugerencia: separar el caso normal del caso tardío y corregir el contraejemplo.

A-04 · Regla faltante · RN-080, RN-033, RN-073, RN-074
- Problema: RN-080 solo compara con la fecha efectiva, así que permite una promesa ya pasada: una cuota vencida el 11-10 puede reprogramarse el 11-20 al 11-15. RN-033 la llamaría activa, pero RN-074 la haría INCUMPLIDA desde su registro, y RN-040 no podría avisar antes.
- Sugerencia: decidir si la nueva fecha también debe ser igual o posterior a la fecha de registro.

A-05 · Contradicción · RN-040, RN-045, respuesta 24, ronda 3 (pregunta 3), PRINCIPIO-009
- Problema: la respuesta 24 pide notificar las reprogramaciones. RN-045 habla de un "aviso inmediato", pero RN-040 avisa 3 dEl ejemplo de PRINCIPIO-009 envía el correo "al vencer", y no existe ninguna regla para avisar en el vencimiento ni después.
- Sugerencia: definir qué eventos notifican y alinear el ejemplo de la constitución.

A-06 · Contradicción · RN-065, RN-069, RN-040, Alcance C3
- Problema: RN-065 es MUST, pero nace de C3, que es Could y está fuera del alcance declarado del catálogo. RN-069 tampoco tiene funcionalidad en el alcance. Además, faltan el rol que configura, los valores permitidos (¿0 días?) y el efecto de cambiar el plazo con avisos ya
  enviados.
- Sugerencia: mover la funcionalidad a Must o bajar la prioridad, y completar estos casos.

A-07 · Ambigüedad · RN-023, RN-076, Glosario #16
- Problema: nadie define quién proporciona la fecha de cálculo en el panel y en los procesos de envío. Tampoco está claro si una fecha pasada reconstruye la situación de ese día o ignora los pagos y promesas posteriores.
- Sugerencia: definir el origen de la fecha en cada caso de uso y la semántica histórica.

A-08 · Regla faltante · RN-022, RN-024, RN-053, RN-074, RN-076
- Problema: no se valida la fecha del pago, que podría ser futura o anterior a la emisión. Tampoco se distingue la fecha del pago de la fecha de registro, y esa diferencia cambia CUMPLIDA o INCUMPLIDA, el DSO y las canceladas del periodo. Las transferencias pueden tardar hasta dos días hábiles.
- Sugerencia: definir qué fecha gobierna cada cálculo y sus validaciones.

A-09 · Regla faltante · RN-015, RN-020
- Problema: "mensuales" no indica desde cuándo se cuenta ni qué pasa con un 31 de enero más un mes. Tampoco se definen el mías fechas deben ser crecientes, ni si se admite un vencimiento ya pasado al registrar.
- Sugerencia: añadir reglas de generación con casos de fin de mes.

A-10 · Ambigüedad · RN-015, RN-016, RN-018, RN-019
- Problema: si el usuario edita importes y la suma no cuadra, no se sabe si el sistema rechaza o si la última cuota absorbe isión decimal y el redondeo. Con S/ 0,02 en 3 cuotas, el reparto produce una cuota de cero, que RN-019 prohíbe.
- Sugerencia: definir la validación al confirmar y el caso de total insuficiente.

A-11 · Regla faltante · RN-058 a RN-060, Glosario #40 y #41, respuesta 13
- Problema: no hay matriz de permisos. No está claro si el SUPERVISOR registra comprobantes, pagos o reprogramaciones, ni quién cambia roles, edita contactos o configura la empresa. "Todas las acciones" (RN-060) y "todas las opciones" (respuesta 13) no son verificables.
- Sugerencia: crear una matriz de rol por acción como fuente única.

A-12 · Contradicción · RN-079, Glosario #40, respuesta 23, Alcance S4
- Problema: RN-079 cita la respuesta 23 para dejar que el OPERADOR vea el reporte, pero esa respuesta limita "ver y exportar" al supervisor y al administrador. S4 dice además que "un usuario" descarga.
- Sugerencia: confirmar quién puede ver el reporte y actualizar la fuente o la regla.

A-13 · Regla faltante · RN-029, RN-058, RN-059, RN-062
- Problema: nada impide anular dos veces el mismo pago ni anular una anulación. Tampoco se define la anulación parcial, si el pago de reemplazo es obligatorio, ni el efecto sobre un pago ya conciliado. Además, el glosario #21 dice "no tiene pagos confirmados", pero RN-062 dice
  "no estén anulados". Como un pago anulado sigue confirmado, según el glosario ese comprobante nunca se podría anular.
- Sugerencia: definir un ciclo de vida del pago y unificar la redacción.

A-14 · Regla faltante · M1, RN-044, Glosario #6 y #7
- Problema: faltan los campos obligatorios de contacto y comprobante, y la validación del total y de la fecha de emisión. Tampoco se define si se pueden editar o eliminar contactos con deuda, si hay duplicados, ni si un contacto puede ser cliente y proveedor a la vez.
- Sugerencia: añadir reglas de entidad y de edición para contactos y comprobantes.

A-15 · Contradicción · RN-014, Glosario #38, PRINCIPIO-005, Brief R2
- Problema: PRINCIPIO-005 incluye montos asociados a personas, mensajes de error, prompts y fixtures. RN-014 solo cubre cinco campos en logs. Ninguna lista incluye el nombre de una persona natural.
- Sugerencia: ampliar la regla y el glosario, y confirmar la lista con asesoría legal.

A-16 · Regla faltante · PRINCIPIO-006, Constitución (pendientes), Brief R2
- Problema: no hay política de retención ni de solicitudes de eliminación bajo la Ley 29733, y estas chocan con la inmutabilidad de los pagos. Además, el tema no aparece en 05-preguntas-abiertas.
- Sugerencia: registrarlo como pregunta abierta bloqueante antes de modelar los datos.

A-17 · Ambigüedad · RN-042, RN-045, RN-066 a RN-068, Glosario #31
- Problema: no se dice qué correo se usa si hay varios administradores o ninguno, ni si es el correo de acceso. El "aviso" se trata como una unidad, aunque tiene dos destinatarios: si uno falla y el otro no, su estado es indefinido.
- Sugerencia: modelar la entrega por destinatario y definir el correo administrativo.

A-18 · Regla faltante · RN-055, RN-056, respuestas 16 y 17
- Problema: S3 no se puede implementar porque no hay fórmula, escala ni comportamiento con menos de 12 pagos. Tampoco se dice si cuentan los pagos anulados, ni qué significa el indicador para un proveedor, cuando quien paga es la propia empresa. Las preguntas 16 y 17 siguen sin resolverse: en la 16 se pidió una propuesta y en la 17 se respondió "no entiendo".
- Sugerencia: reformular la pregunta 17 y presentar una fórmula para aprobación del equipo.

A-19 · Contradicción · RN-027, RN-037, RN-038, PRINCIPIO-006
- Problema: PRINCIPIO-006 exige que cualquier UPDATE sobre un pago confirmado falle, pero marcarlo como conciliado es un cambio. RN-027 protege solo tres campos, e incluye un "motivo" que el pago no tiene.
- Sugerencia: decidir dónde vive la conciliación y extender la inmutabilidad a todo el registro.

A-20 · Regla faltante · RN-011, PRINCIPIO-004
- Problema: no se dice cómo buscar por RUC o correo cifrados, ni cómo iniciar sesión si el correo del usuario está cifrado. Tampoco se define si la regla aplica a los usuarios ni cómo se gestionan y rotan las claves. El algoritmo sigue pendiente, pese a ser MUST.
- Sugerencia: definir el alcance del cifrado, las búsquedas requeridas y la gestión de claves.

A-21 · Glosario · RN-050, RN-051, Alcance M4, S4
- Problema: "movimiento" no está definido: puede ser comprobante, cuota, pago o línea del extracto. Tampoco se dice qué fecha filtra el periodo. S4 solo describe el reporte de vencimientos, no una exportación de movimientos.
- Sugerencia: definir el término, sus columnas y la fecha de filtrado.

A-22 · Trazabilidad · 05-preguntas-abiertas, encabezados de 03 y 04
- Problema: los documentos remiten a 05-preguntas-abiertas, pero este solo contiene las preguntas 19 y 20. Las pendientes 16, 17 y 18 están solo en el archivo de respuestas. Tampoco figuran retención, cobertura ni accesibilidad.
- Sugerencia: centralizar los pendientes con responsable y estado.

A-23 · Contradicción · Constitución (encabezado), PRINCIPIO-004, 007 y 010
- Problema: los principios se declaran "no negociables", pero tres están pendientes de confirmación. Un agente no sabe si debe aplicarlos ni si el valor puede cambiar.
- Sugerencia: confirmarlos, o declararlos vigentes hasta que una enmienda los cambie.
