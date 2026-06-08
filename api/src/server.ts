import express from "express";
import cors from "cors";

import newsRoutes from "./routes/newsRoutes";
import sourceRoutes from "./routes/sourceRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/news", newsRoutes);
app.use("/sources", sourceRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});