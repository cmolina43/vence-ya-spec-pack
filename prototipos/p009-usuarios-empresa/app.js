/* P-009 Usuarios de la empresa — prototipo VenceYa (datos ficticios, sin backend) */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var AHORA = new Date(2026, 10, 11, 9, 30); // "hoy" del prototipo
  var ROLES = ['OPERADOR', 'SUPERVISOR', 'ADMINISTRADOR'];
  var ROL_DESC = {
    OPERADOR: 'Registra contactos, comprobantes, pagos y avisos; no anula.',
    SUPERVISOR: 'Además anula pagos y comprobantes.',
    ADMINISTRADOR: 'Además administra usuarios y la configuración de la empresa.'
  };
  var ROL_ETQ = { ADMINISTRADOR: 'Administrador', SUPERVISOR: 'Supervisor', OPERADOR: 'Operador' };
  var YO = 'ana@andina.example';
  // Correos de otras empresas (RN-097: el correo es único global)
  var OTRAS_EMPRESAS = ['contabilidad@textiles-norte.example', 'm.salas@logiexpress.example'];

  var usuarios, auditoria, seq, estadoPantalla = 'datos', sesionRol = 'ADMINISTRADOR';
  var ocupado = false, disparador = null, menuAbierto = null, nuevoId = null;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function en72h() { return fmt(new Date(AHORA.getTime() + 72 * 3600 * 1000)); }
  function iso() { return AHORA.toISOString().slice(0, 19) + 'Z'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function datosIniciales() {
    seq = 10;
    auditoria = [];
    usuarios = [
      { id: 1, correo: 'ana@andina.example', rol: 'ADMINISTRADOR', estado: 'ACTIVO', tuvoClave: true },
      { id: 2, correo: 'luis@andina.example', rol: 'OPERADOR', estado: 'INVITADO', vence: '2026-11-12 10:00', envioFallido: true, tuvoClave: false },
      { id: 3, correo: 'marta@andina.example', rol: 'SUPERVISOR', estado: 'DESACTIVADO', tuvoClave: true },
      { id: 4, correo: 'carlos.rojas@andina.example', rol: 'ADMINISTRADOR', estado: 'ACTIVO', tuvoClave: true },
      { id: 5, correo: 'rosa.paredes@andina.example', rol: 'OPERADOR', estado: 'ACTIVO', tuvoClave: true, copias: true },
      { id: 6, correo: 'jorge.salazar@andina.example', rol: 'SUPERVISOR', estado: 'ACTIVO', tuvoClave: true },
      { id: 7, correo: 'lucia.mendoza@andina.example', rol: 'OPERADOR', estado: 'INVITADO', vence: '2026-11-05 18:00', tuvoClave: false },
      { id: 8, correo: 'pedro.vega@andina.example', rol: 'OPERADOR', estado: 'DESACTIVADO', tuvoClave: false }
    ];
  }

  function porId(id) { return usuarios.filter(function (u) { return u.id === id; })[0]; }
  function adminsActivos() { return usuarios.filter(function (u) { return u.rol === 'ADMINISTRADOR' && u.estado === 'ACTIVO'; }).length; }
  function esUltimoAdmin(u) { return u.rol === 'ADMINISTRADOR' && u.estado === 'ACTIVO' && adminsActivos() === 1; }
  function vencido(u) { return u.vence && u.vence < fmt(AHORA); }

  /* ---------- Utilidades de interfaz ---------- */
  function anunciar(t) { $('anuncio').textContent = ''; setTimeout(function () { $('anuncio').textContent = t; }, 50); }
  function toast(t) {
    var el = document.createElement('div');
    el.className = 'toast'; el.textContent = t;
    $('toasts').appendChild(el);
    setTimeout(function () { el.remove(); }, 5000);
  }
  function mostrarError(id, msg) { var e = $(id); e.textContent = msg; e.hidden = false; }
  function limpiarError(id) { var e = $(id); e.textContent = ''; e.hidden = true; }
  function simular(ms, fn) { setTimeout(fn, ms); }
  function enfocarDisparador() { if (disparador && document.body.contains(disparador)) disparador.focus(); else $('contenido').focus(); }
  function bloquear(btn, on, texto, orig) {
    if (on) { btn.setAttribute('aria-disabled', 'true'); btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> ' + texto; }
    else { btn.removeAttribute('aria-disabled'); btn.textContent = orig; }
  }
  function bloqueaEsc(dlg) { dlg.addEventListener('cancel', function (e) { if (ocupado) e.preventDefault(); }); }

  function registrarAuditoria(quien, afectado, antes, despues) {
    auditoria.unshift(quien + ' cambió el rol de ' + afectado + ': ' + antes + ' → ' + despues + ' · ' + iso());
    $('audit-lista').innerHTML = auditoria.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('');
    $('audit-wrap').hidden = false;
  }

  /* ---------- Alertas persistentes ---------- */
  function alertaEnvio(u) {
    quitarAlerta('envio-' + u.id);
    var d = document.createElement('div');
    d.className = 'alert aviso'; d.id = 'alerta-envio-' + u.id; d.setAttribute('role', 'alert');
    d.innerHTML = '<span class="alert-ic" aria-hidden="true">⚠</span><div><strong>Usuario creado, correo no enviado.</strong>' +
      '<p>' + esc(u.correo) + ' quedó como INVITADO, pero el correo con el enlace no se pudo enviar. El sistema no reintenta automáticamente.</p></div>' +
      '<div class="acc"><button class="btn btn-sec" type="button" data-reenviar="' + u.id + '">Reenviar invitación</button>' +
      '<button class="btn btn-ghost" type="button" data-cerrar-alerta="envio-' + u.id + '">Cerrar</button></div>';
    $('alertas').appendChild(d);
  }
  function alertaConflicto(texto) {
    quitarAlerta('conflicto');
    var d = document.createElement('div');
    d.className = 'alert'; d.id = 'alerta-conflicto'; d.setAttribute('role', 'alert');
    d.innerHTML = '<span class="alert-ic" aria-hidden="true">⚠</span><div><strong>No se aplicó el cambio.</strong><p>' + esc(texto) + '</p></div>' +
      '<button class="btn btn-sec" type="button" data-cerrar-alerta="conflicto">Cerrar</button>';
    $('alertas').appendChild(d);
    d.scrollIntoView({ block: 'nearest' });
  }
  function quitarAlerta(clave) { var e = $('alerta-' + clave); if (e) e.remove(); }

  /* ---------- Tabla ---------- */
  var BADGE = { ACTIVO: 'b-activo', INVITADO: 'b-inv', DESACTIVADO: 'b-desact' };

  function filtrados() {
    var fe = $('f-estado').value, fr = $('f-rol').value;
    return usuarios.filter(function (u) { return (fe === 'todos' || u.estado === fe) && (fr === 'todos' || u.rol === fr); });
  }

  function detalle(u) {
    var h = '';
    if (u.estado === 'INVITADO') {
      h += vencido(u)
        ? '<span class="badge b-venc">Vencida</span><span>Invitación venció ' + u.vence + '</span>'
        : '<span>Invitación vence ' + u.vence + '</span>';
      if (u.envioFallido) h += '<span class="badge b-warn">⚠ Correo no enviado</span>';
    } else h = '—';
    return '<div class="det">' + h + '</div>';
  }

  function fila(u) {
    var yo = u.correo === YO;
    return '<tr' + (u.estado === 'DESACTIVADO' ? ' class="desactivado"' : '') + (u.id === nuevoId ? ' class="nuevo"' : '') + '>' +
      '<td class="correo nombre" data-label="Correo"><strong>' + esc(u.correo) + '</strong>' + (yo ? ' <span class="tu">(tú)</span>' : '') + '</td>' +
      '<td class="rol" data-label="Rol">' + u.rol + '</td>' +
      '<td data-label="Estado"><span class="badge ' + BADGE[u.estado] + '">' + u.estado + '</span></td>' +
      '<td class="detalle" data-label="Detalle">' + detalle(u) + '</td>' +
      '<td class="acc"><button class="btn btn-sec btn-menu" type="button" data-menu="' + u.id + '" aria-haspopup="menu" aria-expanded="false" aria-label="Acciones de ' + esc(u.correo) + '"><span aria-hidden="true">⋯</span></button></td>' +
      '</tr>';
  }

  function render() {
    var cuerpo = $('cuerpo'), vacio = $('vacio'), wrap = $('tabla-wrap');
    $('alerta-error').hidden = estadoPantalla !== 'error';
    vacio.hidden = true; wrap.hidden = false;
    $('btn-invitar').disabled = false;
    cerrarMenu();

    if (estadoPantalla === 'cargando') {
      var s = '';
      for (var i = 0; i < 5; i++) s += '<tr><td data-label="Correo"><span class="skel" style="width:70%"></span></td><td data-label="Rol"><span class="skel" style="width:60%"></span></td><td data-label="Estado"><span class="skel" style="width:60%"></span></td><td data-label="Detalle"><span class="skel" style="width:80%"></span></td><td class="acc"><span class="skel" style="width:40px"></span></td></tr>';
      cuerpo.innerHTML = s;
      $('tabla').setAttribute('aria-busy', 'true');
      $('resumen').textContent = 'Cargando usuarios…';
      return;
    }
    $('tabla').removeAttribute('aria-busy');
    if (estadoPantalla === 'error') { wrap.hidden = true; $('resumen').textContent = ''; $('btn-invitar').disabled = true; return; }

    var lista = estadoPantalla === 'vacio' ? [] : filtrados();
    $('resumen').textContent = estadoPantalla === 'vacio' ? '' : 'Mostrando ' + lista.length + ' de ' + usuarios.length + ' usuarios · ' + adminsActivos() + ' administrador(es) activo(s)';
    if (!lista.length) {
      wrap.hidden = true; vacio.hidden = false;
      if (estadoPantalla === 'vacio') {
        vacio.innerHTML = '<strong>Aún no hay usuarios para mostrar</strong><p>Invita a las personas de tu equipo para que registren contactos, comprobantes y pagos.</p><button class="btn btn-prim" type="button" data-accion="invitar">+ Invitar usuario</button>';
      } else {
        vacio.innerHTML = '<strong>Ningún usuario coincide con los filtros</strong><p>Prueba con otro estado o rol.</p><button class="btn btn-sec" type="button" data-accion="limpiar">Limpiar filtros</button>';
      }
      return;
    }
    cuerpo.innerHTML = lista.map(fila).join('');
    nuevoId = null;
  }

  /* ---------- Menú ⋯ según estado ---------- */
  function itemsMenu(u) {
    if (u.estado === 'ACTIVO') return [['rol', 'Cambiar rol'], ['des', 'Desactivar', 'peligro']];
    if (u.estado === 'INVITADO') return [['reenviar', 'Reenviar invitación'], ['rol', 'Cambiar rol'], ['des', 'Desactivar', 'peligro']];
    return [['reactivar', 'Reactivar']];
  }
  function abrirMenu(btn) {
    cerrarMenu();
    var u = porId(+btn.getAttribute('data-menu'));
    var m = document.createElement('div');
    m.className = 'menu'; m.setAttribute('role', 'menu'); m.setAttribute('aria-label', 'Acciones de ' + u.correo);
    m.innerHTML = itemsMenu(u).map(function (it) {
      return '<button type="button" role="menuitem" data-op="' + it[0] + '" data-id="' + u.id + '"' + (it[2] ? ' class="' + it[2] + '"' : '') + '>' + it[1] + '</button>';
    }).join('');
    document.body.appendChild(m);
    var r = btn.getBoundingClientRect(), w = m.offsetWidth, h = m.offsetHeight;
    var left = Math.max(8, Math.min(window.innerWidth - w - 8, r.right - w));
    var top = r.bottom + 4 + h > window.innerHeight ? Math.max(8, r.top - h - 4) : r.bottom + 4;
    m.style.left = left + 'px'; m.style.top = top + 'px';
    btn.setAttribute('aria-expanded', 'true');
    menuAbierto = { el: m, btn: btn };
    m.querySelector('button').focus();
  }
  function cerrarMenu(devolverFoco) {
    if (!menuAbierto) return;
    menuAbierto.btn.setAttribute('aria-expanded', 'false');
    menuAbierto.el.remove();
    if (devolverFoco) menuAbierto.btn.focus();
    menuAbierto = null;
  }

  /* ---------- D1 Invitar ---------- */
  function abrirInvitar(origen) {
    disparador = origen;
    $('form-inv').reset();
    ['inv-correo-err', 'inv-rol-err'].forEach(limpiarError);
    $('inv-correo').removeAttribute('aria-invalid');
    $('dlg-inv').showModal();
    $('inv-correo').focus();
  }
  function enviarInvitacion(e) {
    e.preventDefault();
    if (ocupado) return;
    var correo = $('inv-correo').value.trim().toLowerCase(); // RN-139
    $('inv-correo').value = correo;
    var rolSel = document.querySelector('input[name="inv-rol"]:checked');
    var ok = true, primero = null;
    ['inv-correo-err', 'inv-rol-err'].forEach(limpiarError);
    $('inv-correo').removeAttribute('aria-invalid');
    if (!correo) { mostrarError('inv-correo-err', 'Escribe el correo electrónico.'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) { mostrarError('inv-correo-err', 'Escribe un correo válido, por ejemplo nombre@empresa.example.'); ok = false; }
    if (!ok) { $('inv-correo').setAttribute('aria-invalid', 'true'); primero = $('inv-correo'); }
    if (!rolSel) { mostrarError('inv-rol-err', 'Elige un rol.'); if (!primero) primero = document.querySelector('input[name="inv-rol"]'); ok = false; }
    if (!ok) { primero.focus(); return; }

    ocupado = true;
    bloquear($('inv-enviar'), true, 'Enviando…', 'Enviar invitación');
    simular(900, function () {
      ocupado = false;
      bloquear($('inv-enviar'), false, '', 'Enviar invitación');
      // RN-097: correo único global (usuarios de esta empresa y de otras), sin indicar la empresa
      var duplicado = OTRAS_EMPRESAS.indexOf(correo) >= 0 || usuarios.some(function (u) { return u.correo === correo; });
      if (duplicado) { // CORREO_USUARIO_YA_REGISTRADO
        mostrarError('inv-correo-err', 'Este correo ya está registrado en VenceYa.');
        $('inv-correo').setAttribute('aria-invalid', 'true');
        $('inv-correo').focus();
        return;
      }
      var fallo = $('demo-fallo-correo').checked;
      var u = { id: ++seq, correo: correo, rol: rolSel.value, estado: 'INVITADO', vence: en72h(), envioFallido: fallo, tuvoClave: false };
      usuarios.push(u); nuevoId = u.id;
      $('dlg-inv').close();
      render();
      if (fallo) alertaEnvio(u); else toast('Invitación enviada');
      anunciar('Usuario ' + correo + ' invitado como ' + u.rol);
      enfocarDisparador();
    });
  }

  /* ---------- Reenviar invitación ---------- */
  function reenviar(id, btn) {
    var u = porId(id);
    if (!u) return;
    if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Reenviando…'; }
    simular(800, function () {
      var v = porId(id);
      if (conflicto(v, 'reenviar')) return;
      v.vence = en72h(); // enlace nuevo de 72 h; el anterior queda revocado (RN-098)
      v.envioFallido = $('demo-fallo-correo').checked;
      quitarAlerta('envio-' + id);
      nuevoId = id; render();
      if (v.envioFallido) alertaEnvio(v); else toast('Invitación reenviada. El enlace anterior dejó de funcionar.');
      anunciar('Invitación reenviada a ' + v.correo);
    });
  }

  /* ---------- Reactivar ---------- */
  function reactivar(id) {
    var u = porId(id);
    simular(500, function () {
      var v = porId(id);
      if (conflicto(v, 'reactivar')) return;
      nuevoId = id;
      if (v.tuvoClave) { v.estado = 'ACTIVO'; toast(v.correo + ' volvió a estar activo con su contraseña.'); }
      else { v.estado = 'INVITADO'; v.vence = en72h(); v.envioFallido = false; toast(v.correo + ' volvió a INVITADO: recibirá un enlace nuevo de 72 horas.'); }
      render();
      anunciar('Usuario reactivado');
    });
    toast('Reactivando…');
  }

  /* ---------- Conflicto de concurrencia (RN-160) ---------- */
  function conflicto(u, op) {
    if (!$('demo-conflicto').checked) return false;
    $('demo-conflicto').checked = false;
    var cambios = {
      rol: function () { u.rol = u.rol === 'SUPERVISOR' ? 'OPERADOR' : 'SUPERVISOR'; },
      des: function () { u.estado = 'DESACTIVADO'; u.vence = null; u.envioFallido = false; },
      reenviar: function () { u.estado = 'ACTIVO'; u.vence = null; u.envioFallido = false; u.tuvoClave = true; },
      reactivar: function () { u.estado = 'ACTIVO'; u.tuvoClave = true; }
    };
    cambios[op]();
    nuevoId = u.id; render();
    alertaConflicto('Otro administrador ya modificó a ' + u.correo + ' mientras tenías la pantalla abierta. Estado actual: ' + u.rol + ' · ' + u.estado + '. Revisa la fila actualizada y vuelve a intentarlo si aún corresponde.');
    return true;
  }

  /* ---------- D2 Cambiar rol ---------- */
  var usuarioRol = null;
  function abrirRol(id, origen) {
    disparador = origen; usuarioRol = porId(id);
    var u = usuarioRol;
    $('rol-sub').textContent = u.correo;
    $('rol-opciones').innerHTML = ROLES.map(function (r) {
      return '<label class="opcion"><input type="radio" name="rol-nuevo" value="' + r + '"' + (r === u.rol ? ' checked' : '') + '><span><span class="o-tit">' + r + (r === u.rol ? ' <span class="o-actual">(actual)</span>' : '') + '</span><span class="o-desc">' + ROL_DESC[r] + '</span></span></label>';
    }).join('');
    $('rol-aviso').textContent = 'Al cambiar el rol se cerrarán todas las sesiones de ' + u.correo + ' y deberá iniciar sesión de nuevo.';
    limpiarRolError(); actualizarRol();
    $('dlg-rol').showModal();
    document.querySelector('input[name="rol-nuevo"]:checked').focus();
  }
  function rolElegido() { return document.querySelector('input[name="rol-nuevo"]:checked').value; }
  function limpiarRolError() { $('rol-error').hidden = true; $('rol-error').querySelector('div').textContent = ''; }
  function actualizarRol() {
    var nuevo = rolElegido();
    $('rol-guardar').disabled = nuevo === usuarioRol.rol; // RN-161: mismo rol no es un cambio efectivo
    $('rol-copias').hidden = !(usuarioRol.copias && nuevo === 'OPERADOR' && usuarioRol.rol !== 'OPERADOR'); // RN-135
    limpiarRolError();
  }
  function guardarRol(e) {
    e.preventDefault();
    if (ocupado || $('rol-guardar').disabled) return;
    var id = usuarioRol.id, nuevo = rolElegido();
    ocupado = true;
    bloquear($('rol-guardar'), true, 'Guardando…', 'Cambiar rol');
    simular(900, function () {
      ocupado = false;
      bloquear($('rol-guardar'), false, '', 'Cambiar rol');
      var u = porId(id), anterior = u.rol;
      if (conflicto(u, 'rol')) { $('dlg-rol').close(); return; }
      if (esUltimoAdmin(u) && nuevo !== 'ADMINISTRADOR') { // ULTIMO_ADMINISTRADOR_ACTIVO (RN-100)
        var e1 = $('rol-error'); e1.hidden = false;
        e1.querySelector('div').textContent = 'La empresa debe conservar al menos un administrador activo.';
        return;
      }
      u.rol = nuevo;
      registrarAuditoria(YO, u.correo, anterior, nuevo);
      $('dlg-rol').close();
      render();
      if (u.correo === YO) { cerrarSesion('Cambiaste tu propio rol a ' + nuevo + '. Tu sesión se cerró y debes iniciar sesión de nuevo.'); return; }
      toast('Rol de ' + u.correo + ' cambiado a ' + nuevo + '. Sus sesiones se cerraron.');
      anunciar('Rol cambiado');
      enfocarDisparador();
    });
  }

  /* ---------- D3 Desactivar ---------- */
  var usuarioDes = null;
  function abrirDesactivar(id, origen) {
    disparador = origen; usuarioDes = porId(id);
    var u = usuarioDes;
    $('des-titulo').textContent = '¿Desactivar a ' + u.correo + '?';
    $('des-desc').innerHTML = '<p>Perderá el acceso y se cerrarán sus sesiones. Sus registros se conservan con su identidad.</p>' +
      (u.estado === 'INVITADO' ? '<p>Su enlace de invitación dejará de funcionar.</p>' : '');
    $('des-error').hidden = true;
    $('dlg-des').showModal();
    $('des-cancelar').focus();
  }
  function confirmarDesactivar() {
    if (ocupado) return;
    var id = usuarioDes.id;
    ocupado = true;
    bloquear($('des-confirmar'), true, 'Desactivando…', 'Desactivar');
    simular(800, function () {
      ocupado = false;
      bloquear($('des-confirmar'), false, '', 'Desactivar');
      var u = porId(id);
      if (conflicto(u, 'des')) { $('dlg-des').close(); return; }
      if (esUltimoAdmin(u)) { // RN-100
        var e = $('des-error'); e.hidden = false;
        e.querySelector('div').textContent = 'La empresa debe conservar al menos un administrador activo.';
        return;
      }
      u.estado = 'DESACTIVADO'; u.vence = null; u.envioFallido = false;
      quitarAlerta('envio-' + id);
      $('dlg-des').close();
      render();
      if (u.correo === YO) { cerrarSesion('Desactivaste tu propia cuenta. Tu sesión se cerró.'); return; }
      toast(u.correo + ' fue desactivado. Su historial se conserva.');
      anunciar('Usuario desactivado');
      enfocarDisparador();
    });
  }

  function cerrarSesion(texto) {
    $('ses-texto').textContent = texto;
    $('dlg-sesion').showModal();
  }

  /* ---------- Permisos (RN-060) ---------- */
  function aplicarRolSesion() {
    var admin = sesionRol === 'ADMINISTRADOR';
    $('sin-permiso').hidden = admin;
    $('contenido-admin').style.display = admin ? 'contents' : 'none';
    $('nav-usuarios').hidden = !admin;
    $('nav-config').hidden = !admin;
    $('hdr-nombre').textContent = admin ? 'Ana Torres' : 'Marcela Quispe';
    $('hdr-rol').textContent = admin ? 'Administrador' : 'Operador';
    $('demo-ruta').textContent = '/usuarios';
    document.title = (admin ? 'P-009 Usuarios de la empresa' : 'Sin permiso') + ' · VenceYa';
  }

  /* ---------- Eventos ---------- */
  function navegar(texto) {
    $('nav-texto').textContent = 'Se abriría la pantalla ' + texto + '.';
    $('dlg-nav').showModal();
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var menuBtn = t.closest('[data-menu]');
    if (menuBtn) { menuAbierto && menuAbierto.btn === menuBtn ? cerrarMenu(true) : abrirMenu(menuBtn); return; }
    var op = t.closest('[data-op]');
    if (op) {
      var id = +op.getAttribute('data-id'), origen = menuAbierto ? menuAbierto.btn : null, o = op.getAttribute('data-op');
      cerrarMenu();
      if (o === 'rol') abrirRol(id, origen);
      else if (o === 'des') abrirDesactivar(id, origen);
      else if (o === 'reactivar') { disparador = origen; reactivar(id); }
      else if (o === 'reenviar') { disparador = origen; reenviar(id, null); toast('Reenviando invitación…'); }
      return;
    }
    if (menuAbierto && !t.closest('.menu')) cerrarMenu();
    var re = t.closest('[data-reenviar]');
    if (re) { reenviar(+re.getAttribute('data-reenviar'), re); return; }
    var ca = t.closest('[data-cerrar-alerta]');
    if (ca) { quitarAlerta(ca.getAttribute('data-cerrar-alerta')); return; }
    var ac = t.closest('[data-accion]');
    if (ac) { if (ac.getAttribute('data-accion') === 'invitar') abrirInvitar(ac); else limpiarFiltros(); return; }
    var nav = t.closest('[data-nav]');
    if (nav) { e.preventDefault(); navegar(nav.getAttribute('data-nav')); return; }
  });
  document.addEventListener('keydown', function (e) {
    if (!menuAbierto) return;
    var items = Array.prototype.slice.call(menuAbierto.el.querySelectorAll('button')), i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); cerrarMenu(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Tab') cerrarMenu(true);
  });
  window.addEventListener('resize', function () { cerrarMenu(); });

  function limpiarFiltros() { $('f-estado').value = 'todos'; $('f-rol').value = 'todos'; render(); }
  $('f-estado').addEventListener('change', render);
  $('f-rol').addEventListener('change', render);
  $('btn-limpiar').addEventListener('click', limpiarFiltros);
  $('btn-invitar').addEventListener('click', function () { abrirInvitar($('btn-invitar')); });

  $('form-inv').addEventListener('submit', enviarInvitacion);
  $('inv-x').addEventListener('click', function () { if (!ocupado) { $('dlg-inv').close(); enfocarDisparador(); } });
  $('inv-cancelar').addEventListener('click', function () { if (!ocupado) { $('dlg-inv').close(); enfocarDisparador(); } });
  $('dlg-inv').addEventListener('close', enfocarDisparador);
  bloqueaEsc($('dlg-inv'));

  $('form-rol').addEventListener('submit', guardarRol);
  $('rol-opciones').addEventListener('change', actualizarRol);
  $('rol-x').addEventListener('click', function () { if (!ocupado) $('dlg-rol').close(); });
  $('rol-cancelar').addEventListener('click', function () { if (!ocupado) $('dlg-rol').close(); });
  $('dlg-rol').addEventListener('close', enfocarDisparador);
  bloqueaEsc($('dlg-rol'));

  $('des-cancelar').addEventListener('click', function () { if (!ocupado) $('dlg-des').close(); });
  $('des-confirmar').addEventListener('click', confirmarDesactivar);
  $('dlg-des').addEventListener('close', enfocarDisparador);
  bloqueaEsc($('dlg-des'));

  $('nav-cerrar').addEventListener('click', function () { $('dlg-nav').close(); });
  $('ses-reiniciar').addEventListener('click', function () { $('dlg-sesion').close(); reiniciar(); });
  $('dlg-sesion').addEventListener('cancel', function (e) { e.preventDefault(); });
  $('btn-reintentar').addEventListener('click', function () {
    estadoPantalla = 'cargando'; render();
    simular(900, function () { estadoPantalla = 'datos'; document.querySelector('input[name="demo-estado"][value="datos"]').checked = true; render(); });
  });

  // Menú móvil
  function menuMovil(abrir) {
    $('sidebar').classList.toggle('abierto', abrir); $('backdrop').hidden = !abrir;
    $('btn-menu').setAttribute('aria-expanded', String(abrir));
  }
  $('btn-menu').addEventListener('click', function () { menuMovil(!$('sidebar').classList.contains('abierto')); });
  $('backdrop').addEventListener('click', function () { menuMovil(false); });

  // Controles del prototipo
  Array.prototype.forEach.call(document.querySelectorAll('input[name="demo-estado"]'), function (r) {
    r.addEventListener('change', function () { estadoPantalla = r.value; render(); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('input[name="demo-rol"]'), function (r) {
    r.addEventListener('change', function () { sesionRol = r.value; aplicarRolSesion(); });
  });
  $('demo-tema').addEventListener('change', function (e) {
    var v = e.target.value;
    if (v === 'auto') document.documentElement.removeAttribute('data-tema'); else document.documentElement.setAttribute('data-tema', v);
  });
  $('demo-unico').addEventListener('click', function () {
    usuarios.forEach(function (u) { if (u.id === 4) u.estado = 'DESACTIVADO'; });
    render(); toast('Ahora Ana es la única administradora activa.');
  });
  $('demo-reset').addEventListener('click', reiniciar);

  function reiniciar() {
    datosIniciales();
    $('alertas').innerHTML = '';
    $('audit-lista').innerHTML = ''; $('audit-wrap').hidden = true;
    $('f-estado').value = 'todos'; $('f-rol').value = 'todos';
    estadoPantalla = 'datos'; sesionRol = 'ADMINISTRADOR';
    document.querySelector('input[name="demo-estado"][value="datos"]').checked = true;
    document.querySelector('input[name="demo-rol"][value="ADMINISTRADOR"]').checked = true;
    aplicarRolSesion(); render();
  }

  reiniciar();
})();
