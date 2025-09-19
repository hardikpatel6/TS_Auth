import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
// Define config type
const cloudinaryConfig = {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
};
// Apply config
cloudinary.config(cloudinaryConfig);
export default cloudinary;
