# 📡 MYCA — API Documentation

Complete reference for all backend REST API endpoints.

---

## Base URL

```
http://localhost:1900/api
```

All endpoints are prefixed with `/api`. In production, replace `localhost:1900` with your deployed server URL.

---

## Authentication

MYCA uses **JWT (JSON Web Tokens)** stored in **HTTP-only cookies** for authentication.

- After login, the server sets a `token` cookie automatically.
- All protected routes require this cookie to be present.
- The cookie is sent automatically by the browser on every request (credentials: 'include').

**Middleware types:**
| Middleware | Applied to |
|-----------|-----------|
| `authMiddleware` | Regular user routes |
| `adminAuthMiddleware` | Admin-only routes |

---

## Response Format

All API responses follow this format:

```json
{
  "success": true | false,
  "message": "Human readable message",
  "data": { ... }   // or other key names
}
```

---

## 🔐 Auth Routes — `/api/auth`

### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "Nikhil Kumar",
  "email": "nikhil@example.com",
  "password": "yourPassword123",
  "phone": "9876543210"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "64f...",
    "email": "nikhil@example.com",
    "name": "Nikhil Kumar",
    "role": "user"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### POST `/api/auth/login`
Login with email and password. Sets JWT cookie.

**Request Body:**
```json
{
  "email": "nikhil@example.com",
  "password": "yourPassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "64f...",
    "email": "nikhil@example.com",
    "name": "Nikhil Kumar",
    "role": "user"
  }
}
```
> Sets HTTP-only cookie: `token=<jwt_token>`

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### POST `/api/auth/admin-login`
Login as admin. Sets admin JWT cookie.

**Request Body:**
```json
{
  "email": "admin@myca.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admin login successful",
  "user": {
    "id": "64f...",
    "email": "admin@myca.com",
    "name": "Admin",
    "role": "admin"
  }
}
```

---

### POST `/api/auth/logout`
Logout and clear the JWT cookie.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### GET `/api/auth/me` 🔒
Get the currently logged-in user's info.

**Headers:** Cookie with valid `token`

**Success Response (200):**
```json
{
  "user": {
    "id": "64f...",
    "email": "nikhil@example.com",
    "name": "Nikhil Kumar",
    "phone": "9876543210",
    "role": "user"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized: No token provided"
}
```

---

### PUT `/api/auth/profile` 🔒
Update the logged-in user's profile.

**Request Body:**
```json
{
  "name": "Nikhil Kumar Updated",
  "phone": "9999999999"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### GET `/api/auth/admin/me` 🔒 Admin
Get the currently logged-in admin's info.

---

## 📦 Product Routes — `/api/products`

### GET `/api/products`
Get all products from the database.

**Query Parameters (optional):**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category |
| `limit` | number | Max results to return |

**Success Response (200):**
```json
[
  {
    "_id": "elec_001",
    "title": "Samsung Galaxy S24",
    "description": "Latest flagship smartphone...",
    "price": 74999,
    "stock": 50,
    "category": "electronics",
    "company": "Samsung",
    "rating": 4.7,
    "reviewCount": 234,
    "images": ["https://..."]
  },
  ...
]
```

---

### GET `/api/products/:id`
Get a single product by its ID.

**Success Response (200):**
```json
{
  "_id": "elec_001",
  "title": "Samsung Galaxy S24",
  "price": 74999,
  ...
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## 🛒 Cart Routes — `/api/cart` 🔒

All cart routes require user authentication.

### GET `/api/cart`
Get the current user's cart.

**Success Response (200):**
```json
{
  "success": true,
  "cart": {
    "userId": "64f...",
    "items": [
      {
        "productId": "elec_001",
        "title": "Samsung Galaxy S24",
        "price": 74999,
        "quantity": 2,
        "images": ["https://..."]
      }
    ]
  }
}
```

---

### POST `/api/cart/add`
Add an item to the cart (or update quantity if it already exists).

**Request Body:**
```json
{
  "productId": "elec_001",
  "title": "Samsung Galaxy S24",
  "price": 74999,
  "images": ["https://..."],
  "quantity": 1,
  "newTotalQty": 1
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "cart": { ... }
}
```

---

### PATCH `/api/cart/:productId`
Update the quantity of a specific cart item.

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cart updated"
}
```

---

### DELETE `/api/cart/:productId`
Remove a specific item from the cart.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart"
}
```

---

### DELETE `/api/cart/clear`
Clear all items from the cart.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

---

## 📋 Order Routes — `/api/orders` 🔒

### POST `/api/orders`
Place a new order. Server-side price verification is performed.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "elec_001",
      "title": "Samsung Galaxy S24",
      "price": 74999,
      "quantity": 1,
      "image": "https://..."
    }
  ],
  "paymentMethod": "Online (Razorpay)",
  "paymentId": "pay_xxxxxxxxxx",
  "shippingAddress": {
    "name": "Nikhil Kumar",
    "street": "123 Main St",
    "city": "Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "phone": "9876543210"
  },
  "customer": {
    "name": "Nikhil Kumar",
    "email": "nikhil@example.com"
  },
  "couponCode": "SAVE10",
  "discountAmount": 7499,
  "totalAmount": 67500
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order placed successfully! 🎉",
  "order": {
    "orderId": "ORD-1727329845-2341",
    "userEmail": "nikhil@example.com",
    "items": [ ... ],
    "totalAmount": 67500,
    "status": "Confirmed",
    "createdAt": "2026-09-26T06:55:00.000Z"
  }
}
```

> **Note:** After a successful order, the user's cart is automatically cleared.

---

### GET `/api/orders`
Get all orders for the currently logged-in user, sorted by newest first.

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "orders": [
    {
      "orderId": "ORD-1727329845-2341",
      "status": "Confirmed",
      "totalAmount": 67500,
      "items": [
        {
          "productId": "elec_001",
          "title": "Samsung Galaxy S24",
          "price": 74999,
          "quantity": 1,
          "image": "https://..."
        }
      ],
      "createdAt": "2026-09-26T06:55:00.000Z"
    }
  ]
}
```

---

## 💳 Payment Routes — `/api/payment`

### POST `/api/payment/create-order`
Create a Razorpay payment order.

**Request Body:**
```json
{
  "amount": 74999,
  "items": [
    {
      "productId": "elec_001",
      "price": 74999,
      "quantity": 1
    }
  ]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "order": {
    "id": "order_xxxxxxxxxx",
    "amount": 7499900,
    "currency": "INR"
  },
  "key": "rzp_test_xxxxxx"
}
```

> **Dev Mode:** If Razorpay keys are not configured, returns mock order with `"isMock": true`.

---

### POST `/api/payment/verify-payment`
Verify Razorpay payment signature after successful payment.

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxx",
  "razorpay_signature": "xxxxxxxxxxxxxxxx"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid payment signature"
}
```

---

## 🌐 Public Routes — `/api/public`

No authentication required for these routes.

### GET `/api/public/banners`
Get all active homepage banners.

**Response:**
```json
[
  {
    "_id": "64f...",
    "title": "Summer Sale",
    "imageUrl": "https://...",
    "link": "/productlist?category=clothes",
    "isActive": true
  }
]
```

---

### GET `/api/public/categories`
Get all product categories.

---

### GET `/api/public/coupons`
Get all active public coupons.

---

### POST `/api/public/coupons/validate`
Validate a coupon code at checkout.

**Request Body:**
```json
{
  "code": "SAVE10",
  "orderTotal": 5000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "discount": 500,
  "discountType": "percentage",
  "discountValue": 10,
  "message": "Coupon applied! You save ₹500"
}
```

---

### GET `/api/public/reviews/:productId`
Get all reviews for a specific product.

---

### POST `/api/public/reviews`
Submit a product review.

**Request Body:**
```json
{
  "productId": "elec_001",
  "userName": "Nikhil",
  "rating": 5,
  "comment": "Excellent product!"
}
```

---

### POST `/api/public/tickets`
Create a customer support ticket.

**Request Body:**
```json
{
  "name": "Nikhil Kumar",
  "email": "nikhil@example.com",
  "subject": "Order not received",
  "message": "My order #ORD-123 has not arrived yet..."
}
```

---

### GET `/api/public/settings`
Get public store settings (store name, contact info, etc.).

---

## 🔐 Admin Routes — `/api/admin` 🔒 Admin Only

All admin routes require admin JWT authentication.

### GET `/api/admin/stats`
Get dashboard statistics.

**Response:**
```json
{
  "totalOrders": 145,
  "totalRevenue": 1250000,
  "totalUsers": 38,
  "totalProducts": 409,
  "recentOrders": [ ... ],
  "topProducts": [ ... ]
}
```

---

### GET `/api/admin/orders`
Get all orders across all users.

### PUT `/api/admin/orders/:id`
Update an order's status.

**Request Body:**
```json
{
  "status": "Shipped"
}
```

Valid statuses: `"Confirmed"`, `"Processing"`, `"Shipped"`, `"Delivered"`, `"Cancelled"`

---

### GET `/api/admin/users`
Get all registered users.

---

### POST `/api/admin/products`
Add a new product.

### PUT `/api/admin/products/:id`
Update an existing product.

### DELETE `/api/admin/products/:id`
Delete a product.

---

### GET `/api/admin/categories`
### POST `/api/admin/categories`
### PUT `/api/admin/categories/:id`
### DELETE `/api/admin/categories/:id`
Full CRUD for product categories.

---

### GET `/api/admin/coupons`
### POST `/api/admin/coupons`
### PUT `/api/admin/coupons/:id`
### DELETE `/api/admin/coupons/:id`
Full CRUD for discount coupons.

---

### GET `/api/admin/reviews`
### PUT `/api/admin/reviews/:id`
### DELETE `/api/admin/reviews/:id`
Manage and moderate product reviews.

---

### GET `/api/admin/banners`
### POST `/api/admin/banners`
### PUT `/api/admin/banners/:id`
### DELETE `/api/admin/banners/:id`
Full CRUD for homepage banners.

---

### GET `/api/admin/settings`
### PUT `/api/admin/settings`
Get and update store-wide settings.

---

### GET `/api/admin/tickets`
### PUT `/api/admin/tickets/:id`
### DELETE `/api/admin/tickets/:id`
Manage customer support tickets.

---

## ⚠️ Error Codes Reference

| HTTP Code | Meaning |
|-----------|---------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request (invalid input) |
| `401` | Unauthorized (not logged in) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Resource not found |
| `500` | Internal server error |

---

## 🔧 Debug Endpoint

### GET `/api/debug/routes`
Lists all registered Express routes (development only).
