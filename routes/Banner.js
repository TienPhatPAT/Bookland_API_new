const BannerModel = require("../models/Banner/BannerModel.js");
const express = require("express");

const routerBanner = express.Router();

// Thêm banner
routerBanner.post("/add", async (req, res) => {
  const { url, image, ngaybatdau, ngayketthuc, uutien, hien_thi } = req.body;
  try {
    const newBanner = new BannerModel({
      url,
      image,
      ngaybatdau,
      ngayketthuc,
      uutien,
      hien_thi,
    });
    await newBanner.save();
    res.json({ status: 1, message: "Thêm banner thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm sách:", err);
    res.status(500).json({ status: 0, message: "Thêm banner thất bại" });
  }
});

// Sửa banner
routerBanner.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { url, image, ngaybatdau, ngayketthuc, uutien, hien_thi } = req.body;
  try {
    const updatedBanner = await BannerModel.findByIdAndUpdate(
      id,
      {
        url,
        image,
        ngaybatdau,
        ngayketthuc,
        uutien,
        hien_thi,
      },
      { new: true }
    );
    res.status(200).json(updatedBanner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xóa banner
routerBanner.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await BannerModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Banner đã được xóa" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy danh sách banner
routerBanner.get("/list", async (req, res) => {
  const currentDate = new Date();
  try {
    const banners = await BannerModel.find({
      ngaybatdau: { $lte: currentDate },
      ngayketthuc: { $gte: currentDate },
      hien_thi: true,
    });
    res.status(200).json(banners);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get banner by id
routerBanner.get("/list/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await BannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner không tồn tại" });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = routerBanner;
