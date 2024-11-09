import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/test", (req, res) => {
  res.send({ msg: "Response to GET request to /" });
});

app.post("/test", (req, res) => {
  console.log(req.body);
  res.send({ msg: "Response to POST request to /" });
});

app.listen(PORT, () => {
  console.log("App be listening");
});
