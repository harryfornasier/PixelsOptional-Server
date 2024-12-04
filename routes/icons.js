import initKnex from "knex";
import knexConfig from "../knexfile.js";
import express from "express";

const knex = initKnex(knexConfig);
const router = express.Router();

router.get("/", async function (req, res) {
  try {
    const icons = await knex("icon");

    res.status(200).json({ msg: "Found Icons", icons });
  } catch (error) {
    res.status(500).json({ msg: "Unknown error occurred", error });
  }
});

export default router;
