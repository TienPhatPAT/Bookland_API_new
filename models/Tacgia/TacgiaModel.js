const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SachModel = require("../Sach/SachModel.js");
const TacgiaSchema = new Schema({
  ten: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  tieusu: {
    type: String,
  },
  id_hienthi: {
    type: Boolean,
    default: true,
    required: true,
  },
});
TacgiaSchema.pre("remove", async function (next) {
  try {
    // Cập nhật tác giả của các sách thành null
    await SachModel.updateMany({ tacgia: this._id }, { tacgia: null });
    next();
  } catch (error) {
    next(error);
  }
});

const TacgiaModel = mongoose.model("Tacgia", TacgiaSchema);
module.exports = TacgiaModel;
