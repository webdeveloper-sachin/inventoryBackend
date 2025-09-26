const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");
const Manifest = require("../models/manifest.model");


const saveManifest = async (req, res, next) => {
    try {
        const data = req.body;

        if (!Array.isArray(data) || data.length === 0) {
            return next(new ApiError(400, "Payload must be a non-empty array."));
        }

        // extract incoming tracking ids
        const incomingTrackingIds = data.map((t) => t.tracking_id);

        // check existing in DB
        const existingTrackingDocs = await Manifest.find({
            tracking_id: { $in: incomingTrackingIds }
        });

        const existingTrackingIds = existingTrackingDocs.map((doc) => doc.tracking_id);

        // filter unique ones
        const uniqueTrackingData = data.filter(
            (t) => !existingTrackingIds.includes(t.tracking_id)
        );

        if (uniqueTrackingData.length === 0) {
            return next(new ApiError(400, "All tracking ids already saved."));
        }

        // save only unique
        const savedTrackingIds = await Manifest.insertMany(uniqueTrackingData);

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    savedTrackingIds,
                    `${savedTrackingIds.length} tracking ids saved to database.`
                )
            );
    } catch (error) {
        next(error);
    }
};

// const getManifest = async (req, res, next) => {
//     try {
//         const { start_date, end_date } = req.body;

//         if (!start_date || !end_date) {
//             return next(
//                 new ApiError(400, "Both fields start_date and end_date are required")
//             );
//         }

//         // Convert strings to Date objects
//         const startDate = new Date(start_date);
//         const endDate = new Date(end_date);

//         // Validation: check if valid dates
//         if (isNaN(startDate) || isNaN(endDate)) {
//             return next(new ApiError(400, "Invalid date format."));
//         }

//         // Query DB
//         const manifests = await Manifest.find({
//             createdAt: {
//                 $gte: startDate,
//                 $lte: endDate,
//             },
//         }).sort({ timestamp: -1 }); // latest first

//         return res
//             .status(200)
//             .json(
//                 new ApiResponse(
//                     200,
//                     manifests,
//                     `${manifests.length} records found between ${start_date} and ${end_date}`
//                 )
//             );
//     } catch (error) {
//         next(error);
//     }
// };

const getManifest = async (req, res, next) => {
    try {
        const { start_date, end_date } = req.body;

        if (!start_date || !end_date) {
            return next(
                new ApiError(400, "Both fields start_date and end_date are required")
            );
        }

        // Convert to full day range
        const startDate = new Date(`${start_date}T00:00:00.000Z`);
        const endDate = new Date(`${end_date}T23:59:59.999Z`);

        if (isNaN(startDate) || isNaN(endDate)) {
            return next(new ApiError(400, "Invalid date format. Use YYYY-MM-DD"));
        }

        // Query DB
        const manifests = await Manifest.find({
            timestamp: {
                $gte: startDate,
                $lte: endDate,
            },
        }).sort({ timestamp: -1 });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    manifests,
                    `${manifests.length} records found between ${start_date} and ${end_date}`
                )
            );
    } catch (error) {
        next(error);
    }
};


const getAllManifest = async (req, res, next) => {
    try {
        const manifest = await Manifest.find();
        if (manifest.length === 0) {
            return next(new ApiError(404, "No manifest records found"))
        }
        return res.status(200).json(new ApiResponse(200, manifest, `${manifest.length} manifest records found successfully.`));
    } catch (error) {
        next(error)
    }
}



const getManifestByShipment = async (req, res, next) => {
    const { shipment } = req.query;
    try {
        if (!shipment) {
            return next(new ApiError(409, "shipment is required."));
        }
        const shipment_details = await Manifest.find({ tracking_id: `${"`" + String(shipment)}` });
        if (!shipment_details.length > 0) {
            return next(new ApiError(404, "Invalid shipment id."));
        }
        return res.status(200).json(new ApiResponse(200, shipment_details, "Shipment details fetched successfully."));

    } catch (error) {
        next(error);
    }
}



module.exports = { saveManifest, getManifest, getAllManifest ,getManifestByShipment}
