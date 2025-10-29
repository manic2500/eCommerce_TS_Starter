import { Request, Response } from "express";
import { CreateUserWithRolesInput } from "./user.schema";
import { userService } from "./user.service";



export const registerUserHandler = async (
    req: Request<{}, {}, CreateUserWithRolesInput>,
    res: Response) => {

    const userDto = await userService.createUser(req.body)

    res.status(201).json(userDto);

};