"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const refreshTokenSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
    revokedAt: { type: Date },
    userAgent: { type: String },
    ip: { type: String },
});
const RefreshToken = (0, mongoose_1.model)("RefreshToken", refreshTokenSchema);
exports.default = RefreshToken;
