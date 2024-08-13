const express = require("express");
const BaiVietModel = require("../models/BaiViet/BaiVietModel.js");
const NguoiDungModel = require("../models/NguoiDung/NguoiDungModel.js");

const routerBaiViet = express.Router();

// Lấy danh sách bài viết
routerBaiViet.get("/", async (req, res, next) => {
  try {
    const listBaiViet = await BaiVietModel.find().populate("nguoidung", "ten");
    res.json({ success: true, data: listBaiViet });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Lấy chi tiết bài viết theo ID
routerBaiViet.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const baiViet = await BaiVietModel.findById(id).populate(
      "nguoidung",
      "ten"
    );

    if (baiViet) {
      res.json({ success: true, data: baiViet });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài viết" });
    }
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết bài viết:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm bài viết mới
routerBaiViet.post("/", async (req, res) => {
  const {
    nguoidung,
    img,
    ngaycapnhat,
    ngaytao,
    mota,
    luotxem,
    noidung,
    tieude,
    trangthai,
  } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!nguoidung || !noidung || !tieude) {
    return res.status(400).json({
      success: false,
      message:
        "Các trường bắt buộc không được để trống: nguoidung, noidung, tieude",
    });
  }

  try {
    // Kiểm tra nguoidung có tồn tại không
    const nguoiDungExists = await NguoiDungModel.findById(nguoidung);
    if (!nguoiDungExists) {
      return res.status(400).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Kiểm tra bài viết đã tồn tại chưa
    const baiVietExists = await BaiVietModel.findOne({ tieude, nguoidung });
    if (baiVietExists) {
      return res.status(400).json({
        success: false,
        message: "Bài viết đã tồn tại",
      });
    }

    const newBaiViet = new BaiVietModel({
      nguoidung,
      img,
      ngaycapnhat: ngaycapnhat || Date.now(),
      ngaytao: ngaytao || Date.now(),
      mota,
      luotxem: luotxem || 0,
      noidung,
      tieude,
      trangthai: trangthai !== undefined ? trangthai : true,
    });

    await newBaiViet.save();
    res.json({
      success: true,
      message: "Thêm bài viết thành công",
      data: newBaiViet,
    });
  } catch (error) {
    console.error("Lỗi khi thêm bài viết:", error);
    res
      .status(500)
      .json({ success: false, message: "Đã xảy ra lỗi khi thêm bài viết" });
  }
});

// Sửa thông tin bài viết
routerBaiViet.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nguoidung,
      img,
      ngaycapnhat,
      ngaytao,
      mota,
      luotxem,
      noidung,
      tieude,
      trangthai,
    } = req.body;

    // Kiểm tra nguoidung có tồn tại không
    const nguoiDungExists = await NguoiDungModel.findById(nguoidung);
    if (!nguoiDungExists) {
      return res.status(400).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    const updatedBaiViet = await BaiVietModel.findByIdAndUpdate(
      id,
      {
        nguoidung,
        img,
        ngaycapnhat,
        ngaytao,
        mota,
        luotxem,
        noidung,
        tieude,
        trangthai,
      },
      { new: true }
    );

    if (updatedBaiViet) {
      res.json({
        success: true,
        message: "Sửa thông tin bài viết thành công",
        data: updatedBaiViet,
      });
    } else {
      res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy bài viết để sửa đổi",
        });
    }
  } catch (err) {
    console.error("Lỗi khi sửa bài viết:", err);
    res.status(500).json({ success: false, message: "Sửa bài viết thất bại" });
  }
});

// Xóa bài viết
routerBaiViet.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const baiViet = await BaiVietModel.findByIdAndDelete(id);

    if (baiViet) {
      res.json({ success: true, message: "Xóa bài viết thành công" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy bài viết để xóa" });
    }
  } catch (err) {
    console.error("Lỗi khi xóa bài viết:", err);
    res.status(500).json({ success: false, message: "Xóa bài viết thất bại" });
  }
});

module.exports = routerBaiViet;
