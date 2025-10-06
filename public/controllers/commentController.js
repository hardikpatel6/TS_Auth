"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dislikeComment = exports.likeComment = exports.deleteComment = exports.getCommentsByVideo = exports.editComment = exports.addComment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const commentModel_1 = __importDefault(require("../models/commentModel"));
const videoModel_1 = __importDefault(require("../models/videoModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const addComment = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { videoId } = req.params;
        const { commentText } = req.body;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!mongoose_1.default.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ message: "Invalid video ID" });
        }
        const videoExists = await videoModel_1.default.findById(videoId);
        if (!videoExists)
            return res.status(404).json({ message: "Video not found" });
        const comment = await commentModel_1.default.create({
            _id: new mongoose_1.default.Types.ObjectId(),
            video_id: videoId,
            user_id: userId,
            commentText,
        });
        res.status(201).json({ message: "Comment added successfully", comment });
    }
    catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addComment = addComment;
// ------------------ EDIT COMMENT ------------------
const editComment = async (req, res) => {
    try {
        const { commentId } = req.params; // comment ID
        const userId = req.user?._id;
        const userRole = req.user?.role;
        const { commentText } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const comment = await commentModel_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        // Only the comment owner or admin can edit
        if (comment.user_id.toString() !== userId.toString() && userRole !== "admin") {
            return res.status(403).json({ message: "You are not allowed to edit this comment" });
        }
        // Update comment text
        comment.commentText = commentText;
        await comment.save();
        res.status(200).json({
            message: "Comment updated successfully",
            comment,
        });
    }
    catch (error) {
        console.error("Error editing comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.editComment = editComment;
// ------------------ GET COMMENTS BY VIDEO ------------------
const getCommentsByVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(videoId)) {
            return res.status(400).json({ message: "Invalid video ID" });
        }
        const comments = await commentModel_1.default.find({ video_id: videoId })
            .populate("user_id", "name email role")
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCommentsByVideo = getCommentsByVideo;
// ------------------ DELETE COMMENT ------------------
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user?._id;
        const userRole = req.user?.role;
        const comment = await commentModel_1.default.findById(commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        // Only comment owner or admin can delete
        if (comment.user_id.toString() !== userId?.toString() && userRole !== "admin") {
            return res.status(403).json({ message: "You are not authorized to delete The Video" });
        }
        await commentModel_1.default.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteComment = deleteComment;
const likeComment = async (req, res) => {
    try {
        const { id } = req.params; // comment ID
        const userId = req.user?._id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const comment = await commentModel_1.default.findById(id);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        console.log("Liked By:", comment.likedBy);
        // Convert ObjectIds to strings for comparison
        const likedBy = comment.likedBy?.map(id => id.toString()) || [];
        const dislikedBy = comment.dislikedBy?.map(id => id.toString()) || [];
        // If already liked, remove like
        if (likedBy.includes(userId.toString())) {
            await commentModel_1.default.findByIdAndUpdate(id, { $pull: { likedBy: userId } });
            return res.status(200).json({ message: "Like removed" });
        }
        // Remove dislike if present, then add like
        await commentModel_1.default.findByIdAndUpdate(id, {
            $pull: { dislikedBy: userId },
            $addToSet: { likedBy: userId },
        });
        res.status(200).json({ message: "Comment liked successfully" });
    }
    catch (error) {
        console.error("Error liking comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.likeComment = likeComment;
const dislikeComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const comment = await commentModel_1.default.findById(id);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        const likedBy = comment.likedBy?.map(id => id.toString()) || [];
        const dislikedBy = comment.dislikedBy?.map(id => id.toString()) || [];
        // If already disliked, remove dislike
        if (dislikedBy.includes(userId.toString())) {
            await commentModel_1.default.findByIdAndUpdate(id, { $pull: { dislikedBy: userId } });
            return res.status(200).json({ message: "Dislike removed" });
        }
        // Remove like if present, then add dislike
        await commentModel_1.default.findByIdAndUpdate(id, {
            $pull: { likedBy: userId },
            $addToSet: { dislikedBy: userId },
        });
        res.status(200).json({ message: "Comment disliked successfully" });
    }
    catch (error) {
        console.error("Error disliking comment:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.dislikeComment = dislikeComment;
