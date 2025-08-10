import type { FastifyInstance } from "fastify";
import { scaleController } from "../controllers/scale/scale.controller.js";

export const scaleRoute = async (server: FastifyInstance) => {
  server.get("/scale", scaleController);
};
