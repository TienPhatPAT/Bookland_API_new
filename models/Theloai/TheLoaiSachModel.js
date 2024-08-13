const mongoose = require("mongoose");
const SachModel = require("../Sach/SachModel.js");
const { Schema, model, models } = mongoose;

const TheLoaiSachSchema = new Schema({
  ten: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  hienthi: {
    type: Boolean,
    default: true,
  },
});
TheLoaiSachSchema.pre("remove", async function (next) {
  try {
    // Xóa thể loại trong sách tương ứng
    await SachModel.updateMany(
      { theloai: this._id },
      { $pull: { theloai: this._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const TheLoaiSachModel =
  models.TheLoaiSach || model("TheLoaiSach", TheLoaiSachSchema);

module.exports = TheLoaiSachModel;
