# 🛍️ ShoppyGlobe — Full-Stack E-Commerce Platform

> A modern, feature-rich e-commerce web application built with React, Node.js, Express, and MongoDB. ShoppyGlobe offers an immersive shopping experience with an AI shopping assistant, virtual try-on, visual search, multi-language support, and a powerful admin panel.

---

## ✨ Key Features

### 🛒 Shopping Experience
- **Product Catalog** — 400+ products across Electronics, Clothes, Shoes & Sports
- **Advanced Filtering** — Filter by category, price range, brand, and rating
- **Product Detail Page** — Image gallery, specs, reviews, size selector
- **Quick View Modal** — Preview product without leaving the page
- **Product Comparison** — Compare up to 3 products side-by-side
- **Recently Viewed** — Tracks and displays last seen products
- **Wishlist** — Save favourite products for later

### 🤖 AI & Smart Features
- **AI Shopping Assistant** — Powered by Groq LLM + local NLP fallback
  - Natural language product search (Hindi & English)
  - Budget-based filtering ("under ₹5000")
  - Brand & category search
  - **Order status check** via chat
  - Quick Add to Cart from chat
- **Visual Search** — Upload an image to find similar products
- **Virtual Try-On** — AI-powered clothing/accessory virtual trial

### 💳 Checkout & Payments
- **Cart Management** — Add, update quantity, remove items (synced to DB)
- **Address Management** — Save and manage delivery addresses
- **Coupon System** — Apply discount codes at checkout
- **Razorpay Integration** — Secure online payment gateway
- **Order Placement** — Server-side price verification for security
- **Order History** — View all past orders with full item details

### 👤 User Account
- **Registration & Login** — JWT-based authentication with HTTP-only cookies
- **Profile Management** — Update name, email, phone
- **Dark Mode** — System-preference aware theme toggle
- **Multi-language** — Hindi & English (i18n via react-i18next)

### 🔐 Admin Panel
- **Dashboard** — Live sales stats, revenue, top products
- **Products** — Add, edit, delete products
- **Orders** — View all orders, update order status
- **Users** — View all registered users
- **Categories** — Manage product categories
- **Coupons** — Create and manage discount coupons
- **Banners** — Manage homepage promotional banners
- **Reviews** — Moderate customer reviews
- **Support Tickets** — Handle customer support requests
- **Settings** — Store-wide configuration

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | React | ^18 |
| **Build Tool** | Vite | ^7 |
| **State Management** | Redux Toolkit | Latest |
| **Routing** | React Router DOM | v6 |
| **Styling** | Vanilla CSS (Custom Design System) | — |
| **Internationalization** | react-i18next | Latest |
| **HTTP Client** | Axios | Latest |
| **AI (LLM)** | Groq API | Latest |
| **Backend Framework** | Express.js | ^5 |
| **Runtime** | Node.js | v18+ |
| **Database** | MongoDB Atlas (Cloud) | ^8 |
| **ODM** | Mongoose | ^8 |
| **Authentication** | JWT + bcryptjs + Cookie-Parser | — |
| **Payment Gateway** | Razorpay | ^2 |
| **File Uploads** | Multer | ^2 |
| **Dev Server** | Nodemon | ^3 |
| **In-memory DB (fallback)** | mongodb-memory-server | ^11 |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher → [Download](https://nodejs.org/)
- **npm** v9 or higher (comes with Node.js)
- **MongoDB Atlas** account (free tier works) → [Sign up](https://www.mongodb.com/atlas)
- **Razorpay** account for payments → [Sign up](https://razorpay.com/) *(optional for dev)*
- **Groq API Key** for AI assistant → [Get Key](https://console.groq.com/) *(optional)*

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd shoppyglobe/Ecommerce-Website/my-react-app
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs at: **http://localhost:5173**

### 3. Backend Setup
```bash
# Navigate to NodeJs directory
cd NodeJs

# Install dependencies
npm install

# Start server (development with nodemon)
npm run dev

# OR start server (production)
npm start
```
Backend runs at: **http://localhost:1900**

---

## ⚙️ Environment Variables

Create a `.env` file inside the `NodeJs/` directory:

```env
# Server
PORT=1900

# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/productsdata?retryWrites=true&w=majority

# JWT Secret Key (use a long, random string in production)
JWT_SECRET=your_super_secret_jwt_key_here

# Node Environment
NODE_ENV=development

# Razorpay Payment Gateway (get from razorpay.com dashboard)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### Frontend Environment (Optional)
Create a `.env` file in the root `my-react-app/` directory:

```env
# Backend API URL (defaults to http://localhost:1900/api if not set)
VITE_API_URL=http://localhost:1900/api

# Groq AI API Key (for AI Assistant)
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
```

> **Note:** If `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` are not configured, the app runs in **mock payment mode** automatically (ideal for development/demo).

---

## 📁 Project Structure

```
my-react-app/
├── public/                        # Static assets
├── src/
│   ├── api.js                     # Axios instance with base URL
│   ├── App.jsx                    # Root component, routing setup
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # Global CSS design system (tokens, variables)
│   │
│   ├── components/                # Page-level & feature components
│   │   ├── AiAssistant.jsx        # AI Chat Assistant (Groq + local NLP)
│   │   ├── AiAssistant.css
│   │   ├── Cart.jsx               # Shopping cart page
│   │   ├── Checkout.jsx           # Checkout & Razorpay payment flow
│   │   ├── Home.jsx               # Homepage (banners, categories, products)
│   │   ├── ProductList.jsx        # Product listing with filters & sort
│   │   ├── Productdetail.jsx      # Product detail page
│   │   ├── ProductCard.jsx        # Reusable product card
│   │   ├── ProductCompare.jsx     # Side-by-side product comparison
│   │   ├── QuickViewModal.jsx     # Quick preview popup
│   │   ├── VirtualTryOnModal.jsx  # AI Virtual try-on
│   │   ├── VisualSearchModal.jsx  # Image-based product search
│   │   ├── RecentlyViewed.jsx     # Recently viewed products strip
│   │   ├── Wishlist.jsx           # User wishlist page
│   │   ├── Orders.jsx             # Order history page
│   │   ├── Profile.jsx            # User profile management
│   │   ├── Address.jsx            # Address management
│   │   ├── Login.jsx              # Login page
│   │   ├── Register.jsx           # Registration page
│   │   ├── ProtectedRoute.jsx     # Auth guard for private routes
│   │   ├── GlobalToast.jsx        # Global toast notification system
│   │   ├── SkeletonLoader.jsx     # Loading skeleton placeholders
│   │   └── admin/                 # Admin Panel components
│   │       ├── AdminLayout.jsx    # Admin sidebar layout
│   │       ├── AdminRoute.jsx     # Admin auth guard
│   │       ├── AdminDashboard.jsx # Stats & overview
│   │       ├── AdminProducts.jsx  # Product CRUD
│   │       ├── AdminOrders.jsx    # Order management
│   │       ├── AdminUsers.jsx     # User list
│   │       ├── AdminCategories.jsx
│   │       ├── AdminCoupons.jsx
│   │       ├── AdminBanners.jsx
│   │       ├── AdminReviews.jsx
│   │       ├── AdminSettings.jsx
│   │       └── AdminSupport.jsx   # Support tickets
│   │
│   ├── Features/                  # Layout components
│   │   ├── Header.jsx             # Global navigation header
│   │   ├── Header.css
│   │   ├── Footer.jsx             # Global footer
│   │   └── Footer.css
│   │
│   ├── redux/                     # Redux Toolkit store
│   │   ├── store.js               # Store configuration
│   │   └── cartSlice.js           # Cart state management
│   │
│   ├── services/                  # External API services
│   │   └── groqAiService.js       # Groq LLM API integration
│   │
│   ├── data/                      # Local product data (fallback)
│   │   ├── clothesData.js
│   │   ├── electronicsData.js
│   │   ├── shoesData.js
│   │   ├── sportsData.js
│   │   └── productReviews.js      # Static review data
│   │
│   └── locales/                   # Translations
│       ├── en/translation.json    # English strings
│       └── hi/translation.json    # Hindi strings
│
├── NodeJs/                        # Backend (Node.js + Express)
│   ├── server.js                  # Entry point, DB connection, route registration
│   ├── .env                       # Environment variables
│   ├── Controller/                # Business logic
│   │   ├── auth.controller.js
│   │   ├── cart.controller.js
│   │   ├── order.controller.js
│   │   ├── admin.controller.js
│   │   ├── admin.features.controller.js
│   │   └── public.controller.js
│   ├── Model/                     # Mongoose schemas
│   │   ├── auth.model.js          # User schema
│   │   ├── products.model.js      # Product schema
│   │   ├── cart.model.js          # Cart schema
│   │   ├── order.model.js         # Order schema
│   │   ├── coupon.model.js        # Coupon schema
│   │   └── ticket.model.js        # Support ticket schema
│   ├── Routes/                    # Express routers
│   │   ├── auth.route.js
│   │   ├── cart.route.js
│   │   ├── order.route.js
│   │   ├── payment.route.js
│   │   ├── products.route.js
│   │   ├── admin.route.js
│   │   ├── public.route.js
│   │   └── virtualTryOn.route.js
│   ├── Middleware/
│   │   ├── auth.js                # JWT user auth middleware
│   │   └── adminAuth.js           # JWT admin auth middleware
│   └── uploads/                   # File upload directory (Multer)
│
├── README.md
├── API_DOCS.md
├── ARCHITECTURE.md
├── FEATURES.md
├── package.json                   # Frontend dependencies
└── vite.config.js                 # Vite configuration
```

---

## 🌐 Frontend Routes

| Path | Component | Auth Required |
|------|-----------|:---:|
| `/` | Home | ❌ |
| `/productlist` | ProductList | ❌ |
| `/productdetail/:productId` | Productdetail | ❌ |
| `/login` | Login | ❌ |
| `/register` | Register | ❌ |
| `/cart` | Cart | ✅ |
| `/wishlist` | Wishlist | ✅ |
| `/checkout` | Checkout | ✅ |
| `/orders` | Orders | ✅ |
| `/profile` | Profile | ✅ |
| `/address` | Address | ✅ |
| `/admin/dashboard` | AdminDashboard | ✅ Admin |
| `/admin/products` | AdminProducts | ✅ Admin |
| `/admin/orders` | AdminOrders | ✅ Admin |
| `/admin/users` | AdminUsers | ✅ Admin |
| `/admin/categories` | AdminCategories | ✅ Admin |
| `/admin/coupons` | AdminCoupons | ✅ Admin |
| `/admin/banners` | AdminBanners | ✅ Admin |
| `/admin/reviews` | AdminReviews | ✅ Admin |
| `/admin/support` | AdminSupport | ✅ Admin |
| `/admin/settings` | AdminSettings | ✅ Admin |

---

## 🔑 Default Admin Credentials

```
Email:    admin@shoppyglobe.com
Password: admin123
```

> ⚠️ Change these credentials in production!

---

## 📜 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

Built with ❤️ using React + Node.js + MongoDB
