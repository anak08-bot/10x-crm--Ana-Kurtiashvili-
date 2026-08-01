(() => {
    const activeSession = localStorage.getItem('crm_session');
    const path = window.location.pathname;
    const isAuthPage = path.includes('index.html') || path.includes('signup.html') || path.endsWith('/');

    if (!activeSession && path.includes('clients.html')) {
        window.location.href = 'index.html';
    } else if (activeSession && isAuthPage) {
        window.location.href = 'clients.html';
    }
})();