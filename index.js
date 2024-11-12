import express from "express";
import multer from "multer";
import sharp from "sharp";
import https from "https";
import cors from "cors";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/static", express.static("images"));
app.use(cors());

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

app.post("/image", upload.single("image"), async (req, res) => {
  const newUuid = uuidv4();
  const path = `./images/${newUuid}.jpg`;
  const src = `https://harrisonfornasier.space/static/${newUuid}.jpg`;
  try {
    sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .toFormat("jpg")
      .toFile(path);
    const imageData = { originalname: req.file.originalname, src: src, id: newUuid };
    imageList.push(imageData);
    res.status(201).send({ msg: "Image uploaded succesfully", imageData });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.delete("/image/:id", (req, res) => {
  const imageId = req.params.id;
  fs.rename(`./images/${imageId}.jpg`, `./quarantine/${imageId}.jpg`, function (err) {
    if (err) throw err;
  });
  imageList.splice(
    imageList.findIndex((image) => image.id === imageId),
    1
  );
});

app.get("/image/list", (req, res) => {
  const currentImages = imageList;
  return res.json(currentImages);
});

app.listen(PORT, () => {
  console.log("App be listening");
});
