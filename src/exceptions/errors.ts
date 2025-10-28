import { ApiError } from "./apiError";
import { ErrorCode } from "./errorCode";

/**
 * 400 Bad Request: General client-side error for malformed request syntax,
 * invalid request message framing, or deceptive request routing.
 */
export class BadRequestError extends ApiError {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.BAD_REQUEST) {
        super(message, errorCode, 400);
    }
}

/**
 * 401 Unauthorized: Authentication is required and has either failed or not yet been provided.
 */
export class UnauthorizedError extends ApiError {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.UNAUTHORIZED) {
        super(message, errorCode, 401);
    }
}

/**
 * 403 Forbidden: The server understood the request but refuses to authorize it.
 * Authentication will not help, and the request should not be repeated.
 */
export class ForbiddenError extends ApiError {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.FORBIDDEN) {
        super(message, errorCode, 403);
    }
}

/**
 * 404 Not Found: The server cannot find the requested resource.
 */
export class NotFoundError extends ApiError {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.NOT_FOUND) {
        super(message, errorCode, 404);
    }
}

/**
 * 409 Conflict: The request could not be completed due to a conflict with the
 * current state of the resource.
 */
export class ConflictError extends ApiError {
    constructor(message: string, errorCode: ErrorCode = ErrorCode.CONFLICT) {
        super(message, errorCode, 409);
    }
}

/**
 * 422 Unprocessable Entity: The server understands the request but cannot
 * process the contained instructions due to invalid data (e.g., failed validation).
 */
export class UnprocessableEntityError extends ApiError {
    constructor(errors: any, message: string = "Validation Failed", errorCode: ErrorCode = ErrorCode.UNPROCESSABLE_ENTITY) {
        super(message, errorCode, 422, errors);
    }
}
