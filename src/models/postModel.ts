import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        body: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        image: {
            data: String,
            contentType: String,
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        len: {
            type: Number,
            default: 0,
        },

        createDate: {
            type: Date,
            default: Date.now(),
        },
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
