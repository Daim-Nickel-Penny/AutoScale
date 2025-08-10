import type { FastifyInstance } from "fastify";
import { currentMetricsController } from "../controllers/current-metrics/current-metrics.controller.js";

export const currentMetricsRoute = async (server: FastifyInstance) => {
  server.get("/current-metrics", currentMetricsController);
};
