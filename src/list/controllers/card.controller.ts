import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { createCard, getCardsByTitleId } from "../services/card.service";

export const createCardController = async (req: Request, res: Response): Promise<void> => {
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

        const { cards } = req.body;
        const { titleId } = req.params;

        // Save cards to database
        const result = await createCard({ cards, titleId });

        if (!result.success) {
            const statusCode = result.message === "Title not found" ? 404 : 500;
            res.status(statusCode).json({
                status: false,
                message: result.message,
                statusCode,
                data: {},
            });
            return;
        }

        // Success response
        res.status(201).json({
            status: true,
            message: result.message,
            statusCode: 201,
            data: {
                cards: result.data?.cards,
                titleId: result.data?.titleId,
                count: result.data?.cards?.length || 0,
            },
        });
    } catch (error) {
        console.error("Create card controller error:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            statusCode: 500,
            data: {},
        });
    }
};

export const getCardsByTitleIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { titleId } = req.params;

        // Get all cards for this title
        const result = await getCardsByTitleId(titleId);

        if (!result.success) {
            const statusCode = result.message === "Title not found" ? 404 : 500;
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
            data: result.data || [],
        });
    } catch (error) {
        console.error("Get cards by title ID controller error:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            statusCode: 500,
            data: {},
        });
    }
};

