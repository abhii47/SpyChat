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

export const SendMessageSchema = z
  .object({
    conversation_id: z.coerce
      .number()
      .int()
      .positive("conversation_id must be a positive number")
      .optional(),

    group_id: z.coerce
      .number()
      .int()
      .positive("group_id must be a positive number")
      .optional(),

    content: z
      .string()
      .trim()
      .min(1, "content is required"),

    type: z.enum(["text", "media"], {
      message: "type must be 'text' or 'media'",
    })
  })
  .superRefine((data, ctx) => {
    // 1. At least one of conversation_id or group_id
    if (!data.conversation_id && !data.group_id) {
      ctx.addIssue({
        code: "custom",
        message: "Either conversation_id or group_id is required",
        path: ["conversation_id"],
      });
    } 
  });

export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;