"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sourceController_1 = require("../controllers/sourceController");
const router = (0, express_1.Router)();
router.get("/", sourceController_1.getSources);
router.get("/categories", sourceController_1.getCategories);
router.get("/:id", sourceController_1.getSourceById);
exports.default = router;
