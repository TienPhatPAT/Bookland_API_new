const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SachSchema = new Schema({
  ten: {
    type: String,
    required: true,
  },
  tacgia: {
    type: Schema.Types.ObjectId,
    ref: "Tacgia",
    default: null,
  },
  img: {
    type: String,
  },
  mota: {
    type: String,
  },
  ngayxuatban: {
    type: Date,
  },
  ngaytao: {
    type: Date,
    default: Date.now,
  },
  gia: {
    type: Number,
  },
  nguoimua: {
    type: Number,
    default: 0,
  },
  hinhanh: {
    type: String,
  },
  ngonngu: {
    type: String,
  },
  theloaisach: [
    {
      type: Schema.Types.ObjectId,
      ref: "TheLoaiSach",
    },
  ],
});

const SachModel = mongoose.model("Sach", SachSchema);
module.exports = SachModel;
