const express = require("express");
const NguoiDungModel = require("../models/NguoiDung/NguoiDungModel.js");

const routerAdmin = express.Router();
routerAdmin.get("/", async function (req, res, next) {
  try {
    const listAdmins = await NguoiDungModel.find({ loaitaikhoan: 1 });
    res.json({ success: true, data: listAdmins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Lấy chi tiết admin theo ID
routerAdmin.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const admin = await NguoiDungModel.findById(id);

    if (admin && admin.loaitaikhoan === 1) {
      res.json({ success: true, data: admin });
    } else {
      res.status(404).json({
        success: false,
        message: "Admin không tồn tại hoặc không phải admin",
      });
    }
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết admin:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm admin
routerAdmin.post("/", async function (req, res, next) {
  try {
    const { ten, matkhau, email, gioitinh, avt, sdt, loaitaikhoan } = req.body;

    if (loaitaikhoan !== 1) {
      return res
        .status(400)
        .json({ status: 0, message: "Loại tài khoản phải là admin" });
    }

    const newAdmin = {
      ten,
      matkhau,
      email,
      gioitinh,
      avt,
      sdt,
      loaitaikhoan,
    };

    await NguoiDungModel.create(newAdmin);
    res.json({ status: 1, message: "Thêm admin thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm admin:", err);
    res.json({ status: 0, message: "Thêm admin thất bại" });
  }
});

// Sửa thông tin admin
routerAdmin.put("/:id", async function (req, res, next) {
  try {
    const { id_nguoidung, ten, email, matkhau } = req.body;
    const NguoiDung = await NguoiDungModel.findById(id_nguoidung);
    if (NguoiDung && NguoiDung.loaitaikhoan === 1) {
      await NguoiDungModel.findByIdAndUpdate(id_nguoidung, {
        ten,
        email,
        matkhau,
      });
      res.json({ status: 1, message: "Sửa admin thành công" });
    } else {
      res.status(404).json({
        status: 0,
        message: "Admin không tồn tại hoặc không phải admin",
      });
    }
  } catch (err) {
    res.json({ status: 0, message: "Sửa admin thất bại" });
  }
});

// Xóa admin
routerAdmin.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const NguoiDung = await NguoiDungModel.findById(id);

    if (!NguoiDung || NguoiDung.loaitaikhoan !== 1) {
      return res.status(404).json({
        status: false,
        message: "Admin không tồn tại hoặc không phải admin",
      });
    }

    await NguoiDungModel.deleteOne({ _id: id });
    res.json({ status: true, message: "Xóa admin thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa admin:", error);
    res.json({ status: false, message: "Xóa admin thất bại" });
  }
});

module.exports = routerAdmin;
