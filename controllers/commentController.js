import { getCommentsDb, deleteCommentDb, insertCommentDb } from "../models/Comment.js";

export async function getComments(req, res) {
  const postId = req.params.id;
  try {
    const comments = await getCommentsDb(postId);
    if (!comments.length) {
      res.status(204).json({ msg: "No comments for this post" });
    } else {
      res.status(200).json({ msg: "Found the comments", comments });
    }
  } catch (error) {
    res.status(404).json({ msg: `Could not find comments: ${error}` });
  }
}

export async function deleteComment(req, res) {
  const userId = req.token.id;
  const commentId = req.body.commentId;
  try {
    const commentDelete = await deleteCommentDb(commentId, userId);
    res.status(204).json({ msg: "Comment deleted", commentDelete });
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function insertComment(req, res) {
  const postId = req.body.postId;
  const comment = {
    post_id: postId,
    user_id: req.token.id,
    comment: req.body.comment,
  };
  try {
    if (!req.body.comment) {
      res.status(400).json({ msg: "User tried to upload an empty comment" });
    } else {
      const newComment = await insertCommentDb(comment);
      res.status(201).json({ msg: "comment uploaded succesfully", newComment });
    }
  } catch (error) {
    res.status(400).send(error);
  }
}
