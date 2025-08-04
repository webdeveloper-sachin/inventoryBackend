const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MD);
    
        console.log("Mongodb connection success",res.connection.host);

  } catch (error) {
    console.log("Connection failed with mongodb", error);
  }
};

module.exports = connectDB;
