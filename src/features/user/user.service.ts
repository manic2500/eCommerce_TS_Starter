import { Request } from "express";
import { CreateUserWithRolesInput } from "./user.schema";
import prisma from "../../common/prisma/client";
import { BadRequestError, ConflictError } from "../../common/exceptions/errors";
import { ErrorCode } from "../../common/exceptions/errorCode";
import { hash } from "bcrypt";

class UserService {

    async createUser(userRequest: CreateUserWithRolesInput) {
        const { email, name, password, roles } = userRequest

        // Find the existing role records based on the provided names
        const existingRoles = roles ? await prisma.role.findMany({
            where: {
                name: { in: roles },
            },
        }) : [];

        // Optional: Check if all provided roles exist
        if (roles && existingRoles.length !== roles.length) {
            // Handle case where one or more roles don't exist
            throw new BadRequestError('One or more roles do not exist.')
        }

        // Check if email already exists
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
            //return res.status(409).json({ message: "Email already in use" });
            throw new ConflictError("Email already in use", ErrorCode.USER_ALREADY_EXISTS)
        }

        // Encrypt password
        const hashedPassword = await hash(password, 10)

        // Create new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roles: {
                    connect: existingRoles.map(role => ({ id: role.id })),
                },
            },
            include: { roles: true },
        });

        return user.toDto();

    };

    async fetchUserWithRoles(userId: string) {
        const userWithRoles = await prisma.user.findFirst({
            where: { id: userId },
            include: {
                roles: { include: { permissions: true } },
            },
        });
        return userWithRoles
    }
}
// Export a singleton instance of the service
export const userService = new UserService();