const User = require('../models/user.modal');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');



const registerUser = async(req,res,next)=>{
    try{

    const {username,email,password} = req.body;

    if (!username?.trim() || !email?.trim() || !password?.trim())
    {
         throw new ApiError(409,"All fields are required");
    }

    const user = await User.findOne({$or:[{username},{email}]});
    if(user){
         throw new ApiError(409,"User already exists");
    }


    let userCreated = await  User.create({
        username,email,password
    })

    const token = userCreated.generateAccessToken();
    const userData = {
        _id:userCreated._id,
        username:userCreated.username,
        email:userCreated.email,
        accessToken:token
    }
    res.cookie("token",token);
    res.status(201).json(new ApiResponse(201,userData,"User registered successfully"))
    }
    catch(err){
        next(err);
    }

}

const login = async(req,res,next)=>{
    try {
        const { email, password } = req.body;
    
        if (!email?.trim() || !email?.trim()) {
          throw new ApiError(400, "email and password are required");
        }
    
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
          throw new ApiError(401, "Invalid email or password");
        }
    
        const token = user.generateAccessToken();
    
        const userData = {
          _id: user._id,
          username: user.username,
          email: user.email,
          accessToken: token
        };
    
        res.cookie("token", token, {
          maxAge: 60 * 60 * 1000 // 1 hour
        });
    
        res.status(200).json(new ApiResponse(200, userData, "Login successful"));
      } catch (err) {
        next(err);
      }
}


const logout = async(req,res,next)=>{
    try{
        res.cookie("token","");
        res.json(new ApiResponse(200,"You are logged out. Please login again"));
    }catch(err){
        next(err)
    }
}



module.exports = {registerUser ,login,logout}