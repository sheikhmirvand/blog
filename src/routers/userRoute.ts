import { Router } from "express";
import userController from "../controllers/userController";
import { isUserLogin } from "../middlewares/isUserLogin";

const router = Router();

router.get("/", isUserLogin, userController.getAllUser);
router.get("/:id", userController.getSingleUser);

export default router;
