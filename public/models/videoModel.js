"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const videoSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String },
    tags: { type: [String] },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
}, { timestamps: true });
const Video = (0, mongoose_1.model)('Video', videoSchema);
exports.default = Video;
