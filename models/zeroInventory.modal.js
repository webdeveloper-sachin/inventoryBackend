const mongoose = require("mongoose");

const zeroInventorySchema = new mongoose.Schema(
    {
        fabric_Name: {
            type: String,
        },
        fabricNumber: {
            type: Number,
            required: true,
        },
        styleNumbers: {
            type: [Number],
            required: true,
        },
        status: {
            type: String,
            default: "Active"
        }
    },
    { timestamps: true }
);

const ZeroInventory = mongoose.model("ZeroInventory", zeroInventorySchema);
module.exports = ZeroInventory;
