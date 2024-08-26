const express = require("express");
const Order = require("../models/Order/Order.model");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const keysToCheck = [
      "user",
      "address",
      "phoneNumber",
      "shipping",
      "paymentMethod",
      "items",
    ];
    const body = req.body;
    const missingFields = keysToCheck.filter(
      (key) => !body[key] && key !== "note"
    );

    if (missingFields.length > 0) {
      const errorMessage = missingFields.join(", ");
      return res.status(402).json({
        status: 0,
        message: `Các trường ${errorMessage} không được để trống`,
      });
    }

    if (!Array.isArray(body["items"]) || !body["items"]?.length > 0) {
      return res.status(402).json({
        status: 0,
        message: `Sản phẩm không được trống`,
      });
    }

    const newOrder = await Order.create(body);

    res.status(200).json({
      status: 0,
      data: {
        message: "Tạo đơn hàng thành công",
        data: newOrder,
      },
    });
  } catch (error) {
    console.error("Error occurred while creating order:", error);
    res.status(500).json({
      status: 0,
      data: {
        message: "Server Error",
        error: error.message,
        data: {},
      },
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const ordersList = await Order.find().populate("user items.book");
    res.status(200).json({
      status: 0,
      data: {
        message: "Lấy danh sách đơn hàng thành công",
        data: ordersList,
      },
    });
  } catch (error) {
    console.error("Error occurred while fetching orders:", error);
    res.status(500).json({
      status: 0,
      data: {
        message: "Server Error",
        error: error.message,
        data: [],
      },
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const idOrder = req.params.id;
    const status = req.query.status;

    if (!idOrder) {
      return res.status(402).json({
        status: 0,
        data: {
          message: "Id đơn hàng không được trống",
        },
      });
    }

    if (!status) {
      return res.status(402).json({
        status: 0,
        data: {
          message: "Trạng thái đơn hàng không được trống",
        },
      });
    }

    const orderUpdate = await Order.findOneAndUpdate(
      { _id: idOrder },
      { status },
      { new: true }
    );

    if (!orderUpdate) {
      return res.status(404).json({
        status: 0,
        data: {
          message: "Không tìm thấy đơn hàng",
          data: null,
        },
      });
    }

    res.status(200).json({
      status: 0,
      data: {
        message: "Cập nhật đơn hàng thành công",
        data: orderUpdate,
      },
    });
  } catch (error) {
    console.error("Error occurred while updating order:", error);
    res.status(500).json({
      status: 0,
      data: {
        message: "Server Error",
        error: error.message,
        data: null,
      },
    });
  }
});

module.exports = router;
