import { store } from "./store.js";
// static VM tier definitions
import vmsList from "../data/vms.js";

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
  const allTiers = vmsList;
  const idx = allTiers.findIndex((vm) => vm.instanceName === currentName);
  // if not found or at highest tier, cannot scale up
  if (idx < 0 || idx === allTiers.length - 1) return null;
  return allTiers[idx + 1];
}
