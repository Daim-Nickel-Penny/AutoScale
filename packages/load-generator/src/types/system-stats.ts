import z from "zod";

export const SystemStatsSchema = z.object({
  cpu: z.number().min(0).max(100),
  processes: z.number().int().nonnegative(),
  maxProcesses: z.number().int().nonnegative(),
  threads: z.number().int().nonnegative(),
  maxThreads: z.number().int().nonnegative(),
  memory: z.number().min(0).max(100),
  maxMemory: z.number().int().nonnegative(),
  diskUsage: z.number().min(0).max(100),
  maxDiskUsage: z.number().int().nonnegative(),
  network: z.number().min(0).max(100),
  networkSpeed: z.number().int().nonnegative(),
});

export type SystemStats = z.infer<typeof SystemStatsSchema>;
