import express from "express";
import cors from "cors";

import newsRoutes from "./routes/newsRoutes";
import sourceRoutes from "./routes/sourceRoutes";
import { runWorker } from "./worker";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ HEALTH CHECK (PRIMO SEMPRE)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ROUTES API
app.use("/news", newsRoutes);
app.use("/sources", sourceRoutes);

// WORKER TRIGGER
app.get("/worker/run", async (req, res) => {
  try {
    await runWorker();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

// PORT (IMPORTANTE FIX)
const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});