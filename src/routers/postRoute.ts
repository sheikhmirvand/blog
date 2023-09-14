import { Router } from "express";
import PostController from "../controllers/postController";
import { isUserLogin } from "../middlewares/isUserLogin";
import upload from "../uploadHandler";
import isAdmin from "../middlewares/isAdminMiddleware";

const router = Router();

router.get("/", PostController.gettAllPosts);
router.post(
    "/create",
    upload.single("image"),
    isUserLogin,
    PostController.create
);
router.get("/salam", (req, res) => res.send("salam"));
router.get("/userpost", isUserLogin, PostController.getUserPost);
router
    .route("/:id")
    .get(PostController.getSinglePost)
    .patch(isUserLogin, upload.single("image"), PostController.updatePost)
    .delete(isUserLogin, PostController.deletPost);

export default router;
