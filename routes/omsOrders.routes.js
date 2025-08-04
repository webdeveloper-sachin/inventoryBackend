// routes/omsOrders.routes.js

const express = require("express");
const { getAllOrders, fetchOrders, getOrdersByTrackingId } = require("../controllers/omsOrders.controller");

const router = express.Router();

// POST /fetch-orders
router.post("/fetch-orders", fetchOrders);

// GET /orders
router.get("/orders", getAllOrders);

// GET /orders/tracking/:trackingId
router.get("/tracking/:trackingId", getOrdersByTrackingId);

module.exports = router;
