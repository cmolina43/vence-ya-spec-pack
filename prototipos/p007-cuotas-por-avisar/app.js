/* P-007 Cuotas por avisar — VenceYa (prototipo con datos ficticios) */
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const dias = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
  const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;

  const HOY = '2026-11-09';
  const USUARIOS = {
    OPERADOR: { n: 'LUIS', etq: '<strong>Luis Paz</strong> · Operador' },
    SUPERVISOR: { n: 'ANA', etq: '<strong>Ana Torres</strong> · Supervisor' },
    ADMINISTRADOR: { n: 'ROSA', etq: '<strong>Rosa Vega</strong> · Administrador' }
  };
  const CONTACTOS = {
    'DISTRIBUIDORA LIMA': { correo: 'ventas@distlima.example', nuevo: 'cobranzas@distlima.example', activo: true },
    'INVERSIONES PACÍFICO': { correo: 'cobranzas@pacifico.example', nuevo: 'tesoreria@pacifico.example', activo: true },
    'CONSTRUCTORA ANDINA': { correo: 'tesoreria@constructoraandina.example', nuevo: 'pagos@constructoraandina.example', activo: true },
    'MOLINOS DEL CENTRO': { correo: 'administracion@molinoscentro.example', nuevo: 'ventas@molinoscentro.example', activo: true },
    'TEXTILES SUR': { correo: 'contabilidad@textilessur.example', nuevo: 'finanzas@textilessur.example', activo: false },
    'FERRETERÍA NORTE': { correo: 'compras@ferrenorte.example', nuevo: 'gerencia@ferrenorte.example', activo: true }
  };
  const EMPRESA = {
    admin: 'admin@rios.example',
    copiaCobrar: ['jefe.cobranzas@rios.example'],
    copiaPagar: [] /* RN-178: lista vacía → solo el correo administrativo */
  };

  const S = {
    vista: 'datos', refresh: false, rol: 'SUPERVISOR', s1: true, res: 'ok', simCancel: false,
    minuto: 15, refrescos: 0, cuotas: [], sel: new Set(), comentario: '', alerta: 0, D: null,
    f: { sentido: '', estado: '', aviso: '', moneda: '', q: '' }
  };

  /* ---------- Datos ficticios ---------- */
  function crearCuotas() {
    const c = (id, sentido, contacto, comp, n, N, venc, saldo, mon, extra) =>
      Object.assign({ id, sentido, contacto, comp, n, N, venc, saldo, mon, promesa: null, aviso: null, enviando: false, cancelada: false }, extra || {});
    return [
      c(1, 'Cobrar', 'DISTRIBUIDORA LIMA', 'F001-00045', 1, 3, '2026-10-28', 600, 'S/'),
      c(2, 'Cobrar', 'DISTRIBUIDORA LIMA', 'F001-00045', 2, 3, '2026-11-04', 333.33, 'S/',
        { aviso: { fecha: '2026-11-05 09:10', por: 'ANA', tipo: 'Cobrar-V', venc: '2026-11-04' } }),
      c(3, 'Cobrar', 'CONSTRUCTORA ANDINA', 'F001-00044', 1, 2, '2026-11-03', 1500, 'S/'),
      c(4, 'Pagar', 'MOLINOS DEL CENTRO', 'E001-00009', 1, 2, '2026-11-02', 850, 'S/'),
      c(5, 'Cobrar', 'INVERSIONES PACÍFICO', 'F001-00052', 1, 2, '2026-11-06', 2450, 'S/',
        { aviso: { fecha: '2026-11-02 08:40', por: 'LUIS', tipo: 'Cobrar-P', venc: '2026-11-06' } }),
      c(6, 'Cobrar', 'CONSTRUCTORA ANDINA', 'F001-00058', 1, 1, '2026-11-07', 1800, 'US$', { promesa: '2026-11-20' }),
      c(7, 'Pagar', 'TEXTILES SUR', 'E001-00012', 2, 2, '2026-11-12', 300, 'US$'),
      c(8, 'Cobrar', 'DISTRIBUIDORA LIMA', 'F001-00051', 1, 2, '2026-11-15', 900, 'S/'),
      c(9, 'Cobrar', 'CONSTRUCTORA ANDINA', 'F001-00063', 1, 2, '2026-11-25', 2200, 'US$'),
      c(10, 'Pagar', 'MOLINOS DEL CENTRO', 'E001-00009', 2, 2, '2026-12-02', 850, 'S/'),
      c(11, 'Cobrar', 'FERRETERÍA NORTE', 'F001-00061', 1, 1, '2026-12-20', 1200, 'S/', { enviando: true })
    ];
  }
  function reiniciar() {
    S.cuotas = crearCuotas();
    S.sel = new Set([1, 2]);
    S.comentario = 'Favor confirmar fecha de pago';
    S.f = { sentido: '', estado: '', aviso: '', moneda: '', q: '' };
    S.minuto = 15; S.refrescos = 0; S.alerta = 0; S.D = null; S.simCancel = false;
    $('#demo-cancel').checked = false;
  }

  /* ---------- Cálculos ---------- */
  const porId = id => S.cuotas.find(c => c.id === id);
  const vencida = c => dias(c.venc, HOY) > 0;
  const tipoKey = c => `${c.sentido}-${vencida(c) ? 'V' : 'P'}`;
  const tipoTxt = k => ({ 'Cobrar-V': 'Por cobrar vencida', 'Cobrar-P': 'Por cobrar por vencer', 'Pagar-V': 'Por pagar vencida', 'Pagar-P': 'Por pagar por vencer' }[k]);
  const monto = c => `${c.mon} ${fmt(c.saldo)}`;
  const ahora = () => `${HOY} 08:${String(S.minuto).padStart(2, '0')}`;
  const cabFecha = () => `09/11/2026, 08:${String(S.minuto).padStart(2, '0')}`;
  /* RN-045: aviso Enviado del mismo tipo y misma fecha efectiva → exige «Reenviar aviso» */
  const requiereReenvio = c => !!c.aviso && c.aviso.tipo === tipoKey(c) && c.aviso.venc === c.venc;
  const usuario = () => USUARIOS[S.rol];
  /* RN-120: vencidas (antigua primero) y luego pendientes (la que vence antes primero) */
  const ordenadas = () => S.cuotas.filter(c => !c.cancelada).slice().sort((a, b) =>
    (vencida(b) - vencida(a)) || a.venc.localeCompare(b.venc) || a.comp.localeCompare(b.comp) || a.n - b.n);
  const normalizar = t => t.trim().toUpperCase();

  function visibles() {
    const f = S.f, q = f.q.trim().toLowerCase();
    return ordenadas().filter(c =>
      (!f.sentido || c.sentido === f.sentido) &&
      (!f.estado || (f.estado === 'VENCIDA') === vencida(c)) &&
      (!f.aviso || (f.aviso === 'enviado' ? !!c.aviso && !c.enviando : !c.aviso && !c.enviando)) &&
      (!f.moneda || c.mon === f.moneda) &&
      (!q || c.contacto.toLowerCase().includes(q)));
  }

  /* ---------- Utilidades de UI ---------- */
  function anunciar(t) { $('#anuncio').textContent = ''; setTimeout(() => { $('#anuncio').textContent = t; }, 50); }
  function toast(t) {
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = t;
    $('#toasts').append(el);
    setTimeout(() => el.remove(), 5000);
  }
  const navegar = destino => toast(`Navegación simulada: ${destino}`);

  /* ---------- Vista principal ---------- */
  const vista = $('#vista');

  function cabeceraHTML(deshabilitar) {
    return `
      <div class="page-head">
        <h1 id="h1" tabindex="-1">Cuotas por avisar</h1>
        <div class="head-der">
          <span class="ayuda">Datos al ${cabFecha()}</span>
          <button class="btn btn-sec ${deshabilitar ? 'cargando' : ''}" type="button" data-act="actualizar" ${deshabilitar ? 'aria-disabled="true"' : ''}>⟳ Actualizar</button>
        </div>
      </div>
      <div class="intro">
        <p class="ayuda">Incluye todas las cuotas pendientes y vencidas con saldo. El envío es manual y solo por correo.</p>
        <button class="link" type="button" data-act="bandeja">Ver bandeja ▸</button>
      </div>`;
  }

  function renderVista() {
    const v = S.refresh ? 'cargando' : S.vista;
    if (v === 'cargando') {
      vista.innerHTML = `${cabeceraHTML(true)}
        <div role="status" aria-label="Cargando cuotas por avisar"><div class="skel skel-bloque"></div></div>
        <div class="skel-tabla" aria-hidden="true">${'<span class="skel"></span><span class="skel" style="width:70%"></span>'.repeat(5)}</div>`;
      return;
    }
    if (v === 'error') {
      vista.innerHTML = `${cabeceraHTML(false)}
        <div class="alert" role="alert">
          <span class="alert-ic" aria-hidden="true">⚠</span>
          <div><strong>No se pudo cargar la lista de cuotas por avisar.</strong>
          <p>Verifica tu conexión e inténtalo de nuevo. Si el problema continúa, contacta al administrador.</p></div>
          <button class="btn btn-sec" type="button" data-act="reintentar-carga">Reintentar</button>
        </div>`;
      return;
    }
    if (v === 'vacio') {
      vista.innerHTML = `${cabeceraHTML(false)}
        <div class="vacio">
          <strong>No hay cuotas por avisar</strong>
          <p>Todas las cuotas pendientes o vencidas con saldo aparecerán aquí. Cuando registres comprobantes con cuotas por cobrar o por pagar, podrás avisar a los contactos desde esta pantalla.</p>
          <button class="btn btn-sec" type="button" data-act="actualizar">⟳ Actualizar</button>
        </div>`;
      return;
    }
    vista.innerHTML = `${cabeceraHTML(false)}
      <div id="alerta"></div>
      <form class="filtros" role="search" aria-label="Filtros de cuotas" onsubmit="return false">
        <div class="campo"><label for="f-sentido">Sentido</label>
          <select id="f-sentido"><option value="">Todos</option><option value="Cobrar">Por cobrar</option><option value="Pagar">Por pagar</option></select></div>
        <div class="campo"><label for="f-estado">Estado</label>
          <select id="f-estado"><option value="">Todos</option><option value="VENCIDA">Vencida</option><option value="PENDIENTE">Pendiente</option></select></div>
        <div class="campo"><label for="f-aviso">Aviso</label>
          <select id="f-aviso"><option value="">Todos</option><option value="no">No enviado</option><option value="enviado">Enviado</option></select></div>
        <div class="campo"><label for="f-moneda">Moneda</label>
          <select id="f-moneda"><option value="">Todas</option><option value="S/">S/</option><option value="US$">US$</option></select></div>
        <div class="campo campo-buscar"><label for="f-q">Contacto</label>
          <input type="search" id="f-q" placeholder="Buscar contacto…" autocomplete="off"></div>
      </form>
      <p class="cuenta" id="cuenta" role="status" aria-live="polite"></p>
      <div id="lista"></div>
      <section class="barra" id="barra" role="region" aria-label="Envío de avisos" hidden>
        <div class="barra-fila">
          <strong id="barra-txt"></strong>
          <button class="btn btn-sec btn-sm" type="button" data-act="limpiar">Limpiar selección</button>
        </div>
        <div class="campo">
          <label for="comentario">Comentario (opcional)</label>
          <div class="con-contador">
            <input type="text" id="comentario" autocomplete="off" aria-describedby="com-ayuda" placeholder="Ej.: Favor confirmar fecha de pago">
            <span class="contador" id="contador" aria-hidden="true"></span>
          </div>
          <p class="ayuda" id="com-ayuda">Hasta 500 caracteres. Se enviará en mayúsculas, sin espacios al inicio ni al final.</p>
          <p class="error" id="com-error" role="alert" hidden></p>
        </div>
        <div class="barra-acc"><button class="btn btn-prim" type="button" id="btn-enviar" data-act="enviar"></button></div>
      </section>`;
    $('#f-sentido').value = S.f.sentido; $('#f-estado').value = S.f.estado; $('#f-aviso').value = S.f.aviso;
    $('#f-moneda').value = S.f.moneda; $('#f-q').value = S.f.q;
    $('#comentario').value = S.comentario;
    renderAlerta();
    actualizarLista();
  }

  function renderAlerta() {
    const el = $('#alerta'); if (!el) return;
    el.innerHTML = S.alerta ? `
      <div class="alert" role="alert">
        <span class="alert-ic" aria-hidden="true">⚠</span>
        <div><strong>El aviso no se envió. Puedes volver a intentar.</strong>
        <p>${plural(S.alerta, 'correo quedó', 'correos quedaron')} como «No Enviado». Las cuotas siguen seleccionadas y no se hicieron reintentos automáticos.</p></div>
        <button class="btn btn-sec" type="button" data-act="reintentar-alerta">Volver a intentar</button>
      </div>` : '';
  }

  /* ---------- Lista ---------- */
  function avisoHTML(c) {
    if (c.enviando) {
      return `<span class="badge b-pend"><span class="spinner" aria-hidden="true"></span>Enviando…</span>` +
        (c.aviso ? `<small>Último: ${c.aviso.fecha} por ${esc(c.aviso.por)}</small>` : '');
    }
    if (c.aviso) return `<span class="badge b-enviado">Enviado · ${c.aviso.fecha}</span><small>por ${esc(c.aviso.por)}</small>`;
    return '<span class="badge b-noenv">No Enviado</span>';
  }

  function filaHTML(c, nContacto) {
    const ct = CONTACTOS[c.contacto], marcada = S.sel.has(c.id), venc = vencida(c);
    const todasContacto = ordenadas().filter(x => x.contacto === c.contacto && !x.enviando);
    const todasMarcadas = todasContacto.every(x => S.sel.has(x.id));
    const etiqueta = `Seleccionar cuota ${c.n} de ${c.N} del comprobante ${c.comp}, ${c.contacto}`;
    return `<tr class="${marcada ? 'sel' : ''} ${c.enviando ? 'bloq' : ''}" data-id="${c.id}">
      <td class="c-sel"><label class="chk-cel">
        <input type="checkbox" data-sel="${c.id}" aria-label="${esc(etiqueta)}" ${marcada ? 'checked' : ''} ${c.enviando ? 'disabled title="Envío en curso"' : ''}>
        <span class="lbl-m">Seleccionar</span></label></td>
      <td data-label="Sentido"><div><span class="sentido">${c.sentido === 'Cobrar' ? 'Cobrar' : 'Pagar'}</span></div></td>
      <td class="contacto" data-label="Contacto"><div><strong>${esc(c.contacto)}</strong>
        ${ct.activo ? '' : '<small>(desactivado)</small>'}
        ${nContacto > 1 && !c.enviando ? `<button class="link link-inline" type="button" data-contacto="${esc(c.contacto)}">${todasMarcadas ? 'Quitar contacto' : 'Seleccionar contacto'}<span class="sr-only"> ${esc(c.contacto)}: todas sus cuotas</span></button>` : ''}</div></td>
      <td class="numero" data-label="Comprobante"><div><a href="#" data-comp="${esc(c.comp)}">${esc(c.comp)}</a></div></td>
      <td data-label="Cuota"><div>${c.n}/${c.N}</div></td>
      <td class="venc fecha" data-label="Vencimiento"><div>${c.venc}
        ${S.s1 && c.promesa ? `<span class="badge b-prom">Promesa: ${c.promesa}</span>` : ''}
        ${S.s1 ? `<button class="link link-inline" type="button" data-reprog="${c.id}">Reprogramar<span class="sr-only"> cuota ${c.n} de ${esc(c.comp)}</span></button>` : ''}</div></td>
      <td class="num" data-label="Saldo"><div>${monto(c)}</div></td>
      <td class="estado" data-label="Estado"><div><span class="badge ${venc ? 'b-venc' : 'b-pend'}">${venc ? 'VENCIDA' : 'PENDIENTE'}</span>
        <small>${venc ? `Vencida · ${plural(dias(c.venc, HOY), 'día', 'días')} de atraso` : 'Por vencer'}</small></div></td>
      <td class="aviso" data-label="Aviso"><div>${avisoHTML(c)}</div></td>
    </tr>`;
  }

  function actualizarLista() {
    const cont = $('#lista'); if (!cont) return;
    const todas = ordenadas(), vis = visibles();
    $('#cuenta').textContent = vis.length === todas.length
      ? `${plural(todas.length, 'cuota', 'cuotas')} por avisar.`
      : `Mostrando ${vis.length} de ${plural(todas.length, 'cuota', 'cuotas')}.`;
    if (!todas.length) {
      cont.innerHTML = `<div class="vacio"><strong>No hay cuotas por avisar</strong><p>Ya no quedan cuotas pendientes o vencidas con saldo.</p></div>`;
    } else if (!vis.length) {
      cont.innerHTML = `<div class="vacio"><strong>Ninguna cuota coincide con los filtros</strong>
        <p>Prueba con otros criterios o limpia los filtros para ver todas las cuotas.</p>
        <button class="btn btn-sec" type="button" data-act="limpiar-filtros">Limpiar filtros</button></div>`;
    } else {
      const cuentaContacto = {};
      vis.filter(c => !c.enviando).forEach(c => { cuentaContacto[c.contacto] = (cuentaContacto[c.contacto] || 0) + 1; });
      cont.innerHTML = `<div class="tabla-wrap"><table class="tabla">
        <caption class="sr-only">Cuotas pendientes y vencidas con saldo, vencidas primero</caption>
        <thead><tr>
          <th scope="col" class="c-sel"><label class="chk-cel"><input type="checkbox" id="chk-todas" aria-label="Seleccionar todas las cuotas visibles"><span class="lbl-m">Seleccionar todas las visibles</span></label></th>
          <th scope="col">Sentido</th><th scope="col">Contacto</th><th scope="col">Comprobante</th><th scope="col">Cuota</th>
          <th scope="col">Vencimiento</th><th scope="col" class="num">Saldo</th><th scope="col">Estado</th><th scope="col">Aviso</th>
        </tr></thead>
        <tbody>${vis.map(c => filaHTML(c, cuentaContacto[c.contacto] || 0)).join('')}</tbody></table></div>`;
      const aptas = vis.filter(c => !c.enviando), marcadas = aptas.filter(c => S.sel.has(c.id)).length;
      const chk = $('#chk-todas');
      chk.checked = aptas.length > 0 && marcadas === aptas.length;
      chk.indeterminate = marcadas > 0 && marcadas < aptas.length;
      chk.disabled = !aptas.length;
    }
    actualizarBarra();
  }

  function errorComentario() {
    return S.comentario.length > 500
      ? `El comentario tiene ${S.comentario.length} caracteres y el máximo es 500. Redúcelo: el sistema no lo recorta automáticamente.` : '';
  }

  function actualizarBarra() {
    const barra = $('#barra'); if (!barra) return;
    const ids = [...S.sel].filter(id => porId(id) && !porId(id).cancelada);
    S.sel = new Set(ids);
    barra.hidden = ids.length === 0;
    if (!ids.length) return;
    const contactos = new Set(ids.map(id => porId(id).contacto)).size;
    $('#barra-txt').textContent = `${plural(ids.length, 'cuota seleccionada', 'cuotas seleccionadas')} de ${plural(contactos, 'contacto', 'contactos')}`;
    const n = S.comentario.length, err = errorComentario();
    const cont = $('#contador');
    cont.textContent = `${n}/500`; cont.classList.toggle('excede', n > 500);
    $('#comentario').setAttribute('aria-invalid', err ? 'true' : 'false');
    const e = $('#com-error'); e.hidden = !err; e.textContent = err;
    const btn = $('#btn-enviar');
    const enProceso = !!S.D && S.D.fase === 'enviando';
    btn.setAttribute('aria-disabled', (err || enProceso) ? 'true' : 'false');
    btn.classList.toggle('cargando', enProceso);
    btn.innerHTML = enProceso ? '<span class="spinner" aria-hidden="true"></span>Enviando…' : `Enviar aviso (${ids.length})`;
  }

  /* ---------- Diálogo D1: Confirmar envío ---------- */
  const dlg = $('#dlg');
  const incluidas = g => g.ids.filter(id => !requiereReenvio(porId(id)) || S.D.reenviar.has(id));
  const gruposEnvio = () => S.D.grupos.filter(g => incluidas(g).length);

  function prepararEnvio() {
    const orden = ordenadas().map(c => c.id);
    let aptas = orden.filter(id => S.sel.has(id) && !porId(id).enviando);
    const excluidas = [];
    if (S.simCancel && aptas.length) {
      const id = aptas.includes(7) ? 7 : aptas[aptas.length - 1], c = porId(id);
      c.cancelada = true;
      aptas = aptas.filter(x => x !== id);
      excluidas.push(`${c.comp} cuota ${c.n} — CUOTA_CANCELADA: se canceló después de seleccionarla.`);
      S.simCancel = false; $('#demo-cancel').checked = false;
    }
    const mapa = new Map();
    aptas.forEach(id => {
      const c = porId(id), k = `${c.contacto}|${tipoKey(c)}`;
      if (!mapa.has(k)) {
        mapa.set(k, {
          contacto: c.contacto, tipo: tipoKey(c), para: CONTACTOS[c.contacto].correo, antes: null,
          copia: [EMPRESA.admin, ...(c.sentido === 'Cobrar' ? EMPRESA.copiaCobrar : EMPRESA.copiaPagar)], ids: []
        });
      }
      mapa.get(k).ids.push(id);
    });
    S.D = { fase: 'confirmar', grupos: [...mapa.values()], excluidas, reenviar: new Set(), cambio: false, cambioAplicado: false,
      comentario: normalizar(S.comentario), resultados: [], reintentando: -1 };
    renderDlg();
    if (!dlg.open) dlg.showModal();
    $('#dlg-t').focus();
  }

  function cuotaTxt(c, fuera) {
    const base = `${esc(c.comp)} cuota ${c.n} (${monto(c)}, ${vencida(c) ? 'venció' : 'vence'} ${c.venc})`;
    return `<li class="${fuera ? 'fuera' : ''}">${base}${fuera ? ' — no se incluirá' : ''}</li>`;
  }

  function grupoHTML(g, pos, total, bloquear) {
    const inc = incluidas(g);
    const titulo = inc.length ? `Correo ${pos} de ${total}` : 'Correo sin cuotas por enviar';
    const avisos = g.ids.map(porId).filter(requiereReenvio).map(c => `
      <div class="reenvio">
        <div class="alert alert-peq info" role="note"><span aria-hidden="true">⚠</span>
          <div>La cuota ${c.n} ya tiene un aviso enviado. Último aviso: ${c.aviso.fecha.slice(0, 10)}, ${esc(c.aviso.por)}.</div></div>
        <label class="chk"><input type="checkbox" data-reenviar="${c.id}" ${S.D.reenviar.has(c.id) ? 'checked' : ''} ${bloquear ? 'disabled' : ''}>
          Reenviar aviso de la cuota ${c.n}<span class="sr-only"> (obligatorio para incluirla)</span></label>
        <span class="ayuda">Obligatorio para incluirla en el correo.</span>
      </div>`).join('');
    return `<section class="correo ${inc.length ? '' : 'sin-envio'}" aria-label="${titulo}">
      <h3>${titulo} · ${tipoTxt(g.tipo)} <span class="ayuda">— ${esc(g.contacto)}</span></h3>
      <dl class="dl-correo">
        <dt>Para:</dt><dd>${esc(g.para)}${g.antes ? `<span class="badge b-prom cambio">Cambió · antes: ${esc(g.antes)}</span>` : ''}</dd>
        <dt>Copia:</dt><dd>${g.copia.map(esc).join(', ')}</dd>
        <dt>Responder a:</dt><dd>${EMPRESA.admin}</dd>
        <dt>Cuotas:</dt><dd><ul>${g.ids.map(id => cuotaTxt(porId(id), !inc.includes(id))).join('')}</ul></dd>
      </dl>${avisos}</section>`;
  }

  function renderDlg() {
    const D = S.D; if (!D) return;
    if (D.fase === 'resultado') return renderResultado();
    const enviando = D.fase === 'enviando', envio = gruposEnvio(), n = envio.length;
    const pendientesReenvio = D.grupos.some(g => g.ids.some(id => requiereReenvio(porId(id)) && !D.reenviar.has(id)));
    let txtBtn, deshab = false;
    if (enviando) { txtBtn = '<span class="spinner" aria-hidden="true"></span>Enviando…'; deshab = true; }
    else if (n) txtBtn = `Confirmar y enviar (${n})`;
    else {
      deshab = true;
      txtBtn = pendientesReenvio ? 'Marca "Reenviar aviso" o quita la cuota' : 'No hay cuotas aptas para enviar';
    }
    let pos = 0;
    dlg.innerHTML = `
      <div class="dlg-cab">
        <h2 id="dlg-t" tabindex="-1">Confirmar envío</h2>
        <button class="btn btn-ghost btn-icono" type="button" data-d="cerrar" aria-label="Cerrar" ${enviando ? 'disabled' : ''}>✕</button>
      </div>
      <div class="dlg-cuerpo">
        ${D.cambio ? `<div class="alert alert-peq" role="alert"><span aria-hidden="true">⚠</span><div>Los destinatarios vigentes cambiaron desde que abriste este diálogo. No se envió ningún correo: revisa los destinatarios marcados y confirma otra vez.</div></div>` : ''}
        <p>${n ? `Se ${n === 1 ? 'enviará 1 correo' : `enviarán ${n} correos`}.` : 'No se enviará ningún correo.'}</p>
        ${D.grupos.map(g => grupoHTML(g, gruposEnvio().includes(g) ? ++pos : 0, n, enviando)).join('')}
        ${D.excluidas.length ? `<div class="excluidas" role="note"><strong>Cuotas excluidas</strong><ul>${D.excluidas.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
          ${n ? '' : '<p>Ninguna cuota seleccionada sigue siendo apta: no se enviará ningún correo ni se registrará un intento.</p>'}</div>` : ''}
        <p><strong>Comentario:</strong> ${D.comentario ? esc(D.comentario) : '<span class="ayuda">(sin comentario)</span>'}</p>
        <p class="nota-fija">Los destinatarios se toman de la configuración vigente y no se pueden modificar. «Enviado» significa que el proveedor de correo aceptó el envío, no que el destinatario lo leyó.</p>
        <div class="dlg-acc">
          <button class="btn btn-sec" type="button" data-d="cerrar" ${enviando ? 'disabled' : ''}>Cancelar</button>
          <button class="btn btn-prim ${enviando ? 'cargando' : ''}" type="button" data-d="confirmar" aria-disabled="${deshab}">${txtBtn}</button>
        </div>
      </div>`;
  }

  function renderResultado() {
    const D = S.D;
    dlg.innerHTML = `
      <div class="dlg-cab"><h2 id="dlg-t" tabindex="-1">Resultado del envío</h2>
        <button class="btn btn-ghost btn-icono" type="button" data-d="cerrar" aria-label="Cerrar">✕</button></div>
      <div class="dlg-cuerpo">
        <ul class="resultados">${D.resultados.map((r, i) => {
          const base = `Correo ${i + 1} · ${esc(r.g.contacto)} · ${tipoTxt(r.g.tipo)}`;
          if (r.ok) return `<li class="ok"><span>✓ ${base} — <strong>Aviso enviado</strong></span></li>`;
          const reint = D.reintentando === i;
          return `<li class="fallo"><span>✕ ${base} — <strong>No Enviado</strong></span>
            <span class="motivo">Motivo: ${esc(r.motivo)}</span>
            <button class="btn btn-sec btn-sm ${reint ? 'cargando' : ''}" type="button" data-d="reintentar" data-k="${i}" aria-disabled="${reint || D.reintentando >= 0}">${reint ? '<span class="spinner" aria-hidden="true"></span>Enviando…' : 'Volver a intentar'}</button>
            <span class="ayuda">Genera un intento nuevo con datos vigentes.</span></li>`;
        }).join('')}</ul>
        ${D.excluidas.length ? `<div class="excluidas" role="note"><strong>Cuotas excluidas</strong><ul>${D.excluidas.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
        <div class="dlg-acc">
          <button class="btn btn-sec" type="button" data-d="bandeja">Ver bandeja</button>
          <button class="btn btn-prim" type="button" data-d="cerrar">Cerrar</button>
        </div>
      </div>`;
  }

  /* Simula la respuesta del proveedor de correo (RN-066, RN-067) */
  function intento(idx, total, esReintento) {
    if (S.res === 'rechazo') return { ok: false, motivo: 'el proveedor de correo rechazó el envío.' };
    if (S.res === 'timeout' && !esReintento && idx === (total > 1 ? 1 : 0)) return { ok: false, motivo: 'el proveedor de correo no respondió a tiempo.' };
    return { ok: true };
  }
  function aceptar(ids, tipoPor) {
    ids.forEach(id => {
      const c = porId(id); if (!c) return;
      c.aviso = { fecha: ahora(), por: usuario().n, tipo: tipoKey(c), venc: c.venc };
      S.sel.delete(id);
    });
  }
  const bloquear = (ids, v) => ids.forEach(id => { porId(id).enviando = v; });

  function confirmar() {
    const D = S.D, envio = gruposEnvio();
    if (!envio.length) return;
    /* RN-213: destinatarios vigentes distintos a los mostrados */
    if (S.res === 'destinatarios' && !D.cambioAplicado) {
      const g = envio[0];
      g.antes = g.para; g.para = CONTACTOS[g.contacto].nuevo;
      D.cambio = true; D.cambioAplicado = true;
      renderDlg(); $('#dlg-t').focus(); anunciar('Los destinatarios cambiaron. Revisa y confirma otra vez.');
      return;
    }
    D.cambio = false;
    D.fase = 'enviando';
    D.resultados = envio.map(g => ({ g, ids: incluidas(g), ok: null, motivo: '' }));
    S.minuto++;
    D.resultados.forEach(r => bloquear(r.ids, true));
    renderDlg(); actualizarLista(); anunciar('Enviando avisos…');
    let i = 0;
    const paso = () => {
      if (i >= D.resultados.length) return terminar();
      const k = i++;
      setTimeout(() => {
        const r = D.resultados[k], res = intento(k, D.resultados.length, false);
        r.ok = res.ok; r.motivo = res.motivo || '';
        bloquear(r.ids, false);
        if (r.ok) aceptar(r.ids);
        actualizarLista();
        paso();
      }, 1100);
    };
    paso();
  }

  function terminar() {
    const D = S.D;
    D.fase = 'resultado';
    S.alerta = D.resultados.filter(r => !r.ok).length;
    renderDlg(); renderAlerta(); actualizarLista();
    $('#dlg-t').focus();
    anunciar(S.alerta ? 'El envío terminó con errores.' : 'Los avisos se enviaron.');
  }

  function reintentar(k) {
    const D = S.D, r = D.resultados[k];
    if (D.reintentando >= 0) return;
    D.reintentando = k; S.minuto++;
    bloquear(r.ids, true);
    renderResultado(); actualizarLista();
    setTimeout(() => {
      const res = intento(k, D.resultados.length, true); /* datos, tipo y destinatarios vigentes (RN-138) */
      r.ok = res.ok; r.motivo = res.motivo || '';
      bloquear(r.ids, false);
      if (r.ok) aceptar(r.ids);
      D.reintentando = -1;
      S.alerta = D.resultados.filter(x => !x.ok).length;
      renderResultado(); renderAlerta(); actualizarLista();
      const b = dlg.querySelector('[data-d="reintentar"]');
      (b || $('#dlg-t')).focus();
      anunciar(r.ok ? 'Aviso enviado.' : 'El aviso no se envió.');
    }, 1100);
  }

  dlg.addEventListener('cancel', e => { if (S.D && (S.D.fase === 'enviando' || S.D.reintentando >= 0)) e.preventDefault(); });
  dlg.addEventListener('close', () => {
    /* las cuotas canceladas dejan la lista al cerrar */
    S.cuotas.filter(c => c.cancelada).forEach(c => S.sel.delete(c.id));
    S.D = null;
    actualizarLista();
    const b = $('#btn-enviar'); (b && !$('#barra').hidden ? b : $('#h1') || $('#contenido')).focus();
  });
  dlg.addEventListener('click', e => {
    const t = e.target.closest('[data-d]'), ch = e.target.closest('[data-reenviar]');
    if (!t || !S.D) return;
    const a = t.dataset.d;
    if (t.disabled || t.getAttribute('aria-disabled') === 'true') return;
    if (a === 'cerrar') dlg.close();
    else if (a === 'confirmar') confirmar();
    else if (a === 'reintentar') reintentar(+t.dataset.k);
    else if (a === 'bandeja') { dlg.close(); navegar('P-008 Bandeja de avisos'); }
  });
  dlg.addEventListener('change', e => {
    const ch = e.target.closest('[data-reenviar]');
    if (!ch || !S.D) return;
    const id = +ch.dataset.reenviar;
    ch.checked ? S.D.reenviar.add(id) : S.D.reenviar.delete(id);
    renderDlg();
    const nuevo = dlg.querySelector(`[data-reenviar="${id}"]`); if (nuevo) nuevo.focus();
  });

  /* ---------- Eventos de la vista ---------- */
  function refrescar() {
    if (S.refresh) return;
    S.refresh = true; renderVista(); anunciar('Actualizando lista…');
    setTimeout(() => {
      S.refresh = false; S.minuto++; S.refrescos++;
      if (S.vista === 'error') S.vista = 'datos', $('input[name="demo-estado"][value="datos"]').checked = true;
      /* otro usuario terminó su envío mientras tanto */
      const f = porId(11);
      if (f && f.enviando && !(S.D && S.D.fase === 'enviando')) { f.enviando = false; f.aviso = { fecha: ahora(), por: 'ROSA', tipo: tipoKey(f), venc: f.venc }; }
      renderVista();
      $('#h1').focus(); toast('Lista actualizada.'); anunciar('Lista actualizada.');
    }, 900);
  }

  vista.addEventListener('click', e => {
    const a = e.target.closest('[data-act]');
    if (a) {
      const act = a.dataset.act;
      if (a.getAttribute('aria-disabled') === 'true') {
        if (act === 'enviar') { const er = $('#com-error'); if (!er.hidden) $('#comentario').focus(); }
        return;
      }
      if (act === 'actualizar') refrescar();
      else if (act === 'reintentar-carga') refrescar();
      else if (act === 'bandeja') navegar('P-008 Bandeja de avisos');
      else if (act === 'limpiar') { S.sel.clear(); actualizarLista(); $('#h1').focus(); anunciar('Selección limpiada.'); }
      else if (act === 'limpiar-filtros') { S.f = { sentido: '', estado: '', aviso: '', moneda: '', q: '' }; renderVista(); $('#f-sentido').focus(); }
      else if (act === 'enviar') prepararEnvio();
      else if (act === 'reintentar-alerta') prepararEnvio();
      return;
    }
    const comp = e.target.closest('[data-comp]');
    if (comp) { e.preventDefault(); navegar(`P-006 Detalle del comprobante ${comp.dataset.comp}`); return; }
    const rp = e.target.closest('[data-reprog]');
    if (rp) { const c = porId(+rp.dataset.reprog); navegar(`Reprogramar cuota ${c.n} de ${c.comp} (S1)`); return; }
    const ct = e.target.closest('[data-contacto]');
    if (ct) {
      const del = ordenadas().filter(c => c.contacto === ct.dataset.contacto && !c.enviando);
      const todas = del.every(c => S.sel.has(c.id));
      del.forEach(c => todas ? S.sel.delete(c.id) : S.sel.add(c.id));
      actualizarLista();
      const nuevo = $(`[data-contacto="${CSS.escape(ct.dataset.contacto)}"]`); if (nuevo) nuevo.focus();
      anunciar(todas ? `Cuotas de ${ct.dataset.contacto} quitadas de la selección.` : `Cuotas de ${ct.dataset.contacto} seleccionadas.`);
    }
  });

  vista.addEventListener('change', e => {
    const t = e.target;
    if (t.id === 'chk-todas') {
      visibles().filter(c => !c.enviando).forEach(c => t.checked ? S.sel.add(c.id) : S.sel.delete(c.id));
      actualizarLista(); $('#chk-todas').focus();
    } else if (t.dataset.sel) {
      t.checked ? S.sel.add(+t.dataset.sel) : S.sel.delete(+t.dataset.sel);
      const id = t.dataset.sel;
      actualizarLista(); const n = $(`[data-sel="${id}"]`); if (n) n.focus();
    } else if (t.id === 'f-sentido') { S.f.sentido = t.value; actualizarLista(); }
    else if (t.id === 'f-estado') { S.f.estado = t.value; actualizarLista(); }
    else if (t.id === 'f-aviso') { S.f.aviso = t.value; actualizarLista(); }
    else if (t.id === 'f-moneda') { S.f.moneda = t.value; actualizarLista(); }
  });
  vista.addEventListener('input', e => {
    if (e.target.id === 'f-q') { S.f.q = e.target.value; actualizarLista(); }
    else if (e.target.id === 'comentario') { S.comentario = e.target.value; actualizarBarra(); }
  });
  /* RN-162: se quitan espacios exteriores y se convierte a mayúsculas al salir del campo */
  vista.addEventListener('focusout', e => {
    if (e.target.id === 'comentario') {
      S.comentario = normalizar(e.target.value); e.target.value = S.comentario; actualizarBarra();
    }
  });

  /* ---------- Shell ---------- */
  const sidebar = $('#sidebar'), backdrop = $('#backdrop'), btnMenu = $('#btn-menu');
  function menu(abrir) {
    sidebar.classList.toggle('abierto', abrir); backdrop.hidden = !abrir;
    btnMenu.setAttribute('aria-expanded', abrir);
  }
  btnMenu.addEventListener('click', () => menu(!sidebar.classList.contains('abierto')));
  backdrop.addEventListener('click', () => menu(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && sidebar.classList.contains('abierto')) { menu(false); btnMenu.focus(); } });
  sidebar.addEventListener('click', e => {
    const a = e.target.closest('[data-nav]');
    if (a) { e.preventDefault(); menu(false); navegar(a.dataset.nav); }
    else if (e.target.closest('a')) e.preventDefault();
  });

  /* ---------- Controles del prototipo ---------- */
  document.querySelectorAll('input[name="demo-estado"]').forEach(r => r.addEventListener('change', () => { S.vista = r.value; renderVista(); }));
  $('#demo-rol').addEventListener('change', e => { S.rol = e.target.value; $('#usuario-datos').innerHTML = usuario().etq; });
  $('#demo-s1').addEventListener('change', e => { S.s1 = e.target.checked; renderVista(); });
  $('#demo-res').addEventListener('change', e => { S.res = e.target.value; });
  $('#demo-cancel').addEventListener('change', e => { S.simCancel = e.target.checked; });
  $('#demo-tema').addEventListener('change', e => {
    const v = e.target.value;
    if (v === 'auto') document.documentElement.removeAttribute('data-tema'); else document.documentElement.setAttribute('data-tema', v);
  });
  $('#demo-reset').addEventListener('click', () => {
    if (dlg.open) dlg.close();
    reiniciar(); renderVista(); toast('Datos del prototipo restablecidos.');
  });

  reiniciar();
  renderVista();
})();
