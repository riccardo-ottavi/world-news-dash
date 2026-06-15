"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = __importDefault(require("@prisma/client"));
dotenv_1.default.config();
const { PrismaClient } = client_1.default;
exports.prisma = new PrismaClient();
