"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAdmins = exports.getAllUsers = exports.getAllUsersAndAdmin = exports.loginUser = exports.signUpUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "Ketali";
const signUpUser = async (req, res) => {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        res.status(400).send("All Fields Are Required ");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    try {
        const userData = await userModel_1.default.findOne({ email: email });
        if (userData) {
            res.status(409).json("User Already Exists");
        }
        else {
            const newuser = new userModel_1.default({
                name: name,
                email: email,
                password: hashedPassword,
                role: role
            });
            const user = await userModel_1.default.insertOne(newuser);
            res.status(200).json({ user });
        }
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.signUpUser = signUpUser;
const loginUser = async (req, res) => {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).send("All Fields are Required");
        }
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password.toString());
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
        else {
            console.log("user role:", user.role);
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
            console.log("token:", token);
            res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
            res.status(200).json({ message: "Login successful", token, role: user.role });
        }
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.loginUser = loginUser;
const getAllUsersAndAdmin = async (req, res) => {
    try {
        let users = await userModel_1.default.find({});
        res.status(200).json({ users });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.getAllUsersAndAdmin = getAllUsersAndAdmin;
const getAllUsers = async (req, res) => {
    try {
        let users = await userModel_1.default.find({ role: "user" });
        res.status(200).json({ users });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.getAllUsers = getAllUsers;
const getAllAdmins = async (req, res) => {
    try {
        let admins = await userModel_1.default.find({ role: "admin" });
        res.status(200).json({ admins });
    }
    catch (err) {
        console.log(err);
        res.json("Error in DB");
    }
};
exports.getAllAdmins = getAllAdmins;
