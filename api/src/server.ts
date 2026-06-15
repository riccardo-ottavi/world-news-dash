import express from "express";
import cors from "cors";

import newsRoutes from "./routes/newsRoutes";
import sourceRoutes from "./routes/sourceRoutes";
import workerRoutes from "./routes/workerRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/news", newsRoutes);
app.use("/sources", sourceRoutes);
app.use("/run-worker", workerRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});