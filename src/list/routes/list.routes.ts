import { Router } from "express";
import { createTitleController } from "../controllers/list.controller";
import { createTitleValidation } from "../validations/list.validation";

const router = Router();

// Create title route
router.post("/title", createTitleValidation, createTitleController);

export default router;

