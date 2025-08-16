const Color = require("../models/color.modal");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// ********************************************************************************

// ************************get route for colors **********************************
// *******************************************************************************

const getColor = async (req, res, next) => {
  try {
    const colors = await Color.find();
    res
      .status(200)
      .json(new ApiResponse(200, colors,"Colors fetched successfully"));
  } catch (error) {
    next(error);
  }
};

// ********************************************************************************
// ************************post route for add color **********************************
// *******************************************************************************
const addColors = async (req, res, next) => {
  try {
    const { colors } = req.body;

    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      throw new ApiError(400, "Colors array is required");
    }

    const styleCodes = colors.map((color) => color.style_code);

    // Find existing style_codes
    const existingColors = await Color.find({
      style_code: { $in: styleCodes },
    });

    const existingStyleCodes = existingColors.map((doc) => doc.style_code);

    // Filter out the ones that already exist
    const newColors = colors.filter(
      (color) => !existingStyleCodes.includes(color.style_code)
    );

    let addedRecord = [];
    if (newColors.length > 0) {
      addedRecord = await Color.insertMany(newColors);
    }

    const warning =
      existingStyleCodes.length > 0
        ? `These style_codes already exist and were skipped: ${existingStyleCodes.join(
            ", "
          )}`
        : null;

    res.status(201).json(
      new ApiResponse(201,  {
        added: addedRecord,
        warning,
      },
           "Colors processed successfully.",          
                     )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getColor, addColors };

