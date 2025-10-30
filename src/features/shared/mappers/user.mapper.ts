import { UserDto } from "../../../common/types/user.dto";
import { UserWithRoles } from "../types/user";



export function getUserDto(userWithRoles: UserWithRoles) {
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

    return userDto

}