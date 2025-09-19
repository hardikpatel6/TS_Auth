import express from "express";
import {uploadVideo} from "../controllers/videoContoller.js";
import {auth} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload",auth,uploadVideo);

export default router;