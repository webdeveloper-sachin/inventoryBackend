const sendNotificationToEmail = require("../controllers/orderNotifier.controller");

const express = require("express");
const router = express();

router.route("/send").post(sendNotificationToEmail);

module.exports = router;