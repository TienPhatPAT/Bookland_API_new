// models/LuotTimModel.js
const mongoose = require("mongoose");

const LuotTimSchema = new mongoose.Schema({
  id_baiviet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BaiViet",
    required: true,
  },
  id_nguoidung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NguoiDung",
    required: true,
  },
  ngaytao: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const LuotTimModel = mongoose.model("LuotTim", LuotTimSchema);

module.exports = LuotTimModel;
