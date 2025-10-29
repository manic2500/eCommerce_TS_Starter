import jwt, { Secret } from "jsonwebtoken";
import { JwtPayload } from "../../common/types/express";
import { appConfig } from "../../common/config";
import { UserDto } from "../../common/types/user.dto";
import prisma from "../../common/prisma/client";
import { UnauthorizedError } from "../../common/exceptions/errors";
import bcrypt from "bcrypt";

class AuthService {

    /**
    * Handles the core logic for user login.
    * @param email The user's email.
    * @param password The user's plaintext password.
    * @returns An object containing the user DTO and a JWT token.
    */
    async login(email: string, password: string): Promise<{ user: UserDto; token: string }> {
        // Find user by email with roles and permissions eagerly loaded
        const userWithRoles = await prisma.user.findUnique({
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

        // Use the extended toDto method for a clean DTO
        //const userDto = userWithRoles.toDto();

        // --- DTO Conversion and Flattening ---
        const roleNames: string[] = userWithRoles.roles.map(role => role.name);
        const permissionNames: string[] = userWithRoles.roles
            .flatMap(role => role.permissions)
            .map(permission => permission.name);

        const userDto: UserDto = {
            id: userWithRoles.id,
            name: userWithRoles.name,
            email: userWithRoles.email,
            roles: roleNames,
            permissions: [...new Set(permissionNames)], // Use a Set for unique permissions
        };

        // Generate JWT token
        const payload: JwtPayload = {
            userId: userDto.id,
            roles: userDto.roles,
            permissions: userDto.permissions
        };
        const token = this.signToken(payload);

        return {
            user: userDto,
            token,
        };
    }


    signToken(payload: JwtPayload) {
        // 1. Check for the secret and throw an error if it's missing (runtime safety)
        /* if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not set in environment");
        } */
        if (!appConfig.JWT_SECRET) {
            throw new Error("JWT_SECRET is not set in environment");
        }

        const expiresInValue: string | number = appConfig.JWT_EXPIRES_IN || "1h";

        return jwt.sign(payload, appConfig.JWT_SECRET, {
            expiresIn: expiresInValue,
        } as jwt.SignOptions);
    };
}


// Export a singleton instance of the service
export const authService = new AuthService();

