import { z } from "zod";

export const loginSchema = z.object({
    email:z
        .email("Invalid email"),
    
    password:z
        .string()
        .min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z.object({
    name:z.
        string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be at most 50 characters"),
    email:z
        .email("Invalid email format"),
    password:z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[a-zA-Z]/, 'Password must contain at least one letter'),
})

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;