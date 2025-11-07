import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { loginValidation } from "../validations/auth.validation";

const router = Router();

// Login route
router.post("/login", loginValidation, login);

export default router;

