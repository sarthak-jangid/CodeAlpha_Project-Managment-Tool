import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) throw new Error("MONGO_URI is not defined. Check your .env file.");

        await mongoose.connect(uri);

        console.log("Connected to MongoDB");
    } catch (error : any) {
        console.error("Error connecting to MongoDB:", error.message || error);
        console.debug("MONGO_URI used:", process.env.MONGO_URI);
        process.exit(1);
    }
}

export default connectDB;