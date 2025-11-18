import * as User from "../data/user.js";
import jwt from "jsonwebtoken";

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const tokenString = parts[1];

    const decoded = jwt.verify(tokenString, "secret_key");

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return res.status(403).json({ message: "Access forbidden!" });
    }

    const user = User.getUserById(decoded.id);

    if (!user) {
      return res.status(403).json({ message: "Access denied!" });
    }

    req.userId = user.id;
    req.userEmail = user.email;

    next();

  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized!" });
  }
}

export default auth;
