import { body, ValidationChain } from "express-validator";

export const loginValidation: ValidationChain[] = [
    // Check email (required)
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isString()
        .withMessage("Email must be a string")
        .isLength({ min: 3, max: 50 })
        .withMessage("Email must be between 3 and 50 characters"),
    
    // Check password (required)
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 5 })
        .withMessage("Password must be at least 5 characters"),
];

