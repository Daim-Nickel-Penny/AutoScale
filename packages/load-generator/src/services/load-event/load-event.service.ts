import { store } from "../../utils/store.js";
import { shouldScaleUp, getNextInstance } from "../../utils/scale-up.js";
import {
  shouldScaleDown,
  getPreviousInstance,
} from "../../utils/scale-down.js";
import type { LoadEvent } from "../../types/load-event.js";

export const LoadEventService = (loadEvent: LoadEvent) => {
  try {
    const stats = store.systemStats;

    let eventStats: Record<string, unknown> = {};

    if (loadEvent.encodedData) {
      try {
        eventStats = JSON.parse(loadEvent.encodedData);
      } catch {}
    }

    stats.cpu = Math.min(
      100,
      Math.max(
        0,
        typeof eventStats["cpu"] === "number"
          ? eventStats["cpu"]
          : stats.cpu + Math.floor(Math.random() * 21 - 10)
      )
    );
    stats.memory = Math.min(
      100,
      Math.max(
        0,
        typeof eventStats["memory"] === "number"
          ? eventStats["memory"]
          : stats.memory + Math.floor(Math.random() * 21 - 10)
      )
    );
    stats.diskUsage = Math.min(
      100,
      Math.max(
        0,
        typeof eventStats["diskUsage"] === "number"
          ? eventStats["diskUsage"]
          : stats.diskUsage + Math.floor(Math.random() * 21 - 10)
      )
    );
    stats.network = Math.min(
      100,
      Math.max(
        0,
        typeof eventStats["network"] === "number"
          ? eventStats["network"]
          : stats.network + Math.floor(Math.random() * 21 - 10)
      )
    );

    const lastVm = store.vms[store.vms.length - 1];

    if (lastVm) {
      const currentInstance = lastVm.instanceName;

      if (shouldScaleUp()) {
        const next = getNextInstance(currentInstance);
        if (next) store.vms.push(next);
      } else if (shouldScaleDown()) {
        const prev = getPreviousInstance(currentInstance);
        if (prev && store.vms.length > 1) store.vms.pop();
      }
    }
  } catch (error) {
    throw error;
  }
};
