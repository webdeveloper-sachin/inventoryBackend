const express = require("express");
require("dotenv").config();
const cors = require("cors");
const productRoute = require("./routes/product.routes");
const userRoute = require("./routes/user.routes");
const colorRoutes = require("./routes/color.routes");
const omsRoutes = require("./routes/omsOrders.routes");
const omsUloadAndPackRoutes = require("./routes/uploadAndPack.routes");
const cuttingListRoutes = require("./routes/cuttinglistPattern.routes");
const userRoutesPackingWithTracking = require("./routes/user.routesForPackingWithTracking");
const connectDB = require("./src/config/db");

const globalErrorMiddleware = require("./middlewares/global.errormiddleware");
const app = express();
const port = process.env.PORT || 4000;
const corsOptions = {
  origin: "*", //  Frontend origin
  credentials: true, // Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
// global middlewares
app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// database connection
connectDB();

// routes middleware
app.use("/api/product", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/colors", colorRoutes);


// oms routes 
app.use("/api/v1/oms/orders", omsRoutes);


// oms upload and get orders routes 

app.use("/api/v1/oms", omsUloadAndPackRoutes);
app.use("/api/v1/packing", userRoutesPackingWithTracking);


//  ************************ cutting list routes ******************************

app.use('/api/v1/cutting-list', cuttingListRoutes);


// error middleware 
app.use(globalErrorMiddleware)

app.listen(port, () => {
  console.log(`The server is running on ${port} number`);
  console.log(`Endpoints:
  - POST /fetch-orders {startDate, endDate}
  - GET /orders
  - GET /orders/tracking/:trackingId`);
});
