const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChiTietDonHangSchema = new Schema({
  id_sach: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sach",
      required: true,
    },
  ],
  id_donhang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DonHang",
    required: true,
  },
  soluong: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["chờ duyệt", "đã giao hàng", "hủy", "trả hàng"],
    default: "chờ duyệt",
  },
  thanhtoan: {
    type: String,
    required: true,
    enum: ["chưa thanh toán", "đã thanh toán"],
  },
  ngaytao: {
    type: Date,
    default: Date.now,
  },
});

const ChiTietDonHangModel = mongoose.model(
  "ChiTietDonHang",
  ChiTietDonHangSchema
);

module.exports = ChiTietDonHangModel;
