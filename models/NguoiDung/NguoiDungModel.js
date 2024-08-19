const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
const moment = require("moment");

function formatPhone(value) {
  if (typeof value === "string") {
    value = parseInt(value);
  }
  if (value.toString().length === 9) {
    return "0" + value;
  }
  return value;
}

function formatDate(date) {
  return moment(date).format("DD/MM/YYYY");
}

const NguoiDungSchema = new Schema({
  loaitaikhoan: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  // 0 - Người dùng
  // 1 - Admin
  matkhau: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  ten: {
    type: String,
  },
  gioitinh: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  // 0 - Nam
  // 1 - Nữ
  avt: {
    type: String,
  },
  ngaysinh: {
    type: Date,
    get: formatDate, // Định dạng ngày tháng trước khi trả về
  },
  sdt: {
    type: String,
    set: formatPhone,
  },
  ngaytao: {
    type: Date,
    default: Date.now,
    get: formatDate, // Định dạng ngày tháng trước khi trả về
  },
  id_gmail: {
    type: String,
  },
  id_facebook: {
    type: String,
  },
  id_hienthi: {
    type: Boolean,
    default: true,
    required: true,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

NguoiDungSchema.pre("save", async function (next) {
  if (!this.isModified("matkhau")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.matkhau = await bcrypt.hash(this.matkhau, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const NguoiDungModel = mongoose.model("NguoiDung", NguoiDungSchema);

module.exports = NguoiDungModel;
