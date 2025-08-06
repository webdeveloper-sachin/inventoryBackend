const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const fs = require("fs");
const path = require("path");
const PATTERN_DATA_PATH = path.join(__dirname, "patternData.json");

const initializeDataFile = () => {
    if (!fs.existsSync(PATTERN_DATA_PATH)) {
        fs.writeFileSync(
            PATTERN_DATA_PATH,
            JSON.stringify({ patterns: [] }, null, 2)
        );
    }
};

const saveDataToFile = (patterns) => {
    const currentData = JSON.parse(fs.readFileSync(PATTERN_DATA_PATH, "utf-8"));
    currentData.patterns.push(...patterns);
    fs.writeFileSync(PATTERN_DATA_PATH, JSON.stringify(currentData, null, 2));
};

const uploadPattern = async (req, res, next) => {
    try {
        initializeDataFile();

        const pattern_data = req.body;

        if (!Array.isArray(pattern_data) || pattern_data.length === 0) {
            return next(new ApiError(400, "Payload must be a non-empty array of patterns"));
        }

        const fileContent = fs.readFileSync(PATTERN_DATA_PATH, "utf-8");
        const jsonData = JSON.parse(fileContent);

        const invalidPatterns = [];
        const duplicatePatterns = [];
        const validPatterns = [];

        for (const pattern of pattern_data) {
            const {
                style_number,
                pattern: patternName,
                style_type,
                color,
                style_name,
                accessory1,
                wash_care,
                mrp
            } = pattern;

            const requiredFields = [
                style_number,
                patternName,
                style_type,
                color,
                style_name,
                accessory1,
                wash_care,
                mrp
            ];

            if (requiredFields.some(field => field === undefined || field === null || field === '')) {
                invalidPatterns.push(pattern);
                continue;
            }

            const isStyleNumberExist = jsonData.patterns.find(p => p.style_number == style_number);
            if (isStyleNumberExist) {
                duplicatePatterns.push(pattern);
                continue;
            }

            validPatterns.push(pattern);
        }

        if (validPatterns.length === 0) {
            return next(new ApiError(422, "No valid patterns to save"));
        }

        saveDataToFile(validPatterns);

        return res.status(201).json(
            new ApiResponse(201, {
                saved: validPatterns.length,
                failed: invalidPatterns.length,
                duplicates: duplicatePatterns.length,
                invalidPatterns,
                duplicatePatterns
            }, `Saved: ${validPatterns.length}, Invalid: ${invalidPatterns.length}, Duplicates: ${duplicatePatterns.length}`)
        );

    } catch (error) {
        next(error);
    }
};



const getPatternData = async (req, res, next) => {
    try {
        if (!fs.existsSync(PATTERN_DATA_PATH)) {
            return next(new ApiError(404, "Pattern data file not found"));
        }

        const fileContent = fs.readFileSync(PATTERN_DATA_PATH, "utf-8");
        const jsonData = JSON.parse(fileContent);

        return res.status(200).json(
            new ApiResponse(200, jsonData.patterns || [], "Pattern data fetched successfully")
        );

    } catch (error) {
        next(error);
    }
};


module.exports = { uploadPattern, getPatternData };
