import initKnex from "knex";
import knexConfig from "../knexfile.js";

const knex = initKnex(knexConfig);

import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  const postId = req.body.postId;
  const comment = {
    post_id: postId,
    user_id: req.body.userId,
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
    const comments = await knex("comment").where("post_id", postId);
    res.status(200).json({ msg: "Found the comments", comments });
  } catch (error) {
    res.status(404).json({ msg: `Could not find comments: ${error}` });
  }
});

export default router;
