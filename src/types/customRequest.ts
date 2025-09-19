import {Request} from "express";
import { VideoUploadRequestBody, VideoUploadRequestFiles } from "./videoUpload";
import { FileArray } from "express-fileupload";

export interface VideoUploadRequest extends Omit<Request<{},{},VideoUploadRequestBody>, 'files'> {
    files?: FileArray | VideoUploadRequestFiles | null;
    user?: {
        _id: string;
        role: string;
    };
}