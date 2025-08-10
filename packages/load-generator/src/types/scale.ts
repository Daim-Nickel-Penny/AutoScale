import z from "zod";

export const ScaleSchema = z.object({
  instanceName: z.string().min(2).max(100),
  cpu: z.number().min(0).max(100),
  memory: z.number().min(0).max(100),
  disk: z.number().min(0).max(100),
  network: z.number().min(0).max(100),
});

export type Scale = z.infer<typeof ScaleSchema>;
