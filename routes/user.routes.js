const express = require('express');
const User = require('../models/user.modal');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const userRoute = require('../controllers/user.controller');
const router = express.Router();


router.post("/register",userRoute.registerUser)
router.post("/login",userRoute.login)
router.post("/logout",userRoute.logout);
   



module.exports = router