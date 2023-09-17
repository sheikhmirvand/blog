import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcryt from "bcrypt";
import User from "../models/userModel";
import { validationResult } from "express-validator";

class AuthController {
    async register(req: Request, res: Response) {
        const { name, email, password } = req.body;
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) return res.status(400).json(result.array());
            // check for empty field
            if (!name && !email && !password)
                return res.status(400).json({
                    message: "لطلا تمام فیلد هارا پر کنید",
                });

            const existsUser = await User.findOne({ email });
            if (existsUser)
                return res.status(400).json({ message: "ایمیل تکراری است" });

            // hashed password
            const salt = await bcryt.genSalt(12);
            const hashedPassword = await bcryt.hash(password, salt);

            // create new user
            const user = new User({
                name,
                email,
                password: hashedPassword,
            });

            const accessToken = jwt.sign(
                { id: user._id },
                process.env.SECRET_TOKEN as string,
                {
                    expiresIn: "30d",
                }
            );

            res.cookie("token", accessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            await user.save();

            res.json({ user, accessToken });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const cookies = req.cookies;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json(errors.array());
            // find user
            const user = await User.findOne({ email });
            // check valid user
            if (!user)
                return res.status(400).json({ message: "ابتدا ثبت نام کنید" });

            // check valid password
            const isCompare = bcryt.compare(password, user.password as string);

            if (!isCompare)
                return res.status(400).json({ message: "پسور درست نیست" });

            // genrate access token
            const accessToken = jwt.sign(
                { id: user._id },
                <string>process.env.SECRET_TOKEN,
                {
                    expiresIn: "30d",
                }
            );

            await user.save();

            res.cookie("token", accessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                user,
                accessToken,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async logOut(req: Request, res: Response) {
        try {
            res.clearCookie("token");
            res.json({ message: "you are loged out" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
        }
    }
}

export default new AuthController();
