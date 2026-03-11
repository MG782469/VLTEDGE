import { User } from "./models/users.js";
import jwt from 'jsonwebtoken';
import { ApiError } from "./Apierror.js"; // ⬅️ MISSING IMPORT - ADDED!

export const VerifyJwt = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        
        if (!token) {
            return next(new ApiError(401, "Unauthorized access"));
        }
        
        const decodedToken = jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_SECRET || "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
        );
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        if (!user) {
            return next(new ApiError(400, "Invalid Access token"));
        }
        
        req.user = user;
        next();
        
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return next(new ApiError(401, error?.message || "Invalid token"));
    }
};
