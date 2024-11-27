import initKnex from "knex";
import knexConfig from "../knexfile.js";

const knex = initKnex(knexConfig);

import express from "express";
import authorise from "./middleware/auth.js";
const router = express.Router();

router.post("/", authorise, async (req, res) => {
  const postId = req.body.postId;
  const comment = {
    post_id: postId,
    user_id: req.token.id,
    comment: req.body.comment,
  };
  try {
    const updateCount = await knex("post")
      .increment("comment_count", 1)
      .where("post.id", postId);
    const newComment = await knex("comment").insert(comment);
    res.status(201).json({ msg: "comment uploaded succesfully", newComment });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const comments = await knex("comment")
      .leftJoin("user", "user.id", "comment.user_id")
      .where("post_id", postId)
      .select("comment.*", "user.name as user_name");

    console.log(comments);

    if (!comments.length) {
      res.status(204).json({ msg: "No comments for this post" });
    } else {
      res.status(200).json({ msg: "Found the comments", comments });
    }
  } catch (error) {
    res.status(404).json({ msg: `Could not find comments: ${error}` });
  }
});

export default router;
