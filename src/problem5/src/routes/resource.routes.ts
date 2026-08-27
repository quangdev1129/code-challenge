import { Router } from "express";
import { resourceController } from "../controllers/resource.controller";

const router = Router();

router.post("/", resourceController.create);
router.get("/", resourceController.findAll);
router.get("/:id", resourceController.findById);
router.put("/:id", resourceController.update);
router.delete("/:id", resourceController.delete);

export default router;
