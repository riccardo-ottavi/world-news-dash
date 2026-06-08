import { Router } from "express";
import { getSources } from "../controllers/sourceController";

const router = Router();

router.get("/", getSources);

export default router;