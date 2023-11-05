import { Router } from "express";
import userController from "../controllers/userController";
import { isUserLogin } from "../middlewares/isUserLogin";

const router = Router();

router.get("/", isUserLogin, userController.getAllUser);
router
    .route("/:id")
    .get(userController.getSingleUser)
    .put(userController.updateUser)
    .delete(userController.deletUserWithPost);

export default router;
