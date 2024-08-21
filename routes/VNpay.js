// routes/VNPayRouter.js
const express = require("express");
const crypto = require("crypto");
const querystring = require("qs");
const {
  vnp_TmnCode,
  vnp_HashSecret,
  vnp_Url,
  vnp_ReturnUrl,
} = require("../config/vnpay.config.js");

const routerVNPay = express.Router();

// Route tạo giao dịch thanh toán
routerVNPay.post("/create_payment", (req, res) => {
  const { amount, orderInfo, orderId } = req.body;

  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = "billpayment";
  vnp_Params["vnp_Amount"] = amount * 100; // VNPay yêu cầu nhân 100
  vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;
  vnp_Params["vnp_IpAddr"] = req.ip;
  vnp_Params["vnp_CreateDate"] = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  const paymentUrl = `${vnp_Url}?${querystring.stringify(vnp_Params, {
    encode: true,
  })}`;

  res.json({ success: true, paymentUrl });
});

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

// Route nhận kết quả thanh toán từ VNPay
routerVNPay.get("/vnpay_return", (req, res) => {
  let vnp_Params = req.query;

  const secureHash = vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    res.json({
      success: true,
      message: "Giao dịch thành công",
      data: vnp_Params,
    });
  } else {
    res.status(400).json({ success: false, message: "Chữ ký không hợp lệ" });
  }
});

// Hàm sắp xếp object để tạo chữ ký đúng theo yêu cầu của VNPay
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

module.exports = routerVNPay;
