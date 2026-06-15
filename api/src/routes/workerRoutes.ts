import express from "express";
import { runWorker } from "../worker";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await runWorker();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

export default router;
