import type { FastifyRequest, FastifyReply } from "fastify";
import { SystemStatsSchema, type SystemStats } from "types/system-stats";
import { SystemStatsService } from "../../services/system-stats/system-stats.service.js";

export const systemStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = SystemStatsSchema.safeParse(request.body);
    if (!result.success) {
      reply
        .status(400)
        .send({ error: "Invalid request body", issues: result.error.issues });
      return;
    }
    const systemStats: SystemStats = result.data;
    await SystemStatsService(systemStats);
    reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
