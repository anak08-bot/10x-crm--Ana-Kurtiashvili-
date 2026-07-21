// ================================
// LocalStorage Keys
// ================================

const USERS_KEY = "crm_users";
const SESSION_KEY = "crm_session";
const CLIENTS_KEY = "crm_clients";
const THEME_KEY = "crm_theme";


// ================================
// Generic Storage Functions
// ================================

function getData(key) {

    const data = localStorage.getItem(key);

    if (data) {
        return JSON.parse(data);
    }

    return [];

}

function saveData(key, value) {

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}

function removeData(key) {

    localStorage.removeItem(key);

}


// ================================
// Users
// ================================

function getUsers() {

    return getData(USERS_KEY);

}

function saveUsers(users) {

    saveData(
        USERS_KEY,
        users
    );

}


// ================================
// Session
// ================================

function getSession() {

    const session = localStorage.getItem(SESSION_KEY);

    if (!session) {

        return null;

    }

    return JSON.parse(session);

}

function saveSession(session) {

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );

}

function logout() {

    localStorage.removeItem(
        SESSION_KEY
    );

}


// ================================
// Clients
// ================================

function getClients() {

    return getData(CLIENTS_KEY);

}

function saveClients(clients) {

    saveData(
        CLIENTS_KEY,
        clients
    );

}


// ================================
// Theme
// ================================

function saveTheme(theme) {

    localStorage.setItem(
        THEME_KEY,
        theme
    );

}

function getTheme() {

    return localStorage.getItem(THEME_KEY);

}


// ================================
// Toast Notification
// ================================

function showToast(message, success = true) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.innerText = message;

    toast.className = success
        ? "toast success"
        : "toast error";

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3000);

}