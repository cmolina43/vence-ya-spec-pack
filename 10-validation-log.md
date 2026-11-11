# 10 - Validation Log de VenceYa

**Fase BMAD:** validación de prototipos — Agente Prototype Reviewer.
**Enfoque:** gaps funcionales; la estética no se evalúa.

| Prototipo | Instrucción | Fecha | Veredicto |
|---|---|---|---|
| [P-001 Iniciar sesión](#p-001-iniciar-sesión) | `agent-prototyper-reviewer-1.xml` | 2026-11-11 | Lista con ajustes |
| [P-002 Panel de cartera](#p-002-panel-de-cartera) | `agent-prototyper-reviewer-2.xml` | 2026-11-11 | Lista con ajustes |
| [P-003 Contactos](#p-003-contactos) | `agent-prototyper-reviewer-3.xml` | 2026-11-11 | Lista con ajustes |
| [P-004 Comprobantes](#p-004-comprobantes) | `agent-prototyper-reviewer-4.xml` | 2026-11-11 | Lista con ajustes |
| [P-005 Registrar / editar comprobante](#p-005-registrar--editar-comprobante) | `agent-prototyper-reviewer-5.xml` | 2026-11-11 | Lista con ajustes |
| [P-006 Detalle de comprobante y cuotas](#p-006-detalle-de-comprobante-y-cuotas) | `agent-prototyper-reviewer-6.xml` | 2026-11-11 | Lista con ajustes |
| [P-007 Cuotas por avisar](#p-007-cuotas-por-avisar) | `agent-prototyper-reviewer-7.xml` | 2026-11-11 | Requiere ajustes funcionales |

---

## P-001 Iniciar sesión

**Prototipo revisado:** `prototipos/p001-iniciar-sesion/p001-iniciar-sesion.png` e `index.html`.
**Fuentes contrastadas:** `06-user-stories.md` (HU-002), `03-reglas-de-negocio.md` (RN-101, RN-103, RN-139, RN-149, RN-152, RN-216, RN-243 a RN-253, RN-263), `09-ui-spec.md` (P-001, §0.4, §2 F-01/F-02, §3.3, §6.2, P-015).

### 1. Cobertura de HUs

P-001 es una pantalla de una sola HU. De las 10 HUs Must, solo **HU-002** puede estar representada aquí. Las otras nueve se validan en sus propias pantallas (P-002 a P-010).

| HU | Prioridad | ¿Representada en P-001? | Detalle |
|---|---|---|---|
| HU-002 Activar cuenta, iniciar sesión y recuperar contraseña | Must | **Parcial** | Cubre el **inicio de sesión**. La activación (P-012) y la recuperación (P-013, P-014) quedan fuera de esta pantalla. P-001 solo enlaza a P-013 y muestra los avisos de regreso. |
| HU-001, HU-003 a HU-010 | Must | No aplica | No corresponden a P-001. |

**Criterios de HU-002 que aplican a P-001:**

| # | Criterio (resumen) | Estado en el prototipo |
|---|---|---|
| C1 | « Ana@Andina.example » se normaliza e inicia sesión | ✅ Recorta espacios y pasa a minúsculas antes de autenticar |
| C2 | Un usuario INVITADO o DESACTIVADO no puede iniciar sesión | ❌ No se simula: solo existe una cuenta ACTIVA de prueba |
| C3 | Bloqueo tras 5 fallos durante 15 min, sin prolongarse, con mensaje único | ✅ Se simula: el intento con la contraseña correcta durante el bloqueo se rechaza sin contarse como fallo |
| C4 | Con 4 fallos, un acierto reinicia el contador | ✅ |
| C5 | La contraseña no se recorta (« abcdefg » ≠ «abcdefg») | ✅ Se compara tal cual |
| C6 | La sesión se cierra a los 30 min de inactividad o a las 12 h | ◐ Solo aparece el aviso de regreso «Tu sesión terminó»; no hay advertencia previa (UI-6) |
| C7 | Contrato terminado: se rechaza el acceso informando que terminó (C-03) | ❌ No hay estado `403 CONTRATO_TERMINADO` ni navegación a P-015 |
| C8 | Acceso a la recuperación de contraseña | ✅ El enlace lleva a P-013 (simulado) |

### 2. Reglas de negocio

**Reflejadas en la UI:**

| RN | Cómo se refleja |
|---|---|
| RN-103 | Mensaje genérico único: «Correo o contraseña incorrectos, o la cuenta está bloqueada temporalmente.» No muestra los intentos restantes; limpia la contraseña y devuelve el foco a ese campo. |
| RN-139 / RN-216 | El correo se normaliza solo con TRIM y minúsculas; no se quitan puntos ni sufijos «+». |
| RN-250 | La contraseña no se recorta ni se normaliza. |
| RN-251 / RN-252 | El cliente solo valida que los campos sean obligatorios; no valida la longitud ni la composición al iniciar sesión. |
| RN-101 (parcial) | No pide RUC ni selección de empresa. ❌ No se simula el rechazo de usuarios INVITADO o DESACTIVADO. |
| RN-149 (parcial) | Muestra el aviso «Tu sesión terminó. Vuelve a iniciar sesión.» al volver a P-001. |

**No reflejadas (gaps):**

| RN | Gap |
|---|---|
| RN-152 | No existe el estado «Contrato terminado» (→ P-015 «Acceso finalizado»). |
| RN-101 | No hay datos de prueba con usuarios INVITADO o DESACTIVADO, así que no se puede comprobar el mensaje que verían. |

**Invisibles por diseño (solo backend; no requieren UI):** RN-143 y RN-243 (hash y verificación), RN-251 (validación del servidor), RN-263 y RN-264 (registro de inicio de sesión sin datos personales).

### 3. Flujo de usuario

**Camino feliz:** el usuario ingresa correo y contraseña y pulsa «Iniciar sesión». El botón muestra «Iniciando sesión…» y los campos quedan deshabilitados. Después llega al destino. ✅ No se puede reenviar el formulario mientras está en curso.

**Fricciones y callejones sin salida detectados:**

1. **Callejón sin salida para el usuario INVITADO.** Si no activó su cuenta, el inicio de sesión le muestra el mensaje genérico. La recuperación tampoco le envía correo (RN-258). P-001 no le indica que debe usar su invitación o pedir que se la reenvíen, y no tiene salida.
2. **Usuario bloqueado sin orientación.** El mensaje menciona el bloqueo temporal, pero no dice qué hacer: esperar o restablecer la contraseña, que también desbloquea la cuenta (HU-002). Ese consejo puede darse en el mismo texto para todos los casos sin romper RN-103.
3. **Destino tras el éxito.** El prototipo navega a una pantalla genérica «Panel principal». No respeta `?volver=<ruta>` (§6.2) ni lleva explícitamente a P-002 `/panel`.
4. **Error técnico o de red.** No está definido ni simulado. Si el servidor responde 500 o no hay conexión, no se sabe qué ve el usuario. Mostrar el mensaje de credenciales en ese caso lo induciría a error.
5. **Contrato terminado.** No está simulado (ver RN-152).

---

### 4. Observaciones

| # | Observación | Tipo | Severidad | Acción sugerida | HU / RN afectada |
|---|---|---|---|---|---|
| 1 | No existe el estado «Contrato terminado» (`403 CONTRATO_TERMINADO`), que debería navegar a P-015 «Acceso finalizado». | gap | Alta | Agregar el estado al prototipo con un control «Forzar contrato terminado» y la navegación simulada a P-015. | HU-002 (C7) · RN-152, RN-101 |
| 2 | Un usuario INVITADO que intenta iniciar sesión no tiene salida: recibe el mensaje genérico y la recuperación no le envía correo. | fricción | Alta | Agregar bajo el formulario un texto fijo, igual para todos: «¿Es tu primer ingreso? Usa el enlace de tu invitación o pide a un administrador de tu empresa que te la reenvíe.» Actualizar P-001 en `09-ui-spec.md`. | HU-002 (C2) · RN-101, RN-258, RN-098 |
| 3 | No se simulan cuentas INVITADO ni DESACTIVADO, así que no se puede validar que reciban el mismo mensaje genérico sin crear sesión. | gap | Media | Agregar a las credenciales de prueba `luis@andina.example` (INVITADO) y `marta@andina.example` (DESACTIVADA). | HU-002 (C2) · RN-101, RN-103 |
| 4 | El estado de error técnico o de red (500, sin conexión) no está en la ficha P-001 ni en el prototipo. | gap | Media | Definir el estado en `09-ui-spec.md`: Alert «No se completó la operación. Inténtalo de nuevo. Código de soporte: `idSolicitud`», que conserva el correo. Simularlo en el prototipo. | HU-002 · §0.4 Error de carga, P-015 |
| 5 | Tras el éxito no se respeta `?volver=<ruta>` y el destino no es P-002 `/panel`. | gap | Media | Simular la lectura de `volver` y navegar a esa ruta, o a P-002 si no viene. | HU-002 · §6.2 Guarda de sesión |
| 6 | El usuario bloqueado no sabe cómo salir del bloqueo. | fricción | Media | Ampliar el mensaje único con una ayuda igual para todos los casos: «…Si fallaste varias veces, espera unos minutos o restablece tu contraseña.» No incluir la duración (es un parámetro de instalación) ni los intentos restantes. | HU-002 (C3) · RN-103 |
| 7 | Los textos de regreso difieren de la spec. P-014 dice «Contraseña actualizada. Se cerraron tus sesiones abiertas.», pero el prototipo dice «Tu contraseña fue actualizada. Inicia sesión con la nueva.» y omite que se cerraron las sesiones. P-012 dice «Cuenta activada. Ya puedes iniciar sesión.» y el prototipo usa otra redacción. | comprensión | Media | Unificar los textos con `09-ui-spec.md` (P-012 y P-014) y mantener la mención del cierre de sesiones. | HU-002 (criterio de recuperación) |
| 8 | F-01 indica que el correo llega precargado tras la activación; el prototipo muestra el aviso pero deja el campo vacío. | fricción | Baja | Precargar el correo cuando se llega con `aviso=activada`. Aclarar en la spec cómo se pasa el correo sin exponerlo en la URL (PRINCIPIO-005). | HU-002 (activación) · F-01 |
| 9 | Al cargar, el foco no se coloca en «Correo electrónico» (solo ocurre al volver de otra vista). | gap | Baja | Poner el foco inicial en el campo de correo, como pide la ficha P-001 en el estado «Inicial». | HU-002 · PRINCIPIO-010 |
| 10 | No se simula la consulta de sesión al cargar (#3 `GET /autenticacion/sesion`), que redirige si ya hay sesión vigente. | gap | Baja | Agregar el control «Ya hay sesión vigente» con redirección simulada a P-002. | HU-002 · RN-149 |
| 11 | No hay aviso previo antes de que la sesión venza por inactividad; el usuario puede perder lo que estaba escribiendo. | mejora | Baja | Resolver el supuesto UI-6 con el responsable del producto. Pantalla afectada: el shell, no P-001. | HU-002 (C6) · RN-149 |
| 12 | El layout Acceso de la spec (§3.3) incluye el pie «Conexión segura · Ayuda», que el prototipo omite. «Ayuda» sería la salida natural para los casos de las observaciones 2 y 6. | mejora | Baja | Incluir el enlace «Ayuda» o decidir quitarlo de §3.3. | HU-002 · §3.3 |
| 13 | La validación del correo en el cliente exige un punto en el dominio, más estricto que la spec, que solo pide «@». | comprensión | Baja | Alinear el prototipo y la spec. La validación definitiva es del servidor. | HU-002 · RN-139 |

---

### 5. Decisiones recomendadas antes de implementar

1. **Agregar el estado «Contrato terminado»** a P-001 y su navegación a P-015 (obs. 1).
2. **Agregar la orientación para usuarios INVITADO** como texto fijo en P-001 y registrarla en `09-ui-spec.md` (obs. 2).
3. **Definir en la ficha P-001 el estado de error técnico o de red** y simularlo (obs. 4).
4. **Ampliar el mensaje único de RN-103** con la ayuda «espera o restablece tu contraseña», sin revelar si la cuenta existe ni si está bloqueada (obs. 6). Validarlo con el responsable de seguridad.
5. **Completar los datos de prueba** con usuarios INVITADO y DESACTIVADO (obs. 3).
6. **Respetar `?volver=`** y navegar a P-002 por defecto (obs. 5).
7. **Unificar los textos de regreso** con P-012 y P-014 (obs. 7).
8. Ajustes menores que pueden ir al backlog: foco inicial, correo precargado, consulta de sesión al cargar, enlace «Ayuda», regla del correo en el cliente y UI-6 (obs. 8 a 13).

### 6. Score de completitud

| Métrica | Cálculo | Resultado |
|---|---|---|
| HUs Must cubiertas (sobre el total del MVP) | 1 de 10, y solo parcial (HU-002) | **10 %** (lo esperable para una pantalla de una sola HU) |
| Criterios de HU-002 aplicables a P-001 | 5 ✅ + 1 parcial (×0.5) de 8 | **69 %** |
| Reglas reflejables en P-001 | RN-103, RN-139, RN-216, RN-250 y RN-252 ✅; RN-101 y RN-149 parciales (×0.5); RN-152 ❌ → 6 de 8 | **75 %** |
| Reglas solo de backend (no requieren UI) | RN-143, RN-243, RN-251, RN-263 y RN-264 | Fuera del cálculo |

**Veredicto:** P-001 está **lista con ajustes**. El camino feliz y el bloqueo están bien resueltos. Antes de implementar deben cerrarse las observaciones Alta (1 y 2) y las Media (3 a 7).

---

## P-002 Panel de cartera

**Prototipo revisado:** `prototipos/p002-panel-cartera/p002-panel-cartera.png`, con `index.html` y `app.js` para comprobar los estados y la lógica simulada.
**Fuentes contrastadas:** `06-user-stories.md` (HU-008; HU-011 y HU-012, que son Should), `03-reglas-de-negocio.md` (RN-036, RN-046 a RN-049, RN-053, RN-069, RN-071, RN-075, RN-105, RN-106, RN-107 a RN-111, RN-119, RN-120, RN-147, RN-169 a RN-171, RN-180 a RN-182, RN-205 a RN-210), `09-ui-spec.md` (P-002, §1 inventario, §3.1 shell, P-005, P-006, P-007, P-010, P-011).
**Condiciones del prototipo:** fecha de corte 2026-11-09 08:15, rol OPERADOR, banderas `FUNCIONALIDAD_S1` y `FUNCIONALIDAD_S5` activas, ventana de 15 días y moneda S/.

### 1. Cobertura de HUs

P-002 es la pantalla principal de **HU-008**. También es la entrada a otras HUs Must, que se validan en sus propias pantallas.

| HU | Prioridad | ¿Representada en P-002? | Detalle |
|---|---|---|---|
| HU-008 Consultar el panel de cartera y vencimientos | Must | **Sí (casi completa)** | Indicadores, selector de moneda, proyección con tabla, listado, corte y estados están presentes. Falta simular cómo se inicializa la moneda según la preferencia personal o la de la empresa (RN-105). |
| HU-005 Registrar comprobantes | Must | Solo acceso | CTA «Registrar comprobante» en el estado vacío. Lleva a un destino equivocado (obs. 5). |
| HU-010 Enviar avisos | Must | Solo acceso | Botón «Ir a avisos» y menú «Avisos» hacia P-007. Falta el subítem Bandeja (P-008) (obs. 4). |
| HU-002 (cerrar sesión), HU-003 (usuarios), HU-009 (configuración) | Must | **No accesibles** | El shell no tiene menú de usuario ni sección «Admin» según el rol (obs. 2 y 4). |
| HU-001, HU-004, HU-006, HU-007 | Must | No aplica | Se validan en otras pantallas. |
| HU-011 Promesas (S1) · HU-012 Tiempo promedio de cobro (S5) | Should | Sí, detrás de banderas | El bloque de promesas solo muestra promesas por cobrar (obs. 6). La tarjeta S5 cumple sus criterios. |

**Criterios de HU-008 aplicables a P-002:**

| # | Criterio (resumen) | Estado en el prototipo |
|---|---|---|
| C1 | Cuatro indicadores: S/ 4,500.00 · S/ 0.00 · S/ 8,000.00 · S/ 2,000.00. Las canceladas no suman y no se mezcla S/ con US$ | ✅ Los valores coinciden exactamente |
| C2 | Ana abre en US$ por su preferencia y Luis en S/. El cambio del selector no se guarda | ◐ El texto «Solo cambia esta consulta» y la no persistencia están bien. La apertura según la preferencia no se simula: siempre abre en S/ |
| C3 | Ventana de 10 días, días sin vencimientos en 0.00, saldo en lugar del importe, series separadas y tabla accesible | ✅ |
| C4 | 7 días por defecto, solo 7, 10 o 15, y la ventana no limita el listado | ✅ El listado muestra cuotas hasta el 2026-12-10 |
| C5 | Orden: VENCIDAS por fecha ascendente, luego PENDIENTES | ✅ Las CANCELADAS y ANULADAS van al final |
| C6 | Anulados excluidos por defecto. Con el interruptor aparecen como ANULADO y ANULADA y los indicadores no cambian | ✅ |
| C7 | Leyenda «Datos al 09/11/2026, 08:15» y corte común. Actualizar cambia todo junto | ✅ El criterio se cumple, pero el estado intermedio «Actualizando» no sigue la spec (obs. 3) |
| C8 | Un usuario sin preferencia abre con la moneda por defecto de la empresa | ❌ No se simula, y un OPERADOR ve «Configuración» en el menú (obs. 4 y 7) |
| C9 | Empresa sin comprobantes: indicadores y gráfico en 0.00 y listado vacío | ✅ Estado «Vacío» (con CTA mal enlazado, obs. 5) |
| C10 | Cuota que vence hoy = PENDIENTE; al día siguiente, VENCIDA | ✅ Por lógica (`venc < HOY`), aunque no hay datos que lo muestren |
| C11 | Ventana de 15 días: lo que vence en el día 16 sale del gráfico pero no del listado | ✅ Visible en la captura (09/11 a 23/11) |
| C12 | Solo hay vencidas en US$ y el selector está en S/: el selector avisa | ✅ Chip «• Vencidos» y texto «US$ tiene cuotas vencidas.» |
| C13, C14 | Permisos del API y aislamiento entre empresas | Fuera del alcance de la UI (backend) |

### 2. Reglas de negocio

**Reflejadas en la UI:**

| RN | Cómo se refleja |
|---|---|
| RN-046, RN-107 a RN-110 | Cuatro tarjetas que aparecen aunque valgan cero («Vencida por pagar: S/ 0.00 · 0 cuotas»). Las vencidas se marcan en rojo solo si son mayores que cero. |
| RN-047 | Ningún total mezcla monedas. El encabezado de columna dice «Importe (S/)». |
| RN-048 | Una barra por día de la ventana desde la fecha de cálculo, en dos series (los pagos con trama), con saldo y no importe. Tabla equivalente y total textual. |
| RN-049 | Estados PENDIENTE, VENCIDA y CANCELADA. Interruptor «Incluir comprobantes anulados» con la marca «(ANULADO)», el estado ANULADA y saldo «—». La opción «Anulada» del filtro solo aparece con el interruptor activo. |
| RN-069 | Selector S/ o US$, con S/ por defecto, aplicado a los indicadores, el gráfico y el listado, con indicador textual de vencidos en la otra moneda y sin importes. |
| RN-071, RN-075 | Con S1, el listado usa la fecha efectiva (la de la promesa) y muestra la marca «Reprogramada». |
| RN-111 | El selector de rol de la demo no cambia el contenido del panel: todos los roles ven lo mismo. |
| RN-119, RN-180, RN-182 | Solo hay tres opciones de ventana (7, 10, 15). Por defecto es 7. Al cambiarla aparece «Ventana de N días guardada como tu preferencia.» |
| RN-120 | Orden predeterminado con una nota bajo la tabla. Ordenar por columna es opcional y reversible. |
| RN-181 | El listado no se limita a la ventana. |
| RN-207, RN-209 | Leyenda «Datos al DD/MM/AAAA, HH:mm». «Actualizar» trae un nuevo corte y lo anuncia por `aria-live`. |
| RN-053, RN-147 (S5) | La tarjeta lleva el título exacto, dos decimales y «Sin datos» cuando no hay valor (distinto de «0.00 días»). Abre en octubre (último mes completo). Noviembre muestra «Mes en curso — datos parciales» y no se ofrecen meses futuros. El valor no depende de la moneda. |

**Parciales o no reflejadas (gaps):**

| RN | Gap |
|---|---|
| RN-105 (y RN-106 como origen) | El selector siempre arranca en S/. No hay forma de simular la preferencia personal ni la moneda de la empresa. |
| RN-169 | La ventana sí se guarda, pero la preferencia de moneda no es accesible: no hay enlace a P-011 «Mis preferencias». |
| RN-210 | En «Actualizando», el prototipo reemplaza el contenido por esqueletos y la leyenda por «Consultando datos…» antes de tener datos nuevos. La spec pide conservar el contenido al 60 % con `aria-busy`. |
| RN-071 (sin S1) | Con S1 desactivado, la cuota de ELECTRO HOGAR PERÚ sigue PENDIENTE al 2026-11-10 (la fecha de la promesa). Sin S1 debería usar el vencimiento original 2026-11-02 y estar VENCIDA. |
| RN-036 (S1) | El bloque de promesas filtra `sentido === 'cobrar'`, así que oculta la promesa activa de TEXTILES SUR (por pagar). Además, no comprueba si la promesa ya está INCUMPLIDA. |

**Invisibles por diseño (solo backend; no requieren UI):** RN-170 y RN-171 (nadie ve ni cambia la preferencia de otro), RN-180 en el servidor (rechazar 30 días), RN-205, RN-206 y RN-208 (corte y lectura coherente con precisión completa), el aislamiento entre empresas (HU-008 C14) y la consulta de mes inválido de S5.

### 3. Flujo de usuario

**Camino feliz (priorizar la mañana):** el usuario abre el panel, lee los cuatro indicadores y pulsa «Ver ▸» en «Vencida por cobrar». El listado se filtra, recibe el foco y muestra «6 de 22 cuotas en S/». Al abrir un comprobante llega a P-006 (simulado). ✅ La tarea principal se completa en tres pasos.

**Fricciones y callejones sin salida detectados:**

1. **Filtro invisible después de «Ver ▸».** El enlace aplica el filtro de estado (`S.filtro.estado = 'VENCIDA'`), pero el desplegable «Estado» sigue mostrando «Todos» (`renderMov()` no lo sincroniza). El usuario ve un listado recortado sin causa visible. Volver a elegir «Todos» no dispara `change`, así que no puede quitar el filtro: tiene que pasar por otro valor o recargar. «Limpiar filtros» solo aparece cuando no hay resultados.
2. **Sin salida a preferencias ni a cerrar sesión.** El encabezado muestra «Marcela Quispe · Operador» como texto plano, sin el menú de usuario de §3.1 («Mis preferencias», «Cerrar sesión»). El usuario no puede fijar su moneda preferida (RN-105, RN-169) ni salir de la aplicación.
3. **Menú que no depende del rol.** El OPERADOR ve «Configuración», que es P-010 y solo para ADMINISTRADOR. Llegaría a un 403. El ADMINISTRADOR no tiene «Usuarios» (P-009). «Avisos» no separa «Por avisar» y «Bandeja».
4. **Destinos equivocados.** El CTA del estado vacío «Registrar comprobante» apunta a «P-006». El menú enlaza Comprobantes → «P-006», Contactos → «P-008» y Configuración → «P-020». Según el inventario (§1), los destinos correctos son P-005, P-004, P-003 y P-010.
5. **Actualizar oculta el contexto.** Durante la recarga desaparecen los datos y la leyenda. El usuario pierde de vista lo que estaba analizando (RN-210).
6. **Error al guardar la ventana.** No se simula el fallo de #17 `PUT /mi-cuenta/preferencias`, que según la spec mantiene la ventana anterior y muestra el error.

---

### 4. Observaciones

| # | Observación | Tipo | Severidad | Acción sugerida | HU / RN afectada |
|---|---|---|---|---|---|
| 1 | «Ver ▸» aplica el filtro de estado sin reflejarlo en el desplegable «Estado», que sigue en «Todos». El usuario no ve por qué faltan filas y no puede quitar el filtro eligiendo «Todos». | fricción | Alta | Sincronizar todos los controles de filtro al aplicar «Ver ▸» (llamar a `renderAll()` o fijar `#f-estado`). Mostrar «Limpiar filtros» siempre que haya un filtro activo, no solo sin resultados. | HU-008 · RN-107 a RN-110 · P-002 |
| 2 | El shell no tiene menú de usuario con «Mis preferencias» (P-011) ni «Cerrar sesión». La preferencia de moneda no es accesible y el usuario no puede cerrar sesión. | gap | Alta | Agregar el `DropdownMenu` de §3.1 con nombre, rol, «Mis preferencias» y «Cerrar sesión». Al ser el primer prototipo con shell, P-002 debe fijarlo para el resto. | HU-008 (C2) · HU-002 · RN-105, RN-169 · P-011 |
| 3 | El estado «Actualizando» se confunde con «Cargando»: borra el contenido y cambia la leyenda a «Consultando datos…» antes de tener datos nuevos. | gap | Media | Separar los estados. Al actualizar, mantener el contenido al 60 % con `aria-busy` y la leyenda anterior, y reemplazar todo junto al llegar el nuevo corte. | HU-008 (C7) · RN-209, RN-210 |
| 4 | El menú no depende del rol: el OPERADOR ve «Configuración» (P-010, solo ADMINISTRADOR), el ADMINISTRADOR no ve «Usuarios» (P-009) y faltan los subítems de Avisos (P-007 y P-008). | gap | Media | Hacer que el selector de rol de la demo cambie el menú según §3.1: sección «Admin» solo para ADMINISTRADOR y «Avisos» con «Por avisar» y «Bandeja». | HU-008 (C8) · HU-003 · HU-009 · HU-010 · RN-106 |
| 5 | Los destinos de navegación no coinciden con el inventario: el CTA «Registrar comprobante» va a P-006, Comprobantes a P-006, Contactos a P-008 y Configuración a P-020. | gap | Media | Corregir a P-005, P-004, P-003 y P-010. Nombrar P-007 «Cuotas por avisar», como en la spec. | HU-005 · HU-004 · HU-009 · HU-010 · §1 |
| 6 | El bloque «Promesas de pago activas» excluye las promesas por pagar (la reprogramación de TEXTILES SUR no aparece) y no descarta las promesas ya INCUMPLIDAS. Si se incluyera esa fila, «Registró» saldría `undefined` porque el dato de prueba no tiene usuario. | gap | Media | Mostrar todas las promesas ACTIVAS, por cobrar y por pagar, con una columna «Sentido». Excluir las que tengan fecha anterior al corte. Completar el dato `por`. | HU-011 · RN-036, RN-071 |
| 7 | No se simula la inicialización de la moneda (preferencia personal, luego la de la empresa, luego S/). No se pueden validar los criterios C2 y C8 con stakeholders. | gap | Media | Agregar a los controles de la demo «Preferencia personal: ninguna / S/ / US$» y «Moneda de la empresa: S/ / US$», y abrir el panel según RN-105. | HU-008 (C2, C8) · RN-105, RN-106 |
| 8 | No se simula el fallo al guardar la ventana (#17): la spec pide mantener la ventana anterior y mostrar el error. Tampoco se recarga el panel con un nuevo corte tras el cambio. | gap | Baja | Agregar el control «Forzar error al guardar preferencia» y la recarga con nuevo corte tras el éxito. | HU-008 (C4) · RN-119, RN-209 |
| 9 | Con la bandera S1 desactivada, las cuotas con promesa siguen usando la fecha de la promesa y su estado. La demo no muestra cómo se vería la pantalla sin S1. | comprensión | Baja | Al desactivar S1, usar el vencimiento original. Por ejemplo, F001-00048 pasaría a VENCIDA con 7 días de atraso. | HU-008 (nota S1) · RN-071 |
| 10 | La fecha original de una cuota reprogramada solo aparece en el `title` del badge, que no es accesible por teclado ni en pantallas táctiles. | mejora | Baja | Mostrar «Reprogramada · original 2026-11-02» en el texto o en la tarjeta móvil. Valorar si la columna debe llamarse «Vencimiento efectivo» cuando S1 está activa. | HU-011 · RN-075, RN-071 |
| 11 | Los textos de los estados vacíos difieren de la spec. El prototipo dice «Aún no hay cuotas en S/.» y la spec «Todavía no hay comprobantes.». El prototipo dice «Ningún movimiento coincide…» y la spec «Ninguna cuota coincide…». | comprensión | Baja | Unificar. El texto del prototipo es más correcto cuando solo hay cuotas en la otra moneda; conviene llevarlo a `09-ui-spec.md`. | HU-008 (C9) · P-002 Estados |
| 12 | El bloque de promesas no se filtra por el selector de moneda, a diferencia del resto del panel, y RN-036 dice «panel de notificaciones», un término que no existe en el inventario de pantallas. | comprensión | Baja | Decidir si las promesas siguen el selector (RN-069) y renombrar en RN-036 y HU-011 «panel de notificaciones» → P-002 bloque de promesas o P-007. | HU-011 · RN-036, RN-069 |
| 13 | La spec no define paginación ni carga progresiva para el listado (su ejemplo tiene 128 cuotas) y #42 no tiene parámetros de página. | mejora | Baja | Definir el límite (paginación o «Cargar más») y cómo convive con el contador «N de M cuotas». | HU-008 · RN-120 |
| 14 | El selector de meses de S5 empieza en enero de 2026. No está definido hasta qué mes pasado se puede consultar. | comprensión | Baja | Fijar el rango (por ejemplo, desde el primer comprobante de la empresa) en la ficha P-002. | HU-012 · RN-147 |

---

### 5. Decisiones recomendadas antes de implementar

1. **Corregir la sincronización de filtros** al usar «Ver ▸» y mostrar siempre «Limpiar filtros» cuando hay un filtro activo (obs. 1).
2. **Completar el shell**: menú de usuario con «Mis preferencias» y «Cerrar sesión», y menú lateral según el rol de §3.1. Como P-002 es la primera pantalla con shell, esta decisión se hereda en P-003 a P-011 (obs. 2 y 4).
3. **Separar «Actualizando» de «Cargando»** para cumplir RN-210 (obs. 3).
4. **Corregir los destinos de navegación** según el inventario de §1 (obs. 5).
5. **Ampliar el bloque de promesas** a ambos sentidos y excluir las incumplidas. Decidir si sigue el selector de moneda y alinear la terminología de RN-036 (obs. 6 y 12).
6. **Simular la inicialización de moneda** (preferencia personal, luego la de la empresa, luego S/) para validar HU-008 C2 y C8 (obs. 7).
7. Ajustes menores que pueden ir al backlog: error de #17, vista sin S1, fecha original visible, textos de estados vacíos, paginación del listado y rango de meses de S5 (obs. 8 a 11, 13 y 14).

### 6. Score de completitud

| Métrica | Cálculo | Resultado |
|---|---|---|
| HUs Must cubiertas (sobre el total del MVP) | 1 de 10 cubierta (HU-008). HU-005 y HU-010 solo tienen acceso. HU-002, HU-003 y HU-009 no son accesibles desde el shell | **10 %** (lo esperable: P-002 es la pantalla de una HU) |
| Criterios de HU-008 aplicables a P-002 | 10 ✅ + 1 parcial (×0.5) de 12 (C13 y C14 son de backend) | **88 %** |
| Reglas Must reflejables en P-002 | 17 ✅ (RN-046, 047, 048, 049, 069, 107, 108, 109, 110, 111, 119, 120, 180, 181, 182, 207, 209); 3 parciales ×0.5 (RN-071, 169, 210); 1 ❌ (RN-105) → 18.5 de 21 | **88 %** |
| Reglas Should reflejables (S1/S5) | RN-053, RN-075 y RN-147 ✅; RN-036 parcial → 3.5 de 4 | **88 %** |
| Reglas solo de backend (no requieren UI) | RN-170, RN-171, RN-205, RN-206 y RN-208; validación de ventana y de mes en el servidor | Fuera del cálculo |

**Veredicto:** P-002 está **lista con ajustes**. Los indicadores, la proyección, el orden, los anulados y la tarjeta S5 siguen fielmente las reglas y los ejemplos del Spec Pack. Antes de implementar deben cerrarse las observaciones Alta (1 y 2), porque afectan la tarea principal de priorizar y la salida del usuario, y las Media (3 a 7).

---

## P-003 Contactos

**Agente:** Prototype Reviewer (`agent-prototyper-reviewer-3.xml`).
**Fecha:** 2026-11-11.
**Prototipo revisado:** P-003 Contactos, con sus diálogos P-003.D1 y P-003.D2 (`prototipos/p003-contactos/p003-contactos.png`, `p003-contactos-nuevo.png`, `p003-contactos-edicion.png`). Las capturas no muestran el menú de acciones ni el diálogo de eliminación, así que también se revisaron `index.html` y `app.js` para ver qué estados simula el prototipo.
**Fuentes contrastadas:** `06-user-stories.md` (HU-004, HU-013), `03-reglas-de-negocio.md` (RN-006, RN-044, RN-060, RN-126 a RN-130, RN-139, RN-155, RN-160, RN-162, RN-254 a RN-256), `09-ui-spec.md` (P-003, P-003.D1, P-003.D2, §0.4, UI-3, UI-7).
**Enfoque:** gaps funcionales; la estética no se evalúa.

### 1. Cobertura de HUs

| HU | Prioridad | ¿Representada en P-003? | Detalle |
|---|---|---|---|
| HU-004 Gestionar el catálogo de contactos | Must | **Sí, casi completa** | Están crear, editar, desactivar, reactivar, eliminar con confirmación, buscar, filtrar por estado y «Ver comprobantes» (navegación simulada a P-004). Faltan el historial consultable, el estado 404 y el caso del comprobante anulado. |
| HU-013 Indicador de comportamiento de pago | Should (pendiente) | Sí, detrás de una bandera | Columna «Comportamiento» (por ejemplo «88 · Buen pagador») oculta por defecto. No aparece en el diálogo del contacto, aunque UI-3 lo propone. |
| HU-001 a HU-003, HU-005 a HU-010 | Must | No aplica | Se validan en sus propias pantallas. HU-005 usa el alta rápida P-003.D1 desde P-005, que se valida en P-005. |

**Criterios de HU-004:**

| # | Criterio (resumen) | Estado en el prototipo |
|---|---|---|
| C1 | «  Distribuidora   Lima  » y « Ventas@DistLima.example » se guardan como «DISTRIBUIDORA LIMA» y «ventas@distlima.example», en estado ACTIVO y sin pedir DNI, RUC ni CCI | ✅ Normaliza, crea en ACTIVO, el toast muestra el valor guardado y la nota fija dice que no se piden esos datos |
| C2 | Correo duplicado en la empresa, incluso de un contacto DESACTIVADO, se rechaza | ✅ La comparación incluye a los desactivados. El texto del error difiere de la spec (obs. 9) |
| C3 | Nombre de 251 caracteres, nombre de solo espacios o «ventas@distlima» se rechazan sin truncar | ✅ El campo no tiene `maxlength`; el error indica el motivo y la longitud |
| C4 | Un contacto con comprobantes, aunque estén anulados, no se elimina y se ofrece desactivarlo; sin comprobantes, se elimina tras confirmar | ◐ La confirmación está bien (foco en «Cancelar»). Con comprobantes, la opción «Eliminar» desaparece sin explicación (obs. 1) y no se modela el caso del comprobante anulado (obs. 2) |
| C5 | Un contacto DESACTIVADO no se puede elegir en un comprobante nuevo, pero sus cuotas siguen en la lista de avisos | ◐ La parte de selección pertenece a P-005. P-003 no informa ninguna de las dos consecuencias al desactivar (obs. 6) |
| C6 | Se registra el valor anterior, el nuevo, el usuario y la fecha y hora de cada campo editado | ◐ Solo una nota fija lo anuncia; el historial no se puede consultar (obs. 5) |
| C7 | Nombre y correo de exactamente 250 caracteres se aceptan; un correo de 251 se rechaza | ✅ Cuenta caracteres, no bytes |
| C8 | Se aceptan nombres con tildes, «&», «'» o dígitos; se rechazan «123», «...», «Cliente #1» y «Cliente_SAC» | ✅ |
| C9 | Tras eliminar un contacto, su correo se reutiliza en otro con un identificador nuevo y sin el historial anterior | ✅ El correo queda libre y el nuevo contacto recibe otro identificador |
| C10 | Al reactivar, el contacto vuelve a ACTIVO y se puede elegir de nuevo | ✅ El toast lo confirma |
| C11 | Un contacto de otra empresa responde 404, igual que uno inexistente | ❌ No hay estado «contacto no encontrado» al editar, desactivar o eliminar (obs. 4) |
| C12 | Con la lista vacía no se muestran resultados ni contactos de otras empresas | ✅ Estado «Aún no tienes contactos» con el botón «+ Nuevo contacto» |
| C13 | Si se elimina un contacto mientras otro usuario le registra un comprobante, solo se completa una operación | ✅ Se simula con «Comprobante concurrente al eliminar»: el diálogo cambia y ofrece «Desactivar contacto» |

### 2. Reglas de negocio

**Reflejadas en la UI:**

| RN | Cómo se refleja |
|---|---|
| RN-006 / RN-126 | Solo el nombre y el correo son obligatorios (*); el teléfono y la dirección son «(opcional)». Nota fija: «VenceYa no solicita DNI, RUC ni datos bancarios», en el formulario y al pie del listado. |
| RN-044 / RN-162 (correo) | Correo obligatorio de hasta 250 caracteres con una sola «@», sin espacios y con un punto en el dominio. |
| RN-127 | Ayuda bajo el correo: «Se guarda en minúsculas y debe ser único en tu empresa, incluso entre contactos desactivados». El duplicado se valida contra todos los contactos y la eliminación libera el correo. |
| RN-128 | Columna «Relación» derivada (Cliente, Proveedor, Cliente y proveedor, Sin comprobantes) y nota: «La relación… se deriva de los comprobantes; no se asigna al crear el contacto». |
| RN-139 | El correo se recorta y pasa a minúsculas. |
| RN-162 (nombre) | Contador «0/250», ayuda «Letras, números, espacios y . , & - ' ( ) /». Recorte, reducción de espacios internos, conversión a mayúsculas y mensajes por motivo (falta, longitud, sin letra, caracteres no permitidos), además de un resumen de errores con enlaces a los campos. |
| RN-060 | El selector de rol del prototipo confirma que Operador, Supervisor y Administrador tienen el mismo catálogo y las mismas acciones. |
| RN-254 / RN-256 | Solo existen los estados ACTIVO y DESACTIVADO, sin seudonimización. Al desactivar, el toast dice que los datos, los comprobantes y el historial se conservan; no lo presenta como un borrado de datos personales. |
| RN-255 | «Eliminar» solo aparece en contactos «Sin comprobantes», y el diálogo P-003.D2 aclara que el historial se conserva. |
| RN-129 (parcial) | Se pueden editar contactos ACTIVO y DESACTIVADO con las mismas validaciones del alta. ❌ El historial por campo no se puede consultar. |
| RN-130 (parcial) | Los dos estados, la confirmación y la verificación concurrente funcionan. ❌ No se modela el caso de «solo comprobantes anulados» ni se explica por qué no se puede eliminar un contacto con comprobantes. |
| RN-160 (parcial) | Se simula la concurrencia entre eliminar y registrar un comprobante. ❌ No se simula la concurrencia en editar, desactivar ni reactivar. |

**No reflejadas (gaps):**

| RN | Gap |
|---|---|
| RN-129 | La UI no dice que los avisos posteriores a un cambio de correo irán al correo nuevo, ni deja consultar el historial (depende de UI-7). |
| RN-155 / RN-130 | Al desactivar, la UI no dice que las cuotas con saldo del contacto se seguirán pudiendo avisar ni que el contacto dejará de aparecer al registrar comprobantes. |
| RN-162 | No define reglas para el teléfono ni la dirección (longitud, caracteres, mayúsculas). El prototipo los guarda sin validar y la dirección queda con mayúsculas y minúsculas mezcladas («Mz. B Lt. 4, San Martín de Porres»). |

**Invisibles por diseño (solo backend; no requieren UI):** RN-127 y RN-140 (comparación del correo cifrado y liberación de la reserva), RN-224 y RN-226 (índices de búsqueda), la parte de RN-130 que pide verificar en el servidor antes de eliminar, y el aislamiento entre empresas, cuya expresión en la UI es el 404 de la obs. 4.

### 3. Flujo de usuario

**Camino feliz:**

- **Crear:** «+ Nuevo contacto» abre el diálogo D1 con el foco en «Nombre». «Guardar contacto» muestra «Guardando…» y bloquea el doble envío. El diálogo se cierra, la fila nueva se resalta y el listado salta a la página donde quedó. El toast muestra el valor normalizado. ✅
- **Editar:** desde el menú «⋯ → Editar», el diálogo llega con los datos cargados y el botón «Guardar cambios». ✅
- **Desactivar y reactivar:** se hacen en un clic desde el menú, con un toast. ✅
- **Eliminar:** desde el menú «⋯ → Eliminar», se abre P-003.D2 con el foco en «Cancelar» y la confirmación. ✅

**Fricciones y callejones sin salida detectados:**

1. **Callejón sin salida por correo duplicado.** Al crear un contacto cuyo correo pertenece a uno DESACTIVADO, el usuario recibe «Este correo ya está registrado en tus contactos». El filtro por defecto es «Activos» y la búsqueda es solo por nombre, así que no tiene cómo encontrar al contacto que ya usa ese correo para reactivarlo o editarlo. Es el caso más probable cuando alguien vuelve a trabajar con un cliente antiguo.
2. **«Eliminar» desaparece sin explicación.** En un contacto con comprobantes, el menú solo muestra «Editar · Ver comprobantes · Desactivar». El usuario no sabe por qué no puede eliminarlo, y HU-004 (C4) pide que el sistema «lo rechace y ofrezca desactivarlo».
3. **Contacto que ya no existe.** Si otro usuario eliminó el contacto mientras este tenía el menú o el diálogo de edición abierto, no está definido qué ve al guardar o al desactivar (HU-004 C11).
4. **Desactivar sin anticipar las consecuencias.** La acción es inmediata y no avisa de que el contacto no se podrá elegir en comprobantes nuevos ni de que sus cuotas seguirán avisándose. No es un callejón (se puede reactivar), pero el toast desaparece a los 5 s sin un atajo «Reactivar».
5. **Errores en desactivar y reactivar.** Estas acciones no tienen estado de carga ni de error simulado; un fallo del servidor quedaría sin representar.

---

### 4. Observaciones

| # | Observación | Tipo | Severidad | Acción sugerida | HU / RN afectada |
|---|---|---|---|---|---|
| 1 | En un contacto con comprobantes, «Eliminar» se oculta sin explicación; el usuario no entiende por qué no puede eliminarlo ni recibe la oferta de desactivarlo que pide el criterio. | fricción | Alta | Mostrar «Eliminar» deshabilitado con la razón («Tiene comprobantes registrados, incluidos los anulados. Puedes desactivarlo.»), o mantenerlo activo y abrir una variante de P-003.D2 que ofrezca «Desactivar contacto». Actualizar el menú de P-003 en `09-ui-spec.md`. | HU-004 (C4) · RN-130 |
| 2 | No se modela un contacto cuyos únicos comprobantes están anulados. Si «Relación» los excluye, el contacto aparece como «Sin comprobantes», se ofrece «Eliminar» y D2 afirma «El contacto no tiene comprobantes registrados», lo cual es falso; el servidor lo rechazaría. | gap | Alta | Definir en `09-ui-spec.md` y `07-openapi.yaml` que la posibilidad de eliminar viene de un campo del API (por ejemplo `tieneComprobantes`) que cuenta los anulados, independiente de la relación. Agregar a los datos de prueba un contacto con solo un comprobante ANULADO. | HU-004 (C4) · RN-130, RN-128 |
| 3 | Un correo duplicado de un contacto DESACTIVADO lleva a un callejón: la búsqueda es solo por nombre, el filtro por defecto es «Activos» y el error no dice qué contacto usa el correo. | fricción | Media | En el error `CORREO_CONTACTO_YA_REGISTRADO`, devolver el identificador y el nombre del contacto existente (es de la misma empresa) y ofrecer «Ver contacto» o «Reactivar». Otra opción: permitir buscar por correo exacto con el índice ciego de RN-140. | HU-004 (C2) · RN-127, RN-130 |
| 4 | No existe el estado «contacto no encontrado» (404) al editar, desactivar, reactivar o eliminar un contacto que otro usuario eliminó o que no pertenece a la empresa. | gap | Media | Definirlo en la ficha P-003: Alert «Este contacto ya no existe. Actualizamos la lista.», cerrar el diálogo y refrescar. Simularlo con un control «Contacto eliminado por otro usuario». | HU-004 (C11) · RN-130, RN-160 |
| 5 | El historial por campo solo se anuncia con una nota fija («Cada cambio queda registrado…») y no se puede consultar. | gap | Media | Resolver UI-7 con el responsable del producto. Si el MVP lo incluye, agregar «Ver historial de cambios» en D1 y su operación en `07-openapi.yaml`; si no, decidir si la nota se mantiene, porque promete algo que el usuario no puede ver. | HU-004 (C6) · RN-129, RN-083 |
| 6 | Al desactivar no se informa que el contacto deja de aparecer en comprobantes nuevos ni que sus cuotas con saldo se seguirán avisando. | comprensión | Media | Ampliar el toast: «…Ya no aparecerá al registrar comprobantes; sus cuotas con saldo se pueden seguir avisando.» y agregar la acción «Deshacer» (reactivar). Registrarlo en P-003. | HU-004 (C5) · RN-130, RN-155, RN-254 |
| 7 | RN-162 no define longitud, caracteres ni conversión a mayúsculas para el teléfono y la dirección. El prototipo los acepta sin límites y guarda la dirección sin convertirla, a diferencia del nombre. | gap | Media | Agregar el teléfono y la dirección a la tabla de RN-162 (por ejemplo, teléfono de 0 a 20 caracteres con dígitos, espacios, «+», «-» y paréntesis; dirección de 0 a 250 caracteres, en mayúsculas o no) y reflejarlo en D1. | HU-004 · RN-126, RN-162 |
| 8 | Editar, desactivar y reactivar no simulan carga, error del servidor ni concurrencia; solo crear y eliminar lo hacen. | gap | Baja | Agregar el estado «Desactivando…» y el error persistente; definir qué pasa si dos usuarios editan el mismo contacto a la vez (¿gana el último o se aplica `DATOS_DESACTUALIZADOS`?). | HU-004 · RN-160 |
| 9 | El texto del correo duplicado difiere de la spec. El prototipo dice «Este correo ya está registrado en tus contactos.» y P-003.D1 dice «Ya existe un contacto con este correo en tu empresa (puede estar desactivado).» | comprensión | Baja | Usar el texto de la spec, que orienta mejor (complementa la obs. 3). | HU-004 (C2) · RN-127 |
| 10 | El error al guardar muestra «Código: CON-500» en lugar del código de soporte `idSolicitud` de §0.4. | comprensión | Baja | Unificar con el patrón de §0.4, igual que en la obs. 4 de P-001. | HU-004 · §0.4 |
| 11 | Al editar un contacto DESACTIVADO, el diálogo no muestra su estado; el usuario puede creer que lo está usando como activo. | mejora | Baja | Mostrar el Badge del estado junto al título «Editar contacto». | HU-004 · RN-129, RN-130 |
| 12 | Al cambiar el correo en la edición, la UI no advierte que los avisos posteriores irán al correo nuevo. | mejora | Baja | Agregar una ayuda condicional cuando el correo cambia: «Los próximos avisos se enviarán a este correo.» | HU-004 · RN-129 |
| 13 | El indicador de HU-013 aparece solo como columna; UI-3 también lo propone en el diálogo del contacto. | comprensión | Baja | Cerrar UI-3 y ajustar el prototipo o la spec. La bandera debe seguir apagada hasta S3. | HU-013 · UI-3 |

---

### 5. Decisiones recomendadas antes de implementar

1. **Explicar por qué no se puede eliminar** un contacto con comprobantes y ofrecer desactivarlo desde ese mismo punto (obs. 1).
2. **Separar «se puede eliminar» de «Relación»** con un dato del API que cuente los comprobantes anulados, y agregar ese caso a los datos de prueba (obs. 2).
3. **Resolver el callejón del correo duplicado**: el error debe identificar al contacto existente y permitir abrirlo o reactivarlo (obs. 3 y 9).
4. **Definir y simular el estado 404** del contacto en todas las acciones del menú (obs. 4).
5. **Cerrar UI-7** (historial consultable) y ajustar la nota fija de D1 según lo que se decida (obs. 5).
6. **Completar RN-162** con las reglas del teléfono y la dirección (obs. 7).
7. **Informar las consecuencias de desactivar** y agregar «Deshacer» (obs. 6).
8. Ajustes menores que pueden ir al backlog: estados de carga y error en desactivar y reactivar, código de soporte, estado visible al editar, aviso de cambio de correo y UI-3 (obs. 8 y 10 a 13).

### 6. Score de completitud

| Métrica | Cálculo | Resultado |
|---|---|---|
| HUs Must cubiertas (sobre el total del MVP) | 1 de 10 (HU-004, casi completa) | **10 %** (lo esperable para una pantalla de una sola HU) |
| Criterios de HU-004 aplicables a P-003 | 9 ✅ + 3 parciales (×0.5) de 13 | **81 %** |
| Reglas reflejables en P-003 | RN-006, RN-044, RN-060, RN-126, RN-127, RN-128, RN-139, RN-162, RN-254, RN-255 y RN-256 ✅; RN-129, RN-130 y RN-160 parciales (×0.5) → 12.5 de 14 | **89 %** |
| Reglas solo de backend (no requieren UI) | RN-140, RN-224, RN-226 y la verificación en el servidor de RN-130 | Fuera del cálculo |
| HU Should | HU-013 detrás de una bandera | Fuera del cálculo |

**Veredicto:** P-003 está **lista con ajustes**. Las validaciones de RN-162, la unicidad del correo y la eliminación concurrente están bien resueltas. Antes de implementar deben cerrarse las observaciones Alta (1 y 2) y las Media (3 a 7).

---

## P-004 Comprobantes

**Agente:** Prototype Reviewer (`agent-prototyper-reviewer-4.xml`).
**Fecha:** 2026-11-11.
**Prototipo revisado:** `prototipos/p004-comprobantes/p004-comprobantes.png`. La captura solo muestra el estado «Con datos» en la pestaña «Todos», así que también se revisaron `index.html` y `app.js` para ver los estados, los filtros y los datos de prueba (16 comprobantes, 3 de ellos ANULADOS).
**Fuentes contrastadas:** `06-user-stories.md` (HU-005, HU-007; HU-004 como origen de «Ver comprobantes»), `03-reglas-de-negocio.md` (RN-001 a RN-005, RN-021, RN-022, RN-046, RN-047, RN-049, RN-060, RN-072, RN-082, RN-090, RN-093, RN-131 a RN-133, RN-153, RN-160), `09-ui-spec.md` (P-004, §0.3, §0.4, §1, §2 F-04, §6, §6.1) y `07-openapi.yaml` (#31 `listarComprobantes`, `ComprobanteResumen`), para comprobar que lo que muestra la pantalla se puede obtener del API.
**Enfoque:** gaps funcionales; la estética no se evalúa.

### 1. Cobertura de HUs

P-004 es un listado de entrada. No implementa por sí sola ninguna HU completa: el registro y la edición están en P-005, y las anulaciones en P-006. Su papel es **encontrar** un comprobante, **ver su situación** y **llegar** al registro o al detalle.

| HU | Prioridad | ¿Representada en P-004? | Detalle |
|---|---|---|---|
| HU-005 Registrar y editar comprobantes a crédito | Must | **Parcial (listado y acceso)** | Lista en moneda original con sentido, contacto, emisión, total, modalidad («Pago único» / «n cuotas»), saldo y estado. «Registrar comprobante» lleva a P-005 desde la cabecera y desde el estado vacío. El registro y la edición se validan en P-005 y P-006. |
| HU-007 Anular un pago o un comprobante | Must | **Parcial (visibilidad)** | Los ANULADOS se ocultan por defecto y aparecen con «Incluir comprobantes anulados», con saldo «—» y fuera de los totales. Las acciones de anular están en P-006 (D2, D3). |
| HU-004 Gestionar contactos | Must | **Destino roto** | P-003 «Ver comprobantes» navega a `/comprobantes?contactoId=`, pero P-004 no tiene filtro por contacto (obs. 2). |
| HU-008 Panel de cartera | Must | Solo menú | Igual que en P-002, el shell no depende del rol (obs. 11). |
| HU-001 a HU-003, HU-006, HU-009, HU-010 | Must | No aplica | Se validan en sus propias pantallas. |

**Criterios de HU-005 y HU-007 que aplican a P-004:**

| # | Criterio (resumen) | Estado en el prototipo |
|---|---|---|
| HU-005 C1 | F001-00045 por US$ 3,000.00 en 3 cuotas se guarda en USD sin conversión | ✅ La fila muestra «US$ 3,000.00 · 3 cuotas» en su moneda original |
| HU-005 C3 | «Pago único» crea una sola cuota | ✅ La columna Total distingue «Pago único» de «n cuotas» |
| HU-005 C5 | El mismo número se acepta en cobrar y en pagar, y en dos proveedores distintos | ◐ Cada fila muestra sentido y contacto, así que se distinguirían, pero los datos de prueba no tienen ningún número repetido (obs. 9) |
| HU-005 C13 | Con F001-00045 ANULADO, un nuevo F001-00045 por cobrar se guarda como comprobante nuevo | ◐ El badge ANULADO los diferenciaría, pero no hay datos que lo muestren (obs. 9) |
| HU-005 (acceso) | Un usuario de cualquier rol puede iniciar el registro | ✅ CTA en la cabecera y en el estado vacío, con destino P-005 |
| HU-007 C5 | Las cuotas de un comprobante anulado dejan de sumar en cartera | ✅ Los ANULADOS no entran en «Saldo vigente», muestran saldo «—» y no muestran modalidad |
| HU-007 C7 | El comprobante anulado y sus cuotas son de solo lectura | ✅ La fila solo permite abrir el detalle; no hay acciones en línea |
| HU-007 C9 | El F001-00045 anulado y el nuevo F001-00045 conviven y el anulado sigue de solo lectura | ◐ Sin datos de prueba (obs. 9) |
| HU-005 / HU-007 (aislamiento) | Un comprobante de otra empresa responde 404 | Fuera del alcance de P-004 (backend; el 404 se ve en P-006 y P-015) |

### 2. Reglas de negocio

**Reflejadas en la UI:**

| RN | Cómo se refleja |
|---|---|
| RN-001 | Cada importe aparece en su moneda original. La nota al pie lo explica: «Los importes se muestran en su moneda original (RN-001)». |
| RN-002 | El filtro de moneda solo ofrece «Todas», «S/ (soles)» y «US$ (dólares)». |
| RN-047 | El resumen nunca mezcla monedas: «Saldo vigente en S/» y «Saldo vigente en US$» van por separado, y la nota dice que «nunca se suman». |
| RN-049 | Los anulados se excluyen por defecto. Con el interruptor aparecen con el badge «ANULADO» y la fila atenuada. El estado sin resultados sugiere activar el interruptor cuando está apagado. |
| RN-090 | Un comprobante ANULADO muestra saldo «—», no muestra modalidad y no suma en el resumen. |
| RN-093 | Los números se muestran normalizados (mayúsculas, sin espacios). La búsqueda no distingue mayúsculas ni tildes. |
| RN-153 | Importes con símbolo, espacio, coma de miles y dos decimales («S/ 1,850.00», «US$ 10,050.00»). |

**Parciales:**

| RN | Gap |
|---|---|
| RN-003 / RN-004 | La tabla distinguiría números repetidos por sentido y contacto, pero no hay datos que lo demuestren (obs. 9). |
| RN-021 / RN-022 | El estado resumido del comprobante («Con vencidas», «Pendiente», «Cancelado») se deriva de los estados de las cuotas, pero ninguna regla define esa derivación y el API no la devuelve: `ComprobanteResumen.estado` solo admite `VIGENTE` o `ANULADO` (obs. 3). |
| RN-060 | El menú lateral no depende del rol: el OPERADOR ve «Configuración» (obs. 11). |

**No reflejadas (gaps):**

| RN / regla de spec | Gap |
|---|---|
| RN-046 (separación entre cobrar y pagar) | En la pestaña «Todos», «Saldo vigente en S/: S/ 11,100.00» suma saldos por cobrar (S/ 9,850.00) y por pagar (S/ 1,250.00). Es una cifra sin significado de negocio: lo que se debe cobrar no se compensa con lo que se debe pagar (obs. 1). |
| Ficha P-004 · filtro por contacto | No existe y rompe la navegación desde P-003 (obs. 2). |
| #31 `listarComprobantes` | No tiene los parámetros `moneda` ni `busqueda`: solo `numeroDocumento`, con coincidencia exacta. El filtro de moneda y la búsqueda parcial por contacto del prototipo no se pueden implementar con el contrato actual (obs. 4). |
| RN-072 (S1) | La pantalla no indica si un comprobante tiene cuotas reprogramadas (obs. 13). |

**No aplican a P-004:** RN-005, RN-131, RN-132, RN-133 y RN-082 aparecen en la ficha P-004, pero son validaciones del registro y la edición; se revisan en P-005.
**Invisibles por diseño (solo backend):** RN-008 (aislamiento por empresa) y RN-160 (atomicidad).

### 3. Flujo de usuario

**Camino feliz:**

- **Encontrar un comprobante:** el usuario escribe «textiles» o «F001» y la lista se filtra al instante (200 ms de espera), sin distinguir mayúsculas ni tildes. Abre el número y llega a P-006 (simulado). ✅
- **Registrar:** «+ Registrar comprobante» lleva a P-005, como indica F-04. ✅
- **Revisar anulados:** activa «Incluir comprobantes anulados»; aparecen con ANULADO y saldo «—», y el lector de pantalla anuncia el cambio. ✅
- **Sin resultados:** mensaje con sugerencias y «Limpiar filtros», que restablece la pestaña, la moneda, la búsqueda y el interruptor. ✅

**Fricciones y callejones sin salida detectados:**

1. **«Ver comprobantes» desde P-003 lleva a un listado sin filtrar.** P-004 no lee `contactoId` ni muestra un chip «Contacto: DISTRIBUIDORA LIMA ✕». El usuario llega a la lista completa y tiene que buscar a mano por nombre; si dos contactos tienen nombres parecidos, no puede aislar uno.
2. **Totales engañosos en «Todos».** Un usuario que quiere saber «cuánto me deben» lee «Saldo vigente en S/: S/ 11,100.00», que incluye lo que la empresa debe a sus proveedores. Solo en «Por cobrar» la cifra es correcta (S/ 9,850.00).
3. **Callejón sin salida: empresa cuyos únicos comprobantes están anulados.** El API devuelve una lista vacía (los anulados se excluyen), así que la pantalla muestra el estado «Vacío»: «Aún no hay comprobantes registrados», y oculta las pestañas, los filtros y el interruptor de anulados. El mensaje es falso y el usuario no tiene forma de llegar a sus comprobantes anulados.
4. **Volver del detalle pierde el contexto.** La pestaña, la búsqueda, los filtros y la página no se guardan en la URL. Al volver desde P-006, el usuario empieza de nuevo en «Todos», página 1.
5. **«Con vencidas» no dice cuánto está vencido.** La columna Saldo muestra en rojo el saldo total (por ejemplo, S/ 5,200.00 en F001-00040, con 4 cuotas), no la parte vencida. El usuario tiene que abrir cada comprobante para saber qué cobrar primero.
6. **Shell heredado de P-002.** «Configuración» visible para el OPERADOR, destinos «P-020» y «P-007 Avisos de cobranza», sin subítem «Bandeja» y sin menú de usuario (P-002, obs. 2, 4 y 5).

---

### 4. Observaciones

| # | Observación | Tipo | Severidad | Acción sugerida | HU / RN afectada |
|---|---|---|---|---|---|
| 1 | En la pestaña «Todos», el resumen suma saldos por cobrar y por pagar en una misma cifra por moneda («S/ 11,100.00» = S/ 9,850.00 por cobrar + S/ 1,250.00 por pagar). No mezcla monedas, pero sí sentidos, y la cifra no responde a ninguna pregunta de negocio. | gap | Alta | En «Todos», mostrar el saldo separado por sentido y moneda («Por cobrar: S/ 9,850.00 · US$ 6,450.00 — Por pagar: S/ 1,250.00 · US$ 3,600.00») o mostrar el resumen solo en las pestañas de un sentido. Registrar la decisión en la ficha P-004. | HU-005 · RN-046, RN-047 |
| 2 | No existe el filtro por contacto, aunque la ficha P-004 lo incluye y P-003 «Ver comprobantes» navega a `/comprobantes?contactoId=`. El usuario llega a un listado sin filtrar. | gap | Alta | Leer `contactoId` de la URL, pasarlo a #31 y mostrarlo como chip removible («Contacto: DISTRIBUIDORA LIMA ✕»). Valorar un combobox de contacto entre los filtros. Simularlo con un control de la demo «Llegar desde P-003». | HU-004 · HU-005 · P-003, P-004 |
| 3 | El estado resumido («Con vencidas», «Pendiente», «Cancelado») no tiene una regla que lo derive ni un dato del API que lo devuelva: `ComprobanteResumen.estado` solo admite `VIGENTE` o `ANULADO`. Tampoco está en el vocabulario de badges de §0.3. | gap | Media | Definir la derivación (por ejemplo: ANULADO si el comprobante está anulado; «Con vencidas» si alguna cuota está VENCIDA; «Cancelado» si todas están CANCELADAS; si no, «Pendiente»). Agregarla a `03-reglas-de-negocio.md`, exponer un campo `estadoCartera` en `ComprobanteResumen` y sumar los valores a §0.3. | HU-005 · HU-007 · RN-021, RN-022, RN-090 |
| 4 | El contrato #31 no admite los filtros que muestra el prototipo: no tiene `moneda` ni `busqueda`, y `numeroDocumento` exige coincidencia exacta. La ficha P-004 menciona `busqueda=`, que tampoco existe en el API. Además, el resumen de saldos se calcula sobre todas las filas filtradas, lo que en un listado paginado requiere un agregado del servidor. | gap | Media | Alinear `09-ui-spec.md` y `07-openapi.yaml`: agregar `moneda` y `busqueda` (número parcial o nombre de contacto) a #31, y un bloque `resumen` con los saldos por sentido y moneda en `PaginaComprobantes`. Si no se aceptan, quitar esos controles del prototipo. | HU-005 · RN-047 · #31 |
| 5 | Una empresa cuyos únicos comprobantes están anulados ve el estado «Vacío» («Aún no hay comprobantes registrados»), con las pestañas, los filtros y el interruptor ocultos. El mensaje es falso y los anulados quedan inaccesibles. | fricción | Media | Mostrar el estado «Vacío» solo cuando el API confirme que no hay comprobantes, incluidos los anulados (por ejemplo, con un campo `existenAnulados` o una segunda consulta). En otro caso, mostrar el estado sin resultados con el interruptor visible. | HU-007 (C9) · RN-049, RN-090 |
| 6 | En los comprobantes «Con vencidas», el saldo en rojo es el saldo total, no la parte vencida; el usuario no sabe cuánto está en mora sin abrir el detalle. | fricción | Media | Agregar el saldo vencido y la cantidad de cuotas vencidas bajo el saldo («S/ 1,950.00 vencido · 1 cuota»), o una columna «Vencido». Requiere el dato en `ComprobanteResumen` (ver obs. 3 y 4). | HU-005 · RN-021 |
| 7 | La pestaña, la búsqueda, los filtros y la página no se reflejan en la URL; al volver de P-006 el usuario pierde el contexto. | fricción | Media | Sincronizar el estado con la query (`?sentido=&moneda=&busqueda=&contactoId=&incluirAnulados=&pagina=`) y restaurarlo al volver. Registrarlo en la ficha P-004. | HU-005 · HU-007 · §6 |
| 8 | Los textos difieren de la spec: el vacío dice «Aún no hay comprobantes registrados…» y la ficha «Registra tu primer comprobante a crédito.»; el error muestra «Código: COM-503» en lugar del `idSolicitud` de §0.4. | comprensión | Baja | Unificar con la ficha P-004 y con §0.4, como en P-001 obs. 4 y P-003 obs. 10. | HU-005 · §0.4 |
| 9 | Los datos de prueba no incluyen un mismo número en cobrar y en pagar, dos proveedores con el mismo número, ni un número anulado y vuelto a registrar. No se pueden validar con stakeholders los casos que más confunden en un listado. | gap | Baja | Agregar F001-00045 por pagar de otro proveedor, y un F001-00050 ANULADO junto a un F001-00050 vigente. | HU-005 (C5, C13) · HU-007 (C9) · RN-003, RN-004 |
| 10 | «Limpiar filtros» solo aparece cuando no hay resultados; con filtros activos y resultados no hay forma rápida de volver a la vista completa. | fricción | Baja | Mostrar «Limpiar filtros» siempre que haya un filtro activo (igual que P-002 obs. 1). | HU-005 |
| 11 | El shell repite los problemas de P-002: el menú es igual para todos los roles (el OPERADOR ve «Configuración»), los destinos son «P-020» y «P-007 Avisos de cobranza», falta «Bandeja» y no hay menú de usuario. | gap | Baja | Resolverlo una sola vez en el shell común según §3.1 y §6.1 (P-002, decisión 2). Aquí la severidad es baja porque no es propio de P-004. | HU-002 · HU-003 · HU-009 · RN-060 |
| 12 | El estado resumido depende de la fecha de cálculo (una cuota que vence hoy pasa mañana a VENCIDA), pero la pantalla no indica a qué fecha corresponde. | comprensión | Baja | Mostrar «Estados al 2026-11-09» junto al resumen, con la `fechaCalculo` del API. | HU-005 · RN-021, RN-198 |
| 13 | Con S1 activa, la pantalla no indica qué comprobantes tienen cuotas reprogramadas; el usuario no sabe que el vencimiento original cambió. | mejora | Baja | Con la bandera S1, agregar la marca «Reprogramada» en la columna Estado. Mantenerla detrás de la bandera hasta S1. | HU-011 · RN-072 |
| 14 | No existe un filtro por estado (por ejemplo, solo «Con vencidas»), que sería el camino natural para priorizar desde esta pantalla. | mejora | Baja | Valorarlo con el responsable del producto; si se aprueba, agregarlo a la ficha P-004 y a #31. Hoy esa tarea se cubre desde P-002 con «Ver ▸». | HU-005 · HU-008 |

---

### 5. Decisiones recomendadas antes de implementar

1. **Separar los saldos por sentido** en la pestaña «Todos» o mostrar el resumen solo en las pestañas de un sentido (obs. 1).
2. **Implementar el filtro por contacto** con lectura de `contactoId` y chip removible, para que funcione «Ver comprobantes» de P-003 (obs. 2).
3. **Definir el estado resumido del comprobante** como regla y como campo del API, y agregarlo a §0.3 (obs. 3).
4. **Alinear el contrato #31 con la pantalla**: filtros `moneda` y `busqueda` y un resumen de saldos calculado en el servidor; o recortar el prototipo a lo que permite el API (obs. 4).
5. **Corregir el estado «Vacío»** para que no oculte los comprobantes anulados (obs. 5).
6. **Mostrar el saldo vencido** en los comprobantes «Con vencidas» (obs. 6).
7. **Conservar el contexto del listado en la URL** al ir al detalle y volver (obs. 7).
8. Ajustes menores que pueden ir al backlog: textos del vacío y del error, datos de prueba con números repetidos, «Limpiar filtros» visible, shell común, fecha de los estados, marca de reprogramación (S1) y filtro por estado (obs. 8 a 14).

### 6. Score de completitud

| Métrica | Cálculo | Resultado |
|---|---|---|
| HUs Must cubiertas (sobre el total del MVP) | 2 de 10, ambas parciales (HU-005: listado y acceso; HU-007: visibilidad). HU-004 tiene el destino roto | **20 %** (lo esperable: P-004 es un listado de entrada; el registro y las anulaciones se validan en P-005 y P-006) |
| Criterios de HU-005 y HU-007 aplicables a P-004 | 5 ✅ + 3 parciales (×0.5) de 8 | **81 %** |
| Acciones de la ficha P-004 | Registrar, filtrar por sentido, filtrar por moneda, incluir anulados y abrir detalle ✅; búsqueda parcial (×0.5, no coincide con el API); filtro por contacto ❌ → 5.5 de 7 | **79 %** |
| Reglas reflejables en P-004 | RN-001, 002, 047, 049, 090, 093 y 153 ✅; RN-003, 004, 021, 022 y 060 parciales (×0.5); RN-046 ❌ → 9.5 de 13 | **73 %** |
| Reglas que no aplican o solo de backend | RN-005, RN-082 y RN-131 a RN-133 (P-005); RN-008 y RN-160 | Fuera del cálculo |
| Reglas Should | RN-072 (S1) ❌, detrás de la bandera | Fuera del cálculo |

**Veredicto:** P-004 está **lista con ajustes**. La moneda original, la exclusión de anulados y el acceso a P-005 y P-006 están bien resueltos. Antes de implementar deben cerrarse las observaciones Alta (1 y 2), porque una muestra una cifra engañosa y la otra rompe la navegación desde Contactos, y las Media (3 a 7), que en su mayoría exigen alinear la pantalla con el contrato #31.

---

## P-005 Registrar / editar comprobante

**Agente:** Prototype Reviewer (`agent-prototyper-reviewer-5.xml`).
**Fecha:** 2026-11-11.
**Prototipo revisado:** `prototipos/p005-registrar-comprobante/p005-registrar-comprobante.png`. La captura solo muestra el estado «Vacío» en «Pago único», así que también se revisaron `index.html` y `app.js` para ver los estados (con datos, edición, edición bloqueada, cargando, error), las respuestas simuladas del servidor (éxito, error de conexión, conflicto), la propuesta de cuotas y el alta rápida de contacto.
**Fuentes contrastadas:** `06-user-stories.md` (HU-005; HU-004 por el alta rápida), `03-reglas-de-negocio.md` (RN-001 a RN-006, RN-015 a RN-020, RN-044, RN-057, RN-081 a RN-083, RN-093, RN-121, RN-122, RN-126, RN-130 a RN-133, RN-153, RN-154, RN-160, RN-162), `09-ui-spec.md` (P-005, P-003.D1, §0.2, §0.4, §2 F-04, UI-4, UI-7).
**Condiciones del prototipo:** fecha de cálculo 2026-11-11, rol OPERADOR, 6 contactos activos y 4 comprobantes existentes (F001-00044 por cobrar, F001-00046 por cobrar ANULADO, F001-00045 y E001-1520 por pagar de IMPORTACIONES PACÍFICO).
**Enfoque:** gaps funcionales; la estética no se evalúa.

### 1. Cobertura de HUs

| HU | Prioridad | ¿Representada en P-005? | Detalle |
|---|---|---|---|
| HU-005 Registrar y editar comprobantes a crédito | Must | **Sí, casi completa** | Registro en pago único y en cuotas, propuesta editable, resumen con diferencia, validaciones de formato y unicidad, edición con historial y bloqueo por pagos. Faltan el destino tras guardar (P-006), el detalle del historial por cuota y el estado de contacto no válido (404). |
| HU-004 Gestionar contactos (alta rápida) | Must | **Parcial y no conforme** | El combobox solo ofrece contactos activos. El diálogo «Crear contacto» no es P-003.D1: pide «RUC o DNI», no pide correo y valida el duplicado por nombre (obs. 1). |
| HU-006, HU-007 | Must | Solo como condición | El bloqueo de la edición refleja que existen pagos o anulaciones; las acciones están en P-006. |
| HU-010 Enviar avisos | Must | Afectada indirectamente | Un contacto creado desde P-005 queda sin correo y no podría recibir avisos (obs. 1). |
| HU-001 a HU-003, HU-008, HU-009 | Must | No aplica | Se validan en sus propias pantallas. |
| HU-011 (S1) | Should | Solo mención | El aviso de bloqueo ya habla de «reprogramación», aunque S1 no está entregada (obs. 5). |

**Criterios de HU-005:**

| # | Criterio (resumen) | Estado en el prototipo |
|---|---|---|
| C1 | F001-00045 por US$ 3,000.00 en 3 cuotas propone 3 × US$ 1,000.00 (2026-12-04, 2027-01-04, 2027-02-04), editables, y se guarda en USD | ✅ Propuesta mensual desde la emisión; el JSON simulado envía `moneda: "USD"` |
| C2 | S/ 1,000.00 en 3 cuotas = 333.33 + 333.33 + 333.34; con la cuota 1 en 400.00 muestra la diferencia de S/ 66.67 y no ajusta nada | ✅ Resumen «+S/ 66.67 · No cuadra», error bajo la tabla y en el resumen de errores; ninguna cuota se ajusta |
| C3 | «Pago único» por S/ 1,500.00 crea una cuota sin pedir la cantidad | ✅ Solo pide «Fecha de vencimiento»; el resumen muestra «Cuotas: 1» |
| C4 | Se rechazan 1, 121, «3.0» y «tres»; S/ 0.02 en 3 → máximo 2; S/ 0.01 → solo «Pago único» | ✅ Mensajes y ayuda dinámica «Máximo posible para este total» |
| C5 | « f001-00045 » se normaliza y se rechaza por duplicado; el mismo número se acepta por pagar y en otro proveedor | ✅ Normaliza al salir del campo; el duplicado por pagar se compara dentro del proveedor |
| C6 | Se rechazan EUR, «1000.50», 0.00, emisión futura, vencimiento igual a la emisión y vencimientos no crecientes | ✅ EUR no se puede elegir; cada caso tiene su mensaje |
| C7 | Editar el vencimiento de la cuota 2 aplica las mismas validaciones y guarda el historial por campo | ◐ Las validaciones son las mismas, pero el historial agrupa todas las cuotas en un único campo «Cuotas» (obs. 7) |
| C8 | Con pagos (aunque anulados) o anulado, no se permite editar | ◐ Existe el estado «Edición bloqueada», pero muestra el formulario deshabilitado, sin enlace al detalle, y menciona la reprogramación sin S1 (obs. 5) |
| C9 | Emisión 2026-01-31 en 3 cuotas propone 2026-02-28, 2026-03-31 y 2026-04-30 | ✅ Por lógica (`addMeses` calcula desde la emisión y usa el último día del mes) |
| C10 | 120 cuotas de S/ 10.00; se acepta 999,999,999,999.99 y se rechazan 13 enteros | ✅ |
| C11 | Se rechazan «100,50», «1,000.505», «1,00.50», «-100.00» y «1e3»; se aceptan «1,000.5» y «100» | ✅ Sin redondeo |
| C12 | Emisión igual a la fecha de cálculo se acepta; un día después se rechaza | ✅ |
| C13 | Con F001-00045 ANULADO, un nuevo F001-00045 por cobrar se guarda | ✅ Se prueba con F001-00046 |
| C14 | Dos altas simultáneas de F001-00046: solo se guarda la primera y la segunda se rechaza por duplicado | ◐ Se simula como Alert global, no como error en «Número de documento» (obs. 9) |
| C15 | 30 caracteres se aceptan; 31 o un espacio interno se rechazan | ✅ |
| C16 | Un contacto DESACTIVADO no permite guardar el comprobante | ◐ El combobox solo lista activos, pero no se simula el contacto desactivado mientras se registra (404 «Selecciona un contacto activo.») (obs. 6) |
| C19 | Una falla técnica no deja nada guardado y el reintento no se rechaza por duplicado | ✅ «No se registró ningún cambio» con «Reintentar» |
| C17, C18 | Reprogramación (al entregar S1) y aislamiento 404 | Fuera del cálculo (Should y backend) |

**Criterios de HU-004 que aplican al alta rápida:**

| # | Criterio (resumen) | Estado en el prototipo |
|---|---|---|
| C1 | Nombre y correo normalizados, sin pedir DNI, RUC ni CCI | ❌ Pide «RUC o DNI (opcional)», no pide correo y no convierte el nombre a mayúsculas |
| C2 | Correo duplicado (incluso desactivado) se rechaza | ❌ Valida el duplicado por nombre, no por correo |
| C3 / C7 | Nombre de 1 a 250 caracteres sin truncar | ❌ `maxlength="120"` trunca la entrada |
| C8 | Caracteres permitidos del nombre | ❌ No valida caracteres |
| C5 | Un contacto DESACTIVADO no aparece en la búsqueda | ✅ |
| C12 | Sin contactos, la búsqueda no muestra resultados | ✅ «Sin resultados entre los contactos activos» y la opción «+ Crear contacto» |

### 2. Reglas de negocio

**Reflejadas en la UI:**

| RN | Cómo se refleja |
|---|---|
| RN-001 / RN-002 | Moneda S/ o US$ (no hay otra opción) y ayuda «Se conserva la moneda original; no se convierte». Al cambiar la moneda solo cambia el prefijo de los importes. |
| RN-003 / RN-004 | Duplicado entre no anulados del mismo sentido; en por pagar, dentro del mismo proveedor. El mismo número se acepta en el otro sentido y en otro proveedor. |
| RN-093 | El número se recorta y pasa a mayúsculas; no se aceptan espacios internos. |
| RN-015 | «Proponer cuotas» genera cuotas mensuales desde la fecha de emisión, con el último día del mes cuando no existe el día, y la nota «La propuesta es una ayuda…». |
| RN-016 | Importe base truncado y la última cuota absorbe la diferencia. «Diferencia» en el resumen y en la barra móvil, con texto «No cuadra» (no solo color) y `aria-live`; no se ajusta ninguna cuota. |
| RN-017 / RN-018 / RN-081 | En edición se pueden cambiar contacto, número, moneda, emisión, total y cuotas (agregar y quitar, de 1 a 120), con las mismas validaciones. |
| RN-019 / RN-020 / RN-121 | Cada cuota ≥ 0.01; vencimiento posterior a la emisión y a la cuota anterior, con mensaje en la fila. |
| RN-057 | «Pago único» crea una cuota sin pedir la cantidad. |
| RN-122 / RN-154 | Cantidad entera de 2 a 120, sin decimales ni texto; máximo según los céntimos del total; «Con este total solo procede “Pago único”». |
| RN-131 / RN-132 / RN-133 | Campos obligatorios con resumen de errores enlazado; total > 0; emisión ≤ fecha de cálculo. |
| RN-153 | Formato peruano con coma de miles obligatoria, hasta 2 decimales, máximo 12 enteros, sin signo ni notación científica; el API recibe la cadena canónica («1000.00»). |
| RN-006 | El alta rápida no pide número de cuenta ni CCI. |

**Parciales:**

| RN | Gap |
|---|---|
| RN-082 | El bloqueo existe, pero no ofrece el camino de corrección (enlace a P-006) y su texto presenta la reprogramación como disponible sin S1 (obs. 5). |
| RN-083 | El historial se muestra al guardar, pero agrupa todas las cuotas en un campo «Cuotas» en lugar de registrar el vencimiento o el importe de cada cuota (obs. 7). |
| RN-130 | Solo se listan contactos activos, pero no se simula el rechazo de un contacto desactivado por otro usuario mientras se registra (obs. 6). |
| RN-153 | La regla dice que la interfaz DEBERÍA insertar las comas de miles al escribir o al salir del campo; la ficha P-005 dice que no autoformatea y el prototipo rechaza «1000.50» (obs. 8). |
| RN-160 | Se simulan el duplicado concurrente y el pago concurrente durante la edición, pero no la edición concurrente del mismo comprobante (`DATOS_DESACTUALIZADOS`) (obs. 10). |
| RN-162 | Correcta para el número de documento; no se aplica al nombre del contacto creado desde P-005 (obs. 1). |

**No reflejadas (gaps):**

| RN | Gap |
|---|---|
| RN-126 / RN-044 | El alta rápida pide «RUC o DNI», que la regla prohíbe, y no pide el correo, que es obligatorio. Además, la lista de contactos muestra RUC y DNI, y la ayuda dice «Busca por nombre o documento» (obs. 1). |

**Invisibles por diseño (solo backend; no requieren UI):** RN-005 (sin consulta a SUNAT), RN-008 (aislamiento por empresa), RN-014 (el error del API no lleva importes), la atomicidad del guardado (RN-160) y el cálculo definitivo de la propuesta en #30.

### 3. Flujo de usuario

**Camino feliz:**

- **Pago único:** el usuario elige el sentido, busca el contacto, completa número, moneda, total, emisión y vencimiento, y pulsa «Guardar comprobante». El botón muestra «Guardando…» y bloquea el doble envío. ✅
- **En cuotas:** indica la cantidad y pulsa «Proponer cuotas»; edita filas y ve la diferencia en tiempo real en el resumen (y en la barra inferior en móvil). ✅
- **Errores:** al guardar, el foco va al resumen de errores con enlaces a cada campo. ✅
- **Salir con cambios:** «Cancelar» o el menú abren «¿Descartar los cambios?». ✅

**Fricciones y callejones sin salida detectados:**

1. **Contacto creado sin correo.** El alta rápida crea contactos que no pueden recibir avisos (HU-010) y que el API real rechazaría por falta de correo (RN-126). Si se corrige el diálogo para pedir el correo, aparece el siguiente callejón.
2. **Callejón: el contacto está desactivado.** El combobox dice «Sin resultados entre los contactos activos» y ofrece crear uno nuevo. Con el correo obligatorio, ese alta fallaría por correo duplicado (RN-127) y el usuario no tendría cómo reactivar el contacto desde aquí ni sabría que debe ir a P-003.
3. **Tras guardar no se llega al detalle.** La ficha y F-04 llevan a P-006 con un toast; el prototipo abre un diálogo con «Registrar otro» e «Ir a Comprobantes». Para revisar las cuotas o registrar un cobro, el usuario tiene que buscar el comprobante en P-004.
4. **Edición bloqueada sin salida útil.** El aviso explica que hay que anular pagos y el comprobante, pero el único botón es «Volver» (a P-004). No hay enlace a P-006, donde están esas acciones.
5. **«Proponer cuotas» borra lo editado.** Si el usuario ya cambió fechas o importes y vuelve a pulsar «Proponer cuotas» (por ejemplo, tras cambiar la cantidad), la tabla se reemplaza sin la confirmación «Se reemplazarán las cuotas que editaste» que pide la ficha.
6. **Totales de 1,000 o más.** Quien escribe «1500» recibe un error en lugar de que la UI inserte la coma, cuando RN-153 lo recomienda. Es la fricción más frecuente de la pantalla.

---

### 4. Observaciones

| # | Observación | Tipo | Severidad | Acción sugerida | HU / RN afectada |
|---|---|---|---|---|---|
| 1 | El alta rápida no es P-003.D1: pide «RUC o DNI (opcional)», no pide correo, limita el nombre a 120 caracteres, no lo convierte a mayúsculas y valida el duplicado por nombre. El combobox muestra RUC y DNI de cada contacto y dice «Busca por nombre o documento». | gap | Alta | Reutilizar el diálogo P-003.D1 del prototipo P-003 (nombre, correo obligatorio, teléfono y dirección opcionales, RN-162, duplicado por correo). Quitar el documento de las opciones y cambiar la ayuda a «Busca por nombre». | HU-004 (C1, C2, C3, C8) · HU-010 · RN-126, RN-044, RN-127, RN-162 |
| 2 | Tras guardar, el prototipo abre un diálogo con «Registrar otro» e «Ir a Comprobantes»; la ficha P-005 y F-04 indican ir a P-006 con el toast «Comprobante registrado» / «Cambios guardados». | gap | Media | Navegar a P-006 del comprobante guardado con el toast. Si se quiere conservar «Registrar otro», ofrecerlo como acción del toast o en P-006 y registrarlo en la ficha. | HU-005 · HU-006 · F-04 |
| 3 | Si el contacto buscado está DESACTIVADO, el combobox no da pista y lleva a crear uno nuevo, que fallará por correo duplicado. | fricción | Media | En «Sin resultados», agregar «¿Es un contacto desactivado? Reactívalo en Contactos» con enlace a P-003 filtrado por «Desactivados», y mostrar en D1 el error de correo duplicado con la salida propuesta en P-003 obs. 3. | HU-004 (C2, C5) · RN-127, RN-130 |
| 4 | «Proponer cuotas» reemplaza la tabla aunque el usuario haya editado filas, sin la confirmación de la ficha. | fricción | Media | Si hay cambios manuales, pedir confirmación «Se reemplazarán las cuotas que editaste» antes de reemplazar. | HU-005 (C1, C2) · RN-015 |
| 5 | El estado «Edición bloqueada» muestra el formulario deshabilitado (la ficha dice que no se muestra), no enlaza a P-006 y su texto dice «Para corregir fechas usa una reprogramación», que no existe sin S1. | fricción | Media | Mostrar solo el Alert de la ficha con el enlace «Ver detalle» a P-006. Condicionar la mención de la reprogramación a la bandera S1 y, sin ella, describir solo el camino de anular y registrar de nuevo. | HU-005 (C8) · HU-007 · RN-082 |
| 6 | No se simula el contacto desactivado o eliminado por otro usuario mientras se registra (404 → «Selecciona un contacto activo.» en el campo Contacto). | gap | Media | Agregar a «Respuesta del servidor al guardar» la opción «Contacto ya no activo», que marque el campo, limpie la selección y conserve el resto. | HU-005 (C16) · HU-004 (C13) · RN-130, RN-160 |
| 7 | El historial de edición agrupa todas las cuotas en un solo campo «Cuotas» con todas las fechas e importes concatenados; HU-005 C7 pide registrar cada campo cambiado (por ejemplo, el vencimiento de la cuota 2). | gap | Media | Registrar un cambio por cuota y atributo («Cuota 2 · vencimiento: 2027-01-04 → 2027-01-10») y agregar o quitar cuota como cambios propios. Confirmar el modelo con `07-openapi.yaml` y cerrar UI-7 (vista del historial). | HU-005 (C7) · RN-083 |
| 8 | RN-153 dice que la UI DEBERÍA insertar las comas de miles al escribir o al salir del campo; la ficha P-005 dice «no autoformatea» y HU-005 C6 espera que «1000.50» se rechace en la interfaz. Los tres documentos no coinciden. | comprensión | Media | Decidir con el responsable del producto. Recomendación: insertar la coma al salir del campo solo cuando el valor sea inequívoco («1500» → «1,500») y ajustar la ficha P-005 y el criterio C6 para que el rechazo aplique al API. | HU-005 (C6, C11) · RN-153 |
| 9 | El duplicado concurrente al registrar aparece como Alert global; la ficha mapea `COMPROBANTE_DUPLICADO` al campo «Número de documento». | comprensión | Baja | Mostrar el error bajo «Número de documento» con el texto de la ficha, igual que el duplicado detectado antes de enviar. | HU-005 (C14) · RN-003, RN-160 |
| 10 | En edición solo se simula el conflicto por pago o reprogramación (`COMPROBANTE_NO_EDITABLE`); falta la edición concurrente del mismo comprobante (`DATOS_DESACTUALIZADOS`, estado «Conflicto» de §0.4). | gap | Baja | Agregar la opción «Otro usuario editó el comprobante» con el Alert «Los datos cambiaron mientras editabas…» y «Recargar», sin perder lo escrito. | HU-005 (C7) · RN-160 · §0.4 |
| 11 | El tipo de comprobante queda bloqueado en edición. RN-081 no lo lista entre los campos editables, pero ni la regla ni la ficha lo dicen de forma explícita. | comprensión | Baja | Registrar en RN-081 y en la ficha P-005 que el sentido no se edita (para cambiarlo: anular y registrar de nuevo). | HU-005 · RN-081 |
| 12 | Los mensajes muestran códigos internos al usuario («(RN-003)», «Código: COM-503», «COM-409») y repiten el número ingresado; §0.4 pide el `idSolicitud` y PRINCIPIO-005 pide no repetir valores. | comprensión | Baja | Quitar las referencias a reglas de los textos, usar el `idSolicitud` y los mensajes de la tabla de errores de la ficha. | HU-005 · §0.4 · PRINCIPIO-005 |
| 13 | Las fechas usan el selector nativo con formato `dd/mm/aaaa` (visible en la captura); la ficha define `CampoFecha` con texto `AAAA-MM-DD` y UI-4 adopta ISO. | comprensión | Baja | Usar `CampoFecha` o cerrar UI-4 a favor de `DD/MM/AAAA` en toda la UI. | HU-005 · UI-4 · §0.2 |
| 14 | El shell repite los problemas de P-002: menú igual para todos los roles, destinos «P-020» y «P-007 Avisos de cobranza», sin «Bandeja» ni menú de usuario. | gap | Baja | Resolverlo en el shell común (P-002, decisión 2). | HU-002 · HU-003 · HU-009 · RN-060 |
| 15 | Los datos de prueba muestran contactos en mayúsculas y minúsculas («Textiles Andinos S.A.C.»), aunque RN-162 los guarda en mayúsculas. | comprensión | Baja | Usar en los datos de prueba los nombres tal como los devuelve el API. | HU-004 · RN-162 · §0.2 |

---

### 5. Decisiones recomendadas antes de implementar

1. **Reemplazar el alta rápida por P-003.D1**: nombre y correo obligatorios, sin RUC ni DNI, validación RN-162 y duplicado por correo; quitar el documento del combobox (obs. 1).
2. **Llevar a P-006 tras guardar**, como dicen la ficha y F-04 (obs. 2).
3. **Dar salida al contacto desactivado** desde el combobox y desde el error de correo duplicado (obs. 3).
4. **Confirmar antes de reemplazar cuotas editadas** al volver a proponer (obs. 4).
5. **Rehacer el estado «Edición bloqueada»**: solo el Alert con enlace a P-006 y un texto que dependa de la bandera S1 (obs. 5).
6. **Simular el contacto no activo al guardar** (obs. 6).
7. **Definir el historial por cuota** y cerrar UI-7 (obs. 7).
8. **Alinear RN-153, la ficha P-005 y HU-005 C6** sobre la inserción de la coma de miles (obs. 8).
9. Ajustes menores que pueden ir al backlog: duplicado concurrente en el campo, conflicto de edición concurrente, sentido no editable en la spec, textos y códigos de error, formato de fechas, shell común y datos de prueba en mayúsculas (obs. 9 a 15).

### 6. Score de completitud

| Métrica | Cálculo | Resultado |
|---|---|---|
| HUs Must cubiertas (sobre el total del MVP) | HU-005 cubierta; HU-004 parcial (×0.5) → 1.5 de 10 | **15 %** (lo esperable: P-005 es la pantalla de una HU) |
| Criterios de HU-005 aplicables a P-005 | 13 ✅ + 4 parciales (×0.5) de 17 (C17 y C18 fuera) | **88 %** |
| Criterios de HU-004 aplicables al alta rápida | 2 ✅ de 6 | **33 %** |
| Reglas reflejables en P-005 | 20 ✅ (RN-001, 002, 003, 004, 006, 015, 016, 017, 018, 019, 020, 057, 081, 093, 121, 122, 131, 132, 133, 154); 6 parciales ×0.5 (RN-082, 083, 130, 153, 160, 162); 2 ❌ (RN-044, RN-126) → 23 de 28 | **82 %** |
| Reglas solo de backend (no requieren UI) | RN-005, RN-008, RN-014 y la atomicidad de RN-160 | Fuera del cálculo |

**Veredicto:** P-005 está **lista con ajustes**. El reparto de cuotas, la diferencia sin ajuste automático, el formato de importes, la unicidad del número y las validaciones de fechas siguen fielmente HU-005 y sus reglas. Antes de implementar debe cerrarse la observación Alta (1), porque el alta rápida contradice RN-126 y crea contactos sin correo, y las Media (2 a 8), que afectan la navegación tras guardar, los callejones del contacto desactivado y de la edición bloqueada, y la definición del historial.

---

## P-006 Detalle de comprobante y cuotas

**Agente:** Prototype Reviewer (`agent-prototyper-reviewer-6.xml`).
**Fecha:** 2026-11-11.
**Prototipo revisado:** `prototipos/p006-detalle-comprobante/`, con las capturas `p006-detalle-comprobante.png` (detalle con la cuota 1 expandida), `p006-detalle-comprobante-registrar-cobro.png` (P-006.D1), `p006-detalle-comprobante-anular-pago.png` (P-006.D2) y `p006-detalle-comprobante-anular.png` (P-006.D3). También se revisaron `index.html` y `app.js` para ver los estados (con datos, sin pagos, anulado, cargando, error), los roles, las fechas de cálculo, las banderas S1 y S4 y las simulaciones (fallo del servidor y cobro concurrente).
**Fuentes contrastadas:** `06-user-stories.md` (HU-006, HU-007; HU-005 por el acceso a edición; HU-011 y HU-017 como Should), `03-reglas-de-negocio.md` (RN-021, RN-022, RN-024 a RN-032, RN-058 a RN-063, RN-071, RN-072, RN-081, RN-082, RN-084, RN-088 a RN-092, RN-123, RN-124, RN-153, RN-156, RN-157, RN-160, RN-162), `09-ui-spec.md` (P-006, P-006.D1 a D3, §0.2, §0.4, §2 F-05/F-06, UI-4, UI-8).
**Condiciones del prototipo:** F001-00045 por cobrar de DISTRIBUIDORA LIMA, US$ 3,000.00 en 3 cuotas, emisión 2026-11-04; fecha de cálculo 2026-11-09 (también 2027-01-25 y 2027-02-10); rol SUPERVISOR; **S1 activa por defecto** y S4 inactiva. La cuota 1 está CANCELADA con dos pagos vigentes (US$ 400.00 y US$ 600.00) y uno ANULADO; la cuota 2 está reprogramada al 2027-01-20.
**Enfoque:** gaps funcionales; la estética no se evalúa.

### 1. Cobertura de HUs

| HU | Prioridad | ¿Representada en P-006? | Detalle |
|---|---|---|---|
| HU-006 Registrar un cobro o pago sobre una cuota | Must | **Sí, casi completa** | D1 con saldo vigente, «Usar saldo completo», moneda fija, rango de fechas según RN-089, formato RN-153, clave de idempotencia por diálogo, botón bloqueado durante el envío, fallo técnico y `IMPORTE_SUPERA_SALDO` con el saldo recargado. Faltan el rechazo `DATOS_DESACTUALIZADOS` (obs. 2) y el estado «no encontrado» (obs. 6). |
| HU-007 Anular un pago o un comprobante con auditoría | Must | **Sí, casi completa** | D2 y D3 con motivo obligatorio normalizado, aviso de irreversibilidad, pago original conservado, saldo recalculado y cuota reabierta, acciones ocultas para OPERADOR y comprobante anulado de solo lectura. «Anular comprobante» con pagos vigentes abre el diálogo y rechaza al final (obs. 1). No se simulan las carreras ni el «ya anulado» (obs. 5). |
| HU-005 Registrar y editar comprobantes (detalle y acceso a edición) | Must | **Sí** | «Editar» habilitado solo sin pagos ni reprogramaciones (estado «Sin pagos»); con pagos, deshabilitado con «No editable: tiene pagos registrados.» (C8). Es el destino tras guardar en P-005 (P-005 obs. 2). |
| HU-004 Gestionar contactos | Must | Solo enlace | El contacto de la cabecera enlaza a P-003. |
| HU-001 a HU-003, HU-008 a HU-010 | Must | No aplica | Se validan en sus propias pantallas. |
| HU-011 Reprogramar (S1) | Should | Presente y activa por defecto | Columna «Fecha efect.», marca «Reprogramada» y un diálogo «Reprogramar» simplificado; se valida en P-017 (obs. 4). |
| HU-017 Historial de la cuota | Should | Solo enlace | «Historial» en el menú de la fila con S1 o S4, como pide la ficha. |

**Criterios de HU-006:**

| # | Criterio (resumen) | Estado en el prototipo |
|---|---|---|
| C1 | Pago de 400.00 deja saldo 600.00 y guarda la fecha de pago y, aparte, la fecha y hora de creación | ✅ La tabla de pagos muestra «Fecha de pago» y «Registrado el» |
| C2 | Pago igual al saldo deja la cuota CANCELADA con saldo 0.00 | ✅ El toast agrega «La cuota quedó CANCELADA» y desaparece «Registrar pago» |
| C3 | 600.01 sobre saldo 600.00 se rechaza con `IMPORTE_SUPERA_SALDO`, mostrando el saldo de una consulta; el exceso no va a otras cuotas | ✅ Validación previa y, en la simulación concurrente, saldo recargado en el diálogo y en la tabla |
| C4 | Fecha anterior al último pago vigente, posterior a hoy o anterior a la emisión se rechaza; la misma fecha se acepta | ✅ Mínimo = mayor entre emisión y último pago vigente; ayuda «Entre … y hoy (…)» |
| C5 | Doble clic o reintento crean como máximo un pago | ✅ Botón «Guardando…» con `aria-disabled` y clave reutilizada en el reintento (ver obs. 3 sobre datos cambiados) |
| C6 | Otra moneda, 0.00 o comprobante anulado no se guardan | ✅ Sin selector de moneda, 0.00 rechazado y sin «Registrar pago» en anulados |
| C7 | Dos pagos simultáneos: se guarda uno y se rechaza el otro | ◐ Se rechaza si el importe ya no cabe en el saldo, pero si cabe se guarda; RN-160 exige rechazarlo con `DATOS_DESACTUALIZADOS` (obs. 2) |
| C8 | Pago de 0.01 con fecha igual a la emisión se guarda | ✅ |
| C9 | Pago sobre una cuota CANCELADA se rechaza | ✅ La acción no se ofrece en cuotas CANCELADAS |
| C10 | «600.001», «-50.00» y «1000.00» no se guardan ni se redondean | ✅ |
| C11 | Pago parcial sobre cuota VENCIDA: sigue VENCIDA y el vencimiento no cambia | ✅ Con «Hoy es 2027-01-25» y la nota «El pago no cambia la fecha de vencimiento acordada» |
| C12 | Cuota de otra empresa → 404 igual que inexistente | ◐ Backend; falta el estado «no encontrado» (P-015) entre los estados simulados (obs. 6) |
| C13 | Falla técnica: no se crea el pago y el usuario lo ve | ✅ «No se pudo registrar el pago…» con reintento sin duplicar |

**Criterios de HU-007:**

| # | Criterio (resumen) | Estado en el prototipo |
|---|---|---|
| C1 | Anular el pago 1001 guarda motivo en mayúsculas, usuario y fecha; el pago se conserva y el saldo vuelve | ✅ El pago queda «ANULADO» con motivo, usuario y fecha; el original sigue visible |
| C2 | Anular el único pago de una cuota CANCELADA la devuelve a PENDIENTE o VENCIDA | ✅ Toast «(cuota reabierta)» y estado según la fecha efectiva |
| C3 | OPERADOR no puede anular pagos ni comprobantes | ✅ «Anular» y «⋯ Más» no se renderizan para OPERADOR |
| C4 | Un pago ANULADO no se anula de nuevo; sin anulación parcial, reversión, edición ni motivo vacío | ◐ No hay acción sobre pagos anulados ni motivo vacío; no se puede simular la doble anulación concurrente (`YA_ANULADO`) (obs. 5) |
| C5 | Comprobante sin pagos vigentes se anula y sus cuotas quedan ANULADAS y fuera de cartera | ✅ Cuotas «ANULADA», saldo con «(no suma en cartera)» y Alert de solo lectura |
| C6 | Comprobante con un pago vigente no se anula | ✅ Se rechaza, pero tras abrir el diálogo y escribir el motivo (obs. 1) |
| C7 | Comprobante ANULADO es de solo lectura | ✅ Sin «Editar», «Más», «Registrar pago», «Anular» ni «Reprogramar» |
| C8 | Anular el pago 1002 de una cuota CANCELADA vencida la deja VENCIDA con saldo 600.00 y el 1001 vigente | ✅ Con una fecha de cálculo posterior al vencimiento |
| C9 | Tras anular F001-00045 se puede registrar un nuevo F001-00045 | ✅ «Registrar comprobante nuevo con estos datos» (ver obs. 12 sobre el número) |
| C10 | Anulación del comprobante y pago casi simultáneos: gana el primero | ◐ La anulación revisa los pagos al confirmar, pero no se simula el pago rechazado con `COMPROBANTE_ANULADO` (obs. 5) |
| C11 | Pago de otra empresa → 404 | ◐ Igual que HU-006 C12 (obs. 6) |
| C12 | Falla técnica: el pago sigue vigente y el saldo no cambia | ✅ «No se pudo completar la anulación… no se hizo ningún cambio» |
| C13 | Motivo con espacios exteriores e internos: TRIM, conserva internos, mayúsculas; 500 caracteres se aceptan | ✅ |
| C14 | Motivo solo con espacios, tabulaciones o saltos, o de 501 caracteres, se rechaza sin truncar ni repetir el texto | ✅ El `textarea` no tiene `maxlength` y el error no repite el texto (ver obs. 11 sobre el contador) |
| C16 | OPERADOR no puede anular desde la interfaz ni desde el API | ✅ En la interfaz; el API es backend |
| C15 | Rechazo del motivo inválido enviado directo al API | Fuera del cálculo (solo backend) |

### 2. Reglas de negocio

**Reflejadas en la UI:**

| RN | Cómo se refleja |
|---|---|
| RN-021 / RN-022 / RN-084 | Estados PENDIENTE, VENCIDA (con «N días de atraso» y saldo resaltado) y CANCELADA; anular un pago reabre la cuota sin otra acción. |
| RN-024 / RN-026 | Importe > 0 y moneda de la cuota fija (prefijo sin selector). |
| RN-025 | Columnas «Importe», «Pagado» y «Saldo» y nota «El saldo de cada cuota es su importe menos la suma de sus pagos vigentes». |
| RN-027 / RN-028 / RN-029 | El pago anulado permanece en la lista con su importe y fecha originales; no hay editar ni eliminar pagos. |
| RN-030 / RN-031 / RN-032 / RN-162 | El motivo se recorta y pasa a mayúsculas; se muestran usuario y fecha y hora de la anulación. |
| RN-058 / RN-059 / RN-060 / RN-061 | «Anular» y «Anular comprobante» solo para SUPERVISOR y ADMINISTRADOR; «Registrar pago» para todos los roles. |
| RN-063 | El pago queda «Vigente» al registrarse; no hay estado intermedio. |
| RN-071 | Con S1 apagada se ocultan la fecha efectiva, la marca y «Reprogramar», y se usa el vencimiento original. |
| RN-081 / RN-082 | «Editar» solo sin pagos (aunque estén anulados) ni reprogramaciones; si no, botón deshabilitado con explicación. |
| RN-088 | «Fecha de pago» y «Registrado el» por separado; la nota del diálogo indica que el pago no cambia el vencimiento acordado. |
| RN-089 | Rango de fecha de pago calculado por cuota (emisión o último pago vigente, hasta hoy) y aviso en D2 para incorporar un pago omitido. |
| RN-090 / RN-091 | Comprobante anulado: cuotas ANULADAS, saldo marcado «no suma en cartera», sin acciones y con el atajo para registrarlo de nuevo. |
| RN-124 | D2 anuncia que la anulación es total e irreversible; tras anular, «Registrar pago» vuelve a estar disponible para el pago de reemplazo. |
| RN-157 | El botón pasa a «Guardando…» y no admite un segundo envío. |

**Parciales:**

| RN | Gap |
|---|---|
| RN-062 | Se verifica al confirmar, pero el diálogo D3 se abre con pagos vigentes en lugar de mostrar la opción deshabilitada con «Primero anula sus pagos vigentes» (obs. 1). |
| RN-092 | El rechazo y el saldo recargado funcionan; el mensaje muestra el código interno al usuario (obs. 7). |
| RN-123 | El pago anulado no ofrece «Anular», pero el rechazo `YA_ANULADO` no es simulable y no recarga la pantalla como pide la ficha (obs. 5). |
| RN-153 | Valida el formato, pero no inserta la coma de miles, que la regla recomienda (misma discrepancia que P-005 obs. 8). |
| RN-156 | La clave se genera al abrir el diálogo y se reutiliza en el reintento, pero se sigue usando aunque el usuario cambie el importe o la fecha tras un fallo, y la regla rechaza la clave con datos diferentes (obs. 3). |
| RN-160 | Un pago concurrente que todavía cabe en el saldo se guarda; la regla exige rechazarlo con `DATOS_DESACTUALIZADOS`. Tampoco se simulan `COMPROBANTE_ANULADO` ni la anulación concurrente (obs. 2 y 5). |

**No reflejadas (gaps):** ninguna regla MUST de P-006 queda sin representación.

**Invisibles por diseño (solo backend; no requieren UI):** RN-008 (aislamiento por empresa, salvo el estado 404 de la obs. 6), RN-014, la atomicidad de RN-160, la idempotencia en el servidor de RN-156 y la trazabilidad de accesos (RN-263 a RN-266).

**Should (fuera del cálculo):** RN-072 (marca de reprogramada) y el diálogo «Reprogramar» (HU-011, P-017), que en el prototipo es una versión simplificada.

### 3. Flujo de usuario

**Camino feliz:**

- **Registrar un cobro (F-05):** en la fila de la cuota, «Registrar pago» abre D1 con el saldo y el rango de fechas; «Usar saldo completo» rellena el importe. Al guardar, el diálogo se cierra, la cuota se actualiza y su lista de pagos se abre con la fila resaltada. ✅
- **Anular un pago (F-06):** «Pagos (n)» expande la lista; «Anular» abre D2; el saldo se recalcula y la cuota se reabre si estaba CANCELADA. «Registrar pago» queda disponible para el reemplazo. ✅
- **Anular el comprobante sin pagos vigentes:** «⋯ Más» → «Anular comprobante» → D3; la pantalla pasa a solo lectura y ofrece «Registrar comprobante nuevo con estos datos». ✅
- **Editar:** desde el estado «Sin pagos», «Editar» lleva a P-005. ✅

**Fricciones y callejones sin salida detectados:**

1. **Anular el comprobante con pagos vigentes.** Es el caso de la captura `p006-detalle-comprobante-anular.png`: el diálogo se abre aunque la cuota 1 tiene dos pagos vigentes. El usuario escribe el motivo y solo al confirmar recibe «Tiene pagos vigentes. Anúlalos primero.». Pierde el motivo y no sabe en qué cuotas están esos pagos, porque solo la cuota 1 está expandida.
2. **Corregir un pago omitido anterior.** D2 explica que hay que anular los pagos posteriores y registrarlos de nuevo en orden, pero después de anularlos el usuario debe recordar o copiar cada importe y fecha; no hay ayuda para volver a registrar los pagos anulados.
3. **Reintento tras un fallo con datos cambiados.** Si el guardado falla y el usuario corrige el importe antes de reintentar, el reintento usa la misma clave con otros datos. Según RN-156, el servidor lo rechazaría y, si el primer envío sí llegó a guardarse, el usuario no sabría cuál quedó.
4. **Conflicto silencioso.** Con «Otro usuario cobra antes», si el importe todavía cabe en el saldo, el pago se guarda sin avisar que el saldo cambió. El usuario no ve el estado vigente antes de decidir, como exige RN-160.
5. **Comprobante anulado por otro usuario mientras se registra un pago.** No hay simulación; la ficha pide cerrar el diálogo y recargar (`COMPROBANTE_ANULADO`).

---

### 4. Observaciones

| # | Observación | Tipo | Severidad | Acción sugerida | HU / RN afectada |
|---|---|---|---|---|---|
| 1 | «Anular comprobante» abre D3 aunque haya pagos vigentes y rechaza al confirmar con `COMPROBANTE_CON_PAGOS_VIGENTES`. La ficha pide la opción del menú con `aria-disabled="true"` y «Primero anula sus pagos vigentes», sin abrir el diálogo (F-06). | fricción | Media | Deshabilitar la opción con el texto de la ficha e indicar qué cuotas tienen pagos vigentes (por ejemplo, «Cuota 1: 2 pagos vigentes»), con enlace que expanda esas filas. Mantener el rechazo del servidor para la carrera. | HU-007 (C6) · RN-062 · F-06 |
| 2 | En la simulación de cobro concurrente, si el importe aún cabe en el nuevo saldo, el pago se guarda. RN-160 exige rechazar con `DATOS_DESACTUALIZADOS` cuando la cuota cambió desde la consulta, aunque el pago siga siendo válido; la ficha define el mensaje «Otro usuario registró un movimiento en esta cuota. Revisa el saldo actualizado.». | gap | Media | Simular el rechazo por `versionCuota`: mantener el diálogo abierto, recargar saldo y pagos, mostrar el mensaje de la ficha y conservar lo escrito para que el usuario confirme de nuevo. | HU-006 (C7) · RN-160 · RN-092 |
| 3 | Tras un fallo, la clave de idempotencia se reutiliza aunque el usuario cambie el importe o la fecha. RN-156 vincula la clave a cuota, fecha e importe y rechaza su reutilización con datos diferentes; la ficha solo dice que se genera una clave por diálogo. | comprensión | Media | Definir en la ficha D1: tras un resultado incierto, bloquear importe y fecha y ofrecer solo «Reintentar» o «Cancelar»; si el usuario cancela, recargar la cuota antes de abrir un diálogo nuevo con otra clave. Tras un rechazo definitivo (`IMPORTE_SUPERA_SALDO`, `DATOS_DESACTUALIZADOS`), generar una clave nueva al cambiar los datos. | HU-006 (C5, C13) · RN-156 · RN-157 |
| 4 | El prototipo arranca con S1 activa: las capturas muestran «Fecha efect.», «Reprogramada», «Reprogramar» e «Historial», y D1 muestra «Vence: 2027-01-20» (fecha efectiva). Los stakeholders validarían el MVP con funciones Should. | comprensión | Media | Arrancar con S1 y S4 apagadas y rehacer las capturas; dejar una captura aparte rotulada «con S1». Validar el diálogo «Reprogramar» en P-017. | HU-006 · HU-011 · RN-071 · RN-072 |
| 5 | No se simulan `YA_ANULADO` (doble anulación concurrente), `COMPROBANTE_ANULADO` al registrar un pago, ni el pago rechazado porque otro usuario anuló el comprobante. El texto de «ya anulado» existe, pero no recarga la pantalla. | gap | Baja | Agregar a «Simulaciones»: «Otro usuario anuló este pago» y «Otro usuario anuló el comprobante», con el mensaje de la ficha y la recarga correspondiente. | HU-007 (C4, C10) · RN-123 · RN-062 · RN-160 |
| 6 | Falta el estado «no encontrado» (404 → P-015) que lista la ficha; es la cara visible del aislamiento por empresa. | gap | Baja | Agregar el estado «No encontrado» a los controles, con enlace a P-004. | HU-006 (C12) · HU-007 (C11) · RN-008 |
| 7 | Los mensajes muestran códigos internos: «IMPORTE_SUPERA_SALDO.», «COMPROBANTE_CON_PAGOS_VIGENTES.» y «Código: COM-503»; §0.4 pide el `idSolicitud` y textos de la tabla de errores de la ficha. | comprensión | Baja | Quitar los códigos de los textos y usar los mensajes de la ficha («El importe supera el saldo vigente de US$ 600.00»). | HU-006 (C3) · HU-007 (C6) · §0.4 · RN-014 |
| 8 | Tras registrar el pago, el toast dice «Pago de US$ X registrado en la cuota N.» sin el saldo (la ficha pide «Pago registrado. Saldo: US$ 600.00») y el foco va a «Pagos (n)» en lugar del botón que abrió el diálogo. | comprensión | Baja | Usar el texto de la ficha; devolver el foco al botón que abrió D1 y, si desapareció porque la cuota quedó CANCELADA, a «Pagos (n)», y documentar esa excepción. | HU-006 (C1, C2) · F-05 |
| 9 | El texto «No editable: tiene pagos registrados.» aparece también cuando la causa es solo una reprogramación (S1). | comprensión | Baja | Mostrar la causa real: «tiene pagos registrados» o «tiene reprogramaciones». | HU-005 (C8) · RN-081 · RN-082 |
| 10 | Para incorporar un pago omitido anterior, después de anular los pagos posteriores no hay ayuda para volver a registrarlos en orden. | mejora | Baja | En la fila de un pago ANULADO, ofrecer «Registrar de nuevo», que abra D1 con el importe y la fecha del original (editables y validados). | HU-006 · HU-007 · RN-089 · RN-124 |
| 11 | El contador «n/500» del motivo cuenta los espacios exteriores, aunque el límite se mide tras el TRIM; puede marcar exceso en un motivo válido. | comprensión | Baja | Contar sobre el valor recortado, igual que la validación. | HU-007 (C13, C14) · RN-162 |
| 12 | «Registrar comprobante nuevo con estos datos» anuncia «mismo número permitido», mientras UI-8 dice «prellenado sin número de documento». | comprensión | Baja | Cerrar UI-8: recomendación, prellenar también el número (RN-091 y HU-007 C9 lo permiten) y dejarlo editable. | HU-007 (C9) · HU-005 · RN-091 · UI-8 |
| 13 | Los datos de prueba no cubren un comprobante por pagar (título «Registrar pago», contacto proveedor) ni uno de pago único («Forma: 3 cuotas» se mostraría como «1 cuotas»). | gap | Baja | Agregar un estado «Por pagar · pago único» y mostrar «Pago único» en la cabecera cuando haya una sola cuota. | HU-006 · HU-005 (C3) · RN-057 |
| 14 | «Fecha de pago» usa el selector nativo `dd/mm/aaaa` (captura de D1); UI-4 adopta ISO. | comprensión | Baja | Usar `CampoFecha` o cerrar UI-4 (mismo punto que P-005 obs. 13). | HU-006 · UI-4 · §0.2 |
| 15 | No se insertan las comas de miles al escribir el importe; RN-153 lo recomienda (misma discrepancia que P-005 obs. 8). | comprensión | Baja | Aplicar la decisión que se tome en P-005 decisión 8. | HU-006 (C10) · RN-153 |
| 16 | El shell repite los problemas de P-002: menú igual para todos los roles, destinos «P-020» y «P-007 Avisos de cobranza», sin «Bandeja» ni menú de usuario. | gap | Baja | Resolverlo en el shell común (P-002, decisión 2). | HU-002 · HU-003 · HU-009 · RN-060 |

---

### 5. Decisiones recomendadas antes de implementar

1. **Deshabilitar «Anular comprobante» con pagos vigentes** e indicar en qué cuotas están, como pide F-06 (obs. 1).
2. **Simular y especificar `DATOS_DESACTUALIZADOS` en D1**: rechazar el pago si la cuota cambió, aunque siga cabiendo en el saldo (obs. 2).
3. **Definir el ciclo de vida de la clave de idempotencia** tras un fallo o un rechazo y llevarlo a la ficha D1 (obs. 3).
4. **Validar el MVP sin S1 ni S4**: cambiar los valores por defecto y rehacer las capturas (obs. 4).
5. Ajustes menores que pueden ir al backlog: simulaciones de anulación concurrente y 404, textos y códigos de error, toast y foco tras el pago, causa de «No editable», «Registrar de nuevo» para pagos anulados, contador del motivo, UI-8, datos por pagar y de pago único, formato de fechas, coma de miles y shell común (obs. 5 a 16).

### 6. Score de completitud

| Métrica | Cálculo | Resultado |
|---|---|---|
| HUs Must cubiertas (sobre el total del MVP) | HU-005 (detalle y edición), HU-006 y HU-007 → 3 de 10 | **30 %** (todas las HUs Must asignadas a P-006 están representadas) |
| Criterios de HU-006 aplicables a P-006 | 11 ✅ + 2 parciales (×0.5) de 13 | **92 %** |
| Criterios de HU-007 aplicables a P-006 | 12 ✅ + 3 parciales (×0.5) de 15 (C15 fuera) | **90 %** |
| Reglas reflejables en P-006 | 27 ✅ (RN-021, 022, 024 a 032, 058 a 061, 063, 071, 081, 082, 084, 088 a 091, 124, 157, 162); 6 parciales ×0.5 (RN-062, 092, 123, 153, 156, 160); 0 ❌ → 30 de 33 | **91 %** |
| Reglas solo de backend o Should | RN-008, RN-014, atomicidad de RN-160, RN-263 a RN-266; RN-072 y HU-011 (Should) | Fuera del cálculo |

**Veredicto:** P-006 está **lista con ajustes**. El cálculo de saldos y estados, el rango de fechas de pago, la anulación con motivo normalizado, los permisos por rol y el comprobante anulado de solo lectura siguen fielmente HU-006, HU-007 y sus reglas. No hay observaciones de severidad Alta. Antes de implementar conviene cerrar las Media (1 a 4): el diálogo de anulación del comprobante con pagos vigentes, el rechazo por datos desactualizados, el manejo de la clave de idempotencia tras un fallo y la validación del MVP sin S1.

---

## P-007 Cuotas por avisar

**Fecha:** 2026-11-11. **Instrucción:** `agent-prototyper-reviewer-7.xml`.
**Prototipos revisados:** `prototipos/p007-cuotas-por-avisar/p007-cuotas-por-avisar.png` y `prototipos/p007-cuotas-por-avisar/p007-cuotas-por-avisar-confirmar-envio.png`.
**Fuentes contrastadas:** `06-user-stories.md` (HU-010 y dependencias HU-009/HU-011), `03-reglas-de-negocio.md`, `09-ui-spec.md` (P-007, P-007.D1, F-07, P-008, P-015, §0.4 y shell §3.1). Se inspeccionaron también `index.html`, `app.js` y las reglas de la barra de acción en `styles.css` de P-007.
**Método y límites:** inspección visual de ambas capturas y revisión estática del código; no se ejecutaron interacciones de navegador, llamadas al API ni envíos reales. Los comportamientos descritos fuera de las capturas proceden del código y son simulaciones, no evidencia de cumplimiento del backend. No se audita P-008 por separado en esta entrada.
**Condiciones:** corte ficticio 2026-11-09 08:15, SUPERVISOR, S1 activa, once cuotas y dos preseleccionadas. Los dominios de ejemplo y los nombres de empresa son datos ficticios; su diferencia respecto de los ejemplos de las HUs no constituye un gap.

### 1. Cobertura de HUs

| HU | Prioridad | Representación | Evaluación |
|---|---|---|---|
| HU-010 Enviar avisos de vencimiento por correo | Must | **Parcial** | Lista, filtros, selección, comentario, confirmación por correo, reenvío explícito y resultado están representados. Faltan garantías visibles de datos vigentes al reintentar, estados de concurrencia y contrato terminado; la bandeja no recibe los intentos del prototipo. |
| HU-009 Configurar correo administrativo y copias | Must | Dependencia, sin cobertura funcional propia | D1 permite consultar las copias y «Responder a»; no configura esos valores. La configuración corresponde a P-010 y no se cuenta como HU cubierta aquí. |
| HU-001 a HU-008 | Must | Fuera del alcance de esta pantalla | Se validan en sus pantallas. El enlace a P-006 es solo navegación simulada. |
| HU-011 Promesas de pago | Should (S1) | Parcial, fuera del score Must | Se ve la promesa y «Reprogramar», pero la fecha usada para estado, orden y tipo de aviso sigue siendo la original. «Reprogramar» solo muestra un toast; el diálogo corresponde a P-017. |

**Criterios de HU-010 contrastados** (agrupados por tema, sin inventar IDs de criterios del Spec Pack):

| Criterio / tarea | Evidencia y cobertura |
|---|---|
| Lista completa, columnas, saldo con moneda y orden | Representados. La cuota del 2026-12-20 acredita alcance más allá de 45 días desde el corte. No hay comprobante anulado de prueba; el filtro de datos solo excluye `cancelada`. Con S1, la fecha efectiva es incorrecta (obs. 5). |
| Seleccionar y agrupar dos cuotas del mismo contacto y tipo | Representado. D1 agrupa por contacto y tipo. La captura solo incluye la cuota 1 hasta marcar «Reenviar aviso» para la cuota 2: es el comportamiento exigido, no un error de agrupación. |
| Separar vencidas y por vencer; cuatro tipos | La clave `tipoKey` y `prepararEnvio()` separan cobrar/pagar y vencida/pendiente. Falta evidencia del contenido de las cuatro maquetas; ver obs. 10. |
| Destinatarios no editables, copia administrativa y respuesta | Visibles en D1. La lista por pagar vacía deja solo la copia administrativa. No se demuestra deduplicación ni exclusión de usuarios de copia que pierden elegibilidad. |
| Cambio de destinatarios antes de confirmar | Parcial. Se simula el cambio del correo del contacto y se pide confirmar otra vez. No se simula cambio administrativo ni de copias y el cambio simulado no actualiza la fuente `CONTACTOS` (obs. 4). |
| Reenvío con fecha y usuario; nuevo tipo sin advertencia | La casilla y el último aviso están representados. `requiereReenvio()` compara tipo y fecha correctamente; la marca y el filtro «Enviado» no lo hacen (obs. 2). |
| Fallo, timeout, error persistente y recuperación manual | Representados visualmente y en la simulación, sin reintento automático ni «Verificar envío»/espera de 24 h. El timeout se comprime a 1.1 s; no acredita los 10 s del servidor. El reintento directo reutiliza datos (obs. 1). |
| Cancelación entre selección y confirmación; ninguna apta | Parcial. Hay exclusión y mensaje sin intento si no queda ninguna apta, pero la cancelación se aplica al preparar D1, no al confirmar. No se simula anulación del comprobante (obs. 3). |
| Comentario opcional, 500/501, espacios, mayúsculas | Representado con ayuda y vista previa normalizada. La validación inicial cuenta el texto crudo antes del TRIM/mayúsculas (obs. 11). No hay evidencia de guardado en bandeja ni del correo final. |
| Vacío y contacto desactivado | Representados: vacío sin selección ni envío y TEXTILES SUR seleccionable pese a estar desactivado. |
| Concurrencia y recuperación tras caída | Parcial: FERRETERÍA NORTE aparece «Enviando…» con selección bloqueada. No se simula `INTENTO_EN_PROCESO` al confirmar ni cierre por vencimiento sin éxito registrado (obs. 6). |
| Terminación contractual | Ausente: no se representa rechazo de envío, reenvío o reintento ni transición a P-015 (obs. 7). |
| Bandeja con intentos, destinatarios y resultados históricos | Solo acceso simulado: el resultado está en memoria, no se genera historial consultable en P-008 (obs. 8). |
| Buzón de pruebas, aislamiento 404 y validación directa al API | No verificables con estas capturas/código de frontend. Son responsabilidades de integración y backend; no se dan por aprobadas ni se exige exponer el buzón técnico en la UI. |

### 2. Reglas de negocio

El inventario siguiente evalúa **solo la proyección visible de cada regla en P-007**: completa = 1, parcial = 0.5, ausente = 0. «Completa» no certifica envío real, persistencia, atomicidad ni seguridad del servidor. Las reglas relacionadas se cuentan una vez por ID aunque compartan un hallazgo.

| RN | Estado | Evidencia / límite |
|---|---|---|
| RN-039 | Completa | Solo correo, sin WhatsApp, Telegram ni SMS. |
| RN-041 | Parcial | Excluye cuotas canceladas, pero la simulación ocurre antes de abrir D1, sin revalidación final. |
| RN-042 | Parcial | Para y copias por sentido visibles y fijos; no se representa el caso de direcciones duplicadas. |
| RN-043 | Parcial | Resultado por correo y error persistente; no se conserva una bandeja de intentos consultable. |
| RN-045 | Completa | Último envío y confirmación «Reenviar aviso» por cuota, solo para mismo tipo y fecha. |
| RN-066 | Completa | Fallo visible y persistente, recuperación manual, desbloqueo y conservación de la marca anterior. El historial y los datos del nuevo intento se evalúan aparte. |
| RN-067 | Completa | Timeout simulado termina No Enviado y permite intentar manualmente sin pasos adicionales. El plazo real del servidor no es verificable aquí. |
| RN-075 | Completa | Pendientes con saldo se identifican «Por vencer», sin limitar por ventana del gráfico. |
| RN-112 | Parcial | Lista, columnas y alcance amplio; marca/filtro Enviado no se restringen a tipo y fecha vigentes. |
| RN-113 | Parcial | Selección y envío manual representados; recalcular al confirmar está incompleto. |
| RN-114 | Parcial | Cuatro tipos y saldos con moneda sin total mixto en D1; contenido final de maquetas no disponible. |
| RN-115 | Completa | Comentario opcional visible en la barra, incluido para por pagar vencida, con vista previa como texto escapado. El límite se evalúa en RN-162. |
| RN-116 | Completa | Cambiar de rol mantiene acceso a lista y envío. No acredita autorización del API. |
| RN-117 | Completa | «Responder a» muestra el correo administrativo. |
| RN-120 | Completa | Ordena vencidas primero y pendientes después, ambas por vencimiento ascendente en el escenario sin reprogramación. |
| RN-130 | Completa | Contacto desactivado visible y seleccionable para avisos. |
| RN-136 | Parcial | Destinatarios fijos y nueva confirmación por cambio de Para; faltan cambios de Copia/Responder a y comparación histórica al reenviar/reintentar. |
| RN-137 | Parcial | Estados y significado de aceptación explicados; falta la consulta de cada intento histórico. |
| RN-138 | Parcial | Reenvío manual disponible, pero reintento directo usa `r.ids` y `r.g` anteriores y sobrescribe el resultado. |
| RN-155 | Parcial | Se muestra exclusión por cancelación y caso sin aptas; faltan anulación y revalidación al confirmar/reintentar. |
| RN-157 | Completa | Botones en curso protegidos por `aria-disabled` y guardas en manejadores, con «Enviando…». |
| RN-158 | Parcial | Casilla bloqueada durante envío; no se representa conflicto nuevo ni expiración fallida de un intento ajeno. |
| RN-162 | Parcial | TRIM, mayúsculas y error sin truncar; longitud inicial sobre texto crudo. |
| RN-164 | Completa | Proyección en D1 del correo administrativo como copia y respuesta; edición se valida en P-010. |
| RN-178 | Completa | Copias por pagar vacías: solo correo administrativo en D1. |
| RN-212 | Parcial | Usa fecha fija y datos preparados; no vuelve a calcular saldo, estado y tipo al confirmar. |
| RN-213 | Parcial | Reconfirmación del cambio de Para simulada; no obtiene de nuevo todas las fuentes ni lo aplica al reintento directo. |
| RN-214 | Completa | Un grupo por contacto y tipo, incluso con monedas diferentes, sin sumar S/ y US$. |
| RN-215 | Completa | No hay envío automático: requiere acción y confirmación del usuario. |
| RN-152 | Ausente | No hay escenario de contrato terminado ni navegación a P-015. |

**Invisibles o fuera de este score:** RN-008 (aislamiento entre empresas), RN-013 (desvío al buzón de pruebas), RN-014 (restricciones de errores y registros técnicos), validación del servidor de RN-162, aceptación e identificador real del proveedor en RN-137, claves/atomicidad/plazos y rechazo de respuestas tardías en RN-158. La persistencia de RN-043/RN-137 requiere validación de integración con P-008. RN-104, RN-134, RN-135 y RN-175 a RN-179 se administran en P-010; aquí solo se revisa su consecuencia visible en destinatarios. RN-071 se revisa como comportamiento condicional de S1 (obs. 5), fuera del score base. RN-039 se refleja en el canal exclusivo de correo y se considera en el inventario. RN-040, RN-065 y RN-159 están retiradas y no se cuentan como faltantes.

### 3. Flujo de usuario

**Camino principal:** localizar cuotas → seleccionar → comentario opcional → «Enviar aviso» → revisar correos y destinatarios → marcar reenvío cuando corresponda → confirmar → ver resultado por correo. Las capturas permiten comprender selección y confirmación. El código contempla separación por tipo, estados de carga, filtro sin resultados con salida «Limpiar filtros», vacío y error con «Reintentar».

**Recuperación:** un rechazo o timeout deja error persistente y acción manual. Las cuotas fallidas conservan selección; las exitosas se desmarcan. Esta recuperación evita volver a enviar automáticamente lo exitoso, pero contradice la instrucción de P-007 de limpiar toda selección al cerrar; se recomienda resolver explícitamente esa diferencia sin perder la facilidad de recuperación (obs. 9).

**Fricciones y salidas incompletas:** el botón «Volver a intentar» del resultado omite la nueva revisión de destinatarios; «Ver bandeja» y abrir comprobante terminan en toasts de navegación; el usuario no puede comprobar el historial del envío. La barra sticky tapa varias filas en la captura principal, lo que dificulta revisar cuotas antes de enviar. «Seleccionar contacto» añade todas sus cuotas aunque los filtros oculten algunas, sin advertencia visual explícita de selección oculta. Son limitaciones funcionales de revisión, no observaciones estéticas.

### 4. Observaciones

Severidad **Alta**: puede inducir un envío con datos incorrectos o falta un bloqueo obligatorio; **Media**: flujo o estado funcional incompleto; **Baja**: comprensión, consistencia o mejora de uso.

| # | Observación | Tipo | Severidad | Acción sugerida | HU / RN afectada |
|---|---|---|---|---|---|
| 1 | `reintentar(k)` envía directamente sobre las cuotas y grupo anteriores, sin nueva vista previa, recálculo ni revisión de destinatarios. El comentario «datos vigentes» del código no ejecuta esa validación. | gap | Alta | Pasar el reintento por vista previa actualizada y confirmación; excluir cuotas no aptas, recalcular datos y mostrar cambios en Para/Copia/Responder a. Generar otro intento sin sobrescribir el anterior. | HU-010 · RN-138, RN-136, RN-155, RN-212, RN-213 · P-007.D1 |
| 2 | INVERSIONES PACÍFICO ya está VENCIDA, pero su aviso previo es `Cobrar-P`; `avisoHTML()` y el filtro usan solo la existencia de `c.aviso` y muestran Enviado. La casilla de reenvío, en cambio, sí distingue el tipo. | gap | Alta | Derivar marca y filtro de un éxito para tipo y fecha efectivos vigentes. Mostrar No Enviado para el tipo nuevo y conservar el envío anterior como historial, sin exigir reenvío. | HU-010 · RN-112, RN-045, RN-066 |
| 3 | `prepararEnvio()` aplica cancelación antes de abrir D1. `confirmar()` no recalcula aptitud, saldo ni tipo. No existe caso de comprobante anulado. | gap | Alta | Simular cambios mientras D1 está abierto y revalidar al confirmar y reintentar: pago parcial, cancelación, anulación y cambio de día. Mostrar excluidas; sin aptas, no crear intento ni enviar. | HU-010 · RN-041, RN-155, RN-212 · P-007.D1 |
| 4 | La simulación solo cambia `g.para`; no actualiza `CONTACTOS`. Al abrir otro diálogo vuelve el correo anterior. No cubre cambios administrativos/copias ni valor anterior en reenvíos. | gap | Media | Mantener una fuente vigente coherente y simular cambios de las tres clases de destinatarios; reconfirmar y destacar cada cambio respecto del último intento. | HU-010 · HU-009 · RN-136, RN-213, RN-138 |
| 5 | Con S1 activa, la cuota F001-00058 tiene promesa 2026-11-20 pero usa 2026-11-07 para estado, orden y tipo. Aparece vencida aunque debería estar pendiente según la fecha efectiva. | gap | Media | Centralizar fecha efectiva y usarla en columnas, orden, clasificación y envío. Validar el MVP con S1 apagada y revisar S1 por separado; P-017 debe abrir un diálogo o declararse acceso pendiente. | HU-010 · HU-011 · RN-071, RN-112, RN-120, RN-212 |
| 6 | Solo se representa bloqueo ya existente. «Actualizar» convierte el envío de FERRETERÍA NORTE en éxito; no hay conflicto al confirmar ni expiración sin éxito. | gap | Media | Añadir escenarios `INTENTO_EN_PROCESO`, proceso caído y plazo vencido → No Enviado, con actualización y nuevo intento manual. No exigir verificación posterior. | HU-010 · RN-158, RN-067 · P-007.D1 |
| 7 | No se representa rechazo por terminación efectiva del contrato. | gap | Alta | Simular `CONTRATO_TERMINADO` en envío, reenvío y reintento, con transición a P-015. Verificar en backend que no llama al proveedor ni registra otro intento. | HU-010 · RN-152 · P-015 |
| 8 | «Ver bandeja» solo anuncia navegación; `D.resultados` es temporal y el reintento reemplaza el resultado. No se puede consultar el intento fallido seguido del nuevo. | gap | Media | Conectar P-008 a un historial ficticio compartido que agregue cada intento con sus datos inmutables y permita volver a P-007. Validar persistencia real en integración. | HU-010 · RN-043, RN-137, RN-138 · P-008 |
| 9 | Al cerrar se vuelve a renderizar sin recargar corte ni limpiar toda selección, a diferencia de la ficha; conservar fallidas sí ayuda a recuperar errores. | comprensión | Media | Acordar y actualizar P-007: recargar datos y corte al cerrar; conservar solo cuotas fallidas todavía aptas si se elige esa recuperación. Distinguir cancelar confirmación de cerrar resultado. | HU-010 · RN-112, RN-138, RN-155 · P-007 |
| 10 | D1 muestra tipos y cuotas, pero no el contenido final de las cuatro maquetas, incluyendo días de atraso y redacción dirigida al proveedor sin pedirle pago. | gap | Media | Adjuntar ejemplos de correo generado para los cuatro tipos, incluido uno con S/ y US$ sin total mixto. No es obligatorio añadir un editor ni una vista previa completa a la UI. | HU-010 · RN-114, RN-214 |
| 11 | El contador y el rechazo usan `.length` antes de normalizar; por ejemplo, 500 letras con espacios exteriores se marcan inválidas antes de salir del campo, aunque luego se aceptan al hacer TRIM. | comprensión | Baja | Validar y contar sobre texto recortado y convertido a mayúsculas; contar caracteres según RN-162 y mantener el texto original sin truncarlo. | HU-010 · RN-162, RN-115 |
| 12 | La barra sticky cubre filas seleccionadas y sus avisos en la captura principal, dificultando revisar la selección. | fricción | Media | Evitar superposición o permitir contraer la barra; comprobar que todas las filas y sus controles puedan verse y alcanzarse con teclado y scroll. | HU-010 · RN-112, RN-045 · P-007 |
| 13 | «Seleccionar contacto» opera sobre todas sus cuotas, incluso ocultas por filtros; el resumen no distingue selección visible y oculta. | fricción | Baja | Mantener la selección por contacto, pero indicar cuántas cuotas seleccionadas están ocultas y ofrecer «Ver selección» antes de D1. | HU-010 · RN-113, RN-136 · P-007 |
| 14 | El shell muestra Configuración a todos los roles con destino P-020, omite subnavegación de Avisos y menú de usuario; sus enlaces solo generan toasts. | gap | Baja | Aplicar el shell común: configuración P-010 solo para ADMINISTRADOR, Cuotas/Bandeja y menú personal. Reutilizar la decisión del shell de P-002. | HU-009 · HU-010 · HU-002 · RN-060 · P-010, P-008 |
| 15 | No hay escenario que muestre direcciones duplicadas ni un usuario de copia que deje de ser elegible. Las copias se forman concatenando listas fijas. | gap | Baja | Añadir datos de prueba para deduplicación y pérdida de elegibilidad, mostrando destinatarios efectivos en D1; la comprobación definitiva corresponde al servidor. | HU-010 · HU-009 · RN-042, RN-135, RN-136 |

### 5. Decisiones recomendadas antes de implementar

1. **Unificar envío, reenvío y reintento bajo recálculo y confirmación vigentes** (obs. 1, 3 y 4). Llevar a P-007.D1 los escenarios de datos modificados y exclusión total o parcial; conservar cada intento por separado.
2. **Corregir marca y filtro Enviado por tipo y fecha efectiva** (obs. 2). El caso de INVERSIONES PACÍFICO debe mostrar No Enviado para el tipo vencido actual, conservando el aviso por vencer en su historial.
3. **Completar los bloqueos visibles obligatorios**: contrato terminado → P-015, envío concurrente y expiración del intento sin éxito (obs. 6 y 7). El bloqueo atómico y el plazo se verifican después en backend.
4. **Validar el MVP sin S1 y corregir la fecha efectiva antes de habilitar S1** (obs. 5). No presentar esa función como lista por mostrar una promesa y un toast de reprogramación.
5. **Conectar la bandeja y acordar la salida del resultado** (obs. 8 y 9): corte actualizado, historial inmutable y tratamiento explícito de las cuotas fallidas seleccionadas.
6. **Revisar los cuatro correos finales** con ejemplos de RN-114 y documentar su evidencia (obs. 10). No ampliar el alcance a edición de maquetas.
7. **Permitir revisar toda la selección sin controles tapados** (obs. 12). Incorporar luego contador normalizado, selección oculta, shell y casos de destinatarios duplicados/no elegibles (obs. 11, 13 a 15).

### 6. Score de completitud

| Métrica | Cálculo | Resultado |
|---|---|---|
| HUs Must representadas respecto del MVP | HU-010 parcial / 10 HUs Must; accesos y dependencias no se cuentan | **10 % representadas**, no completadas |
| HUs Must del ámbito P-007 representadas | 1 / 1 (HU-010 parcial) | **100 % representadas** |
| HUs Must del ámbito completamente cubiertas | 0 / 1 | **0 % completas** |
| Reglas con proyección visible completa | 15 / 30 del inventario de §2 | **50 %** |
| Reglas con alguna representación | (15 completas + 14 parciales) / 30 | **96.7 %** |
| Reglas reflejadas, ponderado por completitud | (15 × 1 + 14 × 0.5 + 1 × 0) / 30 = 22 / 30 | **73.3 %** |

El score se limita al inventario explícito de esta pantalla, no a todas las reglas del proyecto. Las obligaciones solo de backend y S1 quedan fuera del denominador; las reglas parciales no se presentan como cumplidas. Estos porcentajes no acreditan pruebas de integración ni preparación para producción.

**Veredicto: P-007 requiere ajustes funcionales antes de implementar.** Selección, confirmación y recuperación visible del fallo están bien representadas. Deben cerrarse las observaciones Alta (1, 2, 3 y 7) y resolver las Media (4, 5, 6, 8, 9, 10 y 12) para evitar trasladar a implementación un reintento con datos antiguos, una marca de envío incorrecta o estados obligatorios sin salida definida.
