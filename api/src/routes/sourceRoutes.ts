import { Router } from "express";
import {
  getSources,
  getSourceById,
} from "../controllers/sourceController";

const router = Router();

router.get("/", getSources);
router.get("/:id", getSourceById);

export default router;