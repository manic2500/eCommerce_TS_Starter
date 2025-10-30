
import { JwtPayload } from "../../common/types/express";
import { appConfig } from "../../common/config";
import { UserDto } from "../../common/types/user.dto";
import prisma from "../../common/prisma/client";
import { ConflictError, UnauthorizedError } from "../../common/types/exceptions/errors";
import bcrypt from "bcrypt";
import { RegisterInput } from "./public.schema";
import StatusCode from "../../common/types/constants/statusCode";
import { RegisteredUser, UserWithRoles } from "../shared/types/user";
import { getUserDto } from "../shared/mappers/user.mapper";


class PublicService {

    async registerUser(userRequest: RegisterInput) {
        const { email, name, password } = userRequest

        // Check if email already exists
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
            //return res.status(409).json({ message: "Email already in use" });
            throw new ConflictError("Email already in use", StatusCode.USER_ALREADY_EXISTS)
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const user: RegisteredUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roles: {
                    connect: {
                        name: 'USER'
                    }
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                roles: {
                    select: { name: true }
                }
            },
        });

        return user;

    };

    /**
    * Handles the core logic for user login.
    * @param email The user's email.
    * @param password The user's plaintext password.
    * @returns An object containing the user DTO and a JWT token. : Promise<{ user: UserDto; token: string }>     * 
    */
    async login(email: string, password: string) {
        // Find user by email with roles and permissions eagerly loaded
        const userWithRoles: UserWithRoles | null = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                roles: {
                    select: {
                        name: true,
                        permissions: { select: { name: true } }
                    }
                },
            },
            relationLoadStrategy: 'join',
        });

        if (!userWithRoles) {
            throw new UnauthorizedError('Invalid email or password.');
        }

        // Compare passwords asynchronously
        const passwordMatches = await bcrypt.compare(password, userWithRoles.password);
        if (!passwordMatches) {
            throw new UnauthorizedError('Invalid email or password.');
        }

        return userWithRoles
    }




}


// Export a singleton instance of the service
const publicService = new PublicService();
export default publicService


