import { CreateUserWithRolesInput } from "./admin.schema";
import prisma from "../../common/prisma/client";
import { BadRequestError, ConflictError } from "../../common/types/exceptions/errors";
import StatusCode from "../../common/types/constants/statusCode";
import { hash } from "bcrypt";

class AdminService {

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
            throw new ConflictError("Email already in use", StatusCode.USER_ALREADY_EXISTS)
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


}
// Export a singleton instance of the service
const adminService = new AdminService();
export default adminService