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
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1] || req.cookies.token;
    if (!token) {
        return res.status(401).send("User Unauthorized: No Token");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "Hardik");
        if (!decoded.role) {
            return res.status(401).send("User Unauthorized: No Role Found");
        }
        req.user = decoded;
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).send("User Unauthorized: Invalid Token");
    }
}
function isAdmin(req, res, next) {
    const user = req.user;
    if (user && user.role === "admin") {
        next();
    }
    else {
        res.status(403).send("Forbidden: Admins Only");
    }
}
