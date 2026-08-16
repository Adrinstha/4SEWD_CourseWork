# StockFlow — Inventory Management System

A full-stack CRUD web application for managing products and suppliers with JWT authentication, role-based access control, and image uploads.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Sequelize ORM, SQLite, Multer, JWT, bcryptjs, express-validator
- **Frontend**: React 19, Vite, React Router v7, Vanilla CSS

---

## ✨ Features

- **CRUD Operations**: Full management of Products and Suppliers with foreign key associations.
- **Authentication**: JWT-based login with hashed passwords (`bcrypt`) and protected routes.
- **Role-Based Access**: `admin` (Full CRUD) and `user` (Read-only).
- **Validation**: Client-side feedback + server-side validation via `express-validator`.
- **Low-Stock Alerts**: Visual red highlighting and warning badges for items with `< 5` units.
- **Search & Filters**: Real-time search and supplier filtering.
- **Image Uploads**: Multipart file uploads from local device via Multer.
- **Responsive UI**: Optimized for mobile, tablet, and desktop viewports.

---

## 🔑 Default Credentials

| Role | Username / Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@stockflow.com` (or `admin`) | `Admin123!` | Full CRUD access |
| **Admin (Personal)** | `adrinshrestha16@gmail.com` (or `adrin`) | `admin123` | Full CRUD access |
| **Standard User** | `user@stockflow.com` (or `user`) | `User123!` | Read-only access |

---

## 🚀 Quick Start

### 1. Server Setup
```bash
cd server
npm install
npm run seed   # Synchronizes SQLite database and seeds default data
npm start      # Runs on http://localhost:5000
```

**Environment Variables (`server/.env`)**:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:5173
DB_STORAGE=./storage/inventory.sqlite
```

---

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev    # Runs on http://localhost:5173
```

**Environment Variables (`frontend/.env`)**:
```env
# Local Development:
VITE_API_URL=http://localhost:5000

# Deployed Render Backend:
# VITE_API_URL=https://foursewd-coursework-ses1.onrender.com
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/auth/me` | User | Get current session user |
| `GET` | `/api/products` | User | List all products with supplier info |
| `GET` | `/api/products/:id` | User | Get product by ID |
| `POST` | `/api/products` | Admin | Create product (multipart file upload) |
| `PUT` | `/api/products/:id` | Admin | Update product |
| `DELETE`| `/api/products/:id` | Admin | Delete product |
| `GET` | `/api/suppliers` | User | List all suppliers |
| `GET` | `/api/suppliers/:id` | User | Get supplier by ID |
| `POST` | `/api/suppliers` | Admin | Create supplier |
| `PUT` | `/api/suppliers/:id` | Admin | Update supplier |
| `DELETE`| `/api/suppliers/:id` | Admin | Delete supplier (blocked if products linked) |
