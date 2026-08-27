import { Router } from "express";
import { categoryController } from "../controllers/category.controller";

const router = Router();

router.get("/", categoryController.findAll);
router.get("/:id", categoryController.findById);

export default router;
