import {ResponsesError} from "../error/responses-error.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponsesError) {
        res.status(err.status).json({
            errors: err.message
        }).end();
    } else {
        res.status(500).json({
            errors: "Internal Server Error"
        }).end();
    }
}

export {
    errorMiddleware
}