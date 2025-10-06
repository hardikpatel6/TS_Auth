"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.isAdmin = isAdmin;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
async function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || req.cookies.token;
    if (!token) {
        return res.status(401).send("User Unauthorized: No Token");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "Hardik");
        console.log("Decoded Token:", decoded);
        if (!decoded.id || !decoded.role) {
            return res.status(401).send("User Unauthorized: No Role Found");
        }
        req.user = await userModel_1.default.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(401).send("User Unauthorized: User Not Found");
        }
        console.log("Req.user:", req.user);
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).send("User Unauthorized: Invalid Token");
    }
}
function isAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).send("Forbidden: Admins Only");
}
