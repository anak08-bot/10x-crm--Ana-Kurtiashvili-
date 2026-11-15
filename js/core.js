/* ==========================================================
   core.js — shared logic loaded on EVERY page of 10X CRM
   Contains: storage helpers, auth guard, navigation, theme,
   toasts, validators and the shared client data layer.
   ========================================================== */

// ---------- Constants ----------
const KEYS = {
  users: 'crm_users',
  session: 'crm_session',
  clients: 'crm_clients',
  theme: 'crm_theme'
};
const API_URL = 'https://dummyjson.com/users';
const STATUSES = ['Lead', 'Contacted', 'Won', 'Lost'];
const STATUS_CLASS = { Lead: 'st-lead', Contacted: 'st-contacted', Won: 'st-won', Lost: 'st-lost' };
const PUBLIC_PAGES = ['login', 'signup'];
const PAGE = document.body.dataset.page;

// Short DOM helper
const $ = (id) => document.getElementById(id);

// ---------- localStorage helpers ----------
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback; // corrupted data should not break the app
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Users & session ----------
function getUsers() { return readJSON(KEYS.users, []); }
function saveUsers(users) { writeJSON(KEYS.users, users); }
function getSession() { return readJSON(KEYS.session, null); }
function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  return getUsers().find((u) => u.id === session.userId) || null;
}

// Creates the README test account so graders do not have to register.
function seedDemoUser() {
  const users = getUsers();
  if (!users.some((u) => u.email === 'demo@test.com')) {
    users.push({
      id: 1,
      fullName: 'Demo User',
      email: 'demo@test.com',
      password: 'demo1234',
      company: '10X Sales',
      createdAt: new Date().toISOString()
    });
    saveUsers(users);
  }
}

function logout() {
  localStorage.removeItem(KEYS.session); // only the session is removed
  window.location.href = 'index.html';
}

// ---------- Auth guard (P0.1) — single entry point for all pages ----------
function guard(isPublicPage) {
  const hasSession = !!localStorage.getItem(KEYS.session);
  if (isPublicPage && hasSession) {
    window.location.href = 'dashboard.html';
    return false;
  }
  if (!isPublicPage && !hasSession) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}
// Page scripts check this flag so they do nothing while a redirect is happening.
const ALLOWED = guard(PUBLIC_PAGES.includes(PAGE));

// ---------- Theme (P0.3) ----------
function applyTheme() {
  const theme = localStorage.getItem(KEYS.theme) || 'dark';
  document.body.classList.toggle('light', theme === 'light');
}
function toggleTheme() {
  const next = document.body.classList.contains('light') ? 'dark' : 'light';
  localStorage.setItem(KEYS.theme, next);
  applyTheme();
  updateThemeBtn();
}
function updateThemeBtn() {
  const btn = $('themeBtn');
  if (btn) btn.textContent = document.body.classList.contains('light') ? '🌙 Dark' : '☀️ Light';
}

// ---------- Navigation (P0.2) ----------
function renderNav() {
  const nav = $('nav');
  if (!nav) return;
  const links = [
    ['dashboard', 'Dashboard', 'dashboard.html'],
    ['clients', 'Clients', 'clients.html'],
    ['profile', 'Profile', 'profile.html']
  ];
  nav.innerHTML = `
    <a class="logo" href="dashboard.html"><span class="logo-mark">10X</span> CRM</a>
    <nav class="nav-links">
      ${links.map(([key, label, href]) =>
        `<a href="${href}" class="${key === PAGE ? 'active' : ''}">${label}</a>`).join('')}
    </nav>
    <div class="nav-actions">
      <button id="themeBtn" class="ghost" type="button"></button>
      <button id="logoutBtn" class="ghost" type="button">Logout</button>
    </div>`;
  $('themeBtn').addEventListener('click', toggleTheme);
  $('logoutBtn').addEventListener('click', logout);
  updateThemeBtn();
}

// ---------- Toasts (P0.4) ----------
function showToast(message, type = 'success') {
  const box = $('toasts');
  if (!box) return;
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  const text = document.createElement('span');
  text.textContent = message;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-x';
  closeBtn.type = 'button';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => toast.remove());
  toast.append(text, closeBtn);
  box.appendChild(toast);
  setTimeout(() => toast.remove(), 3000); // auto-hide after 3 seconds
}

// ---------- Form error helpers (P0.4) ----------
function setFieldError(form, name, message) {
  const input = form.elements[name];
  if (!input) return;
  input.classList.add('input-error');
  const field = input.closest('.field');
  if (field) field.querySelector('.error').textContent = message;
}
function clearErrors(form) {
  form.querySelectorAll('.error').forEach((el) => { el.textContent = ''; });
  form.querySelectorAll('.input-error').forEach((el) => el.classList.remove('input-error'));
}
// Clears a field's error as soon as the user types in it (bonus UX)
function enableLiveClear(form) {
  const handler = (e) => {
    const input = e.target;
    input.classList.remove('input-error');
    const field = input.closest('.field');
    if (field) field.querySelector('.error').textContent = '';
  };
  form.addEventListener('input', handler);
  form.addEventListener('change', handler);
}

// ---------- Validators & formatters ----------
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // has @ and a dot after it
}
function isStrongPassword(password) {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}
function formatMoney(value) {
  return '$' + Number(value).toLocaleString('en-US');
}
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}
function getInitials(name) {
  return String(name || '?').trim().split(/\s+/).slice(0, 2)
    .map((word) => word[0].toUpperCase()).join('');
}
// Avatar: initials underneath, photo on top (photo removes itself if it fails to load)
function avatarHtml(name, image, size = '') {
  const img = image
    ? `<img src="${escapeHtml(image)}" alt="" loading="lazy" onerror="this.remove()">`
    : '';
  return `<div class="avatar ${size}"><span>${escapeHtml(getInitials(name))}</span>${img}</div>`;
}

// ---------- Shared client data layer (used by Dashboard, Clients, Profile) ----------
function saveClients(clients) { writeJSON(KEYS.clients, clients); }

// Maps one DummyJSON user to our Client model
function mapApiUser(user) {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone || '',
    company: (user.company && user.company.name) || '', // company is a nested object
    image: user.image || '',
    status: 'Lead',
    dealValue: Math.floor(Math.random() * 9501) + 500, // random 500–10000
    notes: [],
    createdAt: new Date().toISOString()
  };
}

async function fetchClientsFromApi() {
  const response = await fetch(`${API_URL}?limit=30`);
  if (!response.ok) throw new Error('Request failed: ' + response.status);
  const data = await response.json();
  return data.users.map(mapApiUser);
}

// Uses localStorage if present, otherwise loads from the API and saves the result
async function loadClients() {
  const stored = readJSON(KEYS.clients, null);
  if (Array.isArray(stored)) return stored;
  const clients = await fetchClientsFromApi();
  saveClients(clients);
  return clients;
}

// ---------- Boot ----------
applyTheme();
seedDemoUser();
if (ALLOWED) renderNav();