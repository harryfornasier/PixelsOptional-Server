import {
  deletePost,
  getPostById,
  getPosts,
  likePost,
  postImage,
} from "../controllers/postController.js";
import express from "express";
import authorise from "./middleware/auth.js";
const router = express.Router();

router.post("/", authorise, postImage);

router.get("/", getPosts);

router.get("/:id", getPostById);

router.patch("/:id/likes", authorise, likePost);

router.delete("/:id", authorise, deletePost);

export default router;
