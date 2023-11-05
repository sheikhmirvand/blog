import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals;
        const user = await User.findById(userId);
        if (user?.role === 0)
            return res.status(400).json({ message: "شما ادمین نیستید" });
        next();
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
        }
    }
};

export default isAdmin;
