const express = require("express");
const mongoose = require("mongoose");
const LuotTimModel = require("../models/LuọtTim/LuotTim.js");

const routerLuotTim = express.Router();

// Lấy danh sách lượt tim
routerLuotTim.get("/baiviet/:id_baiviet", async (req, res) => {
  const { id_baiviet } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id_baiviet)) {
    return res
      .status(400)
      .json({ success: false, message: "ID bài viết không hợp lệ" });
  }

  try {
    const likes = await LuotTimModel.find({ id_baiviet })
      .populate("id_nguoidung", "ten")
      .exec();

    res.json({ success: true, data: likes });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lượt tim:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

routerLuotTim.post("/", async (req, res) => {
  const { id_baiviet, id_nguoidung } = req.body;

  try {
    const existingLike = await LuotTimModel.findOne({
      id_baiviet,
      id_nguoidung,
    });

    if (existingLike) {
      // Nếu đã tồn tại, xóa lượt tim
      await LuotTimModel.findByIdAndDelete(existingLike._id);
      return res.json({ success: true, message: "Đã bỏ lượt tim" });
    } else {
      // Nếu không tồn tại, thêm lượt tim mới
      const newLike = new LuotTimModel({
        id_luottim: new mongoose.Types.ObjectId().toString(),
        id_baiviet,
        id_nguoidung,
        ngaytao: new Date(),
      });

      await newLike.save();
      return res.json({ success: true, message: "Đã thêm lượt tim" });
    }
  } catch (error) {
    console.error("Lỗi khi thêm/bỏ lượt tim:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Xóa lượt tim (nếu cần)
// routerLuotTim.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedLike = await LuotTimModel.findByIdAndDelete(id);

//     if (!deletedLike) {
//       return res.status(404).json({
//         success: false,
//         message: "Không tìm thấy lượt tim để xóa",
//       });
//     }

//     res.json({ success: true, message: "Xóa lượt tim thành công" });
//   } catch (error) {
//     console.error("Lỗi khi xóa lượt tim:", error);
//     res.status(500).json({ success: false, message: "Xóa lượt tim thất bại" });
//   }
// });

module.exports = routerLuotTim;
