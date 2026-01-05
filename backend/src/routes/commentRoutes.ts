import express from "express";
import {auth} from "../middlewares/authMiddleware";
import { addComment,editComment,getCommentsByVideo,deleteComment,likeComment,dislikeComment } from "../controllers/commentController";

const router = express.Router();

router.post("/comment/:videoId",auth,addComment);
router.post("/edit/:commentId",auth,editComment);
router.get("/allComments/:videoId",auth,getCommentsByVideo);
router.delete("/comment/:commentId",auth,deleteComment);
router.put("/like/:id",auth,likeComment);
router.put("/dislike/:id",auth,dislikeComment)

export default router;