# 🚀 MYCA — Setup & Deployment Guide

This guide provides step-by-step instructions for setting up, running, testing, and deploying the MYCA full-stack application.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:

- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or a **MongoDB Atlas** connection string
- **Git**: Installed and configured

---

## 🛠️ Step-by-Step Local Setup

### 1. Repository Setup & Dependencies

Clone or open the project root directory:

```bash
cd Ecommerce-Website/my-react-app
```

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd NodeJs
npm install
cd ..
```

---

## 🔑 Environment Variables Configuration

Create a `.env` file inside the `NodeJs` directory (`Ecommerce-Website/my-react-app/NodeJs/.env`):

```env
PORT=1900
MONGO_URI=mongodb://127.0.0.1:27017/myca
JWT_SECRET=your_jwt_secret_key_here
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_secret_here
```

> ⚠️ **Note**: Replace `your_jwt_secret_key_here` with a secure random string in production.

---

## ⚙️ Running the Application

### Running Backend Server

Navigate to the backend directory and start the server:

```bash
cd NodeJs
node server.js
```
*Backend will start on `http://localhost:1900`.*

### Running Frontend React Application

In a new terminal window, navigate to the React app root and start Vite dev server:

```bash
npm run dev
```
*Frontend will run on `http://localhost:5173` (or port specified by Vite).*

---

## 🧪 Admin Account & Seed Data

1. **Register a New Account** from the Signup page (`/signup`).
2. **Promote User to Admin**:
   - Access your MongoDB instance via MongoDB Compass or Shell.
   - Update the user document in the `users` collection:
     ```json
     { "role": "admin" }
     ```
3. Log in again with the promoted account to access the **Admin Panel** (`/admin`).

---

## 🌐 Deployment Overview

### Frontend (Vercel)
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`
- Configure `vercel.json` rewrite rules for client-side routing.

### Backend (Render / Railway)
- Root Directory: `./NodeJs`
- Build Command: `npm install`
- Start Command: `node server.js`
- Set Environment Variables (`PORT`, `MONGO_URI`, `JWT_SECRET`).

---

## ❓ Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `ERR_CONNECTION_REFUSED` on API calls | Backend is not running | Ensure `node server.js` is active on port `1900`. |
| `MongoDB Connection Failed` | Incorrect URI or service stopped | Check MongoDB service status or Atlas whitelist IPs. |
| `401 Unauthorized` | Invalid/expired JWT Token | Re-login or check `Authorization` header format. |

---
