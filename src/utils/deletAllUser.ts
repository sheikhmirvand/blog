import User from "../models/userModel";
import connectDb from "../configs/db";
import { config } from "dotenv";
import colors from "colors";
import mongoose from "mongoose";
config();

const deletAllUser = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/my-blog");
        await User.deleteMany();

        console.log(colors.bgGreen("add user deleted"));
    } catch (error) {
        if (error instanceof Error) {
            console.log(colors.red(error.message));
        }
    }
};
