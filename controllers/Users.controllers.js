import { asynchandler } from "../Asynchandler.js";
import { ApiError } from "../Apierror.js";
import { User } from "../models/users.js";
import { Apiresponse } from "../Apiresponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token Generation Error:", error);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asynchandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    // Validate all fields
    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    
    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ name }, { email }]
    });
    
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
    
    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });
    
    const createdUser = await User.findById(user._id).select("-password");
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    
    return res.status(201).json(
        new Apiresponse(200, createdUser, "User registered Successfully")
    );
});

const loginUser = asynchandler(async (req, res) => {
    console.log("Login attempt:", req.body);
    
    const { email, name, password } = req.body;
    
    // Check if email or name provided
    if (!name && !email) {
        throw new ApiError(400, "Email or username is required");
    }
    
    // Check if password provided
    if (!password) {
        throw new ApiError(400, "Password is required");
    }
    
    // Find user
    const user = await User.findOne({
        $or: [{ name }, { email }]
    }).select("+password");
    
    if (!user) {
        console.log("User not found:", email || name);
        throw new ApiError(404, "User does not exist");
    }
    
    console.log("User found:", user.email);
    
    // Verify password
    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if (!isPasswordValid) {
        console.log("Invalid password for:", user.email);
        throw new ApiError(401, "Invalid credentials");
    }
    
    console.log("Password valid, generating tokens...");
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: 'lax'
    };
    
    console.log("Login successful for:", loggedInUser.email);
    
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(
                200,
                {
                    user: loggedInUser, 
                    accessToken, 
                    refreshToken,
                    token: accessToken // Added for frontend compatibility
                },
                "User logged in successfully"
            )
        );
});

const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );
    
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    };
    
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new Apiresponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
