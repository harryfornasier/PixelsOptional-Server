import "dotenv/config";
import initKnex from "knex";
import knexConfig from "../knexfile.js";
const knex = initKnex(knexConfig);
import express from "express";
const router = express.Router();

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import authorise from "./middleware/auth.js";

const SALT_ROUNDS = 8;

router.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS, async (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Encryption Failed" });
    }

    try {
      const checkUser = await knex("user").where("user.email", req.body.email);

      if (checkUser.length) {
        res.status(409).json({ msg: "Account already exisits, try logging in" });
      } else {
        const newUserTemp = await knex("user").insert({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          likes: 0,
          pot: 100,
          admin: false,
        });

        res.status(201).json({ msg: `New User with id ${newUserTemp.id} Created` });
      }
    } catch (error) {
      res.status(500).json({ msg: `Couldn't create user 😱: ${error.message}` });
    }
  });
});

router.post("/login", async (req, res) => {
  try {
    const user = await knex("user").where({ email: req.body.email }).first();

    bcrypt.compare(req.body.password, user.password, function (_, success) {
      if (!success) {
        return res.status(403).json({ message: "Username/Password is wrong" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          sub: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.status(200).json({ authToken: token, id: user.id, admin: user.admin });
    });
  } catch (error) {
    res.status(400).json({ message: "User not found" });
  }
});

router.get("/profile", authorise, async (req, res) => {
  try {
    const user = await knex("user").where({ id: req.token.id }).first();
    const posts = await knex("camera")
      .join("post", "camera.id", "post.camera_id")
      .where("post.user_id", req.token.id)
      .join("user", "user.id", "post.user_id")
      .select("camera.*", "post.*", "user.name");

    delete user.password;

    res.status(200).json({ user: user, posts: posts });
  } catch (error) {
    res.status(500).json({ message: "can't fetch user profile" });
  }
});

router.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await knex("user").where({ id: userId }).first();
    const posts = await knex("camera")
      .join("post", "camera.id", "post.camera_id")
      .where("post.user_id", userId)
      .join("user", "user.id", "post.user_id")
      .select("camera.*", "post.*", "user.name");

    delete user.password;
    res.status(200).json({ user: user.name, posts: posts });
  } catch (error) {
    res.status(404).json({ msg: `Could not find user: ${error}` });
  }
});

router.patch("/profile/:id", authorise, async (req, res) => {
  const userId = req.params.id;
  const url = req.body.iconUrl;
  console.log(userId);
  console.log(url);

  try {
    const user = await knex("user")
      .update({ icon_url: url.icon })
      .where("user.id", userId);

    res.status(200).json({ msg: "Successfully changes icon", user });
  } catch (error) {
    res.status(404).json({ msg: `Could not find user: ${error}` });
  }
});

export default router;
