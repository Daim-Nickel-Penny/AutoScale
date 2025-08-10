import z from "zod";

export const LoadEventSchema = z.object({
  id: z.string(),
  timeStamp: z.date(),
  message: z.string(),
  encodedData: z.string().optional(), // this field wil lbe randomly added to some events to increase load
});

export type LoadEvent = z.infer<typeof LoadEventSchema>;
