/* ==========================================================
   auth.js — Sign Up (P1) and Login (P2) logic
   ========================================================== */

// ---------- Sign Up ----------
function initSignup() {
  const form = $('signupForm');
  enableLiveClear(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);

    const fullName = form.elements.fullName.value.trim();
    const email = form.elements.email.value.trim().toLowerCase();
    const company = form.elements.company.value.trim();
    const password = form.elements.password.value;
    const confirm = form.elements.confirm.value;

    // Collect ALL errors first so they show together
    const errors = {};
    if (fullName.length < 3) {
      errors.fullName = 'Full name must be at least 3 characters';
    }
    if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    } else if (getUsers().some((u) => u.email === email)) {
      errors.email = 'An account with this email already exists';
    }
    if (!isStrongPassword(password)) {
      errors.password = 'Password must be at least 8 characters and contain a letter and a number';
    }
    if (confirm !== password) {
      errors.confirm = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([name, msg]) => setFieldError(form, name, msg));
      return; // nothing is saved
    }

    const user = {
      id: Date.now(),
      fullName,
      email,
      password, // plain text only because this is an educational project
      company,
      createdAt: new Date().toISOString()
    };
    const users = getUsers();
    users.push(user);
    saveUsers(users);

    showToast('Account created successfully! Please log in.');
    form.querySelector('button[type="submit"]').disabled = true;
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
  });
}

// ---------- Login ----------
function initLogin() {
  const form = $('loginForm');
  enableLiveClear(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);

    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;

    let hasError = false;
    if (!email) { setFieldError(form, 'email', 'Email is required'); hasError = true; }
    if (!password) { setFieldError(form, 'password', 'Password is required'); hasError = true; }
    if (hasError) return;

    // One generic message so attackers cannot tell which emails exist
    const user = getUsers().find((u) => u.email === email && u.password === password);
    if (!user) {
      setFieldError(form, 'password', 'Invalid email or password');
      showToast('Invalid email or password', 'error');
      return;
    }

    writeJSON(KEYS.session, {
      userId: user.id,
      email: user.email,
      loginAt: new Date().toISOString()
    });
    window.location.href = 'dashboard.html';
  });
}

if (ALLOWED) {
  if (PAGE === 'signup') initSignup();
  if (PAGE === 'login') initLogin();
}