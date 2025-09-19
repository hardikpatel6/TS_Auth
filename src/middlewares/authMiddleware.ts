import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt, { JwtPayload } from "jsonwebtoken";

function auth(req:Request, res:Response, next:NextFunction) {
    const authHeader : string | undefined = req.headers.authorization;
    const token : undefined | null | string = authHeader?.split(" ")[1] || req.cookies.token;
    if (!token) {
        return res.status(401).send("User Unauthorized: No Token");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "Hardik") as JwtPayload & { role?: string };

        if(!decoded.role){
            return res.status(401).send("User Unauthorized: No Role Found");
        }
        (req as any).user = decoded;
        next();
    }
    catch (err) {
        console.error("Token verification failed:", err);
        return res.status(401).send("User Unauthorized: Invalid Token");
    }
}

function isAdmin(req:Request, res:Response, next:NextFunction) {
    const user = (req as any).user;
    if (user && user.role === "admin") {
        next();
    } else {
        res.status(403).send("Forbidden: Admins Only");
    }
}
export {auth,isAdmin};