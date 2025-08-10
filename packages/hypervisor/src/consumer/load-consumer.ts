import { Kafka } from "kafkajs";
import { GROUP_IDS } from "../constants/group-ids.js";

const kafka = new Kafka({
  brokers: ["kafka:9092"],
  clientId: "hypervisor",
});

const consumer = kafka.consumer({ groupId: GROUP_IDS.HYPERVISOR });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "load-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value?.toString() || "{}");
      await fetch("http://load-generator:3001/load-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
    },
  });
}

startConsumer().catch(console.error);
