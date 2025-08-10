import type { FastifyRequest, FastifyReply } from "fastify";
import {
  CurrentMetricsSchema,
  type CurrentMetrics,
} from "types/current-metrics";
import { CurrentMetricsService } from "../../services/current-metrics/current-metrics.service.js";

export const currentMetricsController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = CurrentMetricsSchema.safeParse(request.body);
    if (!result.success) {
      reply
        .status(400)
        .send({ error: "Invalid request body", issues: result.error.issues });
      return;
    }
    const currentMetrics: CurrentMetrics = result.data;
    await CurrentMetricsService(currentMetrics);
    reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
