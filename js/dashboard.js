// ===== dashboard.js — greeting, live clock, stats, pipeline, recent clients =====
function tick() {
  const now = new Date();
  $('clock').textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
}
function renderStats(c) {
  const active = c.filter(x => x.status !== 'Won' && x.status !== 'Lost').length;
  const wonRevenue = c.filter(x => x.status === 'Won').reduce((sum, x) => sum + x.dealValue, 0);
  const thisWeek = c.filter(x => (Date.now() - new Date(x.createdAt)) / 86400000 <= 7).length;
  const stat = (label, value) => `<div class="card stat"><span class="muted">${label}</span><b>${value}</b></div>`;
  $('stats').innerHTML = stat('Total Clients', c.length) + stat('Active Deals', active) +
    stat('Won Revenue', money(wonRevenue)) + stat('New This Week', thisWeek);
}
function renderPipeline(c) {
  const counts = c.reduce((acc, x) => { acc[x.status] = (acc[x.status] || 0) + 1; return acc; }, {});
  $('pipeline').innerHTML = STATUSES.map(s => `<div class="pipe"><span class="badge b-${s.toLowerCase()}">${s}</span><b>${counts[s] || 0}</b></div>`).join('');
}
function renderRecent(c) {
  const recent = [...c].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  $('recent').innerHTML = recent.map(x => `<div class="pipe"><span>${esc(x.name)} <span class="muted">· ${esc(x.company)}</span></span>
    <span><span class="badge b-${x.status.toLowerCase()}">${x.status}</span> <span class="muted">${new Date(x.createdAt).toLocaleDateString()}</span></span></div>`).join('');
}
async function init() {
  $('welcome').textContent = `Welcome back, ${currentUser().fullName.split(' ')[0]}!`;
  tick(); setInterval(tick, 1000);
  try {
    const clients = await getClients();
    renderStats(clients); renderPipeline(clients); renderRecent(clients);
  } catch {
    $('stats').innerHTML = '<p class="error">Could not load clients. Check your connection and try again.</p>';
  }
}
if (AUTH_OK) init();
