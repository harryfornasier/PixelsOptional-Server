import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import multer from "multer";
import {
  getPostByIdDb,
  postImageDb,
  getPostsDb,
  deletePostDb,
  likePostDb,
  alreadyLikedDb,
  checkGivingUserDb,
  getUserDb,
  removeLike,
} from "../models/Post.js";

const BASE_URL = process.env.BASE_URL;

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

export async function postImage(req, res) {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      res.status(413).json({ msg: "Image too large" });
    } else if (err) {
      res.status(500).json({ msg: "Unknown error" });
    } else {
      const newUuid = uuidv4();
      let landscape = false;
      const path = `./images/${newUuid}.jpg`;
      const src = `${BASE_URL}/static/${newUuid}.jpg`;

      try {
        const image = await sharp(req.file.buffer)
          .keepMetadata()
          .jpeg({
            quality: 85,
            chromaSubsampling: "4:4:4",
          })
          .toFile(path);

        if (image.height > image.width) {
          landscape = false;
        } else {
          landscape = true;
        }
        const imageData = {
          user_id: req.token.id,
          title: req.body.title,
          content: "",
          image_url: src,
          camera_id: req.body.camera_id,
          orientation: landscape,
        };

        if (!req.body.title) {
          res.status(400).json({ msg: "No title included" });
        } else {
          const newPost = await postImageDb(imageData);
          res.status(201).send({ msg: "Image uploaded succesfully", newPost });
        }
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    }
  });
}

export async function getPosts(req, res) {
  const offset = parseInt(req.query.page) * 21 - 21;
  const userId = req.query.userId;

  try {
    const posts = await getPostsDb(userId, offset);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ mesesage: `Error fetching from database: ${error}` });
  }
}

export async function getPostById(req, res) {
  const postId = req.params.id;

  if (isNaN(postId) || postId < 1) {
    res.status(400).json({ msg: "Letter or negative in url path" });
  } else {
    try {
      const post = await getPostByIdDb(postId);

      if (!post.length) {
        res.status(404).json({ msg: "Post not found" });
      } else {
        res.status(200).json({ msg: "Found post succesfully", post });
      }
    } catch (error) {
      res.status(404).send(error);
    }
  }
}

export async function likePost(req, res) {
  const postId = parseInt(req.params.id);
  const givingUserId = parseInt(req.token.id);
  const receivingUser = req.body.foreignUser;
  try {
    if (await alreadyLikedDb(postId, givingUserId)) {
      removeLike(givingUserId, receivingUser, postId);
      res.status(204).json({ msg: "Remove like" });
    } else if (
      (await checkGivingUserDb(givingUserId, receivingUser)) === "insufficient likes"
    ) {
      res.status(403).json({ msg: "You don't have enough likes in your pot" });
    } else if (
      (await checkGivingUserDb(givingUserId, receivingUser)) === "like own post"
    ) {
      res.status(403).json({ msg: "You can't like your own posts" });
    } else {
      await likePostDb(postId, givingUserId, receivingUser);
      res.status(204).json({ msg: "Liked the image" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Unknown error", error });
  }
}

export async function deletePost(req, res) {
  const postId = req.params.id;
  const userId = req.token.id;

  const user = await getUserDb(userId);

  if (!user.admin) {
    res.status(403).json({ msg: "You're not allowed to delete posts" });
  } else {
    await deletePostDb(postId);
    res.status(204).json({ msg: "Deleted post" });
  }
}
