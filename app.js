const express = require("express");
require("dotenv").config();
const cors = require("cors");
const productRoute = require("./routes/product.routes");
const userRoute = require("./routes/user.routes");
const connectDB = require("./src/config/db");
const globalErrorMiddleware = require("./middlewares/global.errormiddleware");
const app = express();
const port = process.env.PORT || 4000;

// global middlewares
app.use(cors());
app.use(express.json());

// database connection
connectDB();

// routes middleware
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);


// error middleware 
app.use(globalErrorMiddleware)

app.listen(port, () => {
  console.log(`The server is running on ${port} number`);
});
