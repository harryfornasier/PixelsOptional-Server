import {
  getComments,
  insertComment,
  deleteComment,
} from "../controllers/commentController.js";

import express from "express";
import authorise from "./middleware/auth.js";
const router = express.Router();

router.post("/", authorise, insertComment);

router.get("/:id", getComments);

router.delete("/:id", authorise, deleteComment);

export default router;
