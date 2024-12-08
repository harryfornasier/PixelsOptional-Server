import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const authorise = (req, res, next) => {
  if (!req.headers.authorisation) {
    return res
      .status(401)
      .json({ message: "This route requires an authentication token" });
  }
  const token = req.headers.authorisation.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "The authentication token is invalid" });
    }
    req.token = decodedToken;
    next();
  });
};

export default authorise;
