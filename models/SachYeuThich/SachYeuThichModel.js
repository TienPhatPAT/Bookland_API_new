const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SachYeuThichSchema = new Schema({
  id_nguoidung: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "NguoiDung",
  },
  id_sach: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Sach",
  },
  ngaytao: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const SachYeuThichModel = mongoose.model("SachYeuThich", SachYeuThichSchema);

module.exports = SachYeuThichModel;
