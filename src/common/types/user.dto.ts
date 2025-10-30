export interface UserDto {
    id: string,
    name: string,
    email: string,
    roles: string[]; // Flattened array of role names
    permissions: string[]; // Flattened array of all permissions
}

/* export interface UserWithRoles extends UserDto {
    roles: string[]; // Flattened array of role names
}
export interface UserWithRolesPermissions extends UserWithRoles {
    permissions: string[]; // Flattened array of all permissions
}
 */
/* 

roles?: { // Make the roles optional
        id: string;
        name: string;
        permissions: {
            id: string;
            name: string;
        }[];
    }[];
*/
