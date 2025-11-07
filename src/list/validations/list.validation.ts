import { body, ValidationChain } from "express-validator";

export const createTitleValidation: ValidationChain[] = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isString()
        .withMessage("Title must be a string")
        .isLength({ min: 1, max: 500 })
        .withMessage("Title must be between 1 and 500 characters"),
];

