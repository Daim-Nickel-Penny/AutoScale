import type { FastifyInstance } from "fastify";
import { systemStatsController } from "../controllers/system-stats/system-stats.controller.js";

export const systemStatsRoute = async (server: FastifyInstance) => {
  server.get("/system-stats", systemStatsController);
};
