const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DonHangSchema = new Schema(
  {
    id_nguoidung: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "NguoiDung",
    },
    diachi: {
      type: String,
      required: true,
    },
    sdt: {
      type: String,
      required: true,
    },
    gia: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      default: "30000",
    },
    tonggia: {
      type: Number,
      required: true,
    },

    nguoinhan: {
      type: String,
      required: true,
    },
    phuongthucthanhtoan: {
      type: String,
      required: true,
      enum: ["tiền mặt", "ngân hàng"],
    },
    ghichu: {
      type: String,
      default: "",
    },
    ngaydathang: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: ["chờ duyệt", "đã giao hàng", "hủy", "trả hàng"],
      default: "chờ duyệt",
    },
    chitietdonhangs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChiTietDonHang",
      },
    ], // Mảng chứa ID các chi tiết đơn hàng
  },
  {
    timestamps: true, // Tự động thêm các trường createdAt và updatedAt
  }
);

const DonHangModel = mongoose.model("DonHang", DonHangSchema);

module.exports = DonHangModel;
