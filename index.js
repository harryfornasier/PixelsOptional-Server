import express from "express";
import multer from "multer";
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

app.post("/image", upload.single("avatar"), function (req, res, next) {
  res.send({ msg: "saved the image successfully" });
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});

app.listen(PORT, () => {
  console.log("App be listening");
});
