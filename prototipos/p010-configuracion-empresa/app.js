/* P-010 Configuración de la empresa — VenceYa (prototipo, datos ficticios) */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Datos de ejemplo ---------- */
  var USUARIOS = [
    { id: 1, nombre: 'Jorge Salazar', correo: 'jefe.cobranzas@andina.example', rol: 'SUPERVISOR', activo: true },
    { id: 2, nombre: 'Marta Huamán', correo: 'marta@andina.example', rol: 'SUPERVISOR', activo: false },
    { id: 3, nombre: 'Rosa Paredes', correo: 'rosa.paredes@andina.example', rol: 'ADMINISTRADOR', activo: true },
    { id: 4, nombre: 'Luis Camacho', correo: 'luis.camacho@andina.example', rol: 'SUPERVISOR', activo: true },
    { id: 5, nombre: 'Diana Flores', correo: 'diana.flores@andina.example', rol: 'ADMINISTRADOR', activo: true },
    { id: 6, nombre: 'Pedro Vargas', correo: 'pedro.vargas@andina.example', rol: 'OPERADOR', activo: true },
    { id: 7, nombre: 'Ana Soto', correo: 'ana.soto@andina.example', rol: 'SUPERVISOR', activo: true },
    { id: 8, nombre: 'Carlos Ñahui', correo: 'carlos.nahui@andina.example', rol: 'SUPERVISOR', activo: false }
  ];
  var ROL_TXT = { SUPERVISOR: 'SUPERV.', ADMINISTRADOR: 'ADMIN.', OPERADOR: 'OPERADOR' };
  var LISTA_TXT = { cobrar: 'avisos por cobrar', pagar: 'avisos por pagar' };
  var ACTOR = 'Rosa Paredes';

  var datos = {};
  function datosIniciales() {
    return { correo: 'admin@andina.example', moneda: 'PEN', listas: { cobrar: [1, 2], pagar: [] } };
  }
  function reiniciar() {
    datos = datosIniciales();
    $('#auditoria').innerHTML = '<li class="ayuda">Aún no hay cambios en esta sesión.</li>';
  }
  reiniciar();

  var ui = { estado: 'datos', rol: 'ADMINISTRADOR' };
  var combos = { cobrar: { abierto: false, activo: 0 }, pagar: { abierto: false, activo: 0 } };

  function usuario(id) { return USUARIOS.filter(function (u) { return u.id === id; })[0]; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function elegible(u) { return u.activo && (u.rol === 'SUPERVISOR' || u.rol === 'ADMINISTRADOR'); }
  function falla() { return $('#demo-falla').checked; }
  function anuncio(t) { var a = $('#anuncio'); a.textContent = ''; setTimeout(function () { a.textContent = t; }, 30); }

  function toast(texto, err) {
    var t = document.createElement('div');
    t.className = 'toast' + (err ? ' err' : '');
    t.textContent = texto;
    $('#toasts').appendChild(t);
    setTimeout(function () { t.remove(); }, 5000);
  }

  function auditar(texto) {
    var ul = $('#auditoria');
    if (ul.querySelector('.ayuda')) ul.innerHTML = '';
    var li = document.createElement('li');
    li.innerHTML = '<strong>' + new Date().toISOString() + '</strong> · ' + esc(ACTOR) + ' · ' + texto;
    ul.insertBefore(li, ul.firstChild);
  }

  function botonCargando(btn, cargando, texto) {
    if (cargando) {
      btn.dataset.txt = btn.textContent;
      btn.setAttribute('aria-disabled', 'true');
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> ' + (texto || 'Guardando…');
    } else {
      btn.removeAttribute('aria-disabled');
      btn.textContent = btn.dataset.txt || 'Guardar';
    }
  }
  function ocupado(btn) { return btn.getAttribute('aria-disabled') === 'true'; }

  /* ---------- Estados de pantalla ---------- */
  var skeleton = document.createElement('div');
  skeleton.className = 'config';
  skeleton.setAttribute('aria-busy', 'true');
  skeleton.innerHTML = [1, 2, 3].map(function () {
    return '<div class="card"><span class="skel" style="width:40%"></span><span class="skel" style="width:70%"></span><span class="skel alto" style="width:60%"></span></div>';
  }).join('');
  $('#contenido-config').after(skeleton);
  skeleton.hidden = true;

  function aplicarEstado() {
    var admin = ui.rol === 'ADMINISTRADOR';
    $('#usuario-rol').textContent = { ADMINISTRADOR: 'Administrador', SUPERVISOR: 'Supervisor', OPERADOR: 'Operador' }[ui.rol];
    $('#alerta-permiso').hidden = admin;
    $('#alerta-error').hidden = !(admin && ui.estado === 'error');
    skeleton.hidden = !(admin && ui.estado === 'cargando');
    $('#contenido-config').hidden = !(admin && (ui.estado === 'datos' || ui.estado === 'vacio'));
    if (!admin) anuncio('Sin permiso para ver la configuración de la empresa.');
    else if (ui.estado === 'cargando') anuncio('Cargando configuración…');
    else if (ui.estado === 'error') anuncio('No se pudo cargar la configuración de la empresa.');
  }

  /* ---------- Render ---------- */
  function renderCampos() {
    var inp = $('#f-correo');
    inp.value = datos.correo;
    limpiarErrorCorreo();
    $$('input[name="moneda"]').forEach(function (r) { r.checked = r.value === datos.moneda; });
  }

  function renderLista(clave) {
    var ids = datos.listas[clave];
    var ul = $('#lista-' + clave);
    ul.innerHTML = ids.map(function (id) {
      var u = usuario(id);
      var inactivo = !elegible(u);
      return '<li class="usuario-item' + (inactivo ? ' inactivo' : '') + '" data-id="' + id + '">' +
        '<div class="info">' +
          '<span class="correo">' + esc(u.correo) + '</span>' +
          '<span class="meta"><span class="nombre">' + esc(u.nombre) + '</span>' +
          '<span class="badge ' + (u.rol === 'ADMINISTRADOR' ? 'b-adm' : 'b-sup') + '">' + ROL_TXT[u.rol] + '</span>' +
          (inactivo ? '<span class="badge b-aviso"><span aria-hidden="true">⚠</span>&nbsp;Inactivo: no recibe copias</span>' : '') +
          '</span>' +
        '</div>' +
        '<button type="button" class="btn btn-quitar" data-quitar="' + clave + ':' + id + '" aria-label="Quitar a ' + esc(u.nombre) + ' de la lista de ' + LISTA_TXT[clave] + '">Quitar</button>' +
        '</li>';
    }).join('');
    $('#vacio-' + clave).hidden = ids.length > 0;
    ul.hidden = ids.length === 0;
    renderCombo(clave);
  }

  function opciones(clave) {
    return USUARIOS.filter(function (u) { return elegible(u) && datos.listas[clave].indexOf(u.id) === -1; });
  }

  function renderCombo(clave) {
    var c = combos[clave];
    var cont = $('[data-combo="' + clave + '"]');
    var ops = opciones(clave);
    if (c.activo >= ops.length) c.activo = Math.max(0, ops.length - 1);
    var lid = 'lb-' + clave;
    var html = '<button type="button" class="btn btn-sec combo-btn" role="combobox" aria-haspopup="listbox" aria-expanded="' + c.abierto + '" aria-controls="' + lid + '"' +
      (c.abierto && ops.length ? ' aria-activedescendant="op-' + clave + '-' + ops[c.activo].id + '"' : '') +
      ' aria-label="Agregar usuario a la lista de ' + LISTA_TXT[clave] + '"><span>+ Agregar usuario</span><span aria-hidden="true">▾</span></button>';
    if (c.abierto) {
      html += '<ul class="combo-lista" id="' + lid + '" role="listbox" aria-label="Usuarios disponibles">';
      if (!ops.length) html += '<li class="combo-nada" role="presentation">No hay más supervisores o administradores activos para agregar.</li>';
      ops.forEach(function (u, i) {
        html += '<li class="combo-op" role="option" id="op-' + clave + '-' + u.id + '" data-id="' + u.id + '" aria-selected="' + (i === c.activo) + '">' +
          '<span class="op-correo">' + esc(u.correo) + '</span><span class="op-meta">' + esc(u.nombre) + ' · ' + ROL_TXT[u.rol] + '</span></li>';
      });
      html += '</ul>';
    }
    cont.innerHTML = html;
  }

  function renderTodo() {
    renderCampos();
    renderLista('cobrar');
    renderLista('pagar');
  }

  /* ---------- Correo administrativo (RN-165) ---------- */
  var reCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function limpiarErrorCorreo() {
    var e = $('#f-correo-error');
    e.hidden = true; e.textContent = '';
    $('#f-correo').removeAttribute('aria-invalid');
  }
  function errorCorreo(msg) {
    var e = $('#f-correo-error');
    e.textContent = msg; e.hidden = false;
    $('#f-correo').setAttribute('aria-invalid', 'true');
  }

  $('#form-correo').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var btn = $('#btn-correo');
    if (ocupado(btn)) return;
    var v = $('#f-correo').value.trim();
    limpiarErrorCorreo();
    if (!v) { errorCorreo('El correo administrativo es obligatorio.'); $('#f-correo').focus(); return; }
    if (!reCorreo.test(v)) { errorCorreo('Ingresa un correo válido, por ejemplo: nombre@empresa.com.'); $('#f-correo').focus(); return; }
    v = v.toLowerCase();
    botonCargando(btn, true);
    setTimeout(function () {
      botonCargando(btn, false);
      if (falla()) { errorCorreo('No se pudo guardar el correo administrativo. Inténtalo de nuevo. Código: CFG-500.'); return; }
      if (v === datos.correo) { $('#f-correo').value = v; toast('El correo administrativo ya era ese; no hubo cambios.'); return; }
      auditar('Correo administrativo: <code>' + esc(datos.correo) + '</code> → <code>' + esc(v) + '</code>');
      datos.correo = v;
      $('#f-correo').value = v;
      toast('Correo administrativo guardado. Los avisos nuevos usarán ' + v + '.');
      anuncio('Correo administrativo guardado.');
    }, 900);
  });
  $('#f-correo').addEventListener('input', limpiarErrorCorreo);

  /* ---------- Moneda (RN-106) ---------- */
  var errMoneda = document.createElement('span');
  errMoneda.className = 'error'; errMoneda.setAttribute('role', 'alert'); errMoneda.hidden = true;
  $('#form-moneda').after(errMoneda);

  $('#form-moneda').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var btn = $('#btn-moneda');
    if (ocupado(btn)) return;
    var nueva = $('input[name="moneda"]:checked').value;
    errMoneda.hidden = true;
    botonCargando(btn, true);
    setTimeout(function () {
      botonCargando(btn, false);
      if (falla()) { errMoneda.textContent = 'No se pudo guardar la moneda por defecto. Inténtalo de nuevo. Código: CFG-500.'; errMoneda.hidden = false; return; }
      if (nueva === datos.moneda) { toast('La moneda por defecto ya era esa; no hubo cambios.'); return; }
      auditar('Moneda por defecto: ' + (datos.moneda === 'PEN' ? 'S/ Soles' : 'US$ Dólares') + ' → ' + (nueva === 'PEN' ? 'S/ Soles' : 'US$ Dólares'));
      datos.moneda = nueva;
      toast('Moneda por defecto guardada: ' + (nueva === 'PEN' ? 'S/ Soles' : 'US$ Dólares') + '. Los usuarios con moneda propia no cambian.');
      anuncio('Moneda por defecto guardada.');
    }, 900);
  });

  /* ---------- Listas de copias (RN-134, RN-135, RN-042, RN-176) ---------- */
  function errorLista(clave, msg) {
    var e = $('#error-' + clave);
    e.textContent = msg || ''; e.hidden = !msg;
  }

  function cerrarCombo(clave, devolverFoco) {
    combos[clave].abierto = false;
    renderCombo(clave);
    if (devolverFoco) $('[data-combo="' + clave + '"] .combo-btn').focus();
  }

  function agregar(clave, id) {
    var u = usuario(id);
    cerrarCombo(clave, true);
    errorLista(clave, '');
    if (datos.listas[clave].indexOf(id) !== -1) { errorLista(clave, 'Ese usuario ya está en la lista.'); return; }
    if (!elegible(u)) { errorLista(clave, 'Solo se pueden agregar supervisores o administradores activos.'); return; }
    var btn = $('[data-combo="' + clave + '"] .combo-btn');
    btn.setAttribute('aria-disabled', 'true');
    setTimeout(function () {
      btn.removeAttribute('aria-disabled');
      if (falla()) { errorLista(clave, 'No se pudo agregar al usuario. Inténtalo de nuevo. Código: CFG-500.'); return; }
      datos.listas[clave].push(id);
      auditar('Agregado <code>' + esc(u.correo) + '</code> a «Copias de ' + LISTA_TXT[clave] + '»');
      renderLista(clave);
      var li = $('#lista-' + clave + ' [data-id="' + id + '"]');
      if (li) li.classList.add('entra');
      toast(u.nombre + ' ahora recibe copia de los ' + LISTA_TXT[clave] + '.');
      anuncio(u.nombre + ' agregado a la lista de ' + LISTA_TXT[clave] + '.');
      $('[data-combo="' + clave + '"] .combo-btn').focus();
    }, 500);
  }

  function quitar(clave, id, btn) {
    if (ocupado(btn)) return;
    var u = usuario(id);
    errorLista(clave, '');
    botonCargando(btn, true, 'Quitando…');
    setTimeout(function () {
      if (falla()) { botonCargando(btn, false); errorLista(clave, 'No se pudo quitar al usuario. Inténtalo de nuevo. Código: CFG-500.'); return; }
      var li = btn.closest('li');
      li.classList.add('sale');
      setTimeout(function () {
        datos.listas[clave] = datos.listas[clave].filter(function (x) { return x !== id; });
        auditar('Quitado <code>' + esc(u.correo) + '</code> de «Copias de ' + LISTA_TXT[clave] + '»');
        renderLista(clave);
        toast(u.nombre + ' ya no recibe copias de los ' + LISTA_TXT[clave] + '.');
        anuncio(u.nombre + ' quitado de la lista de ' + LISTA_TXT[clave] + '.');
        $('[data-combo="' + clave + '"] .combo-btn').focus();
      }, 250);
    }, 500);
  }

  document.addEventListener('click', function (ev) {
    var q = ev.target.closest('[data-quitar]');
    if (q) { var p = q.dataset.quitar.split(':'); quitar(p[0], Number(p[1]), q); return; }

    var cb = ev.target.closest('.combo-btn');
    if (cb) {
      if (ocupado(cb)) return;
      var clave = cb.closest('[data-combo]').dataset.combo;
      errorLista(clave, '');
      combos[clave].abierto = !combos[clave].abierto;
      combos[clave].activo = 0;
      renderCombo(clave);
      if (combos[clave].abierto) $('[data-combo="' + clave + '"] .combo-btn').focus();
      return;
    }
    var op = ev.target.closest('.combo-op');
    if (op) { agregar(op.closest('[data-combo]').dataset.combo, Number(op.dataset.id)); return; }

    ['cobrar', 'pagar'].forEach(function (k) { if (combos[k].abierto) cerrarCombo(k, false); });
  });

  document.addEventListener('keydown', function (ev) {
    var cb = ev.target.closest && ev.target.closest('.combo-btn');
    if (!cb) return;
    var clave = cb.closest('[data-combo]').dataset.combo;
    var c = combos[clave], ops = opciones(clave);
    if (!c.abierto) {
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); c.abierto = true; c.activo = 0; renderCombo(clave); $('[data-combo="' + clave + '"] .combo-btn').focus(); }
      return;
    }
    if (ev.key === 'ArrowDown') { ev.preventDefault(); c.activo = Math.min(ops.length - 1, c.activo + 1); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); c.activo = Math.max(0, c.activo - 1); }
    else if (ev.key === 'Home') { ev.preventDefault(); c.activo = 0; }
    else if (ev.key === 'End') { ev.preventDefault(); c.activo = Math.max(0, ops.length - 1); }
    else if (ev.key === 'Enter' && ops.length) { ev.preventDefault(); agregar(clave, ops[c.activo].id); return; }
    else if (ev.key === 'Escape') { ev.preventDefault(); cerrarCombo(clave, true); return; }
    else if (ev.key === 'Tab') { cerrarCombo(clave, false); return; }
    else return;
    renderCombo(clave);
    $('[data-combo="' + clave + '"] .combo-btn').focus();
    var act = $('#op-' + clave + '-' + (ops[c.activo] || {}).id);
    if (act && act.scrollIntoView) act.scrollIntoView({ block: 'nearest' });
  });

  /* ---------- Controles del prototipo ---------- */
  $$('input[name="demo-estado"]').forEach(function (r) {
    r.addEventListener('change', function () {
      ui.estado = r.value;
      if (r.value === 'vacio') { datos.listas = { cobrar: [], pagar: [] }; renderTodo(); }
      else if (r.value === 'datos') { datos.listas = { cobrar: [1, 2], pagar: [] }; renderTodo(); }
      aplicarEstado();
    });
  });
  $('#demo-rol').addEventListener('change', function (e) { ui.rol = e.target.value; aplicarEstado(); });
  $('#demo-tema').addEventListener('change', function (e) {
    var t = e.target.value;
    if (t === 'auto') document.documentElement.removeAttribute('data-tema');
    else document.documentElement.setAttribute('data-tema', t);
  });
  $('#demo-reset').addEventListener('click', function () {
    reiniciar(); ui.estado = 'datos';
    $('input[name="demo-estado"][value="datos"]').checked = true;
    errorLista('cobrar', ''); errorLista('pagar', ''); errMoneda.hidden = true;
    renderTodo(); aplicarEstado();
    toast('Datos de ejemplo restablecidos.');
  });
  $('#btn-reintentar').addEventListener('click', function () {
    var b = $('#btn-reintentar');
    botonCargando(b, true, 'Reintentando…');
    setTimeout(function () {
      botonCargando(b, false);
      ui.estado = 'datos';
      $('input[name="demo-estado"][value="datos"]').checked = true;
      datos.listas = { cobrar: [1, 2], pagar: [] };
      renderTodo(); aplicarEstado();
      toast('Configuración cargada.');
    }, 900);
  });

  /* ---------- Navegación simulada y menú móvil ---------- */
  var sidebar = $('#sidebar'), backdrop = $('#backdrop'), btnMenu = $('#btn-menu');
  function menu(abrir) {
    sidebar.classList.toggle('abierto', abrir);
    backdrop.hidden = !abrir;
    btnMenu.setAttribute('aria-expanded', String(abrir));
  }
  btnMenu.addEventListener('click', function () { menu(!sidebar.classList.contains('abierto')); });
  backdrop.addEventListener('click', function () { menu(false); });
  $$('[data-nav]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); menu(false);
      $('#dlg-texto').textContent = 'Aquí se abriría «' + a.dataset.nav + '».';
      $('#dlg-nav').showModal();
    });
  });
  $('#dlg-cerrar').addEventListener('click', function () { $('#dlg-nav').close(); });

  renderTodo();
  aplicarEstado();
})();
