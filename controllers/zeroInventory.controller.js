const { Types } = require("mongoose");
const ZeroInventory = require("../models/zeroInventory.modal");
const ZeroInventoryStatus = require("../models/zeroInventoryStatus.modal.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");

// ****************** fabric number creation  **********************

const addFabricNumbers = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!Array.isArray(payload) || payload.length === 0) {
            return next(new ApiError(400, "paload must be non-empty array"));
        }
        //  **************** mapping all incoming fabric numbers *********************
        const incommingFabricNumber = payload.map((fab) => fab.fabricNumber);

        // ************** check existing fabric numbers *****************************
        const existing = await ZeroInventory.find({
            fabricNumber: { $in: incommingFabricNumber }
        }).select("fabricNumber");

        const existingNumbers = existing.map((e) => e.fabricNumber);

        // ****************** filter out existing fabric number from database *****************
        const uniqueFabricNumbers = payload.filter((f) => !existingNumbers.includes(f.fabricNumber));


        if (uniqueFabricNumbers.length === 0) {
            return next(new ApiError(400, "All fabric numbers already exists"));
        }
        const createdFabricNumbers = await ZeroInventory.insertMany(uniqueFabricNumbers);
        return res.status(201).json(new ApiResponse(201, createdFabricNumbers, `${createdFabricNumbers.length} fabric numbers created successfully.`));

    } catch (error) {
        next(error);
    }
}


// ******************** updating fabric number *********************
const updateFabricNumber = async (req, res, next) => {
    try {
        const { id, data } = req.body;

        if (!id || !Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid or missing id provided."));
        }

        const fabricNumber = await ZeroInventory.findById(id);
        if (!fabricNumber) {
            return next(new ApiError(404, "Fabric number not found for update"));
        }

        const updatedFabricNumber = await ZeroInventory.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                updatedFabricNumber,
                "Fabric number updated successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};
// ********************* deletding fabric number **********************
const deleteFabricNumber = async (req, res, next) => {
    try {
        const { id } = req.body;

        if (!id || !Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid id provided"));
        }
        const deleted = await ZeroInventory.findByIdAndDelete(id);
        if (!deleted) {
            return next(new ApiError("id not found for delete"));
        }


        return res.status(200).json(new ApiResponse(200, { deleted }, `${id} deleted successfully.`));

    } catch (error) {
        next(error);
    }
}

// ***************** getting fabric number list **************************
const getFabricNumberList = async (req, res, next) => {
    try {
        const fabricNumberList = await ZeroInventory.find();
        if (fabricNumberList.length === 0) {
            return next(new ApiError(404, "Fabric number not found."));
        }

        return res.status(200).json(new ApiResponse(200, { totalRecords: fabricNumberList.length, data: fabricNumberList }, "Fabric number fetched successfully"));
    } catch (error) {
        next(error);
    }
}

const getFabricNumberById = async (req, res, next) => {
    const fabricNumbers = req.body;

    if (fabricNumbers.length === 0 || !Array.isArray(fabricNumbers)) {
        return next(new ApiError(400, "Payload must be non-empty array."));
    }
    try {
        const fabNum = fabricNumbers.map((s) => s);
        const fabricNumberDetails = await ZeroInventory.find({
            fabricNumber: { $in: fabNum }
        });
        if (!fabricNumberDetails.length > 0) {
            return next(new ApiError(404, "Fabric details not found."))
        }
        return res.status(200).json(new ApiResponse(200, fabricNumberDetails, `${fabricNumberDetails.length} Fabric details fetched successfully.`));
    } catch (error) {
        next(error);
    }
}



// ************************** logs controllers *********************************

const addLog = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload) {
            return next(new ApiError(400, "payload must be non-empty object."));
        }

        payload.totalStyles = payload.styleNumbers.length || 0;

        const createdLog = await ZeroInventoryStatus.create(payload);
        return res.status(201).json(new ApiResponse(201, createdLog, "Log created successfully."));
    } catch (error) {
        next(error);
    }
}

const deleteLog = async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id || !Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid id provided."));
        }
        const deletedLog = await ZeroInventoryStatus.findByIdAndDelete(id);
        if (!deletedLog) {
            return next(new ApiError(400, "Log not found for delete."))
        }
        return res.status(200).json(new ApiResponse(200, deletedLog, `${id} log deleted successfully.`));
    } catch (error) {
        next(error);
    }
}

const getLogs = async (req, res, next) => {

    try {

        const loglist = await ZeroInventoryStatus.find();
        if (loglist.length === 0) {
            return next(new ApiError("Logs not found."));
        }
        return res.status(200).json(new ApiResponse(200, loglist, "Logs fetched successfully."));
    } catch (error) {
        next(error);
    }
}

module.exports = { addFabricNumbers, updateFabricNumber, deleteFabricNumber, getFabricNumberList, getFabricNumberById, addLog, deleteLog, getLogs }