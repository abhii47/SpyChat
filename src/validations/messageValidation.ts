import { z } from "zod";

export const mediaUploadSchema = z.object({
  room_type: z.enum(["conversation", "group"], {
    message: "room_type must be 'conversation' or 'group'",
  }),

  room_id: z
    .string()
    .min(1, "room_id is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "room_id must be a positive number",
    })
    .transform(Number),
});

export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;