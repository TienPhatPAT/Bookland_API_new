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
        message: "",
        data: newOrder,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      data: {
        message: "Server Error",
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
        message: "Get order success",
        data: ordersList,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      data: {
        message: "Server Error",
        data: [],
      },
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const idOrder = req.params.id;
    const status = req.query.status;
    if (!idOrder)
      res.status(402).json({
        status: 0,
        data: {
          message: "Id đơn hàng không được trống",
          data: ordersList,
        },
      });
    if (!status) {
      res.status(402).json({
        status: 0,
        data: {
          message: "Trạng thái đơn hàng không được trống",
          data: ordersList,
        },
      });
    }
    const orderUpdate = await Order.findOneAndUpdate(
      {
        _id: idOrder,
      },
      { status },
      { new: true }
    );
    if (!orderUpdate) {
      res.status(402).json({
        status: 0,
        data: {
          message: "Order not found",
          data: null,
        },
      });
    }
    res.status(200).json({
      status: 0,
      data: {
        message: "Update order success",
        data: orderUpdate,
      },
    });
  } catch (error) {
    console.log("Check Error: ", error);
    res.status(500).json({
      status: 0,
      data: {
        message: "Server Error",
        data: null,
      },
    });
  }
});

module.exports = router;
