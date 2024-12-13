import "dotenv/config";
import initKnex from "knex";
import knexConfig from "../knexfile.js";
const knex = initKnex(knexConfig);
import express from "express";
const router = express.Router();

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import authorise from "./middleware/auth.js";
import { getUserDb, registerUserDb } from "../models/User.js";

const SALT_ROUNDS = 8;

router.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS, async (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Encryption Failed" });
    }

    try {
      const checkUser = await getUserDb(req.body.email);

      if (!checkUser.length) {
        const user = {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          icon_url: "https://harrisonfornasier.uk/icons/foreman-gui-icon.png",
          likes: 0,
          pot: 100,
          admin: false,
        };
        await registerUserDb(user);
        res.status(201).json({ msg: `New User Created` });
      } else {
        res.status(409).json({ msg: "Account already exisits, try logging in" });
      }
    } catch (error) {
      res.status(500).json({ msg: `Couldn't create user 😱: ${error.message}` });
    }
  });
});

router.post("/login", async (req, res) => {
  try {
    const user = await getUserDb(req.body.email);

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
      .join("post", "post.camera_id", "camera.id")
      .where("post.user_id", req.token.id)
      .join("user", "user.id", "post.user_id")
      .select(
        "camera.id as camera_id",
        "camera.year as camera_year",
        "camera.model as camera_model",
        "camera.brand as camera_brand",
        "post.*",
        "user.name"
      );

    delete user.password;

    res.status(200).json({ user: user, posts: posts });
  } catch (error) {
    res.status(500).json({ message: "can't fetch user profile" });
  }
});

router.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await knex("user")
      .join("user_camera", "user.id", "user_camera.user_id")
      .join("camera", "user_camera.camera_id", "camera.id")
      .where({ "user.id": userId })
      .select(
        "user.*",
        "camera.id as camera_id",
        "camera.year as camera_year",
        "camera.model as camera_model",
        "camera.brand as camera_brand"
      )
      .first();
    const posts = await knex("camera")
      .join("post", "post.camera_id", "camera.id")
      .where("post.user_id", userId)
      .join("user", "user.id", "post.user_id")
      .leftJoin("post_like", "post.id", "post_like.post_id")
      .select(
        "camera.id as camera_id",
        "camera.year as camera_year",
        "camera.model as camera_model",
        "camera.brand as camera_brand",
        "post.*",
        "user.name",
        "user.icon_url",
        knex.raw("COUNT(post_like.post_id) as like_count")
      )
      .groupBy("camera.id", "post.id", "user.id");

    delete user.password;
    delete user.email;
    delete user.pot;
    delete user.admin;
    res.status(200).json({ user: user, posts: posts });
  } catch (error) {
    res.status(404).json({ msg: `Could not find user: ${error}` });
  }
});

router.patch("/profile/:id", authorise, async (req, res) => {
  const url = req.body.iconUrl;
  try {
    const user = await knex("user")
      .update({ icon_url: url.icon })
      .where("user.id", req.token.id);

    res.status(200).json({ msg: "Successfully changes icon", user });
  } catch (error) {
    res.status(404).json({ msg: `Could not find user: ${error}` });
  }
});

export default router;
