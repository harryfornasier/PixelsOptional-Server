import { getCompetitionQuery, insertCompetition } from "../models/Competition.js";

export async function createCompetition(req, res) {
  const competition = {
    name: req.body.name,
    description: req.body.description,
  };

  try {
    if (req.body.name || req.body.description) {
      const competitionId = await insertCompetition(competition);

      res.status(201).json({ msg: "Competition created", competitionId });
    } else {
      res.status(400).json({ msg: "Field 'name' or 'description' cannot be empty." });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function getCompetitions(req, res) {
  const competitions = await getCompetitionQuery();
  res.status(200).json({ competitions });
}
