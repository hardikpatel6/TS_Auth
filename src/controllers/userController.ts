import type { Request, Response } from "express";
import type { IUser } from "../models/userModel.ts";
import User from "../models/userModel.ts";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "Ketali";

const signUpUser = async (req: Request, res: Response): Promise<void> => {
    let { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        res.status(400).send("All Fields Are Required ");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const userData: IUser[] | null = await User.findOne({ email: email });
        if (userData) {
            res.status(409).json("User Already Exists");
        } else {
            const newuser: IUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                role: role
            });
            const user: IUser[] | IUser | null = await User.insertOne(newuser);
            res.status(200).json({ user });
        }
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}
const loginUser = async (req: Request, res: Response): Promise<void> => {
    let { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).send("All Fields are Required");
        }
        const user: IUser | null = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password.toString());
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        } else {
            console.log("user role:", user.role);
            const token: string = jwt.sign(
                { email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: "1h" }
            );
            console.log("token:", token);
            res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
            res.status(200).json({ message: "Login successful", token, role: user.role });
        }
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}
const getAllUsersAndAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        let users: IUser[] | null = await User.find({});
        res.status(200).json({ users });
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        let users: IUser[] | null = await User.find({ role: "user" });
        res.status(200).json({ users });
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}
const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
    try {
        let admins: IUser[] | null = await User.find({ role: "admin" });
        res.status(200).json({ admins });
    } catch (err: unknown) {
        console.log(err);
        res.json("Error in DB");
    }
}

export { signUpUser, loginUser, getAllUsersAndAdmin, getAllUsers, getAllAdmins };