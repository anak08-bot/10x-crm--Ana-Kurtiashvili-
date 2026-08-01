let state = [];

const showNotification = (msg, type = 'success') => {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = `toast ${type}`;
    setTimeout(() => { el.className = 'toast hidden'; }, 3000);
};

const renderClients = () => {
    const wrapper = document.getElementById('clients-container');
    wrapper.innerHTML = '';

    if (!state.length) {
        wrapper.innerHTML = '<p class="no-data">No clients found.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();

    state.forEach(item => {
        const card = document.createElement('article');
        card.className = 'client-card';
        card.innerHTML = `
            <img src="${item.image || 'https://dummyjson.com/icon/emilys/128'}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p><strong>Company:</strong> ${item.company}</p>
            <p><strong>Email:</strong> ${item.email}</p>
            <p><strong>Value:</strong> $${Number(item.dealValue).toLocaleString()}</p>
            <span class="badge ${item.status.toLowerCase()}">${item.status}</span>
            <button class="btn-delete" data-id="${item.id}">Delete</button>
        `;
        fragment.appendChild(card);
    });

    wrapper.appendChild(fragment);

    wrapper.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = (e) => {
            const targetId = Number(e.currentTarget.getAttribute('data-id'));
            if (confirm('Delete this client?')) removeClient(targetId);
        };
    });
};

const loadClientsData = async () => {
    const cached = localStorage.getItem('crm_clients');
    if (cached) {
        state = JSON.parse(cached);
        renderClients();
        return;
    }

    try {
        const response = await fetch('https://dummyjson.com/users?limit=30');
        const data = await response.json();
        
        state = data.users.map(u => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            phone: u.phone,
            company: u.company?.name || 'Independent',
            image: u.image,
            status: 'Lead',
            dealValue: Math.floor(Math.random() * 9500) + 500,
            notes: [],
            createdAt: new Date().toISOString()
        }));

        localStorage.setItem('crm_clients', JSON.stringify(state));
        renderClients();
    } catch (err) {
        document.getElementById('clients-container').innerHTML = '<p class="error">Could not load clients.</p>';
    }
};

const removeClient = (id) => {
    state = state.filter(item => item.id !== id);
    localStorage.setItem('crm_clients', JSON.stringify(state));
    renderClients();
    showNotification('Client deleted', 'success');
};

// Modal Operations
const modalElem = document.getElementById('client-modal');
const btnOpen = document.getElementById('open-modal-btn');
const btnClose = document.getElementById('close-modal-btn');

btnOpen?.addEventListener('click', () => modalElem?.classList.remove('hidden'));
btnClose?.addEventListener('click', () => modalElem?.classList.add('hidden'));

// Add Client Form
const clientForm = document.getElementById('add-client-form');
clientForm?.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const company = document.getElementById('client-company').value.trim();
    const dealValue = document.getElementById('client-value').value;

    if (state.some(c => c.email === email)) {
        document.getElementById('client-email-error').textContent = 'Client email must be unique';
        return;
    }

    const newEntry = {
        id: Date.now(),
        name,
        email,
        phone,
        company,
        image: '',
        status: 'Lead',
        dealValue: Number(dealValue),
        notes: [],
        createdAt: new Date().toISOString()
    };

    state.unshift(newEntry);
    localStorage.setItem('crm_clients', JSON.stringify(state));
    renderClients();

    modalElem.classList.add('hidden');
    clientForm.reset();
    showNotification('Client added ✓', 'success');
});

// Logout Operation from the dashboard
document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('crm_session');
    window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', loadClientsData);