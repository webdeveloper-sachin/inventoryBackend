const express = require('express');
const router = express.Router();


router.get("/",(req,res,next)=>{
    res.status(200).json({msg:"Users list"});
})




module.exports = router