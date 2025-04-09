import express from "express";
import cors from "cors";
import posts from "./routes/postRoute.js";
import comments from "./routes/commentRoute.js";
import users from "./routes/users.js";
import cameraRoute from "./routes/cameraRoute.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;

const options = {
  origin: function (origin, callback) {
    if (origin === process.env.ORIGIN) {
      callback(null, true)
    } else {
      callback("CORS error: Origin not allowed")
    }
  }
}

app.use(express.json());
app.use("/static", express.static("images"));
app.use("/icons", express.static("icons"));

app.use(cors(options));

app.use("/comments", comments);
app.use("/posts", posts);
app.use("/users", users);
app.use("/cameras", cameraRoute);

app.listen(PORT, () => {
  console.log("App be listening");
});
