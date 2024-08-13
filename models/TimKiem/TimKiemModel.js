const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimKiemSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const TimKiemModel = mongoose.model("TimKiem", TimKiemSchema);

module.exports = TimKiemModel;
