const cors = require("cors");
const routerAdmin = require("./routes/Admin.js");
const routerNguoiDung = require("./routes/NguoiDung.js");
const routerSach = require("./routes/Sach.js");
const routerSachDetail = require("./routes/SachDetail.js");
const routerTacgia = require("./routes/Tacgia.js");
const routerBanner = require("./routes/Banner.js");
const routerDanhGia = require("./routes/DanhGia.js");
const routerDonHang = require("./routes/DonHang.js");
const routerTheLoaiSach = require("./routes/TheLoaiSach.js");
const routerTheLoaiDetail = require("./routes/TheLoaiDetail.js");
const routerAuth = require("./routes/Auth.js");
const routerBaiViet = require("./routes/BaiViet.js");
const routerBinhLuan = require("./routes/BinhLuan.js");
const routerChiTietDonHang = require("./routes/ChiTietDonHang.js");
const routerSachYeuThich = require("./routes/SachYeuThich.js");
const routerTimKiem = require("./routes/TimKiem.js");
const routerLuotTim = require("./routes/LuotTim.js");
const routerThanhToan = require("./routes/Thanhtoan.js");
var express = require("express");
var path = require("path");

var router = express.Router();
var logger = require("morgan");
var createError = require("http-errors");
var cookieParser = require("cookie-parser");

const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URL) // Link đến DB_URL trong file .env
  // .connect("mongodb://localhost:27017/Bookland")
  .then(() => console.log(">>>>>>>>>> DB Connected!!!!!!"))
  .catch((err) => console.log(">>>>>>>>> DB Error: ", err));

// var clientRouter = require("./routes/api");

var app = express();
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API Working");
});

app.use(logger("dev"));
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/api/add, routerSach");
app.use("/api/admin", routerAdmin);
app.use("/api/nguoidung", routerNguoiDung);
app.use("/api/sach", routerSach);
app.use("/api/chitietsach", routerSachDetail);
app.use("/api/tacgia", routerTacgia);
app.use("/api/banner", routerBanner);
app.use("/api/danhgia", routerDanhGia);
app.use("/api/donhang", routerDonHang);
app.use("/api/theloai", routerTheLoaiSach);
app.use("/api/chitiettheloai", routerTheLoaiDetail);
app.use("/api/auth", routerAuth);
app.use("/api/baiviet", routerBaiViet);
app.use("/api/binhluan", routerBinhLuan);
app.use("/api/chitietdonhang", routerChiTietDonHang);
app.use("/api/sachyeuthich", routerSachYeuThich);
app.use("/api/timkiem", routerTimKiem);
app.use("/api/luottim", routerLuotTim);
app.use("/api/thanhtoan", routerThanhToan);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
