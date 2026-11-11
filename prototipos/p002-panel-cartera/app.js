/* P-002 Panel de cartera — VenceYa (prototipo con datos ficticios) */
(() => {
  'use strict';

  // ---------- Utilidades ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SIMB = { PEN: 'S/', USD: 'US$' };
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const money = (v, mon) => `${SIMB[mon]} ${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const num = (v) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
  const dmy = (iso) => { const [y, m, d] = iso.split('-'); return `${d}/${m}`; };
  const dias = (a, b) => Math.round((Date.UTC(...b.split('-').map((x, i) => i === 1 ? x - 1 : +x)) - Date.UTC(...a.split('-').map((x, i) => i === 1 ? x - 1 : +x))) / 864e5);
  const sumaDias = (iso, n) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10); };
  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const pad = (n) => String(n).padStart(2, '0');

  // ---------- Datos de ejemplo ----------
  const HOY = '2026-11-09'; // fecha del corte
  const c = (mon, sentido, contacto, comp, n, N, venc, importe, saldo, x = {}) =>
    ({ mon, sentido, contacto, comp, n, N, venc, importe, saldo, anulado: false, ...x });
  const CUOTAS = [
    // S/ por cobrar
    c('PEN', 'cobrar', 'DISTRIBUIDORA LIMA', 'F001-00045', 1, 3, '2026-10-01', 1000, 600),
    c('PEN', 'cobrar', 'DISTRIBUIDORA LIMA', 'F001-00045', 2, 3, '2026-11-12', 700, 700),
    c('PEN', 'cobrar', 'DISTRIBUIDORA LIMA', 'F001-00045', 3, 3, '2026-12-01', 1400, 1400),
    c('PEN', 'cobrar', 'BODEGA SAN MARTÍN', 'F001-00038', 1, 2, '2026-09-10', 900, 0),
    c('PEN', 'cobrar', 'BODEGA SAN MARTÍN', 'F001-00038', 2, 2, '2026-10-10', 900, 900),
    c('PEN', 'cobrar', 'COMERCIAL ANDINA', 'F001-00031', 1, 1, '2026-10-15', 1200, 1200),
    c('PEN', 'cobrar', 'IMPORTADORA PACÍFICO', 'F001-00040', 1, 2, '2026-10-22', 800, 800),
    c('PEN', 'cobrar', 'IMPORTADORA PACÍFICO', 'F001-00040', 2, 2, '2026-11-23', 1000, 1000),
    c('PEN', 'cobrar', 'MINIMARKET EL SOL', 'F001-00042', 2, 3, '2026-10-03', 500, 0),
    c('PEN', 'cobrar', 'MINIMARKET EL SOL', 'F001-00042', 3, 3, '2026-11-03', 500, 500),
    c('PEN', 'cobrar', 'MINIMARKET EL SOL', 'F001-00053', 1, 2, '2026-11-21', 1200, 1200),
    c('PEN', 'cobrar', 'RESTAURANT LA COSTA', 'F001-00047', 1, 1, '2026-11-06', 500, 500),
    c('PEN', 'cobrar', 'RESTAURANT LA COSTA', 'F001-00054', 1, 2, '2026-12-10', 1000, 1000),
    c('PEN', 'cobrar', 'ELECTRO HOGAR PERÚ', 'F001-00048', 1, 1, '2026-11-10', 400, 400, { reprog: '2026-11-02', por: 'Marcela Quispe' }),
    c('PEN', 'cobrar', 'AGROINDUSTRIAL CHICLAYO', 'F001-00049', 1, 1, '2026-11-14', 500, 500, { reprog: '2026-11-05', por: 'Luis Paredes' }),
    c('PEN', 'cobrar', 'COMERCIAL ANDINA', 'F001-00051', 1, 2, '2026-11-17', 1000, 1000),
    c('PEN', 'cobrar', 'BODEGA SAN MARTÍN', 'F001-00052', 1, 1, '2026-11-18', 800, 800),
    c('PEN', 'cobrar', 'FERRETERÍA NORTE', 'F001-00044', 1, 2, '2026-10-20', 600, 0),
    c('PEN', 'cobrar', 'FERRETERÍA NORTE', 'F001-00050', 1, 1, '2026-11-15', 500, 500, { anulado: true }),
    // S/ por pagar
    c('PEN', 'pagar', 'TEXTILES SUR', 'E001-00012', 1, 2, '2026-10-12', 300, 0),
    c('PEN', 'pagar', 'TEXTILES SUR', 'E001-00012', 2, 2, '2026-11-12', 300, 300, { reprog: '2026-11-05' }),
    c('PEN', 'pagar', 'LOGÍSTICA ANDES', 'E001-00015', 1, 2, '2026-11-20', 900, 900),
    c('PEN', 'pagar', 'PACKING PERÚ', 'E001-00018', 1, 1, '2026-12-05', 800, 800),
    // US$
    c('USD', 'cobrar', 'CORPORACIÓN MINERA ANDES', 'F002-00007', 1, 2, '2026-10-28', 2500, 2500),
    c('USD', 'cobrar', 'CORPORACIÓN MINERA ANDES', 'F002-00007', 2, 2, '2026-11-13', 1800, 1800),
    c('USD', 'cobrar', 'EXPORTADORA COSTA VERDE', 'F002-00009', 1, 1, '2026-11-20', 3200, 3200),
    c('USD', 'cobrar', 'EXPORTADORA COSTA VERDE', 'F002-00005', 1, 1, '2026-10-05', 2000, 0),
    c('USD', 'pagar', 'IMPORT TECH USA', 'E002-00003', 1, 1, '2026-11-11', 1500, 1500),
  ];
  // Estado de pago (ANULADA es condición heredada del comprobante, RN-049)
  CUOTAS.forEach((q) => {
    q.estado = q.anulado ? 'ANULADA' : q.saldo === 0 ? 'CANCELADA' : q.venc < HOY ? 'VENCIDA' : 'PENDIENTE';
  });

  // Tiempo promedio de cobro por mes (días); ausencia = «Sin datos»
  const S5 = { '2026-11': 21.0, '2026-10': 37.5, '2026-09': 41.2, '2026-08': 38.75, '2026-06': 0.0, '2026-05': 44.1, '2026-04': 36.0, '2026-03': 39.4 };

  // ---------- Estado ----------
  const S = {
    estado: 'datos', s1: true, s5: true, mon: 'PEN', ventana: 7, tab: 'grafico', mes: '2026-10',
    filtro: { sentido: 'todos', estado: 'todos', q: '', anuladas: false }, sort: 'def',
    corte: { min: 8 * 60 + 15 }, volver: 'datos',
  };
  try { const v = +localStorage.getItem('vy.p002.ventana'); if ([7, 10, 15].includes(v)) S.ventana = v; } catch (e) { /* sin almacenamiento */ }

  const base = () => (S.estado === 'vacio' ? [] : CUOTAS);
  const deMoneda = (mon) => base().filter((q) => q.mon === mon);
  const noAnuladas = (arr) => arr.filter((q) => !q.anulado);

  // ---------- Render: encabezado, selector de moneda ----------
  function leyenda() {
    const el = $('#leyenda-corte');
    if (S.estado === 'cargando') el.textContent = 'Consultando datos…';
    else if (S.estado === 'error') el.textContent = 'No se pudo obtener el corte.';
    else el.textContent = `Datos al 09/11/2026, ${pad(Math.floor(S.corte.min / 60))}:${pad(S.corte.min % 60)}`;
  }

  function renderMoneda() {
    const otra = S.mon === 'PEN' ? 'USD' : 'PEN';
    const hayVenc = noAnuladas(deMoneda(otra)).some((q) => q.estado === 'VENCIDA');
    $$('.seg-aviso').forEach((e) => { e.hidden = !(hayVenc && e.dataset.aviso === otra); });
    $('#moneda-ayuda').textContent = 'Solo cambia esta consulta.' + (hayVenc ? ` ${SIMB[otra]} tiene cuotas vencidas.` : '');
    $$('input[name="moneda"]').forEach((i) => { i.checked = i.value === S.mon; });
    $$('input[name="ventana"]').forEach((i) => { i.checked = +i.value === S.ventana; });
    $('.lbl-importe').textContent = `Importe (${SIMB[S.mon]})`;
    $('.lbl-saldo').textContent = `Saldo (${SIMB[S.mon]})`;
  }

  // ---------- Indicadores ----------
  const IND = [
    { k: 'vc', t: 'Vencida por cobrar', sentido: 'cobrar', estado: 'VENCIDA', rojo: true },
    { k: 'vp', t: 'Vencida por pagar', sentido: 'pagar', estado: 'VENCIDA', rojo: true },
    { k: 'pc', t: 'Pendiente de cobro', sentido: 'cobrar', estado: 'PENDIENTE' },
    { k: 'pp', t: 'Pendiente de pago', sentido: 'pagar', estado: 'PENDIENTE' },
  ];
  function renderIndicadores() {
    const cont = $('#indicadores');
    if (S.estado === 'cargando') {
      cont.innerHTML = IND.map(() => `<div class="card ind"><div class="skel" style="height:16px;width:60%"></div><div class="skel" style="height:36px;width:80%;margin-top:8px"></div><div class="skel" style="height:14px;width:40%;margin-top:auto"></div></div>`).join('');
      return;
    }
    const rows = noAnuladas(deMoneda(S.mon));
    cont.innerHTML = IND.map((d) => {
      const f = rows.filter((q) => q.sentido === d.sentido && q.estado === d.estado);
      const total = f.reduce((a, q) => a + q.saldo, 0);
      const ver = f.length ? ` · <button class="link" type="button" data-ver="${d.sentido}|${d.estado}" aria-label="Ver ${plural(f.length, 'cuota', 'cuotas')} de ${d.t.toLowerCase()} en el listado">Ver ▸</button>` : '';
      return `<article class="card ind"><h3 class="ind-titulo">${d.t}</h3>
        <p class="ind-valor${d.rojo && total > 0 ? ' rojo' : ''}">${money(total, S.mon)}</p>
        <p class="ind-pie">${plural(f.length, 'cuota', 'cuotas')}${ver}</p></article>`;
    }).join('');
  }

  // ---------- Proyección ----------
  function proyeccion() {
    const rows = noAnuladas(deMoneda(S.mon)).filter((q) => q.saldo > 0);
    return Array.from({ length: S.ventana }, (_, i) => {
      const f = sumaDias(HOY, i);
      const suma = (s) => rows.filter((q) => q.sentido === s && q.venc === f).reduce((a, q) => a + q.saldo, 0);
      return { f, cobros: suma('cobrar'), pagos: suma('pagar') };
    });
  }
  function escala(max) {
    if (max <= 0) return { top: 1000, step: 250 };
    const raw = max / 4, p = Math.pow(10, Math.floor(Math.log10(raw)));
    const m = [1, 2, 2.5, 5, 10].find((x) => x * p >= raw);
    const step = m * p;
    return { top: Math.ceil(max / step) * step, step };
  }
  function renderProy() {
    const cuerpo = $('#proy-cuerpo');
    $('#t-proy').textContent = `Próximos vencimientos (${S.ventana} días)`;
    if (S.estado === 'cargando') {
      cuerpo.dataset.prev = cuerpo.dataset.prev || '';
      $('#grafico-wrap').innerHTML = '<div class="skel" style="height:280px"></div>';
      $('#proy-resumen').innerHTML = '<span class="skel" style="display:block;height:18px;width:60%"></span>';
      return;
    }
    const serie = proyeccion();
    const tc = serie.reduce((a, d) => a + d.cobros, 0), tp = serie.reduce((a, d) => a + d.pagos, 0);
    $('#proy-resumen').textContent = `Total cobros ${S.ventana} días: ${money(tc, S.mon)} · Pagos: ${money(tp, S.mon)}` + (tc + tp === 0 ? ' — Sin vencimientos en la ventana.' : '');
    $('#tabla-proy').innerHTML = `<thead><tr><th scope="col">Día</th><th scope="col" class="num">Cobros</th><th scope="col" class="num">Pagos</th></tr></thead>
      <tbody>${serie.map((d) => `<tr><th scope="row" style="font-weight:400">${d.f}</th><td class="num">${money(d.cobros, S.mon)}</td><td class="num">${money(d.pagos, S.mon)}</td></tr>`).join('')}</tbody>
      <tfoot><tr><th scope="row">Total</th><td class="num">${money(tc, S.mon)}</td><td class="num">${money(tp, S.mon)}</td></tr></tfoot>`;
    dibujarGrafico(serie);
  }
  function dibujarGrafico(serie) {
    const wrap = $('#grafico-wrap'), W = serie.length, mon = S.mon;
    const max = Math.max(0, ...serie.map((d) => Math.max(d.cobros, d.pagos)));
    const { top, step } = escala(max);
    const width = Math.max(wrap.clientWidth || 640, 76 + W * 46), height = 280;
    const L = 68, R = 12, T = 14, B = 34, ph = height - T - B, gw = (width - L - R) / W, bw = Math.min(22, gw * 0.34);
    const y = (v) => T + ph * (1 - v / top);
    let g = '';
    for (let v = 0; v <= top + 1e-6; v += step) {
      g += `<line class="${v === 0 ? 'eje' : 'grid'}" x1="${L}" x2="${width - R}" y1="${y(v)}" y2="${y(v)}"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${SIMB[mon]} ${v.toLocaleString('en-US')}</text>`;
    }
    serie.forEach((d, i) => {
      const x0 = L + i * gw, cx = x0 + gw / 2;
      const lbl = `${dmy(d.f)}: cobros ${money(d.cobros, mon)}, pagos ${money(d.pagos, mon)}`;
      g += `<g class="dia" tabindex="0" role="img" aria-label="${lbl}" data-tip="${dmy(d.f)} · Cobros: ${money(d.cobros, mon)} · Pagos: ${money(d.pagos, mon)}">
        <rect class="hit" x="${x0 + 2}" y="${T}" width="${gw - 4}" height="${ph}"/>
        <rect class="bar bar-cobros" data-tip="${dmy(d.f)} · Cobros: ${money(d.cobros, mon)}" x="${cx - bw - 1}" y="${y(d.cobros)}" width="${bw}" height="${ph * d.cobros / top}" rx="2"/>
        <rect class="bar bar-pagos" data-tip="${dmy(d.f)} · Pagos: ${money(d.pagos, mon)}" x="${cx + 1}" y="${y(d.pagos)}" width="${bw}" height="${ph * d.pagos / top}" rx="2"/>
        <text x="${cx}" y="${height - 12}" text-anchor="middle">${dmy(d.f)}</text></g>`;
    });
    wrap.innerHTML = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" focusable="false" aria-hidden="false">
      <defs><pattern id="trama" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="trama-fondo" width="6" height="6"/><rect class="trama-linea" width="3" height="6"/></pattern></defs>${g}</svg><div class="tip" hidden></div>`;
  }
  function tip(target) {
    const wrap = $('#grafico-wrap'), t = $('.tip', wrap);
    if (!t) return;
    if (!target) { t.hidden = true; return; }
    const r = target.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    t.textContent = target.dataset.tip;
    t.hidden = false;
    t.style.left = `${r.left - w.left + wrap.scrollLeft + r.width / 2}px`;
    t.style.top = `${Math.max(r.top - w.top + wrap.scrollTop - 6, 30)}px`;
  }

  // ---------- Tiempo promedio de cobro (S5) ----------
  function renderS5() {
    const sel = $('#s5-mes');
    if (!sel.options.length) {
      for (let m = 11; m >= 1; m--) {
        const k = `2026-${pad(m)}`;
        sel.add(new Option(`${MESES[m - 1]} 2026${m === 11 ? ' (mes en curso)' : ''}`, k));
      }
    }
    sel.value = S.mes;
    sel.disabled = S.estado === 'cargando';
    const cuerpo = $('#s5-cuerpo');
    if (S.estado === 'cargando') { cuerpo.innerHTML = '<div class="skel" style="height:36px;width:60%"></div>'; return; }
    const v = S.estado === 'vacio' ? undefined : S5[S.mes];
    const parcial = S.mes === '2026-11';
    cuerpo.innerHTML = `<div class="s5-cuerpo-in">
      ${v === undefined ? '<p class="s5-valor sin">Sin datos</p>' : `<p class="s5-valor">${v.toFixed(2)} días</p>`}
      ${parcial ? '<span class="badge b-reprog">Mes en curso — datos parciales</span>' : ''}
      <p class="ayuda">Incluye comprobantes en S/ y US$. No depende del selector de moneda.</p></div>`;
  }

  // ---------- Promesas (S1) ----------
  function renderPromesas() {
    const cuerpo = $('#prom-cuerpo');
    if (S.estado === 'cargando') { cuerpo.innerHTML = '<div class="skel" style="height:48px"></div>'; return; }
    const prom = base().filter((q) => q.sentido === 'cobrar' && q.reprog && !q.anulado && q.saldo > 0).sort((a, b) => a.venc.localeCompare(b.venc));
    if (!prom.length) { cuerpo.innerHTML = '<p class="sin-prom">No hay promesas activas.</p>'; return; }
    cuerpo.innerHTML = `<div class="tabla-wrap"><table class="tabla tabla-prom" role="table"><thead role="rowgroup"><tr role="row">
      <th scope="col" role="columnheader">Contacto</th><th scope="col" role="columnheader">Comprobante · cuota</th><th scope="col" role="columnheader">Vencimiento original</th><th scope="col" role="columnheader">Promesa</th><th scope="col" role="columnheader" class="num">Saldo</th><th scope="col" role="columnheader">Registró</th></tr></thead>
      <tbody role="rowgroup">${prom.map((q) => `<tr role="row">
        <td role="cell" class="contacto" data-label="Contacto">${esc(q.contacto)}</td>
        <td role="cell" data-label="Comprobante · cuota"><button class="link" type="button" data-comp="${q.comp}">${q.comp}</button> · ${q.n}/${q.N}</td>
        <td role="cell" data-label="Vencimiento original">${q.reprog}</td>
        <td role="cell" data-label="Promesa">${q.venc}</td>
        <td role="cell" class="num" data-label="Saldo">${money(q.saldo, q.mon)}</td>
        <td role="cell" data-label="Registró">${esc(q.por)}</td></tr>`).join('')}</tbody></table></div>`;
  }

  // ---------- Listado de movimientos ----------
  const BADGE = { VENCIDA: 'b-vencida', PENDIENTE: 'b-pendiente', CANCELADA: 'b-cancelada', ANULADA: 'b-anulada' };
  const GRUPO = { VENCIDA: 0, PENDIENTE: 1, CANCELADA: 2, ANULADA: 2 };
  function ordenar(arr) {
    const [k, dir] = S.sort.split('-'), s = dir === 'desc' ? -1 : 1;
    const cmp = {
      def: (a, b) => GRUPO[a.estado] - GRUPO[b.estado] || a.venc.localeCompare(b.venc) || a.comp.localeCompare(b.comp),
      venc: (a, b) => s * a.venc.localeCompare(b.venc),
      importe: (a, b) => s * (a.importe - b.importe),
      saldo: (a, b) => s * ((a.anulado ? -1 : a.saldo) - (b.anulado ? -1 : b.saldo)),
      contacto: (a, b) => s * a.contacto.localeCompare(b.contacto, 'es'),
    }[k === 'def' ? 'def' : k];
    return [...arr].sort(cmp);
  }
  function renderMov() {
    const tbody = $('#mov-cuerpo'), vacio = $('#mov-vacio'), wrap = $('#mov-tabla-wrap'), cuenta = $('#mov-cuenta');
    const m = SIMB[S.mon];
    if (S.estado === 'cargando') {
      wrap.hidden = false; vacio.hidden = true; cuenta.textContent = 'Cargando movimientos…';
      tbody.innerHTML = Array.from({ length: 6 }, () => `<tr role="row"><td role="cell" colspan="9"><div class="skel" style="height:20px"></div></td></tr>`).join('');
      return;
    }
    const f = S.filtro;
    const universo = deMoneda(S.mon).filter((q) => f.anuladas || !q.anulado);
    const q = norm(f.q.trim());
    const filas = ordenar(universo.filter((r) =>
      (f.sentido === 'todos' || r.sentido === f.sentido) &&
      (f.estado === 'todos' || r.estado === f.estado) &&
      (!q || norm(r.contacto).includes(q) || norm(r.comp).includes(q))));
    const filtrado = filas.length !== universo.length;
    cuenta.textContent = filtrado ? `${filas.length} de ${plural(universo.length, 'cuota', 'cuotas')} en ${m}` : `${plural(universo.length, 'cuota', 'cuotas')} en ${m}`;

    if (!filas.length) {
      wrap.hidden = true; vacio.hidden = false;
      vacio.innerHTML = universo.length
        ? `<strong>Ningún movimiento coincide con los filtros.</strong><p>Prueba con otro contacto o comprobante, o quita algún filtro.</p><button class="btn btn-sec" type="button" id="limpiar">Limpiar filtros</button>`
        : `<strong>Aún no hay cuotas en ${m}.</strong><p>Cuando registres comprobantes a crédito, sus cuotas aparecerán aquí para que priorices cobros y pagos.</p><button class="btn btn-prim" type="button" data-nav="P-006 Registrar comprobante">Registrar comprobante</button>`;
    } else {
      wrap.hidden = false; vacio.hidden = true;
      tbody.innerHTML = filas.map((r) => {
        const atraso = r.estado === 'VENCIDA' ? plural(dias(r.venc, HOY), 'día', 'días') : '—';
        const reprog = S.s1 && r.reprog ? `<span class="badge b-reprog" title="Vencimiento original: ${r.reprog}">Reprogramada</span>` : '';
        const saldo = r.anulado ? '—' : num(r.saldo);
        return `<tr role="row"${r.anulado ? ' class="fila-anulada"' : ''}>
          <td role="cell" data-label="Sentido"><span class="sent"><span aria-hidden="true">${r.sentido === 'cobrar' ? '↓' : '↑'}</span> ${r.sentido === 'cobrar' ? 'Cobrar' : 'Pagar'}</span></td>
          <td role="cell" class="contacto" data-label="Contacto">${esc(r.contacto)}</td>
          <td role="cell" class="comp" data-label="Comprobante"><button class="link" type="button" data-comp="${r.comp}" aria-label="Abrir comprobante ${r.comp}">${r.comp} ▸</button>${r.anulado ? ' <span class="muted">(ANULADO)</span>' : ''}</td>
          <td role="cell" data-label="Cuota">${r.n}/${r.N}</td>
          <td role="cell" data-label="Vencimiento">${r.venc}</td>
          <td role="cell" class="num" data-label="Importe (${m})">${num(r.importe)}</td>
          <td role="cell" class="num" data-label="Saldo (${m})">${saldo}</td>
          <td role="cell" data-label="Estado"><span class="estado-celda"><span class="badge ${BADGE[r.estado]}">${r.estado}</span>${reprog}</span></td>
          <td role="cell" class="num" data-label="Atraso">${atraso}</td></tr>`;
      }).join('');
    }
    // aria-sort en encabezados
    const [k, dir] = S.sort.split('-');
    $$('.th-btn').forEach((b) => {
      const activo = b.dataset.sort === k && S.sort !== 'def';
      b.closest('th').setAttribute('aria-sort', activo ? (dir === 'asc' ? 'ascending' : 'descending') : 'none');
      $('.sort-ic', b).textContent = activo ? (dir === 'asc' ? '↑' : '↓') : '↕';
    });
    $('#f-orden').value = S.sort;
  }

  // ---------- Render general ----------
  function renderAll() {
    const e = S.estado;
    const cargando = e === 'cargando', error = e === 'error';
    $('#alerta-error').hidden = !error;
    $('#panel').hidden = error;
    $('#contenido').setAttribute('aria-busy', cargando);
    $('#card-promesas').hidden = !S.s1;
    $('#card-s5').hidden = !S.s5;
    $('#fila2').classList.toggle('sin-s5', !S.s5);
    $$('#controles input, #filtros input, #filtros select').forEach((i) => { i.disabled = cargando; });
    const btn = $('#btn-actualizar');
    btn.setAttribute('aria-disabled', cargando);
    $('#btn-actualizar-txt').textContent = cargando ? 'Actualizando…' : 'Actualizar';
    btn.firstElementChild.className = cargando ? 'spinner' : '';
    btn.firstElementChild.textContent = cargando ? '' : '⟳';
    leyenda(); renderMoneda();
    if (error) return;
    renderIndicadores(); renderProy(); renderS5(); renderPromesas(); renderMov();
    // Opción «Anulada» del filtro de estado solo con el switch activo
    const fe = $('#f-estado');
    const tiene = [...fe.options].some((o) => o.value === 'ANULADA');
    if (S.filtro.anuladas && !tiene) fe.add(new Option('Anulada', 'ANULADA'));
    if (!S.filtro.anuladas && tiene) { fe.remove([...fe.options].findIndex((o) => o.value === 'ANULADA')); }
    fe.value = S.filtro.estado;
  }
  function setEstado(e) {
    S.estado = e;
    $$('input[name="demo-estado"]').forEach((i) => { i.checked = i.value === e; });
    renderAll();
  }

  // ---------- Utilidades de UI ----------
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    $('#toasts').append(t);
    setTimeout(() => t.remove(), 5000);
  }
  function navSimulada(destino) {
    $('#dlg-texto').textContent = `Aquí se abriría: ${destino}.`;
    $('#dlg-nav').showModal();
  }
  function actualizar() {
    if (S.estado === 'cargando') return;
    S.volver = S.estado === 'error' ? 'datos' : S.estado;
    setEstado('cargando');
    setTimeout(() => {
      S.corte.min += 2; // nuevo corte
      setEstado(S.volver);
      leyenda();
      $('#anuncio').textContent = `Panel actualizado. ${$('#leyenda-corte').textContent}.`;
      toast('Panel actualizado con un nuevo corte.');
    }, 1200);
  }

  // ---------- Eventos ----------
  $('#btn-actualizar').addEventListener('click', actualizar);
  $('#btn-reintentar').addEventListener('click', actualizar);
  $$('input[name="demo-estado"]').forEach((i) => i.addEventListener('change', () => setEstado(i.value)));
  $('#demo-s1').addEventListener('change', (e) => { S.s1 = e.target.checked; renderAll(); });
  $('#demo-s5').addEventListener('change', (e) => { S.s5 = e.target.checked; renderAll(); });
  $('#demo-rol').addEventListener('change', (e) => { $('#usuario-rol').textContent = e.target.value; });
  $('#demo-tema').addEventListener('change', (e) => {
    if (e.target.value === 'auto') document.documentElement.removeAttribute('data-tema');
    else document.documentElement.dataset.tema = e.target.value;
    renderAll();
  });

  $$('input[name="moneda"]').forEach((i) => i.addEventListener('change', () => { S.mon = i.value; renderAll(); }));
  $$('input[name="ventana"]').forEach((i) => i.addEventListener('change', () => {
    S.ventana = +i.value; // solo 7, 10 o 15 (RN-180)
    try { localStorage.setItem('vy.p002.ventana', S.ventana); } catch (e) { /* sin almacenamiento */ }
    renderAll();
    toast(`Ventana de ${S.ventana} días guardada como tu preferencia.`);
  }));
  $('#s5-mes').addEventListener('change', (e) => { S.mes = e.target.value; renderS5(); });

  // Pestañas Gráfico | Tabla
  function tab(nombre, foco) {
    S.tab = nombre;
    ['grafico', 'tabla'].forEach((n) => {
      const t = $(`#tab-${n}`), sel = n === nombre;
      t.setAttribute('aria-selected', sel); t.tabIndex = sel ? 0 : -1;
      $(`#pnl-${n}`).hidden = !sel;
      if (sel && foco) t.focus();
    });
    if (nombre === 'grafico' && S.estado !== 'cargando') renderProy();
  }
  $$('[role="tab"]').forEach((t) => {
    t.addEventListener('click', () => tab(t.id.replace('tab-', ''), false));
    t.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      tab(e.key === 'ArrowLeft' || e.key === 'Home' ? 'grafico' : 'tabla', true);
    });
  });

  // Tooltips del gráfico
  const gw = $('#grafico-wrap');
  gw.addEventListener('mouseover', (e) => { const b = e.target.closest('.bar'); if (b) tip(b); });
  gw.addEventListener('mouseout', (e) => { if (e.target.closest('.bar')) tip(null); });
  gw.addEventListener('focusin', (e) => { const d = e.target.closest('.dia'); if (d) tip(d); });
  gw.addEventListener('focusout', () => tip(null));

  // Filtros del listado
  $('#f-sentido').addEventListener('change', (e) => { S.filtro.sentido = e.target.value; renderMov(); });
  $('#f-estado').addEventListener('change', (e) => { S.filtro.estado = e.target.value; renderMov(); });
  $('#f-buscar').addEventListener('input', (e) => { S.filtro.q = e.target.value; renderMov(); });
  $('#f-orden').addEventListener('change', (e) => { S.sort = e.target.value; renderMov(); });
  $('#f-anuladas').addEventListener('change', (e) => {
    S.filtro.anuladas = e.target.checked;
    if (!e.target.checked && S.filtro.estado === 'ANULADA') S.filtro.estado = 'todos';
    renderAll();
  });

  // Ordenar desde encabezados: asc → desc → predeterminado
  $$('.th-btn').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.sort, [ak, ad] = S.sort.split('-');
    S.sort = ak !== k ? `${k}-asc` : ad === 'asc' ? `${k}-desc` : 'def';
    renderMov();
  }));

  // Delegación: «Ver ▸», comprobantes, limpiar filtros, navegación simulada
  document.addEventListener('click', (e) => {
    const ver = e.target.closest('[data-ver]');
    if (ver) {
      const [sentido, estado] = ver.dataset.ver.split('|');
      Object.assign(S.filtro, { sentido, estado, q: '' });
      $('#f-sentido').value = sentido; $('#f-buscar').value = '';
      renderMov();
      const h = $('#titulo-movimientos');
      h.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      h.focus({ preventScroll: true });
      return;
    }
    const comp = e.target.closest('[data-comp]');
    if (comp) { navSimulada(`P-006 Detalle del comprobante ${comp.dataset.comp}`); return; }
    if (e.target.closest('#limpiar')) {
      Object.assign(S.filtro, { sentido: 'todos', estado: 'todos', q: '' });
      $('#f-sentido').value = 'todos'; $('#f-buscar').value = '';
      renderAll();
      return;
    }
    const nav = e.target.closest('[data-nav]');
    if (nav) { e.preventDefault(); cerrarMenu(); navSimulada(nav.dataset.nav); }
  });
  $('#dlg-cerrar').addEventListener('click', () => $('#dlg-nav').close());
  $('[data-nav-actual]').addEventListener('click', (e) => { e.preventDefault(); cerrarMenu(); });

  // Menú móvil
  function cerrarMenu() { $('#sidebar').classList.remove('abierto'); $('#backdrop').hidden = true; $('#btn-menu').setAttribute('aria-expanded', 'false'); }
  $('#btn-menu').addEventListener('click', () => {
    const abrir = !$('#sidebar').classList.contains('abierto');
    $('#sidebar').classList.toggle('abierto', abrir); $('#backdrop').hidden = !abrir;
    $('#btn-menu').setAttribute('aria-expanded', abrir);
  });
  $('#backdrop').addEventListener('click', cerrarMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarMenu(); });

  // Reajustar el gráfico al cambiar el ancho
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (S.estado === 'datos' || S.estado === 'vacio') renderProy(); }, 150); });

  renderAll();
})();
