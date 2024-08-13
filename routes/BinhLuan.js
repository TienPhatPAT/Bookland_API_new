const express = require("express");
const BinhLuanModel = require("../models/BinhLuan/BinhLuanModel.js");
const BaiVietModel = require("../models/BaiViet/BaiVietModel.js");
const NguoiDungModel = require("../models/NguoiDung/NguoiDungModel.js");

const routerBinhLuan = express.Router();

// Lấy danh sách bình luận
routerBinhLuan.get("/", async (req, res, next) => {
  try {
    const listBinhLuan = await BinhLuanModel.find()
      .populate("id_baiviet", "tieude")
      .populate("id_nguoidung", "ten");

    res.json({ success: true, data: listBinhLuan });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bình luận:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Lấy chi tiết bình luận theo ID
routerBinhLuan.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const binhLuan = await BinhLuanModel.findById(id)
      .populate("id_baiviet", "tieude")
      .populate("id_nguoidung", "ten");

    if (binhLuan) {
      res.json({ success: true, data: binhLuan });
    } else {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy bình luận",
      });
    }
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết bình luận:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm bình luận mới
routerBinhLuan.post("/", async (req, res, next) => {
  try {
    const { id_baiviet, id_nguoidung, noidung, hienthi } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!id_baiviet || !id_nguoidung || !noidung) {
      return res.status(400).json({
        success: false,
        message:
          "Các trường bắt buộc không được để trống: id_baiviet, id_nguoidung, noidung",
      });
    }

    // Kiểm tra bài viết có tồn tại không
    const baiVietExists = await BaiVietModel.findById(id_baiviet);
    if (!baiVietExists) {
      return res.status(400).json({
        success: false,
        message: "Bài viết không tồn tại",
      });
    }

    // Kiểm tra người dùng có tồn tại không
    const nguoiDungExists = await NguoiDungModel.findById(id_nguoidung);
    if (!nguoiDungExists) {
      return res.status(400).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    const newBinhLuan = new BinhLuanModel({
      id_baiviet,
      id_nguoidung,
      noidung,
      hienthi,
    });

    await newBinhLuan.save();

    res.json({ status: 1, message: "Thêm bình luận thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm bình luận:", err);
    res.status(500).json({ status: 0, message: "Thêm bình luận thất bại" });
  }
});

// Sửa thông tin bình luận
routerBinhLuan.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_baiviet, id_nguoidung, noidung, hienthi } = req.body;

    // Kiểm tra bình luận tồn tại
    const binhLuanExists = await BinhLuanModel.findById(id);
    if (!binhLuanExists) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bình luận để sửa đổi",
      });
    }

    // Kiểm tra theo thể loại bài viết
    const theLoaiExists = await BaiVietModel.findById(id_baiviet);
    if (!theLoaiExists) {
      return res.status(400).json({
        success: false,
        message: "Thể loại bài viết không tồn tại",
      });
    }

    // Kiểm tra người dùng
    const nguoiDungExists = await NguoiDungModel.findById(id_nguoidung);
    if (!nguoiDungExists) {
      return res.status(400).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    const updatedBinhLuan = await BinhLuanModel.findByIdAndUpdate(
      id,
      {
        id_baiviet,
        id_nguoidung,
        noidung,
        hienthi,
      },
      { new: true }
    );

    if (updatedBinhLuan) {
      res.json({
        status: 1,
        message: "Sửa thông tin bình luận thành công",
        data: updatedBinhLuan,
      });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy bình luận để sửa đổi" });
    }
  } catch (err) {
    console.error("Lỗi khi sửa bình luận:", err);
    res.status(500).json({ status: 0, message: "Sửa bình luận thất bại" });
  }
});

// Xóa bình luận
routerBinhLuan.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const binhLuan = await BinhLuanModel.findByIdAndDelete(id);

    if (binhLuan) {
      res.json({ status: 1, message: "Xóa bình luận thành công" });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy bình luận để xóa" });
    }
  } catch (err) {
    console.error("Lỗi khi xóa bình luận:", err);
    res.status(500).json({ status: 0, message: "Xóa bình luận thất bại" });
  }
});

module.exports = routerBinhLuan;
