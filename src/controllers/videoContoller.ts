import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { Types } from "mongoose";
import { UploadedFile } from "express-fileupload";
import cloudinary from "../config/cloudinary";
import Video from "../models/videoModel";
import { UploadApiResponse } from "cloudinary";

interface AuthenticatedUser {
    _id: string;
    role: "user" | "admin";
}

interface VideoUploadRequest extends Request {
    files: {
        video: UploadedFile | UploadedFile[];
        thumbnail?: UploadedFile | UploadedFile[];
    };
    body: {
        title: string;
        description: string;
        category: string;
        tags?: string | string[];
    };
    user?: AuthenticatedUser; // added by auth middleware
}

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

export const uploadVideoFile = async (req: Request, res: Response): Promise<Response> => {
    // Typecast req to custom type that includes user + files
    const videoReq = req as VideoUploadRequest;

    try {
        const { title, description, category, tags } = videoReq.body;

        if (!videoReq.files || !videoReq.files.video) {
            return res.status(400).json({ message: "No video uploaded" });
        }

        // 📌 Upload video
        const videoFile = Array.isArray(videoReq.files.video)
            ? videoReq.files.video[0].tempFilePath
            : videoReq.files.video.tempFilePath;

        const videoUpload: UploadApiResponse = await cloudinary.uploader.upload(videoFile, {
            resource_type: "video",
            folder: "TS_AUTHENTICATION/videos",
        });

        // 📌 Upload thumbnail (optional)
        let thumbnailUpload: UploadApiResponse | undefined;
        if (videoReq.files.thumbnail) {
            const thumbnailFile = Array.isArray(videoReq.files.thumbnail)
                ? videoReq.files.thumbnail[0].tempFilePath
                : videoReq.files.thumbnail.tempFilePath;

            thumbnailUpload = await cloudinary.uploader.upload(thumbnailFile, {
                folder: "TS_AUTHENTICATION/thumbnails",
            });

            console.log("Thumbnail Upload Result:", thumbnailUpload);
        }

        // 📌 Save video info in DB
        const newVideo = new Video({
            title,
            description,
            videoPublicId: videoUpload.public_id,                        // ✅ video public_id
            thumbnailPublicId: thumbnailUpload?.public_id || "",         // ✅ thumbnail public_id
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
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const showAllVideos = async (req: Request, res: Response) => {
    try {
        const videos = await Video.find().populate("uploadedBy", "username email").sort({ createdAt: -1 });
        return res.status(200).json(videos);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const searchVideos = async (req: Request, res: Response) => {
    try {
        const { title, description, category, tags, uploadedBy } = req.query;

        // Build a dynamic filter object
        const filter: any = {};

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
                : (tags as string).split(",").map((t) => t.trim());

            // Match any tag with case-insensitive regex
            filter.tags = { $in: tagArray.map((tag) => new RegExp(String(tag), "i")) };
        }
        if (uploadedBy) {
            filter.uploadedBy = uploadedBy; // exact ObjectId match
        }

        const videos = await Video.find(filter)
            .populate("uploadedBy", "username email")
            .sort({ createdAt: -1 });

        if (!videos.length) {
            return res.status(404).json({ message: "No videos found" });
        }

        return res.status(200).json(videos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const getVideoById = async (req: Request, res: Response) => {
    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId).populate("uploadedBy", "username email");
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        return res.status(200).json(video);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const editVideo = async (req: Request, res: Response) => {
    try {
        const videoId = req.params.id;
        console.log(videoId);
        console.log(req.body);
        const { title, description, tags, category } = req.body;
        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            {
                ...(title && { title }),
                ...(description && { description }),
                ...(tags && { tags: Array.isArray(tags) ? tags : tags.split(",").map((t: string) => t.trim()) }),
                ...(category && { category })
            },
            { new: true } // return updated document
        ).populate("uploadedBy", "username email");
        console.log(updatedVideo);
        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }
        return res.status(200).json({ message: "Video updated successfully", video: updatedVideo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const likeVideo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params; // video ID
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Convert ObjectIds to string for comparison
    const likedBy = (video.likedBy ?? []).map((u: any) => u.toString());
    const dislikedBy = (video.dislikedBy ?? []).map((u: any) => u.toString());

    // If user already liked, remove like (toggle off)
    if (likedBy.includes(userId.toString())) {
      await Video.findByIdAndUpdate(id, { $pull: { likedBy: userId } });
      return res.status(200).json({ message: "Like removed" });
    }

    // Otherwise: add like and remove dislike if present
    await Video.findByIdAndUpdate(id, {
      $pull: { dislikedBy: userId },
      $addToSet: { likedBy: userId },
    });

    res.status(200).json({ message: "Video liked successfully" });
  } catch (error) {
    console.error("Error liking video:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const dislikeVideo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params; // video ID
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const likedBy = (video.likedBy ?? []).map((u: any) => u.toString());
    const dislikedBy = (video.dislikedBy ?? []).map((u: any) => u.toString());

    // If user already disliked, remove dislike (toggle off)
    if (dislikedBy.includes(userId.toString())) {
      await Video.findByIdAndUpdate(id, { $pull: { dislikedBy: userId } });
      return res.status(200).json({ message: "Dislike removed" });
    }

    // Otherwise: add dislike and remove like if present
    await Video.findByIdAndUpdate(id, {
      $pull: { likedBy: userId },
      $addToSet: { dislikedBy: userId },
    });

    res.status(200).json({ message: "Video disliked successfully" });
  } catch (error) {
    console.error("Error disliking video:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteVideo = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId);
        const userId = req.user?._id;
        const userRole = req.user?.role;

        console.log("Video to be deleted:", video);
        console.log("User Role:", userRole);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        console.log("Authenticated User ID:", userId?.toString());
        console.log("Video Uploaded By ID:", video.uploadedBy.toString());
        if (video.uploadedBy.toString() !== userId?.toString() && userRole !== "admin") {
            return res.status(403).json({ message: "You are not authorized to delete this video" });
        }
        // ✅ Delete video from Cloudinary
        if (video.videoPublicId) {
            await cloudinary.uploader.destroy(video.videoPublicId, { resource_type: "video" });
        }

        // ✅ Delete thumbnail from Cloudinary
        if (video.thumbnailPublicId) {
            await cloudinary.uploader.destroy(video.thumbnailPublicId);
        }

        // ✅ Delete document from DB
        await Video.findByIdAndDelete(videoId);

        return res.status(200).json({ message: "Video deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

export const subscribeVideo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params; // video ID
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // ✅ now that 'video' exists, we can access its fields
    const subscribedBy = (video.subscribedBy ?? []).map((u: any) => u.toString());
    const unsubscribedBy = (video.unsubscribedBy ?? []).map((u: any) => u.toString());

    // If already subscribed → unsubscribe
    if (subscribedBy.includes(userId.toString())) {
      await Video.findByIdAndUpdate(id, { $pull: { subscribedBy: userId } });
      return res.status(200).json({ message: "Subscription removed" });
    }

    // Otherwise: remove from unsubscribed, then subscribe
    await Video.findByIdAndUpdate(id, {
      $pull: { unsubscribedBy: userId },
      $addToSet: { subscribedBy: userId },
    });

    res.status(200).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Error subscribing to video:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const unsubscribeVideo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params; // video ID
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const subscribedBy = (video.subscribedBy ?? []).map((u: any) => u.toString());
    const unsubscribedBy = (video.unsubscribedBy ?? []).map((u: any) => u.toString());

    // If already unsubscribed → remove from list
    if (unsubscribedBy.includes(userId.toString())) {
      await Video.findByIdAndUpdate(id, { $pull: { unsubscribedBy: userId } });
      return res.status(200).json({ message: "Unsubscription removed" });
    }

    // Otherwise: remove from subscribed, then unsubscribe
    await Video.findByIdAndUpdate(id, {
      $pull: { subscribedBy: userId },
      $addToSet: { unsubscribedBy: userId },
    });

    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("Error unsubscribing from video:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export default { uploadVideoFile , showAllVideos };