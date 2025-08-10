import { store } from "./store.js";

const THRESHOLD = 0.9;

export function shouldScaleUp() {
  const { cpu, memory, diskUsage, network } = store.systemStats;
  return (
    cpu >= THRESHOLD * 100 ||
    memory >= THRESHOLD * 100 ||
    diskUsage >= THRESHOLD * 100 ||
    network >= THRESHOLD * 100
  );
}

export function getNextInstance(currentName: string) {
  const vms = store.vms;

  const idx = vms.findIndex((vm) => vm.instanceName === currentName);

  if (idx < 0 || idx === vms.length - 1) return vms[idx] || null;

  return vms[idx + 1];
}
