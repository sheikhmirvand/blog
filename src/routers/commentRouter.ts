import { Router } from "express";
import commentController from "../controllers/commentController";
import { isUserLogin } from "../middlewares/isUserLogin";

const router = Router();

router.post("/:post", isUserLogin, commentController.newComment);
router.get("/:post", isUserLogin, commentController.getPostComments);
router.delete("/:post", isUserLogin, commentController.deletComment);

export default router;
