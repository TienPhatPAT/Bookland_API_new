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
routerTimKiem.get("/search", async (req, res) => {
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
      includeScore: true, // Bao gồm điểm số tìm kiếm trong kết quả
      threshold: 0.3, // Ngưỡng độ tương đồng
    });

    
    const fusetacgia = new Fuse(tacgia, {
      keys: ["tenNormalized"], 
      includeScore: true, // Bao gồm điểm số tìm kiếm trong kết quả
      threshold: 0.3, // Ngưỡng độ tương đồng
    });

    // Tìm kiếm sách
    const bookResults = fusesach
      .search(normalizedText)
      .map((result) => result.item);
    // Tìm kiếm tác giả
    const authorResults = fusetacgia
      .search(normalizedText)
      .map((result) => result.item);

    //lấy tên sách và tên tác giả 
    const bookNames = bookResults.map((book) => ({ ten: book.ten }));
    const authorNames = authorResults.map((author) => ({ ten: author.ten }));

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
      // Nếu đã tồn tại, cập nhật count
      await TimKiemModel.findByIdAndUpdate(searchRecord._id, {
        $inc: { count: 1 },
      });
    } else {
      // Nếu không tồn tại, tạo mới với count là 1
      await TimKiemModel.create({
        id_timkiem: new mongoose.Types.ObjectId().toString(),
        text: normalizedText,
        count: 1,
      });
    }

    // Trả về tên sách và tên tác giả
    res.json({ count, sach: bookNames, tacgia: authorNames });
  } catch (error) {
    console.error("Lỗi:", error); // In lỗi để kiểm tra
    res.status(500).json({ message: error.message });
  }
});
routerTimKiem.get("/search/history", async (req, res) => {
  try {
    const searchHistory = await TimKiemModel.find({}).lean();
    res.json(searchHistory);
  } catch (error) {
    console.error("Lỗi:", error); // In lỗi để kiểm tra
    res.status(500).json({ message: error.message });
  }
});

module.exports = routerTimKiem;
