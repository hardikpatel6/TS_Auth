"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import jwt from "jsonwebtoken";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_SECRET = process.env.ACCESS_SECRET || "hardik";
console.log(ACCESS_SECRET);
const REFRESH_SECRET = process.env.RREFRESH_SECRET || "patel";
console.log(REFRESH_SECRET);
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
console.log(ACCESS_EXPIRES_IN);
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
console.log(REFRESH_EXPIRES_IN);
// export type JwtUser = { id: string; email: string; role: "user" | "admin" };
// export function generateAccessToken(payload: JwtUser) {
//   return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
// }
// export function generateRefreshToken(payload: JwtUser) {
//   return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
// }
// export function verifyAccessToken(token: string) {
//   return jwt.verify(token, ACCESS_SECRET) as JwtUser;
// }
// export function verifyRefreshToken(token: string) {
//   return jwt.verify(token, REFRESH_SECRET) as JwtUser;
// }
