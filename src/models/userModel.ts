import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            trim: true,
        },
        password: {
            type: String,
            required: [true, "email is required"],
            trim: true,
        },
        posts: {
            type: Array,
            default: [],
        },
        role: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: new Date(),
        },
    },
    {
        timestamps: true,
    }
);

const User = model("User", userSchema);
export default User;
