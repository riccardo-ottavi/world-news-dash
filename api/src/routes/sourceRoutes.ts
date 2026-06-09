import { Router } from "express";
import {
  getSources,
  getSourceById,
  getCategories,
} from "../controllers/sourceController";

const router = Router();

router.get("/", getSources);
router.get("/categories", getCategories);
router.get("/:id", getSourceById);

export default router;