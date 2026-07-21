// ===========================
// Run correct function
// ===========================

document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("signupForm")) {
        initSignup();
    }

    if (document.getElementById("loginForm")) {
        initLogin();
    }

});


// ===========================
// SIGN UP
// ===========================

function initSignup() {

    const form = document.getElementById("signupForm");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        clearErrors();

        const fullName = document
            .getElementById("fullName")
            .value
            .trim();

        const email = document
            .getElementById("signupEmail")
            .value
            .trim()
            .toLowerCase();

        const company = document
            .getElementById("company")
            .value
            .trim();

        const password = document
            .getElementById("signupPassword")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;

        let valid = true;

        if (fullName.length < 3) {

            showError(
                "nameError",
                "Full name must be at least 3 characters"
            );

            valid = false;

        }

        if (
            !email.includes("@") ||
            !email.includes(".")
        ) {

            showError(
                "signupEmailError",
                "Please enter a valid email address"
            );

            valid = false;

        }

        const users = getUsers();

        if (
            users.some(user => user.email === email)
        ) {

            showError(
                "signupEmailError",
                "An account with this email already exists"
            );

            valid = false;

        }

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (
            password.length < 8 ||
            !hasLetter ||
            !hasNumber
        ) {

            showError(
                "signupPasswordError",
                "Password must be at least 8 characters and contain a letter and a number"
            );

            valid = false;

        }

        if (password !== confirmPassword) {

            showError(
                "confirmPasswordError",
                "Passwords do not match"
            );

            valid = false;

        }

        if (!valid) return;

        const newUser = {

            id: Date.now(),

            fullName,

            email,

            company,

            password,

            createdAt: new Date().toISOString()

        };

        users.push(newUser);

        saveUsers(users);

        showToast(
            "Account created successfully!"
        );

        setTimeout(() => {

            window.location.href = "index.html";

        }, 1500);

    });

}



// ===========================
// LOGIN
// ===========================

function initLogin() {

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        clearErrors();

        const email = document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

        const password = document
            .getElementById("password")
            .value;

        if (!email) {

            showError(
                "emailError",
                "Email is required"
            );

            return;

        }

        if (!password) {

            showError(
                "passwordError",
                "Password is required"
            );

            return;

        }

        const users = getUsers();

        const user = users.find(user => {

            return (
                user.email === email &&
                user.password === password
            );

        });

        if (!user) {

            showToast(
                "Invalid email or password",
                false
            );

            return;

        }

        const session = {

            userId: user.id,

            email: user.email,

            loginAt: new Date().toISOString()

        };

        saveSession(session);

        window.location.href = "dashboard.html";

    });

}



// ===========================
// Helpers
// ===========================

function showError(id, message) {

    document.getElementById(id).innerText = message;

}

function clearErrors() {

    const errors = document.querySelectorAll(".error");

    errors.forEach(error => {

        error.innerText = "";

    });

}