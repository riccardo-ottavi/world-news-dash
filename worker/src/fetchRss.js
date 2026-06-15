"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRss = fetchRss;
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
async function fetchRss(url) {
    const response = await axios_1.default.get(url);
    const xml = response.data;
    const result = await (0, xml2js_1.parseStringPromise)(xml, {
        trim: true,
        explicitArray: false,
    });
    return result;
}
