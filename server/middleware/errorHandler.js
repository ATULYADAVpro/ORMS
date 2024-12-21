// ======== Importing ===========
import CustomErrorHandler from "../utils/services/CustomErrorHandler.js";
import Joi from 'joi'
import { DEBUG_MODE } from "../utils/configs/index.js";
const { ValidationError } = Joi


// ======== Logic ==========

const errorHandler = async (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: "Internal Server Error!",
        ...(DEBUG_MODE === "true" && { originalError: err.message }),
        success: false
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data = {
            message: err.message,
            success: false
        }
    }

    if (err instanceof ValidationError) {
        statusCode = 422;
        data = {
            message: err.message,
            success: false
        }
    }

    return res.status(statusCode).json(data);
}


// ======== Exporting =========

export default errorHandler;