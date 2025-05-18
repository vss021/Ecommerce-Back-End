# MERN E-commerce Project – Back-End

This is the **Back-End** part of a MERN (MongoDB, Express, React, Node.js) E-commerce application.

---

## 📁 Project Structure
```
back-end/
├── controllers/      # Route handler logic (e.g., userControllers.js)
├── DBConnection/     # Database connection setup (e.g., ConnectionString.js)
├── middlewares/      # Custom Express middlewares (e.g., ErrorHandler.js)
├── models/           # Mongoose schemas/models (User, Product, Order, etc.)
├── routes/           # Express route definitions (e.g., userRoutes.js)
├── .env              # Environment variables (not committed to VCS)
├── app.js            # Express app initialization, middleware, routes, DB connect
├── server.js         # Application entry point, starts the server
├── package.json      # Project metadata, dependencies, and scripts
└── README.md         # Project documentation (this file)
```


---

## 🗂️ Models Overview

### 1. **User Model (`userModel.js`)**
Defines user accounts with fields for email, password (hashed), phone number, full name, address, role (user/admin/moderator), status (active/inactive/banned/pending), and fields for password reset and email verification.  
**Purpose:** Handles authentication, authorization, and user management.

### 2. **Product Model (`productsModel.js`)**
Represents products in the store.  
- **Fields:** Name, description, brand, categories, price, discount, final price (auto-calculated), currency, inventory count, images, average rating, rating count, reviews (with reviewer, rating, comment, date), and availability.
- **Features:**  
  - Supports multiple categories and images per product.
  - Automatically calculates the final price based on discount.
  - Stores user reviews and ratings.

### 3. **Order Model (`orderModel.js`)**
Represents customer orders.  
- **Fields:** User reference, list of purchased items (product, quantity, price at purchase), total amount, shipping address, payment status (pending/online/failed/refunded), order status (processing/shipped/delivered/cancelled), payment method, timestamps for order and delivery.
- **Purpose:** Tracks all order details, status, and payment info.

### 4. **Add To Cart Model (`addToCartModel.js`)**
Tracks products added to a user's cart.  
- **Fields:** User reference, array of products (product reference and quantity).
- **Purpose:** Allows users to manage their shopping cart before checkout.

### 5. **Like Model (`likeModel.js`)**
Tracks products liked by a user.  
- **Fields:** User reference, array of liked product references.
- **Purpose:** Enables wishlist or favorite functionality.

### 6. **Login History Model (`loginHistoryModel.js`)**
Logs user login activity.  
- **Fields:** User reference, login timestamp, IP address, user agent, device info.
- **Purpose:** Security and auditing of user logins.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install