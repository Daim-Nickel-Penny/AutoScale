import type { FastifyInstance } from "fastify";
import { loadEventController } from "../controllers/load-event.controller.js";

export const loadEventRoute = async (server: FastifyInstance) => {
  server.get("/load-event", loadEventController);
};
