import { Request, NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isUserLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const tokenHeader = req.headers.authorization || req.cookies["token"];
    try {
        if (!tokenHeader)
            return res.status(400).json({ message: "لطفا به اکانت وارد شوید" });
        const isVerify = <JwtPayload>(
            await jwt.verify(
                <string>tokenHeader,
                <string>process.env.SECRET_TOKEN
            )
        );
        if (!isVerify)
            return res.status(400).json({ message: "we have problem" });

        res.locals = isVerify.id;
        next();
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
