import express from "express";
import {Request,Response} from "express";
import {uploadVideoFile} from "../controllers/videoContoller";
import {auth} from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/upload-video",auth,uploadVideoFile);

export default router;