"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/signup", userController_1.signUpUser);
router.post("/login", userController_1.loginUser);
router.get("/getAllData", authMiddleware_1.auth, authMiddleware_1.isAdmin, userController_1.getAllUsersAndAdmin);
router.get("/getAllUsers", authMiddleware_1.auth, authMiddleware_1.isAdmin, userController_1.getAllUsers);
router.get("/getAllAdmins", authMiddleware_1.auth, authMiddleware_1.isAdmin, userController_1.getAllAdmins);
exports.default = router;
