import express from "express";
import cors from "cors";
import { runWorker } from "./worker";

import newsRoutes from "./routes/newsRoutes";
import sourceRoutes from "./routes/sourceRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/news", newsRoutes);
app.use("/sources", sourceRoutes);

app.get("/worker/run", async (req, res) => {
  try {
    console.log("🚀 Manual worker trigger started");

    await runWorker();

    console.log("✅ Worker finished");

    res.json({
      ok: true,
      message: "Worker executed successfully"
    });
  } catch (err) {
    console.error("❌ Worker error:", err);

    res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});