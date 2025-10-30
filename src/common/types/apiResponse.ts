import StatusCode from "./constants/statusCode"

export class ApiResponse {
    private success: boolean
    private httpStatus: number
    private message: string
    private statusCode: StatusCode
    private data: any

    constructor(success: boolean, httpStatus: number, statusCode: StatusCode, message: string, data: any) {
        this.success = success
        this.data = data
        this.statusCode = statusCode
        this.httpStatus = httpStatus
        this.message = message
    }


    public get HttpStatus(): number {
        return this.httpStatus
    }


    static success(httpStatus: number, message: string, data: any, statusCode: StatusCode = StatusCode.SUCCESS,) {
        return new ApiResponse(true, httpStatus, statusCode, message, data)
    }

}