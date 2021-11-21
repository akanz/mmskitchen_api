const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (header !== undefined) {
    const bearer = header.split(" "),
      bearerToken = bearer[1];
    req.token = bearerToken;
  }
  const token = req.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, config.token_key);
    req.user = decoded;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token credentials" });
  }
  return next();
};

module.exports = verifyToken;
