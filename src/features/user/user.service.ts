import { Request } from "express";
import prisma from "../../common/prisma/client";
import { BadRequestError, ConflictError } from "../../common/types/exceptions/errors";
import StatusCode from "../../common/types/constants/statusCode";
import { hash } from "bcrypt";

class UserService {


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
const userService = new UserService();
export default userService