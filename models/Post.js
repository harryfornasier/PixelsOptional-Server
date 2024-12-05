import initKnex from "knex";
import knexConfig from "../knexfile.js";

const knex = initKnex(knexConfig);

export async function postImageDb(imageData) {
  const newPost = await knex("post").insert(imageData);
  return newPost;
}

export async function getPostsDb(userId, offset) {
  if (!userId) {
    const posts = await knex("post")
      .leftJoin("camera", "post.camera_id", "camera.id")
      .leftJoin("post_like", "post.id", "post_like.post_id")
      .leftJoin("comment", "post.id", "comment.post_id")
      .select(
        "post.id as post_id",
        "post.created_at",
        "post.updated_at",
        "post.user_id",
        "post.title",
        "post.comment_count",
        "post.content",
        "post.image_url",
        "post.orientation",
        "camera.id as camera_id",
        "camera.model as camera_model",
        "camera.year as camera_year",
        "camera.brand as camera_brand",
        knex.raw("COUNT(DISTINCT post_like.user_id) as like_count"),
        knex.raw("COUNT(DISTINCT comment.id) as comment_count")
      )
      .groupBy(
        "post.id",
        "post.created_at",
        "post.updated_at",
        "post.user_id",
        "post.title",
        "post.comment_count",
        "post.content",
        "post.image_url",
        "post.orientation",
        "camera.id",
        "camera.model",
        "camera.year",
        "camera.brand"
      )
      .limit(21)
      .offset(offset);
    return posts;
  } else {
    const posts = await knex("post")
      .leftJoin("camera", "post.camera_id", "camera.id")
      .leftJoin("post_like", "post.id", "post_like.post_id")
      .leftJoin("comment", "post.id", "comment.post_id")
      .select(
        "post.id as post_id",
        "post.created_at",
        "post.updated_at",
        "post.user_id",
        "post.title",
        "post.comment_count",
        "post.content",
        "post.image_url",
        "post.orientation",
        "camera.id as camera_id",
        "camera.model as camera_model",
        "camera.year as camera_year",
        "camera.brand as camera_brand",
        knex.raw("COUNT(DISTINCT post_like.user_id) as like_count"),
        knex.raw("COUNT(DISTINCT comment.id) as comment_count"),
        knex.raw(`
       EXISTS (
         SELECT 1
         FROM post_like
         WHERE post_like.post_id = post.id
           AND post_like.user_id = ${userId}
       ) AS user_liked
    `)
      )
      .groupBy(
        "post.id",
        "post.created_at",
        "post.updated_at",
        "post.user_id",
        "post.title",
        "post.comment_count",
        "post.content",
        "post.image_url",
        "post.orientation",
        "camera.id",
        "camera.model",
        "camera.year",
        "camera.brand"
      )
      .limit(21)
      .offset(offset);
    //   const posts = await knex("camera")
    //     .orderBy("created_at", "desc")
    //     .join("post", "camera.id", "post.camera_id")
    //     .join("user", "user.id", "post.user_id")
    //     .leftJoin("post_like", "post.id", "post_like.post_id")
    //     .leftJoin("comment", "post.id", "comment.post_id")
    //     .select(
    //       "camera.*",
    //       "post.*",
    //       "user.name",
    //       "user.icon_url",
    //       knex.raw("COUNT(post_like.post_id) as like_count"),
    //       knex.raw("COUNT(DISTINCT comment.id) as comment_count"),
    //       knex.raw(`
    //   EXISTS (
    //     SELECT 1
    //     FROM post_like
    //     WHERE post_like.post_id = post.id
    //       AND post_like.user_id = ${userId}
    //   ) AS user_liked
    // `)
    //     )
    //     .groupBy("camera.id", "post.id", "user.id")
    //     .limit(21)
    //     .offset(offset);
    return posts;
  }
}

export async function getPostByIdDb(postId) {
  const post = await knex("post")
    .leftJoin("camera", "post.camera_id", "camera.id")
    .leftJoin("post_like", "post.id", "post_like.post_id")
    .leftJoin("comment", "post.id", "comment.post_id")
    .select(
      "post.id as post_id",
      "post.created_at",
      "post.updated_at",
      "post.user_id",
      "post.title",
      "post.comment_count",
      "post.content",
      "post.image_url",
      "post.orientation",
      "camera.id as camera_id",
      "camera.model as camera_model",
      "camera.year as camera_year",
      "camera.brand as camera_brand",
      knex.raw("COUNT(DISTINCT post_like.user_id) as like_count"),
      knex.raw("COUNT(DISTINCT comment.id) as comment_count")
    )
    .where("post.id", postId)
    .groupBy(
      "post.id",
      "post.created_at",
      "post.updated_at",
      "post.user_id",
      "post.title",
      "post.comment_count",
      "post.content",
      "post.image_url",
      "post.orientation",
      "camera.id",
      "camera.model",
      "camera.year",
      "camera.brand"
    );
  return post;
}

export async function likePostDb(postId, givingUserId, receivingUser) {
  const like = await knex("post_like").insert({
    user_id: givingUserId,
    post_id: postId,
  });

  const receivingUserIncrease = await knex("user")
    .increment("pot", 1)
    .increment("likes", 1)
    .where("user.id", receivingUser);
  //
  const givingUserDecrease = await knex("user")
    .increment("pot", -1)
    .where("user.id", givingUserId);
}

export async function alreadyLikedDb(postId, givingUserId) {
  const alreadyLiked = await knex("post_like")
    .where({ user_id: givingUserId, post_id: postId })
    .first();
  return alreadyLiked;
}

export async function checkGivingUserDb(givingUserId, receivingUser) {
  const givingUser = await knex("user").where("user.id", givingUserId).first();

  if (givingUser.pot < 1) {
    return "insufficient likes";
  } else if (givingUser.id === receivingUser) {
    return "like own post";
  } else {
    return true;
  }
}

export async function deletePostDb(postId) {
  const user = await knex("user").where("id", req.token.id).first();
  return user;
}
