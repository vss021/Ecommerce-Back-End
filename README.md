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


**Legend:**  
- PK = Primary Key  
- FK = Foreign Key  
- [ ... ] = Array of embedded documents or references  
- 1——< = One-to-many relationship

---

**Summary of Relationships:**
- A USER can have many ORDERS, ADD_TO_CART, LIKE, LOGIN_HISTORY, and REVIEWS.
- A PRODUCT can have many REVIEWS and be referenced in many ORDER_ITEM, ADD_TO_CART, and LIKE.
- An ORDER contains multiple ORDER_ITEMs, each referencing a PRODUCT.
- ADD_TO_CART and LIKE reference multiple PRODUCTS for a USER.
- LOGIN_HISTORY logs multiple entries per USER.

This structure supports authentication, product management, cart, wishlist, order processing, and login auditing.
---

## 🛣️ User Authentication Routing Documentation

### 1. **User Registration (Sign Up)**

- **Endpoint:**  
  `POST /api/v1/auth/signup`

- **Description:**  
  Registers a new user with email, password, and phone number.

- **Request Body (`req.body`):**
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword123",
    "phone": "1234567890"
  }
```
- **Success Response (`Res.data`):**
    - **Status:** `201 `
    - **Body:**  
```json
{
  "success": true,
  "user": {
    "_id": "userObjectId",
    "email": "user@example.com",
    "phoneNumber": "1234567890",
    "password": "hashedPassword",
    "__v": 0
  }
}

- **Error Responses:**

  - **Missing Fields:**  
    - **Status:** `400 Bad Request`
    - **Body:**  
      ```json
      { "message": "All fields are required " }
      ```

  - **Email Already Exists:**  
    - **Status:** `409 Conflict`
    - **Body:**  
      ```json
      { "message": "Email Already Exist!" }
      ```

  - **Server Error:**  
    - **Status:** `500 Internal Server Error`
    - **Body:**  
      ```json
      { "message": "Server error. Please try again later." }
      ```

### 2. **User Login (Sign In)**

- **Endpoint:**  
  `POST /api/v1/auth/signin`

- **Description:**  
  Authenticates a user using email and password.

- **Request Body (`req.body`):**
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword123"
  }
  ```

  - **Success Response (`Res.data`):**
    - **Status:** `201`
    - **Body:**
      ```json
      {
        "userExist": {
          "_id": "userObjectId",
          "email": "user@example.com",
          "phoneNumber": "1234567890",
          "password": "hashedPassword",
          "__v": 0
        },
        "success": true
      }
      ```

- **Error Responses:**

  - **Missing Fields:**  
    - **Status:** `400 Bad Request`
    - **Body:**  
      ```json
      { "message": "All Field Required" }
      ```

  - **User Not Found:**  
    - **Status:** `404 Not Found`
    - **Body:**  
      ```json
      { "message": "User Not Found" }
      ```

  - **Invalid Password:**  
    - **Status:** `404 Not Found`
    - **Body:**  
      ```json
      { "message": "Invalid Password" }
      ```

  - **Server Error:**  
    - **Status:** `500 Internal Server Error`
    - **Body:**  
      ```json
      { "message": "Server error. Please try again later." }
      ```

    ## ⚡ User Authentication Routing Documentation

    ### 1. **User Registration (Sign Up)**

    - **Endpoint:**  
        `POST /api/v1/auth/signup`

    - **Description:**  
        Registers a new user with email, password, and phone number.

    - **Request Body (`req.body`):**
        ```json
        {
            "email": "user@example.com",
            "password": "yourPassword123",
            "phone": "1234567890"
        }
        ```

    - **Success Response (`Res.data`):**
        - **Status:** `201`
        - **Body:**  
            ```json
            {
                "success": true,
                "user": {
                    "_id": "userObjectId",
                    "email": "user@example.com",
                    "phoneNumber": "1234567890",
                    "password": "hashedPassword",
                    "__v": 0
                }
            }
            ```

    - **Error Responses:**

        - **Missing Fields:**  
            - **Status:** `400 Bad Request`
            - **Body:**  
                ```json
                { "message": "All fields are required " }
                ```

        - **Email Already Exists:**  
            - **Status:** `409 Conflict`
            - **Body:**  
                ```json
                { "message": "Email Already Exist!" }
                ```

        - **Server Error:**  
            - **Status:** `500 Internal Server Error`
            - **Body:**  
                ```json
                { "message": "Server error. Please try again later." }
                ```

    ---

    ### 2. **User Login (Sign In)**

    - **Endpoint:**  
        `POST /api/v1/auth/signin`

    - **Description:**  
        Authenticates a user using email and password.

    - **Request Body (`req.body`):**
        ```json
        {
            "email": "user@example.com",
            "password": "yourPassword123"
        }
        ```

    - **Success Response (`Res.data`):**
        - **Status:** `201`
        - **Body:**
            ```json
            {
                "userExist": {
                    "_id": "userObjectId",
                    "email": "user@example.com",
                    "phoneNumber": "1234567890",
                    "password": "hashedPassword",
                    "__v": 0
                },
                "success": true
            }
            ```

    - **Error Responses:**

        - **Missing Fields:**  
            - **Status:** `400 Bad Request`
            - **Body:**  
                ```json
                { "message": "All Field Required" }
                ```

        - **User Not Found:**  
            - **Status:** `404 Not Found`
            - **Body:**  
                ```json
                { "message": "User Not Found" }
                ```

        - **Invalid Password:**  
            - **Status:** `404 Not Found`
            - **Body:**  
                ```json
                { "message": "Invalid Password" }
                ```

        - **Server Error:**  
            - **Status:** `500 Internal Server Error`
            - **Body:**  
                ```json
                { "message": "Server error. Please try again later." }
                ```

1. **Install dependencies:**
   ```bash
   npm install