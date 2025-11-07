import { User, IUser } from "../../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwt";
import { findDemoUser } from "../lib/demo-credentials";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResult {
    success: boolean;
    message: string;
    user?: {
        id: string;
        username: string;
    };
    token?: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
        const { username, password } = credentials;

        // First check demo credentials file
        const demoUser = findDemoUser(username);
        if (demoUser) {
            // Check password for demo user (plain text comparison)
            if (demoUser.password === password) {
                // Generate JWT token for demo user
                const token = generateToken({
                    userId: "demo-user-id",
                    username: demoUser.username,
                });

                return {
                    success: true,
                    message: "Login successful",
                    user: {
                        id: "demo-user-id",
                        username: demoUser.username,
                    },
                    token,
                };
            } else {
                return {
                    success: false,
                    message: "Invalid username or password",
                };
            }
        }

        // If not found in demo credentials, check database
        const user: IUser | null = await User.findOne({ 
            username: username.toLowerCase().trim() 
        });

        if (!user) {
            return {
                success: false,
                message: "Invalid username or password",
            };
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid username or password",
            };
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            username: user.username,
        });

        // Return success with user data and token (excluding password)
        return {
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
            },
            token,
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            message: "An error occurred during login",
        };
    }
};

