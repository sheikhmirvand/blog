import { Router } from "express";
import {
    registerValidator,
    loginValidator,
} from "../validators/authValidators";
import AuthController from "../controllers/authController";
const router = Router();

router.post("/register", registerValidator(), AuthController.register);
router.post("/login", loginValidator(), AuthController.login);
router.post("/logout", AuthController.logOut);

export default router;
