# StockFlow Inventory Management System

StockFlow is a full-stack web application built for managing product inventory, suppliers, and administrative workflows. It features a React 19 + Vite frontend and a Node.js + Express REST API backed by a SQLite database managed through Sequelize ORM with JWT authentication and Multer file uploads.

---

## 🌟 Architecture & Features

### Backend (`/server`)
- **Node.js & Express**: Modular RESTful API structure (`routes/`, `controllers/`, `models/`, `middleware/`, `validators/`).
- **Sequelize ORM & SQLite**: Code-first relational database schema (`Users`, `Suppliers`, `Products`) with enforced foreign keys (`Products.supplierId → Suppliers.id`).
- **JWT Authentication & Passwords**: Passwords hashed with `bcryptjs`. Endpoints protected with JWT bearer token middleware (`authenticateToken`, `requireAdmin`).
- **Validation**: Server-side validation via `express-validator` ensuring data integrity regardless of client input.
- **File Uploads**: `Multer` middleware for uploading custom product images saved to `server/storage/uploads/`.
- **Foreign Key Constraints**: Deleting a supplier with linked active products returns HTTP 409 Conflict.

### Frontend (`/frontend`)
- **React 19 + Vite**: Responsive client interface built with modern vanilla CSS and full accessible components.
- **REST Service Layer**: Centralized `apiClient.js` handling JWT authorization headers and error propagation.
- **Low-Stock Alerting**: Red row highlighting (`tr.low`) and badge indicator for items with `< 5` units in stock.
- **Filtering & Search**: Real-time multi-attribute search, supplier dropdown filtering, sorting, and responsive table pagination.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### 1. Server Setup
```bash
cd server
npm install
npm run seed  # Synchronizes database models and seeds initial data
npm start     # Starts Express API server on http://localhost:5000
```

#### Environment Variables (`server/.env`)
```env
PORT=5000
JWT_SECRET=your_secure_secret_here
CLIENT_ORIGIN=http://localhost:5173
DB_STORAGE=./storage/inventory.sqlite
```

---

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Starts Vite dev server on http://localhost:5173
```

#### Environment Variables (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🔑 Default Credentials

| Role | Username / Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@stockflow.com` | `Admin123!` | Full CRUD operations for Products & Suppliers |
| **Standard User** | `user@stockflow.com` | `User123!` | Read-only view for Products & Suppliers |

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `GET` | `/api/auth/me` | Validate JWT session | Bearer Token |
| `GET` | `/api/products` | List all products (with supplier object) | Bearer Token |
| `GET` | `/api/products/:id` | Get single product detail | Bearer Token |
| `POST` | `/api/products` | Create product (multipart `FormData` image) | Admin Token |
| `PUT` | `/api/products/:id` | Update product | Admin Token |
| `DELETE`| `/api/products/:id` | Delete product | Admin Token |
| `GET` | `/api/suppliers` | List all suppliers | Bearer Token |
| `GET` | `/api/suppliers/:id` | Get single supplier detail | Bearer Token |
| `POST` | `/api/suppliers` | Create supplier | Admin Token |
| `PUT` | `/api/suppliers/:id` | Update supplier | Admin Token |
| `DELETE`| `/api/suppliers/:id` | Delete supplier (409 if products linked) | Admin Token |
