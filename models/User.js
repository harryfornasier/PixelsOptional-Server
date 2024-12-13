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

export async function registerUserDb(user) {
  const newUser = await knex("user").insert(user);
  return newUser;
}

export async function getUserDb(givenEmail) {
  const user = await knex("user").where("email", givenEmail).first();
  return user;
}
