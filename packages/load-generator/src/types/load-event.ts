import z from "zod";

export const LoadEventSchema = z.object({
  id: z.string(),
  timeStamp: z.string().transform((val) => new Date(val)),
  message: z.string(),
  encodedData: z.string().optional(),
});

export type LoadEvent = z.infer<typeof LoadEventSchema>;
