const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MD);
    if(res){
        console.log("Mongodb connection success");
    }

  } catch (error) {
    console.log("Connection failed with mongodb", error);
  }
};

module.exports = connectDB;
