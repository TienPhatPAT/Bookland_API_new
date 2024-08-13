const express = require("express");
const TheLoaiSachModel = require("../models/Theloai/TheLoaiSachModel.js");
const ChiTietTheLoaiSachModel = require("../models/Theloai/ChiTietTheLoaiSachModel.js");
const SachModel = require("../models/Sach/SachModel.js");

const routerTheLoaiDetail = express.Router();

routerTheLoaiDetail.get("/:id_theloai", async (req, res, next) => {
  try {
    const { id_theloai } = req.params;

    // Tìm thể loại sách
    const theLoai = await TheLoaiSachModel.findById(id_theloai);
    if (!theLoai) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thể loại" });
    }

    // Tìm chi tiết các sách thuộc thể loại này
    const theLoaiSachDetails = await ChiTietTheLoaiSachModel.find({
      id_theloai,
    });
    const sachIds = theLoaiSachDetails.map((detail) => detail.id_sach);

    // Tìm danh sách các sách dựa trên các id đã lấy
    const sachList = await SachModel.find({ _id: { $in: sachIds } });

    res.json({ success: true, theLoai, sachList });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết thể loại sách:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

module.exports = routerTheLoaiDetail;
