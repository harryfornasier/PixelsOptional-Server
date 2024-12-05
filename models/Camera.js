import initKnex from "knex";
import knexConfig from "../knexfile.js";
const knex = initKnex(knexConfig);

export async function postCameraDb(newCamera) {
  const camera = await knex("camera").insert(newCamera);
  return camera;
}
