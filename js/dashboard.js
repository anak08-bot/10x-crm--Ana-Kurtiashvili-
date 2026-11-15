/* ==========================================================
   dashboard.js — Dashboard page (P3)
   ========================================================== */

(function () {
  if (!ALLOWED) return;

  // ---------- Welcome bar + live clock (P3.1) ----------
  const user = getCurrentUser();
  const firstName = ((user && user.fullName) || 'there').split(' ')[0];
  $('welcome').textContent = `Welcome back, ${firstName}!`;

  function updateClock() {
    const now = new Date();
    $('clock').textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }
  updateClock();
  setInterval(updateClock, 1000); // refresh every second

  // ---------- Stat cards (P3.2) ----------
  function renderStats(clients) {
    const activeDeals = clients.filter((c) => c.status !== 'Won' && c.status !== 'Lost').length;
    const wonRevenue = clients
      .filter((c) => c.status === 'Won')
      .reduce((sum, c) => sum + c.dealValue, 0);
    const newThisWeek = clients
      .filter((c) => (Date.now() - new Date(c.createdAt)) / 86400000 <= 7).length;

    const cards = [
      ['stat-1', '👥', 'Total Clients', clients.length],
      ['stat-2', '🔥', 'Active Deals', activeDeals],
      ['stat-3', '💰', 'Won Revenue', formatMoney(wonRevenue)],
      ['stat-4', '✨', 'New This Week', newThisWeek]
    ];
    $('stats').innerHTML = cards.map(([cls, icon, label, value]) => `
      <div class="card stat ${cls}">
        <div class="stat-icon">${icon}</div>
        <div class="stat-value">${value}</div>
        <div class="stat-label">${label}</div>
      </div>`).join('');
  }

  // ---------- Pipeline overview (P3.3) ----------
  function renderPipeline(clients) {
    const total = clients.length || 1; // avoid dividing by zero
    $('pipeline').innerHTML = STATUSES.map((status) => {
      const count = clients.filter((c) => c.status === status).length;
      const percent = Math.round((count / total) * 100);
      return `
        <div class="pipe-row ${STATUS_CLASS[status]}">
          <span class="badge">${status}</span>
          <div class="bar"><div class="bar-fill" style="width:${percent}%"></div></div>
          <span class="pipe-count">${count}</span>
        </div>`;
    }).join('');
  }

  // ---------- Recent clients (P3.4) ----------
  function renderRecent(clients) {
    const recent = clients.slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    if (recent.length === 0) {
      $('recent').innerHTML = '<p class="muted">No clients yet.</p>';
      return;
    }
    $('recent').innerHTML = recent.map((c) => `
      <div class="recent-row">
        ${avatarHtml(c.name, c.image, 'sm')}
        <div class="recent-main">
          <strong>${escapeHtml(c.name)}</strong>
          <span class="muted small">${escapeHtml(c.company)}</span>
        </div>
        <span class="badge ${STATUS_CLASS[c.status] || ''}">${escapeHtml(c.status)}</span>
        <span class="muted small">${new Date(c.createdAt).toLocaleDateString()}</span>
      </div>`).join('');
  }

  // ---------- Load data (same shared logic as the Clients page — P3.5) ----------
  async function init() {
    let clients = [];
    try {
      clients = await loadClients();
    } catch (err) {
      showToast('Could not load clients. Check your connection and try again.', 'error');
    }
    renderStats(clients);
    renderPipeline(clients);
    renderRecent(clients);
  }
  init();
})();