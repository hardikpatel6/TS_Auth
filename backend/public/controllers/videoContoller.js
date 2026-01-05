"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribeVideo = exports.subscribeVideo = exports.deleteVideo = exports.dislikeVideo = exports.likeVideo = exports.editVideo = exports.getVideoById = exports.searchVideos = exports.showAllVideos = exports.uploadVideoFile = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const videoModel_1 = __importDefault(require("../models/videoModel"));
const uploadVideoFile = async (req, res) => {
    // Typecast req to custom type that includes user + files
    const videoReq = req;
    try {
        const { title, description, category, tags } = videoReq.body;
        if (!videoReq.files || !videoReq.files.video) {
            return res.status(400).json({ message: "No video uploaded" });
        }
        // 📌 Upload video
        const videoFile = Array.isArray(videoReq.files.video)
            ? videoReq.files.video[0].tempFilePath
            : videoReq.files.video.tempFilePath;
        const videoUpload = await cloudinary_1.default.uploader.upload(videoFile, {
            resource_type: "video",
            folder: "TS_AUTHENTICATION/videos",
        });
        // 📌 Upload thumbnail (optional)
        let thumbnailUpload;
        if (videoReq.files.thumbnail) {
            const thumbnailFile = Array.isArray(videoReq.files.thumbnail)
                ? videoReq.files.thumbnail[0].tempFilePath
                : videoReq.files.thumbnail.tempFilePath;
            thumbnailUpload = await cloudinary_1.default.uploader.upload(thumbnailFile, {
                folder: "TS_AUTHENTICATION/thumbnails",
            });
            // console.log("Thumbnail Upload Result:", thumbnailUpload);
        }
        // 📌 Save video info in DB
        const newVideo = new videoModel_1.default({
            title,
            description,
            videoPublicId: videoUpload.public_id, // ✅ video public_id
            thumbnailPublicId: thumbnailUpload?.public_id || "", // ✅ thumbnail public_id
            url: videoUpload.secure_url,
            thumbnail: thumbnailUpload?.secure_url || "",
            category,
            tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
            uploadedBy: videoReq.user?._id,
        });
        const savedVideo = await newVideo.save();
        // 📌 Return response with IDs
        return res.status(201).json({
            message: "Video uploaded successfully",
            video: {
                _id: savedVideo._id,
                url: savedVideo.url,
                videoPublicId: savedVideo.videoPublicId,
                thumbnail: savedVideo.thumbnail,
                thumbnailPublicId: savedVideo.thumbnailPublicId,
                title: savedVideo.title,
                description: savedVideo.description,
                category: savedVideo.category,
                tags: savedVideo.tags,
                uploadedBy: savedVideo.uploadedBy,
            },
        });
    }
    catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.uploadVideoFile = uploadVideoFile;
const showAllVideos = async (req, res) => {
    try {
        const videos = await videoModel_1.default.find().populate("uploadedBy", "username email").sort({ createdAt: -1 });
        return res.status(200).json(videos);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.showAllVideos = showAllVideos;
const searchVideos = async (req, res) => {
    try {
        const { title, description, category, tags, uploadedBy } = req.query;
        // Build a dynamic filter object
        const filter = {};
        if (title) {
            filter.title = { $regex: title, $options: "i" }; // case-insensitive regex
        }
        if (description) {
            filter.description = { $regex: description, $options: "i" };
        }
        if (category) {
            filter.category = { $regex: category, $options: "i" };
        }
        if (tags) {
            // Match any tag in the array
            const tagArray = Array.isArray(tags)
                ? tags
                : tags.split(",").map((t) => t.trim());
            // Match any tag with case-insensitive regex
            filter.tags = { $in: tagArray.map((tag) => new RegExp(String(tag), "i")) };
        }
        if (uploadedBy) {
            filter.uploadedBy = uploadedBy; // exact ObjectId match
        }
        const videos = await videoModel_1.default.find(filter)
            .populate("uploadedBy", "username email")
            .sort({ createdAt: -1 });
        if (!videos.length) {
            return res.status(404).json({ message: "No videos found" });
        }
        return res.status(200).json(videos);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.searchVideos = searchVideos;
const getVideoById = async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await videoModel_1.default.findById(videoId).populate("uploadedBy", "username email");
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        return res.status(200).json(video);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.getVideoById = getVideoById;
const editVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        // console.log(videoId);
        // console.log(req.body);
        const { title, description, tags, category } = req.body;
        const updatedVideo = await videoModel_1.default.findByIdAndUpdate(videoId, {
            ...(title && { title }),
            ...(description && { description }),
            ...(tags && { tags: Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()) }),
            ...(category && { category })
        }, { new: true } // return updated document
        ).populate("uploadedBy", "username email");
        // console.log(updatedVideo);
        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }
        return res.status(200).json({ message: "Video updated successfully", video: updatedVideo });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.editVideo = editVideo;
const likeVideo = async (req, res) => {
    try {
        const { id } = req.params; // video ID
        const userId = req.user?._id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const video = await videoModel_1.default.findById(id);
        if (!video)
            return res.status(404).json({ message: "Video not found" });
        // Convert ObjectIds to string for comparison
        const likedBy = (video.likedBy ?? []).map((u) => u.toString());
        const dislikedBy = (video.dislikedBy ?? []).map((u) => u.toString());
        // If user already liked, remove like (toggle off)
        if (likedBy.includes(userId.toString())) {
            await videoModel_1.default.findByIdAndUpdate(id, { $pull: { likedBy: userId } });
            return res.status(200).json({ message: "Like removed" });
        }
        // Otherwise: add like and remove dislike if present
        await videoModel_1.default.findByIdAndUpdate(id, {
            $pull: { dislikedBy: userId },
            $addToSet: { likedBy: userId },
        });
        res.status(200).json({ message: "Video liked successfully" });
    }
    catch (error) {
        console.error("Error liking video:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.likeVideo = likeVideo;
const dislikeVideo = async (req, res) => {
    try {
        const { id } = req.params; // video ID
        const userId = req.user?._id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const video = await videoModel_1.default.findById(id);
        if (!video)
            return res.status(404).json({ message: "Video not found" });
        const likedBy = (video.likedBy ?? []).map((u) => u.toString());
        const dislikedBy = (video.dislikedBy ?? []).map((u) => u.toString());
        // If user already disliked, remove dislike (toggle off)
        if (dislikedBy.includes(userId.toString())) {
            await videoModel_1.default.findByIdAndUpdate(id, { $pull: { dislikedBy: userId } });
            return res.status(200).json({ message: "Dislike removed" });
        }
        // Otherwise: add dislike and remove like if present
        await videoModel_1.default.findByIdAndUpdate(id, {
            $pull: { likedBy: userId },
            $addToSet: { dislikedBy: userId },
        });
        res.status(200).json({ message: "Video disliked successfully" });
    }
    catch (error) {
        console.error("Error disliking video:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.dislikeVideo = dislikeVideo;
const deleteVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await videoModel_1.default.findById(videoId);
        const userId = req.user?._id;
        const userRole = req.user?.role;
        // console.log("Video to be deleted:", video);
        // console.log("User Role:", userRole);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        // console.log("Authenticated User ID:", userId?.toString());
        // console.log("Video Uploaded By ID:", video.uploadedBy.toString());
        if (video.uploadedBy.toString() !== userId?.toString() && userRole !== "admin") {
            return res.status(403).json({ message: "You are not authorized to delete this video" });
        }
        // ✅ Delete video from Cloudinary
        if (video.videoPublicId) {
            await cloudinary_1.default.uploader.destroy(video.videoPublicId, { resource_type: "video" });
        }
        // ✅ Delete thumbnail from Cloudinary
        if (video.thumbnailPublicId) {
            await cloudinary_1.default.uploader.destroy(video.thumbnailPublicId);
        }
        // ✅ Delete document from DB
        await videoModel_1.default.findByIdAndDelete(videoId);
        return res.status(200).json({ message: "Video deleted successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteVideo = deleteVideo;
const subscribeVideo = async (req, res) => {
    try {
        const { id } = req.params; // video ID
        const userId = req.user?._id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const video = await videoModel_1.default.findById(id);
        if (!video)
            return res.status(404).json({ message: "Video not found" });
        // ✅ now that 'video' exists, we can access its fields
        const subscribedBy = (video.subscribedBy ?? []).map((u) => u.toString());
        const unsubscribedBy = (video.unsubscribedBy ?? []).map((u) => u.toString());
        // If already subscribed → unsubscribe
        if (subscribedBy.includes(userId.toString())) {
            await videoModel_1.default.findByIdAndUpdate(id, { $pull: { subscribedBy: userId } });
            return res.status(200).json({ message: "Subscription removed" });
        }
        // Otherwise: remove from unsubscribed, then subscribe
        await videoModel_1.default.findByIdAndUpdate(id, {
            $pull: { unsubscribedBy: userId },
            $addToSet: { subscribedBy: userId },
        });
        res.status(200).json({ message: "Subscribed successfully" });
    }
    catch (error) {
        console.error("Error subscribing to video:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.subscribeVideo = subscribeVideo;
const unsubscribeVideo = async (req, res) => {
    try {
        const { id } = req.params; // video ID
        const userId = req.user?._id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const video = await videoModel_1.default.findById(id);
        if (!video)
            return res.status(404).json({ message: "Video not found" });
        const subscribedBy = (video.subscribedBy ?? []).map((u) => u.toString());
        const unsubscribedBy = (video.unsubscribedBy ?? []).map((u) => u.toString());
        // If already unsubscribed → remove from list
        if (unsubscribedBy.includes(userId.toString())) {
            await videoModel_1.default.findByIdAndUpdate(id, { $pull: { unsubscribedBy: userId } });
            return res.status(200).json({ message: "Unsubscription removed" });
        }
        // Otherwise: remove from subscribed, then unsubscribe
        await videoModel_1.default.findByIdAndUpdate(id, {
            $pull: { subscribedBy: userId },
            $addToSet: { unsubscribedBy: userId },
        });
        res.status(200).json({ message: "Unsubscribed successfully" });
    }
    catch (error) {
        console.error("Error unsubscribing from video:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.unsubscribeVideo = unsubscribeVideo;
