import { body } from "express-validator";
export const registerValidator = () => {
    return [
        body("name")
            .notEmpty()
            .isLength({ min: 3, max: 23 })
            .withMessage("لطفا نام واقعی خود را وارد کنید"),
        body("email")
            .isEmail()
            .notEmpty()
            .withMessage("لطفا یک ایمیل واقعی وارد کنید"),
        body("password").notEmpty().isLength({ min: 6, max: 32 }),
    ];
};

export const loginValidator = () => {
    return [
        body("email")
            .notEmpty()
            .isEmail()
            .withMessage("لطفا ایمیل واقعی خود را وارد کنید"),
        body("password")
            .notEmpty()
            .isLength({ min: 6, max: 32 })
            .withMessage("پسورد واقعی وارد کنید"),
    ];
};

export const forgotValidator = () => {
    return [
        body("email")
            .notEmpty()
            .isEmail()
            .withMessage("لطفا یک ایمیل واقعی وارد کنید"),
    ];
};
