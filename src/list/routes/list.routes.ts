import { Router } from "express";
import { createTitleController, getAllTitlesController } from "../controllers/list.controller";
import { createTitleValidation } from "../validations/list.validation";
import { createCardController, getCardsByTitleIdController } from "../controllers/card.controller";
import { createCardValidation } from "../validations/card.validation";
import { moveCardController, moveListController } from "../controllers/move.controller";
import { moveCardValidation, moveListValidation } from "../validations/move.validation";

const router = Router();

// Get all titles route
router.get("/titles", getAllTitlesController);

// Create title route
router.post("/title", createTitleValidation, createTitleController);

// Get all cards for a specific title
router.get("/title/:titleId/cards", getCardsByTitleIdController);

// Create card for a specific title
router.post("/title/:titleId/card", createCardValidation, createCardController);

// Move card between lists
router.put("/cards/move", moveCardValidation, moveCardController);

// Move/reorder lists
router.put("/lists/move", moveListValidation, moveListController);

export default router;


