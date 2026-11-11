/* P-003 Contactos — VenceYa (prototipo: datos ficticios, sin backend) */
(function () {
  'use strict';

  var POR_PAGINA = 5;
  var $ = function (id) { return document.getElementById(id); };

  // Relación derivada (RN-128): se calcula a partir de comprobantes por cobrar / por pagar.
  var contactos = [
    c(1, 'DISTRIBUIDORA LIMA', 'ventas@distlima.example', '987654321', 'Av. Argentina 1450, Callao', 'ACTIVO', 4, 0, '88 · Buen pagador'),
    c(2, 'TEXTILES SUR', 'pagos@textsur.example', '', 'Jr. Gamarra 820, La Victoria', 'ACTIVO', 2, 3, '72 · Pagador regular'),
    c(3, 'FERRETERÍA NORTE', 'admin@fnorte.example', '', '', 'DESACTIVADO', 0, 0, ''),
    c(4, 'IMPORTADORA ANDINA S.A.C.', 'compras@andina.example', '986112233', 'Av. Javier Prado Este 2310, San Borja', 'ACTIVO', 6, 0, '95 · Buen pagador'),
    c(5, 'SERVICIOS GRÁFICOS PERÚ', 'facturas@sgperu.example', '945001122', '', 'ACTIVO', 0, 2, ''),
    c(6, 'TRANSPORTES RÁPIDOS DEL CENTRO', 'contacto@trcentro.example', '', 'Carretera Central km 12, Ate', 'ACTIVO', 0, 1, ''),
    c(7, 'BODEGA SAN MARTÍN', 'bodegasm@correo.example', '912345678', 'Mz. B Lt. 4, San Martín de Porres', 'ACTIVO', 3, 0, '54 · Pagador tardío'),
    c(8, 'MARÍA ELENA TORRES QUISPE', 'metorres@correo.example', '998877665', '', 'ACTIVO', 1, 0, '90 · Buen pagador'),
    c(9, 'CONSTRUCTORA HUARAL E.I.R.L.', 'tesoreria@chuaral.example', '974556677', 'Calle Los Pinos 215, Huaral', 'ACTIVO', 2, 1, '67 · Pagador regular'),
    c(10, 'PAPELERÍA EL ESTUDIANTE', 'ventas@elestudiante.example', '955320011', 'Av. Brasil 1020, Jesús María', 'ACTIVO', 0, 0, ''),
    c(11, 'AGROINDUSTRIAS CAÑETE', 'cobranzas@agrocanete.example', '', 'Panamericana Sur km 144, Cañete', 'DESACTIVADO', 5, 0, '48 · Pagador tardío'),
    c(12, 'LABORATORIOS DEL VALLE', 'pedidos@labvalle.example', '933440055', '', 'ACTIVO', 0, 4, ''),
    c(13, 'SOLUCIONES TI ANDES', 'soporte@tiandes.example', '', '', 'ACTIVO', 0, 0, ''),
    c(14, 'PANADERÍA LA ESPIGA', 'laespiga@correo.example', '921778899', 'Jr. Huallaga 330, Cercado de Lima', 'ACTIVO', 2, 0, '81 · Buen pagador')
  ];
  var siguienteId = 15;

  function c(id, nombre, correo, tel, dir, estado, porCobrar, porPagar, score) {
    return { id: id, nombre: nombre, correo: correo, telefono: tel, direccion: dir, estado: estado, porCobrar: porCobrar, porPagar: porPagar, score: score };
  }
  function relacion(x) {
    if (x.porCobrar && x.porPagar) return 'Cliente y proveedor';
    if (x.porCobrar) return 'Cliente';
    if (x.porPagar) return 'Proveedor';
    return 'Sin comprobantes';
  }
  function sinComprobantes(x) { return !x.porCobrar && !x.porPagar; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function sinTildes(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function largo(s) { return Array.from(s).length; } // cuenta caracteres, no bytes (RN-162)

  var ui = { estadoPantalla: 'datos', filtroEstado: 'ACTIVO', buscar: '', pagina: 1, nuevoId: null };

  /* ---------- Anuncios, toasts, diálogo de navegación ---------- */
  function anunciar(t) { var a = $('anuncio'); a.textContent = ''; setTimeout(function () { a.textContent = t; }, 50); }
  function toast(t) {
    var el = document.createElement('div'); el.className = 'toast'; el.textContent = t;
    $('toasts').appendChild(el); setTimeout(function () { el.remove(); }, 5000);
  }
  function navSimulada(destino) {
    $('dlg-texto').textContent = 'Aquí se abriría: ' + destino + '.';
    $('dlg-nav').showModal();
  }
  $('dlg-cerrar').addEventListener('click', function () { $('dlg-nav').close(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-nav]');
    if (a) { e.preventDefault(); navSimulada(a.getAttribute('data-nav')); cerrarSidebar(); }
  });
  document.querySelectorAll('.sidebar a[aria-current]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); cerrarSidebar(); }); });

  /* ---------- Sidebar móvil ---------- */
  function cerrarSidebar() { $('sidebar').classList.remove('abierto'); $('backdrop').hidden = true; $('btn-menu').setAttribute('aria-expanded', 'false'); }
  $('btn-menu').addEventListener('click', function () {
    var abrir = !$('sidebar').classList.contains('abierto');
    $('sidebar').classList.toggle('abierto', abrir); $('backdrop').hidden = !abrir;
    this.setAttribute('aria-expanded', String(abrir));
  });
  $('backdrop').addEventListener('click', cerrarSidebar);

  /* ---------- Listado ---------- */
  function filtrados() {
    var q = sinTildes(ui.buscar.trim());
    return contactos.filter(function (x) {
      return (ui.filtroEstado === 'todos' || x.estado === ui.filtroEstado) && (!q || sinTildes(x.nombre).indexOf(q) !== -1);
    }).sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });
  }

  function render() {
    cerrarMenu();
    var s3 = $('demo-s3').checked;
    document.querySelectorAll('.col-s3').forEach(function (th) { th.hidden = !s3; });
    $('alerta-error').hidden = ui.estadoPantalla !== 'error';
    $('filtros').hidden = ui.estadoPantalla === 'error';
    var cuerpo = $('cuerpo'), vacio = $('vacio'), pag = $('paginacion');
    var nCols = s3 ? 7 : 6;

    if (ui.estadoPantalla === 'error') {
      $('tabla-wrap').hidden = true; vacio.hidden = true; pag.hidden = true; $('cuenta').textContent = '';
      return;
    }
    $('tabla-wrap').hidden = false;
    $('tabla').setAttribute('aria-busy', ui.estadoPantalla === 'cargando');

    if (ui.estadoPantalla === 'cargando') {
      var f = '';
      for (var i = 0; i < POR_PAGINA; i++) {
        f += '<tr aria-hidden="true">' + new Array(nCols + 1).join('<td><span class="skel"></span></td>') + '</tr>';
      }
      cuerpo.innerHTML = f; vacio.hidden = true; pag.hidden = true;
      $('cuenta').textContent = 'Cargando contactos…';
      return;
    }

    var base = ui.estadoPantalla === 'vacio' ? [] : contactos;
    var lista = ui.estadoPantalla === 'vacio' ? [] : filtrados();
    var paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
    if (ui.pagina > paginas) ui.pagina = paginas;
    var ini = (ui.pagina - 1) * POR_PAGINA;
    var visibles = lista.slice(ini, ini + POR_PAGINA);

    if (!lista.length) {
      $('tabla-wrap').hidden = true; pag.hidden = true; $('cuenta').textContent = '';
      vacio.hidden = false;
      if (!base.length) {
        vacio.innerHTML = '<strong>Aún no tienes contactos</strong><p>Registra a tus clientes y proveedores para asociarlos a tus comprobantes. Solo necesitas un nombre y un correo.</p><button class="btn btn-prim" type="button" data-accion="nuevo">+ Nuevo contacto</button>';
      } else {
        vacio.innerHTML = '<strong>No hay contactos que coincidan</strong><p>Prueba con otro nombre o cambia el filtro de estado.</p><button class="btn btn-sec" type="button" data-accion="limpiar">Limpiar filtros</button>';
      }
      anunciar(base.length ? 'Sin resultados.' : 'No hay contactos.');
      return;
    }
    vacio.hidden = true;

    cuerpo.innerHTML = visibles.map(function (x) {
      var rel = relacion(x), act = x.estado === 'ACTIVO';
      return '<tr class="' + (act ? '' : 'desactivado') + (x.id === ui.nuevoId ? ' nuevo' : '') + '">' +
        '<td class="nombre" data-label="Nombre">' + esc(x.nombre) + '</td>' +
        '<td class="correo" data-label="Correo">' + esc(x.correo) + '</td>' +
        '<td data-label="Teléfono">' + (x.telefono ? esc(x.telefono) : '<span aria-label="Sin teléfono">—</span>') + '</td>' +
        '<td data-label="Relación">' + rel + '</td>' +
        (s3 ? '<td class="col-s3 s3-score" data-label="Comportamiento">' + (x.score ? esc(x.score) : '—') + '</td>' : '') +
        '<td data-label="Estado"><span class="badge ' + (act ? 'b-activo' : 'b-desact') + '">' + (act ? 'ACTIVO' : 'DESACTIVADO') + '</span></td>' +
        '<td class="acc"><button class="btn btn-sec btn-icono btn-acc" type="button" aria-haspopup="menu" aria-expanded="false" data-id="' + x.id + '" aria-label="Acciones de ' + esc(x.nombre) + '"><span aria-hidden="true">⋯</span></button></td>' +
        '</tr>';
    }).join('');
    ui.nuevoId = null;

    $('cuenta').textContent = 'Mostrando ' + (ini + 1) + '–' + (ini + visibles.length) + ' de ' + lista.length + ' contacto' + (lista.length === 1 ? '' : 's');
    anunciar($('cuenta').textContent);

    if (paginas > 1) {
      var h = '<button class="pag-btn" type="button" data-pag="' + (ui.pagina - 1) + '"' + (ui.pagina === 1 ? ' disabled' : '') + '>« Anterior</button><ul>';
      for (var p = 1; p <= paginas; p++) {
        h += '<li><button class="pag-btn" type="button" data-pag="' + p + '"' + (p === ui.pagina ? ' aria-current="page"' : '') + ' aria-label="Página ' + p + '">' + p + '</button></li>';
      }
      h += '</ul><button class="pag-btn" type="button" data-pag="' + (ui.pagina + 1) + '"' + (ui.pagina === paginas ? ' disabled' : '') + '>Siguiente »</button>';
      pag.innerHTML = h; pag.hidden = false;
    } else { pag.hidden = true; }
  }

  $('paginacion').addEventListener('click', function (e) {
    var b = e.target.closest('[data-pag]');
    if (!b || b.disabled) return;
    ui.pagina = +b.getAttribute('data-pag'); render();
    var t = document.querySelector('#paginacion [aria-current="page"]'); if (t) t.focus();
    $('contenido').scrollIntoView({ block: 'start' });
  });
  $('vacio').addEventListener('click', function (e) {
    var b = e.target.closest('[data-accion]'); if (!b) return;
    if (b.getAttribute('data-accion') === 'nuevo') abrirForm(null);
    else { ui.filtroEstado = 'todos'; ui.buscar = ''; $('f-buscar').value = ''; document.querySelector('input[name="estado"][value="todos"]').checked = true; ui.pagina = 1; render(); }
  });
  $('f-buscar').addEventListener('input', function () { ui.buscar = this.value; ui.pagina = 1; render(); });
  document.querySelectorAll('input[name="estado"]').forEach(function (r) {
    r.addEventListener('change', function () { ui.filtroEstado = this.value; ui.pagina = 1; render(); });
  });
  $('btn-nuevo').addEventListener('click', function () { abrirForm(null); });
  $('btn-reintentar').addEventListener('click', function () {
    var b = this; b.setAttribute('aria-disabled', 'true'); b.innerHTML = '<span class="spinner" aria-hidden="true"></span> Reintentando…';
    setTimeout(function () {
      b.removeAttribute('aria-disabled'); b.textContent = 'Reintentar';
      document.querySelector('input[name="demo-estado"][value="datos"]').checked = true;
      ui.estadoPantalla = 'datos'; render(); toast('Contactos cargados.');
    }, 900);
  });

  /* ---------- Menú de acciones (DropdownMenu) ---------- */
  var menuDe = null; // botón disparador
  function cerrarMenu(devolverFoco) {
    var m = $('menu'); if (m.hidden) return;
    m.hidden = true;
    if (menuDe) { menuDe.setAttribute('aria-expanded', 'false'); if (devolverFoco) menuDe.focus(); }
    menuDe = null;
  }
  function abrirMenu(btn) {
    if (menuDe === btn) { cerrarMenu(true); return; }
    cerrarMenu();
    var x = porId(+btn.getAttribute('data-id'));
    var act = x.estado === 'ACTIVO';
    var m = $('menu');
    m.setAttribute('aria-label', 'Acciones de ' + x.nombre);
    m.innerHTML =
      '<button role="menuitem" type="button" data-op="editar">Editar</button>' +
      '<button role="menuitem" type="button" data-op="comprobantes">Ver comprobantes</button>' +
      '<button role="menuitem" type="button" data-op="' + (act ? 'desactivar' : 'reactivar') + '">' + (act ? 'Desactivar' : 'Reactivar') + '</button>' +
      (sinComprobantes(x) ? '<hr role="separator"><button role="menuitem" type="button" class="peligro" data-op="eliminar">Eliminar</button>' : '');
    m.setAttribute('data-id', x.id);
    m.hidden = false;
    var r = btn.getBoundingClientRect();
    var ancho = m.offsetWidth, alto = m.offsetHeight;
    var left = Math.max(8, Math.min(r.right - ancho, window.innerWidth - ancho - 8));
    var top = r.bottom + 4; if (top + alto > window.innerHeight - 8) top = Math.max(8, r.top - alto - 4);
    m.style.left = left + 'px'; m.style.top = top + 'px';
    btn.setAttribute('aria-expanded', 'true'); menuDe = btn;
    m.querySelector('button').focus();
  }
  $('cuerpo').addEventListener('click', function (e) {
    var b = e.target.closest('.btn-acc'); if (b) abrirMenu(b);
  });
  $('menu').addEventListener('keydown', function (e) {
    var items = Array.prototype.slice.call(this.querySelectorAll('button')), i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { items[(i + 1) % items.length].focus(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { items[(i - 1 + items.length) % items.length].focus(); e.preventDefault(); }
    else if (e.key === 'Home') { items[0].focus(); e.preventDefault(); }
    else if (e.key === 'End') { items[items.length - 1].focus(); e.preventDefault(); }
    else if (e.key === 'Escape') { cerrarMenu(true); e.preventDefault(); }
    else if (e.key === 'Tab') { cerrarMenu(true); e.preventDefault(); }
  });
  $('menu').addEventListener('click', function (e) {
    var b = e.target.closest('[data-op]'); if (!b) return;
    var x = porId(+this.getAttribute('data-id')), disp = menuDe, op = b.getAttribute('data-op');
    cerrarMenu();
    if (op === 'editar') abrirForm(x, disp);
    else if (op === 'comprobantes') navSimulada('P-004 Comprobantes, filtrado por el contacto «' + x.nombre + '»');
    else if (op === 'desactivar') {
      x.estado = 'DESACTIVADO'; render();
      toast('«' + x.nombre + '» quedó DESACTIVADO. Sus datos, comprobantes e historial se conservan y su correo sigue reservado.');
      $('contenido').focus();
    } else if (op === 'reactivar') {
      x.estado = 'ACTIVO'; render();
      toast('«' + x.nombre + '» volvió a estar ACTIVO y se puede elegir en comprobantes.');
      $('contenido').focus();
    } else if (op === 'eliminar') abrirEliminar(x, disp);
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('#menu') && !e.target.closest('.btn-acc')) cerrarMenu(); });
  window.addEventListener('resize', function () { cerrarMenu(); });
  window.addEventListener('scroll', function () { cerrarMenu(); }, true);

  function porId(id) { return contactos.filter(function (x) { return x.id === id; })[0]; }

  /* ---------- P-003.D1 Formulario ---------- */
  var edit = null, disparador = null, guardando = false;
  var dlg = $('dlg-form');
  var campos = { nombre: $('c-nombre'), correo: $('c-correo') };

  function abrirForm(x, disp) {
    edit = x; disparador = disp || $('btn-nuevo');
    $('form-titulo').textContent = x ? 'Editar contacto' : 'Nuevo contacto';
    $('form-guardar').textContent = x ? 'Guardar cambios' : 'Guardar contacto';
    $('form-historial').hidden = !x;
    $('c-nombre').value = x ? x.nombre : ''; $('c-correo').value = x ? x.correo : '';
    $('c-tel').value = x ? x.telefono : ''; $('c-dir').value = x ? x.direccion : '';
    limpiarErrores(); $('form-servidor').hidden = true; actualizarContador();
    dlg.showModal(); $('c-nombre').focus();
  }
  function cerrarForm() { dlg.close(); if (disparador && document.contains(disparador)) disparador.focus(); else $('contenido').focus(); }
  function actualizarContador() {
    var n = largo($('c-nombre').value), el = $('c-nombre-cont');
    el.textContent = n + '/250'; el.classList.toggle('excede', n > 250);
  }
  $('c-nombre').addEventListener('input', actualizarContador);
  $('form-x').addEventListener('click', function () { if (!guardando) cerrarForm(); });
  $('form-cancelar').addEventListener('click', function () { if (!guardando) cerrarForm(); });
  dlg.addEventListener('cancel', function (e) { if (guardando) e.preventDefault(); });
  dlg.addEventListener('close', function () { if (disparador && document.contains(disparador) && !dlg.returnValue) { /* foco ya devuelto */ } });

  function limpiarErrores() {
    $('form-resumen').hidden = true; $('form-resumen').innerHTML = '';
    ['nombre', 'correo'].forEach(function (k) {
      campos[k].removeAttribute('aria-invalid'); $('c-' + k + '-error').hidden = true; $('c-' + k + '-error').textContent = '';
    });
  }

  // RN-162 / RN-139: normalización y validación (en producción lo hace el servidor)
  function normalizar(nombre, correo) {
    return {
      nombre: nombre.trim().replace(/\s+/g, ' ').toLocaleUpperCase('es'),
      correo: correo.trim().toLowerCase()
    };
  }
  function validar(v) {
    var err = {};
    if (!v.nombre) err.nombre = 'Falta el nombre o la razón social.';
    else if (largo(v.nombre) > 250) err.nombre = 'El nombre supera los 250 caracteres (tiene ' + largo(v.nombre) + ').';
    else if (!/\p{L}/u.test(v.nombre)) err.nombre = 'El nombre debe contener al menos una letra.';
    else if (!/^[\p{L}\p{N} .,&\-'()\/]+$/u.test(v.nombre)) err.nombre = 'El nombre contiene caracteres no permitidos. Usa letras, números, espacios y . , & - \' ( ) /';

    if (!v.correo) err.correo = 'Falta el correo electrónico.';
    else if (largo(v.correo) > 250) err.correo = 'El correo supera los 250 caracteres (tiene ' + largo(v.correo) + ').';
    else {
      var partes = v.correo.split('@');
      if (/\s/.test(v.correo) || partes.length !== 2 || !partes[0] || !partes[1] || partes[1].indexOf('.') === -1) {
        err.correo = 'Escribe un correo válido, por ejemplo nombre@empresa.com (una sola «@», sin espacios y con un punto en el dominio).';
      } else if (contactos.some(function (x) { return x.correo === v.correo && (!edit || x.id !== edit.id); })) {
        err.correo = 'Este correo ya está registrado en tus contactos.'; // RN-127: incluye desactivados
      }
    }
    return err;
  }
  function mostrarErrores(err) {
    var claves = Object.keys(err), nombres = { nombre: 'Nombre o razón social', correo: 'Correo electrónico' };
    claves.forEach(function (k) {
      campos[k].setAttribute('aria-invalid', 'true');
      var e = $('c-' + k + '-error'); e.textContent = err[k]; e.hidden = false;
    });
    var r = $('form-resumen');
    r.innerHTML = '<span aria-hidden="true">⚠</span><div><strong>Revisa ' + (claves.length === 1 ? 'este dato' : 'estos ' + claves.length + ' datos') + ' para guardar el contacto:</strong><ul>' +
      claves.map(function (k) { return '<li><a href="#c-' + k + '" data-foco="' + k + '">' + nombres[k] + '</a>: ' + esc(err[k]) + '</li>'; }).join('') + '</ul></div>';
    r.hidden = false; r.focus();
  }
  $('form-resumen').addEventListener('click', function (e) {
    var a = e.target.closest('[data-foco]'); if (!a) return;
    e.preventDefault(); campos[a.getAttribute('data-foco')].focus();
  });

  $('form').addEventListener('submit', function (e) {
    e.preventDefault(); if (guardando) return;
    limpiarErrores(); $('form-servidor').hidden = true;
    var v = normalizar($('c-nombre').value, $('c-correo').value);
    var err = validar(v);
    if (Object.keys(err).length) { mostrarErrores(err); return; }

    guardando = true; var b = $('form-guardar'), txt = b.textContent;
    b.setAttribute('aria-disabled', 'true'); b.innerHTML = '<span class="spinner" aria-hidden="true"></span> Guardando…';
    setTimeout(function () {
      guardando = false; b.removeAttribute('aria-disabled'); b.textContent = txt;
      if ($('demo-falla').checked) { $('form-servidor').hidden = false; $('form-servidor').scrollIntoView({ block: 'nearest' }); return; } // errores: Alert persistente, no toast
      var tel = $('c-tel').value.trim(), dir = $('c-dir').value.trim().replace(/\s+/g, ' ');
      var objetivo;
      if (edit) {
        edit.nombre = v.nombre; edit.correo = v.correo; edit.telefono = tel; edit.direccion = dir; objetivo = edit;
      } else {
        objetivo = c(siguienteId++, v.nombre, v.correo, tel, dir, 'ACTIVO', 0, 0, '');
        contactos.push(objetivo);
      }
      // La interfaz muestra los valores devueltos por el servidor (normalizados).
      ui.nuevoId = objetivo.id;
      if (ui.filtroEstado !== 'todos' && ui.filtroEstado !== objetivo.estado) { ui.filtroEstado = objetivo.estado; document.querySelector('input[name="estado"][value="' + objetivo.estado + '"]').checked = true; }
      ui.buscar = ''; $('f-buscar').value = '';
      var lista = filtrados(); ui.pagina = Math.floor(lista.indexOf(objetivo) / POR_PAGINA) + 1;
      document.querySelector('input[name="demo-estado"][value="datos"]').checked = true; ui.estadoPantalla = 'datos';
      cerrarForm(); render();
      toast((edit ? 'Cambios guardados.' : 'Contacto creado y ACTIVO.') + ' Se guardó como «' + v.nombre + '» · ' + v.correo + '.');
    }, 800);
  });

  /* ---------- P-003.D2 Eliminar (AlertDialog) ---------- */
  var elim = null, elimDisp = null, eliminando = false, de = $('dlg-elim');
  function abrirEliminar(x, disp) {
    elim = x; elimDisp = disp;
    $('elim-titulo').textContent = '¿Eliminar a ' + x.nombre + '?';
    $('elim-texto').textContent = 'Esta acción no se puede deshacer. El contacto no tiene comprobantes registrados. Su historial de cambios se conserva.';
    $('elim-texto').hidden = false; $('elim-rechazo').hidden = true;
    $('elim-acc').innerHTML = '<button class="btn btn-sec" type="button" id="elim-cancelar">Cancelar</button><button class="btn btn-peligro" type="button" id="elim-ok">Eliminar</button>';
    de.showModal(); $('elim-cancelar').focus(); // el foco inicia en la opción segura
  }
  de.addEventListener('cancel', function (e) { if (eliminando) e.preventDefault(); });
  de.addEventListener('close', function () { if (elimDisp && document.contains(elimDisp)) elimDisp.focus(); else $('contenido').focus(); });
  de.addEventListener('click', function (e) {
    var id = e.target.id;
    if (id === 'elim-cancelar' || id === 'elim-cerrar') de.close();
    else if (id === 'elim-desactivar') {
      elim.estado = 'DESACTIVADO'; elimDisp = null; de.close(); render();
      toast('«' + elim.nombre + '» quedó DESACTIVADO. Sus datos, comprobantes e historial se conservan.');
    } else if (id === 'elim-ok' && !eliminando) {
      eliminando = true; var b = e.target; b.setAttribute('aria-disabled', 'true'); b.innerHTML = '<span class="spinner" aria-hidden="true"></span> Eliminando…';
      setTimeout(function () {
        eliminando = false;
        if ($('demo-conc').checked) {
          // RN-130: otro usuario registró un comprobante antes; se verifica de nuevo en el servidor y se rechaza.
          elim.porCobrar = 1; $('demo-conc').checked = false;
          $('elim-titulo').textContent = 'No se pudo eliminar a ' + elim.nombre;
          $('elim-texto').hidden = true;
          $('elim-rechazo').innerHTML = '<span aria-hidden="true">⚠</span><div>Mientras confirmabas, otro usuario registró un comprobante para este contacto, por lo que ya no se puede eliminar. Puedes desactivarlo: sus datos, comprobantes e historial se conservan.</div>';
          $('elim-rechazo').hidden = false;
          $('elim-acc').innerHTML = '<button class="btn btn-sec" type="button" id="elim-cerrar">Cerrar</button><button class="btn btn-prim" type="button" id="elim-desactivar">Desactivar contacto</button>';
          $('elim-desactivar').focus(); render();
          return;
        }
        contactos.splice(contactos.indexOf(elim), 1); elimDisp = null; de.close(); render();
        toast('«' + elim.nombre + '» fue eliminado. Su correo quedó disponible y su historial de cambios se conserva.');
        $('contenido').focus();
      }, 800);
    }
  });

  /* ---------- Controles del prototipo ---------- */
  document.querySelectorAll('input[name="demo-estado"]').forEach(function (r) {
    r.addEventListener('change', function () { ui.estadoPantalla = this.value; ui.pagina = 1; render(); });
  });
  $('demo-s3').addEventListener('change', render);
  $('demo-rol').addEventListener('change', function () { $('usuario-rol').textContent = this.value; toast('Todos los roles acceden al mismo catálogo de contactos.'); });
  $('demo-tema').addEventListener('change', function () {
    if (this.value === 'auto') document.documentElement.removeAttribute('data-tema'); else document.documentElement.setAttribute('data-tema', this.value);
  });

  render();
})();
