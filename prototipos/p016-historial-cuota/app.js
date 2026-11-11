/* P-016 Historial cronológico de la cuota — VenceYa (prototipo con datos ficticios) */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const dias = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
  const masDia = f => new Date(Date.parse(f) + 864e5).toISOString().slice(0, 10);
  const dmy = f => f.split('-').reverse().join('/');

  const USUARIOS = {
    OPERADOR: 'Luis Paz · Operador',
    SUPERVISOR: 'Ana Torres · Supervisor',
    ADMINISTRADOR: 'Rosa Vega · Administrador'
  };

  const HOY = '2026-11-09';
  const S = { vista: 'completo', esc: 'completo', s1: true, s4: true, fallo: false, ocultarCalc: false, corte: `${HOY} 08:15`, data: null, timer: null };

  /* ---------- Datos ficticios ---------- */
  function crearDatos(tipo) {
    if (tipo === 'retro') {
      return {
        numero: 'F001-00052', sentido: 'Cobrar', contacto: 'FERRETERÍA EL SOL', moneda: 'S/',
        cuota: 1, de: 2, importe: 1000, venc: '2026-10-15', emision: '2026-09-15',
        ediciones: [], repros: [],
        pagos: [
          { id: 1, fecha: '2026-10-10', importe: 400, por: 'LUIS PAZ', reg: '2026-10-10 10:05', anul: null },
          { id: 2, fecha: '2026-10-14', importe: 600, por: 'ANA TORRES', reg: '2026-10-25 14:32', anul: null }
        ]
      };
    }
    const d = {
      numero: 'F001-00045', sentido: 'Cobrar', contacto: 'DISTRIBUIDORA LIMA', moneda: 'US$',
      cuota: 1, de: 3, importe: 1000, venc: '2026-10-15', emision: '2026-10-01',
      ediciones: [], repros: [], pagos: []
    };
    if (tipo === 'vacio') { d.venc = '2026-12-04'; d.emision = '2026-11-04'; }
    if (tipo === 'completo') {
      d.ediciones = [{ fecha: '2026-10-02', campo: 'N° de documento', ant: 'F001-00054', nuevo: 'F001-00045', por: 'LUIS PAZ', reg: '2026-10-02 08:31' }];
      d.repros = [{ fecha: '2026-10-14', ant: '2026-10-15', nueva: '2026-10-30', por: 'ANA TORRES', reg: '2026-10-14 16:20' }];
      d.pagos = [
        { id: 1, fecha: '2026-10-10', importe: 400, por: 'LUIS PAZ', reg: '2026-10-10 17:45', anul: null },
        { id: 2, fecha: '2026-11-02', importe: 600, por: 'LUIS PAZ', reg: '2026-11-03 09:12',
          anul: { fecha: '2026-11-05', motivo: 'DEPÓSITO REGISTRADO EN CUENTA EQUIVOCADA', por: 'ANA TORRES', reg: '2026-11-05 10:03' } },
        { id: 3, fecha: '2026-11-06', importe: 600, por: 'LUIS PAZ', reg: '2026-11-06 12:20', anul: null }
      ];
    }
    return d;
  }

  /* ---------- Cálculos (RN-078.1 a RN-078.3, RN-084, RN-088) ---------- */
  const m = n => `${S.data.moneda} ${fmt(n)}`;
  const vigentes = () => S.data.pagos.filter(p => !p.anul);
  const pagadoAl = (fecha, lista) => lista.filter(p => p.fecha <= fecha).reduce((a, p) => a + p.importe, 0);
  const saldoAl = fecha => S.data.importe - pagadoAl(fecha, vigentes());
  const efectiva = () => (S.s1 && S.data.repros.length ? S.data.repros[S.data.repros.length - 1].nueva : S.data.venc);
  const saldoCorte = () => saldoAl('9999-12-31');

  function estado() {
    if (saldoCorte() <= 0) return { t: 'CANCELADA', cls: 'b-canc' };
    const d = dias(efectiva(), HOY);
    return d > 0 ? { t: 'VENCIDA', cls: 'b-venc', atraso: d } : { t: 'PENDIENTE', cls: 'b-pend' };
  }

  /* Orden de empates (RN-078.2) */
  const ORDEN = { emision: 0, edicion: 1, repro: 2, pago: 3, anulacion: 4, vencida: 5, cancelada: 6, reapertura: 7 };

  function eventos() {
    const d = S.data, ev = [];
    ev.push({ tipo: 'emision', fecha: d.emision, orden: ORDEN.emision, clave: '' });
    d.ediciones.forEach((e, i) => ev.push({ tipo: 'edicion', fecha: e.fecha, orden: ORDEN.edicion, clave: e.reg + i, e }));
    if (S.s1) d.repros.forEach((r, i) => ev.push({ tipo: 'repro', fecha: r.fecha, orden: ORDEN.repro, clave: r.reg + i, r }));
    d.pagos.forEach(p => {
      ev.push({ tipo: 'pago', fecha: p.fecha, orden: ORDEN.pago, clave: p.reg + String(p.id).padStart(6, '0'), p });
      if (p.anul) ev.push({ tipo: 'anulacion', fecha: p.anul.fecha, orden: ORDEN.anulacion, clave: p.anul.reg, p });
    });

    /* Transiciones derivadas: se recalculan en cada consulta, no se guardan (RN-078.3) */
    const ef = efectiva(), dv = masDia(ef);
    if (dv <= HOY && saldoAl(dv) > 0) ev.push({ tipo: 'vencida', fecha: dv, orden: ORDEN.vencida, clave: '', derivado: true, saldo: saldoAl(dv) });
    if (saldoCorte() <= 0) {
      const f = vigentes().reduce((a, p) => (p.fecha > a ? p.fecha : a), '0000');
      ev.push({ tipo: 'cancelada', fecha: f, orden: ORDEN.cancelada, clave: '', derivado: true });
    }
    d.pagos.filter(p => p.anul).forEach(p => {
      const f = p.anul.fecha, previo = pagadoAl(f, vigentes());
      if (d.importe - (previo + p.importe) <= 0 && d.importe - previo > 0) {
        ev.push({ tipo: 'reapertura', fecha: f, orden: ORDEN.reapertura, clave: '', derivado: true, saldo: d.importe - previo, a: f > ef ? 'VENCIDA' : 'PENDIENTE' });
      }
    });

    return ev.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.orden - b.orden || a.clave.localeCompare(b.clave));
  }

  /* ---------- Utilidades de UI ---------- */
  function anunciar(t) { $('#anuncio').textContent = ''; setTimeout(() => { $('#anuncio').textContent = t; }, 50); }
  function toast(t) {
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = t;
    $('#toasts').append(el);
    setTimeout(() => el.remove(), 5000);
  }
  const reg = (por, el) => `<p class="ev-reg">Registrado el ${esc(el)} por ${esc(por)}</p>`;

  /* ---------- Vistas ---------- */
  const vista = $('#vista');

  function migas() {
    const n = S.data ? S.data.numero : 'F001-00045', c = S.data ? S.data.cuota : 1;
    return `<nav class="migas" aria-label="Ruta de navegación"><ol>
      <li><a href="#" data-nav="P-004 Comprobantes">Comprobantes</a></li>
      <li><a href="#" data-nav="P-006 Detalle del comprobante ${esc(n)}">${esc(n)}</a></li>
      <li aria-current="page">Cuota ${c} · Historial</li></ol></nav>`;
  }

  function cabeceraPagina(titulo) {
    return `${migas()}
    <div class="page-head">
      <h1 id="h1" tabindex="-1">${titulo}</h1>
      <div class="acciones"><button type="button" class="btn btn-sec" data-nav="P-006 Detalle del comprobante">← Volver al comprobante</button></div>
    </div>`;
  }

  function render() {
    if (!S.s1 && !S.s4) {
      vista.innerHTML = `<div class="vacio"><strong>404 · Pantalla no disponible</strong>
        <p>El historial de la cuota solo está disponible cuando la reprogramación (S1) o el historial (S4) están entregados.</p>
        <button type="button" class="btn btn-sec" data-nav="P-004 Comprobantes">Ir a Comprobantes</button></div>`;
      return;
    }
    if (S.vista === 'cargando') { renderCargando(); return; }
    if (S.vista === 'error') { renderError(); return; }
    renderDatos();
  }

  function renderCargando() {
    vista.innerHTML = `${cabeceraPagina('Historial de la cuota')}
      <div role="status" aria-busy="true" class="skel-wrap">
        <span class="sr-only">Cargando el historial…</span>
        <div class="skel skel-bloque"></div>
        <div class="skel-tabla">${'<span class="skel"></span><span class="skel" style="width:70%"></span><span class="skel" style="width:85%"></span>'.repeat(3)}</div>
      </div>`;
  }

  function renderError() {
    vista.innerHTML = `${cabeceraPagina('Historial de la cuota')}
      <div class="alert" role="alert"><span class="alert-ic" aria-hidden="true">⚠</span>
        <div><strong>No pudimos cargar el historial</strong><p>Hubo un problema al leer los datos de la cuota. No se perdió ninguna información. Intenta de nuevo en unos segundos.</p></div>
        <button type="button" class="btn btn-sec" id="reintentar">Reintentar</button></div>`;
    $('#reintentar').addEventListener('click', () => cargar(S.esc === 'vacio' ? 'vacio' : S.esc));
  }

  function renderDatos() {
    const d = S.data, est = estado(), ef = efectiva();
    const reprog = S.s1 && d.repros.length > 0;
    const todos = eventos();
    const lista = S.ocultarCalc ? todos.filter(e => !e.derivado) : todos;
    const soloEmision = todos.length === 1;
    const nCalc = todos.filter(e => e.derivado).length;

    vista.innerHTML = `${cabeceraPagina(`Historial de la cuota ${d.cuota} de ${d.de}`)}

    <section class="card" aria-labelledby="h-cab">
      <h2 id="h-cab" class="sr-only">Datos de la cuota</h2>
      <dl class="dl-cab">
        <div><dt>Comprobante</dt><dd>${esc(d.numero)} · ${d.sentido}</dd></div>
        <div><dt>Contacto</dt><dd>${esc(d.contacto)}</dd></div>
        <div><dt>N° de cuota</dt><dd>${d.cuota} de ${d.de}</dd></div>
        <div><dt>Importe</dt><dd>${m(d.importe)}</dd></div>
        <div><dt>Saldo</dt><dd class="${est.t === 'VENCIDA' ? 'saldo-venc' : ''}">${m(saldoCorte())}</dd></div>
        <div><dt>Estado</dt><dd><span class="badge ${est.cls}">${est.t}</span>${est.atraso ? ` <span class="ayuda">${est.atraso} días de atraso</span>` : ''}</dd></div>
        <div><dt>${reprog ? 'Vencimiento efectivo' : 'Vencimiento'}</dt><dd>${ef}${reprog ? ` <span class="badge b-reprog">Reprogramada</span>` : ''}</dd></div>
        ${reprog ? `<div><dt>Vencimiento acordado</dt><dd>${d.venc}</dd></div>` : ''}
      </dl>
      <div class="card-pie">
        <p id="corte"><strong>Datos al ${dmy(S.corte.slice(0, 10))}, ${S.corte.slice(11)}</strong> (hora de Lima, UTC−5). Cabecera y eventos corresponden a la misma lectura.</p>
        <button type="button" class="btn btn-sec btn-sm" id="actualizar">↻ Actualizar</button>
      </div>
    </section>

    <section class="sec-historial" aria-labelledby="h-hist">
      <div class="hist-cab">
        <h2 id="h-hist">Línea de tiempo</h2>
        <label class="chk"><input type="checkbox" id="ocultar-calc" ${S.ocultarCalc ? 'checked' : ''} ${nCalc ? '' : 'disabled'}><span>Ocultar transiciones calculadas</span></label>
      </div>
      <ul class="leyenda" aria-label="Leyenda de iconos">
        <li><span class="marca m-reg" aria-hidden="true">●</span> Evento registrado por un usuario</li>
        <li><span class="marca m-der" aria-hidden="true">◇</span> Transición calculada al momento de la consulta</li>
      </ul>
      <p class="ayuda">Ordenado por la fecha del hecho, no por la fecha de registro.</p>

      <ol class="linea" id="linea">${lista.map(itemEvento).join('')}</ol>

      ${soloEmision ? `<div class="vacio-peq" id="vacio-hist">Esta cuota aún no tiene otros movimientos: sin ediciones, reprogramaciones ni pagos.</div>` : ''}
      <p class="nota-fija">Las transiciones calculadas (VENCIDA, CANCELADA, reapertura) no se guardan: se recalculan con los pagos no anulados y las reprogramaciones vigentes. Si se registra un pago retroactivo o se anula un pago, pueden cambiar de fecha o desaparecer.</p>
    </section>`;

    $('#actualizar').addEventListener('click', actualizar);
    $('#ocultar-calc').addEventListener('change', e => { S.ocultarCalc = e.target.checked; renderDatos(); $('#ocultar-calc').focus(); });
  }

  const SIM = { emision: ['＋', 'Emisión'], edicion: ['✎', 'Edición'], repro: ['↻', 'Reprogramación'], pago: ['$', 'Pago'], anulacion: ['⊘', 'Anulación de pago'], vencida: ['!', 'VENCIDA'], cancelada: ['✓', 'CANCELADA'], reapertura: ['↺', 'Reapertura'] };

  function itemEvento(e) {
    const d = S.data, [ic, etq] = SIM[e.tipo];
    let titulo = etq, cuerpo = '', meta = '', extra = '';
    if (e.tipo === 'emision') {
      cuerpo = `<p>Comprobante ${esc(d.numero)} emitido. Cuota ${d.cuota} de ${d.de} por ${m(d.importe)}, vence el ${d.venc}.</p>`;
    } else if (e.tipo === 'edicion') {
      cuerpo = `<p>${esc(e.e.campo)}: <span class="ant">${esc(e.e.ant)}</span> <span aria-label="cambió a">→</span> <strong>${esc(e.e.nuevo)}</strong></p>`;
      meta = reg(e.e.por, e.e.reg);
    } else if (e.tipo === 'repro') {
      titulo = 'Reprogramación del vencimiento';
      cuerpo = `<p>Fecha de vencimiento: <span class="ant">${e.r.ant}</span> <span aria-label="cambió a">→</span> <strong>${e.r.nueva}</strong></p>`;
      meta = reg(e.r.por, e.r.reg);
    } else if (e.tipo === 'pago') {
      const anul = !!e.p.anul;
      titulo = `Pago de <span class="${anul ? 'tachado' : ''}">${m(e.p.importe)}</span>${anul ? ' <span class="badge b-anul">[ANULADO]</span>' : ''}`;
      cuerpo = anul ? `<p class="ayuda">Este pago ya no cuenta para el saldo. Se conserva para que la corrección sea trazable.</p>` : '';
      meta = reg(e.p.por, e.p.reg);
    } else if (e.tipo === 'anulacion') {
      titulo = `Anulación de pago de ${m(e.p.importe)}`;
      cuerpo = `<p>Pago original del ${e.p.fecha}. Motivo: <strong>${esc(e.p.anul.motivo)}</strong></p>`;
      meta = reg(e.p.anul.por, e.p.anul.reg);
    } else if (e.tipo === 'vencida') {
      titulo = 'La cuota pasó a <span class="badge b-venc">VENCIDA</span>';
      cuerpo = `<p>Saldo pendiente: ${m(e.saldo)}.</p>`;
    } else if (e.tipo === 'cancelada') {
      titulo = 'La cuota pasó a <span class="badge b-canc">CANCELADA</span>';
      cuerpo = `<p>Saldo: ${m(0)}. Fecha del último pago no anulado.</p>`;
    } else if (e.tipo === 'reapertura') {
      titulo = `Reapertura: la cuota pasó a <span class="badge ${e.a === 'VENCIDA' ? 'b-venc' : 'b-pend'}">${e.a}</span>`;
      cuerpo = `<p>Se anuló un pago y volvió a haber saldo: ${m(e.saldo)}.</p>`;
    }
    if (e.derivado) extra = '<span class="calc-tag">Calculado</span>';
    return `<li class="ev ${e.derivado ? 'ev-der' : 'ev-reg-i'}">
      <time class="ev-fecha" datetime="${e.fecha}">${e.fecha}</time>
      <div class="ev-rail"><span class="marca ${e.derivado ? 'm-der' : 'm-reg'}" aria-hidden="true">${ic}</span></div>
      <div class="ev-cuerpo"><h3>${titulo} ${extra}</h3>${cuerpo}${meta}</div>
    </li>`;
  }

  /* ---------- Acciones ---------- */
  function ahoraCorte() { return `${HOY} ${new Date().toTimeString().slice(0, 5)}`; }

  function cargar(tipo) {
    S.esc = tipo; S.vista = 'cargando';
    clearTimeout(S.timer);
    render(); anunciar('Cargando el historial…');
    S.timer = setTimeout(() => {
      S.data = crearDatos(tipo); S.vista = tipo; S.corte = '2026-11-09 08:15';
      sincronizarRadio(); render(); $('#h1') && $('#h1').focus();
      anunciar('Historial cargado.');
    }, 900);
  }

  function actualizar() {
    const btn = $('#actualizar');
    btn.setAttribute('aria-disabled', 'true'); btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Actualizando…';
    setTimeout(() => {
      if (S.fallo) {
        S.vista = 'error'; sincronizarRadio(); render(); anunciar('No pudimos actualizar el historial.');
        return;
      }
      S.corte = ahoraCorte(); renderDatos(); $('#actualizar').focus();
      toast('Historial actualizado con un nuevo momento de corte.');
    }, 800);
  }

  function sincronizarRadio() {
    const r = document.querySelector(`input[name="demo-estado"][value="${S.vista}"]`);
    if (r) r.checked = true;
  }

  /* ---------- Eventos ---------- */
  document.addEventListener('click', ev => {
    const a = ev.target.closest('[data-nav]');
    if (a) { ev.preventDefault(); toast(`Navegación simulada: ${a.dataset.nav}`); }
  });
  document.querySelectorAll('input[name="demo-estado"]').forEach(r => r.addEventListener('change', () => {
    const v = r.value;
    if (v === 'cargando') { S.vista = 'cargando'; render(); anunciar('Cargando el historial…'); return; }
    if (v === 'error') { S.vista = 'error'; render(); return; }
    cargar(v);
  }));
  $('#demo-s1').addEventListener('change', e => { S.s1 = e.target.checked; render(); });
  $('#demo-s4').addEventListener('change', e => { S.s4 = e.target.checked; render(); });
  $('#demo-fallo').addEventListener('change', e => { S.fallo = e.target.checked; });
  $('#demo-rol').addEventListener('change', e => { $('#usuario-datos').innerHTML = `<strong>${USUARIOS[e.target.value].split(' · ')[0]}</strong> · ${USUARIOS[e.target.value].split(' · ')[1]}`; });
  $('#demo-tema').addEventListener('change', e => {
    if (e.target.value === 'auto') document.documentElement.removeAttribute('data-tema');
    else document.documentElement.setAttribute('data-tema', e.target.value);
  });

  const side = $('#sidebar'), back = $('#backdrop'), btnMenu = $('#btn-menu');
  function menu(abrir) {
    side.classList.toggle('abierto', abrir); back.hidden = !abrir; btnMenu.setAttribute('aria-expanded', String(abrir));
  }
  btnMenu.addEventListener('click', () => menu(!side.classList.contains('abierto')));
  back.addEventListener('click', () => menu(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && side.classList.contains('abierto')) { menu(false); btnMenu.focus(); } });

  /* ---------- Inicio ---------- */
  $('#demo-rol').dispatchEvent(new Event('change'));
  S.data = crearDatos('completo');
  render();
})();
