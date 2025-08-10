import { store } from "../../utils/store.js";

export const SystemStatsService = () => {
  try {
    return store.systemStats;
  } catch (error) {
    throw error;
  }
};
