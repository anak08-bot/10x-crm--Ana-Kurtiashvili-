10X CRM Project

About
10X CRM is a lightweight customer relationship management tool for sales managers, built with vanilla JavaScript only. It lets users register, log in, manage a client pipeline and track notes and reminders. All data is stored in the browser's localStorage.

 Features
- Sign up / Log in with validation and an auth guard on protected pages
- Dashboard: live clock, 4 statistics, pipeline overview, 5 most recent clients
- Clients: load from DummyJSON API, add (POST), delete (DELETE), change status
- Combined search, status filter chips and sorting
- Client details modal with timestamped notes and a 1-minute follow-up reminder
- Profile: edit name/company, change password, reset CRM data
- Dark / light theme saved in localStorage; toast notifications; error handling with Retry

 Tech Stack
HTML5, CSS3, vanilla JavaScript (ES6+), `fetch` + async/await, localStorage, DummyJSON API, deployed on Vercel/Netlify.

 How to Run
1. Clone the repository.
2. Open `index.html` in a browser (or use a local server such as VS Code Live Server).

 Live Demo
<!-- TODO: paste your Vercel/Netlify link here -->

 Test Account
Email: `demo@test.com` / Password: `demo1234` — or simply sign up with a new account.
(Create this account yourself once on the live site before submitting.)

 Data Model (localStorage keys)
`crm_users`, `crm_session`, `crm_clients`, `crm_theme`

 Note on Security
Passwords are stored in plain text only because this is a learning project without a backend. In production, passwords must be hashed and stored on a server.

 Credits
<!-- TODO: list who helped you and with what; AI tools used -->
