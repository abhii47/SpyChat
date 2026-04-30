import { z } from "zod";

export const updateProfileSchema = z.object({
    name:z
        .string()
        .trim()
        .min(2, "Name must be atleast two characters")
        .max(50, "Name must be at most 50 characters")
        .optional(),

    email:z
        .email("Invalid email format")
        .toLowerCase()
        .optional()
}).refine(
    (data) => data.name !== undefined || data.email !== undefined,
    { message:"At least one field (name or email) is required" }
);

export const searchQuerySchema = z.object({
    name:z
        .string()
        .trim()
        .min(1, "Search query cannot be empty")
        .max(50, "Search query two long"),
    limit:z
        .string()
        .optional()
        .transform(val => val ? parseInt(val) : 10)
        .pipe(z.number().int().min(1).max(50)),
    offset:z
        .string()
        .optional()
        .transform(val => val ? parseInt(val) : 0)
        .pipe(z.number().int().min(0)),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;