import { NextFunction, Request, Response } from "express";
import { ApiError } from "../types/exceptions/apiError";
import { UnprocessableEntityError } from "../types/exceptions/errors";
import StatusCode from "../types/constants/statusCode";
export const errorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const isDevelopment = process.env.NODE_ENV !== "production";
    const isErrorInstance = err instanceof Error;

    // 🟥 1️⃣ Handle known (operational) API errors
    if (err instanceof ApiError) {
        console.error("API Error:", err);

        return res.status(err.httpStatus).json({
            success: false,
            ...err.toJSON(), // Ensures message, httpStatus, statusCode, errors are included
            ...(isDevelopment && err.stack ? { stack: err.stack } : {}),
        });
    }

    // 🟨 2️⃣ Handle unexpected (non-operational) errors
    console.error(
        "UNEXPECTED SERVER ERROR:",
        isErrorInstance ? err.stack || err.message : err
    );

    const httpStatus = 500;
    const message =
        isDevelopment && isErrorInstance
            ? err.message
            : "An unexpected server error occurred";

    // Create an ApiError instance for consistency
    const unexpectedError = ApiError.error(
        httpStatus,
        message,
        null,
        StatusCode.SERVER_ERROR
    );

    // Attach stack trace only in development
    const responseBody = {
        success: false,
        ...unexpectedError.toJSON(),
        ...(isDevelopment && isErrorInstance && err.stack
            ? { stack: err.stack }
            : {}),
    };

    return res.status(httpStatus).json(responseBody);
};