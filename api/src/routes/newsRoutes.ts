import { Router } from "express";
import {
  getNews,
  getNewsPreview,
  getNewsById,
} from "../controllers/newsController";

const router = Router();

router.get("/preview", getNewsPreview);
router.get("/", getNews);
router.get("/:id", getNewsById);

export default router;