import { Prisma } from "../../../generated/prisma/client";

// Include
export type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        roles: {
            include: {
                permissions: true;
            };
        };
    };
}>;

// Select
export type UserWithRoles = Prisma.UserGetPayload<{
    select: {
        id: true;
        name: true;
        email: true;
        password: true;
        roles: {
            select: {
                name: true;
                permissions: {
                    select: { name: true };
                };
            };
        };
    };
}>;

export type RegisteredUser = Prisma.UserGetPayload<{
    select: {
        id: true;
        name: true;
        email: true;
        roles: {
            select: { name: true };
        };
    };
}>;
