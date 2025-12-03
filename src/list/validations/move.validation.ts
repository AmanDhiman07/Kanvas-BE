import { body } from "express-validator";

export const moveCardValidation = [
    body("cardId")
        .notEmpty()
        .withMessage("Card ID is required")
        .isMongoId()
        .withMessage("Invalid card ID format"),
    body("fromListId")
        .notEmpty()
        .withMessage("Source list ID is required")
        .isMongoId()
        .withMessage("Invalid source list ID format"),
    body("toListId")
        .notEmpty()
        .withMessage("Destination list ID is required")
        .isMongoId()
        .withMessage("Invalid destination list ID format"),
    body("newPosition")
        .optional()
        .isInt({ min: 0 })
        .withMessage("New position must be a non-negative integer"),
];

export const moveListValidation = [
    body("listId")
        .notEmpty()
        .withMessage("List ID is required")
        .isMongoId()
        .withMessage("Invalid list ID format"),
    body("newPosition")
        .notEmpty()
        .withMessage("New position is required")
        .isInt({ min: 0 })
        .withMessage("New position must be a non-negative integer"),
];
