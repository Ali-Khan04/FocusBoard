# 🧠 FocusBoard 

A full-stack productivity dashboard built with the MERN stack — designed not just to manage tasks, but to help you analyze your focus.

FocusBoard transforms everyday todo management into a data-driven experience, combining clean UI, smooth UX, and powerful backend logic — all engineered from scratch.

---

## 📸 Screenshots

### Dashboard Analytics
![Landing Page](assets/DashBoard.png)

### Todo Management
![Todo Form](assets/Todos.png)

### Add New Tasks
![Dashboard](assets/TodoForm.png)

### Guest Mode
![Guest Mode](assets/guestMode.png)


---

## 🚀 Key Highlights

* 🔐 **JWT Authentication & Secure Sessions** — with protected routes and persistent login
* 👤 **Profile Management** — update name, email, password, and upload avatars
* 🗂️ **Task Operations (CRUD)** — create, edit, delete, and mark todos as completed
* 📊 **Dashboard Analytics** — visualize your productivity patterns in real time
* 🧭 **Guest Mode** — try the full app instantly without signing up
* 🔔 **Unified Notification System** — global success/error messages with auto-clear
* 📅 **Due Dates & Priorities** — intelligent organization and reminders
* 💡 **Modern UI/UX** — built for clarity, speed, and focus

---

## 🧱 Tech Stack

| Frontend | Backend | Database | Styling |
|----------|---------|----------|---------|
| React (Vite) | Express.js | MongoDB (Mongoose) | Custom CSS |

---

## ⚙️ Architecture & Engineering

* 🧠 **Global State Management** via `useReducer` + Context API → predictable updates and no prop drilling
* 🧩 **Modular Backend** with middlewares for validation, authentication, and error handling
* 🌍 **Centralized API Layer** using `apiRequest` for cleaner network logic
* 🔄 **Smart Data Fetching** — prevents redundant calls with local caching
* 🧰 **Reusable Hooks** (`useTodos`, `useUserInput`) for elegant abstraction
* 🧠 **Scalable Folder Structure** — production-ready and easy to maintain

---

## 🎯 The Goal Behind FocusBoard

FocusBoard was built to go beyond "just another todo app." It's a demonstration of real-world full-stack architecture, scalable React design patterns, and clean, maintainable backend logic, developed under real-world constraints (university workload + deployment readiness).

---

## 🏗️ Future Enhancements

* 📩 Email reminders for approaching due dates
* 🔍 Advanced search and filtering capabilities
