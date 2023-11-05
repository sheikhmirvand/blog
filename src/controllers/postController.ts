import { Request, Response } from "express";
import Post from "../models/postModel";
import User from "../models/userModel";
import Comment from "../models/commentModel";

class PostController {
    async gettAllPosts(req: Request, res: Response) {
        const { search, sortpost } = req.query;
        try {
            const posts = await Post.find({
                $or: [
                    { title: { $regex: search } },
                    { body: { $regex: search } },
                ],
            }).sort(sortpost as string);

            res.json(posts);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    }

    async create(req: Request, res: Response) {
        const userId = res.locals;
        const { title, body } = req.body;
        try {
            const len = body.length;
            const expost = await Post.findOne({ title });
            if (expost)
                return res
                    .status(400)
                    .json({ message: "تایتل پست تکراری است" });
            if (!body || !title || !req.file)
                return res.status(400).json({ message: "فیلد ها را پر کنید" });
            const post = await new Post({
                title,
                user: userId,
                len,
                body,
                image: {
                    data: req.file?.filename,
                    contentType: req.file?.mimetype,
                },
            }).save();

            const user = await User.findById(userId);

            user?.posts.push(post._id);
            await user?.save();

            res.status(200).json({ post });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    }

    async getSinglePost(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const post = await Post.findById(id);
            const comments = await Comment.find({ post: id }).sort(
                "-createdAt"
            );

            if (!post)
                return res.status(404).json({ message: "post not found" });

            res.json({
                post,
                comments,
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    }

    async updatePost(req: Request, res: Response) {
        const { id } = req.params;
        const { title, body } = req.body;
        console.log(req.body);

        try {
            const post = await Post.findByIdAndUpdate(
                id,
                {
                    title,
                    body,
                    image: {
                        data: req.file?.filename,
                        contentType: req.file?.mimetype,
                    },
                },
                { new: true }
            );

            res.json({
                post,
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    }

    async deletPost(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const post = await Post.findByIdAndDelete(id);

            res.json({ post });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    }

    async getUserPost(req: Request, res: Response) {
        try {
            const userId = res.locals;
            console.log(userId);

            const posts = await Post.find({ user: userId });
            if (!posts)
                return res.json({ message: "شما پست ندارید پست بسازید" });
            res.status(200).json({ posts });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    }
}

export default new PostController();
