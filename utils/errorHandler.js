import ErrorResponse from "./errorResponse.js";

const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.log(err.stack.red);
    }

    let error = { ...err }; // if a custom error object, error.statusCode is present
    error.message = err.message;
    // console.log(err.message);

    let message;

    // MongoServerError with code 1100
    if (err.code === 11000) {
        // when a document already exists based on unique field
        message = "Resource already exists";
        error = new ErrorResponse(400, message);
    }

    switch (err.name) {
        case "CastError":
            //  When a document does not exists in DB
            message = `Record not found`;
            error = new ErrorResponse(404, message);
            break;
        case "ValidationError":
            // When a required field in req.body is missing
            // console.log(error.errors);
            message = Object.values(err.errors).map((val) => val.message);
            error = new ErrorResponse(400, message);
            break;
    }

    res.status(error.statusCode || 500).json({
        c: error?.statusCode || 500,
        m: error?.message || "Server Error",
        d: {},
    });
};

export default errorHandler;