import { getUserDb } from "../../models/Post.js";

const admin = async (req, res, next) => {
  const userId = req.token.id;

  const user = await getUserDb(userId);

  if (!user.admin) {
    res.status(403).json({ msg: "Forbidden end point for user type" });
  } else {
    next();
  }
};

export default admin;
