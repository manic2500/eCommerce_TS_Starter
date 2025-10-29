import { NextFunction, Request, Response } from "express";
import { ApiError } from "../exceptions/apiError";
import { UnprocessableEntityError } from "../exceptions/errors";
import { ErrorCode } from "../exceptions/errorCode";

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    // Check if the error is an instance of our custom ApiError class
    if (err instanceof ApiError) {
        // Log the operational error for debugging purposes (optional)
        console.error('API Error:', err);

        const errorResponse: { [key: string]: any } = {
            statusCode: err.statusCode,
            message: err.message,
            errorCode: err.errorCode,
        };

        if (err instanceof UnprocessableEntityError) {
            // Add specific validation details if it's a ValidationError
            errorResponse.errors = err.errors;
        }

        return res.status(err.statusCode).json(errorResponse);
    }

    // Handle other unexpected (non-operational) programming errors
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const isErrorInstance = err instanceof Error;

    // Log the full unexpected error, including stack, in all environments
    if (isErrorInstance) {
        console.error('UNEXPECTED SERVER ERROR:', err.stack);
    } else {
        console.error('UNEXPECTED SERVER ERROR:', err);
    }

    // Send a generic 500 response
    const statusCode = 500;
    const message = isDevelopment && isErrorInstance ? err.message : 'An unexpected server error occurred';

    const errorResponse: { [key: string]: any } = {
        statusCode: statusCode,
        message: message,
        errorCode: ErrorCode.SERVER_ERROR,
    };

    if (isDevelopment && isErrorInstance) {
        errorResponse.stack = err.stack;
    }

    return res.status(statusCode).json(errorResponse);
};