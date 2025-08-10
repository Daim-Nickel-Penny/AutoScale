import type { Scale } from "types/scale";
import type { SystemStats } from "types/system-stats";
import type { CurrentMetrics } from "types/current-metrics";

interface DataStore {
  vms: Scale[];
  systemStats: SystemStats;
  currentMetrics: CurrentMetrics;
  scalingActions: Scale[];
}

export const store: DataStore = {
  vms: [
    {
      instanceName: "nano-1",
      cpu: 5,
      memory: 10,
      disk: 10,
      network: 5,
    },
  ],
  systemStats: {
    cpu: 0,
    processes: 0,
    maxProcesses: 0,
    threads: 0,
    maxThreads: 0,
    memory: 0,
    maxMemory: 0,
    diskUsage: 0,
    maxDiskUsage: 0,
    network: 0,
    networkSpeed: 0,
  },
  currentMetrics: {
    requestPerSecond: 0,
    errorRate: 0,
    latency: 0,
  },
  scalingActions: [],
};
