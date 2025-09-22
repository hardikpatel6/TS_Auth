import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cloudinary from "../config/cloudinary";
import Video from "../models/videoModel";
import type { VideoUploadRequest } from "../types/customRequest";

const uploadVideo = async (req: VideoUploadRequest, res: Response): Promise<void> => {
    console.log("Upload video controller hit");
    // res.send("Request received");
    // try {
    //     const { title, description, category, tags } = req.body;
    //     if (!req.files || !req.files.video) {
    //         res.status(400).json({ message: "No file or Video uploaded" });
    //         return;
    //     }
    //     // Upload video to Cloudinary
    //     const videoFile = Array.isArray(req.files.video)
    //         ? req.files.video[0].tempFilePath : req.files.video.tempFilePath;
    //     const videoUpload = await cloudinary.uploader.upload(videoFile, {
    //         resource_type: "video",
    //         folder: "TS_AUTHENTICATION/videos"
    //     });

    //     let thumbnailUrl: string | undefined;
    //     const thumbnailFile = Array.isArray(req.files.thumbnail)
    //         ? req.files.thumbnail[0].tempFilePath : req.files.thumbnail.tempFilePath;
    //     if (req.files.thumbnail) {
    //         const thumbnailUpload = await cloudinary.uploader.upload(thumbnailFile, {
    //             folder: "TS_AUTHENTICATION/thumbnails"
    //         });
    //         thumbnailUrl = thumbnailUpload.secure_url;
    //     }

    //     const newVideo = new Video({
    //         title,
    //         description,
    //         url: videoUpload.secure_url,
    //         thumbnail: thumbnailUrl || "",
    //         category,
    //         tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
    //         uploadedBy: (req as any).user._id, // Assuming auth middleware adds user to req
    //     });
    //     const savedVideo = await newVideo.save();
    //     res.status(200).json({ message: "Video Uploaded Successfully", video: newVideo });
    // } catch (err: unknown) {
    //     console.log(err);
    //     res.json("Error in DB");
    // }
}

export { uploadVideo };