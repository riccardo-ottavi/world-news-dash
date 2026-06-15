"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const newsRoutes_1 = __importDefault(require("./routes/newsRoutes"));
const sourceRoutes_1 = __importDefault(require("./routes/sourceRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// HEALTH
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
// NEWS
app.use("/news", newsRoutes_1.default);
app.use("/sources", sourceRoutes_1.default);
// WORKER (IMPORTANTE)
app.get("/worker/run", async (req, res) => {
    try {
        const { runWorker } = await import("./worker");
        console.log("🚀 Worker triggered manually");
        await runWorker();
        res.json({ ok: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ ok: false });
    }
});
// PORT
const PORT = Number(process.env.PORT) || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
