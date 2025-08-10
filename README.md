## AutoScale: Kafka Autoscaling Demo

<video src="./demo.mp4" controls width="600"></video>

### Tech Stack

- KafkaJS
- Fastify
- Next.js
- TypeScript
- Docker
- Zod

Wanted to learn Kafka and autoscaling. Built this to see how scaling works with real events.

### What It Does

- Generates load events and sends to Kafka
- Hypervisor consumes events and decides scaling
- Logs scaling actions
- Runs in Docker

### Why

- Test autoscaling logic
- See Kafka in action
- Mock environment

### How to Run

1. If you've run it before, do:

```bash
docker compose down
```

2. Start everything:

```bash
docker-compose up --build
```

3. In a new terminal, start the frontend:

```bash
cd packages/frontend
npm run dev
```

Frontend runs outside Docker for hot reload. Backend services run in Docker.

### Notes

- This is a mock environment no real cloud infra.
- Scaling logic is custom, just to see how it works.
- All actions are logged, can be reviewed.

---

This project is just me experimenting with autoscaling and Kafka. If you want to see how event-driven scaling works, clone and run it.
