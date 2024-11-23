import initKnex from "knex";
import knexConfig from "../knexfile.js";
import router from "./images.js";

const knex = initKnex(knexConfig);

export default router;
