import express from "express";
import multer from "multer";
import sharp from "sharp";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
      .toFile(`home/harry/PhotoApi/images/${req.file.originalname}`);
    res.status(201).send("Image uploaded succesfully");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.listen(PORT, () => {
  console.log("App be listening");
});
