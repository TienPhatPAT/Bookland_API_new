const express = require("express");
const mongoose = require("mongoose");
const ChiTietDonHangModel = require("../models/ChiTietDonHang/ChiTietDonHangModel.js");

const routerChiTietDonHang = express.Router();

// Lấy chi tiết đơn hàng theo id đơn hàng
routerChiTietDonHang.get("/:id_donhang", async (req, res) => {
  const { id_donhang } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id_donhang)) {
    return res
      .status(400)
      .json({ success: false, message: "ID đơn hàng không hợp lệ" });
  }

  try {
    const details = await ChiTietDonHangModel.find({ id_donhang })
      .populate("id_sach", "ten")
      .exec();

    if (!details || details.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy chi tiết đơn hàng" });
    }

    res.json({ success: true, data: details });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm chi tiết đơn hàng mới
routerChiTietDonHang.post("/add", async (req, res) => {
  const { id_sach, id_donhang, soluong, gia } = req.body;

  try {
    const newDetail = new ChiTietDonHangModel({
      id_sach,
      id_donhang,
      gia,
      soluong,
    });

    await newDetail.save();

    res.json({ success: true, message: "Thêm chi tiết đơn hàng thành công" });
  } catch (error) {
    console.error("Lỗi khi thêm chi tiết đơn hàng:", error);
    res
      .status(500)
      .json({ success: false, message: "Thêm chi tiết đơn hàng thất bại" });
  }
});

// Xóa chi tiết đơn hàng
routerChiTietDonHang.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDetail = await ChiTietDonHangModel.findByIdAndDelete(id);

    if (!deletedDetail) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy chi tiết đơn hàng để xóa",
      });
    }

    res.json({ success: true, message: "Xóa chi tiết đơn hàng thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa chi tiết đơn hàng:", error);
    res
      .status(500)
      .json({ success: false, message: "Xóa chi tiết đơn hàng thất bại" });
  }
});

module.exports = routerChiTietDonHang;
