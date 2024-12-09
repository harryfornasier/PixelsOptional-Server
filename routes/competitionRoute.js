import express from "express";
import authorise from "./middleware/auth.js";

router.post("/", [authorise, admin]);
