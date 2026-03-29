import { z } from "zod";

export const createChatSchema = z.object({
  title: z.string().min(1).optional(),
  participants: z.array(z.string().uuid()).optional(),
});

export const addParticipantSchema = z.object({
  chatId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type CreateChatInput = z.infer<typeof createChatSchema>;
export type AddParticipantInput = z.infer<typeof addParticipantSchema>;
