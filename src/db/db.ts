import mongoose from "mongoose";
import { DB_NAME } from "../../ecosystem.config";

export const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URI;
        const { connection } = await mongoose.connect(`${mongoUrl}/${DB_NAME}`);
        console.log(`Connected to MongoDB: ${connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}
