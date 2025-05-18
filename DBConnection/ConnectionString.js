import mongoose from "mongoose";

// Function to connect to MongoDB
export const ConnectingToDB = async () => {
  try {
    // Attempt to connect using the MONGO_URL from .env
    const conn = await mongoose.connect(process.env.MOGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log successful connection details
    console.log(`✅ MongoDB connected: ${conn.connection.name}`); // e.g., "Ecommerc"
    
  } catch (error) {
    // Log and exit on error
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Stop the app if DB connection fails
  }
};
