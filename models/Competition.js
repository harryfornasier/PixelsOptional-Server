import initKnex from "knex";
import knexConfig from "../knexfile.js";
const knex = initKnex(knexConfig);

const insertCompetition = async (competitionObj) => {
  const competition = await knex("competition").insert({
    name: competitionObj.name,
    description: competitionObj.description,
    end_date: knex.raw("DATE_ADD(NOW(), INTERVAL 1 MONTH)"),
  });
  return competition;
};

const getCompetitionQuery = async () => {
  const competitions = await knex("competition").where("end_date", ">", knex.fn.now());
  return competitions;
};

export { insertCompetition, getCompetitionQuery };
