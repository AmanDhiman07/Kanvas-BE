import { connectDB } from "./src/db/db";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./src/auth/routes/auth.routes";

dotenv.config();

connectDB();        

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Auth routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});