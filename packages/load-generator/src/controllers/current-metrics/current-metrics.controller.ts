import type { FastifyRequest, FastifyReply } from "fastify";
import { CurrentMetricsService } from "../../services/current-metrics/current-metrics.service.js";

export const currentMetricsController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const metrics = CurrentMetricsService();
    reply.send(metrics);
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
