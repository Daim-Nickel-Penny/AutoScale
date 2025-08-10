import z from "zod";

export const CurrentMetricsSchema = z.object({
  requestPerSecond: z.number().int().nonnegative(),
  errorRate: z.number().min(0).max(100),
  latency: z.number().min(0),
});

export type CurrentMetrics = z.infer<typeof CurrentMetricsSchema>;
