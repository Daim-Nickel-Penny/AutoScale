import type { SystemStats } from "../../types/system-stats.js";
import { store } from "../../utils/store.js";

export const SystemStatsService = (): SystemStats => {
  try {
    return store.systemStats;
  } catch (error) {
    throw error;
  }
};
