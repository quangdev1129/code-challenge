import { Router } from "express";
import { tagController } from "../controllers/tag.controller";

const router = Router();

router.get("/", tagController.findAll);
router.get("/:id", tagController.findById);

export default router;
