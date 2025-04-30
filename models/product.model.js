const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    style_id:{
        type:Number,
        required:true,
        unique:true
    },
    style_code:{
        type:Number,
        required:true
    },
    style_name:{
        type:String,
        default:"Qurvii Products"
    },
    color:{
        type:String,
        required:true
    },
    mrp:{
        type:Number,
        required:true
    },
    rack_space:{
        type:String,
        default:"Default"
    }
},{timestamps:true})

const Product = mongoose.model("Product",productSchema);
module.exports = Product;