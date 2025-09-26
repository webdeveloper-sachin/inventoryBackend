const express = require("express");
const { getManifest, saveManifest, getAllManifest ,getManifestByShipment} = require("../controllers/manifest.controller");
const router = express.Router();

router.route("/get").post(getManifest);
router.route("/save").post(saveManifest);
router.route("/all-manifest").get(getAllManifest);
router.route("/").get(getManifestByShipment);


module.exports = router;

