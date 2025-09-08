# 📝 Fullstack Todo App

A comprehensive task management solution built with the **MERN stack** (MongoDB, Express.js, React, Node.js). This app empowers users to organize their tasks, set priorities, and manage deadlines effectively, all with a clean and modern UI.

---
* ✅ **User Authentication** (JWT-based)
* 👤 **User Dashboard** with personalized experience
* 🗂️ **CRUD Operations** on todos
* 📅 **Due Dates** for tasks (planned: email reminders)
* 🔍 **Filter & Search** through todos
* 📱 Fully responsive UI with modern design
* 🛠️ Built with clean code, reusable components, and scalable folder structure

**🛠️ Tech Stack**
| **Frontend** | **Backend** | **Database** | **Styling** |
|--------------|-------------|--------------|-------------|
| React        | Express     | MongoDB      | CSS         |

**🏗️ Architecture Highlights**

**Advanced State Management**
* **useReducer + Context API** instead of basic useState
* Centralized state architecture with predictable updates
* No prop drilling - clean component hierarchy
* Action-based state mutations (similar to Redux patterns)

**Scalable Architecture**
* Custom hooks for reusable logic (useTodos for data fetching)
* User-specific data persistence across page refreshes
* Separation of concerns with clear folder structure
* Component composition over inheritance
* Future-ready for complex features like real-time updates

**User Experience Features**
* Personalized dashboard showing user-specific todos
* Seamless authentication flow with persistent login
* Smart data fetching that prevents unnecessary API calls
* Loading states and error handling for better UX

**Why This Approach?**
While most todo apps use simple `useState`, this project demonstrates:
* How to handle complex state interactions
* Professional-level React patterns used in production apps
* Scalable foundation that can grow into larger applications
* Real-world data fetching and caching strategies

**⚠️ Disclaimer**
This project is currently under active development. Some features may be missing or incomplete.
