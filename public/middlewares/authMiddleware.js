import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1]) || req.cookies.token;
    if (!token) {
        return res.status(401).send("User Unauthorized: No Token");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "Hardik");
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
export { auth, isAdmin };
