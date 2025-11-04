"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlacklisted = exports.blacklistToken = void 0;
// tokenBlacklist.ts
const blacklistedTokens = new Set();
const blacklistToken = (token) => {
    blacklistedTokens.add(token);
};
exports.blacklistToken = blacklistToken;
const isBlacklisted = (token) => {
    return blacklistedTokens.has(token);
};
exports.isBlacklisted = isBlacklisted;
