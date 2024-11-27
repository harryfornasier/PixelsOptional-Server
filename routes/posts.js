import initKnex from "knex";
import knexConfig from "../knexfile.js";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import multer from "multer";

const knex = initKnex(knexConfig);

import express from "express";
import authorise from "./middleware/auth.js";
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

router.post("/", [authorise, upload.single("image")], async (req, res) => {
  const newUuid = uuidv4();
  const path = `./images/${newUuid}.jpg`;
  const src = `https://harrisonfornasier.space/static/${newUuid}.jpg`;
  try {
    sharp(req.file.buffer)
      .resize(1440, 1050, {
        fit: "cover",
      })
      .rotate()
      .toFormat("jpg")
      .toFile(path);
    const imageData = {
      user_id: req.token.id,
      title: req.body.title,
      content: "",
      image_url: src,
      camera_id: 1,
    };
    const newPost = await knex("post").insert(imageData);
    res.status(201).send({ msg: "Image uploaded succesfully", newPost });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.get("/", async (_req, res) => {
  try {
    const posts = await knex("camera")
      .join("post", "camera.id", "post.camera_id")
      .join("user", "user.id", "post.user_id") // Join with the 'user' table
      .select("camera.*", "post.*", "user.name");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ mesesage: `Error fetching from database: ${error}` });
  }
});

router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await knex("post")
      .leftJoin("comment", "post.id", "comment.post_id")
      .leftJoin("camera", "post.camera_id", "camera.id")
      .select(
        "post.id as post_id",
        "post.created_at",
        "post.updated_at",
        "post.user_id",
        "post.title",
        "post.like",
        "post.comment_count",
        "post.content",
        "post.image_url",
        "camera.id as camera_id",
        "camera_model as camera_model",
        "camera_year as camera_year",
        "camera_brand as camera_brand"
      )
      .select(
        knex.raw(`JSON_ARRAYAGG(
        JSON_OBJECT(
          'comment_id', comment.id,
          'user_id', comment.user_id,
          'text', comment.comment
        )
      ) AS comments`)
      )
      .where("post.id", postId)
      .groupBy(
        "post.id",
        "post.created_at",
        "post.updated_at",
        "post.user_id",
        "post.title",
        "post.like",
        "post.comment_count",
        "post.content",
        "post.image_url",
        "camera.id",
        "camera_model",
        "camera_year",
        "camera_brand"
      );
    res.status(200).json({ msg: "Found post succesfully", post });
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;
