const TacgiaModel = require("../models/Tacgia/TacgiaModel.js");
const express = require("express");

const routerTacgia = express.Router();

// Lấy danh sách tác giả
routerTacgia.get("/", async function (req, res, next) {
  try {
    const listTacgia = await TacgiaModel.find({});
    res.json({ success: true, data: listTacgia });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tác giả:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Lấy thông tin tác giả theo ID
routerTacgia.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const tacgia = await TacgiaModel.findById(id);

    if (!tacgia) {
      return res.status(404).json({ message: "Không tìm thấy tác giả" });
    }

    res.json({ success: true, data: tacgia });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tác giả:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm tác giả
routerTacgia.post("/", async function (req, res, next) {
  try {
    const { ten, img, tieusu, id_hienthi } = req.body;
    const existingTacgia = await TacgiaModel.findOne({ ten });
    if (existingTacgia) {
      return res.status(400).json({
        status: 0,
        message: "Tác giả đã tồn tại",
      });
    }

    const newTacgia = new TacgiaModel({
      ten,
      img,
      tieusu,
      id_hienthi,
    });
    await newTacgia.save();

    res.json({
      status: 1,
      message: "Thêm tác giả thành công",
      data: newTacgia,
    });
  } catch (err) {
    console.error("Error adding author:", err);
    res.json({
      status: 0,
      message: "Thêm tác giả thất bại",
      error: err.message,
    });
  }
});

// Sửa tác giả
routerTacgia.put("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const { ten, img, tieusu, id_hienthi } = req.body;

    const updatedTacgia = await TacgiaModel.findByIdAndUpdate(
      id,
      {
        ten,
        img,
        tieusu,
        id_hienthi,
      },
      { new: true }
    );

    if (!updatedTacgia) {
      return res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy tác giả" });
    }

    res.json({
      status: 1,
      message: "Sửa tác giả thành công",
      data: updatedTacgia,
    });
  } catch (err) {
    console.error("Error updating author:", err);
    res.json({ status: 0, message: "Sửa tác giả thất bại" });
  }
});

// Xóa tác giả
routerTacgia.delete("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    const deletedTacgia = await TacgiaModel.findByIdAndDelete(id);

    if (!deletedTacgia) {
      return res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy tác giả" });
    }

    res.json({ status: 1, message: "Xóa tác giả thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa tác giả:", error);
    res.json({ status: 0, message: "Xóa tác giả thất bại" });
  }
});

module.exports = routerTacgia;
