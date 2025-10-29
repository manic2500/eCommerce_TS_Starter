import { UserDto } from '../../common/types/user.dto';
import { Prisma } from '../../generated/prisma/client';



export type UserWithRelations = Prisma.UserGetPayload<{
    include: {
        roles: {
            include: {
                permissions: true;
            };
        };
    };
}>;

export const userExtension = Prisma.defineExtension({
    result: {
        user: {
            toDto: {
                needs: { id: true, name: true, email: true }, // 'needs' only requires scalar fields
                compute(user) {
                    return (): UserDto => {
                        const userWithRelations = user as UserWithRelations;

                        // Check if roles were included and flatten them into a string array
                        const roles = userWithRelations.roles
                            ? userWithRelations.roles.map(role => role.name)
                            : [];

                        // Collect all unique permissions from all roles
                        const allPermissions = new Set<string>();
                        if (userWithRelations.roles) {
                            userWithRelations.roles.forEach(role => {
                                if (role.permissions) {
                                    role.permissions.forEach(permission => {
                                        allPermissions.add(permission.name);
                                    });
                                }
                            });
                        }

                        return {
                            id: userWithRelations.id,
                            name: userWithRelations.name,
                            email: userWithRelations.email,
                            roles: roles,
                            permissions: Array.from(allPermissions),
                        };
                    };
                },
            },
        },
    },
});



/* import { UserDto } from '../../types/userDto';
import { Prisma, User } from '../../generated/prisma/client';


// Define the shape of a User query that includes roles and permissions
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        permissions: true;
      };
    };
  };
}>;

// In your $extends method, use the appropriate extension component or components (model, client, result or query).

// Define the Prisma extension
export const userExtension = Prisma.defineExtension({
  result: {
    user: {
      toDto: {
        //needs: { id: true, name: true, email: true }, // Specify the fields needed for the computation
        compute(user) {
          // This method is added to every User object returned by a query
          return (): UserDto => {

            const userWithRelations = user as UserWithRelations;

            const roles = userWithRelations.roles
              ? userWithRelations.roles.map(role => ({
                id: role.id,
                name: role.name,
                permissions: role.permissions
                  ? role.permissions.map(p => ({
                    id: p.id,
                    name: p.name,
                  }))
                  : [],
              }))
              : [];

            return {
              id: userWithRelations.id,
              name: userWithRelations.name,
              email: userWithRelations.email,
              roles: roles,
            };

          };
        },
      },
    },
  },
});
*/
/*  DOESN'T WORK
model:{
    user:{
      toDto:{
        compute(user: User){
          return (): UserDto => ({
            id: user.id,
            name: user.name,
            email: user.email,
          });
        }
      }
    }
  },
*/