import express from "express";
import cors from "cors";
import posts from "./routes/posts.js";
import comments from "./routes/comments.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/static", express.static("images"));
app.use(cors());

// app.use("/images", images);
app.use("/comments", comments);
app.use("/posts", posts);

app.listen(PORT, () => {
  console.log("App be listening");
});
