// ===== clients.js — the "golden cycle": change state -> save -> render =====
let clients = [];                                   // the single source of truth (state)
const view = { filter: 'All', search: '', sort: 'newest' };
let currentId = null;                               // client open in the details modal
const list = $('clientList');
const BADGE = { Lead: 'b-lead', Contacted: 'b-contacted', Won: 'b-won', Lost: 'b-lost' }; // lookup instead of switch
const byId = id => clients.find(c => c.id === Number(id));

// --- 1. LOAD (localStorage first, API second) ---
async function loadClients() {
  list.innerHTML = '<p class="muted">Loading clients...</p>';
  try {
    clients = await getClients();
    renderClients(getVisibleClients());
  } catch (err) {
    list.innerHTML = '<div class="card"><p class="error">Could not load clients. Check your connection and try again.</p><button id="retryBtn">Retry</button></div>';
    $('retryBtn').onclick = loadClients;
  }
}

// --- 2. VISIBLE LIST: status filter -> search -> sort (never mutates `clients`) ---
function getVisibleClients() {
  let result = clients.filter(c => view.filter === 'All' || c.status === view.filter); // filter() returns a COPY
  const q = view.search.trim().toLowerCase();
  if (q) result = result.filter(c => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q));
  if (view.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
  else if (view.sort === 'deal') result.sort((a, b) => b.dealValue - a.dealValue);
  else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return result;
}

// --- 3. RENDER ---
function renderClients(arr) {
  list.innerHTML = arr.length ? '' : '<p class="muted">No clients found.</p>';
  arr.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card client';
    card.dataset.id = c.id;
    card.innerHTML = `<img class="avatar" src="${esc(c.image)}" alt="">
      <div class="info"><strong>${esc(c.name)}</strong><span class="muted">${esc(c.company)} · ${esc(c.email)}</span><span class="deal">${money(c.dealValue)}</span></div>
      <span class="badge ${BADGE[c.status]}">${c.status}</span>
      <select class="status-select" data-id="${c.id}">${STATUSES.map(s => `<option ${s === c.status ? 'selected' : ''}>${s}</option>`).join('')}</select>
      <button class="danger del" data-id="${c.id}">Delete</button>`;
    list.appendChild(card);
  });
}
function commit() { save(KEYS.clients, clients); renderClients(getVisibleClients()); } // save + render

// --- 4. CARD EVENTS (event delegation: one listener for all cards) ---
list.addEventListener('change', e => {
  if (!e.target.matches('.status-select')) return;
  byId(e.target.dataset.id).status = e.target.value;
  commit();
});
list.addEventListener('click', e => {
  const del = e.target.closest('.del');
  if (del) return deleteClient(del.dataset.id);
  if (e.target.closest('select, button')) return;          // ignore controls inside the card
  const card = e.target.closest('.client');
  if (card) openDetails(card.dataset.id);
});

// --- 5. DELETE (DELETE request -> state -> save -> render) ---
async function deleteClient(id) {
  if (!confirm('Delete this client? This cannot be undone.')) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    // DummyJSON answers 404 for clients we added ourselves (it never stored them) - expected, we still delete locally
    if (!res.ok) console.warn('Server returned', res.status, '- deleting locally anyway');
  } catch { /* offline: still delete locally */ }
  clients = clients.filter(c => c.id !== Number(id));
  commit();
  toast('Client deleted');
}

// --- 6. MODALS ---
const openModal = id => $(id).classList.remove('hidden');
document.querySelectorAll('.modal-bg').forEach(bg => bg.addEventListener('click', e => {
  if (e.target === bg || e.target.hasAttribute('data-close')) bg.classList.add('hidden'); // backdrop or X
}));

// --- 7. ADD CLIENT ---
$('addBtn').onclick = () => openModal('addModal');
$('addForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target, f = form.elements;
  const name = f.clientName.value.trim(), email = f.email.value.trim().toLowerCase();
  const phone = f.phone.value.trim(), company = f.company.value.trim();
  const dealRaw = f.dealValue.value.trim(), deal = Number(dealRaw);

  const errors = {};
  if (name.length < 3) errors.clientName = 'Name must be at least 3 characters';
  if (!isValidEmail(email)) errors.email = 'Please enter a valid email address';
  else if (clients.some(c => c.email.toLowerCase() === email)) errors.email = 'A client with this email already exists';
  if (phone && phone.length < 6) errors.phone = 'Phone number looks too short';
  if (dealRaw === '' || isNaN(deal) || deal <= 0) errors.dealValue = 'Deal value must be a positive number';
  showErrors(form, errors);
  if (Object.keys(errors).length) return;

  try {
    const [firstName, ...rest] = name.split(' ');
    const res = await fetch(`${API}/add`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName: rest.join(' '), email, phone })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    // DummyJSON returns the SAME fake id every time, so fall back to Date.now() to keep ids unique
    const id = clients.some(c => c.id === data.id) ? Date.now() : data.id;
    clients.unshift({ id, name, email, phone, company,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128`,
      status: f.status.value, dealValue: deal, notes: [], createdAt: new Date().toISOString() });
    commit();
    form.reset(); showErrors(form, {});
    $('addModal').classList.add('hidden');
    toast('Client added ✓');
  } catch { toast('Could not add client. Please try again.', 'error'); }
});

// --- 8. DETAILS, NOTES, REMINDER ---
function openDetails(id) { currentId = Number(id); renderDetails(); openModal('detailsModal'); }
function renderDetails() {
  const c = byId(currentId);
  $('detailsBody').innerHTML = `<div class="row" style="justify-content:flex-start"><img class="avatar" src="${esc(c.image)}" alt="">
    <div><h2 style="margin:0">${esc(c.name)}</h2><span class="muted">${esc(c.company)}</span></div></div>
    <p>${esc(c.email)}<br>${esc(c.phone || '—')}<br><span class="badge ${BADGE[c.status]}">${c.status}</span> <b class="deal">${money(c.dealValue)}</b><br>
    <span class="muted">Client since ${new Date(c.createdAt).toLocaleDateString()}</span></p>`;
  $('notesList').innerHTML = c.notes.length
    ? c.notes.map(n => `<li>${esc(n.text)} <span class="muted">— ${esc(n.date)}</span></li>`).join('')
    : '<li class="muted">No notes yet.</li>';
}
$('addNoteBtn').onclick = () => {
  const text = $('noteInput').value.trim();
  if (!text) return;                                       // empty notes are ignored
  byId(currentId).notes.push({ text, date: new Date().toLocaleString() });
  $('noteInput').value = '';
  commit(); renderDetails();
};
$('remindBtn').onclick = () => {
  const name = byId(currentId).name;                       // captured now, works even if the modal closes
  toast('Reminder set ✓');
  setTimeout(() => toast(`⏰ Follow up: ${name}`), 60000);
};

// --- 9. TOOLBAR ---
$('search').addEventListener('input', e => { view.search = e.target.value; renderClients(getVisibleClients()); });
$('sort').addEventListener('change', e => { view.sort = e.target.value; renderClients(getVisibleClients()); });
$('chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip'); if (!chip) return;
  view.filter = chip.dataset.status;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === chip));
  renderClients(getVisibleClients());
});

if (AUTH_OK) loadClients();
