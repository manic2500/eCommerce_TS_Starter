import StatusCode from "../constants/statusCode";
import { ApiError } from "./apiError";

/**
 * 400 Bad Request: General client-side error for malformed request syntax,
 * invalid request message framing, or deceptive request routing.
 */
export class BadRequestError extends ApiError {
    constructor(message: string, errorCode: StatusCode = StatusCode.BAD_REQUEST) {
        super(400, errorCode, message);
    }
}

/**
 * 401 Unauthorized: Authentication is required and has either failed or not yet been provided.
 */
export class UnauthorizedError extends ApiError {
    constructor(message: string = "Unauthorized", errorCode: StatusCode = StatusCode.UNAUTHORIZED) {
        super(401, errorCode, message);
    }
}

/**
 * 403 Forbidden: The server understood the request but refuses to authorize it.
 * Authentication will not help, and the request should not be repeated.
 */
export class ForbiddenError extends ApiError {
    constructor(message: string, errorCode: StatusCode = StatusCode.FORBIDDEN) {
        super(403, errorCode, message);
    }
}

/**
 * 404 Not Found: The server cannot find the requested resource.
 */
export class NotFoundError extends ApiError {
    constructor(message: string, errorCode: StatusCode = StatusCode.NOT_FOUND) {
        super(404, errorCode, message);
    }
}

/**
 * 409 Conflict: The request could not be completed due to a conflict with the
 * current state of the resource.
 */
export class ConflictError extends ApiError {
    constructor(message: string, errorCode: StatusCode = StatusCode.CONFLICT) {
        super(409, errorCode, message);
    }
}

/**
 * 422 Unprocessable Entity: The server understands the request but cannot
 * process the contained instructions due to invalid data (e.g., failed validation).
 */
export class UnprocessableEntityError extends ApiError {
    constructor(errors: any, message: string = "Validation Failed", errorCode: StatusCode = StatusCode.UNPROCESSABLE_ENTITY) {
        super(422, errorCode, message, errors);
    }
}
