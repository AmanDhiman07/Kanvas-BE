import { connectDB } from "./src/db/db";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./src/auth/routes/auth.routes";
import listRoutes from "./src/list/routes/list.routes";

dotenv.config();

// Connect to database (async, but we don't await to allow server to start)
connectDB().catch((error) => {
    console.error("Failed to connect to database:", error);
});

const app = express();

// CORS middleware - allow frontend on port 5173
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Auth routes
app.use("/auth", authRoutes);

// List routes
app.use("/list", listRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});