import { Request, Response } from "express";
import { CreateUserWithRolesInput } from "./admin.schema";
import adminService from "./admin.service";
import { ApiResponse } from "../../common/types/apiResponse";



export const createUserHandler = async (
    req: Request<{}, {}, CreateUserWithRolesInput>,
    res: Response) => {

    const user = await adminService.createUser(req.body)

    const roles: string[] = user.roles.map(role => role.name);

    const apiResponse = ApiResponse.success(201, 'User created successfully', { ...user, roles })

    return res.status(apiResponse.HttpStatus).send(apiResponse)

};