const express = require("express");
const SachModel = require("../models/Sach/SachModel.js");

const routerSachDetail = express.Router();

routerSachDetail.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const sach = await SachModel.findById(id).populate("tacgia theloaisach");

    if (!sach) {
      return res
        .status(404)
        .json({ status: 0, message: "Không tìm thấy sách" });
    }

    res.json({ status: 1, data: sach });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin sách:", err);
    res.status(500).json({ status: 0, message: "Lỗi khi lấy thông tin sách" });
  }
});

module.exports = routerSachDetail;
