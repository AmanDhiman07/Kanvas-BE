import { Router } from "express";
import { createTitleController, getAllTitlesController } from "../controllers/list.controller";
import { createTitleValidation } from "../validations/list.validation";

const router = Router();

// Get all titles route
router.get("/titles", getAllTitlesController);

// Create title route
router.post("/title", createTitleValidation, createTitleController);

export default router;

