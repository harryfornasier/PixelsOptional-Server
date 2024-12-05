import { postCameraDb } from "../models/Camera.js";
import { addCameraUserDb } from "../models/User.js";

export async function postCamera(req, res) {
  const userId = req.token.id;
  const camera = {
    model: req.body.cameraModel,
    year: req.body.cameraYear,
    brand: req.body.cameraBrand,
  };

  const newCamera = await postCameraDb(camera);
  await addCameraUserDb(userId, newCamera);
  res.status(201).send(newCamera);
}

export async function getCamerasByUser(req, res) {
  const userId = req.params.id;
  const cameras = getCamerasByUser(userId);
  res.status(200).send(cameras);
}
