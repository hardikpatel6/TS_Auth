import jwt from "jsonwebtoken";
import { Request,Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "hardik";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "patel";
const ACCESS_TOKEN_TTL = "3m";        // short lived
const REFRESH_TOKEN_TTL = "7d";        // long lived

export function signAccessToken(payload: object) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as {
    sub: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
  };
}

export function decodedUser(token: string){
  return jwt.verify(token, REFRESH_TOKEN_SECRET as string);
}
export function setRefreshCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: true,           // true in production behind HTTPS
    sameSite: "strict",     // if same-site; use "none" for cross-site + secure
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // align with REFRESH_TOKEN_TTL
  });
}

