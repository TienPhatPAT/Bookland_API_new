const express = require("express");
const BannerModel = require("../models/Banner/BannerModel.js");

const routerBanner = express.Router();

// Lấy danh sách tất cả các banner
routerBanner.get("/", async (req, res) => {
  try {
    const banners = await BannerModel.find();
    res.json({ success: true, data: banners });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách banner:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Lấy thông tin một banner theo ID
routerBanner.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await BannerModel.findById(id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner không tồn tại" });
    }
    res.json({ success: true, data: banner });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin banner:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm mới một banner
routerBanner.post("/", async (req, res) => {
  try {
    const { url, image, ngaybatdau, ngayketthuc, uutien, hien_thi } = req.body;

    const newBanner = new BannerModel({
      url,
      image,
      ngaybatdau,
      ngayketthuc,
      uutien,
      hien_thi,
    });

    await newBanner.save();
    res.json({
      success: true,
      message: "Thêm banner thành công",
      data: newBanner,
    });
  } catch (error) {
    console.error("Lỗi khi thêm banner:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Sửa thông tin một banner
routerBanner.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { url, image, luotclick, ngaybatdau, ngayketthuc, uutien, hien_thi } =
    req.body;

  try {
    const updatedBanner = await BannerModel.findByIdAndUpdate(
      id,
      { url, image, luotclick, ngaybatdau, ngayketthuc, uutien, hien_thi },
      { new: true }
    );

    if (!updatedBanner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner không tồn tại" });
    }

    res.json({
      success: true,
      message: "Sửa banner thành công",
      data: updatedBanner,
    });
  } catch (error) {
    console.error("Lỗi khi sửa banner:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Xóa một banner
routerBanner.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBanner = await BannerModel.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner không tồn tại" });
    }

    res.json({ success: true, message: "Xóa banner thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa banner:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

module.exports = routerBanner;
