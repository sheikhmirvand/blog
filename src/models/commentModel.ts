import mongoose, { Schema } from "mongoose";
const commentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            trim: true,
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Post",
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
