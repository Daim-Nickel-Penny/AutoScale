import type { FastifyRequest, FastifyReply } from "fastify";
import { SystemStatsService } from "../../services/system-stats/system-stats.service.js";

export const systemStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const stats = SystemStatsService();
    reply.send(stats);
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
