# 10X CRM - Client Management Dashboard

A modern, fast, and responsive Customer Relationship Management (CRM) web application built with clean HTML5, modern CSS3 (Variables & Dark Mode), and Vanilla JavaScript (ES6+).

---

## 🚀 Features

- **Authentication & Authorization System**
  - User Registration with form validation (Name, Email, Password verification).
  - Secure Login authentication backed by local storage.
  - Route Guard (`guard.js`) to prevent unauthorized access to protected dashboard pages.

- **Client Management Dashboard**
  - **Dynamic Fetching:** Automatically populates mock data via external API (`DummyJSON`) on initial load.
  - **Client Creation:** Interactive modal for adding new clients with unique email validation.
  - **Status & Deal Tracking:** Visual badges for deal stages (`Lead`, `Contacted`, `Won`, `Lost`) and formatted currency values.
  - **Client Deletion:** Fast removal of records with instant UI updates.
  - **Persistence:** All updates persist locally using browser `localStorage`.

- **Modern & Responsive UI**
  - Dark-mode aesthetic designed with CSS custom properties (variables).
  - Responsive grid layout for client cards and form components.
  - Toast notification system for clear user feedback.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Flexbox, Grid, CSS Variables)
- **Scripting:** JavaScript (ES6+, Async/Await, DOM Manipulation)
- **Data Persistence:** Web Storage API (`localStorage`)
- **API Integration:** [DummyJSON API](https://dummyjson.com/) (Mock User Data)

---

## 📁 Project Structure

```text
├── css/
│   └── styles.css        # Main stylesheet (Variables, Themes, Layouts)
├── js/
│   ├── auth.js          # Registration & Authentication logic
│   ├── clients.js       # Dashboard UI & Client CRUD operations
│   └── guard.js        # Authentication route guard
├── index.html           # Login page
├── signup.html          # Registration page
├── clients.html         # Main CRM Dashboard
└── README.md            # Project documentation