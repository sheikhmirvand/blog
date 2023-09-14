import { Request, Response } from "express";
import User from "../models/userModel";

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

            res.json(user);
        } catch (error) {
            if (error instanceof Error)
                return res.status(500).json({ message: error.message });
        }
    }
}

export default new UserController();
