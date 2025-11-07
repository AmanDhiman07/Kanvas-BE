import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { loginUser } from "../services/auth.service";

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        // Debug: Log request body
        console.log("Request body:", req.body);
        console.log("Request headers:", req.headers);
        
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation errors:", errors.array());
            const errorMessages = errors.array().map((err) => err.msg);
            res.status(400).json({
                status: false,
                message: errorMessages.join(", "),
                statusCode: 400,
                data: {},
            });
            return;
        }

        // Extract email (validation ensures it exists)
        const email = req.body.email;
        const password = req.body.password;
        
        // Use email as username for authentication
        const username = email;

        console.log("Extracted username:", username);
        console.log("Extracted password:", password ? "***" : "missing");

        // Additional check if email or password are missing (validation should have caught this)
        if (!email || !password) {
            res.status(400).json({
                status: false,
                message: "Email and password must not be empty",
                statusCode: 400,
                data: {},
            });
            return;
        }

        // Attempt to login
        const result = await loginUser({ username, password });

        if (!result.success) {
            res.status(401).json({
                status: false,
                message: result.message || "Invalid email or password",
                statusCode: 401,
                data: {},
            });
            return;
        }

        // Success response with token
        res.status(200).json({
            status: true,
            message: result.message,
            statusCode: 200,
            data: {
                user: result.user,
                token: result.token,
            },
        });
    } catch (error) {
        console.error("Login controller error:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            statusCode: 500,
            data: {},
        });
    }
};

