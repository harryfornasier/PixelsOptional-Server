import { insertCompetition } from "../models/Competition.js";

export async function createCompetition(req, res) {
  const competition = {
    name: req.body.competitionName,
    description: req.body.competitionDescription,
  };

  try {
    const competitionId = insertCompetition(competition);

    res.status(201).json({ msg: "Competition created", competitionId });
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function getCompetitions(req, res) {}
