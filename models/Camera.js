import initKnex from "knex";
import knexConfig from "../knexfile.js";
const knex = initKnex(knexConfig);

export async function postCameraDb(newCamera) {
  const camera = await knex("camera").insert(newCamera);
  return camera;
}

export async function getCamerasByProfileQuery(userId) {
  const user = await knex("user").where("user.id", 1).leftJoin();

  const cameras = knex("camera")
    .join("user_camera", "camera.id", "user_camera.camera_id")
    .where("user_camera.user_id", userId)
    .select("camera.*");

  return camera;
}
