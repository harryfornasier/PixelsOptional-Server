import express from "express";
import cors from "cors";
import posts from "./routes/posts.js";
import comments from "./routes/comments.js";
import users from "./routes/users.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/static", express.static("images"));

//Cors for testing only!
app.use(cors());

// app.use("/images", images);
app.use("/comments", comments);
app.use("/posts", posts);
app.use("/users", users);

app.listen(PORT, () => {
  console.log("App be listening");
});
