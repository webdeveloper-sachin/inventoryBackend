const mongoose = require("mongoose");

const manifestSchema = new mongoose.Schema({
    tracking_id: {
        type: String,
        required: true,
    },
    sku_codes: {
        type: [String],
        required: true
    },
    qty: {
        type: [Number],
        default: 1,
    },
    courrier: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }

}, {
    timestamps: true
});

const Manifest = mongoose.model("Manifest", manifestSchema);
module.exports = Manifest;