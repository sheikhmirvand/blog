import mongoose, { Schema } from "mongoose";
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        trim: true,
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
