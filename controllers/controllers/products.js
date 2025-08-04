const Product = require("../models/product.model");


// post request 
const addProducts = async (req, res, next) => {
    const { style_id, style_name, color, mrp, rack_space, style_code } = req.body;
  
    try {
      const product = await Product.create({
        style_id,
        style_name,
        color,
        mrp,
        rack_space,
        style_code,
      });
  
      res.status(201).json({ id: product._id });
    } catch (err) {
      // Check if error is due to duplicate key
      if (err.code === 11000 && err.keyPattern && err.keyPattern.style_id) {
        err.status = 409;
        err.message = `Product with style_id ${style_id} already exists.`;
      }
      next(err);
    }
  };
  


// get request 


const getProducts =  async (req, res, next) => {
    try {
      const { style_id, style_code,sort } = req.query;
      let query = {};
  
      // search product according to style_id
      if (style_id) {
        const parsedId = Number(style_id);
        if (!isNaN(parsedId)) {
          query.style_id = parsedId;
        } else {
          return res.status(400).json({ msg: "Invalid style_id" });
        }
      }
  
      // search product according to style number
      if (style_code) {
        const parsedStyleNumber = Number(style_code);
        if (!isNaN(parsedStyleNumber)) {
          query.style_code = parsedStyleNumber;
        } else {
          return res.status(400).json({ msg: "Style number not found" });
        }
      }
  
      // Sort logic: default to ascending if not specified
      let sortOption = {};
      if (sort === "asc") {
        sortOption.style_code = 1;
      } else if (sort === "desc") {
        sortOption.style_id = -1;
      }
  
      const data = await Product.find(query).sort(sortOption);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };
  





// update product by id 

const updateProduct =  async (req, res, next) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ msg: "Product not found" });
      }
  
      res.status(200).json({ msg: "Product updated", product: updatedProduct });
    } catch (err) {
      next(err);
    }
  };





// delete product by id 
const deleteProduct =  async (req, res, next) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  
      if (!deletedProduct) {
        return res.status(404).json({ msg: "Product not found" });
      }
  
      res.status(200).json({ msg: "Product deleted", id: deletedProduct._id });
    } catch (err) {
      next(err);
    }
  };



module.exports = {addProducts,getProducts,updateProduct,deleteProduct};