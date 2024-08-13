const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, từ chối truy cập" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authMiddleware;
