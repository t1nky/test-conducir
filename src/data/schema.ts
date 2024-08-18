import * as z from "zod";

export const ResponseSchema = z.object({
  correct: z.boolean().optional(),
  text: z.string(),
});
export type Response = z.infer<typeof ResponseSchema>;

export const QuestionSchema = z.object({
  img: z.string().optional(),
  responses: z.array(ResponseSchema),
  text: z.string(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const QuestionsSchema = z.object({
  questions: z.array(QuestionSchema),
});
export type Questions = z.infer<typeof QuestionsSchema>;
