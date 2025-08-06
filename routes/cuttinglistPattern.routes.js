const express = require("express");
const { uploadPattern, getPatternData } = require("../controllers/cuttingList.controller");
const router = express.Router();

router.route("/upload").post(uploadPattern);
router.route("/get-patterns").get(getPatternData);

module.exports = router;