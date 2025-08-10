import type { FastifyInstance } from "fastify";
import { loadEventController } from "../controllers/load-event/load-event.controller.js";

export const loadEventRoute = async (server: FastifyInstance) => {
  server.post("/load-event", loadEventController);
};
