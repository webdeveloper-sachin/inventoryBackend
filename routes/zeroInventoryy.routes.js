const express = require("express");
const { addFabricNumbers, getFabricNumberList, updateFabricNumber, deleteFabricNumber, addLog, deleteLog, getLogs, getFabricNumberById } = require("../controllers/zeroInventory.controller");
const router = express.Router();


// **************** FABRIC NUMBERS CRUD ROUTES *******************

router.route("/add-fabric-numbers").post(addFabricNumbers);
router.route("/update-fabric-number").post(updateFabricNumber);
router.route("/delete-fabric-number").post(deleteFabricNumber);
router.route("/get-fabric-numbers").get(getFabricNumberList);
router.route("/get-fabric-number-details").post(getFabricNumberById);

// *************** FILE GENERATION CRUD ROUTES ****************************

router.route("/add").post(addLog);
// router.route("/update").post();
router.route("/delete").post(deleteLog);
router.route("/get").get(getLogs);


// exporting router 

module.exports = router;