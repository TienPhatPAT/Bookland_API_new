const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BinhLuanSchema = new Schema({
  id_baiviet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "BaiViet",
  },
  id_nguoidung: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "NguoiDung",
  },
  noidung: {
    type: String,
    required: true,
  },
  thoigiantao: {
    type: Date,
    required: true,
    default: Date.now,
  },
  hienthi: {
    type: Boolean,
    default: true,
  },
});

const BinhLuanModel = mongoose.model("BinhLuan", BinhLuanSchema);

module.exports = BinhLuanModel;
