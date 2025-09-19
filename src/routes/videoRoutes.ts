import express from "express";
import {uploadVideo} from "../controllers/videoContoller.ts";
import {auth} from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.post("/upload",auth,uploadVideo);

export default router;