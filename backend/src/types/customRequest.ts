import type { Request } from "express";
import type { VideoUploadRequestBody, VideoUploadRequestFiles } from "./videoUpload.ts";
import type { FileArray } from "express-fileupload";

export interface VideoUploadRequest extends Omit<Request<{}, {}, VideoUploadRequestBody>, 'files'> {
    files?: FileArray | VideoUploadRequestFiles | null;
    user?: {
        _id: string;
        role: string;
    };
}