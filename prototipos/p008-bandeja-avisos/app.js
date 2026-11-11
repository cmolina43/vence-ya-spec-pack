/* P-008 Bandeja de avisos — prototipo VenceYa (datos ficticios, sin backend) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var POR_PAGINA = 8;
  var PLAZO_MS = 10000; // RN-067: plazo del servidor de 10 s

  var TIPOS = { COBRAR_VENCIDA: 'Por cobrar vencida', COBRAR_POR_VENCER: 'Por cobrar por vencer' };
  var RESULTADOS = { ENVIADO: 'Enviado', NO_ENVIADO: 'No Enviado', EN_PROCESO: 'En proceso' };
  var CLASE_RES = { ENVIADO: 'b-env', NO_ENVIADO: 'b-noenv', EN_PROCESO: 'b-proc' };
  // RN-066: los motivos nunca incluyen direcciones de correo ni importes
  var MOTIVOS = {
    TIEMPO_ESPERA: 'Tiempo de espera',
    RECHAZO_PROVEEDOR: 'Rechazo del proveedor',
    ERROR_COMUNICACION: 'Error de comunicación'
  };
  var MOTIVO_MSG = {
    TIEMPO_ESPERA: 'El aviso no se envió. Puedes volver a intentar.',
    RECHAZO_PROVEEDOR: 'El proveedor de correo rechazó el aviso. Puedes volver a intentar.',
    ERROR_COMUNICACION: 'El aviso no se envió por un error de comunicación. Puedes volver a intentar.'
  };

  var ADM = 'admin@andina.example';
  var JEFE = 'jefe.cobranzas@andina.example';

  function q(doc, n, saldo, vence, mon) { return { doc: doc, n: n, saldo: saldo, vence: vence, mon: mon || 'S/' }; }

  // Registro de intentos (más reciente primero). Los datos son una instantánea: no cambian aunque cambie el contacto (RN-138).
  var AVISOS = [
    { id: 'av-0114', fecha: '2026-11-09 08:20', usuario: 'LUIS PAZ', contacto: 'DISTRIBUIDORA LIMA', tipo: 'COBRAR_VENCIDA', res: 'ENVIADO',
      para: 'ventas@distlima.example', cc: [ADM, JEFE], resp: ADM, comentario: 'FAVOR CONFIRMAR FECHA DE PAGO',
      cuotas: [q('F001-00045', 1, 600, '2026-10-28'), q('F001-00052', 1, 1250, '2026-10-30')] },
    { id: 'av-0113', fecha: '2026-11-09 08:20', usuario: 'LUIS PAZ', contacto: 'DISTRIBUIDORA LIMA', tipo: 'COBRAR_POR_VENCER', res: 'NO_ENVIADO', motivo: 'TIEMPO_ESPERA',
      para: 'ventas@distlima.example', cc: [ADM, JEFE], resp: ADM, comentario: '',
      cuotas: [q('F001-00061', 2, 980, '2026-11-14')] },
    { id: 'av-0112', fecha: '2026-11-08 16:05', usuario: 'MARCELA QUISPE', contacto: 'TEXTILES ANDINOS E.I.R.L.', tipo: 'COBRAR_VENCIDA', res: 'ENVIADO',
      para: 'tesoreria@textilesandinos.example', cc: [ADM], resp: ADM, comentario: 'SALDO PENDIENTE DE OCTUBRE',
      cuotas: [q('F001-00038', 1, 3420.5, '2026-10-15'), q('F001-00041', 1, 2100, '2026-10-20'), q('F001-00047', 1, 860.9, '2026-10-29')] },
    { id: 'av-0111', fecha: '2026-11-08 11:42', usuario: 'ROSA HUAMÁN', contacto: 'FERRETERÍA EL MAESTRO', tipo: 'COBRAR_POR_VENCER', res: 'NO_ENVIADO', motivo: 'RECHAZO_PROVEEDOR',
      para: 'compras@elmaestro.example', cc: [JEFE], resp: ADM, comentario: '',
      cuotas: [q('F001-00063', 1, 1480, '2026-11-12')] },
    { id: 'av-0110', fecha: '2026-11-07 09:15', usuario: 'MARCELA QUISPE', contacto: 'CORPORACIÓN NORTE S.A.', tipo: 'COBRAR_VENCIDA', res: 'ENVIADO',
      para: 'cobranzas@corpnorte.example', cc: [ADM, JEFE], resp: ADM, comentario: 'SEGUNDO AVISO',
      cuotas: [q('F001-00029', 2, 7800, '2026-10-10'), q('F001-00029', 3, 7800, '2026-10-25')] },
    { id: 'av-0109', fecha: '2026-11-07 09:12', usuario: 'MARCELA QUISPE', contacto: 'CORPORACIÓN NORTE S.A.', tipo: 'COBRAR_VENCIDA', res: 'NO_ENVIADO', motivo: 'ERROR_COMUNICACION',
      para: 'cobranzas@corpnorte.example', cc: [ADM, JEFE], resp: ADM, comentario: 'SEGUNDO AVISO',
      cuotas: [q('F001-00029', 2, 7800, '2026-10-10'), q('F001-00029', 3, 7800, '2026-10-25')] },
    { id: 'av-0108', fecha: '2026-11-06 17:30', usuario: 'LUIS PAZ', contacto: 'IMPORTADORA PACÍFICO', tipo: 'COBRAR_POR_VENCER', res: 'ENVIADO',
      para: 'pagos@impacifico.example', cc: [ADM], resp: ADM, comentario: '',
      cuotas: [q('F002-00007', 1, 2350, '2026-11-10', 'US$')] },
    { id: 'av-0107', fecha: '2026-11-06 10:03', usuario: 'ROSA HUAMÁN', contacto: 'AGRO SERVICIOS CUSCO', tipo: 'COBRAR_VENCIDA', res: 'ENVIADO',
      para: 'administracion@agrocusco.example', cc: [JEFE], resp: JEFE, comentario: 'PAGO ATRASADO 20 DÍAS',
      cuotas: [q('F001-00021', 1, 4120, '2026-10-17')] },
    { id: 'av-0106', fecha: '2026-11-05 15:48', usuario: 'MARCELA QUISPE', contacto: 'TEXTILES ANDINOS E.I.R.L.', tipo: 'COBRAR_POR_VENCER', res: 'ENVIADO',
      para: 'tesoreria@textilesandinos.example', cc: [ADM], resp: ADM, comentario: '',
      cuotas: [q('F001-00047', 1, 860.9, '2026-10-29'), q('F001-00055', 1, 1540, '2026-11-09')] },
    { id: 'av-0105', fecha: '2026-11-05 08:30', usuario: 'LUIS PAZ', contacto: 'FERRETERÍA EL MAESTRO', tipo: 'COBRAR_VENCIDA', res: 'NO_ENVIADO', motivo: 'TIEMPO_ESPERA',
      para: 'compras@elmaestro.example', cc: [JEFE], resp: ADM, comentario: 'URGENTE',
      cuotas: [q('F001-00033', 1, 920, '2026-10-22')] },
    { id: 'av-0104', fecha: '2026-11-04 14:10', usuario: 'ROSA HUAMÁN', contacto: 'DISTRIBUIDORA LIMA', tipo: 'COBRAR_VENCIDA', res: 'ENVIADO',
      para: 'ventas@distlima.example', cc: [ADM], resp: ADM, comentario: '',
      cuotas: [q('F001-00045', 1, 600, '2026-10-28')] },
    { id: 'av-0103', fecha: '2026-11-03 09:55', usuario: 'MARCELA QUISPE', contacto: 'CORPORACIÓN NORTE S.A.', tipo: 'COBRAR_POR_VENCER', res: 'ENVIADO',
      para: 'cobranzas@corpnorte.example', cc: [ADM, JEFE], resp: ADM, comentario: '',
      cuotas: [q('F001-00029', 2, 7800, '2026-10-10')] },
    { id: 'av-0102', fecha: '2026-10-30 11:20', usuario: 'LUIS PAZ', contacto: 'IMPORTADORA PACÍFICO', tipo: 'COBRAR_VENCIDA', res: 'NO_ENVIADO', motivo: 'RECHAZO_PROVEEDOR',
      para: 'pagos@impacifico.example', cc: [ADM], resp: ADM, comentario: '',
      cuotas: [q('F002-00004', 1, 1800, '2026-10-25', 'US$')] },
    { id: 'av-0101', fecha: '2026-10-28 16:40', usuario: 'ROSA HUAMÁN', contacto: 'AGRO SERVICIOS CUSCO', tipo: 'COBRAR_POR_VENCER', res: 'ENVIADO',
      para: 'administracion@agrocusco.example', cc: [JEFE], resp: JEFE, comentario: '',
      cuotas: [q('F001-00021', 1, 4120, '2026-10-17')] }
  ];

  var estado = { pantalla: 'datos', res: 'todos', contacto: '', desde: '', hasta: '', pagina: 1, abierto: null };
  var disparador = null; // elemento que abrió el detalle (para devolver el foco)
  var temporizadores = {};

  // ---------- utilidades ----------
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function importe(n, mon) { return mon + ' ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function anuncio(t) { $('anuncio').textContent = ''; setTimeout(function () { $('anuncio').textContent = t; }, 30); }
  function toast(t) {
    var el = document.createElement('div');
    el.className = 'toast'; el.textContent = t;
    $('toasts').appendChild(el);
    setTimeout(function () { el.remove(); }, 5000);
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ahora() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function fechaValida(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    var p = s.split('-').map(Number), d = new Date(p[0], p[1] - 1, p[2]);
    return d.getFullYear() === p[0] && d.getMonth() === p[1] - 1 && d.getDate() === p[2];
  }

  // RN-158: un EN_PROCESO con plazo vencido se lee como «No Enviado» (TIEMPO_ESPERA)
  function efectivo(a) {
    if (a.res === 'EN_PROCESO' && Date.now() >= a.plazoHasta) return { res: 'NO_ENVIADO', motivo: 'TIEMPO_ESPERA' };
    return { res: a.res, motivo: a.motivo };
  }

  function filtrados() {
    var c = norm(estado.contacto.trim());
    return AVISOS.filter(function (a) {
      var e = efectivo(a);
      if (estado.res !== 'todos' && e.res !== estado.res) return false;
      if (c && norm(a.contacto).indexOf(c) === -1) return false;
      var dia = a.fecha.slice(0, 10);
      if (estado.desde && dia < estado.desde) return false;
      if (estado.hasta && dia > estado.hasta) return false;
      return true;
    });
  }

  // ---------- lista ----------
  function badge(e) {
    return '<span class="badge ' + CLASE_RES[e.res] + '">' + RESULTADOS[e.res] + '</span>' +
      (e.res === 'NO_ENVIADO' && e.motivo ? '<span class="motivo">' + MOTIVOS[e.motivo] + '</span>' : '');
  }

  function render() {
    var p = estado.pantalla;
    var tabla = $('tabla-wrap'), vacio = $('vacio'), pag = $('paginacion'), cuerpo = $('cuerpo');
    $('alerta-error').hidden = p !== 'error';
    $('filtros').hidden = p === 'error';
    $('resumen').hidden = p === 'error';
    $('demo-ruta').textContent = estado.abierto ? '/avisos/bandeja/' + estado.abierto : '/avisos/bandeja';
    pag.hidden = true; vacio.hidden = true;

    if (p === 'error') { tabla.hidden = true; return; }

    if (p === 'cargando') {
      tabla.hidden = false;
      $('resumen').textContent = 'Cargando avisos…';
      var f = '';
      for (var i = 0; i < 6; i++) {
        f += '<tr aria-hidden="true">' +
          ['', '', '', '', '', ''].map(function (_, k) { return '<td data-label="' + ['Fecha y hora', 'Usuario', 'Contacto', 'Tipo', 'Cuotas', 'Resultado'][k] + '"><span class="skel"></span></td>'; }).join('') + '</tr>';
      }
      cuerpo.innerHTML = f;
      return;
    }

    var lista = p === 'vacio' ? [] : filtrados();
    if (!lista.length) {
      tabla.hidden = true; vacio.hidden = false;
      $('resumen').textContent = p === 'vacio' ? '' : '0 avisos';
      if (p === 'vacio') {
        vacio.innerHTML = '<strong>Aún no hay avisos registrados</strong><p>Cuando confirmes el envío de un aviso desde «Cuotas por avisar», cada intento aparecerá aquí con su resultado.</p><button class="btn btn-prim" type="button" data-ir-cuotas>◂ Ir a Cuotas por avisar</button>';
      } else {
        vacio.innerHTML = '<strong>Ningún aviso coincide con los filtros</strong><p>Prueba con otro contacto, otro rango de fechas o quita el filtro de resultado.</p><button class="btn btn-sec" type="button" data-limpiar>Limpiar filtros</button>';
      }
      anuncio(p === 'vacio' ? 'No hay avisos registrados.' : 'Ningún aviso coincide con los filtros.');
      return;
    }

    var paginas = Math.ceil(lista.length / POR_PAGINA);
    if (estado.pagina > paginas) estado.pagina = paginas;
    var ini = (estado.pagina - 1) * POR_PAGINA, vis = lista.slice(ini, ini + POR_PAGINA);

    tabla.hidden = false;
    $('resumen').textContent = 'Mostrando ' + (ini + 1) + '–' + (ini + vis.length) + ' de ' + lista.length + ' ' + (lista.length === 1 ? 'aviso' : 'avisos') + ', del más reciente al más antiguo';
    cuerpo.innerHTML = vis.map(function (a) {
      var e = efectivo(a);
      return '<tr' + (estado.abierto === a.id ? ' class="activa"' : '') + '>' +
        '<td class="fecha" data-label="Fecha y hora"><button type="button" data-abrir="' + a.id + '" aria-label="Abrir aviso del ' + a.fecha + ' a ' + esc(a.contacto) + '">' + a.fecha + '</button></td>' +
        '<td class="usuario-c" data-label="Usuario">' + esc(a.usuario) + '</td>' +
        '<td class="contacto" data-label="Contacto">' + esc(a.contacto) + '</td>' +
        '<td data-label="Tipo">' + TIPOS[a.tipo] + '</td>' +
        '<td class="num" data-label="Cuotas">' + a.cuotas.length + '</td>' +
        '<td class="res" data-label="Resultado">' + badge(e) + '</td></tr>';
    }).join('');

    if (paginas > 1) {
      var h = '<button class="pag-btn" type="button" data-pag="' + (estado.pagina - 1) + '"' + (estado.pagina === 1 ? ' disabled' : '') + '>« Anterior</button><ul>';
      for (var n = 1; n <= paginas; n++) {
        h += '<li><button class="pag-btn" type="button" data-pag="' + n + '"' + (n === estado.pagina ? ' aria-current="page"' : '') + ' aria-label="Página ' + n + '">' + n + '</button></li>';
      }
      h += '</ul><button class="pag-btn" type="button" data-pag="' + (estado.pagina + 1) + '"' + (estado.pagina === paginas ? ' disabled' : '') + '>Siguiente »</button>';
      pag.innerHTML = h; pag.hidden = false;
    }
  }

  // ---------- detalle ----------
  function cuerpoCorreo(a) {
    var l = ['Estimados señores de ' + a.contacto + ':', '',
      a.tipo === 'COBRAR_VENCIDA' ? 'Les recordamos que las siguientes cuotas se encuentran vencidas:' : 'Les recordamos que las siguientes cuotas están por vencer:', ''];
    a.cuotas.forEach(function (c) { l.push('• ' + c.doc + ' cuota ' + c.n + ' — saldo ' + importe(c.saldo, c.mon) + ' — vence ' + c.vence); });
    if (a.comentario) { l.push('', a.comentario); }
    l.push('', 'Quedamos atentos a su confirmación de pago.', 'Distribuidora Andina S.A.C.');
    return l.join('\n');
  }
  function asuntoCorreo(a) {
    return (a.tipo === 'COBRAR_VENCIDA' ? 'Aviso de cuotas vencidas' : 'Aviso de cuotas por vencer') + ' — Distribuidora Andina S.A.C.';
  }

  function abrirDetalle(id, desdeHash) {
    var a = AVISOS.filter(function (x) { return x.id === id; })[0];
    var sheet = $('sheet');
    estado.abierto = id;
    if (!a) {
      $('sheet-titulo').textContent = 'Aviso no encontrado';
      $('sheet-cuerpo').innerHTML = '<div class="alert" role="alert"><span aria-hidden="true" class="alert-ic">⚠</span><div><strong>No encontramos este aviso.</strong><p>Puede que el enlace sea incorrecto. Vuelve a la bandeja para ver los avisos registrados.</p></div></div><div class="sheet-acc"><button class="btn btn-prim" type="button" data-cerrar-sheet>Volver a la bandeja</button></div>';
    } else {
      var e = efectivo(a);
      $('sheet-titulo').textContent = 'Aviso del ' + a.fecha;
      var h = '';
      if (e.res === 'NO_ENVIADO') {
        h += '<div class="alert aviso" role="status"><span aria-hidden="true" class="alert-ic">⚠</span><div><strong>' + MOTIVO_MSG[e.motivo] + '</strong><p>Motivo registrado: ' + e.motivo + '. No hay reintentos automáticos (RN-066).</p></div></div>';
      } else if (e.res === 'EN_PROCESO') {
        h += '<div class="alert neutro" role="status"><span aria-hidden="true" class="alert-ic">⏳</span><div><strong>El aviso se está enviando.</strong><p>Si no se confirma en 10 segundos, pasará a «No Enviado».</p></div></div>';
      }
      h += '<dl class="ficha">' +
        '<div class="fila"><div><dt>Resultado</dt><dd>' + badge({ res: e.res }) + '</dd></div>' +
        '<div><dt>Usuario</dt><dd>' + esc(a.usuario) + '</dd></div>' +
        '<div><dt>Tipo</dt><dd>' + TIPOS[a.tipo] + '</dd></div></div>' +
        '<div><dt>Contacto</dt><dd>' + esc(a.contacto) + '</dd></div>' +
        '<div><dt>Para</dt><dd>' + esc(a.para) + '</dd></div>' +
        '<div><dt>Copia</dt><dd>' + (a.cc.length ? a.cc.map(esc).join(', ') : 'Sin copia') + '</dd></div>' +
        '<div><dt>Responder a</dt><dd>' + esc(a.resp) + '</dd></div>' +
        '</dl>';
      h += '<section aria-labelledby="h-cuotas"><h3 id="h-cuotas" style="font-size:var(--texto-base);margin-bottom:8px">Cuotas incluidas (' + a.cuotas.length + ')</h3><ul class="cuotas-lista">' +
        a.cuotas.map(function (c) {
          return '<li><strong>' + esc(c.doc) + ' · cuota ' + c.n + '</strong><span>Saldo al envío <b>' + importe(c.saldo, c.mon) + '</b> · vence ' + c.vence + '</span></li>';
        }).join('') + '</ul></section>';
      h += '<dl class="ficha"><div><dt>Comentario</dt><dd>' + (a.comentario ? esc(a.comentario) : 'Sin comentario') + '</dd></div></dl>';
      h += '<details class="correo"><summary>Ver contenido del correo</summary><div class="correo-txt"><p class="asunto">Asunto: ' + esc(asuntoCorreo(a)) + '</p><pre>' + esc(cuerpoCorreo(a)) + '</pre></div></details>';
      h += '<p class="snap">Destinatarios y contenido tal como se guardaron en este intento (RN-138). Si el contacto o las copias cambian después, este registro no se modifica.</p>';
      if (e.res === 'NO_ENVIADO') {
        h += '<div class="sheet-acc"><button class="btn btn-prim" type="button" data-ir-cuotas>◂ Ir a Cuotas por avisar para volver a intentar</button></div>';
      }
      $('sheet-cuerpo').innerHTML = h;
    }
    if (!sheet.open) sheet.showModal();
    sheet.scrollTop = 0;
    $('demo-ruta').textContent = '/avisos/bandeja/' + id;
    anuncio('Detalle del aviso abierto.');
    if (!desdeHash) { location.hash = '/avisos/bandeja/' + id; }
    render();
  }

  function cerrarDetalle(desdeHash) {
    var sheet = $('sheet');
    estado.abierto = null;
    if (sheet.open) sheet.close();
    if (!desdeHash && /^#\/avisos\/bandeja\/.+/.test(location.hash)) location.hash = '/avisos/bandeja';
    if (disparador && document.contains(disparador)) disparador.focus();
    disparador = null;
    render();
  }

  function rutaDesdeHash() {
    var m = /^#\/avisos\/bandeja\/(.+)$/.exec(location.hash);
    if (m) { abrirDetalle(decodeURIComponent(m[1]), true); } else if ($('sheet').open || estado.abierto) { cerrarDetalle(true); }
  }

  // ---------- filtros ----------
  function validarFechas() {
    var d = $('f-desde').value.trim(), h = $('f-hasta').value.trim(), ok = true;
    function marca(id, msg) {
      var inp = $('f-' + id), er = $('e-' + id);
      er.hidden = !msg; er.textContent = msg || '';
      if (msg) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid');
      if (msg) ok = false;
    }
    marca('desde', d && !fechaValida(d) ? 'Usa el formato AAAA-MM-DD con una fecha real.' : '');
    marca('hasta', h && !fechaValida(h) ? 'Usa el formato AAAA-MM-DD con una fecha real.' : '');
    if (ok && d && h && d > h) {
      marca('desde', 'La fecha Desde no puede ser posterior a Hasta.');
    }
    return ok;
  }
  function aplicarFiltros() {
    estado.res = $('f-res').value;
    estado.contacto = $('f-contacto').value;
    if (validarFechas()) {
      estado.desde = $('f-desde').value.trim();
      estado.hasta = $('f-hasta').value.trim();
    }
    estado.pagina = 1;
    render();
  }
  function limpiarFiltros() {
    $('f-res').value = 'todos'; $('f-contacto').value = ''; $('f-desde').value = ''; $('f-hasta').value = '';
    aplicarFiltros();
  }

  // ---------- navegación simulada ----------
  function navSim(t) {
    $('dlg-texto').textContent = t;
    $('dlg-nav').showModal();
  }
  function irCuotas() {
    if ($('sheet').open) cerrarDetalle();
    navSim('Aquí se navegaría a «Cuotas por avisar» (P-007), desde donde se puede volver a intentar un aviso manualmente.');
  }

  // ---------- simulación EN_PROCESO (RN-158) ----------
  function simularProceso() {
    var id = 'av-sim' + Date.now();
    AVISOS.unshift({ id: id, fecha: ahora(), usuario: 'MARCELA QUISPE', contacto: 'AGRO SERVICIOS CUSCO', tipo: 'COBRAR_VENCIDA', res: 'EN_PROCESO',
      plazoHasta: Date.now() + PLAZO_MS, para: 'administracion@agrocusco.example', cc: [JEFE], resp: JEFE, comentario: 'REENVÍO POR PAGO PENDIENTE',
      cuotas: [q('F001-00021', 1, 4120, '2026-10-17')] });
    estado.pantalla = 'datos';
    document.querySelector('input[name="demo-estado"][value="datos"]').checked = true;
    $('f-res').value = 'todos'; $('f-contacto').value = ''; $('f-desde').value = ''; $('f-hasta').value = '';
    estado.res = 'todos'; estado.contacto = ''; estado.desde = ''; estado.hasta = ''; estado.pagina = 1;
    validarFechas();
    render();
    toast('Intento registrado como EN_PROCESO. Plazo: 10 s.');
    setTimeout(function () {
      render();
      if (estado.abierto === id) abrirDetalle(id, true);
      toast('El aviso no se envió. Puedes volver a intentar.');
    }, PLAZO_MS + 50);
  }

  // ---------- estados de pantalla ----------
  function cambiarEstado(v) {
    clearTimeout(temporizadores.carga);
    if (v === 'datos' && estado.pantalla !== 'datos') {
      estado.pantalla = 'cargando'; render();
      temporizadores.carga = setTimeout(function () { estado.pantalla = 'datos'; render(); anuncio('Avisos cargados.'); }, 900);
    } else {
      estado.pantalla = v; render();
      if (v === 'error') anuncio('Error al cargar la bandeja de avisos.');
    }
  }

  // ---------- eventos ----------
  function init() {
    var tc = document.createElement('div');
    tc.className = 'toasts'; tc.id = 'toasts'; tc.setAttribute('aria-live', 'polite');
    document.body.appendChild(tc);

    $('f-res').addEventListener('change', aplicarFiltros);
    $('f-contacto').addEventListener('input', aplicarFiltros);
    $('f-desde').addEventListener('input', aplicarFiltros);
    $('f-hasta').addEventListener('input', aplicarFiltros);
    $('filtros').addEventListener('submit', function (e) { e.preventDefault(); aplicarFiltros(); });
    $('btn-limpiar').addEventListener('click', limpiarFiltros);
    $('btn-cuotas').addEventListener('click', irCuotas);
    $('btn-reintentar').addEventListener('click', function () {
      var b = $('btn-reintentar');
      b.setAttribute('aria-disabled', 'true'); b.innerHTML = '<span class="spinner" aria-hidden="true"></span> Reintentando…';
      setTimeout(function () {
        b.removeAttribute('aria-disabled'); b.textContent = 'Reintentar';
        estado.pantalla = 'datos'; document.querySelector('input[name="demo-estado"][value="datos"]').checked = true;
        render(); toast('Bandeja cargada.');
      }, 900);
    });
    $('demo-proceso').addEventListener('click', simularProceso);

    document.querySelectorAll('input[name="demo-estado"]').forEach(function (r) {
      r.addEventListener('change', function () { cambiarEstado(r.value); });
    });
    $('demo-tema').addEventListener('change', function (e) {
      var v = e.target.value;
      if (v === 'auto') document.documentElement.removeAttribute('data-tema');
      else document.documentElement.setAttribute('data-tema', v);
    });

    // Delegación: abrir detalle, paginación, acciones de los estados vacíos
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-abrir],[data-pag],[data-limpiar],[data-ir-cuotas],[data-cerrar-sheet]');
      if (!t) return;
      if (t.hasAttribute('data-abrir')) { disparador = t; abrirDetalle(t.getAttribute('data-abrir')); }
      else if (t.hasAttribute('data-pag')) { estado.pagina = +t.getAttribute('data-pag'); render(); $('contenido').scrollIntoView(); $('tabla-wrap').scrollIntoView({ block: 'start' }); }
      else if (t.hasAttribute('data-limpiar')) limpiarFiltros();
      else if (t.hasAttribute('data-ir-cuotas')) irCuotas();
      else if (t.hasAttribute('data-cerrar-sheet')) cerrarDetalle();
    });

    // Sheet: cerrar con ✕, «Volver», clic en el fondo o Esc
    $('sheet-cerrar').addEventListener('click', function () { cerrarDetalle(); });
    $('sheet-volver').addEventListener('click', function () { cerrarDetalle(); });
    $('sheet').addEventListener('click', function (e) { if (e.target === $('sheet')) cerrarDetalle(); });
    $('sheet').addEventListener('cancel', function (e) { e.preventDefault(); cerrarDetalle(); });
    window.addEventListener('hashchange', rutaDesdeHash);

    // Navegación simulada
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); closeMenu(); navSim('Aquí se navegaría a «' + a.getAttribute('data-nav') + '».'); });
    });
    $('dlg-cerrar').addEventListener('click', function () { $('dlg-nav').close(); });

    // Menú móvil
    function closeMenu() { $('sidebar').classList.remove('abierto'); $('backdrop').hidden = true; $('btn-menu').setAttribute('aria-expanded', 'false'); }
    $('btn-menu').addEventListener('click', function () {
      var abierto = $('sidebar').classList.toggle('abierto');
      $('backdrop').hidden = !abierto; $('btn-menu').setAttribute('aria-expanded', String(abierto));
    });
    $('backdrop').addEventListener('click', closeMenu);

    render();
    rutaDesdeHash();
  }

  init();
})();
