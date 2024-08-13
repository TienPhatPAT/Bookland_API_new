const express = require("express");
const ChiTietTheLoaiSachModel = require("../models/Theloai/ChiTietTheLoaiSachModel.js");
const TheLoaiSachModel = require("../models/Theloai/TheLoaiSachModel.js");
const SachModel = require("../models/Sach/SachModel.js");

const routerChiTietTheLoaiSach = express.Router();

// Lấy danh sách sách theo thể loại
routerChiTietTheLoaiSach.get("/list/:id_theloai", async (req, res, next) => {
  try {
    const { id_theloai } = req.params;

    // Kiểm tra xem thể loại có tồn tại hay không
    const theLoai = await TheLoaiSachModel.findById(id_theloai);
    if (!theLoai) {
      return res.status(404).json({
        success: false,
        message: "Thể loại không tồn tại",
      });
    }

    // Tìm tất cả các sách thuộc thể loại
    const listSachTheoTheLoai = await ChiTietTheLoaiSachModel.find({
      id_theloai,
    }).populate({
      path: "id_sach",
      populate: [
        { path: "tacgia", select: "ten" },
        { path: "theloai", select: "ten" },
      ],
    });

    if (!listSachTheoTheLoai.length) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sách thuộc thể loại này",
      });
    }

    res.json({ success: true, data: listSachTheoTheLoai });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách theo thể loại:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
  }
});
module.exports = routerChiTietTheLoaiSach;
