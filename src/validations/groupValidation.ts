import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Group name must be at least 2 characters")
    .max(80, "Group name must be at most 80 characters"),

  description: z
    .string()
    .trim()
    .max(255, "Description too long")
    .optional(),

  memberIds: z
    .string("memberIds is required")
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    }, "member_ids must be a valid JSON array of user IDs e.g. [2,3,4]"),
});

export const addMemberSchema = z.object({
  user_id: z
    .number("user_id must be a number")
    .int()
    .positive("user_id must be a positive integer"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;