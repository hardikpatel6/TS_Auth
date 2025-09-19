import { UploadedFile } from "express-fileupload";

export interface VideoUploadRequestBody {
    title: string;
    description: string;
    category?: string;
    tags?: string[];
}

export interface VideoUploadRequestFiles{
    video: UploadedFile;
    thumbnail: UploadedFile;
}
