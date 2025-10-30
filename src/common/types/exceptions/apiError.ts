import StatusCode from "../constants/statusCode";


export class ApiError extends Error {
    httpStatus: number;
    statusCode: StatusCode;
    errors: any

    constructor(httpStatus: number, statusCode: any, message: string, errors?: any) {
        super(message)
        this.statusCode = statusCode;
        this.httpStatus = httpStatus;
        this.errors = errors

        // Fix the prototype chain (important when extending built-ins like Error)
        Object.setPrototypeOf(this, ApiError.prototype);

        Error.captureStackTrace(this, this.constructor);
    }

    static error(httpStatus: number, message: string, errors: any, statusCode: StatusCode = StatusCode.ERROR) {
        return new ApiError(httpStatus, statusCode, message, errors)
    }

    // 🔹 Proper JSON serialization (so `message` appears in res.json)
    toJSON() {
        return {
            httpStatus: this.httpStatus,
            statusCode: this.statusCode,
            message: this.message,
            errors: this.errors ?? null,
        };
    }
}


/* 

{
    "statusCode": 409,
    "message": "Email already in use",
    "errorCode": 4203
}

{
    "success": false,
    "statusCode": 4203
    "httpStatus": 409,
    "message": "Email already in use",
}

{
    "success": true,
    "data": {
        "id": "cmhd7k34u0000i9dn95huvmca",
        "name": "Mani3",
        "email": "mani3@example.com",
        "roles": [
            "USER"
        ]
    },
    "statusCode": null,
    "httpStatus": 201,
    "message": "Register Success"
}
*/