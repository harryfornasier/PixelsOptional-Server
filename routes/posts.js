import express from "express";
import authorise from "./middleware/auth.js";
const router = express.Router();

router.post("/", authorise, async function (req, res) {});

router.get("/", async (req, res) => {});

router.get("/:id", async (req, res) => {});

router.patch("/:id", authorise, async (req, res) => {});

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
