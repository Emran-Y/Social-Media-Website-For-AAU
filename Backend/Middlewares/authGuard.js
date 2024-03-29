const jwt = require("jsonwebtoken");
const { User } = require("../Models/user");

const authGuard = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findOne({ _id: decoded.userId }).select(
        "-password"
      );
      next();
    } catch (error) {
      res.status(401).json({ message: "Not Authorized, token failed" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Not Authorized, token failed" });
  }
};

module.exports = authGuard;
