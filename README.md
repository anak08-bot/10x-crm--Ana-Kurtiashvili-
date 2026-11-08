10X CRM Project

📌 About
10X CRM is a lightweight customer relationship management tool designed for sales managers, built entirely with Vanilla JavaScript (no frameworks). It enables users to register, log in, manage a dynamic client sales pipeline, log timestamped interaction notes, and set follow-up reminders. All application data is persisted client-side using the browser's localStorage.

📂 Project Structure

10x-crm/
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── clients.js
│   ├── core.js
│   ├── dashboard.js
│   └── profile.js
├── ai-log.md
├── clients.html
├── dashboard.html
├── index.html (Login)
├── profile.html
├── README.md
└── signup.html


✨ Features

· Authentication & Security: Sign up and log in with multi-field input validation and a global auth guard protecting internal pages (dashboard.html, clients.html, profile.html).

· Dashboard: Features a ticking live clock, 4 real-time business statistics, pipeline overview by deal status, and the 5 most recent clients.

· Client Management: Seeding initial data from DummyJSON API, adding new clients (POST), deleting clients (DELETE), and dynamically updating deal statuses.

· Search, Filter & Sort: Non-mutating data pipeline combining search query filtering, status chip toggling (All, Lead, Contacted, Won, Lost), and multi-option sorting.

· Client Details Modal: Interactive modal displaying complete client info, timestamped notes history, and a 1-minute follow-up reminder feature using setTimeout.

· Profile Management: Edit full name and company name, change passwords, and reset CRM client data back to initial API state.

· UI/UX & Resilience: Dark/Light theme toggle saved in localStorage, customizable toast notifications (replacing alert()), and network error handling with a Retry mechanism.


🛠 Tech Stack

· Frontend: HTML5, CSS3,  JavaScript 

· Asynchronous Operations: fetch API, Promises, async/await

· State & Persistence: Browser localStorage

· External API: DummyJSON API

· Deployment: Vercel / Netlify



🚀 How to Run

1. Clone the repository:

git clone https://github.com/anak08-bot/10x-crm--Ana-Kurtiashvili-.git

2. Open index.html directly in your web browser (or use VS Code Live Server).


🌐 Live Demo

👉 Click here for Live Demo (Replace with your actual Vercel/Netlify link)


🔑 Test Account

Email: demo@test.com

Password: demo1234

(Or simply sign up with a new account directly on the live site).


💾 Data Model (localStorage Keys)

The application relies on four required localStorage keys for full functionality:

crm_users – Array of registered user objects.

crm_session – Active user session token object.

crm_clients – Array of client objects representing application state.

crm_theme – Current UI theme state ("dark" or "light").


🔒 Note on Security

Passwords are stored in plain text within localStorage exclusively because this is a client-side educational project without a custom backend server. In a real-world production environment, passwords must be securely hashed on the backend server before storage.



👥 Credits

Developer: Built by Ana Kurtiashvili.

AI Assistance:

· Claude: Used for code generation and logic refactoring.

· Gemini: Used for structural planning, project guidelines, and debugging.

· ChatGPT: Used for prompt engineering and validation assistance.