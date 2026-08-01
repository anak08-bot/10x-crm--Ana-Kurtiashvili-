const showToast = (message, type = 'success') => {
    const toast = document.querySelector('#toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast hidden';
    }, 3000);
};

// Sign Up Handler
const signupForm = document.querySelector('#signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.querySelector('#fullName').value.trim();
        const email = document.querySelector('#email').value.trim();
        const company = document.querySelector('#company').value.trim();
        const password = document.querySelector('#password').value;
        const confirmPassword = document.querySelector('#confirmPassword').value;

        // Clear error messages
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        let isInvalid = false;

        if (fullName.length < 3) {
            document.querySelector('#fullName-error').textContent = 'Full name must be at least 3 characters';
            isInvalid = true;
        }

        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isEmailValid) {
            document.querySelector('#email-error').textContent = 'Please enter a valid email address';
            isInvalid = true;
        }

        const storedUsers = JSON.parse(localStorage.getItem('crm_users')) || [];
        const isEmailTaken = storedUsers.some(u => u.email === email.toLowerCase());

        if (isEmailTaken) {
            document.querySelector('#email-error').textContent = 'An account with this email already exists';
            isInvalid = true;
        }

        const isValidPassword = password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
        if (!isValidPassword) {
            document.querySelector('#password-error').textContent = 'Password must be at least 8 characters and contain a letter and a number';
            isInvalid = true;
        }

        if (password !== confirmPassword) {
            document.querySelector('#confirmPassword-error').textContent = 'Passwords do not match';
            isInvalid = true;
        }

        if (isInvalid) return;

        const record = {
            id: Date.now(),
            fullName,
            email: email.toLowerCase(),
            password,
            company,
            createdAt: new Date().toISOString()
        };

        storedUsers.push(record);
        localStorage.setItem('crm_users', JSON.stringify(storedUsers));

        showToast('Account created successfully! Please log in.', 'success');
        setTimeout(() => window.location.href = 'index.html', 1500);
    });
}

// Log In Handler
const loginForm = document.querySelector('#login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.querySelector('#login-email').value.trim();
        const password = document.querySelector('#login-password').value;

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        let isInvalid = false;

        if (!email) {
            document.querySelector('#login-email-error').textContent = 'Email is required';
            isInvalid = true;
        }
        if (!password) {
            document.querySelector('#login-password-error').textContent = 'Password is required';
            isInvalid = true;
        }

        if (isInvalid) return;

        const users = JSON.parse(localStorage.getItem('crm_users')) || [];
        const activeUser = users.find(u => u.email === email.toLowerCase() && u.password === password);

        if (!activeUser) {
            showToast('Invalid email or password', 'error');
            return;
        }

        const sessionPayload = {
            userId: activeUser.id,
            email: activeUser.email,
            loginAt: new Date().toISOString()
        };

        localStorage.setItem('crm_session', JSON.stringify(sessionPayload));
        window.location.href = 'clients.html';
    });
}