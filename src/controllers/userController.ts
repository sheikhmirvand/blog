import { Request, Response } from "express";
import User from "../models/userModel";
import Comment from "../models/commentModel";
import Post from "../models/postModel";

class UserController {
    async getAllUser(req: Request, res: Response) {
        try {
            const users = await User.find();

            res.json(users);
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ message: error.message });
        }
    }

    async getSingleUser(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const user = await User.findById(id);
            if (!user)
                return res
                    .status(400)
                    .json({ message: "یوزری با این ایدی پیدا نشد" });

            const userPosts = await Post.find({ user: id });

            res.json({
                user,
                posts: userPosts,
            });
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ message: error.message });
        }
    }

    async updateUser(req: Request, res: Response) {
        const { name, email, password } = req.body;
        try {
            const { id } = req.params;
            const updateduser = await User.findByIdAndUpdate(id, {
                email,
                name,
                password,
            });

            res.json(updateduser);
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ message: error.message });
        }
    }

    async deletUserWithPost(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser)
                return res.status(401).json({ message: "user not found" });
            await Post.deleteMany({ user: id });
            await Comment.deleteMany({ user: id });
            res.status(201).json(deletedUser);
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ message: error.message });
        }
    }
}

export default new UserController();
