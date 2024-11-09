import express from "express";
import multer from "multer";
import sharp from "sharp";
import https from "https";
import fs from "fs";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const privateKey = fs.readFileSync("../Certificates/home_server.key", "utf8");
const certifcate = fs.readFileSync("../Certificates/home_server.pem", "utf8");

const credentials = { key: privateKey, cert: certifcate };

const httpsServer = https.createServer(credentials, app);

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});

app.post("/image", upload.single("image"), async (req, res) => {
  try {
    await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toFile(`./images/${req.file.originalname}`);
    console.log(res.json);
    res.status(201).send("Image uploaded succesfully");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

httpsServer.listen(PORT);

// app.listen(PORT, () => {
//   console.log("App be listening");
// });
