const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
    style_code:{
        type:Number,
        required:true 
    },
    color:{
        type:String,
        required:true 
    }
});

const Color = mongoose.model("Color",colorSchema);

module.exports = Color;