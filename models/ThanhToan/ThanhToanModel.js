const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThanhToanSchema = new Schema({
  id_donhang: {
    type: Schema.Types.ObjectId,
    ref: "DonHang", // Liên kết với mô hình DonHang
    required: true,
  },
  phuongthucthanhtoan: {
    type: String,
    enum: [
      "Thẻ tín dụng",
      "Chuyển khoản ngân hàng",
      "Thanh toán khi nhận hàng",
    ],
    required: true,
  },
  trangthaithanhtoan: {
    type: String,
    enum: ["Chưa thanh toán", "Đang xử lý", "Hoàn tất", "Thất bại"],
    default: "Chưa thanh toán",
  },
  ngaythanhtoan: {
    type: Date,
    default: null,
  },
  sohoadon: {
    type: String,
    required: true,
  },
  tongtien: {
    type: Number,
    required: true,
  },
});

const ThanhToan = mongoose.model("ThanhToan", ThanhToanSchema);

module.exports = ThanhToan;
