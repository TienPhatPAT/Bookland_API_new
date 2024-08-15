const express = require("express");
const routerThanhToan = express.Router();
const ThanhToan = require("../models/ThanhToan/ThanhToanModel");

// Tạo mới một bản ghi thanh toán
routerThanhToan.post("/", async (req, res) => {
  try {
    const { id_donhang, phuongthucthanhtoan, sohoadon, tongtien } = req.body;

    const thanhToanMoi = new ThanhToan({
      id_donhang,
      phuongthucthanhtoan,
      sohoadon,
      tongtien,
    });

    await thanhToanMoi.save();
    res.status(201).json({
      status: true,
      message: "Tạo thanh toán thành công",
      data: thanhToanMoi,
    });
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán:", error);
    res.status(500).json({
      status: false,
      message: "Tạo thanh toán thất bại. Vui lòng thử lại.",
    });
  }
});

// Lấy thông tin thanh toán theo ID
routerThanhToan.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const thanhToan = await ThanhToan.findById(id).populate("id_donhang");

    if (!thanhToan) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy thông tin thanh toán",
      });
    }

    res.json({
      status: true,
      data: thanhToan,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin thanh toán:", error);
    res.status(500).json({
      status: false,
      message: "Lấy thông tin thanh toán thất bại. Vui lòng thử lại.",
    });
  }
});

// Cập nhật thông tin thanh toán
routerThanhToan.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      phuongthucthanhtoan,
      trangthaithanhtoan,
      ngaythanhtoan,
      sohoadon,
      tongtien,
    } = req.body;

    const thanhToanCapNhat = await ThanhToan.findByIdAndUpdate(
      id,
      {
        phuongthucthanhtoan,
        trangthaithanhtoan,
        ngaythanhtoan,
        sohoadon,
        tongtien,
      },
      { new: true }
    );

    if (!thanhToanCapNhat) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy thông tin thanh toán",
      });
    }

    res.json({
      status: true,
      message: "Cập nhật thông tin thanh toán thành công",
      data: thanhToanCapNhat,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin thanh toán:", error);
    res.status(500).json({
      status: false,
      message: "Cập nhật thông tin thanh toán thất bại. Vui lòng thử lại.",
    });
  }
});

// Xóa thanh toán
routerThanhToan.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const thanhToan = await ThanhToan.findByIdAndDelete(id);

    if (!thanhToan) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy thông tin thanh toán để xóa",
      });
    }

    res.json({
      status: true,
      message: "Xóa thông tin thanh toán thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa thông tin thanh toán:", error);
    res.status(500).json({
      status: false,
      message: "Xóa thông tin thanh toán thất bại. Vui lòng thử lại.",
    });
  }
});

module.exports = routerThanhToan;
