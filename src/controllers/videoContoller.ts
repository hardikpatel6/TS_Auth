import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { UploadedFile } from "express-fileupload";
import cloudinary from "../config/cloudinary";
import Video from "../models/videoModel";

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
    user?: { _id: string }; // added by auth middleware
}

export const uploadVideoFile = async (req: Request, res: Response) => {
    // Typecast req to VideoUploadRequest safely
    const videoReq = req as VideoUploadRequest;
    console.log(videoReq.body.title);
    console.log(videoReq.files);
    try {
        const { title, description, category, tags } = videoReq.body;

        if (!videoReq.files || !videoReq.files.video) {
            return res.status(400).json({ message: "No video uploaded" });
        }

        const videoFile = Array.isArray(videoReq.files.video)
            ? videoReq.files.video[0].tempFilePath
            : videoReq.files.video.tempFilePath;

        const videoUpload = await cloudinary.uploader.upload(videoFile, {
            resource_type: "video",
            folder: "TS_AUTHENTICATION/videos",
        });

        let thumbnailUrl: string | undefined;
        if (videoReq.files.thumbnail) {
            const thumbnailFile = Array.isArray(videoReq.files.thumbnail)
                ? videoReq.files.thumbnail[0].tempFilePath
                : videoReq.files.thumbnail.tempFilePath;

            const thumbnailUpload = await cloudinary.uploader.upload(thumbnailFile, {
                folder: "TS_AUTHENTICATION/thumbnails",
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
            uploadedBy: videoReq.user?._id,
        });

        const savedVideo = await newVideo.save();
        return res.status(201).json({ message: "Video uploaded successfully", video: savedVideo });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

export default { uploadVideoFile };