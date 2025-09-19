import express from "express";
import {uploadVideo} from "../controllers/videoContoller";
import {auth} from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/upload",auth,uploadVideo);

export default router;