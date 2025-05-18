// Importing required modules
import express from "express"; // Express framework to create the server
import { configDotenv } from "dotenv"; // Loads environment variables from a .env file
import { ConnectingToDB } from "./DBConnection/ConnectionString.js"; // Function to establish DB connection

import userRouter from "./routes/userRoutes.js";

const app = express(); // Creating an instance of Express app

// ------------------ MIDDLEWARES ------------------

// Middleware to parse incoming JSON requests into JS objects
app.use(express.json());

// Load environment variables from .env file to process.env
configDotenv(); 

// ------------------ ROUTES ------------------

// Default route to check if the API is up and running
app.use('/api/v1/auth', userRouter);


// ------------------ DATABASE CONNECTION ------------------

// Function call to connect the app with the database
ConnectingToDB();

// Exporting the app instance so it can be used in other files (e.g., server.js)
export default app;
