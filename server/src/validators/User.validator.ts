import z from 'zod';

export const registerUserSchema = z.object({
    name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),

    email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

    password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters long")
})

export const loginUserSchema = z.object({
    email: z
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),

    password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must be at most 100 characters long")
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;