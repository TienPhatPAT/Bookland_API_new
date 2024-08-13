const express = require("express");
const SachYeuThichModel = require("../models/SachYeuThich/SachYeuThichModel.js");

const routerSachYeuThich = express.Router();

routerSachYeuThich.post("/", async (req, res) => {
  try {
    const { id_nguoidung, id_sach } = req.body;

    const sachYeuThichExists = await SachYeuThichModel.findOne({
      id_nguoidung,
      id_sach,
    });
    if (sachYeuThichExists) {
      return res
        .status(400)
        .json({ status: 0, message: "Sách đã có trong danh sách yêu thích" });
    }

    const newSachYeuThich = new SachYeuThichModel({ id_nguoidung, id_sach });
    await newSachYeuThich.save();

    res.json({ status: 1, message: "Thêm sách yêu thích thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm sách yêu thích:", err);
    res
      .status(500)
      .json({ status: 0, message: "Thêm sách yêu thích thất bại" });
  }
});

routerSachYeuThich.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sachYeuThich = await SachYeuThichModel.findByIdAndDelete(id);

    if (sachYeuThich) {
      res.json({ status: 1, message: "Xóa sách yêu thích thành công" });
    } else {
      res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy sách yêu thích để xóa" });
    }
  } catch (err) {
    console.error("Lỗi khi xóa sách yêu thích:", err);
    res.status(500).json({ status: 0, message: "Xóa sách yêu thích thất bại" });
  }
});

routerSachYeuThich.get("/:id_nguoidung", async (req, res) => {
  try {
    const { id_nguoidung } = req.params;
    const listSachYeuThich = await SachYeuThichModel.find({ id_nguoidung })
      .populate("id_sach", "ten tacgia") // Populate thông tin sách
      .populate("id_nguoidung", "ten"); // Populate thông tin người dùng nếu cần

    res.json({ success: true, data: listSachYeuThich });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách yêu thích:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
  }
});

module.exports = routerSachYeuThich;
