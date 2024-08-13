const express = require("express");
const NguoiDungModel = require("../models/NguoiDung/NguoiDungModel.js");
const authMiddleware = require("../config/authMiddleware.js");
const adminMiddleware = require("../config/adminMiddleware.js");

const routerNguoiDung = express.Router();

// Lấy danh sách người dùng bình thường
routerNguoiDung.get("/", async function (req, res, next) {
  try {
    const listNguoiDungs = await NguoiDungModel.find({ loaitaikhoan: 0 });
    res.json({ success: true, data: listNguoiDungs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Lấy thông tin một người dùng theo ID
routerNguoiDung.get("/:id", async function (req, res, next) {
  const { id } = req.params;

  try {
    const nguoiDung = await NguoiDungModel.findById(id);

    if (!nguoiDung || nguoiDung.loaitaikhoan !== 0) {
      return res.status(404).json({
        status: 0,
        message:
          "Người dùng không tồn tại hoặc không phải người dùng bình thường",
      });
    }

    res.json({ success: true, data: nguoiDung });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm người dùng bình thường
routerNguoiDung.post(
  "/",
  authMiddleware,
  adminMiddleware,
  async function (req, res, next) {
    try {
      const { ten, matkhau, email, gioitinh, avt, sdt, loaitaikhoan } =
        req.body;

      if (loaitaikhoan !== 0) {
        return res
          .status(400)
          .json({ status: 0, message: "Loại tài khoản phải là người dùng" });
      }

      const newNguoiDung = {
        ten,
        matkhau,
        email,
        gioitinh,
        avt,
        sdt,
        loaitaikhoan,
      };

      await NguoiDungModel.create(newNguoiDung);
      res.json({ status: 1, message: "Thêm người dùng thành công" });
    } catch (err) {
      console.error("Lỗi khi thêm người dùng:", err);
      res.json({ status: 0, message: "Thêm người dùng thất bại" });
    }
  }
);

// Sửa thông tin người dùng bình thường
routerNguoiDung.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async function (req, res, next) {
    try {
      const { id } = req.params;
      const { ten, email, matkhau } = req.body;

      const NguoiDung = await NguoiDungModel.findById(id);
      if (NguoiDung && NguoiDung.loaitaikhoan === 0) {
        await NguoiDungModel.findByIdAndUpdate(id, { ten, email, matkhau });
        res.json({ status: 1, message: "Sửa người dùng thành công" });
      } else {
        res.status(404).json({
          status: 0,
          message:
            "Người dùng không tồn tại hoặc không phải người dùng bình thường",
        });
      }
    } catch (err) {
      console.error(err);
      res.json({ status: 0, message: "Sửa người dùng thất bại" });
    }
  }
);

// Xóa người dùng bình thường
routerNguoiDung.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async function (req, res, next) {
    try {
      const { id } = req.params;
      const NguoiDung = await NguoiDungModel.findById(id);

      if (!NguoiDung || NguoiDung.loaitaikhoan !== 0) {
        return res.status(404).json({
          status: false,
          message:
            "Người dùng không tồn tại hoặc không phải người dùng bình thường",
        });
      }

      await NguoiDungModel.deleteOne({ _id: id });
      res.json({ status: true, message: "Xóa người dùng thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      res.json({ status: false, message: "Xóa người dùng thất bại" });
    }
  }
);

module.exports = routerNguoiDung;
