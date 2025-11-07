import mongoose from "mongoose";
import { DB_NAME } from "../../ecosystem.config";

export const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URI;
        if (!mongoUrl) {
            console.error("MONGODB_URI is not defined in environment variables");
            process.exit(1);
        }
        const { connection } = await mongoose.connect(`${mongoUrl}/${DB_NAME}`, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`Connected to MongoDB: ${connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}
