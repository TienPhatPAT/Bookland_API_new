// const express = require("express");
// const DonHangModel = require("../models/DonHang/DonHangModel");
// const ChiTietDonHangModel = require("../models/ChiTietDonHang/ChiTietDonHangModel");
// const NguoiDungModel = require("../models/NguoiDung/NguoiDungModel");
// const routerDonHang = express.Router();

// // API Để Thêm Đơn Hàng
// routerDonHang.post("/", async (req, res) => {
//   try {
//     const {
//       id_nguoidung,
//       diachi,
//       sdt,
//       gia,
//       shipping,
//       tonggia,
//       nguoinhan,
//       phuongthucthanhtoan,
//       ghichu,
//       ngaydathang,
//       status,
//       chitietdonhangs, // Dữ liệu chi tiết đơn hàng gửi kèm
//     } = req.body;

//     // Tạo đơn hàng mới
//     const newDonHang = new DonHangModel({
//       id_nguoidung,
//       diachi,
//       sdt,
//       gia,
//       shipping,
//       tonggia,
//       nguoinhan,
//       phuongthucthanhtoan,
//       ghichu,
//       ngaydathang,
//       status,
//       chitietdonhangs, // Thêm ID chi tiết đơn hàng
//     });

//     await newDonHang.save();

//     // Cập nhật chi tiết đơn hàng để liên kết với đơn hàng mới
//     await ChiTietDonHangModel.updateMany(
//       { _id: { $in: chitietdonhangs } },
//       { $set: { id_donhang: newDonHang._id } }
//     );

//     res.json({ status: 1, message: "Thêm đơn hàng thành công" });
//   } catch (err) {
//     console.error("Lỗi khi thêm đơn hàng:", err);
//     res.status(500).json({ status: 0, message: "Thêm đơn hàng thất bại" });
//   }
// });

// // API Để Lấy Tất Cả Đơn Hàng
// routerDonHang.get("/", async (req, res) => {
//   try {
//     const donHangs = await DonHangModel.find()
//       .populate("id_nguoidung", "ten")
//       .populate({
//         path: "chitietdonhangs",
//         populate: {
//           path: "id_sach",
//           select: "ten gia",
//         },
//       });

//     res.json({ success: true, data: donHangs });
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách đơn hàng:", error);
//     res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
//   }
// });

// // API Để Lấy Thông Tin Đơn Hàng
// routerDonHang.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const donHang = await DonHangModel.findById(id)
//       .populate("id_nguoidung", "ten") // Ví dụ: Lấy tên người dùng
//       .populate({
//         path: "chitietdonhangs",
//         populate: {
//           path: "id_sach", // Lấy thông tin sách từ chi tiết đơn hàng
//           select: "ten gia", // Ví dụ: Chỉ lấy tên và giá sách
//         },
//       });

//     if (!donHang) {
//       return res
//         .status(404)
//         .json({ status: 0, message: "Không tìm thấy đơn hàng" });
//     }

//     res.json({ success: true, data: donHang });
//   } catch (error) {
//     console.error("Lỗi khi lấy thông tin đơn hàng:", error);
//     res.status(500).json({ success: false, message: "Đã xảy ra lỗi máy chủ" });
//   }
// });

// // API Để Cập Nhật Đơn Hàng
// routerDonHang.post("/", async (req, res) => {
//   try {
//     const {
//       id_nguoidung,
//       diachi,
//       sdt,
//       gia,
//       shipping,
//       tonggia,
//       nguoinhan,
//       phuongthucthanhtoan,
//       ghichu,
//       ngaydathang,
//       status,
//       chitietdonhangs,
//     } = req.body;

//     // Kiểm tra tính hợp lệ của dữ liệu
//     if (
//       !id_nguoidung ||
//       !diachi ||
//       !sdt ||
//       !gia ||
//       !tonggia ||
//       !nguoinhan ||
//       !phuongthucthanhtoan ||
//       !status
//     ) {
//       return res
//         .status(400)
//         .json({ status: 0, message: "Dữ liệu không đầy đủ" });
//     }

//     // Tạo đơn hàng mới
//     const newDonHang = new DonHangModel({
//       id_nguoidung,
//       diachi,
//       sdt,
//       gia,
//       shipping,
//       tonggia,
//       nguoinhan,
//       phuongthucthanhtoan,
//       ghichu,
//       ngaydathang,
//       status,
//       chitietdonhangs,
//     });

//     await newDonHang.save();

//     // Cập nhật chi tiết đơn hàng để liên kết với đơn hàng mới
//     if (chitietdonhangs && chitietdonhangs.length > 0) {
//       await ChiTietDonHangModel.updateMany(
//         { _id: { $in: chitietdonhangs } },
//         { $set: { id_donhang: newDonHang._id } }
//       );
//     }

//     res.json({ status: 1, message: "Thêm đơn hàng thành công" });
//   } catch (err) {
//     console.error("Lỗi khi thêm đơn hàng:", err);

//     // Kiểm tra loại lỗi và trả về thông báo cụ thể
//     if (err.name === "ValidationError") {
//       return res
//         .status(400)
//         .json({
//           status: 0,
//           message: "Dữ liệu không hợp lệ",
//           errors: err.errors,
//         });
//     }

//     if (err.name === "CastError") {
//       return res.status(400).json({ status: 0, message: "ID không hợp lệ" });
//     }

//     res.status(500).json({ status: 0, message: "Thêm đơn hàng thất bại" });
//   }
// });

// // API Để Xóa Đơn Hàng
// routerDonHang.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const donHang = await DonHangModel.findByIdAndDelete(id);

//     if (donHang) {
//       // Xóa các chi tiết đơn hàng liên quan
//       await ChiTietDonHangModel.deleteMany({ id_donhang: id });

//       res.json({ status: 1, message: "Xóa đơn hàng thành công" });
//     } else {
//       res
//         .status(404)
//         .json({ status: 0, message: "Không tìm thấy đơn hàng để xóa" });
//     }
//   } catch (err) {
//     console.error("Lỗi khi xóa đơn hàng:", err);
//     res.status(500).json({ status: 0, message: "Xóa đơn hàng thất bại" });
//   }
// });

// module.exports = routerDonHang;
