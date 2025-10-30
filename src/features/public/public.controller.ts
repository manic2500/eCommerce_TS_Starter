import { Request, RequestHandler, Response } from "express";
import { LoginInput, RegisterInput } from "./public.schema";
import publicService from "./public.service";
import { ApiResponse } from "../../common/types/apiResponse";
import { setAuthCookie } from "../shared/utils";
import { UserDto } from "../../common/types/user.dto";
import { appConfig } from "../../common/config";
import { JwtPayload } from "../../common/types/express";
import jwt from "jsonwebtoken";
import { getUserDto } from "../shared/mappers/user.mapper";


export const registerUserHandler = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response) => {

    const user = await publicService.registerUser(req.body)

    const roles: string[] = user.roles.map(role => role.name);

    const apiResponse = ApiResponse.success(201, 'Register Success', { ...user, roles })

    return res.status(apiResponse.HttpStatus).send(apiResponse)

};

export const loginHandler = async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const { email, password } = req.body;

    const userWithRoles = await publicService.login(email, password);

    const user = getUserDto(userWithRoles)

    // Generate JWT token        
    const token = signToken(user);

    // ✅ set HttpOnly cookie
    setAuthCookie({ res, name: 'token', value: token, });

    const apiResponse = ApiResponse.success(200, 'Login Success', { user, token })
    return res.status(apiResponse.HttpStatus).send(apiResponse)

};


const signToken = (userDto: UserDto) => {

    if (!appConfig.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment");
    }

    const payload: JwtPayload = {
        userId: userDto.id,
        roles: userDto.roles,
        permissions: userDto.permissions
    };

    const expiresInValue: string | number = appConfig.JWT_EXPIRES_IN || "1h";

    return jwt.sign(payload, appConfig.JWT_SECRET, {
        expiresIn: expiresInValue,
    } as jwt.SignOptions);
};