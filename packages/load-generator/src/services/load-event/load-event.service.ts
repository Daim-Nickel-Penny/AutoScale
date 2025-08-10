import { store } from "../../utils/store.js";
import { updateSystemResource } from "../../utils/update-system-resource.js";
import { shouldScaleUp, getNextInstance } from "../../utils/scale-up.js";
import {
  shouldScaleDown,
  getPreviousInstance,
} from "../../utils/scale-down.js";
import type { LoadEvent } from "../../types/load-event.js";

export const LoadEventService = (loadEvent: LoadEvent) => {
  try {
    let eventStats: Record<string, unknown> = {};

    if (loadEvent.encodedData) {
      try {
        eventStats = JSON.parse(loadEvent.encodedData);
      } catch {}
    }

    updateSystemResource({
      requests:
        typeof eventStats["requestPerSecond"] === "number"
          ? eventStats["requestPerSecond"]
          : 0,
    });

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
