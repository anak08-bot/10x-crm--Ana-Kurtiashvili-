// ==========================
// Auth Guard
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const session = getSession();

    const currentPage = window.location.pathname.split("/").pop();

    const protectedPages = [
        "dashboard.html",
        "clients.html",
        "profile.html"
    ];

    const publicPages = [
        "index.html",
        "signup.html"
    ];

    // Protected pages
    if (
        protectedPages.includes(currentPage) &&
        !session
    ) {

        window.location.href = "index.html";
        return;

    }

    // Public pages
    if (
        publicPages.includes(currentPage) &&
        session
    ) {

        window.location.href = "dashboard.html";
        return;

    }

});