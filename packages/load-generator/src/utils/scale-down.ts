import { store } from "./store.js";

// static VM tier definitions
import vmsList from "../data/vms.js";

const THRESHOLD = 0.1;

export function shouldScaleDown() {
  const { cpu, memory, diskUsage, network } = store.systemStats;
  return (
    cpu <= THRESHOLD * 100 &&
    memory <= THRESHOLD * 100 &&
    diskUsage <= THRESHOLD * 100 &&
    network <= THRESHOLD * 100
  );
}

export function getPreviousInstance(currentName: string) {
  const allTiers = vmsList;
  const idx = allTiers.findIndex((vm) => vm.instanceName === currentName);

  // if at lowest tier or not found, do not scale down
  if (idx <= 0) return null;

  return allTiers[idx - 1];
}
