import express from "express";
import multer from "multer";
import sharp from "sharp";
const app = express();
const upload = multer({ dest: "uploads/" });
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/test", (req, res) => {
  res.send({ msg: "Response to GET request to /" });
});

app.post("/test", (req, res) => {
  console.log(req.body);
  res.send({ msg: "Response to POST request to /" });
});

app.post("/image", upload.single("avatar"), async (req, res, next) {
  try {
    await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toFile(__dirname + `/images/${req.file.originalname}`)
         res.status(201).send('Image uploaded succesfully')
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
});

app.listen(PORT, () => {
  console.log("App be listening");
});
