// ===== profile.js — info block, edit profile, change password, reset data =====
const profileForm = $('profileForm'), passwordForm = $('passwordForm');

function showInfo() {
  const u = currentUser();
  const initials = u.fullName.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  $('profInfo').innerHTML = `<div class="avatar big">${esc(initials)}</div><div><h2 style="margin:0">${esc(u.fullName)}</h2>
    <span class="muted">${esc(u.email)}${u.company ? ' · ' + esc(u.company) : ''}</span><br>
    <span class="muted">Member since ${new Date(u.createdAt).toLocaleDateString()}</span></div>`;
}
function fillForm() {
  const u = currentUser();
  profileForm.elements.fullName.value = u.fullName;
  profileForm.elements.company.value = u.company;
}

profileForm.addEventListener('submit', e => {
  e.preventDefault();
  const fullName = profileForm.elements.fullName.value.trim();
  const company = profileForm.elements.company.value.trim();
  const errors = fullName.length < 3 ? { fullName: 'Full name must be at least 3 characters' } : {};
  showErrors(profileForm, errors);
  if (Object.keys(errors).length) return;
  updateUser(u => { u.fullName = fullName; u.company = company; });
  showInfo();
  toast('Profile updated ✓');
});

passwordForm.addEventListener('submit', e => {
  e.preventDefault();
  const f = passwordForm.elements, user = currentUser(), errors = {};
  if (f.current.value !== user.password) errors.current = 'Current password is incorrect';
  if (!isStrongPassword(f.next.value)) errors.next = 'Password must be at least 8 characters and contain a letter and a number';
  else if (f.next.value === user.password) errors.next = 'New password must be different from the current one';
  if (f.confirm.value !== f.next.value) errors.confirm = 'Passwords do not match';
  showErrors(passwordForm, errors);
  if (Object.keys(errors).length) return;
  updateUser(u => { u.password = f.next.value; });
  passwordForm.reset();
  toast('Password changed ✓');
});

$('resetBtn').onclick = async () => {
  if (!confirm('Reset all CRM data? Your clients will be reloaded from the API.')) return;
  localStorage.removeItem(KEYS.clients);   // users and session are untouched
  try { await fetchClients(); toast('CRM data reset ✓'); }
  catch { toast('Could not reload clients. Check your connection and try again.', 'error'); }
};

if (AUTH_OK) { showInfo(); fillForm(); }
