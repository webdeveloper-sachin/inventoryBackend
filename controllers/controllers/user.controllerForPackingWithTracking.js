const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const USER_DATA_PATH = path.join(__dirname, "users.json");

const initializeDataFile = () => {
    if (!fs.existsSync(USER_DATA_PATH)) {
        fs.writeFileSync(
            USER_DATA_PATH,
            JSON.stringify({ users: [] }, null, 2)
        );
    }
};
// ********************************** register user *************************************

const registerUser = async (req, res, next) => {
    initializeDataFile();

    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return next(new ApiError(400, "All fields are required"));
        }

        let usersData = JSON.parse(fs.readFileSync(USER_DATA_PATH, "utf-8"));

        // ✅ Corrected user existence check
        const existingUser = usersData?.users.find(user => user.email === email);
        if (existingUser) {
            return next(new ApiError(409, "User already registered"));
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { email, password: hashedPassword, username }; // 🔐 Note: Password should be hashed in real applications

        usersData.users.push(newUser);

        fs.writeFileSync(USER_DATA_PATH, JSON.stringify(usersData, null, 2));

        return res.status(201).json(
            new ApiResponse(201, newUser, "Register successful")
        );
    } catch (error) {
        next(error);
    }
};


// ************************************** login user ****************************************
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ApiError(409, "All fields are required"))
        }

        const userData = JSON.parse(fs.readFileSync(USER_DATA_PATH, "utf-8"));
        let existUser = userData?.users.find(user => user.email === email);
        if (!existUser) {
            return next(new ApiError(409, "Invalid credentials"))
        }

        const matchedPassword = await bcrypt.compare(password, existUser.password);
        if (!matchedPassword) {
            return next(new ApiError(409, "invalid credentials"));
        }

        const safeUser = { ...existUser };
        delete safeUser.password;

        return res.status(200).json(new ApiResponse(200, safeUser, "Login successfull"))

    } catch (error) {
        next(error)
    }
}

// ************************************** Logout User ****************************************
const logout = async (req, res, next) => {
    try {
        // In stateless auth, just respond with a success message
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
};



module.exports = { registerUser, loginUser, logout };
