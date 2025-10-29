import { z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email").min(1, "Email is required"),
    password: z.string("Password is required").min(6, "Password must be at least 6 characters")
});

// An optional schema for the user's roles, which is an array of strings
export const RolesSchema = z.array(z.string()).optional();

// The final schema for creating a user with roles, combining the base schema with the roles
export const CreateUserWithRolesSchema = CreateUserSchema.extend({
    roles: RolesSchema,
});

export type CreateUserWithRolesInput = z.infer<typeof CreateUserWithRolesSchema>;
