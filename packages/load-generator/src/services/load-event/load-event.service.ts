import { store } from "../../utils/store.js";
import { updateSystemResource } from "../../utils/update-system-resource.js";
import type { LoadEvent } from "../../types/load-event.js";

export const LoadEventService = (loadEvent: LoadEvent) => {
  try {
    let eventStats: Record<string, unknown> = {};

    if (loadEvent.encodedData) {
      try {
        eventStats = JSON.parse(loadEvent.encodedData);
      } catch {}
    }

    // build payload only with defined numeric values
    const payload: {
      requests: number;
      cpu?: number;
      memory?: number;
      diskUsage?: number;
      network?: number;
    } = {
      requests:
        typeof eventStats["requestPerSecond"] === "number"
          ? (eventStats["requestPerSecond"] as number)
          : 0,
    };
    if (typeof eventStats["cpu"] === "number")
      payload.cpu = eventStats["cpu"] as number;
    if (typeof eventStats["memory"] === "number")
      payload.memory = eventStats["memory"] as number;
    if (typeof eventStats["diskUsage"] === "number")
      payload.diskUsage = eventStats["diskUsage"] as number;
    if (typeof eventStats["network"] === "number")
      payload.network = eventStats["network"] as number;
    updateSystemResource(payload);
  } catch (error) {
    throw error;
  }
};
