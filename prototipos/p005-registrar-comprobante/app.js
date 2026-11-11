'use strict';
/* P-005 Registrar / editar comprobante — prototipo (datos ficticios, sin backend) */

const HOY = '2026-11-11';
const USUARIO = 'Marcela Quispe (u-014)';

const CONTACTOS = [
  { id: 'c1', nombre: 'Textiles Andinos S.A.C.', doc: 'RUC 20512345678' },
  { id: 'c2', nombre: 'Distribuidora Lima Norte E.I.R.L.', doc: 'RUC 20601234567' },
  { id: 'c3', nombre: 'Ferretería El Constructor S.R.L.', doc: 'RUC 20498765432' },
  { id: 'c4', nombre: 'Importaciones Pacífico S.A.', doc: 'RUC 20556677889' },
  { id: 'c5', nombre: 'Panadería San Jorge', doc: 'DNI 40123456' },
  { id: 'c6', nombre: 'Servicios Logísticos Callao S.A.C.', doc: 'RUC 20523456781' },
];

// Comprobantes ya registrados (para RN-003 / RN-004). El que se edita no cuenta contra sí mismo.
const EXISTENTES = [
  { numero: 'F001-00044', sentido: 'Cobrar', contacto: 'c2', anulado: false },
  { numero: 'F001-00046', sentido: 'Cobrar', contacto: 'c3', anulado: true },
  { numero: 'F001-00045', sentido: 'Pagar', contacto: 'c4', anulado: false },
  { numero: 'E001-1520', sentido: 'Pagar', contacto: 'c4', anulado: false },
];

const EJEMPLO = { sentido: 'Cobrar', contactoId: 'c1', numero: 'F001-00047', moneda: 'S/', total: '1,000.00', emision: '2026-11-04', modalidad: 'cuotas', venc: '2026-12-15', cantidad: '3' };
const EDICION = {
  sentido: 'Cobrar', contactoId: 'c1', numero: 'F001-00045', moneda: 'S/', total: '1,000.00', emision: '2026-11-04', modalidad: 'cuotas', venc: '2026-12-04', cantidad: '3',
  cuotas: [{ venc: '2026-12-04', imp: '333.33' }, { venc: '2027-01-04', imp: '333.33' }, { venc: '2027-02-04', imp: '333.34' }],
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const delay = ms => new Promise(r => setTimeout(r, ms));
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const S = {
  modo: 'registro',       // registro | edicion
  bloqueado: false,
  version: null,
  contactoId: null,
  cuotas: [],             // [{venc, imp}] como texto
  tocados: new Set(),
  enviado: false,
  sucio: false,
  guardando: false,
  orig: null,
  activo: -1,
  destinoSalida: null,
};

const sentido = () => $('input[name=sentido]:checked').value;
const moneda = () => $('input[name=moneda]:checked').value;
const modalidad = () => $('input[name=modalidad]:checked').value;
const contactoPorId = id => CONTACTOS.find(c => c.id === id);

/* ---------- Importes y fechas (RN-153; cálculos en céntimos) ---------- */
function parseMonto(s) {
  s = s ?? '';
  if (s === '') return { err: 'Ingresa el importe.' };
  if (/\s/.test(s)) return { err: 'El importe no debe tener espacios.' };
  if (/^[-+]/.test(s)) return { err: 'No se permiten signos: ingresa un importe positivo.' };
  if (/e/i.test(s)) return { err: 'No uses notación científica. Ej.: 1,000.50' };
  const m = /^(\d[\d,]*)(?:\.(\d*))?$/.exec(s);
  if (!m) return { err: 'Usa solo dígitos, coma de miles y punto decimal. Ej.: 1,000.50' };
  const dec = m[2];
  if (dec === '') return { err: 'Después del punto indica 1 o 2 decimales. Ej.: 1,000.50' };
  if (dec !== undefined && dec.length > 2) return { err: 'Máximo 2 decimales; no se redondea automáticamente.' };
  const digitos = m[1].replace(/,/g, '');
  if (digitos.length > 12) return { err: 'El máximo es 999,999,999,999.99.' };
  if (!/^(0|[1-9]\d{0,2}(,\d{3})*)$/.test(m[1])) {
    return { err: /^\d{4,}$/.test(m[1]) ? 'Usa coma para miles desde 1,000. Ej.: 1,000.50' : 'Formato inválido. Ej.: 1,000.50' };
  }
  return { cent: Number(digitos) * 100 + Number((dec || '').padEnd(2, '0')) };
}
const fmt = c => {
  const neg = c < 0; c = Math.abs(c);
  return (neg ? '-' : '') + Math.floor(c / 100).toLocaleString('en-US') + '.' + String(c % 100).padStart(2, '0');
};
const canon = c => { const a = Math.abs(c); return (c < 0 ? '-' : '') + Math.floor(a / 100) + '.' + String(a % 100).padStart(2, '0'); };
const esFecha = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
function addMeses(iso, k) {
  const [y, m, d] = iso.split('-').map(Number);
  const t = y * 12 + (m - 1) + k, ny = Math.floor(t / 12), nm = (t % 12) + 1;
  const dim = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
  return `${ny}-${String(nm).padStart(2, '0')}-${String(Math.min(d, dim)).padStart(2, '0')}`;
}
const maxCuotas = cent => Math.min(120, cent);

/* ---------- UI utilitaria ---------- */
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  $('#toasts').append(t);
  setTimeout(() => t.remove(), 5000);
}
const anunciar = m => { const a = $('#anuncio'); a.textContent = ''; setTimeout(() => (a.textContent = m), 50); };

function setErr(id, msg) {
  const e = $('#err-' + id), inp = $('#' + id);
  if (e) { e.hidden = !msg; e.textContent = msg || ''; }
  if (inp) { if (msg) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid'); }
}

/* ---------- Validación ---------- */
function cantidadErr(total) {
  const raw = $('#cantidad').value.trim();
  if (raw === '') return 'Ingresa la cantidad de cuotas (2 a 120).';
  if (!/^\d+$/.test(raw)) return 'Ingresa un entero entre 2 y 120 (sin decimales, signos ni texto).';
  const n = Number(raw);
  if (n < 2 || n > 120) return 'La cantidad debe estar entre 2 y 120.';
  if (total && n > total) {
    const mx = maxCuotas(total);
    return mx < 2 ? 'Con este total solo procede «Pago único».' : `Máximo posible para este total: ${mx}.`;
  }
  return null;
}

function validar() {
  const errs = [];
  const add = (id, label, msg) => errs.push({ id, label, msg });
  const sym = moneda();

  if (!S.contactoId) {
    const t = $('#contacto').value.trim();
    add('contacto', 'Contacto', t ? 'Selecciona un contacto activo de la lista o crea uno nuevo.' : 'Selecciona un contacto.');
  }

  const num = $('#numero').value.trim().toUpperCase();
  if (!num) add('numero', 'Número de documento', 'Ingresa el número de documento.');
  else if (num.length > 30) add('numero', 'Número de documento', 'Máximo 30 caracteres.');
  else if (!/^[A-Z0-9_-]+$/.test(num)) add('numero', 'Número de documento', 'Solo letras, dígitos, guion (-) y guion bajo (_), sin espacios.');
  else {
    const dup = EXISTENTES.find(x => !x.anulado && x.numero === num && x.sentido === sentido() && (sentido() === 'Cobrar' || x.contacto === S.contactoId));
    if (dup) add('numero', 'Número de documento', sentido() === 'Pagar'
      ? `Ya existe un comprobante por pagar ${num} de este proveedor (RN-003).`
      : `Ya existe un comprobante por cobrar ${num} no anulado (RN-003).`);
  }

  const pt = parseMonto($('#total').value.trim());
  let T = null;
  if (pt.err) add('total', 'Total', pt.err);
  else if (pt.cent <= 0) add('total', 'Total', 'El total debe ser mayor que cero.');
  else T = pt.cent;

  const em = $('#emision').value;
  let emOk = false;
  if (!esFecha(em)) add('emision', 'Fecha de emisión', 'Ingresa la fecha de emisión.');
  else if (em > HOY) add('emision', 'Fecha de emisión', `No puede ser futura (hoy es ${HOY}).`);
  else emOk = true;

  if (modalidad() === 'unico') {
    const v = $('#vencunico').value;
    if (!esFecha(v)) add('vencunico', 'Fecha de vencimiento', 'Ingresa la fecha de vencimiento.');
    else if (esFecha(em) && v <= em) add('vencunico', 'Fecha de vencimiento', `Debe ser posterior a la emisión (${em}).`);
  } else {
    const n = S.cuotas.length;
    if (S.modo === 'registro') {
      const ce = cantidadErr(T);
      if (ce) add('cantidad', 'Cantidad de cuotas', ce);
      else if (n === 0) add('cantidad', 'Cantidad de cuotas', 'Pulsa «Proponer cuotas» para generar las cuotas.');
      else if (n !== Number($('#cantidad').value.trim())) add('cantidad', 'Cantidad de cuotas', `La cantidad (${$('#cantidad').value.trim()}) no coincide con las cuotas de la tabla (${n}). Pulsa «Proponer cuotas» otra vez.`);
    } else {
      if (n === 0) add('cantidad', 'Cuotas', 'El comprobante debe tener al menos una cuota.');
      else if (T && n > maxCuotas(T)) add('cantidad', 'Cuotas', `Máximo posible para este total: ${maxCuotas(T)}.`);
    }
    let suma = 0, sumaOk = n > 0;
    let prev = null;
    S.cuotas.forEach((q, i) => {
      const k = i + 1;
      const pi = parseMonto(q.imp.trim());
      if (pi.err) { add('ci-' + k, `Cuota ${k}: importe`, pi.err); sumaOk = false; }
      else if (pi.cent < 1) { add('ci-' + k, `Cuota ${k}: importe`, 'Cada cuota debe tener al menos 0.01.'); sumaOk = false; }
      else suma += pi.cent;
      if (!esFecha(q.venc)) { add('cv-' + k, `Cuota ${k}: vencimiento`, 'Ingresa el vencimiento.'); prev = null; }
      else {
        if (emOk && q.venc <= em) add('cv-' + k, `Cuota ${k}: vencimiento`, `Debe ser posterior a la emisión (${em}).`);
        else if (prev && q.venc <= prev) add('cv-' + k, `Cuota ${k}: vencimiento`, `Debe ser posterior al de la cuota ${k - 1} (${prev}).`);
        prev = q.venc;
      }
    });
    if (T && sumaOk && suma !== T) {
      const d = suma - T;
      add('cuotas-suma', 'Cuotas', `La suma de las cuotas (${sym} ${fmt(suma)}) no coincide con el total (${sym} ${fmt(T)}). Diferencia: ${d > 0 ? '+' : '−'}${sym} ${fmt(Math.abs(d))}. No se ajusta ninguna cuota automáticamente.`);
    }
  }
  return errs;
}

const ERR_IDS = () => ['contacto', 'numero', 'total', 'emision', 'vencunico', 'cantidad', 'cuotas-suma',
  ...S.cuotas.flatMap((_, i) => ['cv-' + (i + 1), 'ci-' + (i + 1)])];

function pintarErrores(errs) {
  const mapa = new Map(errs.map(e => [e.id, e.msg]));
  ERR_IDS().forEach(id => {
    const ver = S.enviado || S.tocados.has(id) || (id === 'cuotas-suma' && S.tocados.has('cuotas-suma'));
    setErr(id, ver ? mapa.get(id) || '' : '');
  });
  // El error de suma es del grupo de importes: se muestra al tocar cualquier importe
  const rs = $('#resumen-errores');
  if (S.enviado && errs.length) {
    rs.hidden = false;
    rs.innerHTML = `<span aria-hidden="true">⚠</span><div><strong>Corrige ${errs.length === 1 ? 'este campo' : 'estos ' + errs.length + ' campos'} para guardar:</strong><ul>${errs.map(e => `<li><a href="#${e.id}" data-ir="${e.id}">${e.label}</a>: ${e.msg}</li>`).join('')}</ul></div>`;
  } else rs.hidden = true;
}

function refrescar() {
  const errs = validar();
  pintarErrores(errs);
  pintarResumen();
  pintarAyudaMax();
}

/* ---------- Resumen ---------- */
function totalCent() { const p = parseMonto($('#total').value.trim()); return !p.err && p.cent > 0 ? p.cent : null; }
function pintarResumen() {
  const sym = moneda(), T = totalCent();
  let suma = 0, n = 0, primera = null, ultima = null;
  if (modalidad() === 'unico') {
    n = 1; suma = T ?? 0;
    const v = $('#vencunico').value; primera = ultima = esFecha(v) ? v : null;
  } else {
    n = S.cuotas.length;
    S.cuotas.forEach(q => { const p = parseMonto(q.imp.trim()); if (!p.err) suma += p.cent; });
    const fs = S.cuotas.map(q => q.venc).filter(esFecha);
    primera = fs[0] ?? null; ultima = fs[fs.length - 1] ?? null;
  }
  $('#r-total').textContent = T ? `${sym} ${fmt(T)}` : '—';
  $('#r-suma').textContent = T || suma ? `${sym} ${fmt(suma)}` : '—';
  $('#r-n').textContent = n;
  $('#r-primera').textContent = primera || '—';
  $('#r-ultima').textContent = ultima || '—';
  const d = $('#r-dif'), b = $('#b-dif');
  let txt, cls;
  if (!T) { txt = '—'; cls = 'dif-neutro'; }
  else {
    const dif = suma - T;
    if (dif === 0) { txt = `${sym} 0.00 ✓`; cls = 'dif-ok'; }
    else { txt = `${dif > 0 ? '+' : '−'}${sym} ${fmt(Math.abs(dif))} · No cuadra`; cls = 'dif-mal'; }
  }
  [d, b].forEach(el => { el.textContent = txt; el.className = cls; });
  $$('.pref').forEach(p => (p.textContent = sym));
}
function pintarAyudaMax() {
  const T = totalCent(), a = $('#ayuda-max');
  if (T && T < 120) {
    const mx = maxCuotas(T);
    a.textContent = mx < 2 ? 'Con este total solo procede «Pago único».' : `Máximo posible para este total: ${mx}`;
  } else a.textContent = '';
}

/* ---------- Cuotas ---------- */
function renderCuotas(foco) {
  const sym = moneda(), ed = S.modo === 'edicion' && !S.bloqueado;
  $('#tbody-cuotas').innerHTML = S.cuotas.map((q, i) => {
    const k = i + 1;
    return `<tr data-i="${i}">
      <td class="n">${k}</td>
      <td data-label="Vencimiento *"><div class="campo"><input type="date" id="cv-${k}" value="${q.venc}" aria-label="Vencimiento de la cuota ${k}" aria-describedby="err-cv-${k}" ${S.bloqueado ? 'disabled' : ''}><p class="error" id="err-cv-${k}" hidden></p></div></td>
      <td data-label="Importe *"><div class="campo"><div class="monto"><span class="pref" aria-hidden="true">${sym}</span><input type="text" inputmode="decimal" id="ci-${k}" value="${q.imp}" aria-label="Importe de la cuota ${k}" aria-describedby="err-ci-${k}" ${S.bloqueado ? 'disabled' : ''}></div><p class="error" id="err-ci-${k}" hidden></p></div></td>
      <td class="quitar">${ed ? `<button type="button" class="btn btn-ghost btn-icono" data-quitar="${i}" aria-label="Quitar cuota ${k}" ${S.cuotas.length <= 1 ? 'aria-disabled="true"' : ''}>🗑</button>` : ''}</td>
    </tr>`;
  }).join('');
  $('#cuotas-vacias').hidden = S.cuotas.length > 0;
  $('#bloque-agregar').hidden = !ed;
  $('#btn-agregar').disabled = S.cuotas.length >= 120;
  if (foco) $(foco)?.focus();
  refrescar();
}

function proponer() {
  if (S.bloqueado) return;
  const T = totalCent();
  const em = $('#emision').value;
  const ce = cantidadErr(T);
  const faltan = [];
  if (!T) { S.tocados.add('total'); faltan.push('total'); }
  if (!esFecha(em) || em > HOY) { S.tocados.add('emision'); faltan.push('emision'); }
  if (ce) { S.tocados.add('cantidad'); faltan.push('cantidad'); }
  if (faltan.length) {
    refrescar();
    anunciar('Completa total, emisión y una cantidad válida para proponer cuotas.');
    $('#' + faltan[0]).focus();
    return;
  }
  const n = Number($('#cantidad').value.trim());
  const base = Math.floor(T / n);
  S.cuotas = Array.from({ length: n }, (_, i) => ({
    venc: addMeses(em, i + 1),
    imp: fmt(i === n - 1 ? T - base * (n - 1) : base),
  }));
  S.sucio = true;
  S.tocados.delete('cantidad');
  renderCuotas();
  toast(`Se propusieron ${n} cuotas mensuales. Puedes editarlas.`);
  anunciar(`Se propusieron ${n} cuotas.`);
}

/* ---------- Combobox de contacto ---------- */
const inpC = $('#contacto'), lista = $('#lista-contactos');
let opciones = [];
function abrirLista() {
  const texto = inpC.value.trim();
  const q = S.contactoId ? '' : norm(texto);
  const res = CONTACTOS.filter(c => !q || norm(c.nombre + ' ' + c.doc).includes(q));
  opciones = [...res.map(c => ({ tipo: 'c', c })), { tipo: 'crear' }];
  S.activo = S.contactoId ? opciones.findIndex(o => o.c?.id === S.contactoId) : (res.length ? 0 : 0);
  if (S.activo < 0) S.activo = 0;
  lista.innerHTML = (res.length ? '' : '<li class="sin" role="presentation">Sin resultados entre los contactos activos.</li>') +
    opciones.map((o, i) => o.tipo === 'c'
      ? `<li role="option" id="opt-${i}" data-i="${i}" aria-selected="${i === S.activo}">${o.c.nombre}<small>${o.c.doc} · Activo</small></li>`
      : `<li role="option" id="opt-${i}" data-i="${i}" class="crear" aria-selected="${i === S.activo}">+ Crear contacto ${texto ? '«' + texto + '»' : 'nuevo'}</li>`).join('');
  lista.hidden = false;
  inpC.setAttribute('aria-expanded', 'true');
  inpC.setAttribute('aria-activedescendant', 'opt-' + S.activo);
  anunciar(`${res.length} contactos encontrados.`);
}
function cerrarLista() { lista.hidden = true; inpC.setAttribute('aria-expanded', 'false'); inpC.removeAttribute('aria-activedescendant'); }
function marcarActivo(i) {
  S.activo = (i + opciones.length) % opciones.length;
  $$('#lista-contactos [role=option]').forEach((li, k) => li.setAttribute('aria-selected', String(k === S.activo)));
  inpC.setAttribute('aria-activedescendant', 'opt-' + S.activo);
  $('#opt-' + S.activo)?.scrollIntoView({ block: 'nearest' });
}
function elegirOpcion(i) {
  const o = opciones[i];
  if (!o) return;
  if (o.tipo === 'crear') { cerrarLista(); abrirDlgContacto(inpC.value.trim()); return; }
  seleccionarContacto(o.c.id);
  cerrarLista();
}
function seleccionarContacto(id) {
  S.contactoId = id;
  inpC.value = contactoPorId(id).nombre;
  S.tocados.add('contacto');
  S.sucio = true;
  refrescar();
}
inpC.addEventListener('input', () => { S.contactoId = null; S.sucio = true; abrirLista(); refrescar(); });
inpC.addEventListener('focus', () => { if (!S.bloqueado) abrirLista(); });
inpC.addEventListener('click', () => { if (lista.hidden && !S.bloqueado) abrirLista(); });
inpC.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); if (lista.hidden) abrirLista(); else marcarActivo(S.activo + 1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); if (!lista.hidden) marcarActivo(S.activo - 1); }
  else if (e.key === 'Enter' && !lista.hidden) { e.preventDefault(); elegirOpcion(S.activo); }
  else if (e.key === 'Escape' && !lista.hidden) { e.preventDefault(); cerrarLista(); }
});
inpC.addEventListener('blur', () => { cerrarLista(); S.tocados.add('contacto'); refrescar(); });
lista.addEventListener('mousedown', e => e.preventDefault());
lista.addEventListener('click', e => { const li = e.target.closest('[data-i]'); if (li) elegirOpcion(Number(li.dataset.i)); });

/* ---------- Alta rápida de contacto (P-003.D1) ---------- */
const dlgC = $('#dlg-contacto');
function abrirDlgContacto(texto) {
  $('#c-nombre').value = texto || ''; $('#c-doc').value = '';
  setErr('c-nombre', ''); setErr('c-doc', '');
  dlgC.showModal(); $('#c-nombre').focus();
}
function cerrarDlgContacto() { dlgC.close(); inpC.focus(); }
$('#dlg-contacto-x').addEventListener('click', cerrarDlgContacto);
$('#dlg-contacto-cancel').addEventListener('click', cerrarDlgContacto);
$('#form-contacto').addEventListener('submit', async e => {
  e.preventDefault();
  const nombre = $('#c-nombre').value.trim(), doc = $('#c-doc').value.trim();
  const en = !nombre ? 'Ingresa el nombre o razón social.' : CONTACTOS.some(c => norm(c.nombre) === norm(nombre)) ? 'Ya existe un contacto con ese nombre.' : '';
  const ed = doc && !/^(\d{8}|\d{11})$/.test(doc) ? 'Ingresa un DNI de 8 dígitos o un RUC de 11 dígitos.' : '';
  setErr('c-nombre', en); setErr('c-doc', ed);
  if (en || ed) { $(en ? '#c-nombre' : '#c-doc').focus(); return; }
  const ok = $('#dlg-contacto-ok');
  ok.setAttribute('aria-disabled', 'true'); ok.innerHTML = '<span class="spinner" aria-hidden="true"></span> Creando…';
  await delay(700);
  const c = { id: 'c' + (CONTACTOS.length + 1), nombre, doc: doc ? (doc.length === 11 ? 'RUC ' : 'DNI ') + doc : 'Sin documento' };
  CONTACTOS.push(c);
  ok.removeAttribute('aria-disabled'); ok.textContent = 'Crear contacto';
  dlgC.close();
  seleccionarContacto(c.id);
  inpC.focus();
  toast(`Contacto «${nombre}» creado y seleccionado.`);
});

/* ---------- Cargar estados ---------- */
function poblar(d, cuotas) {
  $(`input[name=sentido][value="${d.sentido}"]`).checked = true;
  $(`input[name=moneda][value="${d.moneda}"]`).checked = true;
  $(`input[name=modalidad][value="${d.modalidad}"]`).checked = true;
  $('#numero').value = d.numero; $('#total').value = d.total; $('#emision').value = d.emision;
  $('#vencunico').value = d.venc; $('#cantidad').value = d.cantidad;
  S.contactoId = d.contactoId; inpC.value = d.contactoId ? contactoPorId(d.contactoId).nombre : '';
  S.cuotas = cuotas ? cuotas.map(q => ({ ...q })) : [];
}
const BLANCO = { sentido: 'Cobrar', contactoId: null, numero: '', moneda: 'S/', total: '', emision: '', modalidad: 'unico', venc: '', cantidad: '' };

function instantanea() {
  const p = parseMonto($('#total').value.trim());
  return {
    contacto: S.contactoId ? contactoPorId(S.contactoId).nombre : '',
    numero: $('#numero').value.trim().toUpperCase(),
    moneda: moneda(),
    emision: $('#emision').value,
    total: p.cent != null ? canon(p.cent) : $('#total').value.trim(),
    cuotas: cuotasFinales().map(q => `${q.venc} · ${q.imp}`).join(' | '),
  };
}
function cuotasFinales() {
  if (modalidad() === 'unico') { const p = parseMonto($('#total').value.trim()); return [{ venc: $('#vencunico').value, imp: p.cent != null ? canon(p.cent) : '' }]; }
  return S.cuotas.map(q => { const p = parseMonto(q.imp.trim()); return { venc: q.venc, imp: p.cent != null ? canon(p.cent) : q.imp }; });
}

function aplicarEstado(est) {
  S.tocados.clear(); S.enviado = false; S.sucio = false; S.guardando = false; S.bloqueado = false;
  $('#alerta-srv').hidden = true; $('#resumen-errores').hidden = true; $('#alerta-bloqueo').hidden = true;
  $('#skeleton').hidden = true; $('#cols').hidden = false;
  desbloquear();
  cerrarLista();

  if (est === 'cargando') { $('#cols').hidden = true; $('#skeleton').hidden = false; modoUI('registro', null); anunciar('Cargando comprobante…'); return; }
  if (est === 'error-carga') {
    $('#cols').hidden = true; modoUI('edicion', 'F001-00045');
    mostrarSrv('No se pudo cargar el comprobante.', 'Hubo un problema de conexión con el servidor. Tus datos no se han modificado. Código: COM-503.', 'Reintentar', () => $$('input[name=demo-estado]').find(r => r.value === 'edicion').click());
    return;
  }
  if (est === 'vacio') { modoUI('registro'); poblar(BLANCO); }
  else if (est === 'datos') { modoUI('registro'); poblar(EJEMPLO); proponerSilencioso(); }
  else { modoUI('edicion', 'F001-00045'); poblar(EDICION, EDICION.cuotas); S.version = 3; S.orig = instantanea(); if (est === 'bloqueada') bloquear(); }
  actualizarModalidad(); renderCuotas();
}
function proponerSilencioso() {
  const T = parseMonto(EJEMPLO.total).cent, n = Number(EJEMPLO.cantidad), base = Math.floor(T / n);
  S.cuotas = Array.from({ length: n }, (_, i) => ({ venc: addMeses(EJEMPLO.emision, i + 1), imp: fmt(i === n - 1 ? T - base * (n - 1) : base) }));
}
function modoUI(modo, numero) {
  S.modo = modo;
  const ed = modo === 'edicion';
  $('#titulo').textContent = ed ? `Editar ${numero}` : 'Registrar comprobante';
  $('#miga-actual').textContent = ed ? `Editar ${numero}` : 'Registrar';
  document.title = `P-005 ${ed ? 'Editar ' + numero : 'Registrar comprobante'} · VenceYa`;
  $('#ayuda-sentido').hidden = !ed;
  $$('input[name=sentido]').forEach(i => (i.disabled = ed));
  $('#r-version-fila').hidden = !ed;
  if (ed) $('#r-version').textContent = 'v3';
}
function bloquear() {
  S.bloqueado = true;
  $('#alerta-bloqueo').hidden = false;
  $$('#form input, #form button').forEach(el => { if (el.dataset.accion !== 'cancelar') el.disabled = true; });
  $$('[data-accion=guardar]').forEach(b => b.setAttribute('aria-disabled', 'true'));
  $$('[data-accion=cancelar]').forEach(b => (b.textContent = 'Volver'));
}
function desbloquear() {
  $$('#form input, #form button').forEach(el => (el.disabled = false));
  $$('input[name=sentido]').forEach(i => (i.disabled = S.modo === 'edicion'));
  $$('[data-accion=guardar]').forEach(b => b.removeAttribute('aria-disabled'));
  $$('[data-accion=cancelar]').forEach(b => (b.textContent = 'Cancelar'));
}
function mostrarSrv(titulo, detalle, accion, fn) {
  $('#alerta-srv-t').textContent = titulo; $('#alerta-srv-d').textContent = detalle;
  const b = $('#btn-srv-accion'); b.textContent = accion; b.onclick = fn;
  $('#alerta-srv').hidden = false;
}

function actualizarModalidad() {
  const u = modalidad() === 'unico';
  $('#bloque-unico').hidden = !u; $('#bloque-cuotas').hidden = u;
  if (!u && S.modo === 'edicion') $('#cantidad').value = S.cuotas.length || '';
}

/* ---------- Guardar ---------- */
async function guardar() {
  if (S.bloqueado || S.guardando) return;
  S.enviado = true;
  $('#alerta-srv').hidden = true;
  const errs = validar();
  pintarErrores(errs); pintarResumen();
  if (errs.length) {
    const rs = $('#resumen-errores'); rs.focus(); rs.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return;
  }
  const actual = instantanea();
  const cambios = S.modo === 'edicion' ? Object.keys(actual).filter(k => actual[k] !== S.orig[k]).map(k => ({ campo: k, antes: S.orig[k], despues: actual[k] })) : [];
  if (S.modo === 'edicion' && !cambios.length) { toast('No hay cambios para guardar.'); S.enviado = false; return; }

  S.guardando = true;
  const btns = $$('[data-accion=guardar]');
  const prev = btns.map(b => b.textContent);
  btns.forEach(b => { b.setAttribute('aria-disabled', 'true'); b.classList.add('cargando'); b.innerHTML = '<span class="spinner" aria-hidden="true"></span> Guardando…'; });
  anunciar('Guardando comprobante…');
  await delay(1400);
  S.guardando = false;
  btns.forEach((b, i) => { b.removeAttribute('aria-disabled'); b.classList.remove('cargando'); b.textContent = prev[i]; });

  const srv = $('input[name=demo-srv]:checked').value;
  if (srv === 'error') {
    mostrarSrv('No se pudo guardar el comprobante.', 'Hubo un problema de conexión con el servidor. No se registró ningún cambio. Código: COM-503.', 'Reintentar', guardar);
    $('#alerta-srv').scrollIntoView({ block: 'center' });
    return;
  }
  if (srv === 'conflicto') {
    if (S.modo === 'registro') { mostrarSrv('No se pudo guardar el comprobante.', 'Otro usuario guardó un comprobante con el mismo número mientras trabajabas. No se registraron cambios. Código: COM-409.', 'Entendido', () => ($('#alerta-srv').hidden = true)); return; }
    bloquear();
    mostrarSrv('No se guardaron los cambios.', 'Otro usuario registró un pago o una reprogramación mientras editabas. El comprobante ya no se puede editar; no se registraron cambios ni historial (RN-082). Código: COM-409.', 'Entendido', () => ($('#alerta-srv').hidden = true));
    $('#alerta-bloqueo').hidden = false;
    return;
  }
  exito(actual, cambios);
}

function exito(actual, cambios) {
  const ed = S.modo === 'edicion';
  const num = actual.numero;
  $('#dlg-ok-t').textContent = ed ? 'Cambios guardados' : 'Comprobante guardado';
  const sym = actual.moneda, nCuotas = cuotasFinales().length;
  $('#dlg-ok-d').textContent = `${num} · ${actual.contacto} · ${sym} ${fmt(parseMonto($('#total').value.trim()).cent)} en ${nCuotas === 1 ? 'pago único' : nCuotas + ' cuotas'}.`;
  const ts = new Date().toISOString();
  $('#dlg-ok-hist').hidden = !ed;
  $('#hist-lista').innerHTML = cambios.map(c => `<li><strong>${{ contacto: 'Contacto', numero: 'Número de documento', moneda: 'Moneda', emision: 'Fecha de emisión', total: 'Total', cuotas: 'Cuotas' }[c.campo]}</strong>: «${c.antes || '—'}» → «${c.despues || '—'}»<small>${USUARIO} · ${ts}</small></li>`).join('');
  $('#api-json').textContent = JSON.stringify({
    tipoMovimiento: sentido() === 'Cobrar' ? 'POR_COBRAR' : 'POR_PAGAR',
    contactoId: S.contactoId, numeroDocumento: actual.numero, moneda: sym === 'S/' ? 'PEN' : 'USD',
    total: actual.total, fechaEmision: actual.emision,
    cuotas: cuotasFinales().map((q, i) => ({ numero: i + 1, vencimiento: q.venc, importe: q.imp })),
    ...(ed ? { version: S.version } : {}),
  }, null, 2);
  if (ed) { S.version += 1; S.orig = actual; $('#r-version').textContent = 'v' + S.version; }
  S.sucio = false;
  $('#dlg-ok').showModal();
}
$('#ok-otro').addEventListener('click', () => { $('#dlg-ok').close(); $$('input[name=demo-estado]').find(r => r.value === 'vacio').checked = true; aplicarEstado('vacio'); $('#contacto').focus(); });
$('#ok-lista').addEventListener('click', () => { $('#dlg-ok').close(); toast('Navegación simulada: P-004 Comprobantes (con el comprobante guardado).'); });

/* ---------- Cancelar / navegación simulada ---------- */
function salir(destino) {
  if (S.sucio && !S.bloqueado) { S.destinoSalida = destino; $('#dlg-descartar').showModal(); return; }
  toast(`Navegación simulada: ${destino}`);
}
$('#desc-seguir').addEventListener('click', () => $('#dlg-descartar').close());
$('#desc-salir').addEventListener('click', () => { $('#dlg-descartar').close(); S.sucio = false; toast(`Navegación simulada: ${S.destinoSalida}`); });

/* ---------- Eventos globales ---------- */
const form = $('#form');
form.addEventListener('input', e => {
  const t = e.target;
  if (t === inpC) return;
  S.sucio = true;
  let m;
  if ((m = /^cv-(\d+)$/.exec(t.id))) S.cuotas[m[1] - 1].venc = t.value;
  else if ((m = /^ci-(\d+)$/.exec(t.id))) S.cuotas[m[1] - 1].imp = t.value;
  refrescar();
});
form.addEventListener('focusout', e => {
  const t = e.target;
  if (!t.id || t === inpC || t.type === 'radio') return;
  if (t.id === 'numero') t.value = t.value.trim().toUpperCase();
  S.tocados.add(t.id);
  if (/^ci-/.test(t.id)) S.tocados.add('cuotas-suma');
  if (t.id === 'total' || t.id === 'emision') $$('[id^=cv-],[id^=ci-]').forEach(x => S.tocados.add(x.id));
  refrescar();
});
form.addEventListener('change', e => {
  const t = e.target;
  if (t.type !== 'radio') return;
  S.sucio = true;
  if (t.name === 'modalidad') actualizarModalidad();
  if (t.name === 'moneda') renderCuotas(); else refrescar();
});
form.addEventListener('submit', e => e.preventDefault());
$('#btn-proponer').addEventListener('click', proponer);
$('#btn-agregar').addEventListener('click', () => {
  if (S.cuotas.length >= 120) return;
  const ultima = S.cuotas.map(q => q.venc).filter(esFecha).pop() || $('#emision').value;
  S.cuotas.push({ venc: esFecha(ultima) ? addMeses(ultima, 1) : '', imp: '' });
  S.sucio = true; $('#cantidad').value = S.cuotas.length;
  renderCuotas('#ci-' + S.cuotas.length);
  anunciar(`Cuota ${S.cuotas.length} agregada. Ingresa su importe.`);
});
$('#tbody-cuotas').addEventListener('click', e => {
  const b = e.target.closest('[data-quitar]');
  if (!b) return;
  if (S.cuotas.length <= 1) { toast('El comprobante debe conservar al menos una cuota.'); return; }
  const i = Number(b.dataset.quitar);
  S.cuotas.splice(i, 1); S.sucio = true; $('#cantidad').value = S.cuotas.length;
  S.tocados.add('cuotas-suma');
  renderCuotas(S.cuotas[i] ? `[data-quitar="${i}"]` : '#btn-agregar');
  anunciar(`Cuota quitada. Quedan ${S.cuotas.length}.`);
});
$('#resumen-errores').addEventListener('click', e => {
  const a = e.target.closest('[data-ir]');
  if (!a) return;
  e.preventDefault();
  const id = a.dataset.ir;
  const el = id === 'cuotas-suma' ? $('#tabla-cuotas') : $('#' + id);
  el?.scrollIntoView({ block: 'center' }); el?.focus();
});
document.addEventListener('click', e => {
  const acc = e.target.closest('[data-accion]');
  if (acc?.dataset.accion === 'guardar') guardar();
  else if (acc?.dataset.accion === 'cancelar') salir('P-004 Comprobantes');
  const nav = e.target.closest('[data-nav]');
  if (nav) { e.preventDefault(); salir(nav.dataset.nav); }
});

$$('input[name=demo-estado]').forEach(r => r.addEventListener('change', () => aplicarEstado(r.value)));
$('#demo-tema').addEventListener('change', e => {
  const v = e.target.value;
  if (v === 'auto') document.documentElement.removeAttribute('data-tema'); else document.documentElement.setAttribute('data-tema', v);
});

/* Menú móvil */
const side = $('#sidebar'), bd = $('#backdrop'), bm = $('#btn-menu');
function menu(abrir) { side.classList.toggle('abierto', abrir); bd.hidden = !abrir; bm.setAttribute('aria-expanded', String(abrir)); }
bm.addEventListener('click', () => menu(!side.classList.contains('abierto')));
bd.addEventListener('click', () => menu(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') menu(false); });

aplicarEstado('vacio');
