import { z } from "zod";


export const RegisterUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email").min(1, "Email is required"),
    password: z.string("Password is required").min(6, "Password must be at least 6 characters")
});

export type RegisterInput = z.infer<typeof RegisterUserSchema>

export const LoginSchema = z.object({
    email: z.email("Invalid email").min(1, "Email is required"),
    password: z.string("Password is required").min(6, "Password must be at least 6 characters")
});


export type LoginInput = z.infer<typeof LoginSchema>;


/* // Using PICK/OMIT
export const LoginSchema = CreateUserSchema.omit({
    name: true
});
*/