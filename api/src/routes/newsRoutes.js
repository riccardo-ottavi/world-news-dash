"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsController_1 = require("../controllers/newsController");
const router = (0, express_1.Router)();
router.get("/preview", newsController_1.getNewsPreview);
router.get("/", newsController_1.getNews);
router.get("/:id", newsController_1.getNewsById);
exports.default = router;
