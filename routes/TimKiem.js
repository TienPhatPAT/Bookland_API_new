const express = require("express");
const Fuse = require("fuse.js");
const diacritics = require("diacritics");
const mongoose = require("mongoose");
const routerTimKiem = express.Router();
const TimKiemModel = require("../models/TimKiem/TimKiemModel.js");
const Sach = require("../models/Sach/SachModel.js");
const Tacgia = require("../models/Tacgia/TacgiaModel.js");

// Hàm loại bỏ dấu
function removeDiacritics(text) {
  return diacritics.remove(text);
}

// Cấu hình Fuse.js cho việc tìm kiếm
const fuseOptions = {
  includeScore: true,
  threshold: 0.3,
  keys: ["tenNormalized"], // Tìm kiếm trên trường tên đã loại bỏ dấu
};

// Route tìm kiếm tổng hợp
routerTimKiem.get("/", async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp từ khóa tìm kiếm." });
    }

    // Loại bỏ dấu
    const normalizedText = removeDiacritics(text);

    // Lấy dữ liệu từ các bộ sưu tập
    const sach = await Sach.find({}).lean();
    const tacgia = await Tacgia.find({}).lean();

    // Tạo trường tên đã loại bỏ dấu cho sách và tác giả
    sach.forEach((book) => {
      book.tenNormalized = removeDiacritics(book.ten);
    });

    tacgia.forEach((author) => {
      author.tenNormalized = removeDiacritics(author.ten);
    });

    // Tạo Fuse instances
    const fusesach = new Fuse(sach, fuseOptions);
    const fusetacgia = new Fuse(tacgia, fuseOptions);

    // Tìm kiếm sách và tác giả
    const bookResults = fusesach.search(normalizedText);
    const authorResults = fusetacgia.search(normalizedText);

    // Chuẩn bị kết quả tìm kiếm
    const results = [];

    // Đẩy kết quả sách vào mảng kết quả
    bookResults.forEach((result) => {
      results.push({
        id: result.item._id,
        type: "sach",
        ten: result.item.ten,
        score: result.score, // Điểm tương đồng của Fuse.js
      });
    });

    // Đẩy kết quả tác giả vào mảng kết quả
    authorResults.forEach((result) => {
      results.push({
        id: result.item._id,
        type: "tacgia",
        ten: result.item.ten,
        score: result.score, // Điểm tương đồng của Fuse.js
      });
    });

    // Sắp xếp kết quả theo điểm số (score)
    results.sort((a, b) => a.score - b.score);

    // Đếm số lượng kết quả
    const count = results.length;

    if (count === 0) {
      return res.status(404).json({
        message: "Không tìm thấy kết quả phù hợp với từ khóa của bạn.",
      });
    }

    // Cập nhật hoặc tạo mới lịch sử tìm kiếm
    const searchRecord = await TimKiemModel.findOne({ text: normalizedText });

    if (searchRecord) {
      await TimKiemModel.findByIdAndUpdate(searchRecord._id, {
        $inc: { count: 1 },
      });
    } else {
      await TimKiemModel.create({
        id_timkiem: new mongoose.Types.ObjectId().toString(),
        text: normalizedText,
        count: 1,
      });
    }

    // Trả về kết quả tìm kiếm
    res.json({ count, results });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: error.message });
  }
});

routerTimKiem.get("/history", async (req, res) => {
  try {
    const searchHistory = await TimKiemModel.find({}).lean();
    res.json(searchHistory);
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = routerTimKiem;
