import { store } from "./store.js";

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
export function updateSystemResource(request: { requests: number }) {
  const rps = request.requests;
  const prevStats = store.systemStats;
  const prevMetrics = store.currentMetrics;

  const cpu = calculateCPU(rps, prevStats.cpu);
  const memory = calculateMemory(rps, prevStats.memory);
  const diskUsage = calculateDiskUsage(rps, prevStats.diskUsage);
  const network = calculateNetwork(rps, prevStats.network);
  const threads = calculateThreads(rps, prevStats.threads);
  const processes = calculateProcesses(rps, prevStats.processes);
  const latency = calculateLatency(rps, prevMetrics.latency);
  const errorRate = calculateErrorRate(rps, prevMetrics.errorRate);

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
}
