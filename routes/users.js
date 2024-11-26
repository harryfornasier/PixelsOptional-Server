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
      const newUserTemp = await knex("user").insert({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        admin: false,
      });

      const newUser = await knex("user").where({ id: newUserTemp[0] }).first();

      res.status(201).json({ msg: `New User with id ${newUser.id} Created` });
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

      res.status(200).json({ authToken: token });
    });
  } catch (error) {
    res.status(400).json({ message: "User not found" });
  }
});

router.get("/profile", authorise, async (req, res) => {
  try {
    const user = await knex("user").where({ id: req.token.id }).first();

    res.json(user.id);
  } catch (error) {
    res.status(500).json({ message: "can't fetch user profile" });
  }
});

export default router;
