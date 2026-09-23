// Prototipo de Finanzas PWA — lógica de render y navegación.
// Datos vienen de data.js (MES_ACTUAL).

const fmt = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
};

// --- Cálculos derivados ---
function calcular(mes) {
  const gastos = mes.movimientos.filter((m) => m.tipo === 'gasto');
  const ingresos = mes.movimientos.filter((m) => m.tipo === 'ingreso');
  const prestamos = mes.movimientos.filter((m) => m.tipo === 'prestamo');

  const totalGastos = gastos.reduce((s, m) => s + m.monto, 0);
  const totalIngresos = ingresos.reduce((s, m) => s + m.monto, 0);
  const totalPrestamos = prestamos.reduce((s, m) => s + m.monto, 0);
  const totalTengo = mes.saldos.efectivo + mes.saldos.davivienda + mes.saldos.daviplata;

  // Gastos por categoría
  const porCat = {};
  gastos.forEach((g) => {
    const c = g.cat || 'Otros';
    porCat[c] = (porCat[c] || 0) + g.monto;
  });
  const categorias = Object.entries(porCat)
    .map(([cat, monto]) => ({ cat, monto }))
    .sort((a, b) => b.monto - a.monto);

  return { totalGastos, totalIngresos, totalPrestamos, totalTengo, categorias };
}

const CALC = calcular(MES_ACTUAL);

// --- Vistas ---
const views = {
  dashboard() {
    const s = MES_ACTUAL.saldos;
    const maxCat = CALC.categorias[0]?.monto || 1;
    const catBars = CALC.categorias
      .map(
        (c) => `
      <div class="bar-row">
        <span class="bar-cat">${c.cat}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(c.monto / maxCat) * 100}%"></div></div>
        <span class="bar-val">${fmt(c.monto)}</span>
      </div>`
      )
      .join('');

    const recientes = [...MES_ACTUAL.movimientos]
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, 6)
      .map(movItem)
      .join('');

    return `
      <div class="grid cards-top">
        <div class="card card-hero">
          <div class="card-label">Disponible del mes</div>
          <div class="card-value">${fmt(MES_ACTUAL.resumen.disponibleMes)}</div>
          <div class="card-trend">Total que tengo: ${fmt(CALC.totalTengo)}</div>
        </div>
        <div class="card">
          <div class="card-label">Gastos del mes</div>
          <div class="card-value sm">${fmt(CALC.totalGastos)}</div>
          <div class="card-trend trend-down">▾ ${((CALC.totalGastos / CALC.totalIngresos) * 100).toFixed(0)}% de ingresos</div>
        </div>
        <div class="card">
          <div class="card-label">Por cobrar</div>
          <div class="card-value sm">${fmt(CALC.totalPrestamos)}</div>
          <div class="card-trend trend-up">▴ Préstamos activos</div>
        </div>
      </div>

      <div class="grid accounts">
        <div class="card account-card">
          <div class="account-ico ico-cash">$</div>
          <div><div class="account-name">Efectivo</div><div class="account-amount">${fmt(s.efectivo)}</div></div>
        </div>
        <div class="card account-card">
          <div class="account-ico ico-davi">D</div>
          <div><div class="account-name">Davivienda</div><div class="account-amount">${fmt(s.davivienda)}</div></div>
        </div>
        <div class="card account-card">
          <div class="account-ico ico-plata">P</div>
          <div><div class="account-name">Daviplata</div><div class="account-amount">${fmt(s.daviplata)}</div></div>
        </div>
      </div>

      <div class="grid" style="grid-template-columns: 1.3fr 1fr;">
        <div class="card section">
          <div class="section-head"><span class="section-title">Gastos por categoría</span></div>
          <div class="bars">${catBars}</div>
        </div>
        <div class="card section">
          <div class="section-head">
            <span class="section-title">Movimientos recientes</span>
            <button class="section-link" data-view="movimientos">Ver todos</button>
          </div>
          <div class="mov-list">${recientes}</div>
        </div>
      </div>`;
  },

  movimientos() {
    const items = [...MES_ACTUAL.movimientos]
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .map(movItem)
      .join('');
    return `<div class="card"><div class="mov-list">${items}</div></div>`;
  },

  prestamos() {
    const cards = MES_ACTUAL.personas
      .map((p) => {
        const owe = p.saldo >= 0;
        return `
        <div class="card person-card">
          <div class="person-name">${p.nombre}</div>
          <div class="person-note">${p.nota}</div>
          <div class="person-amt ${owe ? 'owe-me' : 'i-owe'}">${owe ? '' : '-'}${fmt(Math.abs(p.saldo))}</div>
          <div class="person-note">${owe ? 'Te debe' : 'Le debes'}</div>
        </div>`;
      })
      .join('');
    return `<div class="grid person-grid">${cards}</div>`;
  },

  ia() {
    const catTop = CALC.categorias[0];
    const catComida = CALC.categorias.find((c) => c.cat === 'Comida');
    const catOcio = CALC.categorias.find((c) => c.cat === 'Ocio');
    return `
      <div class="ia-hero">
        <h2>✦ Tu asistente financiero</h2>
        <p>Analicé tus ${MES_ACTUAL.movimientos.length} movimientos de este mes. Aquí van algunas observaciones y sugerencias personalizadas. <em>(En la app real, estos consejos los generará una IA con tus datos reales.)</em></p>
      </div>
      <div class="tip tip-warn">
        <span class="tip-ico">⚠️</span>
        <div class="tip-body">
          <h3>Tu mayor gasto: ${catTop.cat}</h3>
          <p>Gastaste ${fmt(catTop.monto)} en ${catTop.cat.toLowerCase()} este mes. Si reduces un 20%, ahorrarías ${fmt(catTop.monto * 0.2)}.</p>
        </div>
      </div>
      ${catOcio ? `
      <div class="tip tip-info">
        <span class="tip-ico">🍻</span>
        <div class="tip-body">
          <h3>Ocio y salidas</h3>
          <p>Llevas ${fmt(catOcio.monto)} en ocio. Podrías fijarte un tope mensual para tener más control sin dejar de disfrutar.</p>
        </div>
      </div>` : ''}
      <div class="tip tip-good">
        <span class="tip-ico">💡</span>
        <div class="tip-body">
          <h3>Préstamos por cobrar</h3>
          <p>Tienes ${fmt(CALC.totalPrestamos)} prestados. Recuperarlos mejoraría tu liquidez disponible del mes.</p>
        </div>
      </div>`;
  },
};

function movItem(m) {
  const cls = m.tipo === 'ingreso' ? 'mi-ingreso' : m.tipo === 'prestamo' ? 'mi-prestamo' : 'mi-gasto';
  const ico = m.tipo === 'ingreso' ? '↓' : m.tipo === 'prestamo' ? '⇄' : '↑';
  const signo = m.tipo === 'ingreso' ? '+' : m.tipo === 'gasto' ? '-' : '';
  const amtCls = m.tipo === 'ingreso' ? 'amt-plus' : 'amt-minus';
  return `
    <div class="mov-item">
      <div class="mov-ico ${cls}">${ico}</div>
      <div class="mov-body">
        <div class="mov-desc">${m.desc}</div>
        <div class="mov-meta">${fmtDate(m.fecha)}${m.cat ? ' · ' + m.cat : ''}</div>
      </div>
      <div class="mov-amount ${amtCls}">${signo}${fmt(m.monto)}</div>
    </div>`;
}

// --- Navegación ---
const titles = {
  dashboard: ['Resumen', 'Tu mes de un vistazo'],
  movimientos: ['Movimientos', `${MES_ACTUAL.movimientos.length} registros este mes`],
  prestamos: ['Préstamos', 'Quién te debe y a quién le debes'],
  ia: ['Consejos IA', 'Análisis inteligente de tus finanzas'],
};

function navigate(view) {
  document.getElementById('content').innerHTML = views[view]();
  const [t, s] = titles[view];
  document.getElementById('pageTitle').textContent = t;
  document.getElementById('pageSub').textContent = s;
  document.querySelectorAll('[data-view]').forEach((el) => {
    if (el.classList.contains('nav-item') || el.classList.contains('bn-item')) {
      el.classList.toggle('active', el.dataset.view === view);
    }
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-view]');
  if (btn) navigate(btn.dataset.view);
});

document.getElementById('addBtn')?.addEventListener('click', () => alert('Aquí se abrirá el formulario para agregar un movimiento (prototipo).'));
document.getElementById('addBtnMobile')?.addEventListener('click', () => alert('Aquí se abrirá el formulario para agregar un movimiento (prototipo).'));

navigate('dashboard');
