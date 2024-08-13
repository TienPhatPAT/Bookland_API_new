const adminMiddleware = (req, res, next) => {
  if (req.user.loaitaikhoan !== 1) {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền thực hiện hành động này" });
  }
  next();
};

module.exports = adminMiddleware;
