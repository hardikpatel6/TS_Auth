import express from "express";
import {signUpUser,loginUser,getAllUsersAndAdmin,getAllUsers,getAllAdmins} from "../controllers/userController";
import {auth,isAdmin} from "../middlewares/authMiddleware";
const router = express.Router();

router.post("/signup",signUpUser);
router.post("/login",loginUser);
router.get("/getAllData",auth,isAdmin,getAllUsersAndAdmin);
router.get("/getAllUsers",auth,isAdmin,getAllUsers);
router.get("/getAllAdmins",auth,isAdmin,getAllAdmins);
export default router;