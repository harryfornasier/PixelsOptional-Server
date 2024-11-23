import initKnex from "knex";
import knexConfig from "../knexfile.js";
import router from "./images.js";

const knex = initKnex(knexConfig);

router.post("/", async (req, res) => {
  const comment = {
    post_id: req.body.postId,
    user_id: req.body.userId,
    comment: req.body.comment,
  };
  try {
    console.log(comment);
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
  } catch (error) {}
});

export default router;
