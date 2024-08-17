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

// Route tìm kiếm
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

    const sach = await Sach.find({}).lean();
    const tacgia = await Tacgia.find({}).lean();

    sach.forEach((book) => {
      book.tenNormalized = removeDiacritics(book.ten);
    });

    tacgia.forEach((author) => {
      author.tenNormalized = removeDiacritics(author.ten);
    });

    const fusesach = new Fuse(sach, {
      keys: ["tenNormalized"],
      includeScore: true,
      threshold: 0.3,
    });

    const fusetacgia = new Fuse(tacgia, {
      keys: ["tenNormalized"],
      includeScore: true,
      threshold: 0.3,
    });

    // Tìm kiếm sách
    const bookResults = fusesach
      .search(normalizedText)
      .map((result) => result.item);

    // Tìm kiếm tác giả
    const authorResults = fusetacgia
      .search(normalizedText)
      .map((result) => result.item);

    // Lấy id và tên sách
    const bookNames = bookResults.map((book) => ({
      id: book._id,
      ten: book.ten,
    }));

    // Lấy id và tên tác giả
    const authorNames = authorResults.map((author) => ({
      id: author._id,
      ten: author.ten,
    }));

    // Đếm số lượng kết quả
    const count = bookNames.length + authorNames.length;

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

    // Trả về id và tên sách và tác giả
    res.json({ count, sach: bookNames, tacgia: authorNames });
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
