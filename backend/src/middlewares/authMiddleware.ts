import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import { isBlacklisted } from './../utils/tokenBlacklist';
export interface AuthRequest extends Request {
    user?: any;
}
export interface DecodedToken extends JwtPayload {
    sub: string;
    email: string;
    role:string;
}
async function auth(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader: string | undefined = req.headers.authorization;
    const token: undefined | null | string = authHeader?.split(" ")[1] || req.cookies.accessToken;
    if (!token) {
        return res.status(401).send("User Unauthorized: No Token");
    }
    if(isBlacklisted(token)){
        return  res.status(401).send("User Unauthorized: Token is Blacklisted");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "Hardik") as DecodedToken;
        // console.log("Decoded Token:", decoded);
        if (!decoded.sub || !decoded.role) {
            return res.status(401).send("User Unauthorized: No Role Found");
        }
        const user = await User.findById(decoded.sub).select("-password");
        if(!user){
            return res.status(401).send("User Unauthorized: User Not Found");
        }
        req.user = user;
        // console.log("Req.user:" ,req.user);
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).send("User Unauthorized: Invalid Token");
    }
}

function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).send("Forbidden: Admins Only");
}
export { auth, isAdmin };