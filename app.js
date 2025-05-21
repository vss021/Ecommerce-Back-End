// Importing required modules
import express from "express"; // Express framework to create the server
import dotenv from "dotenv"; // Loads environment variables from a .env file
import cookieParser from "cookie-parser";

import { ConnectingToDB } from "./DBConnection/ConnectionString.js"; // Function to establish DB connection

import userRouter from "./routes/userRoutes.js";
import moderatorRouter from "./routes/moderatorRouter.js";
import cartRouter from "./routes/cartRouter.js";
import orderRouter from "./routes/orderRouter.js";
import moderatorOrderRouter from "./routes/moderatorOrderRouter.js";
import adminRouter from "./routes/adminRoutes.js";
const app = express(); // Creating an instance of Express app

// ------------------ MIDDLEWARES ------------------

// Middleware to parse incoming JSON requests into JS objects
app.use(express.json());
app.use(cookieParser());

// Load environment variables from .env file to process.env
dotenv.config();

// ------------------ ROUTES ------------------

// Default route to check if the API is up and running
app.use('/api/v1/auth', userRouter);

// Cart Routes
app.use('/api/v1/cart', cartRouter);

// Order Routes
app.use('/api/v1/order', orderRouter);

// moderator
app.use("/api/v1/moderator", moderatorRouter);

// Moderator Order Routes
app.use("/api/v1/moderator", moderatorOrderRouter)


// Admin Routes
app.use("/api/v1/admin", adminRouter);


// ------------------ DATABASE CONNECTION ------------------

// Function call to connect the app with the database
ConnectingToDB();




// Exporting the app instance so it can be used in other files (e.g., server.js)
export default app;
