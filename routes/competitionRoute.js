import authorise from "./middleware/auth.js";
import { createCompetition } from "../controllers/competitionController.js";

router.post("/", [authorise, admin], createCompetition);

router.get("/");
