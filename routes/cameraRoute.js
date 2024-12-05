import express from "express";
import { getCamerasByUser, postCamera } from "../controllers/postCameraController.js";
import authorise from "./middleware/auth.js";

const router = express.Router();

router.post("/", authorise, postCamera);

router.get("/:id", getCamerasByUser);

export default router;
