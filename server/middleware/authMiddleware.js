import CustomErrorHandler from "../utils/services/CustomErrorHandler.js";
import JwtService from "../utils/services/JwtService.js";

const verifyToken = async (req, res, next) => {
    // console.log(req.cookies); // Check if cookies are accessible
    const token = req.cookies.access_token;

    if (!token) {
        return next(CustomErrorHandler.unAuthorized());
    }

    try {
        const decoded = await JwtService.verify(token);
        req.user = decoded.user 
        next();
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized("Token is invalid or expired"));
    }
};


export default verifyToken