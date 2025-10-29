
export enum ErrorCode {
    // 4xxx series: Client-Side Errors
    // Group 4000-4099: Authentication & Authorization
    UNAUTHORIZED = 4001,
    FORBIDDEN = 4002,
    INCORRECT_PASSWORD = 4003,

    // Group 4100-4199: Request & Validation Issues
    BAD_REQUEST = 4100, // Malformed syntax
    //VALIDATION_FAILED = 4101,
    UNPROCESSABLE_ENTITY = 4102,

    // Group 4200-4299: Resource & State Issues
    NOT_FOUND = 4200,
    USER_NOT_FOUND = 4201,
    CONFLICT = 4202,
    USER_ALREADY_EXISTS = 4203,

    // 5xxx series: Server-Side Errors
    SERVER_ERROR = 5001,
}