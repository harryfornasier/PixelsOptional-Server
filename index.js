import express from "express";
import multer from "multer";
import sharp from "sharp";
import https from "https";
import cors from "cors";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
const app = express();
const PORT = process.env.PORT || 443;

app.use(express.json());
app.use("/static", express.static("images"));
app.use(cors());

const privateKey = fs.readFileSync("../Certificates/home_server.key", "utf8");
const certifcate = fs.readFileSync("../Certificates/home_server.pem", "utf8");

const imageList = [];

const credentials = { key: privateKey, cert: certifcate };

const httpsServer = https.createServer(credentials, app);

const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
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
  console.log("A request to delete " + req.params.id);
});

app.get("/image/list", (req, res) => {
  const currentImages = imageList;
  return res.json(currentImages);
});

httpsServer.listen(PORT);

// app.listen(PORT, () => {
//   console.log("App be listening");
// });
