import {
  getComments,
  insertComment,
  deleteComment,
} from "../controllers/commentController.js";

import express from "express";
import authorise from "./middleware/auth.js";
const router = express.Router();

router.post("/:id/comments", authorise, insertComment);

router.get("/:id/comments", getComments);

router.delete("/:id/comments/:commentId", authorise, deleteComment);

export default router;
