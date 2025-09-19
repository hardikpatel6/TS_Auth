var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "Ketali";
const signUpUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        res.status(400).send("All Fields Are Required ");
    }
    const hashedPassword = yield bcrypt.hash(password, 10);
    try {
        const userData = yield User.findOne({ email: email });
        if (userData) {
            res.status(409).json("User Already Exists");
        }
        else {
            const newuser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                role: role
            });
            const user = yield User.insertOne(newuser);
            res.status(200).json({ user });
        }
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).send("All Fields are Required");
        }
        const user = yield User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
        const isPasswordValid = yield bcrypt.compare(password, user.password.toString());
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
        else {
            console.log("user role:", user.role);
            const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
            console.log("token:", token);
            res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
            res.status(200).json({ message: "Login successful", token, role: user.role });
        }
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
});
const getAllUsersAndAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield User.find({});
        res.status(200).json({ users });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let users = yield User.find({ role: "user" });
        res.status(200).json({ users });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
});
const getAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admins = yield User.find({ role: "admin" });
        res.status(200).json({ admins });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
});
export { signUpUser, loginUser, getAllUsersAndAdmin, getAllUsers, getAllAdmins };
