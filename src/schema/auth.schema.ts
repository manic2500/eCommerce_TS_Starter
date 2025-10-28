import { z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email").min(1, "Email is required"),
    password: z.string("Password is required").min(6, "Password must be at least 6 characters")
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Using PICK/OMIT
export const LoginSchema = CreateUserSchema.pick({
    email: true,
    password: true
});

/* // Using OMIT
export const LoginSchema = CreateUserSchema.omit({
    name: true
});
*/
export type LoginInput = z.infer<typeof LoginSchema>;
