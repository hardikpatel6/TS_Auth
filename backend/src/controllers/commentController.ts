import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { Types } from "mongoose";
import Comment from "../models/commentModel";
import { AuthenticatedRequest } from "./videoContoller";
import Video from "../models/videoModel";
import mongoose from "mongoose";

export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { videoId } = req.params;
    const { commentText } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const videoExists = await Video.findById(videoId);
    if (!videoExists) return res.status(404).json({ message: "Video not found" });

    const comment = await Comment.create({
      _id: new mongoose.Types.ObjectId(),
      video_id: videoId,
      user_id: userId,
      commentText,
    });

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ EDIT COMMENT ------------------
export const editComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { commentId } = req.params; // comment ID
    const userId = req.user?._id;
    const userRole = req.user?.role;
    const { commentText } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(commentId);
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
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ GET COMMENTS BY VIDEO ------------------
export const getCommentsByVideo = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    const comments = await Comment.find({ video_id: videoId })
      .populate("user_id", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ DELETE COMMENT ------------------
export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;
    const userRole = req.user?.role;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment owner or admin can delete
    if (comment.user_id.toString() !== userId?.toString() && userRole !== "admin") {
      return res.status(403).json({ message: "You are not authorized to delete The Video" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likeComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params; // comment ID
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // console.log("Liked By:",comment.likedBy);
    // Convert ObjectIds to strings for comparison
    const likedBy = comment.likedBy?.map(id => id.toString()) || [];
    const dislikedBy = comment.dislikedBy?.map(id => id.toString()) || [];

    // If already liked, remove like
    if (likedBy.includes(userId.toString())) {
      await Comment.findByIdAndUpdate(id, { $pull: { likedBy: userId } });
      return res.status(200).json({ message: "Like removed" });
    }

    // Remove dislike if present, then add like
    await Comment.findByIdAndUpdate(id, {
      $pull: { dislikedBy: userId },
      $addToSet: { likedBy: userId },
    });

    res.status(200).json({ message: "Comment liked successfully" });
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const dislikeComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const likedBy = comment.likedBy?.map(id => id.toString()) || [];
    const dislikedBy = comment.dislikedBy?.map(id => id.toString()) || [];

    // If already disliked, remove dislike
    if (dislikedBy.includes(userId.toString())) {
      await Comment.findByIdAndUpdate(id, { $pull: { dislikedBy: userId } });
      return res.status(200).json({ message: "Dislike removed" });
    }

    // Remove like if present, then add dislike
    await Comment.findByIdAndUpdate(id, {
      $pull: { likedBy: userId },
      $addToSet: { dislikedBy: userId },
    });

    res.status(200).json({ message: "Comment disliked successfully" });
  } catch (error) {
    console.error("Error disliking comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};



