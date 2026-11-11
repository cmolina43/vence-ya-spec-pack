# 09 - UI Specification de VenceYa

**Fase BMAD:** diseño — Agente UI Designer (`09-ui-spec.xml`).
**Fuentes:** `00-constitucion.md`, `02-alcance.md`, `06-user-stories.md`, `07-architecture.md` (y, como apoyo, `03-reglas-de-negocio.md` y `07-openapi.yaml`).
**Fecha:** 2026-11-11.
**Estado:** borrador para validación.

> Esta especificación no modifica principios, alcance, reglas ni contratos. Si difiere de `07-openapi.yaml` o de `03-reglas-de-negocio.md`, prevalecen esos documentos y la diferencia se corrige aquí.

---

## 0. Convenciones de esta especificación

### 0.1 Principios de la constitución aplicados a la interfaz

| Principio | Cómo se aplica en la UI |
|---|---|
| PRINCIPIO-001 Idioma | Todos los textos, etiquetas, mensajes, rutas de la SPA, nombres de componentes y `aria-label` están en español (es-PE). `<html lang="es-PE">`. |
| PRINCIPIO-003 Aislamiento | La UI nunca envía ni muestra el identificador de empresa. Un recurso de otra empresa se trata igual que uno inexistente: pantalla P-015 «No encontrado». |
| PRINCIPIO-005 Datos personales | Los mensajes de error no repiten el valor ingresado, nombres, correos ni importes (se muestra el `mensaje` del API y, para soporte, solo el `idSolicitud`). La UI no escribe datos personales en `console`, analítica ni almacenamiento local. Los prototipos usan datos ficticios (`@example.com`). |
| PRINCIPIO-006 Inmutabilidad | No existe ningún control para editar o eliminar un pago, una anulación ni un usuario. Las correcciones se ofrecen solo como «Anular». |
| PRINCIPIO-009 Canales | El único canal de aviso que aparece es «correo». No hay opciones de WhatsApp, SMS ni Telegram. |
| PRINCIPIO-010 Accesibilidad | WCAG 2.2 AA en todas las pantallas: navegación completa por teclado, foco visible, contraste ≥ 4.5:1 en texto y ≥ 3:1 en bordes de controles, objetivos táctiles ≥ 24×24 px (se recomienda 44×44 px en móvil), etiquetas asociadas, errores anunciados, estado nunca transmitido solo por color, y cada gráfico acompañado de una tabla equivalente. Responsive en móvil, tablet y escritorio. |

### 0.2 Formatos visibles

| Dato | Formato en pantalla | Ejemplo | Fuente |
|---|---|---|---|
| Importe | Símbolo de moneda + espacio + número peruano con 2 decimales | `S/ 1,000.00`, `US$ 3,000.00` | RN-153 |
| Importe ingresado | Punto decimal (0 a 2 cifras), coma de miles obligatoria desde 1,000, sin signo | `1,000.50`, `100`, `100.5` | RN-153 |
| Fecha de negocio | ISO `AAAA-MM-DD` (como en los criterios de aceptación y RN-112) | `2026-11-09` | HU-010, RN-112 |
| Fecha y hora de un hecho | `AAAA-MM-DD HH:mm` en America/Lima | `2026-11-05 09:10` | RN-112 |
| Leyenda de corte | `Datos al DD/MM/AAAA, HH:mm` | `Datos al 09/11/2026, 08:15` | RN-069, RN-205 a RN-210 |
| Días promedio | 2 decimales y la palabra «días» | `37.50 días` | RN-053 |
| Textos normalizados por el servidor | Se muestran tal como los devuelve el API (mayúsculas en nombres, motivos y comentarios; minúsculas en correos) | `DISTRIBUIDORA LIMA` | RN-162 |

Los importes se muestran con `font-variant-numeric: tabular-nums` y alineados a la derecha en tablas.

### 0.3 Estados visuales comunes (vocabulario de badges)

Todo estado se muestra con **texto** dentro del badge; el color es un refuerzo (WCAG 1.4.1).

| Dominio | Valor | Badge (token) | Icono opcional (decorativo, `aria-hidden`) |
|---|---|---|---|
| Estado de cuota | PENDIENTE | `estado-pendiente` (azul) | reloj |
| | VENCIDA | `estado-vencida` (rojo) | alerta |
| | CANCELADA | `estado-cancelada` (verde) | check |
| | ANULADA (heredada del comprobante) | `estado-anulado` (gris) | prohibido |
| Comprobante | ANULADO | `estado-anulado` (gris) | prohibido |
| Marca | Reprogramada (S1) | `marca-reprogramada` (ámbar, borde) | calendario |
| Aviso de la cuota | Enviado · fecha | `aviso-enviado` (verde) | sobre |
| | No Enviado | `aviso-no-enviado` (gris) | sobre tachado |
| | Enviando… (EN_PROCESO) | `aviso-en-proceso` (azul + spinner) | — |
| Usuario / contacto | ACTIVO | `estado-cancelada` (verde) | — |
| | INVITADO | `estado-pendiente` (azul) | — |
| | DESACTIVADO | `estado-anulado` (gris) | — |
| Promesa (S1) | ACTIVA / CUMPLIDA / INCUMPLIDA / REEMPLAZADA | ámbar / verde / rojo / gris | — |

### 0.4 Estados de pantalla estándar

Cada pantalla define, como mínimo, estos estados:

| Estado | Comportamiento |
|---|---|
| **Cargando** | Esqueletos (`Skeleton`) con la forma del contenido; `aria-busy="true"` en la región; no se muestran ceros falsos. |
| **Vacío** | Mensaje explicativo + acción principal (por ejemplo «Registrar comprobante»). |
| **Con datos** | Contenido normal. |
| **Error de carga** | `Alert` destructivo persistente con el mensaje del API, el `idSolicitud` en texto pequeño y botón «Reintentar». |
| **Enviando** | El botón de la acción queda deshabilitado con spinner y texto «Guardando…»/«Enviando…»; el formulario no se puede reenviar (RN-156). |
| **Error de validación** | Resumen de errores al inicio del formulario (`role="alert"`, con enlaces a cada campo) + mensaje bajo cada campo (`aria-describedby`, `aria-invalid="true"`); el foco va al resumen. |
| **Conflicto** (`409 DATOS_DESACTUALIZADOS`) | `Alert` de advertencia: «Los datos cambiaron mientras editabas. Recarga para ver la versión vigente.» con botón «Recargar». No se pierde lo escrito hasta que el usuario recarga. |
| **Sin sesión** (`401`) | Redirige a P-001 con el aviso «Tu sesión terminó. Vuelve a iniciar sesión.» |
| **Sin permiso** (`403 PERMISO_DENEGADO`) | Toast/Alert «No tienes permiso para esta acción.» La UI ya oculta las acciones no permitidas por rol; este estado cubre cambios de rol en curso. |

### 0.5 Identificadores de diálogos

Los diálogos modales que forman parte de una pantalla llevan el ID de su pantalla seguido de `.D<n>` (por ejemplo, `P-006.D1`). No son pantallas independientes del inventario, pero se especifican con el mismo detalle.

---

## 1. Inventario de Pantallas

Prioridad MoSCoW heredada de la funcionalidad de alcance de la HU (`02-alcance.md`). Orden: Must, luego Should.

| ID | Nombre | Ruta SPA | Actor principal | HUs que implementa | Prioridad |
|---|---|---|---|---|---|
| P-001 | Iniciar sesión | `/iniciar-sesion` | Usuario de la empresa (sin sesión) | HU-002 | Must |
| P-002 | Panel de cartera | `/panel` | Todos los roles | HU-008 (+ tarjeta HU-012 · Should; + promesas activas HU-011 · Should) | Must |
| P-003 | Contactos | `/contactos` | Todos los roles | HU-004 (+ indicador HU-013 · Should pendiente de aprobación) | Must |
| P-004 | Comprobantes | `/comprobantes` | Todos los roles | HU-005, HU-007 | Must |
| P-005 | Registrar / editar comprobante | `/comprobantes/nuevo`, `/comprobantes/:id/editar` | Todos los roles | HU-005 | Must |
| P-006 | Detalle de comprobante y cuotas | `/comprobantes/:id` | Todos los roles (anulación: SUPERVISOR y ADMINISTRADOR) | HU-005, HU-006, HU-007 (+ HU-011, HU-017 · Should) | Must |
| P-007 | Cuotas por avisar | `/avisos` | Todos los roles | HU-010 (+ promesas HU-011 · Should) | Must |
| P-008 | Bandeja interna de avisos | `/avisos/bandeja`, `/avisos/bandeja/:id` | Todos los roles | HU-010 | Must |
| P-009 | Usuarios de la empresa | `/usuarios` | ADMINISTRADOR | HU-003 | Must |
| P-010 | Configuración de la empresa | `/configuracion` | ADMINISTRADOR | HU-009, HU-008 | Must |
| P-011 | Mis preferencias | `/mi-cuenta/preferencias` | Todos los roles | HU-008 | Must |
| P-012 | Activar cuenta | `/activar-cuenta` | Usuario INVITADO | HU-002 | Must |
| P-013 | Solicitar recuperación de contraseña | `/recuperar-contrasena` | Usuario ACTIVO (sin sesión) | HU-002 | Must |
| P-014 | Restablecer contraseña | `/restablecer-contrasena` | Usuario ACTIVO (sin sesión) | HU-002 | Must |
| P-015 | Páginas de estado (no encontrado, contrato terminado, error) | `*`, `/contrato-terminado` | Todos | HU-002, HU-003, HU-004 a HU-010 (404 de aislamiento) | Must |
| P-016 | Historial cronológico de la cuota | `/cuotas/:id/historial` | Todos los roles | HU-017 | Should (con S1 o S4) |
| P-017 | Reprogramar cuota (diálogo `P-006.D4`, también accesible desde P-007) | — (diálogo) | Todos los roles | HU-011 | Should (S1) |
| P-018 | Reporte de vencimientos | `/reportes/vencimientos` | Todos los roles (exportar: SUPERVISOR y ADMINISTRADOR) | HU-014, HU-016 | Should (S4) — **HU pendiente de aprobación** |
| P-019 | Exportar listado de movimientos | `/reportes/movimientos` | SUPERVISOR y ADMINISTRADOR | HU-015 | Should (S4) — **HU pendiente de aprobación** |

**Sin pantalla, por decisión documentada:**

| Elemento | Motivo |
|---|---|
| HU-001 Alta de empresa y primer administrador | Procedimiento interno del equipo de VenceYa por la API interna (ADR-007, RN-095). No existe pantalla de autoalta (O15). |
| HU-018 Terminación y baja contractual | No se desarrolla como funcionalidad (pregunta 52). Su único efecto visible es P-015 «Contrato terminado» (HU-002, HU-010). |
| C1 Importación desde Excel, C3 Maquetas editables | Funcionalidades Could sin HU aprobada; por la restricción de trazabilidad no se inventarían. |
| Solicitudes de eliminación de datos personales | Gestión interna fuera de la aplicación (M-11). |

---

## 2. User Flows

Notación: `[P-XXX]` pantalla, `(acción del usuario)`, `→` transición, `⟂` rama alternativa o de error.

### F-01 Activación de cuenta e ingreso (HU-002, HU-003)

```text
Correo de invitación (Resend)
 (abre el enlace) → [P-012 Activar cuenta]
   (escribe contraseña y la confirma) (pulsa «Activar cuenta»)
   → mensaje «Cuenta activada» → [P-001 Iniciar sesión] (correo precargado)
   ⟂ enlace vencido/usado/revocado → [P-012] estado «Enlace no válido»: «Pide a un administrador de tu empresa que te reenvíe la invitación.»
   ⟂ contraseña inválida (< 8, > 128, solo espacios) → error en el campo; el enlace no se consume
   ⟂ contrato terminado → [P-015 Contrato terminado]
[P-001] (correo + contraseña) (pulsa «Iniciar sesión») → [P-002 Panel de cartera]
   ⟂ credenciales inválidas, bloqueo o correo inexistente → mismo mensaje genérico
```

### F-02 Recuperación de contraseña (HU-002)

```text
[P-001] (pulsa «¿Olvidaste tu contraseña?») → [P-013]
   (escribe correo) (pulsa «Enviar enlace») → mensaje neutro (siempre el mismo)
Correo de recuperación (abre el enlace) → [P-014 Restablecer contraseña]
   (nueva contraseña + confirmación) (pulsa «Guardar contraseña»)
   → «Contraseña actualizada. Se cerraron tus sesiones abiertas.» → [P-001]
   ⟂ enlace vencido (60 min) o ya usado → [P-014] estado «Enlace no válido» + enlace a [P-013]
```

### F-03 Rutina diaria: revisar cartera (HU-008, HU-012)

```text
[P-002 Panel]
   (cambia selector de moneda S/ ↔ US$) → recarga el panel en esa moneda (no se guarda como preferencia)
   (elige ventana 7/10/15 días) → recarga proyección y guarda la ventana como preferencia propia (RN-119)
   (pulsa «Ver tabla» del gráfico) → tabla accesible equivalente
   (filtra/ordena el listado de movimientos) (activa «Incluir comprobantes anulados»)
   (pulsa número de comprobante en una fila) → [P-006 Detalle]
   (pulsa «Actualizar») → nuevo corte «Datos al …»
   (pulsa «Ir a avisos») → [P-007]
```

### F-04 Alta de contacto y comprobante (HU-004, HU-005)

```text
[P-004 Comprobantes] (pulsa «Registrar comprobante») → [P-005]
   (elige sentido Por cobrar/Por pagar)
   (busca contacto en el combobox) ⟂ no existe → (pulsa «Crear contacto») → [P-003.D1 Contacto] → vuelve con el contacto seleccionado
   (número de documento, moneda, total, fecha de emisión)
   (elige «Pago único» → fecha de vencimiento) | (elige «En cuotas» → cantidad → «Proponer cuotas» → edita filas)
   (pulsa «Guardar comprobante») → [P-006 Detalle] con toast «Comprobante registrado»
   ⟂ duplicado → error en «Número de documento»
   ⟂ suma de cuotas ≠ total → bloqueo con «Diferencia: S/ 66.67»
```

### F-05 Registrar un cobro o pago (HU-006)

```text
[P-002] o [P-004] → [P-006 Detalle]
   (en la fila de la cuota, pulsa «Registrar pago») → [P-006.D1]
   (importe, fecha de pago) (pulsa «Registrar pago»; botón deshabilitado mientras envía)
   → cierra diálogo, toast «Pago registrado», la cuota muestra su nuevo saldo/estado
   ⟂ IMPORTE_SUPERA_SALDO → el diálogo sigue abierto y muestra «Saldo vigente: S/ 600.00» (consultado de nuevo)
   ⟂ fecha fuera de orden → error en «Fecha de pago»
   ⟂ otro usuario pagó antes (409) → mensaje de conflicto + saldo actualizado
```

### F-06 Corregir un pago o un comprobante (HU-007, HU-006) — SUPERVISOR / ADMINISTRADOR

```text
[P-006] (pulsa «Ver pagos» de la cuota) → lista de pagos en la fila expandida
   (pulsa «Anular» en un pago) → [P-006.D2 Anular pago] (motivo) (pulsa «Anular pago»)
   → el pago queda marcado ANULADO, el saldo se recalcula
   (opcional) (pulsa «Registrar pago») → pago de reemplazo [P-006.D1]
[P-006] (pulsa «Anular comprobante») → [P-006.D3]
   ⟂ tiene pagos vigentes → el diálogo no se abre; aviso «Primero anula los pagos vigentes»
   (motivo) (pulsa «Anular comprobante») → comprobante ANULADO, solo lectura
   (opcional) (pulsa «Registrar comprobante nuevo») → [P-005] con datos copiados (sin número de documento ni pagos)
```

### F-07 Enviar avisos de vencimiento (HU-010, HU-009)

```text
[P-007 Cuotas por avisar]
   (filtra por sentido/estado/contacto) (marca casillas de cuotas)
   (escribe comentario opcional) (pulsa «Enviar aviso (n)»)
   → [P-007.D1 Confirmar envío] muestra por cada correo: Para, Copia, Responder a, cuotas, tipo (no editables)
      ⟂ cuotas con aviso «Enviado» vigente → bloque «Último aviso: 2026-11-05, Ana» + casilla obligatoria «Reenviar aviso»
      ⟂ cuotas excluidas (cancelada, anulada) → lista con motivo
   (pulsa «Confirmar y enviar»; botón deshabilitado)
   → resultado por correo: «Aviso enviado» | «No Enviado — motivo» + «Volver a intentar»
   ⟂ DESTINATARIOS_CAMBIARON → el diálogo se recarga con destinatarios vigentes y pide confirmar de nuevo
   ⟂ INTENTO_EN_PROCESO → «Otro usuario está enviando un aviso de estas cuotas. Espera unos segundos.»
   ⟂ SIN_CUOTAS_APTAS → «Ninguna cuota seleccionada sigue siendo apta» + motivos
[P-007] (pulsa «Ver bandeja») → [P-008 Bandeja interna] → (fila) → detalle del intento
```

### F-08 Administrar usuarios (HU-003) — ADMINISTRADOR

```text
[P-009 Usuarios] (pulsa «Invitar usuario») → [P-009.D1] (correo, rol) (pulsa «Enviar invitación»)
   → fila nueva INVITADO; ⟂ correo no enviado → fila con aviso «Correo no enviado» + «Reenviar invitación»
   (menú de fila «Cambiar rol») → [P-009.D2] advertencia «Se cerrarán todas sus sesiones» → (confirma)
   (menú de fila «Desactivar») → [P-009.D3] confirmación → DESACTIVADO
      ⟂ último administrador activo → error ULTIMO_ADMINISTRADOR_ACTIVO
   (menú de fila «Reactivar») → ACTIVO (si tenía contraseña) o INVITADO con enlace nuevo
   (menú de fila «Reenviar invitación») → enlace nuevo de 72 h
```

### F-09 Configurar empresa y copias (HU-009, HU-008) — ADMINISTRADOR

```text
[P-010 Configuración]
   (edita correo administrativo) (pulsa «Guardar») → auditado; aviso «Los nuevos avisos usarán este correo»
   (elige moneda por defecto de la empresa) (pulsa «Guardar»)
   (en «Copias de avisos por cobrar», pulsa «Agregar usuario») → combobox solo con SUPERVISOR/ADMINISTRADOR ACTIVOS
   (pulsa «Quitar» en un usuario) → confirmación → lista actualizada
```

### F-10 Preferencias personales (HU-008)

```text
Menú de usuario (pulsa «Mis preferencias») → [P-011]
   (elige moneda preferida: «Usar la de la empresa» | S/ | US$) (elige ventana 7/10/15) (pulsa «Guardar»)
   → [P-002] abre con esas preferencias en el siguiente ingreso
```

### F-11 Reprogramar y consultar historial (HU-011, HU-017) — Should

```text
[P-006] o [P-007] (pulsa «Reprogramar» en una cuota con saldo) → [P-006.D4]
   (nueva fecha) (pulsa «Guardar reprogramación») → marca «Reprogramada», nueva fecha efectiva
[P-006] (pulsa «Historial» en una cuota) → [P-016 Historial cronológico]
```

### F-12 Reporte y exportaciones (HU-014, HU-015, HU-016) — Should, pendiente de aprobación

```text
Menú «Reportes» → [P-018] (sentido, periodo de canceladas) (pulsa «Consultar»)
   → grupos con totales por moneda; SUP/ADM: (pulsa «Exportar CSV» | «Exportar Excel»)
Menú «Reportes» → [P-019] (periodo de emisión, sentido, incluir anulados) (pulsa «Exportar CSV» | «Exportar Excel»)
```

---

## 3. Layout global (shell de la aplicación)

Aplica a todas las pantallas con sesión (P-002 a P-011, P-016 a P-019). Las pantallas sin sesión (P-001, P-012 a P-014) usan el layout «Acceso» (3.3).

### 3.1 Escritorio (≥ 1024 px)

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ [Saltar al contenido] (visible solo al recibir foco)                                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ HEADER (64 px, fondo superficie, borde inferior)                                     │
│ [Logo VenceYa]  COMERCIAL ANDINA S.A.C.                [?Ayuda]  [Ana ▾ ADMINISTRADOR]│
├───────────────┬──────────────────────────────────────────────────────────────────────┤
│ SIDEBAR 248px │ MAIN (id="contenido", max-width 1280 px, padding 24 px)              │
│ <nav aria-    │  Migas: Inicio / Comprobantes / F001-00045                           │
│ label="Menú   │  ┌ Encabezado de página ───────────────────────────────────────────┐ │
│ principal">   │  │ <h1>Título</h1>   [Acción secundaria] [Acción primaria]         │ │
│ ▸ Panel       │  └─────────────────────────────────────────────────────────────────┘ │
│ ▸ Comprobantes│  Contenido de la pantalla                                            │
│ ▸ Contactos   │                                                                      │
│ ▸ Avisos      │                                                                      │
│   · Por avisar│                                                                      │
│   · Bandeja   │                                                                      │
│ ▸ Reportes*   │                                                                      │
│ ── Admin ──   │                                                                      │
│ ▸ Usuarios    │                                                                      │
│ ▸ Configuración│                                                                     │
└───────────────┴──────────────────────────────────────────────────────────────────────┘
 * Reportes solo aparece cuando S4 esté entregada. «Admin» solo para ADMINISTRADOR.
```

- **Menú de usuario** (`DropdownMenu`): nombre/correo del usuario, badge de rol, «Mis preferencias», «Cerrar sesión».
- **Ítem activo** del menú: `aria-current="page"`, fondo `primario-suave`, barra izquierda de 3 px `primario`.
- **Región de anuncios** global: `<div aria-live="polite">` para toasts (`Sonner` de shadcn) y otra `aria-live="assertive"` para errores críticos.
- **Título del documento:** `«<Título de pantalla> · VenceYa»`; cambia en cada navegación y el foco se mueve al `<h1>`.

### 3.2 Tablet (640–1023 px) y móvil (< 640 px)

```text
┌───────────────────────────────────────┐
│ [☰ Menú]  [Logo]          [Ana ▾]     │  ← header 56 px; ☰ abre Sheet lateral con el mismo <nav>
├───────────────────────────────────────┤
│ <h1>Título</h1>                        │
│ [Acción primaria — ancho completo]     │
│ Contenido en una columna               │
│ Tablas → tarjetas apiladas (ver 3.4)   │
└───────────────────────────────────────┘
```

- En tablet el sidebar se colapsa a iconos con texto en `Tooltip` **y** `aria-label`; en móvil se reemplaza por `Sheet`.
- El `Sheet` atrapa el foco, se cierra con `Esc` y devuelve el foco al botón «Menú».

### 3.3 Layout «Acceso» (sin sesión)

```text
┌──────────────────────────────────────────────┐
│                 [Logo VenceYa]               │
│        Control de cobranzas y pagos          │
│  ┌────────────────────────────────────────┐  │
│  │ Card 400 px (100 % en móvil, margen 16) │  │
│  │ <h1>…</h1>                              │  │
│  │ formulario                              │  │
│  └────────────────────────────────────────┘  │
│      Conexión segura · Ayuda                 │
└──────────────────────────────────────────────┘
```

### 3.4 Patrón de tablas responsive

- **≥ 1024 px:** `Table` con encabezados `<th scope="col">`, `caption` visible o `sr-only`, ordenación con botones en el encabezado (`aria-sort`).
- **< 1024 px:** cada fila se muestra como `Card` con pares «etiqueta: valor» (`<dl>`), manteniendo el mismo orden de lectura; las acciones de la fila van en un menú «Acciones» al pie de la tarjeta.
- Paginación (usuarios, contactos, comprobantes, bandeja): componente `Pagination` con «Anterior», números y «Siguiente»; 20 por página (API `tamanoPagina`).
- El panel y las cuotas por avisar **no** se paginan (ADR-008): filtrado y ordenación en el cliente.

---

## 4. Screen Specs

Formato de cada ficha: propósito, actor, HUs, datos que muestra (con su endpoint), acciones, reglas de negocio, wireframe y estados. Los endpoints se citan por su número del inventario de `07-architecture.md` §4.2.

---

### P-001 Iniciar sesión

| Campo | Detalle |
|---|---|
| **Propósito** | Autenticar a un usuario de la empresa con correo y contraseña. |
| **Actor** | Usuario ADMINISTRADOR, SUPERVISOR u OPERADOR sin sesión. |
| **HUs** | HU-002 |
| **Datos que muestra** | Formulario vacío; mensaje informativo opcional recibido por parámetro de navegación (sesión terminada, cuenta activada, contraseña actualizada). |
| **Endpoints** | #1 `POST /autenticacion/inicio-sesion`; #3 `GET /autenticacion/sesion` (al cargar, para redirigir si ya hay sesión). |
| **Acciones** | Iniciar sesión · Ir a «¿Olvidaste tu contraseña?» (P-013) · Mostrar/ocultar contraseña. |
| **Reglas de negocio** | RN-101 (estados que pueden ingresar), RN-103 (bloqueo 5 fallos/15 min y **mensaje único** para contraseña incorrecta, bloqueo o correo inexistente), RN-139 (normalización del correo: TRIM + minúsculas lo hace el servidor), RN-149 (30 min de inactividad / 12 h absolutas), RN-152 (contrato terminado), RN-243 a RN-253 (contraseña sin recorte ni normalización). |

**Wireframe (layout Acceso):**

```text
┌ Card ─────────────────────────────────────────────┐
│ <h1>Iniciar sesión</h1>                            │
│ [Alert info, si viene de otra pantalla]            │
│   «Tu sesión terminó. Vuelve a iniciar sesión.»    │
│ [Alert error, role=alert, si falla]                │
│   «Correo o contraseña incorrectos, o la cuenta    │
│    está bloqueada temporalmente.»                  │
│                                                    │
│ Correo electrónico *                               │
│ [ ana@andina.example                         ]     │  type=email, autocomplete=username
│                                                    │
│ Contraseña *                                       │
│ [ ••••••••••••••••                     ] [👁 Mostrar]│ autocomplete=current-password
│                                                    │  botón con aria-pressed y texto «Mostrar»/«Ocultar»
│ [        Iniciar sesión         ] (primario, 100%) │
│                                                    │
│ ¿Olvidaste tu contraseña?  (enlace → P-013)        │
└────────────────────────────────────────────────────┘
```

**Estados:**

| Estado | Detalle |
|---|---|
| Inicial | Foco en «Correo electrónico». Si hay mensaje informativo, se anuncia (`role="status"`). |
| Enviando | Botón «Iniciando sesión…» deshabilitado con spinner. |
| Credenciales inválidas (`401 CREDENCIALES_INVALIDAS`) | Alert con el **mismo** texto genérico en todos los casos; se limpia el campo contraseña y el foco vuelve a él. No se indica cuántos intentos quedan. |
| Contrato terminado (`403 CONTRATO_TERMINADO`) | Navega a P-015 «Contrato terminado». |
| Éxito | Navega a la ruta solicitada originalmente o a `/panel`. |

**Validación en cliente (anticipada; la definitiva es del servidor, RN-251):** correo obligatorio con «@»; contraseña obligatoria. **No** se recorta ni modifica la contraseña.

---

### P-002 Panel de cartera

| Campo | Detalle |
|---|---|
| **Propósito** | Mostrar en un solo corte cuánto está vencido y pendiente por cobrar y por pagar, la proyección de los próximos días y el listado completo de movimientos (una fila por cuota), para priorizar cobros y pagos. |
| **Actor** | Todos los roles (OPERADOR, SUPERVISOR, ADMINISTRADOR; incluye dueño o directiva). |
| **HUs** | HU-008 (Must); HU-012 tarjeta de tiempo promedio de cobro (Should, bandera `FUNCIONALIDAD_S5`); HU-011 bloque de promesas activas (Should, bandera `FUNCIONALIDAD_S1`, RN-036). |
| **Datos que muestra** | Leyenda de corte; selector de moneda con indicador de vencidos en la otra moneda; 4 indicadores (vencida por cobrar, vencida por pagar, pendiente de cobro, pendiente de pago); gráfico de proyección por día (cobros y pagos en series separadas) + tabla equivalente; listado de movimientos: sentido, contacto, comprobante, cuota n/N, fecha efectiva de vencimiento, importe, saldo, estado, marca de reprogramación (S1), días de atraso. Tarjeta S5: mes, valor en días o «Sin datos», etiqueta «Mes en curso — datos parciales». |
| **Endpoints** | #42 `GET /panel?moneda=&ventana=&incluirAnulados=`; #43 `GET /panel/tiempo-promedio-cobro?mes=AAAA-MM` (S5); #17 `PUT /mi-cuenta/preferencias` (al cambiar la ventana). |
| **Acciones** | Cambiar moneda (solo esta consulta) · Cambiar ventana 7/10/15 (se guarda como preferencia) · Ver tabla del gráfico · Actualizar (nuevo corte) · Filtrar listado (sentido, estado, texto de contacto o comprobante) · Ordenar · Incluir comprobantes anulados · Abrir comprobante (P-006) · Ir a avisos (P-007) · Elegir mes de la tarjeta S5. |
| **Reglas de negocio** | RN-046 (4 indicadores, aunque sean cero), RN-047 (nunca sumar S/ con US$), RN-048 (proyección por día; días sin vencimientos en 0.00), RN-049 (anulados excluidos por defecto; ANULADO/ANULADA sin estado de pago), RN-069 (selector de moneda, indicador de vencidos de la otra moneda), RN-105/RN-106/RN-169 (prioridad: preferencia personal > moneda de la empresa > S/), RN-107 a RN-110 (definición de cada indicador), RN-119/RN-180/RN-181 (ventana 7/10/15, por defecto 7, no limita el listado), RN-120 (orden: VENCIDAS por fecha asc., luego PENDIENTES por fecha asc.), RN-205 a RN-210 (corte coherente, leyenda), RN-053/RN-147 (S5: 2 decimales, mes anterior completo por defecto, futuro bloqueado, independiente de la moneda), RN-036 (promesas activas visibles a todos los roles). |

**Wireframe (escritorio):**

```text
MAIN
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ <h1>Panel de cartera</h1>                         Datos al 09/11/2026, 08:15         │
│                                                    [⟳ Actualizar] (secundario)       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ BARRA DE CONTROLES (flex, wrap)                                                      │
│  Moneda:  ( ● S/ )( ○ US$ • Vencidos )   ← ToggleGroup tipo radio, role=radiogroup   │
│            «US$ tiene cuotas vencidas» (texto visible junto a la opción, no solo punto)│
│  Proyección:  ( ● 7 días )( ○ 10 días )( ○ 15 días )                                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ INDICADORES  (grid 4 col ≥1024 · 2 col tablet · 1 col móvil)  <section aria-label=   │
│                                                              "Indicadores de cartera">│
│ ┌ Card ───────────────┐┌ Card ───────────────┐┌ Card ──────────────┐┌ Card ─────────┐│
│ │ Vencida por cobrar  ││ Vencida por pagar   ││ Pendiente de cobro ││ Pendiente de  ││
│ │ S/ 4,500.00         ││ S/ 0.00             ││ S/ 8,000.00        ││ pago          ││
│ │ (texto 30px, rojo   ││                     ││                    ││ S/ 2,000.00   ││
│ │  si > 0)            ││                     ││                    ││               ││
│ │ 6 cuotas · Ver ▸    ││ 0 cuotas            ││ 9 cuotas · Ver ▸   ││ 3 cuotas      ││
│ └─────────────────────┘└─────────────────────┘└────────────────────┘└───────────────┘│
│  «Ver ▸» aplica el filtro correspondiente al listado y lleva el foco a él.           │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ FILA 2 (grid 2/3 + 1/3 en escritorio; apilado en móvil)                              │
│ ┌ Card «Próximos vencimientos (7 días)» ────────────────┐ ┌ Card S5 (Should) ────────┐│
│ │ [Gráfico | Tabla]  ← Tabs; la tabla es la alternativa  │ │ Tiempo promedio de cobro ││
│ │                                                         │ │ de comprobantes saldados ││
│ │  Barras agrupadas por día (eje X: 09/11 … 15/11)        │ │ Mes: [ octubre 2026 ▾ ]  ││
│ │  ■ Cobros (primario)  ■ Pagos (secundario, con trama)   │ │                          ││
│ │  Eje Y: importes S/ con formato peruano                 │ │   37.50 días             ││
│ │  Tooltip por barra: «06/11 · Cobros: S/ 600.00»         │ │ (o «Sin datos»)          ││
│ │                                                         │ │ [Badge «Mes en curso —   ││
│ │ Tabla (pestaña): Día | Cobros | Pagos                    │ │  datos parciales»]       ││
│ │  2026-11-09 | S/ 0.00 | S/ 0.00 …                        │ │ Incluye S/ y US$. No     ││
│ │ Leyenda textual bajo el gráfico:                         │ │ depende del selector.    ││
│ │ «Total cobros 7 días: S/ 1,600.00 · Pagos: S/ 300.00»   │ └──────────────────────────┘│
│ └─────────────────────────────────────────────────────────┘                            │
│ ┌ Card «Promesas de pago activas» (Should S1) ────────────────────────────────────────┐│
│ │ Contacto | Comprobante · cuota | Vencimiento original | Promesa | Saldo | Registró  ││
│ │ (vacío: «No hay promesas activas.»)                                                 ││
│ └─────────────────────────────────────────────────────────────────────────────────────┘│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ LISTADO DE MOVIMIENTOS  <section aria-labelledby="titulo-movimientos">               │
│ <h2>Movimientos</h2>  «128 cuotas en S/»                    [Ir a avisos ▸]          │
│ Filtros: Sentido [Todos ▾]  Estado [Todos ▾]  Buscar [contacto o comprobante   ]     │
│          [☐ Incluir comprobantes anulados]  (Switch con etiqueta)                    │
│ ┌────────┬───────────────────┬────────────┬───────┬────────────┬───────────┬───────────┬──────────┬────────┐
│ │Sentido │ Contacto          │Comprobante │ Cuota │ Vencimiento│ Importe   │ Saldo     │ Estado   │ Atraso │
│ ├────────┼───────────────────┼────────────┼───────┼────────────┼───────────┼───────────┼──────────┼────────┤
│ │Cobrar  │ DISTRIBUIDORA LIMA│ F001-00045▸│ 1/3   │ 2026-10-01 │ 1,000.00  │ 600.00    │[VENCIDA] │ 39 días│
│ │Pagar   │ TEXTILES SUR      │ E001-00012▸│ 2/2   │ 2026-11-12 │ 300.00    │ 300.00    │[PENDIENTE│ —      │
│ │        │                   │            │       │            │           │           │ Reprogr.]│        │
│ │Cobrar  │ FERRETERÍA NORTE  │ F001-00050▸│ 1/1   │ 2026-11-15 │ 500.00    │ —         │[ANULADA] │ —      │ ← solo con switch
│ └────────┴───────────────────┴────────────┴───────┴────────────┴───────────┴───────────┴──────────┴────────┘
│  Encabezado de la columna Importe/Saldo indica la moneda: «Importe (S/)».            │
│  Orden por defecto RN-120; las CANCELADAS y ANULADAS van al final por fecha.        │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Wireframe (móvil):** controles apilados; indicadores en 1 columna (2 en tablet); gráfico con scroll horizontal interno si la ventana es 15 días (el contenedor tiene `tabindex="0"` y `aria-label`), pestaña «Tabla» siempre disponible; movimientos como tarjetas:

```text
┌ Card ──────────────────────────────┐
│ [VENCIDA] 39 días       Por cobrar │
│ DISTRIBUIDORA LIMA                 │
│ F001-00045 · Cuota 1/3             │
│ Vence: 2026-10-01                  │
│ Saldo: S/ 600.00 de S/ 1,000.00    │
│ [Ver comprobante ▸]                │
└────────────────────────────────────┘
```

**Estados:**

| Estado | Detalle |
|---|---|
| Cargando | Esqueletos de 4 tarjetas, del gráfico y de 5 filas. La leyenda «Datos al…» no aparece hasta tener respuesta. |
| Empresa sin comprobantes | Indicadores en `S/ 0.00`, gráfico con todos los días en 0.00 (barras de altura 0 con etiqueta del día), listado vacío: «Todavía no hay comprobantes. [Registrar comprobante]». |
| Con datos | Ver wireframe. |
| Actualizando | Se mantiene el contenido anterior con opacidad 60 % y `aria-busy`; al llegar el nuevo corte, se reemplaza todo junto y se anuncia «Panel actualizado. Datos al 09/11/2026, 08:20» (RN-210: nunca se cambia la leyenda sin datos nuevos). |
| Error | Alert persistente con «Reintentar»; no se muestran ceros. |
| Filtro sin resultados | «Ninguna cuota coincide con los filtros. [Limpiar filtros]». |
| S5 desactivado | La tarjeta no se renderiza y el gráfico ocupa el ancho completo. |
| S5 mes futuro | El selector de mes no ofrece meses posteriores al actual (RN-147). |

**Detalles de interacción:**
- El selector de moneda **no** se persiste: al volver a ingresar, el panel abre con la preferencia personal o la de la empresa (HU-008).
- Al cambiar la ventana se llama a #17 y luego se recarga el panel; si #17 falla, se mantiene la ventana anterior y se muestra el error.
- Gráfico: barras con patrón (trama diagonal) en la serie «Pagos» para distinguirla sin color; leyenda textual; el gráfico tiene `role="img"` y `aria-describedby` hacia un resumen textual; la tabla equivalente contiene exactamente los mismos importes por día (PRINCIPIO-010).
- Días de atraso solo en filas VENCIDAS.

---

### P-003 Contactos

| Campo | Detalle |
|---|---|
| **Propósito** | Administrar el catálogo único de clientes y proveedores de la empresa. |
| **Actor** | Todos los roles. |
| **HUs** | HU-004 (Must). HU-013 indicador de comportamiento (Should, pendiente de aprobación; columna oculta hasta S3). |
| **Datos que muestra** | Nombre, correo, teléfono, dirección, estado (ACTIVO/DESACTIVADO), rol derivado («Cliente», «Proveedor», «Cliente y proveedor», «Sin comprobantes»). S3: «88 · Buen pagador». |
| **Endpoints** | #23 `GET /contactos?busqueda=&estado=&pagina=`; #24 `POST`; #25 `GET /contactos/{id}`; #26 `PATCH`; #27 `DELETE`; #28 desactivación; #29 reactivación. |
| **Acciones** | Buscar por nombre · Filtrar por estado · Nuevo contacto (P-003.D1) · Editar (P-003.D1) · Desactivar · Reactivar · Eliminar (P-003.D2, solo sin comprobantes) · Ver comprobantes del contacto (P-004 filtrado). |
| **Reglas de negocio** | RN-126 a RN-130 (catálogo, correo único por empresa incluso desactivados, eliminación solo sin comprobantes —incluidos anulados— y con confirmación, desactivados no seleccionables), RN-128 (sin tipo fijo), RN-162 (nombre: 1–250, letras, dígitos, espacios y `. , & - ' ( ) /`, al menos una letra; mayúsculas), RN-139 (correo en minúsculas), RN-006 / PRINCIPIO-004 (no se piden DNI, RUC, número de cuenta ni CCI), RN-044, RN-254 a RN-256 (historial por campo; eliminación ≠ solicitud de derechos). |

**Wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ <h1>Contactos</h1>                                          [+ Nuevo contacto]       │
│ Buscar por nombre [                     🔍]   Estado [Activos ▾ | Desactivados | Todos]│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────┬──────────────────────────┬────────────┬───────────────────┬──────────┬────────┐
│ │ Nombre                │ Correo                   │ Teléfono   │ Relación          │ Estado   │Acciones│
│ ├───────────────────────┼──────────────────────────┼────────────┼───────────────────┼──────────┼────────┤
│ │ DISTRIBUIDORA LIMA    │ ventas@distlima.example  │ 987654321  │ Cliente           │[ACTIVO]  │ [⋯]    │
│ │ TEXTILES SUR          │ pagos@textsur.example    │ —          │ Cliente y proveedor│[ACTIVO] │ [⋯]    │
│ │ FERRETERÍA NORTE      │ admin@fnorte.example     │ —          │ Sin comprobantes  │[DESACT.] │ [⋯]    │
│ └───────────────────────┴──────────────────────────┴────────────┴───────────────────┴──────────┴────────┘
│ Menú [⋯] (DropdownMenu, aria-label="Acciones de DISTRIBUIDORA LIMA"):                │
│   Editar · Ver comprobantes · Desactivar | Reactivar · Eliminar (solo si «Sin compr.»)│
│ « Anterior  1 2 3  Siguiente »                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**P-003.D1 Diálogo «Nuevo contacto» / «Editar contacto»** (`Dialog`, ancho 560 px; `Sheet` a pantalla completa en móvil):

```text
┌ <h2>Nuevo contacto</h2> ─────────────────────────── [✕ Cerrar] ┐
│ Resumen de errores (si hay)                                     │
│ Nombre o razón social *                                         │
│ [                                                   ]  0/250    │
│ Ayuda: «Letras, números, espacios y . , & - ' ( ) /»            │
│ Correo electrónico *                                            │
│ [                                                   ]           │
│ Teléfono (opcional)                                             │
│ [                     ]                                         │
│ Dirección (opcional)                                            │
│ [                                                   ]           │
│ Nota fija: «VenceYa no solicita DNI, RUC ni datos bancarios.»   │
│                               [Cancelar]  [Guardar contacto]    │
└─────────────────────────────────────────────────────────────────┘
```

- En edición, bajo el formulario: enlace «Ver historial de cambios» (lista campo · valor anterior → nuevo · usuario · fecha y hora) si el API lo expone para el contacto; si no, se omite.
- Al guardar, se muestra el valor normalizado devuelto por el API (por ejemplo «DISTRIBUIDORA LIMA»).
- Error `CORREO_CONTACTO_YA_REGISTRADO` → bajo el campo correo: «Ya existe un contacto con este correo en tu empresa (puede estar desactivado).»

**P-003.D2 Diálogo «Eliminar contacto»** (`AlertDialog`):

```text
┌ <h2>¿Eliminar a DISTRIBUIDORA LIMA?</h2> ─────────────────────┐
│ Esta acción no se puede deshacer. El contacto no tiene        │
│ comprobantes registrados. Su historial de cambios se conserva.│
│                                [Cancelar]  [Eliminar] (rojo)  │
└───────────────────────────────────────────────────────────────┘
```

- Si el API responde `CONTACTO_CON_COMPROBANTES` (por concurrencia), el diálogo cambia a: «No se puede eliminar porque tiene comprobantes. Puedes desactivarlo.» con botón «Desactivar».
- El foco inicial va a «Cancelar».

**Estados:** cargando (esqueleto de tabla), vacío («Aún no tienes contactos. [+ Nuevo contacto]»), búsqueda sin resultados, error, guardando.

---

### P-004 Comprobantes

| Campo | Detalle |
|---|---|
| **Propósito** | Listar los comprobantes de la empresa y acceder a su detalle o registrar uno nuevo. |
| **Actor** | Todos los roles. |
| **HUs** | HU-005, HU-007 (visibilidad del estado ANULADO). |
| **Datos que muestra** | Sentido, número de documento, contacto, fecha de emisión, moneda y total, modalidad (pago único / n cuotas), saldo total vigente, estado resumido (Con vencidas / Pendiente / Cancelado / ANULADO). |
| **Endpoints** | #31 `GET /comprobantes?sentido=&contactoId=&busqueda=&incluirAnulados=&pagina=`. |
| **Acciones** | Registrar comprobante (P-005) · Buscar por número o contacto · Filtrar por sentido, moneda y contacto · Incluir anulados · Abrir detalle (P-006). |
| **Reglas de negocio** | RN-001 a RN-004 (sentido, moneda original S/ o US$), RN-093/RN-131 a RN-133 (número de documento y unicidad), RN-049 (anulados ocultos por defecto), RN-047 (sin totales que mezclen monedas). |

**Wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ <h1>Comprobantes</h1>                                     [+ Registrar comprobante]  │
│ Tabs: ( Todos )( Por cobrar )( Por pagar )                                           │
│ Buscar [número o contacto      🔍]  Moneda [Todas ▾]  [☐ Incluir comprobantes anulados]│
├──────────────────────────────────────────────────────────────────────────────────────┤
│ ┌────────────┬──────────┬───────────────────┬────────────┬────────────────┬──────────────┬───────────────┐
│ │ Número     │ Sentido  │ Contacto          │ Emisión    │ Total          │ Saldo        │ Estado        │
│ ├────────────┼──────────┼───────────────────┼────────────┼────────────────┼──────────────┼───────────────┤
│ │ F001-00045▸│ Cobrar   │ DISTRIBUIDORA LIMA│ 2026-11-04 │ US$ 3,000.00   │ US$ 2,000.00 │ [Pendiente]   │
│ │            │          │                   │            │ 3 cuotas       │              │               │
│ │ E001-00012▸│ Pagar    │ TEXTILES SUR      │ 2026-10-10 │ S/ 600.00      │ S/ 300.00    │ [Con vencidas]│
│ │ F001-00050▸│ Cobrar   │ FERRETERÍA NORTE  │ 2026-10-01 │ S/ 500.00      │ —            │ [ANULADO]     │
│ └────────────┴──────────┴───────────────────┴────────────┴────────────────┴──────────────┴───────────────┘
│ « Anterior  1 2  Siguiente »                                                        │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Estados:** cargando, vacío («Registra tu primer comprobante a crédito.»), sin resultados, error.

---

### P-005 Registrar / editar comprobante

| Campo | Detalle |
|---|---|
| **Propósito** | Registrar un comprobante por cobrar o por pagar en su moneda original, en pago único o en cuotas, y editarlo mientras no tenga pagos ni reprogramaciones. |
| **Actor** | Todos los roles. |
| **HUs** | HU-005 (y HU-004 por el alta rápida de contacto). |
| **Datos que muestra** | Formulario; propuesta de cuotas editable; resumen «Suma de cuotas / Total / Diferencia». En edición: valores vigentes y `version`. |
| **Endpoints** | #23 búsqueda de contactos activos; #30 `POST /comprobantes/propuesta-cuotas`; #32 `POST /comprobantes`; #33 `GET /comprobantes/{id}` (edición); #34 `PATCH /comprobantes/{id}`. |
| **Acciones** | Elegir sentido · Buscar/seleccionar contacto activo · Crear contacto (P-003.D1) · Ingresar número, moneda, total, emisión · Elegir modalidad · Proponer cuotas · Editar fecha/importe de cada cuota · Agregar/quitar cuota (en edición, manteniendo 1–120) · Guardar · Cancelar. |
| **Reglas de negocio** | RN-001 a RN-005, RN-093 (número 1–30, letras, dígitos, `-` y `_`, sin espacios, mayúsculas), RN-131 a RN-133 (duplicado por empresa en por cobrar / por proveedor en por pagar, entre no anulados), RN-015 a RN-020 (propuesta mensual, último día del mes, vencimientos estrictamente crecientes y posteriores a la emisión, suma = total), RN-057 (pago único = 1 cuota), RN-121/RN-122/RN-154 (2–120 cuotas, máximo = céntimos del total; «solo procede Pago único» con S/ 0.01), RN-153 (formato peruano, ≤ 12 enteros, 2 decimales, sin redondeo), RN-081/RN-082/RN-083 (edición solo sin pagos —ni anulados— ni reprogramaciones, mismas validaciones, historial por campo), RN-130 (contacto activo), emisión ≤ fecha de cálculo. |

**Wireframe (escritorio, 2 columnas: formulario 2/3, resumen 1/3 fijo con `position: sticky`):**

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ Migas: Comprobantes / Registrar                                                      │
│ <h1>Registrar comprobante</h1>   (edición: «Editar F001-00045»)                      │
│ [Resumen de errores — role=alert, enlaces a campos]                                  │
├──────────────────────────────────────────────────────┬───────────────────────────────┤
│ <fieldset> Tipo de comprobante *                      │ RESUMEN (Card sticky)         │
│   ( ● Por cobrar — me deben )  ( ○ Por pagar — debo ) │ Total:          S/ 1,000.00   │
│                                                       │ Suma de cuotas: S/ 1,000.00   │
│ Contacto *                                            │ Diferencia:     S/ 0.00  ✓    │
│ [ Buscar contacto activo…              ▾]             │ (rojo + texto «No cuadra» si  │
│   Combobox (Command): resultados por nombre;          │  ≠ 0; aria-live=polite)       │
│   último ítem fijo: «+ Crear contacto "texto"»        │                               │
│                                                       │ Cuotas: 3                     │
│ Número de documento *          Moneda *               │ Primera: 2026-12-04           │
│ [ F001-00045        ]          ( ● S/ )( ○ US$ )      │ Última:  2027-02-04           │
│ Ayuda: «Sin espacios. Ej.: F001-00045»                │                               │
│                                                       │ [ Guardar comprobante ]       │
│ Total *                        Fecha de emisión *     │ [ Cancelar ]                  │
│ [S/ | 1,000.00        ]        [ 2026-11-04  📅]      │                               │
│ Ayuda: «Usa coma para miles y punto para decimales:   │                               │
│         1,000.50»                                     │                               │
│                                                       │                               │
│ <fieldset> Forma de pago *                            │                               │
│   ( ○ Pago único )  ( ● En cuotas )                   │                               │
│                                                       │                               │
│ ── Si «Pago único» ──                                 │                               │
│ Fecha de vencimiento * [ 2026-12-15 📅 ]              │                               │
│                                                       │                               │
│ ── Si «En cuotas» ──                                  │                               │
│ Cantidad de cuotas * [  3 ]  (2 a 120)  [Proponer cuotas]                             │
│ Ayuda dinámica: «Máximo posible para este total: 2» (si aplica)                       │
│ ┌ Tabla editable «Cuotas» ───────────────────────────┐                               │
│ │ N° │ Vencimiento *      │ Importe *               │                               │
│ │ 1  │ [2026-12-04 📅]    │ [S/ | 333.33      ]     │                               │
│ │ 2  │ [2027-01-04 📅]    │ [S/ | 333.33      ]     │                               │
│ │ 3  │ [2027-02-04 📅]    │ [S/ | 333.34      ]     │                               │
│ └────────────────────────────────────────────────────┘                               │
│ Nota: «La propuesta es una ayuda: puedes cambiar fechas e importes antes de guardar.» │
└──────────────────────────────────────────────────────┴───────────────────────────────┘
 Móvil: una columna; el resumen pasa a una barra fija inferior con Diferencia + [Guardar].
```

**Comportamiento:**
- **Propuesta:** «Proponer cuotas» llama a #30 con total, emisión y cantidad; reemplaza la tabla (si ya había cambios manuales, pide confirmación «Se reemplazarán las cuotas que editaste»). La UI **nunca** ajusta importes por su cuenta (HU-005).
- **Campo de importe (`CampoImporte`):** `inputmode="decimal"`, prefijo visual de moneda (no editable, `aria-hidden`; la moneda va en la etiqueta accesible: «Importe de la cuota 1 en soles»). Valida en tiempo de salida del campo (`blur`) con la expresión del formato peruano; **no** autoformatea mientras se escribe ni redondea. Mensajes: «Usa coma para miles: 1,000.50», «Máximo 2 decimales», «El importe debe ser mayor que cero», «Máximo 999,999,999,999.99». Se envía al API como cadena canónica (`"1000.50"`).
- **Campo de fecha (`CampoFecha`):** input de texto `AAAA-MM-DD` con botón de calendario (`Popover` + `Calendar`), ambos operables por teclado; valida fechas inexistentes.
- **Cantidad de cuotas:** `inputmode="numeric"`, solo enteros; rechaza «3.0», «tres».
- **Cambio de moneda:** actualiza el prefijo de todos los importes; no convierte valores (O6).
- **Edición:** si el comprobante tiene pagos (aunque anulados), reprogramaciones o está anulado, la ruta muestra un Alert «Este comprobante ya no se puede editar porque tiene pagos registrados o está anulado.» y un enlace al detalle; no se muestra el formulario.
- **Guardar:** deshabilitado con «Guardando…» durante la solicitud. Éxito → P-006 + toast «Comprobante registrado» / «Cambios guardados».

**Errores del API mapeados a campos:**

| Código / detalle | Campo | Mensaje visible |
|---|---|---|
| `COMPROBANTE_DUPLICADO` | Número de documento | «Ya existe un comprobante no anulado con este número» (por cobrar) / «…para este proveedor» (por pagar). |
| `VALIDACION_FALLIDA` · suma ≠ total | Resumen | «La suma de las cuotas no coincide con el total. Diferencia: S/ 66.67.» |
| Vencimientos no crecientes | Fila de la cuota | «Debe ser posterior al vencimiento de la cuota anterior.» |
| Emisión futura | Fecha de emisión | «No puede ser posterior a hoy (2026-11-09).» |
| Contacto desactivado / inexistente (`404`) | Contacto | «Selecciona un contacto activo.» |
| `DATOS_DESACTUALIZADOS` (edición) | Global | Estado «Conflicto» (0.4). |
| `COMPROBANTE_NO_EDITABLE` | Global | «Se registró un pago o una reprogramación mientras editabas. Ya no se puede editar.» |

---

### P-006 Detalle de comprobante y cuotas

| Campo | Detalle |
|---|---|
| **Propósito** | Ver un comprobante con sus cuotas, saldos, estados y pagos; registrar cobros o pagos; anular pagos o el comprobante; acceder a edición, reprogramación e historial. |
| **Actor** | Todos los roles; anulaciones solo SUPERVISOR y ADMINISTRADOR. |
| **HUs** | HU-005 (detalle y acceso a edición), HU-006 (registrar pago), HU-007 (anular pago o comprobante); Should: HU-011 (reprogramar), HU-017 (historial). |
| **Datos que muestra** | Cabecera: sentido, número, contacto (enlace), moneda, total, emisión, modalidad, saldo total, estado ANULADO con motivo/usuario/fecha si aplica, registrado por/fecha. Cuotas: n°, vencimiento original, fecha efectiva (S1), importe, pagado, saldo, estado, días de atraso, marca reprogramada (S1), promesa activa (S1). Pagos por cuota: fecha de pago, importe, registrado por, fecha y hora de registro, estado (vigente/ANULADO con motivo, usuario y fecha de la anulación). |
| **Endpoints** | #33 `GET /comprobantes/{id}`; #36 `GET /cuotas/{id}`; #37 `GET /cuotas/{id}/pagos`; #38 `POST /cuotas/{id}/pagos` (con `Clave-Idempotencia` y `versionCuota`); #39 `POST /pagos/{id}/anulacion`; #35 `POST /comprobantes/{id}/anulacion`; Should: #40/#41 promesas, #49 historial. |
| **Acciones** | Registrar pago (P-006.D1) · Ver pagos de la cuota · Anular pago (P-006.D2, SUP/ADM) · Anular comprobante (P-006.D3, SUP/ADM) · Editar (P-005, solo si es editable) · Reprogramar (P-006.D4, S1) · Ver historial (P-016) · Registrar comprobante nuevo con estos datos (tras anular). |
| **Reglas de negocio** | RN-021/RN-022 (estados PENDIENTE/VENCIDA/CANCELADA, días de atraso), RN-024 a RN-026, RN-063, RN-088, RN-089, RN-091, RN-092 (pago ≤ saldo, una sola cuota, orden cronológico, misma fecha admitida, fecha ≥ emisión y ≤ hoy, misma moneda), RN-156 (idempotencia), RN-027 a RN-032, RN-058 a RN-062, RN-090, RN-123, RN-124 (anulación total, irreversible, motivo 1–500, una sola vez; comprobante solo sin pagos vigentes; anulado = solo lectura), RN-060 (permisos), RN-081 (editable), RN-071/RN-072 (fecha efectiva y marca, S1). |

**Wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ Migas: Comprobantes / F001-00045                                                     │
│ <h1>F001-00045</h1> [Por cobrar]  [ANULADO]*            [Editar] [⋯ Más ▾]           │
│                                                         Más: Anular comprobante (SUP/ADM)│
│ * Si está anulado: Alert gris «Comprobante anulado el 2026-11-08 10:12 por           │
│   ANA TORRES. Motivo: NÚMERO DUPLICADO. Es de solo lectura.»                         │
│   [Registrar comprobante nuevo con estos datos]                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ CABECERA (Card, <dl> en grid 3 col / 1 col móvil)                                    │
│  Contacto: DISTRIBUIDORA LIMA ▸     Emisión: 2026-11-04       Moneda: US$            │
│  Total: US$ 3,000.00                Forma: 3 cuotas           Saldo: US$ 2,000.00    │
│  Registrado por: LUIS PAZ · 2026-11-04 15:02                                         │
│  [Editar] visible solo si editable; si no, texto: «No editable: tiene pagos          │
│   registrados.» (aria-describedby del botón deshabilitado con aria-disabled)         │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ <h2>Cuotas</h2>                                                                       │
│ ┌────┬────────────┬────────────┬──────────────┬──────────────┬──────────────┬─────────┬─────────────────────────┐
│ │ N° │ Vencimiento│ Fecha efect.│ Importe     │ Pagado       │ Saldo        │ Estado  │ Acciones                │
│ │    │ original   │ (S1)        │             │              │              │         │                         │
│ ├────┼────────────┼────────────┼──────────────┼──────────────┼──────────────┼─────────┼─────────────────────────┤
│ │ 1  │ 2026-12-04 │ —          │ 1,000.00     │ 1,000.00     │ 0.00         │[CANCEL.]│ [▾ Pagos (2)]            │
│ │ 2  │ 2027-01-04 │ 2027-01-20 │ 1,000.00     │ 0.00         │ 1,000.00     │[PEND.]  │ [Registrar pago] [▾ Pagos]│
│ │    │            │ [Reprogr.] │              │              │              │         │ [⋯: Reprogramar, Historial]│
│ │ 3  │ 2027-02-04 │ —          │ 1,000.00     │ 0.00         │ 1,000.00     │[PEND.]  │ [Registrar pago] [▾ Pagos]│
│ └────┴────────────┴────────────┴──────────────┴──────────────┴──────────────┴─────────┴─────────────────────────┘
│  Fila expandida «Pagos de la cuota 1» (Collapsible, aria-expanded):                  │
│  ┌──────────────┬──────────────┬──────────────┬─────────────────────┬─────────────────┬──────────┐
│  │ Fecha de pago│ Importe      │ Registró     │ Registrado el       │ Estado          │ Acciones │
│  │ 2026-11-05   │ US$ 400.00   │ LUIS PAZ     │ 2026-11-05 09:40    │ Vigente         │ [Anular] │ ← SUP/ADM
│  │ 2026-11-06   │ US$ 600.00   │ LUIS PAZ     │ 2026-11-06 11:02    │ [ANULADO]       │ —        │
│  │              │              │              │                     │ IMPORTE ERRÓNEO │          │
│  │              │              │              │                     │ ANA · 11-06 12:00│         │
│  └──────────────┴──────────────┴──────────────┴─────────────────────┴─────────────────┴──────────┘
│  Columnas «Fecha efect.» y marca solo con S1; «Historial» solo con S1 o S4.          │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

- «Registrar pago» no aparece en cuotas CANCELADAS ni en comprobantes ANULADOS.
- «Anular» de pago y «Anular comprobante» no se renderizan para OPERADOR.
- «Anular comprobante» con pagos vigentes: la opción del menú aparece con `aria-disabled="true"` y el texto secundario «Primero anula sus pagos vigentes».

**P-006.D1 Diálogo «Registrar pago»** (HU-006):

```text
┌ <h2>Registrar cobro — Cuota 2 de F001-00045</h2> ────────── [✕] ┐   (por pagar: «Registrar pago»)
│ <dl> Contacto: DISTRIBUIDORA LIMA · Vence: 2027-01-04            │
│      Importe de la cuota: US$ 1,000.00                           │
│      Saldo vigente: US$ 1,000.00  ← dato del GET #36, no del error│
│ Importe *                                                         │
│ [US$ |                ]   Ayuda: «Hasta US$ 1,000.00»            │
│ [Usar saldo completo] (botón link que rellena «1,000.00»)         │
│ Fecha de pago *                                                   │
│ [2026-11-09 📅]  Ayuda: «Entre 2026-11-05 y hoy (2026-11-09)»     │
│   (mínimo = mayor entre emisión y la última fecha de pago vigente)│
│ Nota: «El pago no cambia la fecha de vencimiento acordada.»       │
│                         [Cancelar]  [Registrar pago] (primario)   │
└───────────────────────────────────────────────────────────────────┘
```

- La moneda es la de la cuota (no hay selector).
- Al abrir el diálogo se genera una `Clave-Idempotencia` (UUID v4) que se reutiliza en cualquier reintento de **esa** misma solicitud; se genera otra solo al abrir un diálogo nuevo (RN-156).
- Botón «Registrar pago» deshabilitado desde el primer clic hasta la respuesta.
- Errores: `IMPORTE_SUPERA_SALDO` → vuelve a pedir #36 y muestra «El importe supera el saldo vigente de US$ 600.00» bajo el campo; fecha fuera de rango → bajo «Fecha de pago»; `DATOS_DESACTUALIZADOS` → «Otro usuario registró un movimiento en esta cuota. Revisa el saldo actualizado.» + saldo recargado; `COMPROBANTE_ANULADO` → cierra el diálogo y recarga la página.
- Éxito: cierra el diálogo, toast «Pago registrado. Saldo: US$ 600.00», refresca la cuota y devuelve el foco al botón que lo abrió.

**P-006.D2 Diálogo «Anular pago»** (HU-007; SUP/ADM; `AlertDialog`):

```text
┌ <h2>Anular pago de US$ 400.00 del 2026-11-05</h2> ─────────────┐
│ ⚠ La anulación es total e irreversible. El pago original se    │
│   conserva y el saldo de la cuota se recalcula.                │
│ Motivo de la anulación *                                       │
│ [                                                         ]    │  Textarea, 1–500 tras recortar
│ [                                                         ]    │
│                                                     0/500      │  contador con aria-live=polite (cada 50)
│ Para incorporar un pago anterior omitido, anula también los    │
│ pagos de fechas posteriores y regístralos de nuevo en orden.   │
│                              [Cancelar]  [Anular pago] (rojo)  │
└────────────────────────────────────────────────────────────────┘
```

- Motivo vacío o solo espacios → «Escribe el motivo de la anulación.»; > 500 → «Máximo 500 caracteres.» (sin repetir el texto).
- `YA_ANULADO` → «Este pago ya fue anulado.» y recarga.
- Éxito: toast «Pago anulado» y fila marcada ANULADO con motivo normalizado.

**P-006.D3 Diálogo «Anular comprobante»** (HU-007): igual que D2, con título «Anular F001-00045», texto «Sus 3 cuotas quedarán ANULADAS y dejarán de sumar en cartera, indicadores y avisos. El comprobante quedará de solo lectura.» y botón «Anular comprobante». Error `COMPROBANTE_CON_PAGOS_VIGENTES` → «Tiene pagos vigentes. Anúlalos primero.»

**P-006.D4 Diálogo «Reprogramar cuota»** (HU-011, Should S1) — ver P-017.

**Estados:** cargando; no encontrado (P-015); error; comprobante anulado (solo lectura: sin botones de acción); sin pagos en la cuota («Sin pagos registrados.»).

---

### P-007 Cuotas por avisar

| Campo | Detalle |
|---|---|
| **Propósito** | Listar todas las cuotas pendientes y vencidas con saldo (por cobrar y por pagar), seleccionarlas y enviar el aviso por correo al contacto. |
| **Actor** | Todos los roles. |
| **HUs** | HU-010 (Must); HU-011 muestra la promesa activa de cada cuota (Should, RN-036). |
| **Datos que muestra** | Leyenda de corte; por cuota: sentido, contacto (y si está desactivado), comprobante, cuota n/N, fecha efectiva de vencimiento, saldo con moneda, estado (VENCIDA/PENDIENTE), clasificación del aviso («Vencida»/«Por vencer»), estado del aviso («Enviado · 2026-11-05 09:10» / «No Enviado» / «Enviando…»), promesa activa (S1). |
| **Endpoints** | #44 `GET /avisos/cuotas-por-avisar`; #45 `POST /avisos/vista-previa`; #46 `POST /avisos/envios`. |
| **Acciones** | Filtrar (sentido, estado, aviso enviado/no enviado, contacto, moneda) · Seleccionar cuotas (individual, todas las visibles, todas de un contacto) · Escribir comentario · Enviar aviso (P-007.D1) · Reenviar aviso · Volver a intentar · Ver bandeja (P-008) · Abrir comprobante (P-006) · Reprogramar (S1). |
| **Reglas de negocio** | RN-112 (lista completa sin límite de ventana; columnas), RN-075 (por vencer = PENDIENTE con saldo), RN-120 (orden), RN-114 (tipo de aviso: cobrar/pagar × vencida/por vencer), RN-214 (un correo por contacto y tipo), RN-212/RN-213/RN-155 (recalcular aptitud al confirmar; excluidas con motivo), RN-045/RN-138 (reenvío requiere ver último aviso y confirmar), RN-066/RN-067/RN-158 (No Enviado, tiempo de espera 10 s, sin reintento automático), RN-157 (bloqueo EN_PROCESO también entre usuarios), RN-136/RN-164/RN-178 (destinatarios: contacto, copia al correo administrativo y lista de copias del sentido, responder a correo administrativo; no editables), RN-162 (comentario 0–500, mayúsculas), RN-215 (envío siempre manual), RN-130 (contactos desactivados siguen apareciendo), RN-152 (bloqueo por contrato terminado), PRINCIPIO-009. |

**Wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ <h1>Cuotas por avisar</h1>                 Datos al 09/11/2026, 08:15  [⟳ Actualizar] │
│ Texto: «Incluye todas las cuotas pendientes y vencidas con saldo. El envío es manual  │
│ y solo por correo.»                                            [Ver bandeja ▸]       │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Filtros: Sentido [Todos ▾]  Estado [Todos ▾]  Aviso [Todos | No enviado | Enviado ▾]  │
│          Moneda [Todas ▾]   Contacto [buscar…      ]                                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ ┌───┬────────┬───────────────────┬────────────┬──────┬────────────┬─────────────┬───────────┬──────────────────────┐
│ │[☐]│Sentido │ Contacto          │Comprobante │Cuota │ Vencimiento│ Saldo       │ Estado    │ Aviso                │
│ ├───┼────────┼───────────────────┼────────────┼──────┼────────────┼─────────────┼───────────┼──────────────────────┤
│ │[☑]│Cobrar  │ DISTRIBUIDORA LIMA│ F001-00045 │ 1/3  │ 2026-10-28 │ S/ 600.00   │[VENCIDA]  │ No Enviado           │
│ │[☑]│Cobrar  │ DISTRIBUIDORA LIMA│ F001-00045 │ 2/3  │ 2026-11-04 │ S/ 333.33   │[VENCIDA]  │ Enviado · 11-05 09:10│
│ │   │        │                   │            │      │            │             │           │ por ANA              │
│ │[☐]│Pagar   │ TEXTILES SUR      │ E001-00012 │ 2/2  │ 2026-11-12 │ US$ 300.00  │[PENDIENTE]│ No Enviado           │
│ │   │        │ (desactivado)     │            │      │            │             │ Por vencer│                      │
│ │[–]│Cobrar  │ FERRETERÍA NORTE  │ F001-00061 │ 1/1  │ 2026-12-20 │ S/ 1,200.00 │[PENDIENTE]│ ⟳ Enviando…          │ ← casilla deshabilitada
│ └───┴────────┴───────────────────┴────────────┴──────┴────────────┴─────────────┴───────────┴──────────────────────┘
│  Casilla del encabezado: «Seleccionar todas las cuotas visibles» (tri-estado).       │
│  Con S1: debajo del vencimiento, «Promesa: 2026-11-20» con badge ámbar.              │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ BARRA DE ACCIÓN (sticky inferior cuando hay selección; role=region aria-label=       │
│ "Envío de avisos")                                                                   │
│  2 cuotas seleccionadas de 1 contacto       [Limpiar selección]                      │
│  Comentario (opcional)                                                               │
│  [ Favor confirmar fecha de pago                                   ]  29/500         │
│                                                     [ Enviar aviso (2) ] (primario)  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**P-007.D1 Diálogo «Confirmar envío de avisos»** (resultado de #45; `Dialog` 720 px / pantalla completa en móvil):

```text
┌ <h2>Confirmar envío</h2> ─────────────────────────────────────────── [✕] ┐
│ Se enviarán 2 correos.                                                   │
│ ┌ Correo 1 de 2 · Por cobrar vencida ───────────────────────────────────┐│
│ │ Para:        ventas@distlima.example                                  ││
│ │ Copia:       admin@andina.example, jefe.cobranzas@andina.example      ││
│ │ Responder a: admin@andina.example                                     ││
│ │ Cuotas: F001-00045 cuota 1 (S/ 600.00, venció 2026-10-28),            ││
│ │         F001-00045 cuota 2 (S/ 333.33, venció 2026-11-04)             ││
│ │ ⚠ La cuota 2 ya tiene un aviso enviado. Último aviso: 2026-11-05, ANA.││
│ │   [☐ Reenviar aviso de la cuota 2]  (obligatorio para incluirla)      ││
│ └───────────────────────────────────────────────────────────────────────┘│
│ ┌ Correo 2 de 2 · Por cobrar por vencer ──────────────────────────────── ┐│
│ │ …                                                                     ││
│ └───────────────────────────────────────────────────────────────────────┘│
│ Cuotas excluidas (si hay): «E001-00012 cuota 2 — CUOTA_CANCELADA:        │
│   se canceló después de seleccionarla.»                                   │
│ Comentario: FAVOR CONFIRMAR FECHA DE PAGO                                 │
│ Nota: «Los destinatarios se toman de la configuración vigente y no se    │
│ pueden modificar. "Enviado" significa que el proveedor de correo aceptó  │
│ el envío, no que el destinatario lo leyó.»                               │
│                                   [Cancelar]  [Confirmar y enviar (2)]   │
└──────────────────────────────────────────────────────────────────────────┘
```

**Comportamiento del envío:**
- «Confirmar y enviar» se deshabilita con «Enviando…» al primer clic (hasta ~10 s por correo, plazo del servidor). Las cuotas involucradas pasan a «Enviando…» en la lista.
- Si una cuota con aviso vigente no tiene marcada su casilla «Reenviar aviso», no se incluye; si con esa exclusión no queda nada que enviar, el botón queda deshabilitado con el texto «Marca "Reenviar aviso" o quita la cuota».
- **Resultado por correo** (el diálogo cambia a vista de resultado, foco en su título):

```text
┌ <h2>Resultado del envío</h2> ──────────────────────────────────────┐
│ ✓ Correo 1 · DISTRIBUIDORA LIMA · Por cobrar vencida — Aviso enviado │
│ ✕ Correo 2 · DISTRIBUIDORA LIMA · Por cobrar por vencer — No Enviado │
│   Motivo: el proveedor de correo no respondió a tiempo.              │
│   [Volver a intentar]  (genera un intento nuevo con datos vigentes)  │
│                                     [Ver bandeja]  [Cerrar]          │
└────────────────────────────────────────────────────────────────────┘
```

- El error «No Enviado» es **persistente** (no un toast que desaparece) y se anuncia con `role="alert"`.
- `DESTINATARIOS_CAMBIARON` → el diálogo vuelve a pedir #45 y muestra «Los destinatarios cambiaron. Revisa y confirma de nuevo.» con los nuevos datos.
- `INTENTO_EN_PROCESO` → «Ya hay un envío en curso para estas cuotas. Actualiza la lista en unos segundos.»
- `SIN_CUOTAS_APTAS` (422) → «Ninguna cuota seleccionada sigue siendo apta» + lista de excluidas con motivo (`CUOTA_CANCELADA`, `COMPROBANTE_ANULADO`, …) traducido a texto.
- `REENVIO_REQUIERE_CONFIRMACION` → vuelve a la confirmación con la casilla resaltada.
- `CONTRATO_TERMINADO` → P-015.
- Al cerrar, la lista se recarga (nuevo corte) y la selección se limpia.

**Estados:** cargando; vacío («No hay cuotas pendientes ni vencidas con saldo.»); filtro sin resultados; error; enviando; resultado.

---

### P-008 Bandeja interna de avisos

| Campo | Detalle |
|---|---|
| **Propósito** | Consultar el registro de cada intento de aviso (enviado o no) con su contenido, destinatarios y resultado. |
| **Actor** | Todos los roles. |
| **HUs** | HU-010. |
| **Datos que muestra** | Lista: fecha y hora, usuario, contacto, tipo de aviso, nº de cuotas, resultado (ENVIADO / NO_ENVIADO con motivo / EN_PROCESO). Detalle: además, destinatarios (Para, Copia, Responder a) tal como se guardaron, cuotas con saldo al envío, comentario, asunto y cuerpo del correo. |
| **Endpoints** | #47 `GET /avisos/intentos?resultado=&contactoId=&desde=&hasta=&pagina=`; #48 `GET /avisos/intentos/{id}`. |
| **Acciones** | Filtrar por resultado, contacto y fechas · Abrir detalle · Ir a cuotas por avisar (para volver a intentar). |
| **Reglas de negocio** | RN-066, RN-067, RN-138 (cada intento se conserva; históricos no cambian), RN-158 (EN_PROCESO vencido se lee como NO_ENVIADO), RN-215, PRINCIPIO-009 («bandeja interna»). |

**Wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ <h1>Bandeja de avisos</h1>                                   [◂ Cuotas por avisar]   │
│ Resultado [Todos ▾]  Contacto [buscar…]  Desde [AAAA-MM-DD] Hasta [AAAA-MM-DD]        │
│ ┌──────────────────┬──────────┬───────────────────┬───────────────────────┬───────┬──────────────────┐
│ │ Fecha y hora     │ Usuario  │ Contacto          │ Tipo                  │Cuotas │ Resultado        │
│ │ 2026-11-09 08:20 │ LUIS PAZ │ DISTRIBUIDORA LIMA│ Por cobrar vencida    │ 2     │ [Enviado]        │
│ │ 2026-11-09 08:20 │ LUIS PAZ │ DISTRIBUIDORA LIMA│ Por cobrar por vencer │ 1     │ [No Enviado]     │
│ │                  │          │                   │                       │       │ Tiempo de espera │
│ └──────────────────┴──────────┴───────────────────┴───────────────────────┴───────┴──────────────────┘
│ « Anterior  1 2  Siguiente »                                                        │
└──────────────────────────────────────────────────────────────────────────────────────┘

Detalle (/avisos/bandeja/:id) — Sheet lateral en escritorio, página en móvil:
┌ <h2>Aviso del 2026-11-09 08:20</h2> ──────────────────────────── [✕] ┐
│ Resultado: [Enviado]   Usuario: LUIS PAZ   Tipo: Por cobrar vencida   │
│ Para: ventas@distlima.example                                          │
│ Copia: admin@andina.example, jefe.cobranzas@andina.example             │
│ Responder a: admin@andina.example                                      │
│ Cuotas: F001-00045 cuota 1 · saldo al envío S/ 600.00 · vence 2026-10-28│
│ Comentario: FAVOR CONFIRMAR FECHA DE PAGO                              │
│ <details> Ver contenido del correo </details> (asunto + cuerpo, texto) │
└────────────────────────────────────────────────────────────────────────┘
```

**Estados:** cargando, vacío («Todavía no se ha enviado ningún aviso.»), sin resultados, error, no encontrado.

---

### P-009 Usuarios de la empresa

| Campo | Detalle |
|---|---|
| **Propósito** | Invitar usuarios, asignar y cambiar su rol, desactivarlos, reactivarlos y reenviar invitaciones. |
| **Actor** | ADMINISTRADOR (la ruta no existe en el menú de los demás roles; acceso directo → «Sin permiso»). |
| **HUs** | HU-003. |
| **Datos que muestra** | Correo, rol, estado (INVITADO/ACTIVO/DESACTIVADO), vigencia del enlace de invitación (vigente/vencido), resultado del último envío de invitación («Correo no enviado»), indicación «(tú)» en la fila propia. |
| **Endpoints** | #9 `GET /usuarios`; #10 `POST /usuarios`; #11 `GET /usuarios/{id}`; #12 `PUT /usuarios/{id}/rol`; #13 desactivación; #14 reactivación; #15 reenvío de invitación. |
| **Acciones** | Invitar usuario (P-009.D1) · Cambiar rol (P-009.D2) · Desactivar (P-009.D3) · Reactivar · Reenviar invitación · Filtrar por estado y rol. **No existe** «Eliminar usuario». |
| **Reglas de negocio** | RN-009, RN-010 (un rol por usuario), RN-060, RN-070, RN-097 a RN-100 (invitación de 72 h, reenvío revoca el anterior, reactivación según contraseña definida, protección del último administrador activo), RN-161 (cambio de rol cierra todas sus sesiones), RN-135 (efecto en listas de copias), RN-139 (correo normalizado, único global), RN-160. |

**Wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ <h1>Usuarios</h1>                                              [+ Invitar usuario]   │
│ Estado [Todos ▾]   Rol [Todos ▾]                                                     │
│ ┌──────────────────────────────┬────────────────┬──────────────┬────────────────────────────┬────────┐
│ │ Correo                       │ Rol            │ Estado       │ Detalle                    │Acciones│
│ │ ana@andina.example (tú)      │ ADMINISTRADOR  │ [ACTIVO]     │ —                          │ [⋯]    │
│ │ luis@andina.example          │ OPERADOR       │ [INVITADO]   │ Invitación vence 2026-11-12│ [⋯]    │
│ │                              │                │              │ 10:00 · ⚠ Correo no enviado│        │
│ │ marta@andina.example         │ SUPERVISOR     │ [DESACTIVADO]│ —                          │ [⋯]    │
│ └──────────────────────────────┴────────────────┴──────────────┴────────────────────────────┴────────┘
│ Menú [⋯] según estado:                                                               │
│   ACTIVO: Cambiar rol · Desactivar                                                   │
│   INVITADO: Reenviar invitación · Cambiar rol · Desactivar                           │
│   DESACTIVADO: Reactivar                                                             │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**P-009.D1 «Invitar usuario»:**

```text
┌ <h2>Invitar usuario</h2> ─────────────────────────── [✕] ┐
│ Correo electrónico *  [                          ]        │
│ <fieldset> Rol *                                          │
│ ( ○ OPERADOR — registra contactos, comprobantes, pagos   │
│     y avisos; no anula )                                  │
│ ( ○ SUPERVISOR — además anula pagos y comprobantes )      │
│ ( ○ ADMINISTRADOR — además administra usuarios y la       │
│     configuración de la empresa )                         │
│ Nota: «Recibirá un enlace válido por 72 horas para definir│
│ su contraseña. Tú no conoces ni defines su contraseña.»   │
│                         [Cancelar]  [Enviar invitación]   │
└───────────────────────────────────────────────────────────┘
```

- Éxito con correo aceptado: toast «Invitación enviada».
- Éxito con correo rechazado o sin confirmar: Alert persistente «Usuario creado, correo no enviado.» + botón «Reenviar invitación» (HU-003).
- `CORREO_USUARIO_YA_REGISTRADO` → «Este correo ya está registrado en VenceYa.» (sin indicar la empresa).

**P-009.D2 «Cambiar rol»:** radio de roles con el actual preseleccionado; advertencia «Al cambiar el rol se cerrarán todas las sesiones de luis@andina.example y deberá iniciar sesión de nuevo.»; si el usuario está en una lista de copias y pasa a OPERADOR: «Dejará de recibir copias de avisos.»; botón «Cambiar rol» deshabilitado si no cambia el valor. Error `ULTIMO_ADMINISTRADOR_ACTIVO` → «La empresa debe conservar al menos un administrador activo.» Si el administrador cambia su **propio** rol con éxito, la SPA cierra su sesión y navega a P-001.

**P-009.D3 «Desactivar usuario»:** `AlertDialog` «¿Desactivar a luis@andina.example? Perderá el acceso y se cerrarán sus sesiones. Sus registros se conservan con su identidad.» Si está INVITADO: «Su enlace de invitación dejará de funcionar.»

**Estados:** cargando, error, sin permiso, lista con un único usuario (el administrador actual).

---

### P-010 Configuración de la empresa

| Campo | Detalle |
|---|---|
| **Propósito** | Definir el correo administrativo, la moneda por defecto de la empresa y las listas de usuarios en copia de los avisos por cobrar y por pagar. |
| **Actor** | ADMINISTRADOR. |
| **HUs** | HU-009 (correo administrativo y listas de copias), HU-008 (moneda por defecto de la empresa). |
| **Datos que muestra** | Razón social y RUC (solo lectura); correo administrativo; moneda por defecto; dos listas de copias con correo, rol y elegibilidad («Inactivo: no recibe copias» si fue desactivado o pasó a OPERADOR). |
| **Endpoints** | #18 `GET /empresa/configuracion`; #19 `PATCH /empresa/configuracion`; #20 `GET /empresa/listas-copias`; #21 `POST /empresa/listas-copias/{sentido}/usuarios`; #22 `DELETE …/{usuarioId}`; #9 (candidatos). |
| **Acciones** | Editar y guardar correo administrativo · Elegir y guardar moneda por defecto · Agregar usuario a una lista (combobox con solo SUPERVISOR/ADMINISTRADOR ACTIVOS no incluidos) · Quitar usuario de una lista. No se puede escribir un correo libre en las listas. |
| **Reglas de negocio** | RN-104, RN-134, RN-135, RN-164 a RN-168, RN-175 a RN-179 (correo administrativo propio de la empresa, válido, auditado; copias solo a SUPERVISOR/ADMINISTRADOR ACTIVOS de la empresa; sin direcciones externas; usuario inelegible queda «inactivo» en la lista; sin duplicados), RN-106 (moneda por defecto), RN-060, RN-042. |

**Wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ <h1>Configuración de la empresa</h1>                                                 │
│ ┌ Card «Datos de la empresa» ────────────────────────────────────────────────────────┐│
│ │ Razón social: COMERCIAL ANDINA S.A.C.      RUC: 20123456789   (solo lectura)       ││
│ │ Texto: «Para cambiar estos datos, contacta al equipo de VenceYa.»                  ││
│ └────────────────────────────────────────────────────────────────────────────────────┘│
│ ┌ Card «Correo administrativo» ──────────────────────────────────────────────────────┐│
│ │ Recibe copia de todos los avisos y es la dirección de respuesta.                    ││
│ │ Correo administrativo * [ admin@andina.example             ]  [Guardar]            ││
│ │ Nota: «Los avisos ya enviados no cambian.»                                          ││
│ └────────────────────────────────────────────────────────────────────────────────────┘│
│ ┌ Card «Moneda por defecto del panel» ───────────────────────────────────────────────┐│
│ │ ( ● S/ Soles )  ( ○ US$ Dólares )                              [Guardar]           ││
│ │ «Se usa para los usuarios que no eligieron su propia moneda.»                       ││
│ └────────────────────────────────────────────────────────────────────────────────────┘│
│ ┌ Card «Copias de avisos por cobrar» ─────┐ ┌ Card «Copias de avisos por pagar» ─────┐│
│ │ jefe.cobranzas@andina.example SUPERV.   │ │ (Lista vacía)                          ││
│ │   [Quitar]                              │ │ «Solo se copiará al correo             ││
│ │ marta@andina.example SUPERV.            │ │  administrativo.»                      ││
│ │   ⚠ Inactivo: no recibe copias [Quitar] │ │                                        ││
│ │ [+ Agregar usuario ▾] (combobox)        │ │ [+ Agregar usuario ▾]                  ││
│ │ «Solo supervisores y administradores    │ │                                        ││
│ │  activos de tu empresa.»                │ │                                        ││
│ └─────────────────────────────────────────┘ └────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────────────────┘
```

- Cada Card guarda de forma independiente; el botón «Guardar» se habilita solo con cambios.
- Errores: correo inválido o vacío bajo el campo; `USUARIO_NO_ELEGIBLE_COPIAS` → «Solo se pueden agregar supervisores o administradores activos.»; `USUARIO_YA_EN_LISTA`.
- Quitar pide confirmación breve (`AlertDialog`).

**Estados:** cargando, error, sin permiso, lista vacía, guardando por sección.

---

### P-011 Mis preferencias

| Campo | Detalle |
|---|---|
| **Propósito** | Que cada usuario defina su moneda preferida del panel y su ventana de proyección. |
| **Actor** | Todos los roles (solo las propias). |
| **HUs** | HU-008. |
| **Datos que muestra** | Moneda preferida (o «Usar la de la empresa: S/»), ventana de proyección; correo y rol del usuario (solo lectura). |
| **Endpoints** | #16 `GET /mi-cuenta/preferencias`; #17 `PUT /mi-cuenta/preferencias`. |
| **Acciones** | Elegir moneda · Elegir ventana · Guardar. |
| **Reglas de negocio** | RN-105, RN-169 (preferencia personal con prioridad sobre la de la empresa), RN-171 (nadie cambia las de otro), RN-119, RN-180 (7, 10 o 15). |

**Wireframe:**

```text
┌ <h1>Mis preferencias</h1> ──────────────────────────────────────────┐
│ Cuenta: ana@andina.example · ADMINISTRADOR                          │
│ <fieldset> Moneda del panel                                          │
│  ( ● Usar la moneda de la empresa (S/) )  ( ○ S/ )  ( ○ US$ )        │
│ <fieldset> Proyección de próximos vencimientos                       │
│  ( ● 7 días )  ( ○ 10 días )  ( ○ 15 días )                          │
│                                              [Guardar preferencias]  │
└──────────────────────────────────────────────────────────────────────┘
```

**Estados:** cargando, error, guardando, guardado (toast «Preferencias guardadas»).

---

### P-012 Activar cuenta

| Campo | Detalle |
|---|---|
| **Propósito** | Que un usuario invitado defina su contraseña y active su cuenta. |
| **Actor** | Usuario INVITADO (sin sesión). |
| **HUs** | HU-002 (y HU-003 por el enlace emitido). |
| **Datos que muestra** | Formulario de contraseña; requisitos. |
| **Endpoints** | #4 `POST /autenticacion/activacion`. |
| **Acciones** | Definir contraseña · Confirmarla · Mostrar/ocultar · Activar cuenta. |
| **Reglas de negocio** | RN-098 (72 h, vigencia comprobada al canjear, un solo uso), RN-243 a RN-253 (8–128 caracteres, no solo espacios, sin requisitos de composición, sin recortar), RN-152. |

**Wireframe (layout Acceso):**

```text
┌ <h1>Activa tu cuenta</h1> ────────────────────────────────┐
│ Define una contraseña para ingresar a VenceYa.             │
│ Nueva contraseña *                                         │
│ [ ••••••••••••••••••••          ] [Mostrar]                │ autocomplete=new-password
│ Requisitos (lista, se marcan al cumplirse, aria-live=polite):│
│  • Entre 8 y 128 caracteres                                │
│  • No puede ser solo espacios                              │
│  Sugerencia: «Puedes usar una frase, por ejemplo: cobranza │
│  segura 2026.»                                             │
│ Confirmar contraseña *                                     │
│ [ ••••••••••••••••••••          ]                          │
│ [           Activar cuenta           ]                     │
└────────────────────────────────────────────────────────────┘
```

- El token se lee de la URL al cargar y se elimina de la barra de direcciones (`history.replaceState`); no se guarda en almacenamiento local.
- Estados: inicial; enviando; error de contraseña (el enlace sigue vigente); **enlace no válido** (`ENLACE_VENCIDO`/`ENLACE_NO_VALIDO`): reemplaza el formulario por «Este enlace venció o ya fue usado. Pide a un administrador de tu empresa que te reenvíe la invitación.»; éxito → P-001 con «Cuenta activada. Ya puedes iniciar sesión.»; contrato terminado → P-015.

---

### P-013 Solicitar recuperación de contraseña

| Campo | Detalle |
|---|---|
| **Propósito** | Solicitar un enlace para restablecer la contraseña. |
| **Actor** | Usuario ACTIVO sin sesión. |
| **HUs** | HU-002. |
| **Datos que muestra** | Campo correo; mensaje neutro tras enviar. |
| **Endpoints** | #5 `POST /autenticacion/recuperacion`. |
| **Acciones** | Enviar enlace · Volver a iniciar sesión. |
| **Reglas de negocio** | RN-102 (enlace de 60 min, uno vigente), RN-258 a RN-260 (respuesta idéntica para cualquier correo; límite de solicitudes sin cambiar el mensaje). |

**Wireframe:**

```text
┌ <h1>Recupera tu contraseña</h1> ──────────────────────────┐
│ Escribe el correo con el que ingresas a VenceYa.          │
│ Correo electrónico * [                          ]          │
│ [          Enviar enlace          ]                        │
│ ◂ Volver a iniciar sesión                                  │
└────────────────────────────────────────────────────────────┘
Tras enviar (siempre igual, role=status):
│ «Si el correo pertenece a una cuenta activa, recibirás un enlace para restablecer │
│  tu contraseña.» El enlace vence en 60 minutos.  [Volver a iniciar sesión]        │
```

---

### P-014 Restablecer contraseña

| Campo | Detalle |
|---|---|
| **Propósito** | Definir una nueva contraseña con el enlace de recuperación. |
| **Actor** | Usuario ACTIVO sin sesión. |
| **HUs** | HU-002. |
| **Datos que muestra** | Igual que P-012 (requisitos y confirmación). |
| **Endpoints** | #6 `POST /autenticacion/recuperacion/restablecimiento`. |
| **Acciones** | Guardar contraseña. |
| **Reglas de negocio** | RN-102 (60 min, un uso; al guardar cierra todas las sesiones y desbloquea la cuenta), RN-243 a RN-253, RN-152. |

**Wireframe:** idéntico a P-012 con título «Crea una nueva contraseña» y botón «Guardar contraseña». Éxito → P-001 con «Contraseña actualizada. Se cerraron tus sesiones abiertas.» Enlace no válido → «Este enlace venció o ya fue usado. [Solicitar otro enlace]» (→ P-013).

---

### P-015 Páginas de estado

| Campo | Detalle |
|---|---|
| **Propósito** | Comunicar de forma uniforme recursos inexistentes o de otra empresa, falta de permiso, contrato terminado y errores técnicos, sin revelar información. |
| **Actor** | Todos. |
| **HUs** | HU-002 (contrato terminado, sesión), HU-003 (sin permiso), HU-004 a HU-010 y HU-017 (404 de aislamiento). |
| **Reglas de negocio** | PRINCIPIO-003, RN-008 (404 idéntico para otra empresa o inexistente), RN-152 (bloqueo desde la terminación efectiva), PRINCIPIO-005 (sin datos en el error). |

**Variantes (dentro del shell si hay sesión; layout Acceso si no):**

| Variante | Título | Texto | Acción |
|---|---|---|---|
| No encontrado (404) | «No encontramos lo que buscas» | «El enlace no existe o no tienes acceso a este registro.» | [Ir al panel] |
| Sin permiso (403) | «No tienes permiso» | «Tu rol no permite ver esta sección. Si crees que es un error, consulta a un administrador de tu empresa.» | [Ir al panel] |
| Contrato terminado | «Acceso finalizado» | «El contrato de tu empresa con VenceYa terminó y el acceso ya no está disponible.» | — (sin sesión) |
| Error técnico (500) | «Algo salió mal» | «No se completó la operación. Inténtalo de nuevo. Código de soporte: `idSolicitud`.» | [Reintentar] |

```text
┌────────────────────────────────────────────┐
│        [Ilustración decorativa, alt=""]    │
│ <h1>No encontramos lo que buscas</h1>      │
│ El enlace no existe o no tienes acceso…    │
│            [ Ir al panel ]                 │
└────────────────────────────────────────────┘
```

---

### P-016 Historial cronológico de la cuota (Should — S1 o S4)

| Campo | Detalle |
|---|---|
| **Propósito** | Mostrar en orden cronológico todo lo que pasó con una cuota. |
| **Actor** | Todos los roles. |
| **HUs** | HU-017. |
| **Datos que muestra** | Cabecera de la cuota (comprobante, contacto, n°, importe, saldo, estado). Línea de tiempo de eventos: emisión, ediciones, reprogramaciones (fecha anterior → nueva, solo con S1), pagos (importe), anulaciones de pago (importe, motivo), transiciones derivadas (VENCIDA, CANCELADA, reapertura). Cada evento registrado por un usuario muestra además «Registrado el AAAA-MM-DD HH:mm por USUARIO» como dato informativo. |
| **Endpoints** | #49 `GET /cuotas/{id}/historial` (404 si S1 y S4 no están entregadas). |
| **Acciones** | Volver al comprobante. |
| **Reglas de negocio** | RN-078 (orden por fecha del hecho, empates, transiciones recalculadas, eventos conservados), RN-083, RN-084, RN-088, RN-205/RN-206 (corte). |

**Wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ Migas: Comprobantes / F001-00045 / Cuota 1 / Historial                               │
│ <h1>Historial de la cuota 1 de F001-00045</h1>          Datos al 09/11/2026, 08:15   │
│ DISTRIBUIDORA LIMA · Importe S/ 100.00 · Saldo S/ 0.00 · [CANCELADA]                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ <ol aria-label="Eventos en orden cronológico">  (línea vertical a la izquierda)      │
│ ● 2026-10-01  Emisión del comprobante (vence 2026-10-15)                             │
│ ● 2026-10-10  Pago de S/ 40.00                                                        │
│               Registrado el 2026-10-10 09:12 por LUIS PAZ                            │
│ ◆ 2026-10-16  Pasó a VENCIDA                         (evento derivado, icono distinto)│
│ ● 2026-10-20  Pago de S/ 60.00  [ANULADO]                                             │
│               Registrado el 2026-10-20 11:00 por LUIS PAZ                            │
│ ● 2026-10-21  Anulación del pago de S/ 60.00 · Motivo: IMPORTE ERRÓNEO               │
│               Registrado el 2026-10-21 08:30 por ANA TORRES                          │
│ ◆ 2026-10-21  Reapertura de la cuota                                                 │
│ </ol>                                                                                │
│ Leyenda: ● hecho registrado · ◆ cambio de estado calculado                           │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Estados:** cargando, error, no disponible (sin S1 ni S4: la opción no aparece en P-006 y la ruta muestra P-015 404).

---

### P-017 Reprogramar cuota — diálogo `P-006.D4` (Should — S1)

| Campo | Detalle |
|---|---|
| **Propósito** | Registrar una nueva fecha de pago prometida o acordada para una cuota con saldo. |
| **Actor** | Todos los roles. |
| **HUs** | HU-011. |
| **Datos que muestra** | Cuota, vencimiento original, fecha efectiva vigente, saldo, promesa activa (si existe), historial de promesas (#40). |
| **Endpoints** | #40 `GET /cuotas/{id}/promesas`; #41 `POST /cuotas/{id}/promesas` (con `versionCuota`). |
| **Acciones** | Elegir nueva fecha · Guardar reprogramación. |
| **Reglas de negocio** | RN-033 a RN-036, RN-071 a RN-074, RN-080, RN-085, RN-118, RN-160 (sin aprobación; nueva fecha > fecha efectiva y ≥ hoy; requiere saldo > 0 y comprobante no anulado; una sola promesa ACTIVA, la anterior queda REEMPLAZADA; la marca no cambia el estado; permite avisar de nuevo sin «Reenviar aviso»). |

**Wireframe:**

```text
┌ <h2>Reprogramar cuota 2 de F001-00045</h2> ─────────────── [✕] ┐
│ <dl> Vencimiento original: 2026-11-10                           │
│      Fecha efectiva actual: 2026-11-20 (promesa ACTIVA)         │
│      Saldo: S/ 1,000.00                                         │
│ Nueva fecha de pago *                                           │
│ [AAAA-MM-DD 📅]  Ayuda: «Posterior al 2026-11-20 y no anterior  │
│                         a hoy (2026-11-09).»                    │
│ Nota: «No requiere aprobación. La promesa actual quedará        │
│ reemplazada. El estado y los avisos usarán la nueva fecha.»     │
│ <details> Promesas anteriores (2) </details>                    │
│                      [Cancelar]  [Guardar reprogramación]       │
└─────────────────────────────────────────────────────────────────┘
```

Errores: `CUOTA_SIN_SALDO` → «La cuota ya no tiene saldo.»; fecha inválida bajo el campo; `DATOS_DESACTUALIZADOS` → estado conflicto.

---

### P-018 Reporte de vencimientos (Should — S4, HU pendiente de aprobación)

| Campo | Detalle |
|---|---|
| **Propósito** | Ver en pantalla las cuotas agrupadas en por vencer, vencidas, reprogramadas con promesa activa y canceladas del periodo, con cantidad e importe por grupo y moneda; exportar (SUP/ADM). |
| **Actor** | Todos los roles; exportación solo SUPERVISOR y ADMINISTRADOR. |
| **HUs** | HU-014, HU-016 (sugeridas; requieren aprobación antes de construirse). |
| **Datos que muestra** | Leyenda de corte; filtros; 4 grupos con tabla de cuotas y resumen por moneda («Saldo vigente» en grupos 1–3; «Importe de cuotas canceladas en el periodo» en el grupo 4); indicación «promesa incumplida» en vencidas. |
| **Endpoints** | No definidos en `07-openapi.yaml` (S4 reservado con `FUNCIONALIDAD_S4`). |
| **Acciones** | Elegir sentido (por cobrar/por pagar) · Elegir periodo de canceladas (inicio y fin inclusivos) · Consultar · Exportar CSV · Exportar Excel · Ver historial de una cuota (P-016). |
| **Reglas de negocio** | RN-076, RN-077, RN-079, RN-188, RN-047, RN-071, RN-074, RN-075, RN-205 a RN-209 (anulados siempre excluidos y sin opción para incluirlos). |

**Wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ <h1>Reporte de vencimientos</h1>                         Datos al 09/11/2026, 08:15  │
│ Sentido ( ● Por cobrar )( ○ Por pagar )                                              │
│ Canceladas entre [2026-10-01 📅] y [2026-10-31 📅]   [Consultar]                     │
│ [Exportar CSV] [Exportar Excel]   ← solo SUP/ADM                                     │
│ Tabs/Accordion por grupo:                                                            │
│ ▾ Por vencer (12)       Resumen: S/ 8,000.00 · US$ 1,000.00 (saldo vigente)          │
│   Tabla: Contacto | Comprobante | Cuota | Vencimiento | Saldo | Moneda               │
│ ▸ Vencidas (6)          Resumen: S/ 4,500.00 (saldo vigente)                         │
│ ▸ Reprogramadas con promesa activa (0)  S/ 0.00                                      │
│ ▸ Canceladas del periodo (9)  Importe de cuotas canceladas en el periodo:            │
│                               S/ 3,200.00 · US$ 500.00                               │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

Estados: inicial (sin consultar), cargando, periodo inválido (error bajo las fechas, sin resultados), vacío por grupo, error, exportando (botón deshabilitado), sin permiso de exportar (botones ocultos).

---

### P-019 Exportar listado de movimientos (Should — S4, HU pendiente de aprobación)

| Campo | Detalle |
|---|---|
| **Propósito** | Descargar en CSV o Excel una fila por cuota de los comprobantes emitidos en un periodo. |
| **Actor** | SUPERVISOR y ADMINISTRADOR. |
| **HUs** | HU-015 (sugerida; requiere aprobación). |
| **Datos que muestra** | Formulario de opciones; descripción de columnas incluidas (sin correo, teléfono ni dirección del contacto). |
| **Endpoints** | No definidos en `07-openapi.yaml`. |
| **Acciones** | Periodo de emisión (inicio y fin obligatorios) · Sentido (Ambos por defecto, Por cobrar, Por pagar) · «Incluir comprobantes anulados» (desactivado por defecto) · Exportar CSV · Exportar Excel. |
| **Reglas de negocio** | RN-050, RN-051, RN-144 a RN-146, RN-183 a RN-187, RN-163 (CSV UTF-8 con BOM, coma, CRLF, comillas; números de documento como texto), RN-205 a RN-207. |

**Wireframe:**

```text
┌ <h1>Exportar movimientos</h1> ───────────────────────────────────────┐
│ Emitidos entre * [AAAA-MM-DD 📅] y * [AAAA-MM-DD 📅]                  │
│ Sentido ( ● Ambos )( ○ Por cobrar )( ○ Por pagar )                    │
│ [☐ Incluir comprobantes anulados]                                     │
│   Ayuda: «Aparecerán con estado de pago vacío y "Comprobante anulado: │
│   Sí". No representan obligaciones vigentes.»                         │
│ Nota: «El archivo no incluye correo, teléfono ni dirección. Cada      │
│ moneda se muestra por separado, sin totales que las sumen.»           │
│                         [Exportar CSV]  [Exportar Excel]              │
└───────────────────────────────────────────────────────────────────────┘
```

Estados: inicial, periodo inválido, exportando, descarga lista (toast con el nombre del archivo y su leyenda de corte), error.

---

## 5. Design Tokens

Base: shadcn/ui (Radix + Tailwind). Los tokens se declaran como variables CSS en `:root` y se mapean en `tailwind.config` (`colors.primary = 'var(--color-primario)'`, etc.). Todos los pares texto/fondo indicados fueron verificados con la fórmula de contraste WCAG 2.x.

### 5.1 Paleta de colores — tema claro (por defecto)

| Token | Hex | Uso | Contraste verificado |
|---|---|---|---|
| `--color-primario` | `#0B5FA5` | Botón primario, enlaces, ítem activo, foco, serie «Cobros» | 6.57:1 sobre `#FFFFFF`; 6.28:1 sobre fondo |
| `--color-primario-texto` | `#FFFFFF` | Texto sobre primario | 6.57:1 |
| `--color-primario-hover` | `#094C84` | Hover/activo del primario | > 6.57:1 |
| `--color-primario-suave` | `#E0EEFA` | Fondo de ítem activo, filas seleccionadas | primario sobre él: 5.57:1 |
| `--color-secundario` | `#0F766E` | Serie «Pagos» del gráfico, acciones secundarias destacadas | 5.47:1 sobre blanco |
| `--color-acento` | `#B45309` | Advertencias, marca «Reprogramada», «Por vencer» destacado | 5.02:1 sobre blanco |
| `--color-peligro` | `#B91C1C` | Errores, botones destructivos, importes vencidos | 6.47:1 sobre blanco |
| `--color-exito` | `#15803D` | Confirmaciones, CANCELADA, Enviado | 5.02:1 sobre blanco |
| `--color-fondo` | `#F8FAFC` | Fondo de la aplicación | — |
| `--color-superficie` | `#FFFFFF` | Cards, diálogos, tablas | — |
| `--color-texto` | `#0F172A` | Texto principal | 17.06:1 sobre fondo |
| `--color-texto-secundario` | `#475569` | Ayudas, metadatos, leyenda de corte | 7.58:1 sobre blanco; 7.24:1 sobre fondo |
| `--color-borde-control` | `#64748B` | Borde de inputs, selects, casillas (WCAG 1.4.11 ≥ 3:1) | 4.76:1 sobre blanco |
| `--color-borde-sutil` | `#E2E8F0` | Divisores decorativos, bordes de Card | (decorativo) |
| `--color-foco` | `#0B5FA5` | Anillo de foco: 2 px sólido + 2 px de separación | 6.57:1 |

**Badges de estado (texto oscuro sobre fondo tenue):**

| Token | Texto | Fondo | Contraste |
|---|---|---|---|
| `estado-vencida` | `#991B1B` | `#FEE2E2` | 6.80:1 |
| `estado-cancelada` / `aviso-enviado` | `#166534` | `#DCFCE7` | 6.49:1 |
| `marca-reprogramada` / advertencia | `#92400E` | `#FEF3C7` | 6.37:1 |
| `estado-pendiente` / `aviso-en-proceso` | `#1E40AF` | `#DBEAFE` | 7.15:1 |
| `estado-anulado` / `aviso-no-enviado` | `#334155` | `#E2E8F0` | 8.40:1 |

### 5.2 Paleta — tema oscuro (opcional, respeta `prefers-color-scheme`)

| Token | Hex | Contraste verificado |
|---|---|---|
| `--color-fondo` | `#0B1220` | — |
| `--color-superficie` | `#111A2E` | — |
| `--color-texto` | `#F8FAFC` | 17.89:1 sobre fondo |
| `--color-texto-secundario` | `#94A3B8` | 7.30:1 sobre fondo |
| `--color-primario` | `#60A5FA` (texto del botón: `#0B1220`) | 7.36:1 |
| `--color-secundario` | `#2DD4BF` | 10.06:1 |
| `--color-acento` | `#FBBF24` | 11.22:1 |
| `--color-peligro` | `#F87171` | 6.77:1 |
| `--color-exito` | `#4ADE80` | 10.74:1 |
| `--color-borde-control` | `#7C8BA1` | 5.01:1 sobre superficie |

### 5.3 Gráficos

| Serie | Color | Diferenciador no cromático |
|---|---|---|
| Cobros | `--color-primario` | Relleno sólido; etiqueta «Cobros» en leyenda |
| Pagos | `--color-secundario` | Relleno con trama diagonal (patrón SVG); etiqueta «Pagos» |
| Rejilla / ejes | `--color-borde-sutil` / `--color-texto-secundario` | — |

Cada gráfico tiene título visible, resumen textual y pestaña «Tabla» con los mismos valores (PRINCIPIO-010).

### 5.4 Tipografía

| Token | Valor |
|---|---|
| Familia | `"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` (Inter cubre á, é, í, ó, ú, ñ, ü) |
| Números | `font-variant-numeric: tabular-nums` en importes, fechas y tablas |
| Tamaño base | 16 px (1 rem); nunca menor que 14 px en texto de contenido |
| Interlineado | 1.5 en texto; 1.25 en títulos |
| Escala | `--texto-xs` 12 px (solo metadatos no esenciales) · `--texto-sm` 14 px (tablas, ayudas) · `--texto-base` 16 px · `--texto-lg` 18 px · `--texto-xl` 20 px (h3) · `--texto-2xl` 24 px (h2) · `--texto-3xl` 30 px (h1 y cifras de indicadores) |
| Pesos | 400 normal · 500 etiquetas y encabezados de tabla · 600 títulos y botones · 700 cifras de indicadores |
| Ajuste de texto | Soporta zoom al 200 % y `text-spacing` (WCAG 1.4.4 y 1.4.12) sin cortar contenido |

### 5.5 Espaciado, forma y elevación

| Token | Valor |
|---|---|
| Unidad | 4 px (`--espacio-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 · `-8` 32 · `-10` 40 · `-12` 48) |
| Radio | `--radio-sm` 4 px (badges) · `--radio-md` 8 px (inputs, botones) · `--radio-lg` 12 px (cards, diálogos) |
| Sombra | `--sombra-card` `0 1px 2px rgb(15 23 42 / .06)` · `--sombra-dialogo` `0 10px 30px rgb(15 23 42 / .18)` |
| Ancho máximo del contenido | 1280 px; formularios 720 px |

### 5.6 Tamaños de componentes

| Componente | Especificación |
|---|---|
| Botón (`Button`) | Alto 40 px escritorio / 44 px móvil; padding horizontal 16 px; texto 14–16 px peso 600; variantes `primario`, `secundario` (borde `--color-borde-control`), `fantasma`, `destructivo`; estado «cargando» con spinner + texto. Botón solo icono: 40×40 px con `aria-label`. |
| Input / Select / Combobox | Alto 40 px (44 px móvil); borde 1 px `--color-borde-control`; etiqueta visible encima (14 px, 500); ayuda debajo (14 px secundario); error debajo (14 px peligro, con icono y texto). |
| Casilla / radio | Caja de 20 px con área clicable ≥ 24×24 px (etiqueta incluida en el área). |
| Badge | Alto 24 px, padding 8 px, texto 12–14 px peso 500, radio 4 px, siempre con texto. |
| Card de indicador | Padding 20 px; título 14 px; cifra 30 px peso 700; pie 14 px. Alto mínimo 120 px. |
| Tabla | Fila 48 px (compacta 40 px); encabezado 14 px peso 500, fondo `--color-fondo`; importes alineados a la derecha. |
| Diálogo | Ancho 480 px (confirmaciones), 560 px (formularios), 720 px (confirmar envío); pantalla completa en < 640 px; foco atrapado; `Esc` cierra salvo durante «Enviando…». |
| Toast | Ancho 360 px, esquina inferior derecha (superior en móvil), 5 s; los errores **no** usan toast sino Alert persistente. |
| Header / Sidebar | 64 px / 248 px en escritorio; 56 px de header en móvil. |
| Anillo de foco | `outline: 2px solid var(--color-foco); outline-offset: 2px;` en todo elemento interactivo; nunca `outline: none` sin reemplazo. |

### 5.7 Breakpoints y movimiento

| Token | Valor |
|---|---|
| `movil` | < 640 px (una columna, tablas como tarjetas, sidebar en `Sheet`) |
| `tablet` | 640–1023 px (sidebar de iconos, grid de 2 columnas) |
| `escritorio` | ≥ 1024 px |
| Movimiento | Transiciones de 150–200 ms; con `prefers-reduced-motion: reduce` se desactivan animaciones y spinners giratorios pasan a indicador estático con texto. |

---

## 6. Navigation Map

```text
VenceYa (SPA)
│
├── Sin sesión (layout Acceso)
│   ├── /iniciar-sesion ............................. P-001 Iniciar sesión
│   │   └── «¿Olvidaste tu contraseña?» → /recuperar-contrasena ... P-013
│   ├── /activar-cuenta  (desde correo de invitación) P-012 Activar cuenta → P-001
│   ├── /recuperar-contrasena ....................... P-013 Solicitar recuperación
│   ├── /restablecer-contrasena (desde correo) ...... P-014 Restablecer contraseña → P-001
│   └── /contrato-terminado ......................... P-015 (variante contrato terminado)
│
└── Con sesión (shell: header + sidebar)
    ├── /panel  (inicio por defecto) ................ P-002 Panel de cartera
    │   ├── Indicador «Ver ▸» → filtro del listado (misma pantalla)
    │   ├── Fila del listado → /comprobantes/:id .... P-006
    │   └── «Ir a avisos» → /avisos ................. P-007
    │
    ├── /comprobantes ............................... P-004 Comprobantes
    │   ├── /comprobantes/nuevo ..................... P-005 Registrar
    │   │   └── «Crear contacto» → diálogo P-003.D1
    │   └── /comprobantes/:id ....................... P-006 Detalle
    │       ├── diálogo P-006.D1 Registrar pago
    │       ├── diálogo P-006.D2 Anular pago ............ [SUP, ADM]
    │       ├── diálogo P-006.D3 Anular comprobante ..... [SUP, ADM]
    │       ├── diálogo P-006.D4 Reprogramar (P-017) .... [Should S1]
    │       ├── /comprobantes/:id/editar ................ P-005 Editar (solo si editable)
    │       └── /cuotas/:id/historial ................... P-016 Historial [Should S1/S4]
    │
    ├── /contactos .................................. P-003 Contactos
    │   ├── diálogo P-003.D1 Nuevo / editar contacto
    │   ├── diálogo P-003.D2 Eliminar contacto
    │   └── «Ver comprobantes» → /comprobantes?contactoId= ... P-004
    │
    ├── Avisos
    │   ├── /avisos ................................. P-007 Cuotas por avisar
    │   │   └── diálogo P-007.D1 Confirmar envío → resultado
    │   └── /avisos/bandeja ......................... P-008 Bandeja interna
    │       └── /avisos/bandeja/:id ................. P-008 Detalle del intento
    │
    ├── Reportes ........................................ [Should S4 · HU pendientes]
    │   ├── /reportes/vencimientos .................. P-018 Reporte de vencimientos
    │   └── /reportes/movimientos ................... P-019 Exportar movimientos [SUP, ADM]
    │
    ├── Administración .................................. [ADM]
    │   ├── /usuarios ............................... P-009 Usuarios
    │   │   ├── diálogo P-009.D1 Invitar usuario
    │   │   ├── diálogo P-009.D2 Cambiar rol
    │   │   └── diálogo P-009.D3 Desactivar usuario
    │   └── /configuracion .......................... P-010 Configuración de la empresa
    │
    ├── Menú de usuario
    │   ├── /mi-cuenta/preferencias ................. P-011 Mis preferencias
    │   └── «Cerrar sesión» → POST #2 → /iniciar-sesion
    │
    └── * (cualquier otra ruta, 404, 403, 500) ...... P-015 Páginas de estado
```

### 6.1 Visibilidad del menú por rol (RN-060)

| Ítem de menú | OPERADOR | SUPERVISOR | ADMINISTRADOR |
|---|---|---|---|
| Panel | ✓ | ✓ | ✓ |
| Comprobantes | ✓ | ✓ | ✓ |
| Contactos | ✓ | ✓ | ✓ |
| Avisos (por avisar, bandeja) | ✓ | ✓ | ✓ |
| Reportes · Vencimientos (S4) | ✓ (sin exportar) | ✓ | ✓ |
| Reportes · Exportar movimientos (S4) | — | ✓ | ✓ |
| Usuarios | — | — | ✓ |
| Configuración | — | — | ✓ |
| Mis preferencias | ✓ | ✓ | ✓ |
| Acciones «Anular» (pago, comprobante) | — | ✓ | ✓ |

Ocultar una opción en la UI es solo una ayuda: el servidor vuelve a comprobar cada permiso (RN-060, HU-008).

### 6.2 Guardas de ruta

| Guarda | Regla |
|---|---|
| Sesión | Sin sesión vigente (#3 → 401) → `/iniciar-sesion?volver=<ruta>`. |
| Rol | `/usuarios`, `/configuracion` solo ADMINISTRADOR; `/reportes/movimientos` solo SUP/ADM; en otro caso P-015 «Sin permiso». |
| Banderas | `FUNCIONALIDAD_S1`, `FUNCIONALIDAD_S4`, `FUNCIONALIDAD_S5` desactivadas → la opción no aparece y la ruta muestra P-015 404. |
| Contrato terminado | Cualquier `CONTRATO_TERMINADO` → cierra la sesión local y navega a `/contrato-terminado`. |

---

## 7. Accesibilidad: checklist por pantalla (PRINCIPIO-010)

Cada pantalla nueva debe pasar, antes del merge:

1. axe-core con Playwright sin violaciones serias o críticas (CI).
2. Recorrido manual solo con teclado: orden de tabulación lógico, foco visible, sin trampas de foco, `Esc` cierra diálogos y devuelve el foco al disparador.
3. Un único `<h1>` por pantalla; jerarquía de encabezados sin saltos; regiones `header`, `nav`, `main`.
4. Toda entrada con `<label>` asociado; obligatorios marcados con «*» y `aria-required`; errores vinculados con `aria-describedby`.
5. Estados comunicados con texto (badges), no solo color; gráficos con tabla equivalente.
6. Contraste ≥ 4.5:1 en texto y ≥ 3:1 en bordes de controles e iconos significativos.
7. Objetivos táctiles ≥ 24×24 px (WCAG 2.2, 2.5.8); se recomienda 44×44 px en móvil.
8. Sin pérdida de contenido a 320 px de ancho ni con zoom al 200 %.
9. Cambios dinámicos (totales, contadores, resultados de envío) anunciados en regiones `aria-live` adecuadas.
10. Elementos fijos (barra de acción de avisos, resumen de comprobante) que no ocultan el elemento con foco (WCAG 2.2, 2.4.11).

---

## 8. Supuestos y preguntas abiertas de UI

Decisiones tomadas con un criterio razonable para no bloquear la especificación. Si alguna no se acepta, se ajusta este documento sin cambiar el alcance.

| # | Supuesto adoptado | Pregunta para validar |
|---|---|---|
| UI-1 | La paleta, el logotipo textual «VenceYa» y la tipografía Inter son una **propuesta**; no hay identidad de marca definida en el Spec Pack. | ¿Existe un manual de marca o colores corporativos que reemplacen esta paleta? |
| UI-2 | P-018 y P-019 se especifican aunque HU-014 a HU-016 siguen pendientes de aprobación; no entran al backlog hasta aprobarse. | ¿Se aprueban HU-013 a HU-016 para incluirlas en la siguiente entrega Should? |
| UI-3 | El indicador de comportamiento de pago (HU-013, S3) se mostraría como columna en P-003 y en el diálogo de contacto, oculto hasta S3. | ¿Se confirma esa ubicación? |
| UI-4 | Las fechas de negocio se muestran en ISO `AAAA-MM-DD` (como en HU-010 y RN-112) y solo la leyenda de corte usa `DD/MM/AAAA`. | ¿Se prefiere `DD/MM/AAAA` para todas las fechas visibles, manteniendo ISO solo en el API? |
| UI-5 | El tema oscuro es opcional y puede entregarse después. | ¿Se requiere tema oscuro en el MVP? |
| UI-6 | No se muestra aviso previo de expiración por inactividad (30 min); al vencer, se redirige a P-001 con un mensaje. | ¿Se desea un aviso «Tu sesión vencerá en 2 minutos» con opción de continuar? (Debe respetar que los sondeos automáticos no renuevan la inactividad.) |
| UI-7 | El historial de ediciones de un contacto se enlaza desde P-003.D1 solo si el API lo expone; `07-openapi.yaml` no define una operación específica. | ¿Debe existir una vista de historial de ediciones de contactos y comprobantes en el MVP, o basta con su conservación (RN-083)? |
| UI-8 | Tras anular un comprobante se ofrece «Registrar comprobante nuevo con estos datos» (prellenado sin número de documento), como ayuda para la corrección sin S1 (alcance §3.1). | ¿Se acepta este atajo? |

---

## 9. Trazabilidad HU → pantallas

| HU | Prioridad | Pantallas |
|---|---|---|
| HU-001 | Must | Sin pantalla (API interna; ADR-007) |
| HU-002 | Must | P-001, P-012, P-013, P-014, P-015 |
| HU-003 | Must | P-009 (D1–D3), P-015 |
| HU-004 | Must | P-003 (D1–D2), P-005 (alta rápida) |
| HU-005 | Must | P-004, P-005, P-006 |
| HU-006 | Must | P-006 (D1) |
| HU-007 | Must | P-006 (D2, D3), P-004 |
| HU-008 | Must | P-002, P-010, P-011 |
| HU-009 | Must | P-010 |
| HU-010 | Must | P-007 (D1), P-008 |
| HU-011 | Should | P-017 (P-006.D4), P-002 (promesas), P-007 (promesa por cuota) |
| HU-012 | Should | P-002 (tarjeta S5) |
| HU-017 | Should | P-016 |
| HU-013 | Should (pendiente) | P-003 (columna) |
| HU-014, HU-016 | Should (pendiente) | P-018 |
| HU-015 | Should (pendiente) | P-019 |
| HU-018 | — (no se desarrolla) | P-015 (contrato terminado) |
