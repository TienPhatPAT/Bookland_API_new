const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BaiVietSchema = new Schema({
  theloaibaiviet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TheLoaiBaiViet",
    required: true,
  },
  nguoidung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NguoiDung",
    required: true,
  },
  img: {
    type: String,
  },
  ngaycapnhat: {
    type: Date,
    required: true,
  },
  ngaytao: {
    type: Date,
    required: true,
  },
  mota: {
    type: String,
  },
  luotxem: {
    type: Number,
    default: 0,
  },
  noidung: {
    type: String,
    required: true,
  },
  tieude: {
    type: String,
    required: true,
  },
  trangthai: {
    type: Boolean,
    default: true,
  },
});

const BaiVietModel = mongoose.model("BaiViet", BaiVietSchema);

module.exports = BaiVietModel;
