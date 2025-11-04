"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.decodedUser = decodedUser;
exports.setRefreshCookie = setRefreshCookie;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "hardik";
console.log(ACCESS_TOKEN_SECRET);
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "patel";
console.log(REFRESH_TOKEN_SECRET);
const ACCESS_TOKEN_TTL = "3m"; // short lived
const REFRESH_TOKEN_TTL = "7d"; // long lived
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_TTL,
    });
}
function signRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_TTL,
    });
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
}
function decodedUser(token) {
    return jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
}
function setRefreshCookie(res, token) {
    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: true, // true in production behind HTTPS
        sameSite: "strict", // if same-site; use "none" for cross-site + secure
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // align with REFRESH_TOKEN_TTL
    });
}
