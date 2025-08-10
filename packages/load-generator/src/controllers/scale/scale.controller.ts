import type { FastifyRequest, FastifyReply } from "fastify";
import { ScaleSchema, type Scale } from "types/scale";
import { ScaleService } from "../../services/scale/scale.service.js";

export const scaleController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const result = ScaleSchema.safeParse(request.body);
    if (!result.success) {
      reply
        .status(400)
        .send({ error: "Invalid request body", issues: result.error.issues });
      return;
    }
    const scale: Scale = result.data;
    await ScaleService(scale);
    reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
