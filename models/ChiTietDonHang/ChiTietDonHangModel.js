const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChiTietDonHangSchema = new Schema({
  id_sach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sach",
    required: true,
  },
  id_donhang: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DonHang",
    required: true,
  },
  soluong: {
    type: Number,
    required: true,
  },
});

const ChiTietDonHangModel = mongoose.model(
  "ChiTietDonHang",
  ChiTietDonHangSchema
);

module.exports = ChiTietDonHangModel;
