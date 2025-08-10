import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadEventRoute } from "./routes/load-event.route.js";
import { currentMetricsRoute } from "./routes/current-metrics.route.js";
import { scaleRoute } from "./routes/scale.route.js";
import { systemStatsRoute } from "./routes/system-stats.route.js";

const fastify = Fastify({ logger: true });
await fastify.register(cors, { origin: true });

fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

await loadEventRoute(fastify);
await currentMetricsRoute(fastify);
await scaleRoute(fastify);
await systemStatsRoute(fastify);

try {
  await fastify.listen({ port: 3001, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
