// ===== auth.js — Sign Up (signup.html) and Log In (index.html) =====
const signupForm = $('signupForm');
const loginForm = $('loginForm');

if (AUTH_OK && signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = signupForm.elements;
    const users = load(KEYS.users, []);
    const fullName = f.fullName.value.trim();
    const email = f.email.value.trim().toLowerCase();
    const company = f.company.value.trim();
    const password = f.password.value;

    // Collect ALL errors first so the user sees them together
    const errors = {};
    if (fullName.length < 3) errors.fullName = 'Full name must be at least 3 characters';
    if (!isValidEmail(email)) errors.email = 'Please enter a valid email address';
    else if (users.some(u => u.email === email)) errors.email = 'An account with this email already exists';
    if (!isStrongPassword(password)) errors.password = 'Password must be at least 8 characters and contain a letter and a number';
    if (f.confirm.value !== password) errors.confirm = 'Passwords do not match';

    showErrors(signupForm, errors);
    if (Object.keys(errors).length) return; // nothing is saved when invalid

    users.push({ id: Date.now(), fullName, email, password, company, createdAt: new Date().toISOString() });
    save(KEYS.users, users);
    toast('Account created successfully! Please log in.');
    signupForm.querySelector('button').disabled = true;
    setTimeout(() => (location.href = 'index.html'), 1500);
  });
}

if (AUTH_OK && loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm.elements.email.value.trim().toLowerCase();
    const password = loginForm.elements.password.value;

    const errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (Object.keys(errors).length) return showErrors(loginForm, errors);

    const user = load(KEYS.users, []).find(u => u.email === email && u.password === password);
    if (!user) { // one generic message: do not reveal which part was wrong
      showErrors(loginForm, { password: 'Invalid email or password' });
      return toast('Invalid email or password', 'error');
    }
    save(KEYS.session, { userId: user.id, email: user.email, loginAt: new Date().toISOString() });
    location.href = 'dashboard.html';
  });
}
