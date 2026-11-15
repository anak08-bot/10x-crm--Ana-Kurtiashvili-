/* ==========================================================
   clients.js — Clients page (P4)
   Golden cycle: state changes -> saveClients() -> render
   ========================================================== */

(function () {
  if (!ALLOWED) return;

  // ---------- State ----------
  let clients = [];                                    // main state (mirrors crm_clients)
  const ui = { query: '', status: 'All', sort: 'newest' }; // view settings, never saved
  let activeClientId = null;                           // client open in the details modal

  const listEl = $('clientList');
  const addForm = $('addForm');

  // ---------- Loading (P4.2) ----------
  async function init() {
    listEl.innerHTML = '<p class="muted state-msg">Loading clients...</p>';
    try {
      clients = await loadClients();
      render();
    } catch (err) {
      showLoadError();
    }
  }

  function showLoadError() {
    listEl.innerHTML = `
      <div class="state-msg">
        <p class="muted">Could not load clients. Check your connection and try again.</p>
        <button id="retryBtn" type="button">Retry</button>
      </div>`;
    $('retryBtn').addEventListener('click', init);
  }

  // ---------- Filter / search / sort (P4.7) ----------
  // Works on copies, so the original `clients` array is never mutated.
  function getVisibleClients() {
    const query = ui.query.trim().toLowerCase();
    const result = clients
      .filter((c) => ui.status === 'All' || c.status === ui.status)
      .filter((c) => !query ||
        c.name.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query))
      .slice();

    if (ui.sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (ui.sort === 'deal') {
      result.sort((a, b) => b.dealValue - a.dealValue);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return result;
  }

  // ---------- Rendering (P4.3) ----------
  function render() {
    renderClients(getVisibleClients());
  }

  function renderClients(list) {
    listEl.innerHTML = '';
    if (list.length === 0) {
      listEl.innerHTML = '<p class="muted state-msg">No clients found.</p>';
      return;
    }
    list.forEach((c) => {
      const card = document.createElement('div');
      card.className = `client-card ${STATUS_CLASS[c.status] || ''}`;
      card.dataset.id = c.id;
      const options = STATUSES.map((s) =>
        `<option value="${s}" ${s === c.status ? 'selected' : ''}>${s}</option>`).join('');
      card.innerHTML = `
        ${avatarHtml(c.name, c.image)}
        <div class="client-main">
          <h3>${escapeHtml(c.name)}</h3>
          <p class="muted">${escapeHtml(c.company)}</p>
          <p class="muted small">${escapeHtml(c.email)}</p>
        </div>
        <div class="client-side">
          <span class="badge ${STATUS_CLASS[c.status] || ''}">${escapeHtml(c.status)}</span>
          <span class="deal">${formatMoney(c.dealValue)}</span>
        </div>
        <div class="client-actions">
          <select class="status-select" data-id="${c.id}">${options}</select>
          <button class="danger delete-btn" type="button" data-id="${c.id}">Delete</button>
        </div>`;
      listEl.appendChild(card);
    });
  }

  // ---------- Modal helpers ----------
  function openModal(modal) { modal.classList.remove('hidden'); }
  function closeModal(modal) { modal.classList.add('hidden'); }

  document.querySelectorAll('.modal-bg').forEach((modal) => {
    // X button closes; clicking the dark background also closes (bonus)
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.matches('[data-close]')) closeModal(modal);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-bg').forEach(closeModal);
  });

  // ---------- Add Client (P4.4) ----------
  $('addBtn').addEventListener('click', () => {
    addForm.reset();
    clearErrors(addForm);
    openModal($('addModal'));
  });
  enableLiveClear(addForm);

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors(addForm);

    const name = addForm.elements.clientName.value.trim();
    const email = addForm.elements.email.value.trim().toLowerCase();
    const phone = addForm.elements.phone.value.trim();
    const company = addForm.elements.company.value.trim();
    const dealRaw = addForm.elements.dealValue.value.trim();
    const status = addForm.elements.status.value;
    const dealValue = Number(dealRaw);

    const errors = {};
    if (name.length < 3) errors.clientName = 'Name must be at least 3 characters';
    if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    } else if (clients.some((c) => c.email.toLowerCase() === email)) {
      errors.email = 'A client with this email already exists';
    }
    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (phone.length < 6) {
      errors.phone = 'Phone number looks too short';
    }
    if (dealRaw === '' || isNaN(dealValue) || dealValue <= 0) {
      errors.dealValue = 'Deal value must be a positive number';
    }
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, msg]) => setFieldError(addForm, field, msg));
      return;
    }

    const submitBtn = addForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    try {
      // POST is simulated by DummyJSON: it replies but does not store anything
      const [firstName, ...rest] = name.split(' ');
      const response = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName: rest.join(' '), email, phone })
      });
      if (!response.ok) throw new Error('Request failed: ' + response.status);
      const data = await response.json();

      // DummyJSON always answers with the same id (e.g. 209), so fall back to
      // Date.now() when that id is already taken. Ids must stay unique.
      let id = Number(data.id);
      if (!id || clients.some((c) => c.id === id)) id = Date.now();

      clients.unshift({
        id, name, email, phone, company,
        image: '',
        status, dealValue,
        notes: [],
        createdAt: new Date().toISOString()
      });
      saveClients(clients);
      render();
      closeModal($('addModal'));
      showToast('Client added ✓');
    } catch (err) {
      showToast('Could not add client. Check your connection and try again.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });

  // ---------- Delete (P4.5) ----------
  async function deleteClient(id) {
    if (!confirm('Delete this client? This cannot be undone.')) return;
    try {
      // A 404 is expected for clients we created ourselves (the server never stored
      // them), so we do not check response.ok — we only fail on a network error.
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (err) {
      showToast('Network error. Client was not deleted.', 'error');
      return;
    }
    clients = clients.filter((c) => c.id !== id);
    saveClients(clients);
    render();
    showToast('Client deleted');
  }

  // ---------- Status change (P4.6) ----------
  function changeStatus(id, status) {
    const client = clients.find((c) => c.id === id);
    if (!client) return;
    client.status = status;
    saveClients(clients);
    render();
    showToast('Status updated ✓');
  }

  // ---------- Card events (one listener for all cards = event delegation) ----------
  listEl.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) { deleteClient(Number(deleteBtn.dataset.id)); return; }
    if (e.target.closest('.status-select')) return; // do not open details on select click
    const card = e.target.closest('.client-card');
    if (card) openDetails(Number(card.dataset.id));
  });
  listEl.addEventListener('change', (e) => {
    const select = e.target.closest('.status-select');
    if (select) changeStatus(Number(select.dataset.id), select.value);
  });

  // ---------- Toolbar: search, chips, sort ----------
  $('search').addEventListener('input', (e) => { ui.query = e.target.value; render(); });
  $('sort').addEventListener('change', (e) => { ui.sort = e.target.value; render(); });
  $('chips').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    document.querySelectorAll('#chips .chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    ui.status = chip.dataset.status;
    render();
  });

  // ---------- Details modal, notes, reminder (P4.8) ----------
  function openDetails(id) {
    const client = clients.find((c) => c.id === id);
    if (!client) return;
    activeClientId = id;
    $('detailsBody').innerHTML = `
      <div class="detail-head">
        ${avatarHtml(client.name, client.image, 'lg')}
        <div>
          <h2>${escapeHtml(client.name)}</h2>
          <span class="badge ${STATUS_CLASS[client.status] || ''}">${escapeHtml(client.status)}</span>
        </div>
      </div>
      <div class="detail-grid">
        <div><span>Company</span>${escapeHtml(client.company) || '—'}</div>
        <div><span>Deal value</span>${formatMoney(client.dealValue)}</div>
        <div><span>Email</span>${escapeHtml(client.email)}</div>
        <div><span>Phone</span>${escapeHtml(client.phone) || '—'}</div>
        <div><span>Client since</span>${new Date(client.createdAt).toLocaleDateString()}</div>
      </div>`;
    renderNotes();
    $('noteInput').value = '';
    openModal($('detailsModal'));
  }

  function renderNotes() {
    const client = clients.find((c) => c.id === activeClientId);
    const list = $('notesList');
    if (!client || client.notes.length === 0) {
      list.innerHTML = '<li class="muted">No notes yet.</li>';
      return;
    }
    // Oldest first, newest last
    list.innerHTML = client.notes.map((n) =>
      `<li>${escapeHtml(n.text)}<small>${escapeHtml(n.date)}</small></li>`).join('');
  }

  function addNote() {
    const client = clients.find((c) => c.id === activeClientId);
    const text = $('noteInput').value.trim();
    if (!client || !text) return; // empty notes are not added
    client.notes.push({ text, date: new Date().toLocaleString() });
    saveClients(clients);
    $('noteInput').value = '';
    renderNotes();
  }
  $('addNoteBtn').addEventListener('click', addNote);
  $('noteInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') addNote(); });

  $('remindBtn').addEventListener('click', () => {
    const client = clients.find((c) => c.id === activeClientId);
    if (!client) return;
    const name = client.name; // captured now, so it works even after the modal is closed
    showToast('Reminder set ✓');
    setTimeout(() => showToast(`⏰ Follow up: ${name}`), 60000);
  });

  init();
})();