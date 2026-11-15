/* ==========================================================
   profile.js — Profile page (P5)
   ========================================================== */

(function () {
  if (!ALLOWED) return;

  const profileForm = $('profileForm');
  const passwordForm = $('passwordForm');

  // Finds the logged-in user inside the crm_users array and saves changes to it
  function updateCurrentUser(changes) {
    const session = getSession();
    const users = getUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) return null;
    Object.assign(user, changes);
    saveUsers(users);
    return user;
  }

  // ---------- Info block (P5.1) ----------
  function renderInfo() {
    const user = getCurrentUser();
    if (!user) return;
    $('profInfo').innerHTML = `
      ${avatarHtml(user.fullName, '', 'lg')}
      <div>
        <h2 style="margin:0">${escapeHtml(user.fullName)}</h2>
        <div class="muted">${escapeHtml(user.email)}${user.company ? ' · ' + escapeHtml(user.company) : ''}</div>
        <div class="muted small">Member since ${new Date(user.createdAt).toLocaleDateString()}</div>
      </div>`;
  }

  function fillProfileForm() {
    const user = getCurrentUser();
    if (!user) return;
    profileForm.elements.fullName.value = user.fullName;
    profileForm.elements.company.value = user.company || '';
  }

  // ---------- Edit profile (P5.2) ----------
  enableLiveClear(profileForm);
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(profileForm);
    const fullName = profileForm.elements.fullName.value.trim();
    const company = profileForm.elements.company.value.trim();

    if (fullName.length < 3) {
      setFieldError(profileForm, 'fullName', 'Full name must be at least 3 characters');
      return;
    }
    updateCurrentUser({ fullName, company });
    renderInfo();
    showToast('Profile updated ✓');
  });

  // ---------- Change password (P5.3) ----------
  enableLiveClear(passwordForm);
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(passwordForm);
    const user = getCurrentUser();
    const current = passwordForm.elements.current.value;
    const next = passwordForm.elements.next.value;
    const confirm = passwordForm.elements.confirm.value;

    const errors = {};
    if (current !== user.password) {
      errors.current = 'Current password is incorrect';
    }
    if (!isStrongPassword(next)) {
      errors.next = 'Password must be at least 8 characters and contain a letter and a number';
    } else if (next === user.password) {
      errors.next = 'New password must be different from the current one';
    }
    if (confirm !== next) {
      errors.confirm = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([name, msg]) => setFieldError(passwordForm, name, msg));
      return;
    }
    updateCurrentUser({ password: next });
    passwordForm.reset();
    showToast('Password changed ✓');
  });

  // ---------- Reset CRM data (P5.4) ----------
  $('resetBtn').addEventListener('click', async () => {
    if (!confirm('Reset all client data back to the original 30 clients?')) return;
    try {
      const fresh = await fetchClientsFromApi(); // fetch first, so a failure loses nothing
      saveClients(fresh);
      showToast('CRM data reset ✓'); // crm_users and crm_session are untouched
    } catch (err) {
      showToast('Could not reload clients. Check your connection and try again.', 'error');
    }
  });

  renderInfo();
  fillProfileForm();
})();