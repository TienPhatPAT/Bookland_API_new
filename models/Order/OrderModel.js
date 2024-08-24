const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "transfer"],
      required: true,
    },
    note: { type: String },
    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sach", // Giả sử bạn đã có schema Book
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit_price: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DonHangModel = mongoose.model("Order", orderSchema);

module.exports = DonHangModel;
