const express = require("express");
const DonHangModel = require("../models/DonHang/DonHangModel");
const ChiTietDonHangModel = require("../models/ChiTietDonHang/ChiTietDonHangModel");
const routerDonHang = express.Router();

// API Để Thêm Đơn Hàng
routerDonHang.post("/", async (req, res) => {
  try {
    const {
      id_nguoidung,
      diachi,
      sdt,
      nguoinhan,
      phuongthucthanhtoan,
      ghichu,
      ngaydathang,
      status,
      thanhtoan,
      chitietdonhangs, // Dữ liệu chi tiết đơn hàng gửi kèm
    } = req.body;

    // Tạo đơn hàng mới
    const newDonHang = new DonHangModel({
      id_nguoidung,
      diachi,
      sdt,
      nguoinhan,
      phuongthucthanhtoan,
      ghichu,
      ngaydathang,
      status,
      thanhtoan,
      chitietdonhangs, // Thêm ID chi tiết đơn hàng
    });

    await newDonHang.save();

    // Cập nhật chi tiết đơn hàng để liên kết với đơn hàng mới
    await ChiTietDonHangModel.updateMany(
      { _id: { $in: chitietdonhangs } },
      { $set: { id_donhang: newDonHang._id } }
    );

    res.json({ status: 1, message: "Thêm đơn hàng thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm đơn hàng:", err);
    res.status(500).json({ status: 0, message: "Thêm đơn hàng thất bại" });
  }
});

// API Để Lấy Thông Tin Đơn Hàng
routerDonHang.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const donHang = await DonHangModel.findById(id)
      .populate("id_nguoidung", "ten") // Ví dụ: Lấy tên người dùng
      .populate({
        path: "chitietdonhangs",
        populate: {
          path: "id_sach", // Lấy thông tin sách từ chi tiết đơn hàng
          select: "ten gia", // Ví dụ: Chỉ lấy tên và giá sách
        },
      });

    if (!donHang) {
      return res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy đơn hàng" });
    }

    res.json({ success: true, data: donHang });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
  }
});

// API Để Cập Nhật Đơn Hàng
routerDonHang.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      diachi,
      sdt,
      nguoinhan,
      phuongthucthanhtoan,
      ghichu,
      ngaydathang,
      status,
      thanhtoan,
      chitietdonhangs, // Dữ liệu chi tiết đơn hàng gửi kèm
    } = req.body;

    // Cập nhật thông tin đơn hàng
    const updatedDonHang = await DonHangModel.findByIdAndUpdate(
      id,
      {
        diachi,
        sdt,
        nguoinhan,
        phuongthucthanhtoan,
        ghichu,
        ngaydathang,
        status,
        thanhtoan,
        chitietdonhangs, // Cập nhật ID chi tiết đơn hàng
      },
      { new: true }
    );

    if (updatedDonHang) {
      // Cập nhật chi tiết đơn hàng để liên kết với đơn hàng
      await ChiTietDonHangModel.updateMany(
        { _id: { $in: chitietdonhangs } },
        { $set: { id_donhang: updatedDonHang._id } }
      );

      res.json({
        status: 1,
        message: "Cập nhật đơn hàng thành công",
        data: updatedDonHang,
      });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy đơn hàng để cập nhật" });
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật đơn hàng:", err);
    res.status(500).json({ status: 0, message: "Cập nhật đơn hàng thất bại" });
  }
});

// API Để Xóa Đơn Hàng
routerDonHang.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const donHang = await DonHangModel.findByIdAndDelete(id);

    if (donHang) {
      // Xóa các chi tiết đơn hàng liên quan
      await ChiTietDonHangModel.deleteMany({ id_donhang: id });

      res.json({ status: 1, message: "Xóa đơn hàng thành công" });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy đơn hàng để xóa" });
    }
  } catch (err) {
    console.error("Lỗi khi xóa đơn hàng:", err);
    res.status(500).json({ status: 0, message: "Xóa đơn hàng thất bại" });
  }
});

module.exports = routerDonHang;
