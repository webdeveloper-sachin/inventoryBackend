const express = require("express");
const { getOrderByShipmentTracker, getAllOrders, uploadOrders } = require("../controllers/uploadAndPack.controller");


const router = express.Router();

router.get("/orders/shipment_tracker/:shipment", getOrderByShipmentTracker);
router.get("/orders/all_orders", getAllOrders);
router.post("/orders/upload", uploadOrders);


module.exports = router;