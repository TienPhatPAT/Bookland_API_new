const express = require("express");
const TheLoaiSachModel = require("../models/Theloai/TheLoaiSachModel.js");
const SachModel = require("../models/Sach/SachModel.js"); // Điều chỉnh đường dẫn tới model Sach

const routerTheLoaiSach = express.Router();

// Lấy danh sách thể loại sách
routerTheLoaiSach.get("/", async (req, res, next) => {
  try {
    const listTheLoai = await TheLoaiSachModel.find();
    res.json({ success: true, data: listTheLoai });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thể loại sách:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
  }
});

// Lấy thông tin một thể loại sách theo ID
routerTheLoaiSach.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const theLoai = await TheLoaiSachModel.findById(id);

    if (!theLoai) {
      return res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy thể loại sách" });
    }

    res.json({ success: true, data: theLoai });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thể loại sách:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
  }
});

// Thêm thể loại sách mới
routerTheLoaiSach.post("/", async (req, res, next) => {
  try {
    const { ten, img, hienthi } = req.body;

    if (!ten || !img) {
      return res.status(400).json({
        status: 0,
        message: "Tên và ảnh của thể loại sách là bắt buộc",
      });
    }

    const newTheLoai = new TheLoaiSachModel({ ten, img, hienthi });
    await newTheLoai.save();

    res.json({ status: 1, message: "Thêm thể loại sách thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm thể loại sách:", err);
    res.status(500).json({ status: 0, message: "Thêm thể loại sách thất bại" });
  }
});

// Sửa thông tin thể loại sách
routerTheLoaiSach.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten, img, hienthi } = req.body;

    const updatedTheLoai = await TheLoaiSachModel.findByIdAndUpdate(
      id,
      { ten, img, hienthi },
      { new: true }
    );

    if (updatedTheLoai) {
      res.json({
        status: 1,
        message: "Sửa thông tin thể loại sách thành công",
        data: updatedTheLoai,
      });
    } else {
      res.status(404).json({
        status: 0,
        message: "Không tìm thấy thể loại sách để sửa đổi",
      });
    }
  } catch (err) {
    console.error("Lỗi khi sửa thông tin thể loại sách:", err);
    res
      .status(500)
      .json({ status: 0, message: "Sửa thông tin thể loại sách thất bại" });
  }
});

// Xóa thể loại sách
routerTheLoaiSach.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const theLoai = await TheLoaiSachModel.findById(id);

    if (!theLoai) {
      return res.status(404).json({
        status: 0,
        message: "Không tìm thấy thể loại sách để xóa",
      });
    }

    // Xóa các thể loại liên quan trong sách
    await SachModel.updateMany({ theloai: id }, { $pull: { theloai: id } });

    // Sử dụng deleteOne để xóa thể loại sách
    await TheLoaiSachModel.deleteOne({ _id: id });

    res.json({ status: 1, message: "Xóa thể loại sách thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa thể loại sách:", err);
    res.status(500).json({ status: 0, message: "Xóa thể loại sách thất bại" });
  }
});

module.exports = routerTheLoaiSach;
