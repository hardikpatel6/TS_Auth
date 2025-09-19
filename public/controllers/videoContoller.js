var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
dotenv.config();
import cloudinary from "../config/cloudinary";
import Video from "../models/videoModel";
const uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Request received");
    try {
        const { title, description, category, tags } = req.body;
        if (!req.files || !req.files.video) {
            res.status(400).json({ message: "No file or Video uploaded" });
            return;
        }
        // Upload video to Cloudinary
        const videoFile = Array.isArray(req.files.video)
            ? req.files.video[0].tempFilePath : req.files.video.tempFilePath;
        const videoUpload = yield cloudinary.uploader.upload(videoFile, {
            resource_type: "video",
            folder: "TS_AUTHENTICATION/videos"
        });
        let thumbnailUrl;
        const thumbnailFile = Array.isArray(req.files.thumbnail)
            ? req.files.thumbnail[0].tempFilePath : req.files.thumbnail.tempFilePath;
        if (req.files.thumbnail) {
            const thumbnailUpload = yield cloudinary.uploader.upload(thumbnailFile, {
                folder: "TS_AUTHENTICATION/thumbnails"
            });
            thumbnailUrl = thumbnailUpload.secure_url;
        }
        const newVideo = new Video({
            title,
            description,
            url: videoUpload.secure_url,
            thumbnail: thumbnailUrl || "",
            category,
            tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
            uploadedBy: req.user._id, // Assuming auth middleware adds user to req
        });
        const savedVideo = yield newVideo.save();
        res.status(200).json({ message: "Video Uploaded Successfully", video: newVideo });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
});
export { uploadVideo };
