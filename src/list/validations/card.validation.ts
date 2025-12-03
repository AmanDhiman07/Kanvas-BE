import { body, ValidationChain } from "express-validator";

export const createCardValidation: ValidationChain[] = [
    body("cards")
        .isArray({ min: 1 })
        .withMessage("Cards must be a non-empty array"),
    body("cards.*")
        .trim()
        .notEmpty()
        .withMessage("Each card content is required")
        .isString()
        .withMessage("Each card must be a string")
        .isLength({ min: 1, max: 1000 })
        .withMessage("Each card must be between 1 and 1000 characters"),
];


