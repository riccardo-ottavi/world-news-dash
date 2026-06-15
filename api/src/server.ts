import express from "express";
import cors from "cors";

import newsRoutes from "./routes/newsRoutes";
import sourceRoutes from "./routes/sourceRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// HEALTH
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// NEWS
app.use("/news", newsRoutes);
app.use("/sources", sourceRoutes);

// WORKER (IMPORTANTE)
app.get("/worker/run", async (req, res) => {
  try {
    const { runWorker } = await import("./worker.js");

    console.log("🚀 Worker triggered manually");

    await runWorker();

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

// PORT
const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});