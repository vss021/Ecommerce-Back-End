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