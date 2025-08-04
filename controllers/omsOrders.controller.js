const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const fs = require('fs');
const path = require('path');
const axios = require("axios")
const { format, subDays } = require('date-fns');

const TOKEN = process.env.TOKEN;
const OMS_CID = process.env.OMS_CID;
const BASE_URL = 'https://client.omsguru.com/order_api/orders';
const DATA_FILE_PATH = path.join(__dirname, 'order_data.json');



// Initialize data file
const initializeDataFile = () => {
    if (!fs.existsSync(DATA_FILE_PATH)) {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({
            lastUpdated: null,
            orders: []
        }, null, 2));
    }
};
initializeDataFile();

// Helper Functions
function getDateList(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
        dates.push(format(current, 'yyyy-MM-dd'));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}



async function fetchOrdersForDateRange(startDate, endDate) {
    const dateList = getDateList(startDate, endDate);
    let allOrders = [];

    for (const date of dateList) {
        try {
            const startTimestamp = Math.floor(new Date(date).getTime() / 1000);
            const endTimestamp = startTimestamp + 86399;

            const params = new URLSearchParams();
            params.append("start_order_date", startTimestamp);
            params.append("end_order_date", endTimestamp);
            params.append("limit", "100");

            const response = await axios.post(BASE_URL, params, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${TOKEN}`,
                    "Oms-Cid": OMS_CID
                },
                timeout: 10000
            });

            if (response.data?.data) {
                allOrders = [...allOrders, ...response.data.data];
            }
        } catch (error) {
            console.error(`Error fetching orders for ${date}:`, error.message);
        }
    }
    return allOrders;
}

function saveDataToFile(orders) {
    const data = {
        lastUpdated: new Date().toISOString(),
        orders: orders
    };
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
}


const fetchOrders = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json(new ApiError(400, "Both startDate and endDate are required "))
        }
        const orders = await fetchOrdersForDateRange(startDate, endDate);

        saveDataToFile(orders);

        res.status(200).json(new ApiResponse(200, orders, `Successfully fetched ${orders.length} orders`));
    } catch (error) {
        next(error)
    }
}

// New get order by tracking id 

const getOrdersByTrackingId = async (req, res, next) => {
    try {
        const { trackingId } = req.params;
        const data = JSON.parse(fs.readFileSync(DATA_FILE_PATH));

        const order = data?.orders.find(o => o?.shipment_tracker == trackingId || (o?.order_items.some(item => item.tracking_id == trackingId)));
        if (!order) {
            return res.status(404).json(new ApiResponse(404, "Order not found"))
        }

        res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));

    } catch (error) {
        next(error)
    }
}

// Get all orders 

const getAllOrders = async (req, res, next) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE_PATH));
        res.status(200).json(new ApiResponse(200, data.orders, "All orders fetched successfully"))
    } catch (error) {
        next(error)
    }
}


module.exports = { fetchOrders, getAllOrders, getOrdersByTrackingId }