import { Schema,model } from "mongoose";

import { Types } from "mongoose";

export interface IVideo {
  title: string;
  description: string;
  url: string;        // Cloudinary video URL
  thumbnail: string;  // Cloudinary thumbnail URL
  category?: string;
  tags?: string[];
  uploadedBy: Types.ObjectId; // user _id
  views?: number;
  createdAt?: Date;
  updatedAt?: Date;
}


const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String },
    tags: { type: [String] },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);


const Video = model<IVideo> ('Video', videoSchema);

export default Video;