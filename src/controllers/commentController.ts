import Comment from "../models/commentModel";
import Post from "../models/postModel";
import { Request, Response } from "express";

class CommentController {
    public async newComment(req: Request, res: Response) {
        try {
            const { content, title, rating } = req.body;
            const user = res.locals;
            const { post } = req.params;
            if (!content || !title || !rating) {
                return res.status(400).json({
                    message: "لطفا تمام فیلد ها را پر کنید",
                });
            }

            let postinDataBase = await Post.findById(post);
            if (!postinDataBase)
                return res.status(400).json({ message: "پست پیدا نشد" });

            const newComment = await Comment.create({
                title,
                content,
                rating,
                user,
                post,
            });

            postinDataBase?.comments.push(newComment._id);
            await postinDataBase?.save();
            res.status(200).json({ newComment });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    message: error.message,
                });
            }
        }
    }

    async getPostComments(req: Request, res: Response) {
        const id = req.params.post;
        try {
            const comments = await Comment.find({ post: id });

            if (!comments)
                return res.status(400).json({
                    message: "هنوز کامنتی وارد نشده",
                });

            const allRate = comments.reduce(
                (acc, post) => Number(acc + post.rating),
                0
            );

            const avragePostRate = allRate / comments.length;

            res.status(200).json({ comments, avragePostRate });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({
                    message: error.message,
                });
            }
        }
    }

    async deletComment(req: Request, res: Response) {
        try {
            const { post } = req.params;
            await Comment.findByIdAndDelete(post);

            res.json({
                message: "success",
            });
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({
                    message: error.message,
                });
        }
    }
}

const commentController = new CommentController();

export default commentController;
