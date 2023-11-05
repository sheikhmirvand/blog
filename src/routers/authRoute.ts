import { Router } from "express";
import {
    registerValidator,
    loginValidator,
    forgotValidator,
} from "../validators/authValidators";
import AuthController from "../controllers/authController";
const router = Router();

router.post("/register", registerValidator(), AuthController.register);
router.post("/login", loginValidator(), AuthController.login);
router.post(
    "/forgot-password",
    forgotValidator(),
    AuthController.forgotPassword
);

router.post(
    "/forgot-password/:token/:password",
    AuthController.changeForgotPassword
);
router.post("/logout", AuthController.logOut);

export default router;
