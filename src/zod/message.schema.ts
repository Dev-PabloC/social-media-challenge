import { z } from "zod";

export const createMessageSchema = z.object({
  chatId: z.string().uuid(),
  content: z.string().min(1),
});

export const editMessageSchema = z.object({
  messageId: z.string().uuid(),
  content: z.string().min(1),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type EditMessageInput = z.infer<typeof editMessageSchema>;
