const express = require("express");
const Product = require("../models/product.model");
const productRoute = require("../controllers/products");
const router = express.Router();


// Get Products
router.get("/",productRoute.getProducts);
 
// Create a new product
router.post("/", productRoute.addProducts);

// update product by id 
router.put("/:id",productRoute.updateProduct)
  
// delete product by id 
router.delete("/:id",productRoute.deleteProduct)



// bulk delete 
router.delete("/bulk", async (req, res, next) => {
    try {
      const { ids } = req.body;
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ msg: "Please provide an array of product IDs" });
      }
  
      const result = await Product.deleteMany({ _id: { $in: ids } });
  
      res.status(200).json({
        msg: `${result.deletedCount} products deleted`,
        deletedCount: result.deletedCount,
      });
    } catch (err) {
      next(err);
    }
  });
  

  
  router.put("/bulk", async (req, res, next) => {
    try {
      const { updates } = req.body;
  
      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ msg: "Please provide an array of updates" });
      }
  
      const results = [];
  
      for (const update of updates) {
        const { id, ...fieldsToUpdate } = update;
        const updatedProduct = await Product.findByIdAndUpdate(id, fieldsToUpdate, {
          new: true,
          runValidators: true,
        });
  
        if (updatedProduct) {
          results.push(updatedProduct);
        }
      }
  
      res.status(200).json({
        msg: `${results.length} products updated`,
        updated: results,
      });
    } catch (err) {
      next(err);
    }
  });
  





module.exports = router;
