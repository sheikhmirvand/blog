import mongoose from "mongoose";
import colors from "colors";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log(colors.cyan("db connected"));
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};

export default connectDb;
