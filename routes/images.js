import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import multer from "multer";

const router = express.Router();

const imageList = [];

const upload = multer({
  limits: {
    fileSize: 5000000,
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});

router
  .post("/", upload.single("image"), async (req, res) => {
    const newUuid = uuidv4();
    const path = `./images/${newUuid}.jpg`;
    const src = `https://harrisonfornasier.space/static/${newUuid}.jpg`;
    try {
      sharp(req.file.buffer)
        .resize(800, 800, {
          fit: "inside",
        })
        .toFormat("jpg")
        .toFile(path);
      const imageData = {
        originalname: req.file.originalname,
        src: src,
        id: newUuid,
        description: req.body.description,
      };
      imageList.push(imageData);
      res.status(201).send({ msg: "Image uploaded succesfully", imageData });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  })
  .get("/", (req, res) => {
    const currentImages = imageList;
    res.status(200).json(currentImages);
  });

router.delete("/:id", (req, res) => {
  const imageId = req.params.id;
  fs.rename(`./images/${imageId}.jpg`, `./quarantine/${imageId}.jpg`, function (err) {
    if (err) throw err;
  });
  imageList.splice(
    imageList.findIndex((image) => image.id === imageId),
    1
  );
  res.status(204).send({ msg: "Image succesfully deleted" });
});

export default router;
