import initKnex from "knex";
import knexConfig from "../knexfile.js";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import multer from "multer";

const knex = initKnex(knexConfig);

import express from "express";
const router = express.Router();

const upload = multer({
  limits: {
    fileSize: 5000000,
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});

router.get("/", async (_req, res) => {
  try {
    const posts = await knex("post");

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ mesesage: `Error fetching from database: ${error}` });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const newUuid = uuidv4();
  const path = `./images/${newUuid}.jpg`;
  const src = `https://harrisonfornasier.space/static/${newUuid}.jpg`;
  try {
    sharp(req.file.buffer)
      .resize(300, 300, {
        fit: "inside",
      })
      .toFormat("jpg")
      .toFile(path);
    const imageData = {
      user_id: 2,
      title: req.body.title,
      content: req.body.description,
      image_url: src,
      camera_id: 1,
    };
    const newPost = await knex("post").insert(imageData);
    res.status(201).send({ msg: "Image uploaded succesfully", imageData });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await knex("post");
    res.status(200).json(posts);
  } catch (error) {}
});

router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await knex("post").where("id", postId);
    res.status(200).json({ msg: "comment uploaded succesfully", post });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
