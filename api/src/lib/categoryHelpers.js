"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCategories = exports.expandCategoryAliases = exports.canonicalCategory = exports.CATEGORY_ALIASES = void 0;
exports.CATEGORY_ALIASES = {
    mondo: "world",
    tecnologia: "technology",
};
const canonicalCategory = (value) => {
    if (!value)
        return undefined;
    return exports.CATEGORY_ALIASES[value] ?? value;
};
exports.canonicalCategory = canonicalCategory;
const expandCategoryAliases = (value) => {
    if (!value)
        return [];
    const canonical = (0, exports.canonicalCategory)(value);
    const aliases = Object.entries(exports.CATEGORY_ALIASES)
        .filter(([, target]) => target === canonical)
        .map(([alias]) => alias);
    return Array.from(new Set([canonical, value, ...aliases].filter(Boolean)));
};
exports.expandCategoryAliases = expandCategoryAliases;
const normalizeCategories = (categories) => {
    return Array.from(new Set(categories.filter(Boolean).map((c) => (0, exports.canonicalCategory)(c)))).filter(Boolean);
};
exports.normalizeCategories = normalizeCategories;
