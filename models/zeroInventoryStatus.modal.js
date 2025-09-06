const mongoose = require("mongoose");

const zeroInventoryStatusSchema = new mongoose.Schema({
    fabricNumber: {
        type: [Number],
        required: true,
    },
    styleNumbers: {
        type: [Number],
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    employeeId: {
        type: Number,
        required: true,
    },
    totalStyles: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const ZeroInventoryStatus = mongoose.model("ZeroInventoryStatus", zeroInventoryStatusSchema);

module.exports = ZeroInventoryStatus;