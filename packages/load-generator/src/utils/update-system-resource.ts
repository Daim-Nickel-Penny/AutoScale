import { store } from "./store.js";
import { shouldScaleUp, getNextInstance } from "./scale-up.js";
import { shouldScaleDown, getPreviousInstance } from "./scale-down.js";

function smooth(prev: number, next: number, factor = 0.85) {
  return prev * factor + next * (1 - factor);
}

function randomFluctuation(base: number, range: number) {
  return base + (Math.random() - 0.5) * range;
}

function calculateCPU(requests: number, prev: number) {
  let base = Math.min(100, requests * 0.8);
  if (requests > 150) base += (requests - 150) * 0.2;
  if (requests < 10) base *= 0.5;
  base = randomFluctuation(base, 3 + Math.max(0, requests / 50));
  return Math.max(0, Math.min(100, Math.round(smooth(prev, base, 0.9))));
}

function calculateMemory(requests: number, prev: number) {
  let base = Math.min(100, requests * 0.6);
  if (requests > 120) base += (requests - 120) * 0.15;
  if (requests < 10) base *= 0.6;
  base = randomFluctuation(base, 3 + Math.max(0, requests / 60));
  return Math.max(0, Math.min(100, Math.round(smooth(prev, base, 0.9))));
}

function calculateDiskUsage(requests: number, prev: number) {
  let base = Math.min(100, requests * 0.25);
  if (requests > 100) base += (requests - 100) * 0.1;
  if (requests < 10) base *= 0.7;
  base = randomFluctuation(base, 2 + Math.max(0, requests / 80));
  return Math.max(0, Math.min(100, Math.round(smooth(prev, base, 0.9))));
}

function calculateNetwork(requests: number, prev: number) {
  let base = Math.min(100, requests * 0.3);
  if (requests > 120) base += (requests - 120) * 0.13;
  if (requests < 10) base *= 0.7;
  base = randomFluctuation(base, 3 + Math.max(0, requests / 70));
  return Math.max(0, Math.min(100, Math.round(smooth(prev, base, 0.9))));
}

function calculateThreads(requests: number, prev: number) {
  let base = Math.max(1, Math.round(requests / 1.8));
  if (requests > 120) base += Math.round((requests - 120) / 8);
  if (requests < 10) base = Math.max(1, base - 2);
  base = randomFluctuation(base, 2);
  return Math.max(1, Math.round(smooth(prev, base, 0.85)));
}

function calculateProcesses(requests: number, prev: number) {
  let base = Math.max(1, Math.round(requests / 5));
  if (requests > 100) base += Math.round((requests - 100) / 15);
  if (requests < 10) base = Math.max(1, base - 1);
  base = randomFluctuation(base, 1.5);
  return Math.max(1, Math.round(smooth(prev, base, 0.85)));
}

function calculateLatency(requests: number, prev: number) {
  let base = Math.max(1, 100 - requests * 0.5);
  if (requests > 120) base += (requests - 120) * 0.4;
  if (requests > 150) base += Math.random() * 20;
  if (requests < 10) base -= Math.random() * 8;
  base = randomFluctuation(base, 5);
  return Math.max(1, Math.round(smooth(prev, base, 0.85)));
}

function calculateErrorRate(requests: number, prev: number) {
  let base = Math.max(0, Math.random() * 1.5);
  if (requests > 100) base += (requests - 100) * 0.15 + Math.random() * 2;
  if (requests > 150) base += Math.random() * 8;
  if (requests < 10) base -= Math.random();
  base = Math.min(100, base);
  return Math.max(0, Math.round(smooth(prev, base, 0.8)));
}
export function updateSystemResource(request: {
  requests: number;
  cpu?: number;
  memory?: number;
  diskUsage?: number;
  network?: number;
}) {
  const rps = request.requests;
  const instanceCount = store.vms.length;
  const perInstanceRps = instanceCount > 0 ? rps / instanceCount : rps;
  const prevStats = store.systemStats;
  const prevMetrics = store.currentMetrics;

  const rawCpu =
    typeof request.cpu === "number"
      ? request.cpu
      : calculateCPU(perInstanceRps, prevStats.cpu);
  const rawMemory =
    typeof request.memory === "number"
      ? request.memory
      : calculateMemory(perInstanceRps, prevStats.memory);
  const rawDisk =
    typeof request.diskUsage === "number"
      ? request.diskUsage
      : calculateDiskUsage(perInstanceRps, prevStats.diskUsage);
  const rawNetwork =
    typeof request.network === "number"
      ? request.network
      : calculateNetwork(perInstanceRps, prevStats.network);
  const cpu = rawCpu;
  const memory = rawMemory;
  const diskUsage = rawDisk;
  const network = rawNetwork;
  const threads = calculateThreads(perInstanceRps, prevStats.threads);
  const processes = calculateProcesses(perInstanceRps, prevStats.processes);
  const latency = calculateLatency(perInstanceRps, prevMetrics.latency);
  const errorRate = calculateErrorRate(perInstanceRps, prevMetrics.errorRate);

  store.systemStats.cpu = cpu;
  store.systemStats.memory = memory;
  store.systemStats.diskUsage = diskUsage;
  store.systemStats.network = network;
  store.systemStats.threads = threads;
  store.systemStats.processes = processes;
  store.systemStats.maxThreads = Math.max(
    store.systemStats.maxThreads,
    threads
  );
  store.systemStats.maxProcesses = Math.max(
    store.systemStats.maxProcesses,
    processes
  );
  store.systemStats.maxMemory = Math.max(store.systemStats.maxMemory, memory);
  store.systemStats.maxDiskUsage = Math.max(
    store.systemStats.maxDiskUsage,
    diskUsage
  );
  store.systemStats.networkSpeed = Math.max(
    store.systemStats.networkSpeed,
    network
  );

  store.currentMetrics.requestPerSecond = rps;
  store.currentMetrics.latency = latency;
  store.currentMetrics.errorRate = errorRate;

  const lastVm = store.vms[store.vms.length - 1];
  if (lastVm) {
    const currentName = lastVm.instanceName;
    const upRaw =
      rawCpu >= 90 || rawMemory >= 90 || rawDisk >= 90 || rawNetwork >= 90;
    const downRaw =
      rawCpu <= 10 && rawMemory <= 10 && rawDisk <= 10 && rawNetwork <= 10;
    if (upRaw) {
      const next = getNextInstance(currentName);
      if (next) store.vms.push(next);
    } else if (downRaw && store.vms.length > 1) {
      const prev = getPreviousInstance(currentName);
      if (prev) store.vms.pop();
    } else {
      // random cycling fallback: 20% chance
      if (Math.random() < 0.2) {
        if (Math.random() < 0.5) {
          const nextForce = getNextInstance(currentName);
          if (nextForce) store.vms.push(nextForce);
        } else if (store.vms.length > 1) {
          const prevForce = getPreviousInstance(currentName);
          if (prevForce) store.vms.pop();
        }
      }
    }
  }
}
