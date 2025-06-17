const express = require("express");
const { getColor, addColors } = require("../controllers/color.controller");
const router = express.Router();

router.get("/get-colors",getColor);
router.post("/add-color",addColors);

module.exports = router;