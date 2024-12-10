import authorise from "./middleware/auth.js";
import admin from "./middleware/admin.js";
import {
  createCompetition,
  getCompetitions,
} from "../controllers/competitionController.js";
import express from "express";
const router = express.Router();

router.post("/", [authorise, admin], createCompetition);

router.get("/", getCompetitions);

export default router;
