import type { FastifyRequest, FastifyReply } from "fastify";
import { LoadEventService } from "../../services/load-event/load-event.service.js";
import { LoadEventSchema, type LoadEvent } from "../../types/load-event.js";

export const loadEventController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    console.log("Received load event:", request.body);

    const result = LoadEventSchema.safeParse(request.body);

    if (!result.success) {
      reply
        .status(400)
        .send({ error: "Invalid request body", issues: result.error.issues });
      return;
    }

    const loadEvent: LoadEvent = result.data;

    await LoadEventService(loadEvent);

    reply.send({ success: true });
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
};
