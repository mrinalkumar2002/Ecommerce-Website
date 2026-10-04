# 🏗️ ShoppyGlobe — Architecture & Database Documentation

Deep-dive into the technical architecture, system design, database schemas, and data flows.

---

## 🗺️ System Overview

```
┌─────────────────────────────────────────────────────┐
│                  BROWSER / CLIENT                   │
│   React + Redux + Axios + react-i18next + Vite      │
│              http://localhost:5173                  │
└──────────────────────┬──────────────────────────────┘
                       │  HTTP Requests (Axios, credentials: include)
                       │  Cookie (JWT Token auto-sent)
┌──────────────────────▼──────────────────────────────┐
│              BACKEND (Node.js + Express)             │
│               http://localhost:1900                 │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐│
│  │  Routes  │→ │Middleware│→ │    Controllers      ││
│  │ (Router) │  │(Auth/JWT)│  │ (Business Logic)   ││
│  └──────────┘  └──────────┘  └─────────┬──────────┘│
└───────────────────────────────────────┬─────────────┘
                                        │  Mongoose ODM
┌───────────────────────────────────────▼─────────────┐
│              MongoDB Atlas (Cloud)                  │
│              Database: productsdata                 │
│                                                     │
│  Collections: products, authusers, carts, orders,  │
│               coupons, reviews, banners, categories,│
│               settings, tickets                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Architecture

### State Management — Redux Toolkit

```
Redux Store
└── cartSlice
    ├── items[]           → Cart items array
    ├── addToCart()       → Add item or increment qty
    ├── removeFromCart()  → Remove item from cart
    ├── updateQuantity()  → Set specific quantity
    ├── clearCart()       → Empty entire cart
    └── setCart()         → Sync from backend
```

### Data Flow — Add to Cart
```
User clicks "Add to Cart"
    ↓
Component dispatches addToCart(product)
    ↓
Redux cartSlice updates local state (instant UI update)
    ↓
api.post("/cart/add", { productId, qty }) ← background sync
    ↓
Backend saves to MongoDB Cart collection
```

### Data Flow — AI Assistant
```
User types query in AI chat
    ↓
isOrderQuery() check → YES → fetch /api/orders → show order cards
    ↓ NO
askGroqAiAssistant() → Groq LLM API call
    ↓ (if fails)
processLocalAiQuery() → local NLP scoring engine
    ↓
Render product cards or order status cards in chat
```

### Component Hierarchy
```
App.jsx
├── Header (navigation, search, cart icon, theme toggle, language)
├── Routes
│   ├── Home
│   │   ├── BannerCarousel
│   │   ├── CategoryGrid
│   │   ├── FeaturedProducts → ProductCard[]
│   │   └── RecentlyViewed
│   ├── ProductList
│   │   ├── FilterSidebar
│   │   ├── SortOptions
│   │   ├── ProductCard[] (with QuickView)
│   │   └── SkeletonLoader
│   ├── Productdetail
│   │   ├── ImageGallery
│   │   ├── ProductInfo
│   │   ├── ReviewSection
│   │   ├── VirtualTryOnModal
│   │   └── RelatedProducts
│   ├── Cart → CartItem[]
│   ├── Checkout → AddressForm → RazorpayPayment
│   ├── Orders → OrderCard[]
│   ├── Profile
│   ├── Wishlist → ProductCard[]
│   └── Admin/*
│       ├── AdminLayout (Sidebar)
│       └── Admin[Feature] pages
├── Footer
├── ProductCompare (global floating panel)
├── AiAssistant (global floating chat)
└── GlobalToast (global notification)
```

---

## 🗄️ Database Schemas

### 👤 User Schema — `authusers` collection

```javascript
{
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },     // bcrypt hashed
  name:     { type: String, default: "" },
  phone:    { type: String, default: "" },
  role:     { type: String, enum: ["user", "admin"], default: "user" }
}
```

**Indexes:** `email` (unique)

---

### 📦 Product Schema — `products` collection

```javascript
{
  _id:         { type: String, required: true },    // custom string ID
  title:       { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  stock:       { type: Number, default: 50 },
  category:    { type: String, default: "general" },
  company:     { type: String, default: "Generic" },
  rating:      { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 120 },
  images:      { type: [String], default: [] }
}
```

**Categories:** `electronics`, `clothes`, `shoes`, `sports`

---

### 🛒 Cart Schema — `carts` collection

```javascript
{
  userId: { type: ObjectId, ref: "authuser", required: true, unique: true },
  items: [
    {
      productId: { type: String, required: true },
      title:     { type: String },
      price:     { type: Number },
      quantity:  { type: Number, default: 1 },
      images:    { type: [String] }
    }
  ]
}
```

**Note:** One cart per user (`userId` is unique).

---

### 📋 Order Schema — `orders` collection

```javascript
{
  orderId:      { type: String, required: true, unique: true },
                // Format: "ORD-{timestamp}-{random4}"
  userEmail:    { type: String, required: true, index: true },
  items: [
    {
      productId: { type: String, required: true },
      title:     { type: String, required: true },
      price:     { type: Number, required: true },  // server-verified price
      quantity:  { type: Number, required: true },
      image:     { type: String, default: "" }
    }
  ],
  totalAmount:     { type: Number, required: true },
  paymentMethod:   { type: String, default: "Online (Razorpay)" },
  paymentId:       { type: String, default: "" },
  status:          { type: String, default: "Confirmed" },
  shippingAddress: { type: Object, default: {} },
  customer:        { type: Object, default: {} },
  couponCode:      { type: String, default: null },
  discountAmount:  { type: Number, default: 0 },
  createdAt:       { type: Date },   // auto via timestamps
  updatedAt:       { type: Date }    // auto via timestamps
}
```

**Possible status values:** `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`

---

### 🎟️ Coupon Schema — `coupons` collection

```javascript
{
  code:          { type: String, required: true, unique: true },
  discountType:  { type: String, enum: ["percentage", "fixed"], default: "percentage" },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  expiryDate:    { type: Date, required: true },
  isActive:      { type: Boolean, default: true },
  createdAt:     Date,
  updatedAt:     Date
}
```

**Built-in coupons (hardcoded):**
| Code | Discount | Min Order |
|------|---------|-----------|
| `SAVE10` | 10% off | None |
| `SHOPPY20` | 20% off | ₹1,000 |

---

### ⭐ Review Schema — `reviews` collection

```javascript
{
  productId: { type: String, required: true },
  userName:  { type: String, required: true },
  rating:    { type: Number, min: 1, max: 5 },
  comment:   { type: String },
  createdAt: Date,
  updatedAt: Date
}
```

---

### 🎫 Support Ticket Schema — `tickets` collection

```javascript
{
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  subject:   { type: String, required: true },
  message:   { type: String, required: true },
  status:    { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
  createdAt: Date,
  updatedAt: Date
}
```

---

### 🖼️ Banner Schema — `banners` collection

```javascript
{
  title:    { type: String },
  imageUrl: { type: String, required: true },
  link:     { type: String, default: "/" },
  isActive: { type: Boolean, default: true },
  order:    { type: Number, default: 0 }
}
```

---

### ⚙️ Settings Schema — `settings` collection

```javascript
{
  key:   { type: String, required: true, unique: true },
  value: { type: mongoose.Mixed }
}
```

---

## 🔐 Authentication Flow

```
User submits login form
        ↓
POST /api/auth/login
        ↓
Server finds user by email in DB
        ↓
bcrypt.compare(plainPassword, hashedPassword)
        ↓
jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: "7d" })
        ↓
res.cookie("token", jwtToken, { httpOnly: true, sameSite: "lax" })
        ↓
Client receives cookie (stored automatically by browser)
        ↓
All subsequent requests send cookie automatically
        ↓
authMiddleware verifies jwt on each protected route
        ↓
req.user = decoded user object
```

---

## 💳 Payment Flow

```
User clicks "Pay Now" in Checkout
        ↓
POST /api/payment/create-order { amount, items }
        ↓
Server verifies prices from DB (security)
        ↓
Razorpay API: orders.create({ amount_in_paise, currency: "INR" })
        ↓
Returns { order.id, key }
        ↓
Frontend opens Razorpay checkout modal
        ↓
User completes payment on Razorpay
        ↓
Razorpay calls handler with { order_id, payment_id, signature }
        ↓
POST /api/payment/verify-payment
        ↓
Server verifies HMAC-SHA256 signature
        ↓
If valid → POST /api/orders (create order in DB)
        ↓
Cart cleared automatically
        ↓
User redirected to order confirmation
```

---

## 🌐 Internationalization (i18n)

```
src/locales/
├── en/translation.json    ← English (default)
└── hi/translation.json    ← Hindi

Key namespaces:
- aiAssistant.*     → AI chat messages
- header.*          → Navigation labels
- productList.*     → Filter/sort labels
- checkout.*        → Checkout form labels
- orders.*          → Order page labels
```

Language detection: `navigator.language` → fallback to `en`.
Stored in `localStorage` when user manually switches.

---

## 🔄 Database Resilience Strategy

ShoppyGlobe has a **3-tier database fallback** for maximum reliability:

```
Tier 1: MongoDB Atlas (Cloud) ← PRIMARY
         ↓ (if connection fails)
Tier 2: mongodb-memory-server (in-process embedded) ← FALLBACK
         ↓ (for product data)
Tier 3: Local JS data files (clothesData.js, electronicsData.js...) ← LAST RESORT
```

Orders also use a **dual write strategy**:
- Write to MongoDB Atlas
- Write to `memoryOrders` Map (in-process cache)
- Read from whichever has data
