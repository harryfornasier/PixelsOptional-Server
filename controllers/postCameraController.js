import { postCameraDb } from "../models/Camera.js";
import { addCameraUserDb } from "../models/User.js";

export async function postCamera(req, res) {
  const userId = req.token.id;
  const camera = {
    camera_model: req.body.cameraModel,
    camera_year: req.body.cameraYear,
    camera_brand: req.body.cameraBrand,
  };

  const newCamera = await postCameraDb(camera);
  const addToUser = await addCameraUserDb(userId, newCamera);
  res.status(201).send(newCamera);
}
