import initKnex from "knex";
import knexConfig from "../knexfile.js";
const knex = initKnex(knexConfig);

export async function addCameraUserDb(userId, cameraId) {
  const userCamera = await knex("user_camera").insert({
    user_id: userId,
    camera_id: cameraId,
  });
  return userCamera;
}
