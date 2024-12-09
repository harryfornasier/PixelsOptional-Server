import {
  deletePost,
  getPostById,
  getPosts,
  likePost,
  postImage,
} from "../controllers/postController.js";
import express from "express";
import authorise from "./middleware/auth.js";
import admin from "./middleware/admin.js";
const router = express.Router();

router.post("/", authorise, postImage);

router.get("/", getPosts);

router.get("/:id", getPostById);

router.patch("/:id", authorise, likePost);

router.delete("/:id", [authorise, admin], deletePost);

export default router;
