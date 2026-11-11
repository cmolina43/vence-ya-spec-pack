/* P-006 Detalle de comprobante y cuotas — VenceYa (prototipo con datos ficticios) */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const dias = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

  const USUARIOS = {
    OPERADOR: { n: 'LUIS PAZ', etq: 'Luis Paz · Operador' },
    SUPERVISOR: { n: 'ANA TORRES', etq: 'Ana Torres · Supervisor' },
    ADMINISTRADOR: { n: 'ROSA VEGA', etq: 'Rosa Vega · Administrador' }
  };

  const S = {
    vista: 'datos', data: null, rol: 'SUPERVISOR', hoy: '2026-11-09', s1: true, s4: false,
    sim: { fallo: false, conc: false }, abiertas: new Set(), foco: null, resalte: null,
    guardando: false, aplicadas: new Set(), nid: 100
  };

  /* ---------- Datos ficticios ---------- */
  function crearDatos(tipo) {
    const d = {
      numero: 'F001-00045', sentido: 'Cobrar', contacto: 'DISTRIBUIDORA LIMA', moneda: 'US$',
      emision: '2026-11-04', total: 3000, regPor: 'LUIS PAZ', regEl: '2026-11-04 15:02', anulacion: null,
      cuotas: ['2026-12-04', '2027-01-04', '2027-02-04'].map((v, i) => ({ n: i + 1, venc: v, importe: 1000, promesa: null, reprog: 0, pagos: [] }))
    };
    if (tipo === 'datos') {
      d.cuotas[0].pagos = [
        { id: 1, fecha: '2026-11-05', importe: 400, por: 'LUIS PAZ', reg: '2026-11-05 09:40', anul: null },
        { id: 2, fecha: '2026-11-06', importe: 600, por: 'LUIS PAZ', reg: '2026-11-06 11:02', anul: { motivo: 'IMPORTE ERRÓNEO', por: 'ANA TORRES', el: '2026-11-06 12:00' } },
        { id: 3, fecha: '2026-11-06', importe: 600, por: 'LUIS PAZ', reg: '2026-11-06 12:20', anul: null }
      ];
      d.cuotas[1].promesa = '2027-01-20';
      d.cuotas[1].reprog = 1;
    }
    if (tipo === 'anulado') {
      d.anulacion = { el: '2026-11-08 10:12', por: 'ANA TORRES', motivo: 'NÚMERO DUPLICADO' };
    }
    return d;
  }

  /* ---------- Cálculos (RN-021, RN-022, RN-025, RN-071, RN-081) ---------- */
  const vigentes = c => c.pagos.filter(p => !p.anul);
  const pagado = c => vigentes(c).reduce((a, p) => a + p.importe, 0);
  const saldo = c => Math.round((c.importe - pagado(c)) * 100) / 100;
  const efectiva = c => (S.s1 && c.promesa ? c.promesa : c.venc);
  const saldoTotal = () => S.data.cuotas.reduce((a, c) => a + saldo(c), 0);
  const anulado = () => !!S.data.anulacion;
  const puedeAnular = () => S.rol !== 'OPERADOR';
  const editable = () => !anulado() && S.data.cuotas.every(c => c.pagos.length === 0 && c.reprog === 0);
  const m = n => `${S.data.moneda} ${fmt(n)}`;
  const ahora = () => `${S.hoy} ${new Date().toTimeString().slice(0, 5)}`;

  function estadoCuota(c) {
    if (anulado()) return { t: 'ANULADA', cls: 'b-anul' };
    if (saldo(c) <= 0) return { t: 'CANCELADA', cls: 'b-canc' };
    const d = dias(efectiva(c), S.hoy);
    if (d > 0) return { t: 'VENCIDA', cls: 'b-venc', atraso: d };
    return { t: 'PENDIENTE', cls: 'b-pend' };
  }

  /* ---------- Utilidades de UI ---------- */
  function anunciar(t) { $('#anuncio').textContent = ''; setTimeout(() => { $('#anuncio').textContent = t; }, 50); }
  function toast(t) {
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = t;
    $('#toasts').append(el);
    setTimeout(() => el.remove(), 5000);
  }
  function restaurarFoco() {
    const q = S.foco && document.querySelector(`[data-foco="${S.foco}"]`);
    (q || $('#h1') || $('#contenido')).focus();
    S.foco = null;
  }

  /* ---------- Render principal ---------- */
  const vista = $('#vista');

  function render() {
    if (S.vista === 'cargando') { vista.innerHTML = htmlCargando(); return; }
    if (S.vista === 'error') { vista.innerHTML = htmlError(); return; }
    vista.innerHTML = htmlDetalle();
    if (S.foco) restaurarFoco();
  }

  function htmlCargando() {
    return `<div role="status" aria-label="Cargando comprobante" style="display:grid;gap:16px">
      <span class="skel" style="width:40%;height:20px"></span>
      <span class="skel" style="width:30%;height:32px"></span>
      <span class="skel skel-bloque"></span>
      <div class="skel-tabla"><span class="skel"></span><span class="skel"></span><span class="skel"></span><span class="skel"></span></div>
      <p class="sr-only">Cargando el comprobante…</p></div>`;
  }

  function htmlError() {
    return `<nav class="migas" aria-label="Migas de pan"><ol><li><a href="#" data-acc="migas">Comprobantes</a></li><li aria-current="page">F001-00045</li></ol></nav>
      <div class="alert" role="alert"><span aria-hidden="true" class="alert-ic">⚠</span>
        <div><strong>No se pudo cargar el comprobante.</strong>
          <p>Hubo un problema de conexión con el servidor. Tus datos no se han modificado. Código: COM-503.</p></div>
        <button class="btn btn-sec" type="button" data-acc="reintentar">Reintentar</button></div>`;
  }

  function htmlDetalle() {
    const d = S.data, an = anulado(), ed = editable();
    const mas = puedeAnular() && !an;
    const btnEditar = an ? '' : ed
      ? `<button class="btn btn-sec" type="button" data-acc="editar" data-foco="editar">Editar</button>`
      : `<button class="btn btn-sec dis" type="button" aria-disabled="true" aria-describedby="no-edit">Editar</button>`;
    const btnMas = mas
      ? `<button class="btn btn-sec" type="button" data-acc="mas" data-foco="mas" aria-haspopup="menu" aria-expanded="false">⋯ Más ▾</button>` : '';

    return `
    <nav class="migas" aria-label="Migas de pan"><ol><li><a href="#" data-acc="migas">Comprobantes</a></li><li aria-current="page">${esc(d.numero)}</li></ol></nav>

    <div class="page-head">
      <div class="titulo">
        <h1 id="h1" tabindex="-1">${esc(d.numero)}</h1>
        <span class="badge b-sentido">${d.sentido === 'Cobrar' ? 'Por cobrar' : 'Por pagar'}</span>
        ${an ? '<span class="badge b-anul">ANULADO</span>' : ''}
      </div>
      <div class="acciones">${btnEditar}${btnMas}</div>
    </div>

    ${an ? `<div class="alert alert-gris" role="status"><span aria-hidden="true" class="alert-ic">🛈</span>
      <div><strong>Comprobante anulado el ${esc(d.anulacion.el)} por ${esc(d.anulacion.por)}. Motivo: ${esc(d.anulacion.motivo)}.</strong>
        <p>Es de solo lectura.</p></div>
      <button class="btn btn-sec" type="button" data-acc="nuevo-igual">Registrar comprobante nuevo con estos datos</button></div>` : ''}

    <section class="card" aria-label="Cabecera del comprobante">
      <dl class="dl-cab">
        <div><dt>Contacto</dt><dd><button class="link link-inline" type="button" data-acc="contacto">${esc(d.contacto)} ▸</button></dd></div>
        <div><dt>Emisión</dt><dd>${d.emision}</dd></div>
        <div><dt>Moneda</dt><dd>${d.moneda === 'US$' ? 'US$ (dólares)' : 'S/ (soles)'}</dd></div>
        <div><dt>Total</dt><dd>${m(d.total)}</dd></div>
        <div><dt>Forma</dt><dd>${d.cuotas.length} cuotas</dd></div>
        <div><dt>Saldo</dt><dd class="${an ? 'anulado-txt' : ''}">${m(saldoTotal())}${an ? ' <span class="ayuda">(no suma en cartera)</span>' : ''}</dd></div>
        <div class="ancho"><dt>Registrado por</dt><dd>${esc(d.regPor)} · ${d.regEl}</dd></div>
      </dl>
      ${an ? '' : `<div class="card-pie">${ed
        ? '<button class="btn btn-sec" type="button" data-acc="editar">Editar</button>'
        : '<p id="no-edit">No editable: tiene pagos registrados.</p>'}</div>`}
    </section>

    <section class="sec-cuotas" aria-labelledby="h-cuotas">
      <h2 id="h-cuotas">Cuotas</h2>
      <div class="tabla-wrap"><table class="tabla">
        <caption class="sr-only">Cuotas de ${esc(d.numero)}</caption>
        <thead><tr>
          <th scope="col">N°</th><th scope="col">Vencimiento original</th>
          ${S.s1 ? '<th scope="col">Fecha efect.</th>' : ''}
          <th scope="col" class="num">Importe</th><th scope="col" class="num">Pagado</th><th scope="col" class="num">Saldo</th>
          <th scope="col">Estado</th><th scope="col" class="num">Acciones</th></tr></thead>
        <tbody>${d.cuotas.map(htmlCuota).join('')}</tbody>
      </table></div>
      <p class="nota">Los importes están en ${d.moneda === 'US$' ? 'US$' : 'S/'} (moneda del comprobante). El saldo de cada cuota es su importe menos la suma de sus pagos vigentes; un pago registrado no cambia la fecha de vencimiento acordada.</p>
    </section>`;
  }

  function htmlCuota(c) {
    const an = anulado(), e = estadoCuota(c), s = saldo(c), abierta = S.abiertas.has(c.n);
    const items = [];
    if (S.s1 && !an && s > 0) items.push('Reprogramar');
    if (S.s1 || S.s4) items.push('Historial');
    const acc = `<div class="acc-wrap">
      ${!an && s > 0 ? `<button class="btn btn-prim btn-sm" type="button" data-acc="pagar" data-n="${c.n}" data-foco="pagar-${c.n}">Registrar pago</button>` : ''}
      <button class="btn btn-sec btn-sm" type="button" data-acc="pagos" data-n="${c.n}" data-foco="pagos-${c.n}" aria-expanded="${abierta}" aria-controls="pagos-${c.n}">${abierta ? '▴' : '▾'} Pagos (${c.pagos.length})</button>
      ${items.length ? `<button class="btn btn-ghost btn-icono btn-sm" type="button" data-acc="fila-menu" data-n="${c.n}" data-foco="fm-${c.n}" aria-haspopup="menu" aria-expanded="false" aria-label="Más acciones de la cuota ${c.n}">⋯</button>` : ''}
    </div>`;
    const resalte = S.resalte === c.n ? ' resalte' : '';
    return `<tr class="${an ? 'anulado' : ''}${resalte}">
      <td class="nombre" data-label="N°" style="min-width:0">${c.n}</td>
      <td class="fecha" data-label="Vencimiento original">${c.venc}</td>
      ${S.s1 ? `<td class="fecha fecha-ef" data-label="Fecha efect.">${efectiva(c) === c.venc && !c.reprog ? '—' : efectiva(c)}${c.reprog ? '<span class="badge b-reprog">Reprogramada</span>' : ''}</td>` : ''}
      <td class="num" data-label="Importe">${fmt(c.importe)}</td>
      <td class="num" data-label="Pagado">${fmt(pagado(c))}</td>
      <td class="num ${e.t === 'VENCIDA' ? 'saldo-venc' : ''}" data-label="Saldo">${fmt(s)}</td>
      <td class="estado" data-label="Estado"><span class="badge ${e.cls}">${e.t}</span>${e.atraso ? `<small>${e.atraso} ${e.atraso === 1 ? 'día' : 'días'} de atraso</small>` : ''}</td>
      <td class="acc-celda">${acc}</td>
    </tr>${abierta ? htmlPagos(c) : ''}`;
  }

  function htmlPagos(c) {
    const cols = S.s1 ? 8 : 7;
    const sinPagos = !c.pagos.length;
    const filas = c.pagos.map(p => {
      const a = p.anul;
      const accion = !a && puedeAnular() && !anulado()
        ? `<button class="btn btn-sec btn-sm" type="button" data-acc="anular-pago" data-n="${c.n}" data-p="${p.id}" data-foco="ap-${c.n}-${p.id}" aria-label="Anular pago de ${m(p.importe)} del ${p.fecha}">Anular</button>` : '—';
      return `<tr>
        <td class="fecha" data-label="Fecha de pago">${p.fecha}</td>
        <td class="num" data-label="Importe">${m(p.importe)}</td>
        <td data-label="Registró">${esc(p.por)}</td>
        <td class="fecha" data-label="Registrado el">${p.reg}</td>
        <td data-label="Estado">${a ? `<span class="badge b-anul">ANULADO</span><small>${esc(a.motivo)}<br>${esc(a.por)} · ${a.el}</small>` : '<span class="badge b-vigente">Vigente</span>'}</td>
        <td class="acc-celda">${accion}</td></tr>`;
    }).join('');
    return `<tr class="fila-pagos"><td class="sub" colspan="${cols}"><div class="sub-wrap" id="pagos-${c.n}">
      <h3>Pagos de la cuota ${c.n}</h3>
      ${sinPagos ? '<p class="vacio-peq">Esta cuota aún no tiene pagos registrados.</p>' : `
      <table class="tabla tabla-pagos"><caption class="sr-only">Pagos de la cuota ${c.n}</caption>
        <thead><tr><th scope="col">Fecha de pago</th><th scope="col" class="num">Importe</th><th scope="col">Registró</th><th scope="col">Registrado el</th><th scope="col">Estado</th><th scope="col" class="num">Acciones</th></tr></thead>
        <tbody>${filas}</tbody></table>`}
    </div></td></tr>`;
  }

  /* ---------- Menú flotante ---------- */
  let menuEl = null, menuBtn = null;
  function cerrarMenu(devolverFoco) {
    if (!menuEl) return;
    menuEl.remove(); menuEl = null;
    menuBtn.setAttribute('aria-expanded', 'false');
    if (devolverFoco) menuBtn.focus();
    menuBtn = null;
  }
  function abrirMenu(btn, items) {
    if (menuEl && menuBtn === btn) { cerrarMenu(true); return; }
    cerrarMenu();
    menuBtn = btn;
    menuEl = document.createElement('div');
    menuEl.className = 'menu'; menuEl.setAttribute('role', 'menu');
    items.forEach(it => {
      if (it === '-') { menuEl.append(document.createElement('hr')); return; }
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'menuitem'); b.textContent = it.t;
      if (it.peligro) b.className = 'peligro';
      b.addEventListener('click', () => { cerrarMenu(false); it.fn(); });
      menuEl.append(b);
    });
    document.body.append(menuEl);
    const r = btn.getBoundingClientRect();
    menuEl.style.top = `${Math.min(r.bottom + 4, innerHeight - menuEl.offsetHeight - 8)}px`;
    menuEl.style.left = `${Math.max(8, Math.min(r.right - menuEl.offsetWidth, innerWidth - menuEl.offsetWidth - 8))}px`;
    btn.setAttribute('aria-expanded', 'true');
    menuEl.querySelector('button').focus();
    menuEl.addEventListener('keydown', ev => {
      const bs = [...menuEl.querySelectorAll('button')], i = bs.indexOf(document.activeElement);
      if (ev.key === 'Escape') { ev.preventDefault(); cerrarMenu(true); }
      else if (ev.key === 'ArrowDown') { ev.preventDefault(); bs[(i + 1) % bs.length].focus(); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); bs[(i - 1 + bs.length) % bs.length].focus(); }
      else if (ev.key === 'Tab') cerrarMenu(false);
    });
  }
  document.addEventListener('click', ev => { if (menuEl && !menuEl.contains(ev.target) && ev.target !== menuBtn) cerrarMenu(false); });

  /* ---------- Diálogo genérico ---------- */
  const dlg = $('#dlg');
  function abrirDlg(html, { cls = '', alerta = false } = {}) {
    dlg.className = cls;
    if (alerta) dlg.setAttribute('role', 'alertdialog'); else dlg.removeAttribute('role');
    dlg.innerHTML = html;
    dlg.showModal();
  }
  dlg.addEventListener('cancel', ev => { if (S.guardando) ev.preventDefault(); });
  dlg.addEventListener('close', () => setTimeout(() => { if (S.foco) restaurarFoco(); }, 0));
  dlg.addEventListener('click', ev => { if (ev.target.closest('[data-cerrar]') && !S.guardando) dlg.close(); });

  function setError(id, texto) {
    const inp = $('#' + id), err = $('#' + id + '-err');
    if (texto) { err.textContent = texto; err.hidden = false; inp.setAttribute('aria-invalid', 'true'); }
    else { err.hidden = true; inp.removeAttribute('aria-invalid'); }
  }
  function cargandoBtn(btn, on, txtOn, txtOff) {
    S.guardando = on;
    btn.setAttribute('aria-disabled', on ? 'true' : 'false');
    btn.innerHTML = on ? `<span class="spinner" aria-hidden="true"></span> ${txtOn}` : txtOff;
    dlg.querySelectorAll('[data-cerrar], [data-cancelar]').forEach(b => { b.disabled = on; });
  }
  const alertaDlg = (txt, tipo = 'peligro') => `<div class="alert alert-peq ${tipo === 'info' ? 'info' : ''}" role="alert"><span aria-hidden="true">⚠</span><div>${txt}</div></div>`;

  function navegar(texto) {
    S.foco = null;
    abrirDlg(`<h2 id="dlg-t" style="margin-bottom:12px">Navegación simulada</h2><p>${esc(texto)}</p>
      <p class="ayuda" style="margin-top:8px">Este prototipo solo muestra la pantalla P-006.</p>
      <div class="dlg-acc"><button class="btn btn-prim" type="button" data-cerrar>Entendido</button></div>`);
  }

  /* ---------- D1 Registrar pago (HU-006) ---------- */
  const reImporte = /^(\d{1,3}(,\d{3})+|\d{1,3})(\.\d{1,2})?$/;
  function minFecha(c) {
    return [S.data.emision, ...vigentes(c).map(p => p.fecha)].sort().pop();
  }
  function abrirPago(n, foco) {
    const c = S.data.cuotas.find(x => x.n === n), cobro = S.data.sentido === 'Cobrar';
    const clave = (crypto.randomUUID ? crypto.randomUUID() : 'k-' + Date.now() + '-' + Math.random().toString(16).slice(2));
    S.foco = foco;
    abrirDlg(`<form id="f-pago" novalidate>
      <div class="dlg-cab"><h2 id="dlg-t">Registrar ${cobro ? 'cobro' : 'pago'} — Cuota ${n} de ${esc(S.data.numero)}</h2>
        <button class="btn btn-ghost btn-icono" type="button" data-cerrar aria-label="Cerrar">✕</button></div>
      <dl class="dl-mini">
        <div><dt>Contacto</dt><dd>${esc(S.data.contacto)}</dd></div>
        <div><dt>Vence</dt><dd>${efectiva(c)}</dd></div>
        <div><dt>Importe de la cuota</dt><dd>${m(c.importe)}</dd></div>
        <div><dt>Saldo vigente</dt><dd id="d-saldo">${m(saldo(c))}</dd></div>
      </dl>
      <div id="dlg-alerta"></div>
      <div class="campo">
        <label for="p-imp">Importe <span class="req" aria-hidden="true">*</span></label>
        <div class="moneda"><span class="pref">${S.data.moneda}</span>
          <input id="p-imp" inputmode="decimal" autocomplete="off" placeholder="0.00" aria-required="true" aria-describedby="p-imp-ayuda p-imp-err"></div>
        <p class="ayuda" id="p-imp-ayuda">Hasta ${m(saldo(c))}</p>
        <p class="error" id="p-imp-err" hidden></p>
        <button class="link link-inline" type="button" id="p-completo" style="align-self:start;min-height:32px">Usar saldo completo</button>
      </div>
      <div class="campo">
        <label for="p-fecha">Fecha de pago <span class="req" aria-hidden="true">*</span></label>
        <input id="p-fecha" type="date" class="corto" value="${S.hoy}" min="${minFecha(c)}" max="${S.hoy}" aria-required="true" aria-describedby="p-fecha-ayuda p-fecha-err">
        <p class="ayuda" id="p-fecha-ayuda">Entre ${minFecha(c)} y hoy (${S.hoy})</p>
        <p class="error" id="p-fecha-err" hidden></p>
      </div>
      <p class="nota-fija">El pago no cambia la fecha de vencimiento acordada.</p>
      <p class="ayuda-clave">Prototipo · Clave de idempotencia de este diálogo: ${clave}</p>
      <div class="dlg-acc"><button class="btn btn-sec" type="button" data-cerrar data-cancelar>Cancelar</button>
        <button class="btn btn-prim" type="submit" id="p-ok">Registrar pago</button></div>
    </form>`, { cls: 'dlg-form' });

    $('#p-completo').addEventListener('click', () => { $('#p-imp').value = fmt(saldo(c)); setError('p-imp', ''); $('#p-imp').focus(); });
    $('#f-pago').addEventListener('submit', ev => {
      ev.preventDefault();
      if (S.guardando) return;
      $('#dlg-alerta').innerHTML = '';
      const txt = $('#p-imp').value.trim(), fecha = $('#p-fecha').value;
      let eImp = '', eFec = '';
      const val = Number(txt.replace(/,/g, ''));
      if (!txt) eImp = 'Indica el importe.';
      else if (!reImporte.test(txt)) eImp = 'Usa el formato 1,000.50: punto decimal, hasta 2 decimales, coma de miles desde 1,000 y sin signo.';
      else if (!(val > 0)) eImp = 'El importe debe ser mayor que cero.';
      else if (val > saldo(c)) eImp = `El importe supera el saldo vigente de la cuota (${m(saldo(c))}).`;
      if (!fecha) eFec = 'Indica la fecha de pago.';
      else if (fecha > S.hoy) eFec = `La fecha no puede ser posterior a hoy (${S.hoy}).`;
      else if (fecha < minFecha(c)) eFec = `La fecha no puede ser anterior a ${minFecha(c)} (emisión o último pago vigente de la cuota).`;
      setError('p-imp', eImp); setError('p-fecha', eFec);
      if (eImp) { $('#p-imp').focus(); return; }
      if (eFec) { $('#p-fecha').focus(); return; }

      const btn = $('#p-ok');
      cargandoBtn(btn, true, 'Guardando…', 'Registrar pago');
      setTimeout(() => {
        if (S.sim.fallo) {
          cargandoBtn(btn, false, '', 'Registrar pago');
          $('#dlg-alerta').innerHTML = alertaDlg('<strong>No se pudo registrar el pago.</strong> Hubo un problema de conexión. Puedes reintentar: se usará la misma clave y no se duplicará el pago.');
          return;
        }
        if (S.sim.conc) { // otro usuario cobró antes: el saldo vigente viene de una nueva consulta (RN-092)
          S.sim.conc = false; $('#demo-conc').checked = false;
          c.pagos.push({ id: ++S.nid, fecha: S.hoy, importe: 300, por: 'RAÚL ZEA', reg: ahora(), anul: null });
        }
        if (val > saldo(c)) {
          cargandoBtn(btn, false, '', 'Registrar pago');
          $('#d-saldo').textContent = m(saldo(c));
          $('#p-imp-ayuda').textContent = `Hasta ${m(saldo(c))}`;
          $('#dlg-alerta').innerHTML = alertaDlg(`<strong>IMPORTE_SUPERA_SALDO.</strong> El saldo de la cuota cambió: ahora es ${m(saldo(c))}. Corrige el importe.`);
          setError('p-imp', `El importe supera el saldo vigente de la cuota (${m(saldo(c))}).`);
          $('#p-imp').focus();
          render();
          return;
        }
        if (!S.aplicadas.has(clave)) { // idempotencia: una clave crea como máximo un pago
          S.aplicadas.add(clave);
          c.pagos.push({ id: ++S.nid, fecha, importe: val, por: USUARIOS[S.rol].n, reg: ahora(), anul: null });
        }
        S.guardando = false;
        S.resalte = c.n; S.abiertas.add(c.n); S.foco = `pagos-${c.n}`;
        dlg.close(); render();
        const cancelada = saldo(c) <= 0;
        toast(`Pago de ${m(val)} registrado en la cuota ${c.n}.${cancelada ? ' La cuota quedó CANCELADA.' : ''}`);
        anunciar(`Pago registrado. Saldo de la cuota ${c.n}: ${m(saldo(c))}.`);
      }, 900);
    });
  }

  /* ---------- D2 / D3 Anulaciones (HU-007) ---------- */
  function abrirAnulacion({ titulo, aviso, extra, boton, foco, confirmar }) {
    S.foco = foco;
    abrirDlg(`<form id="f-anul" novalidate>
      <h2 id="dlg-t">${titulo}</h2>
      <div class="alert alert-peq info" role="note" id="dlg-desc"><span aria-hidden="true">⚠</span><div>${aviso}</div></div>
      <div id="dlg-alerta"></div>
      <div class="campo">
        <label for="a-motivo">Motivo de la anulación <span class="req" aria-hidden="true">*</span></label>
        <textarea id="a-motivo" rows="3" aria-required="true" aria-describedby="a-motivo-err a-cont"></textarea>
        <div class="pie-campo"><p class="error" id="a-motivo-err" hidden></p><span class="ayuda" id="a-cont" aria-hidden="true" style="margin-left:auto">0/500</span></div>
        <span class="sr-only" id="a-live" aria-live="polite"></span>
      </div>
      ${extra ? `<p class="ayuda">${extra}</p>` : ''}
      <div class="dlg-acc"><button class="btn btn-sec" type="button" data-cerrar data-cancelar>Cancelar</button>
        <button class="btn btn-peligro" type="submit" id="a-ok">${boton}</button></div>
    </form>`, { alerta: true });
    dlg.setAttribute('aria-describedby', 'dlg-desc');

    const ta = $('#a-motivo'), cont = $('#a-cont'), live = $('#a-live');
    let tramo = 0;
    ta.addEventListener('input', () => {
      const n = ta.value.length;
      cont.textContent = `${n}/500`; cont.classList.toggle('excede', n > 500);
      const t = Math.floor(n / 50);
      if (t !== tramo) { tramo = t; live.textContent = `${n} de 500 caracteres`; }
    });
    $('#f-anul').addEventListener('submit', ev => {
      ev.preventDefault();
      if (S.guardando) return;
      $('#dlg-alerta').innerHTML = '';
      const motivo = ta.value.trim();
      const err = !motivo ? 'Escribe el motivo de la anulación (1 a 500 caracteres).' : motivo.length > 500 ? `El motivo supera los 500 caracteres (${motivo.length}).` : '';
      setError('a-motivo', err);
      if (err) { ta.focus(); return; }
      const btn = $('#a-ok');
      cargandoBtn(btn, true, 'Anulando…', boton);
      setTimeout(() => {
        if (S.sim.fallo) {
          cargandoBtn(btn, false, '', boton);
          $('#dlg-alerta').innerHTML = alertaDlg('<strong>No se pudo completar la anulación.</strong> Hubo un problema de conexión; no se hizo ningún cambio. Puedes reintentar.');
          return;
        }
        const r = confirmar(motivo.toUpperCase());
        if (r && r.error) {
          cargandoBtn(btn, false, '', boton);
          $('#dlg-alerta').innerHTML = alertaDlg(r.error);
          return;
        }
        S.guardando = false;
        dlg.close(); render();
        toast(r.toast); anunciar(r.toast);
      }, 800);
    });
  }

  function anularPago(n, id, foco) {
    const c = S.data.cuotas.find(x => x.n === n), p = c.pagos.find(x => x.id === id);
    abrirAnulacion({
      titulo: `Anular pago de ${m(p.importe)} del ${p.fecha}`,
      aviso: 'La anulación es total e irreversible. El pago original se conserva y el saldo de la cuota se recalcula.',
      extra: 'Para incorporar un pago anterior omitido, anula también los pagos de fechas posteriores y regístralos de nuevo en orden.',
      boton: 'Anular pago', foco: foco || `pagos-${n}`,
      confirmar(motivo) {
        if (p.anul) return { error: 'Este pago ya está anulado.' };
        p.anul = { motivo, por: USUARIOS[S.rol].n, el: ahora() };
        S.resalte = n; S.abiertas.add(n); S.foco = `pagos-${n}`;
        return { toast: `Pago anulado. Saldo de la cuota ${n}: ${m(saldo(c))}${saldo(c) > 0 ? ' (cuota reabierta).' : '.'}` };
      }
    });
  }

  function anularComprobante() {
    const d = S.data;
    abrirAnulacion({
      titulo: `Anular ${esc(d.numero)}`,
      aviso: `Sus ${d.cuotas.length} cuotas quedarán ANULADAS y dejarán de sumar en cartera, indicadores y avisos. El comprobante quedará de solo lectura.`,
      boton: 'Anular comprobante', foco: 'mas',
      confirmar(motivo) {
        if (d.cuotas.some(c => vigentes(c).length)) return { error: '<strong>COMPROBANTE_CON_PAGOS_VIGENTES.</strong> Tiene pagos vigentes. Anúlalos primero.' };
        d.anulacion = { el: ahora(), por: USUARIOS[S.rol].n, motivo };
        S.abiertas.clear(); S.foco = 'h1';
        return { toast: `Comprobante ${d.numero} anulado.` };
      }
    });
  }

  /* ---------- D4 Reprogramar (HU-011, S1) ---------- */
  function reprogramar(n, foco) {
    const c = S.data.cuotas.find(x => x.n === n);
    S.foco = foco;
    abrirDlg(`<form id="f-rep" novalidate>
      <div class="dlg-cab"><h2 id="dlg-t">Reprogramar cuota ${n} de ${esc(S.data.numero)}</h2>
        <button class="btn btn-ghost btn-icono" type="button" data-cerrar aria-label="Cerrar">✕</button></div>
      <dl class="dl-mini"><div><dt>Vencimiento original</dt><dd>${c.venc}</dd></div><div><dt>Fecha efectiva actual</dt><dd>${efectiva(c)}</dd></div></dl>
      <div class="campo">
        <label for="r-fecha">Nueva fecha prometida <span class="req" aria-hidden="true">*</span></label>
        <input id="r-fecha" type="date" class="corto" min="${S.hoy}" aria-describedby="r-fecha-ayuda r-fecha-err">
        <p class="ayuda" id="r-fecha-ayuda">Desde hoy (${S.hoy}). El vencimiento original no cambia.</p>
        <p class="error" id="r-fecha-err" hidden></p>
      </div>
      <p class="nota-fija">Detalle completo de la reprogramación en la pantalla P-017.</p>
      <div class="dlg-acc"><button class="btn btn-sec" type="button" data-cerrar>Cancelar</button><button class="btn btn-prim" type="submit">Reprogramar</button></div>
    </form>`, { cls: 'dlg-form' });
    $('#f-rep').addEventListener('submit', ev => {
      ev.preventDefault();
      const f = $('#r-fecha').value;
      const err = !f ? 'Indica la nueva fecha prometida.' : f < S.hoy ? `La fecha no puede ser anterior a hoy (${S.hoy}).` : '';
      setError('r-fecha', err);
      if (err) { $('#r-fecha').focus(); return; }
      c.promesa = f; c.reprog++;
      S.resalte = n; S.foco = `fm-${n}`;
      dlg.close(); render();
      toast(`Cuota ${n} reprogramada al ${f}.`);
    });
  }

  /* ---------- Eventos de la pantalla ---------- */
  vista.addEventListener('click', ev => {
    const b = ev.target.closest('[data-acc]');
    if (!b) return;
    ev.preventDefault();
    const n = Number(b.dataset.n), foco = b.dataset.foco;
    switch (b.dataset.acc) {
      case 'migas': navegar('P-004 Comprobantes (listado)'); break;
      case 'contacto': navegar(`P-003 Contactos — ${S.data.contacto}`); break;
      case 'editar': S.foco = 'editar'; navegar('P-005 Editar comprobante'); break;
      case 'nuevo-igual': navegar('P-005 Registrar comprobante con los datos de ' + S.data.numero + ' (mismo número permitido, RN-003)'); break;
      case 'reintentar': cargarVista('datos'); break;
      case 'mas': abrirMenu(b, [{ t: 'Anular comprobante', peligro: true, fn: anularComprobante }]); break;
      case 'fila-menu': {
        const c = S.data.cuotas.find(x => x.n === n), it = [];
        if (S.s1 && !anulado() && saldo(c) > 0) it.push({ t: 'Reprogramar', fn: () => reprogramar(n, foco) });
        if (S.s1 || S.s4) it.push({ t: 'Historial', fn: () => { S.foco = foco; navegar(`P-016 Historial de la cuota ${n} de ${S.data.numero}`); } });
        abrirMenu(b, it); break;
      }
      case 'pagos':
        if (S.abiertas.has(n)) S.abiertas.delete(n); else S.abiertas.add(n);
        S.foco = foco; S.resalte = null; render();
        break;
      case 'pagar': abrirPago(n, foco); break;
      case 'anular-pago': anularPago(n, Number(b.dataset.p), foco); break;
    }
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('[data-nav]');
    if (a) { ev.preventDefault(); navegar(a.dataset.nav); }
  });

  /* ---------- Controles del prototipo ---------- */
  let temporizador = null;
  function cargarVista(v) {
    clearTimeout(temporizador);
    S.vista = v; S.abiertas.clear(); S.resalte = null; S.foco = null;
    document.querySelector(`input[name="demo-estado"][value="${v === 'cargando' || v === 'error' ? v : (v)}"]`).checked = true;
    if (v === 'cargando' || v === 'error') { render(); anunciar(v === 'error' ? 'No se pudo cargar el comprobante.' : 'Cargando el comprobante'); return; }
    S.vista = 'cargando'; render();
    temporizador = setTimeout(() => {
      S.vista = v; S.data = crearDatos(v); S.aplicadas.clear();
      if (v === 'datos') S.abiertas.add(1);
      render(); anunciar('Comprobante cargado');
    }, 500);
  }
  document.querySelectorAll('input[name="demo-estado"]').forEach(r => r.addEventListener('change', () => cargarVista(r.value)));
  $('#demo-rol').addEventListener('change', e => {
    S.rol = e.target.value;
    $('#usuario-datos').innerHTML = `<strong>${USUARIOS[S.rol].etq.split(' · ')[0]}</strong> · ${USUARIOS[S.rol].etq.split(' · ')[1]}`;
    if (S.data) render();
  });
  $('#demo-hoy').addEventListener('change', e => { S.hoy = e.target.value; if (S.data) render(); });
  $('#demo-s1').addEventListener('change', e => { S.s1 = e.target.checked; if (S.data) render(); });
  $('#demo-s4').addEventListener('change', e => { S.s4 = e.target.checked; if (S.data) render(); });
  $('#demo-fallo').addEventListener('change', e => { S.sim.fallo = e.target.checked; });
  $('#demo-conc').addEventListener('change', e => { S.sim.conc = e.target.checked; });
  $('#demo-reset').addEventListener('click', () => {
    const v = ['datos', 'sin-pagos', 'anulado'].includes(S.vista) ? S.vista : 'datos';
    cargarVista(v);
  });
  $('#demo-tema').addEventListener('change', e => {
    if (e.target.value === 'auto') document.documentElement.removeAttribute('data-tema');
    else document.documentElement.setAttribute('data-tema', e.target.value);
  });

  /* Menú lateral móvil */
  const side = $('#sidebar'), back = $('#backdrop'), btnMenu = $('#btn-menu');
  function menuLateral(abrir) {
    side.classList.toggle('abierto', abrir); back.hidden = !abrir;
    btnMenu.setAttribute('aria-expanded', String(abrir));
  }
  btnMenu.addEventListener('click', () => menuLateral(!side.classList.contains('abierto')));
  back.addEventListener('click', () => menuLateral(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && side.classList.contains('abierto')) { menuLateral(false); btnMenu.focus(); } });

  cargarVista('datos');
})();
