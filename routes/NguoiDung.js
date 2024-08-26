// const express = require("express");
// const NguoiDungModel = require("../models/NguoiDung/NguoiDungModel.js");
// const authMiddleware = require("../config/authMiddleware.js");
// const adminMiddleware = require("../config/adminMiddleware.js");

// const routerNguoiDung = express.Router();

// // Lấy danh sách người dùng bình thường
// routerNguoiDung.get("/", async function (req, res, next) {
//   try {
//     const listNguoiDungs = await NguoiDungModel.find({ loaitaikhoan: 0 });
//     res.json({ success: true, data: listNguoiDungs });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
//   }
// });

// // Lấy thông tin một người dùng theo ID
// routerNguoiDung.get("/:id", async function (req, res, next) {
//   const { id } = req.params;

//   try {
//     const nguoiDung = await NguoiDungModel.findById(id);

//     if (!nguoiDung || nguoiDung.loaitaikhoan !== 0) {
//       return res.status(404).json({
//         status: 0,
//         message:
//           "Người dùng không tồn tại hoặc không phải người dùng bình thường",
//       });
//     }

//     res.json({ success: true, data: nguoiDung });
//   } catch (error) {
//     console.error("Lỗi khi lấy thông tin người dùng:", error);
//     res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
//   }
// });

// // Thêm người dùng bình thường
// routerNguoiDung.post(
//   "/",
//   authMiddleware,
//   adminMiddleware,
//   async function (req, res, next) {
//     try {
//       const { ten, matkhau, email, gioitinh, avt, sdt, loaitaikhoan } =
//         req.body;

//       if (loaitaikhoan !== 0) {
//         return res
//           .status(400)
//           .json({ status: 0, message: "Loại tài khoản phải là người dùng" });
//       }

//       const newNguoiDung = {
//         ten,
//         matkhau,
//         email,
//         gioitinh,
//         avt,
//         sdt,
//         loaitaikhoan,
//       };

//       await NguoiDungModel.create(newNguoiDung);
//       res.json({ status: 1, message: "Thêm người dùng thành công" });
//     } catch (err) {
//       console.error("Lỗi khi thêm người dùng:", err);
//       res.json({ status: 0, message: "Thêm người dùng thất bại" });
//     }
//   }
// );

// // Sửa thông tin người dùng bình thường
// routerNguoiDung.put(
//   "/:id",
//   authMiddleware,
//   adminMiddleware,
//   async function (req, res, next) {
//     try {
//       const { id } = req.params;
//       const { ten, email, matkhau } = req.body;

//       const NguoiDung = await NguoiDungModel.findById(id);
//       if (NguoiDung && NguoiDung.loaitaikhoan === 0) {
//         await NguoiDungModel.findByIdAndUpdate(id, { ten, email, matkhau });
//         res.json({ status: 1, message: "Sửa người dùng thành công" });
//       } else {
//         res.status(404).json({
//           status: 0,
//           message:
//             "Người dùng không tồn tại hoặc không phải người dùng bình thường",
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       res.json({ status: 0, message: "Sửa người dùng thất bại" });
//     }
//   }
// );

// // Xóa người dùng bình thường
// routerNguoiDung.delete(
//   "/:id",
//   authMiddleware,
//   adminMiddleware,
//   async function (req, res, next) {
//     try {
//       const { id } = req.params;
//       const NguoiDung = await NguoiDungModel.findById(id);

//       if (!NguoiDung || NguoiDung.loaitaikhoan !== 0) {
//         return res.status(404).json({
//           status: false,
//           message:
//             "Người dùng không tồn tại hoặc không phải người dùng bình thường",
//         });
//       }

//       await NguoiDungModel.deleteOne({ _id: id });
//       res.json({ status: true, message: "Xóa người dùng thành công" });
//     } catch (error) {
//       console.error("Lỗi khi xóa người dùng:", error);
//       res.json({ status: false, message: "Xóa người dùng thất bại" });
//     }
//   }
// );

// module.exports = routerNguoiDung;

const express = require("express");
const NguoiDungModel = require("../models/NguoiDung/NguoiDungModel.js");
const adminMiddleware = require("../config/adminMiddleware.js");
const bcrypt = require("bcrypt");
const routerNguoiDung = express.Router();

// Lấy danh sách người dùng bình thường
routerNguoiDung.get("/", async function (req, res, next) {
  try {
    const listNguoiDungs = await NguoiDungModel.find({ loaitaikhoan: 0 });
    res.json({ success: true, data: listNguoiDungs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Lấy thông tin một người dùng theo ID
routerNguoiDung.get("/:id", async function (req, res, next) {
  const { id } = req.params;

  try {
    const nguoiDung = await NguoiDungModel.findById(id);

    if (!nguoiDung || nguoiDung.loaitaikhoan !== 0) {
      return res.status(404).json({
        status: 0,
        message:
          "Người dùng không tồn tại hoặc không phải người dùng bình thường",
      });
    }

    res.json({ success: true, data: nguoiDung });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
});

// Thêm người dùng bình thường
routerNguoiDung.post("/", async function (req, res, next) {
  try {
    const { ten, matkhau, email, gioitinh, avt, sdt, loaitaikhoan } = req.body;

    if (loaitaikhoan !== 0) {
      return res
        .status(400)
        .json({ status: 0, message: "Loại tài khoản phải là người dùng" });
    }

    const newNguoiDung = {
      ten,
      matkhau,
      email,
      gioitinh,
      avt,
      sdt,
      loaitaikhoan,
    };

    await NguoiDungModel.create(newNguoiDung);
    res.json({ status: 1, message: "Thêm người dùng thành công" });
  } catch (err) {
    console.error("Lỗi khi thêm người dùng:", err);
    res.json({ status: 0, message: "Thêm người dùng thất bại" });
  }
});

// Sửa thông tin người dùng bình thường
routerNguoiDung.put("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const { ten, email, matkhau } = req.body;

    // Tìm người dùng theo ID
    const NguoiDung = await NguoiDungModel.findById(id);

    if (NguoiDung && NguoiDung.loaitaikhoan === 0) {
      let updatedFields = { ten, email };

      if (matkhau) {
        console.log("Mật khẩu trước khi mã hóa:", matkhau); // In ra mật khẩu trước khi mã hóa
        const hashedPassword = await bcrypt.hash(matkhau, 10);
        console.log("Mật khẩu sau khi mã hóa:", hashedPassword); // In ra mật khẩu sau khi mã hóa
        updatedFields.matkhau = hashedPassword;
      }

      await NguoiDungModel.findByIdAndUpdate(id, updatedFields);
      res.json({ status: 1, message: "Sửa người dùng thành công" });
    } else {
      res.status(404).json({
        status: 0,
        message:
          "Người dùng không tồn tại hoặc không phải người dùng bình thường",
      });
    }
  } catch (err) {
    console.error(err);
    res.json({ status: 0, message: "Sửa người dùng thất bại" });
  }
});

// Xóa người dùng bình thường
routerNguoiDung.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm người dùng theo ID
    const nguoiDung = await NguoiDungModel.findById(id);

    // Kiểm tra xem người dùng có tồn tại và là người dùng bình thường không
    if (!nguoiDung || nguoiDung.loaitaikhoan !== 0) {
      return res.status(404).json({
        status: false,
        message:
          "Người dùng không tồn tại hoặc không phải là người dùng bình thường.",
      });
    }

    // Xóa người dùng
    await NguoiDungModel.deleteOne({ _id: id });
    return res.status(200).json({
      status: true,
      message: "Xóa người dùng thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    return res.status(500).json({
      status: false,
      message: "Xóa người dùng thất bại. Vui lòng thử lại.",
    });
  }
});

module.exports = routerNguoiDung;
