import express from "express";
import cors from "cors";
import images from "./routes/images.js";
import posts from "./routes/posts.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/static", express.static("images"));
app.use(cors());

app.use("/images", images);
app.use("/posts", posts);

app.listen(PORT, () => {
  console.log("App be listening");
});
