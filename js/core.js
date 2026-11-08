// ===== core.js — shared logic loaded on EVERY page (storage, guard, nav, theme, toast, API) =====
const KEYS = { users: 'crm_users', session: 'crm_session', clients: 'crm_clients', theme: 'crm_theme' };
const API = 'https://dummyjson.com/users';
const STATUSES = ['Lead', 'Contacted', 'Won', 'Lost'];
const $ = id => document.getElementById(id);

// --- localStorage helpers (JSON.parse wrapped so corrupted data never crashes the app) ---
const load = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch { return fallback; }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// --- small utilities ---
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); // prevents XSS in innerHTML
const money = n => '$' + Number(n).toLocaleString('en-US');
const isValidEmail = e => { const at = e.indexOf('@'); return at > 0 && e.indexOf('.', at) > at + 1 && !e.endsWith('.'); };
const isStrongPassword = p => p.length >= 8 && /[a-zA-Z]/.test(p) && /[0-9]/.test(p);

// --- Auth: guard, current user, logout ---
// Returns true when the visitor is allowed to stay on this page.
function guard(isPublicPage) {
  const hasSession = !!load(KEYS.session, null);
  if (isPublicPage && hasSession) { location.href = 'dashboard.html'; return false; }
  if (!isPublicPage && !hasSession) { location.href = 'index.html'; return false; }
  return true;
}
function currentUser() {
  const s = load(KEYS.session, null);
  return load(KEYS.users, []).find(u => u.id === (s && s.userId));
}
function updateUser(changeFn) { // find user in crm_users -> mutate -> save
  const users = load(KEYS.users, []);
  const user = users.find(u => u.id === load(KEYS.session, {}).userId);
  changeFn(user);
  save(KEYS.users, users);
}
function logout() { localStorage.removeItem(KEYS.session); location.href = 'index.html'; } // users & clients stay

// --- Theme ---
function applyTheme() { document.body.classList.toggle('light', localStorage.getItem(KEYS.theme) === 'light'); }
function toggleTheme() {
  localStorage.setItem(KEYS.theme, document.body.classList.contains('light') ? 'dark' : 'light');
  applyTheme();
}

// --- Toast (replaces alert) ---
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  $('toasts').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// --- Form errors: red text under the field + .input-error class ---
function showErrors(form, errors) {
  form.querySelectorAll('.input-error').forEach(i => i.classList.remove('input-error'));
  form.querySelectorAll('.error').forEach(e => (e.textContent = ''));
  for (const [name, msg] of Object.entries(errors)) {
    const input = form.elements[name];
    input.classList.add('input-error');
    input.closest('.field').querySelector('.error').textContent = msg;
  }
}
// Live clearing: error disappears as soon as the user types in the field
document.addEventListener('input', e => {
  if (e.target.classList.contains('input-error')) {
    e.target.classList.remove('input-error');
    e.target.closest('.field').querySelector('.error').textContent = '';
  }
});

// --- Shared navigation for protected pages ---
function renderNav(page) {
  const links = [['dashboard', 'Dashboard'], ['clients', 'Clients'], ['profile', 'Profile']];
  $('nav').innerHTML = `<a class="logo" href="dashboard.html">10X CRM</a>
    <nav>${links.map(([p, label]) => `<a href="${p}.html" class="${p === page ? 'active' : ''}">${label}</a>`).join('')}</nav>
    <div class="nav-actions"><button id="themeBtn" class="ghost">◐ Theme</button><button id="logoutBtn" class="ghost">Logout</button></div>`;
  $('themeBtn').onclick = toggleTheme;
  $('logoutBtn').onclick = logout;
}

// --- Client data: localStorage first, API only when empty (the "golden cycle" entry point) ---
function toClient(u, i) {
  return {
    id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email, phone: u.phone,
    company: u.company.name, image: u.image, status: 'Lead',
    dealValue: Math.floor(Math.random() * 9500) + 500, notes: [],
    createdAt: new Date(Date.now() - i * 8 * 3600000).toISOString() // spread dates (8h apart) so "newest" and "new this week" are meaningful
  };
}
async function fetchClients() {
  const res = await fetch(`${API}?limit=30`);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const data = await res.json();
  const clients = data.users.map(toClient);
  save(KEYS.clients, clients);
  return clients;
}
async function getClients() {
  const stored = load(KEYS.clients, null);
  return Array.isArray(stored) ? stored : fetchClients();
}

// --- Page bootstrap ---
const PAGE = document.body.dataset.page;
applyTheme();
const AUTH_OK = guard(PAGE === 'login' || PAGE === 'signup');
if (AUTH_OK && $('nav')) renderNav(PAGE);
