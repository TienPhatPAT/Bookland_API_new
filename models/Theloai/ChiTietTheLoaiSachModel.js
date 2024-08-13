const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ChiTietTheLoaiSachSchema = new Schema({
  id_theloai: {
    type: Schema.Types.ObjectId,
    ref: "TheLoai",
    required: true,
  },
  id_sach: {
    type: Schema.Types.ObjectId,
    ref: "Sach",
    required: true,
  },
});

const ChiTietTheLoaiSachModel =
  mongoose.models.ChiTietTheLoaiSach ||
  model("ChiTietTheLoaiSach", ChiTietTheLoaiSachSchema);

module.exports = ChiTietTheLoaiSachModel;
