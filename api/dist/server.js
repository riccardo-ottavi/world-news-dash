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
app.use("/news", newsRoutes_1.default);
app.use("/sources", sourceRoutes_1.default);
app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
