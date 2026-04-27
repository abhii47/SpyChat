import { z } from "zod";

export const startConversationSchema = z.object({
  receiverId: z
    .number("receiverId must be a number")
    .int()
    .positive("receiverId must be a positive integer"),
});

export type StartConversationInput = z.infer<typeof startConversationSchema>;