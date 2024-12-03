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
}).single("image");

router.post("/", authorise, async function (req, res) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      res.status(413).json({ msg: "Image too large" });
    } else if (err) {
      res.status(500).json({ msg: "Unknown error" });
    } else {
      const newUuid = uuidv4();
      const path = `./images/${newUuid}.jpg`;
      const src = `https://harrisonfornasier.uk/static/${newUuid}.jpg`;

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
    }
  });
});

router.get("/", async (req, res) => {
  const offset = parseInt(req.query.page) * 21 - 21;
  const userId = req.query.userId;
  try {
    if (!userId) {
      const posts = await knex("camera")
        .join("post", "camera.id", "post.camera_id")
        .join("user", "user.id", "post.user_id")
        .leftJoin("post_like", "post.id", "post_like.post_id")
        .select(
          "camera.*",
          "post.*",
          "user.name",
          knex.raw("COUNT(post_like.post_id) as like_count")
        )
        .groupBy("camera.id", "post.id", "user.id")
        .limit(21)
        .offset(offset);
      res.status(200).json(posts);
    } else {
      const posts = await knex("camera")
        .orderBy("created_at", "desc")
        .join("post", "camera.id", "post.camera_id")
        .join("user", "user.id", "post.user_id")
        .leftJoin("post_like", "post.id", "post_like.post_id")
        .select(
          "camera.*",
          "post.*",
          "user.name",
          knex.raw("COUNT(post_like.post_id) as like_count"),
          knex.raw(`
      EXISTS (
        SELECT 1
        FROM post_like
        WHERE post_like.post_id = post.id
          AND post_like.user_id = ${userId}
      ) AS user_liked
    `)
        )
        .groupBy("camera.id", "post.id", "user.id")
        .limit(21)
        .offset(offset);
      res.status(200).json(posts);
    }
  } catch (error) {
    res.status(500).json({ mesesage: `Error fetching from database: ${error}` });
  }
});

router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await knex("post")
      .leftJoin("camera", "post.camera_id", "camera.id")
      .leftJoin("post_like", "post.id", "post_like.post_id")
      .select(
        "post.id as post_id",
        "post.created_at",
        "post.updated_at",
        "post.user_id",
        "post.title",
        "post.comment_count",
        "post.content",
        "post.image_url",
        "camera.id as camera_id",
        "camera_model as camera_model",
        "camera_year as camera_year",
        "camera_brand as camera_brand",
        knex.raw("COUNT(post_like.user_id) as like_count")
      )
      .where("post.id", postId)
      .groupBy(
        "post.id",
        "post.created_at",
        "post.updated_at",
        "post.user_id",
        "post.title",
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

router.patch("/:id", authorise, async (req, res) => {
  const postId = parseInt(req.params.id);
  const givingUserId = parseInt(req.token.id);
  const receivingUser = req.body.foreignUser;
  try {
    const alreadyLiked = await knex("post_like")
      .where({ user_id: givingUserId, post_id: postId })
      .first();

    if (alreadyLiked) {
      //undo
    } else {
      const givingUser = await knex("user").where("user.id", givingUserId).first();

      if (givingUser.pot < 1) {
        res.status(403).json({ msg: "You don't have enough likes in your pot" });
      } else if (givingUser.id === receivingUser) {
        res.status(403).json({ msg: "You can't like your own posts" });
      } else {
        const user = await knex("user").where("id", givingUserId).first();
        const post = await knex("post").where("id", postId).first();

        const like = await knex("post_like").insert({
          user_id: givingUserId,
          post_id: postId,
        });

        const givingUserDecrease = await knex("user")
          .increment("pot", -1)
          .where("user.id", givingUserId);

        res.status(200).json({ msg: "Liked the image" });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: "Unknown error", error });
  }
});

router.delete("/:id", authorise, async (req, res) => {
  const postId = req.params.id;
  try {
    const user = await knex("user").where("id", req.token.id).first();

    if (!user.admin) {
      res.status(403).json({ msg: "You're not allowed to delete posts" });
    } else {
      const deletePost = await knex("post").where("id", postId).del();
      res.status(204).json({ msg: "Deleted post" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Unknown error occured" + error });
  }
});

export default router;
