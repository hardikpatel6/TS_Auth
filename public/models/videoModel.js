import { Schema, model } from "mongoose";
const videoSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String },
    tags: { type: [String] },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
}, { timestamps: true });
const Video = model('Video', videoSchema);
export default Video;
