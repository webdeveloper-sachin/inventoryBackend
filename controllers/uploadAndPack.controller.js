
\
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const fs = require("fs");
const path = require("path")
const DATA_FILE_PATH = path.join(__dirname, 'uploaded_orders.json');


//******************************** */ get order details by shipment_tracker ***************************************

//const getOrderByShipmentTracker = async (req, res, next) => {
//     try {
//         const { shipment } = req.params;

//         if (!shipment) {
//             return next(new ApiError(409, "shipment_tracker param is required"));
//         }

//         const data = JSON.parse(fs.readFileSync(DATA_FILE_PATH));

//         const order = data[0]?.orders?.filter(o => o?.shipment_tracker == "`" + shipment || o?.invoice_id == shipment );

//         if (!order) {
//             return res.status(404).json(
//                 new ApiResponse(404, null, "Order not found")
//             );
//         }

//         return res.status(200).json(
//             new ApiResponse(200, order, "Order fetched successfully")
//         );

//     } catch (error) {
//         next(error);
//     }
// };

const getOrderByShipmentTracker = async (req, res, next) => {
    try {
        const { shipment } = req.params;

        if (!shipment) {
            return next(new ApiError(409, "shipment_tracker param is required"));
        }

        const fileContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        const data = JSON.parse(fileContent);
        const orders = data?.[0]?.orders || [];

        const matchedOrders = orders.filter(({ shipment_tracker, invoice_id }) =>
            shipment_tracker === `\`${shipment}` || invoice_id === shipment
        );

        if (!matchedOrders.length) {
            return res.status(404).json(
                new ApiResponse(404, null, "Order not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(200, matchedOrders, "Order fetched successfully")
        );

    } catch (error) {
        next(error);
    }
};


// ******************************************************* get all orders *************************************************************
const getAllOrders = async (req, res, next) => {
    try {
        const allOrders = JSON.parse(fs.readFileSync(DATA_FILE_PATH));
        res.status(200).json(new ApiResponse(200, allOrders, "all orders fetched sucessfull"));
    } catch (error) {
        next(error)
    }
}


// ************************************************ upload orders ***************************************************************************


// Initialize data file
const initializeDataFile = () => {
    if (!fs.existsSync(DATA_FILE_PATH)) {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({
            lastUpdated: null,
            orders: []
        }, null, 2));
    }
};

// ********************** helter function for store shipment_tracker data ************************

function saveDataToFile(newOrders) {
    let existingData = { orders: [] };

    // Read existing file content
    if (fs.existsSync(DATA_FILE_PATH)) {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        if (fileContent) {
            const parsed = JSON.parse(fileContent);
            existingData.orders = parsed[0]?.orders || [];
        }
    }

    // Append new orders
    existingData.orders.push(...newOrders);

    const updatedData = [{
        lastUpdated: new Date().toISOString(),
        totalOrders: existingData.orders.length,
        orders: existingData.orders
    }];

    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedData, null, 2));
}
// ************************************ wrtite shipment_tracker data into json file **********************************************
const uploadOrders = async (req, res, next) => {
    try {
        fs.unlinkSync(DATA_FILE_PATH);

        initializeDataFile();

        const orders = req.body;

        if (!Array.isArray(orders) || orders.length === 0) {
            return next(new ApiError(400, "Payload must be a non-empty array of orders"));
        }

        const invalidOrders = [];
        const validOrders = [];

        for (const order of orders) {
            const {
                order_date,
                invoice_id,
                channel_order_id,
                product_sku_code,
                listing_sku_code,
                channel_name,
                qty,
                shipment_tracker,
                shipping_company
            } = order;

            // Basic validation
            const requiredFields = [
                order_date,
                invoice_id,
                channel_order_id,
                product_sku_code,
                listing_sku_code,
                channel_name,
                qty,
                shipment_tracker,
                shipping_company
            ];

            if (requiredFields.some(field => field === undefined || field === null || field === '')) {
                invalidOrders.push(order);
            } else {
                validOrders.push(order);
            }
        }

        if (validOrders.length === 0) {
            return next(new ApiError(422, "No valid orders to save"));
        }

        // Save all valid orders
        // validOrders.forEach(order => saveDataToFile(order)); // Ensure saveDataToFile can handle appending
        saveDataToFile(validOrders)

        return res.status(201).json(
            new ApiResponse(201, {
                saved: validOrders.length,
                failed: invalidOrders.length,
                invalidOrders
            }, `Successfully saved ${validOrders.length} order(s)`)
        );

    } catch (error) {
        next(error);
    }
};




// ************************** export all methods ***********************************

module.exports = { getOrderByShipmentTracker, getAllOrders, uploadOrders }



