import type { CurrentMetrics } from "../../types/current-metrics.js";
import { store } from "../../utils/store.js";

export const CurrentMetricsService = (): CurrentMetrics => {
  try {
    return store.currentMetrics;
  } catch (error) {
    throw error;
  }
};
