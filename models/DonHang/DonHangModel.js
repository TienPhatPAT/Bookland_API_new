const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DonHangSchema = new Schema(
  {
    id_nguoidung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    diachi: {
      type: String,
      required: true,
    },
    sdt: {
      type: String,
      required: true,
    },
    nguoinhan: {
      type: String,
    },
    phuongthucthanhtoan: {
      type: Number,
      required: true,
      enum: [0, 1], // 0: tiền mặt, 1: ngân hàng
    },
    ghichu: {
      type: String,
    },
    ngaydathang: {
      type: Date,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3, 4], // 0: chờ duyệt, 1: đang giao hàng, 2: đã giao hàng, 3: hủy, 4: trả hàng
    },
    thanhtoan: {
      type: Number,
      required: true,
      enum: [0, 1], // 0: chưa thanh toán, 1: đã thanh toán
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
