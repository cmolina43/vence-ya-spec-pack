/* P-004 Comprobantes — prototipo VenceYa (datos ficticios, sin backend) */
(function () {
  'use strict';

  var POR_PAGINA = 8;
  var SIMBOLO = { PEN: 'S/', USD: 'US$' };

  // estado: PEND = Pendiente, VENC = Con vencidas, CANC = Cancelado, ANUL = ANULADO
  var DATOS = [
    { num: 'F001-00045', sent: 'Cobrar', contacto: 'DISTRIBUIDORA LIMA', emision: '2026-11-04', mon: 'USD', total: 3000, saldo: 2000, cuotas: 3, estado: 'PEND' },
    { num: 'E001-00012', sent: 'Pagar', contacto: 'TEXTILES SUR', emision: '2026-10-10', mon: 'PEN', total: 600, saldo: 300, cuotas: 2, estado: 'VENC' },
    { num: 'F001-00050', sent: 'Cobrar', contacto: 'FERRETERÍA NORTE', emision: '2026-10-01', mon: 'PEN', total: 500, saldo: null, cuotas: 1, estado: 'ANUL' },
    { num: 'F001-00044', sent: 'Cobrar', contacto: 'PAPELERÍA EL ESTUDIANTE', emision: '2026-11-02', mon: 'PEN', total: 1850, saldo: 1850, cuotas: 1, estado: 'PEND' },
    { num: 'F001-00043', sent: 'Cobrar', contacto: 'BODEGA SAN MARTÍN', emision: '2026-10-28', mon: 'PEN', total: 4200, saldo: 2800, cuotas: 3, estado: 'PEND' },
    { num: 'B002-00231', sent: 'Pagar', contacto: 'IMPORTADORA ANDINA', emision: '2026-10-22', mon: 'USD', total: 5400, saldo: 3600, cuotas: 3, estado: 'PEND' },
    { num: 'F001-00041', sent: 'Cobrar', contacto: 'DISTRIBUIDORA LIMA', emision: '2026-10-15', mon: 'USD', total: 1200, saldo: 0, cuotas: 1, estado: 'CANC' },
    { num: 'F001-00040', sent: 'Cobrar', contacto: 'CONSTRUCTORA PACÍFICO', emision: '2026-09-30', mon: 'PEN', total: 7800, saldo: 5200, cuotas: 4, estado: 'VENC' },
    { num: 'E001-00011', sent: 'Pagar', contacto: 'LOGÍSTICA RÁPIDA', emision: '2026-09-18', mon: 'PEN', total: 950, saldo: 950, cuotas: 1, estado: 'VENC' },
    { num: 'F001-00038', sent: 'Cobrar', contacto: 'FERRETERÍA NORTE', emision: '2026-09-12', mon: 'PEN', total: 2300, saldo: 0, cuotas: 2, estado: 'CANC' },
    { num: 'F001-00037', sent: 'Cobrar', contacto: 'MINIMARKET LOS OLIVOS', emision: '2026-09-05', mon: 'PEN', total: 640, saldo: null, cuotas: 1, estado: 'ANUL' },
    { num: 'F7-0098', sent: 'Pagar', contacto: 'TEXTILES SUR', emision: '2026-08-29', mon: 'PEN', total: 1500, saldo: 0, cuotas: 1, estado: 'CANC' },
    { num: 'F001-00035', sent: 'Cobrar', contacto: 'EXPORTADORA DEL PACÍFICO', emision: '2026-08-20', mon: 'USD', total: 8900, saldo: 4450, cuotas: 2, estado: 'VENC' },
    { num: 'E001-00009', sent: 'Pagar', contacto: 'SERVICIOS GENERALES RÍOS', emision: '2026-08-14', mon: 'PEN', total: 380, saldo: null, cuotas: 1, estado: 'ANUL' },
    { num: 'F001-00033', sent: 'Cobrar', contacto: 'BODEGA SAN MARTÍN', emision: '2026-08-02', mon: 'PEN', total: 1100, saldo: 0, cuotas: 1, estado: 'CANC' },
    { num: 'F001-00031', sent: 'Cobrar', contacto: 'PAPELERÍA EL ESTUDIANTE', emision: '2026-07-19', mon: 'PEN', total: 2750, saldo: 0, cuotas: 3, estado: 'CANC' }
  ];

  var ESTADOS = {
    PEND: { texto: 'Pendiente', clase: 'b-pend' },
    VENC: { texto: 'Con vencidas', clase: 'b-venc' },
    CANC: { texto: 'Cancelado', clase: 'b-canc' },
    ANUL: { texto: 'ANULADO', clase: 'b-anul' }
  };

  var $ = function (id) { return document.getElementById(id); };
  var estado = { pantalla: 'datos', sentido: 'todos', buscar: '', moneda: 'todas', anulados: false, pagina: 1 };
  var timer = null;

  function dinero(mon, n) {
    return SIMBOLO[mon] + ' ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function norm(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }
  function anunciar(t) { $('anuncio').textContent = ''; setTimeout(function () { $('anuncio').textContent = t; }, 50); }
  function toast(t) {
    var el = document.createElement('div');
    el.className = 'toast'; el.textContent = t;
    $('toasts') ? $('toasts').appendChild(el) : null;
    setTimeout(function () { el.remove(); }, 5000);
  }

  function filtrados() {
    var q = norm(estado.buscar.trim());
    return DATOS.filter(function (c) {
      if (c.estado === 'ANUL' && !estado.anulados) return false;
      if (estado.sentido !== 'todos' && c.sent !== estado.sentido) return false;
      if (estado.moneda !== 'todas' && c.mon !== estado.moneda) return false;
      if (q && norm(c.num).indexOf(q) < 0 && norm(c.contacto).indexOf(q) < 0) return false;
      return true;
    }).sort(function (a, b) { return a.emision < b.emision ? 1 : a.emision > b.emision ? -1 : 0; });
  }

  function fila(c) {
    var e = ESTADOS[c.estado];
    var anul = c.estado === 'ANUL';
    var saldo = anul ? '—' : dinero(c.mon, c.saldo);
    var saldoCls = c.estado === 'VENC' ? ' class="num saldo-venc"' : ' class="num"';
    var modal = anul ? '' : '<small>' + (c.cuotas > 1 ? c.cuotas + ' cuotas' : 'Pago único') + '</small>';
    return '<tr' + (anul ? ' class="anulado"' : '') + '>' +
      '<td class="numero" data-label="Número" data-sentido="' + c.sent + '"><a href="#" data-num="' + esc(c.num) + '" aria-label="Abrir detalle del comprobante ' + esc(c.num) + '">' + esc(c.num) + ' ▸</a></td>' +
      '<td class="sentido-celda" data-label="Sentido"><span class="sentido">' + c.sent + '</span></td>' +
      '<td class="contacto" data-label="Contacto">' + esc(c.contacto) + '</td>' +
      '<td class="fecha" data-label="Emisión">' + c.emision + '</td>' +
      '<td class="num total" data-label="Total"><span>' + dinero(c.mon, c.total) + '</span>' + modal + '</td>' +
      '<td data-label="Saldo"' + saldoCls + '>' + saldo + '</td>' +
      '<td data-label="Estado"><span class="badge ' + e.clase + '">' + e.texto + '</span></td>' +
      '</tr>';
  }

  function esqueletos() {
    var h = '';
    for (var i = 0; i < 6; i++) {
      h += '<tr>' + new Array(8).join('<td><span class="skel"></span></td>') + '</tr>';
    }
    return h;
  }

  function render() {
    var s = estado.pantalla;
    var vacio = $('vacio'), wrap = $('tabla-wrap'), pag = $('paginacion'), res = $('resumen');
    $('alerta-error').hidden = s !== 'error';
    $('filtros').style.display = (s === 'vacio') ? 'none' : '';
    $('tabs').style.display = (s === 'vacio') ? 'none' : '';
    vacio.hidden = true; pag.hidden = true; wrap.hidden = false; res.textContent = '';
    $('tabla').setAttribute('aria-busy', s === 'cargando' ? 'true' : 'false');

    if (s === 'cargando') {
      $('cuerpo').innerHTML = esqueletos();
      res.innerHTML = '<span class="cuenta"><span class="spinner" aria-hidden="true"></span> Cargando comprobantes…</span>';
      return;
    }
    if (s === 'error') {
      wrap.hidden = true;
      return;
    }
    if (s === 'vacio') {
      wrap.hidden = true;
      vacio.hidden = false;
      vacio.innerHTML = '<strong>Aún no hay comprobantes registrados</strong>' +
        '<p>Registra tu primera factura, boleta o recibo para que VenceYa controle sus cuotas y te avise antes de que venzan.</p>' +
        '<button class="btn btn-prim" type="button" data-accion="nuevo"><span aria-hidden="true">+</span> Registrar comprobante</button>';
      return;
    }

    var lista = filtrados();
    var paginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
    if (estado.pagina > paginas) estado.pagina = paginas;
    var ini = (estado.pagina - 1) * POR_PAGINA;
    var vista = lista.slice(ini, ini + POR_PAGINA);

    // Resumen: saldo vigente por moneda, sin sumar S/ y US$ y sin anulados (RN-047, RN-049)
    var tot = { PEN: 0, USD: 0 }, hay = { PEN: false, USD: false };
    lista.forEach(function (c) { if (c.estado !== 'ANUL') { tot[c.mon] += c.saldo; hay[c.mon] = true; } });
    var partes = ['<span class="cuenta">' + lista.length + (lista.length === 1 ? ' comprobante' : ' comprobantes') + '</span>'];
    ['PEN', 'USD'].forEach(function (m) {
      if (hay[m]) partes.push('<span class="tot">Saldo vigente en ' + SIMBOLO[m] + ': <strong>' + dinero(m, tot[m]) + '</strong></span>');
    });
    res.innerHTML = partes.join('');

    if (!lista.length) {
      wrap.hidden = true;
      vacio.hidden = false;
      vacio.innerHTML = '<strong>No hay comprobantes que coincidan</strong>' +
        '<p>Prueba con otro número o contacto, cambia la moneda o la pestaña' +
        (estado.anulados ? '' : ', o activa «Incluir comprobantes anulados»') + '.</p>' +
        '<button class="btn btn-sec" type="button" data-accion="limpiar">Limpiar filtros</button>';
      anunciar('Sin resultados.');
      return;
    }

    $('cuerpo').innerHTML = vista.map(fila).join('');

    if (paginas > 1) {
      pag.hidden = false;
      var h = '<button class="pag-btn" data-pag="' + (estado.pagina - 1) + '"' + (estado.pagina === 1 ? ' disabled' : '') + '>« Anterior</button><ul>';
      for (var p = 1; p <= paginas; p++) {
        h += '<li><button class="pag-btn" data-pag="' + p + '"' + (p === estado.pagina ? ' aria-current="page"' : '') + ' aria-label="Página ' + p + '">' + p + '</button></li>';
      }
      h += '</ul><button class="pag-btn" data-pag="' + (estado.pagina + 1) + '"' + (estado.pagina === paginas ? ' disabled' : '') + '>Siguiente »</button>';
      pag.innerHTML = h;
    }
  }

  function navegar(texto) {
    $('dlg-texto').textContent = texto;
    $('dlg-nav').showModal();
  }

  function setSentido(valor) {
    estado.sentido = valor; estado.pagina = 1;
    document.querySelectorAll('.tab').forEach(function (t) {
      var sel = t.getAttribute('data-sentido') === valor;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      if (sel) $('panel').setAttribute('aria-labelledby', t.id);
    });
    render();
  }

  function limpiar() {
    estado.buscar = ''; estado.moneda = 'todas'; estado.anulados = false; estado.pagina = 1;
    $('f-buscar').value = ''; $('f-moneda').value = 'todas'; $('f-anulados').checked = false;
    setSentido('todos');
  }

  function init() {
    // Pestañas (flechas izq/der)
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { setSentido(t.getAttribute('data-sentido')); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); setSentido(n.getAttribute('data-sentido'));
      });
    });

    $('f-buscar').addEventListener('input', function (e) {
      clearTimeout(timer);
      timer = setTimeout(function () { estado.buscar = e.target.value; estado.pagina = 1; render(); }, 200);
    });
    $('f-moneda').addEventListener('change', function (e) { estado.moneda = e.target.value; estado.pagina = 1; render(); });
    $('f-anulados').addEventListener('change', function (e) {
      estado.anulados = e.target.checked; estado.pagina = 1; render();
      anunciar(e.target.checked ? 'Se incluyen comprobantes anulados.' : 'Se ocultan comprobantes anulados.');
    });

    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-num]');
      if (a) { e.preventDefault(); navegar('Se abriría el detalle P-006 del comprobante ' + a.getAttribute('data-num') + '.'); return; }
      var p = e.target.closest('[data-pag]');
      if (p && !p.disabled) { estado.pagina = +p.getAttribute('data-pag'); render(); $('tabla-wrap').scrollIntoView({ block: 'start' }); return; }
      var ac = e.target.closest('[data-accion]');
      if (ac) {
        if (ac.getAttribute('data-accion') === 'limpiar') limpiar();
        else navegar('Se abriría el formulario P-005 Registrar comprobante.');
        return;
      }
      var nav = e.target.closest('[data-nav]');
      if (nav) { e.preventDefault(); cerrarMenu(); navegar('Se navegaría a ' + nav.getAttribute('data-nav') + '.'); }
    });

    $('btn-nuevo').addEventListener('click', function () { navegar('Se abriría el formulario P-005 Registrar comprobante.'); });
    $('btn-reintentar').addEventListener('click', function () {
      document.querySelector('input[name="demo-estado"][value="cargando"]').checked = true;
      estado.pantalla = 'cargando'; render();
      setTimeout(function () {
        document.querySelector('input[name="demo-estado"][value="datos"]').checked = true;
        estado.pantalla = 'datos'; render(); toast('Comprobantes cargados.');
      }, 1200);
    });
    $('dlg-cerrar').addEventListener('click', function () { $('dlg-nav').close(); });

    // Menú móvil
    function cerrarMenu() {
      $('sidebar').classList.remove('abierto'); $('backdrop').hidden = true; $('btn-menu').setAttribute('aria-expanded', 'false');
    }
    window.cerrarMenu = cerrarMenu;
    $('btn-menu').addEventListener('click', function () {
      var ab = $('sidebar').classList.toggle('abierto');
      $('backdrop').hidden = !ab; $('btn-menu').setAttribute('aria-expanded', ab ? 'true' : 'false');
    });
    $('backdrop').addEventListener('click', cerrarMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarMenu(); });

    // Controles del prototipo
    document.querySelectorAll('input[name="demo-estado"]').forEach(function (r) {
      r.addEventListener('change', function () { estado.pantalla = r.value; render(); });
    });
    $('demo-tema').addEventListener('change', function (e) {
      var v = e.target.value;
      if (v === 'auto') document.documentElement.removeAttribute('data-tema');
      else document.documentElement.setAttribute('data-tema', v);
    });

    render();
  }

  function cerrarMenu() { window.cerrarMenu && window.cerrarMenu(); }

  // Contenedor de toasts (no existe en el HTML base)
  var tc = document.createElement('div');
  tc.className = 'toasts'; tc.id = 'toasts'; tc.setAttribute('aria-live', 'polite');
  document.body.appendChild(tc);

  init();
})();
