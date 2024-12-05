import express from "express";
import { postCamera } from "../controllers/postCameraController.js";
import authorise from "./middleware/auth.js";

const router = express.Router();

router.post("/", authorise, postCamera);

export default router;
