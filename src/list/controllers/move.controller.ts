import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { moveCardService, moveListService } from "../services/move.service";

export const moveCardController = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((err) => err.msg);
            res.status(400).json({
                status: false,
                message: errorMessages.join(", "),
                statusCode: 400,
                data: {},
            });
            return;
        }

        const { cardId, fromListId, toListId } = req.body;

        // Prevent moving to the same list
        if (fromListId === toListId) {
            res.status(400).json({
                status: false,
                message: "Source and destination lists cannot be the same",
                statusCode: 400,
                data: {},
            });
            return;
        }

        // Move card to new list
        const result = await moveCardService({ cardId, fromListId, toListId });

        if (!result.success) {
            const statusCode = result.message === "Card not found" ? 404 : 400;
            res.status(statusCode).json({
                status: false,
                message: result.message,
                statusCode,
                data: {},
            });
            return;
        }

        // Success response
        res.status(200).json({
            status: true,
            message: result.message,
            statusCode: 200,
            data: result.data,
        });
    } catch (error) {
        console.error("Move card controller error:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            statusCode: 500,
            data: {},
        });
    }
};

export const moveListController = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((err) => err.msg);
            res.status(400).json({
                status: false,
                message: errorMessages.join(", "),
                statusCode: 400,
                data: {},
            });
            return;
        }

        const { listId, newPosition } = req.body;

        // Move list to new position
        const result = await moveListService({ listId, newPosition });

        if (!result.success) {
            const statusCode = result.message === "List not found" ? 404 : 400;
            res.status(statusCode).json({
                status: false,
                message: result.message,
                statusCode,
                data: {},
            });
            return;
        }

        // Success response
        res.status(200).json({
            status: true,
            message: result.message,
            statusCode: 200,
            data: result.data,
        });
    } catch (error) {
        console.error("Move list controller error:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            statusCode: 500,
            data: {},
        });
    }
};
