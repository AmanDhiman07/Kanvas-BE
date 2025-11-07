import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { createTitle, getAllTitles } from "../services/list.service";

export const createTitleController = async (req: Request, res: Response): Promise<void> => {
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

        const { title } = req.body;

        // Save title to database
        const result = await createTitle({ title });

        if (!result.success) {
            res.status(500).json({
                status: false,
                message: result.message,
                statusCode: 500,
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
                title: result.data?.title,
            },
        });
    } catch (error) {
        console.error("Create title controller error:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            statusCode: 500,
            data: {},
        });
    }
};

export const getAllTitlesController = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get all titles from database
        const result = await getAllTitles();

        if (!result.success) {
            res.status(500).json({
                status: false,
                message: result.message,
                statusCode: 500,
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
        console.error("Get all titles controller error:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error",
            statusCode: 500,
            data: {},
        });
    }
};

