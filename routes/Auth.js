const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NguoiDungModel = require("../models/NguoiDung/NguoiDungModel.js");
const routerAuth = express.Router();
const nodemailer = require("nodemailer");
const authMiddleware = require("../config/authMiddleware.js");
const crypto = require("crypto");

routerAuth.post("/dangky", async (req, res) => {
  const { email, matkhau, ten } = req.body;
  const loaitaikhoan = 0;

  try {
    // Kiểm tra nếu email đã tồn tại
    const NguoiDungExist = await NguoiDungModel.findOne({ email });
    if (NguoiDungExist) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Tạo người dùng mới với mật khẩu chưa mã hóa
    const newUser = new NguoiDungModel({
      ten,
      email,
      matkhau, // Lưu mật khẩu trực tiếp, mã hóa sẽ được thực hiện trong pre-save hook
      loaitaikhoan,
    });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

routerAuth.post("/login", async (req, res) => {
  const { email, matkhau } = req.body;

  try {
    const NguoiDung = await NguoiDungModel.findOne({ email });
    if (!NguoiDung) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    // So sánh mật khẩu chưa mã hóa với mật khẩu mã hóa trong cơ sở dữ liệu
    const isMatch = await bcrypt.compare(matkhau, NguoiDung.matkhau);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Sinh token JWT
    const token = jwt.sign(
      { NguoiDungId: NguoiDung._id, loaitaikhoan: NguoiDung.loaitaikhoan },
      process.env.JWT_CODE,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Route lấy thông tin người dùng
routerAuth.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await NguoiDungModel.findById(req.user.NguoiDungId).select(
      "-matkhau"
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Thiết lập transporter cho nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Route quên mật khẩu
routerAuth.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await NguoiDungModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://${req.headers.host}/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Đặt lại mật khẩu",
      text:
        `Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.\n\n` +
        `Vui lòng nhấp vào liên kết sau, hoặc dán nó vào trình duyệt của bạn để hoàn tất quá trình:\n\n` +
        `${resetUrl}\n\n` +
        `Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này và mật khẩu của bạn sẽ không thay đổi.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({ message: "Không thể gửi email" });
      }
      res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route đặt lại mật khẩu
routerAuth.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { matkhau } = req.body;

  try {
    const user = await NguoiDungModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
      });
    }

    user.matkhau = await bcrypt.hash(matkhau, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = routerAuth;
