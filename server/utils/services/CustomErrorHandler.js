class CustomErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
        this.success = false;
    }

    static unAuthorized(message = "unAuthorized") {
        return new CustomErrorHandler(401, message);
    }

    static AlreadyExists(message = "User already exists!") {
        return new CustomErrorHandler(401, message);
    }
    static notFound(message = "Not Found!") {
        return new CustomErrorHandler(401, message);
    }
    static RequireField(message = "User already exists!") {
        return new CustomErrorHandler(401, message);
    }

    static RandomMsg(message = "random msg") {
        return new CustomErrorHandler(401, message);
    }

    static wrongCredential(message = "Check your details") {
        return new CustomErrorHandler(400, message );
    }

    static Invailed(message = "Check your Invailde") {
        return new CustomErrorHandler(400, message );
    }


}

export default CustomErrorHandler;