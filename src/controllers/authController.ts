import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcryt from "bcrypt";
import User from "../models/userModel";
import { validationResult } from "express-validator";
import { transport } from "../utils/nodeMailer";

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

            const hashedPassword = await bcryt.hash(password, 10);

            // create new user
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
            });

            // genrate access token
            const accessToken = jwt.sign(
                { id: user._id },
                process.env.SECRET_TOKEN as string,
                {
                    expiresIn: "30d",
                }
            );

            // set access token to cookie
            res.cookie("token", accessToken, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ user, accessToken });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json(errors.array());
            // find user
            const user = await User.findOne({ email });
            // check valid user
            if (!user)
                return res.status(400).json({ message: "ابتدا ثبت نام کنید" });

            // check valid password
            const isCompare = await bcryt.compare(
                password,
                user.password as string
            );

            if (!isCompare)
                return res.status(400).json({
                    message: "پسور درست نیست",
                });

            // genrate access token
            const accessToken = jwt.sign(
                { id: user._id },
                <string>process.env.SECRET_TOKEN,
                {
                    expiresIn: "30d",
                }
            );

            // set access token in cookie
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

    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email)
                return res.status(400).json({
                    message: "enter valid email",
                });
            // check for empty re
            const error = validationResult(req);
            if (!error.isEmpty()) return res.status(400).json(error.array());

            // find user with email
            const user = await User.findOne({ email });

            // check user exists
            if (!user)
                return res.status(404).json({ message: "user not found" });

            // genrate forgot token
            const forgotToken = await jwt.sign(
                { email: user.email },
                process.env.SECRET_TOKEN as unknown as string,
                { expiresIn: "15m" }
            );

            // create forgot link
            const link = `http://localhost:5050/api/v1/auth/forgot-password/${forgotToken}/${user.password}`;

            // send email to userEmail
            await transport.sendMail({
                from: "خب سلام",
                to: email,
                subject: "forgot password",
                text: link,
            });

            res.status(201).json({ message: "ok!" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async changeForgotPassword(req: Request, res: Response) {
        try {
            // get token from params
            const { token } = req.params;

            if (!token)
                return res.status(404).json({ message: "page not found" });

            // get password from body
            const { password } = req.body;

            if (!password)
                return res.status(400).json({ message: "enter a password" });

            // get user email from forgot tokne
            const { email }: string | any = await jwt.verify(
                token,
                process.env.SECRET_TOKEN as unknown as string
            );

            // check for exists email
            if (!email)
                return res.status(400).json({ message: "email not valid" });

            // update and save new password in database
            const user = await User.findOneAndUpdate({ email }, { password });

            res.status(201).json({ user });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
        }
    }

    async logOut(req: Request, res: Response) {
        try {
            res.clearCookie("token");
            res.status(200).json({ message: "you are loged out" });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            }
        }
    }
}

export default new AuthController();
