import { getCamerasByProfileQuery, postCameraDb } from "../models/Camera.js";
import { addCameraUserDb } from "../models/User.js";

export async function postCamera(req, res) {
  const userId = req.token.id;

  const camera = {
    model: req.body.cameraModel,
    year: req.body.cameraYear,
    brand: req.body.cameraBrand,
  };

  try {
    if (!camera.model) {
      res.status(400).json({ msg: "No camera model included" });
    } else if (!camera.brand) {
      res.status(400).json({ msg: "No camera brand included" });
    } else if (!camera.year) {
      res.status(400).json({ msg: "No camera year included" });
    } else {
      const newCamera = await postCameraDb(camera);
      await addCameraUserDb(userId, newCamera);
      res.status(201).json({ msg: "Posted new camera", newCamera });
    }
  } catch (error) {
    res.status(500).json({ msg: "Unknown error", error });
  }
}

export async function getCamerasByUser(req, res) {
  const userId = req.params.id;
  const cameras = await getCamerasByProfileQuery(userId);
  res.status(200).json({ msg: "Found the cameras", cameras });
}
