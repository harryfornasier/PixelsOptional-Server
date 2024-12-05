import initKnex from "knex";
import knexConfig from "../knexfile.js";
const knex = initKnex(knexConfig);

const getCommentsDb = async (postId) => {
  const comments = await knex("comment")
    .leftJoin("user", "user.id", "comment.user_id")
    .where("post_id", postId)
    .select("comment.*", "user.name as user_name", "user.icon_url as icon_url");

  return comments;
};

const insertCommentDb = async (comment) => {
  const newComment = await knex("comment").insert(comment);
  return newComment;
};

const deleteCommentDb = async (commentId, userId) => {
  const commentDelete = await knex("comment")
    .where("comment.id", commentId)
    .where("comment.user_id", userId)
    .del();

  return commentDelete;
};

export { getCommentsDb, insertCommentDb, deleteCommentDb };
