import { Kafka } from "kafkajs";

const kafka = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "hypervisor",
});

const producer = kafka.producer();

async function startProducer() {
  await producer.connect();

  setInterval(async () => {
    try {
      const event = {
        id: Date.now().toString(),
        timeStamp: new Date(),
        message: "Synthetic load event from hypervisor",
        encodedData: JSON.stringify({
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          diskUsage: Math.floor(Math.random() * 100),
          network: Math.floor(Math.random() * 100),
        }),
      };
      await producer.send({
        topic: "load-events",
        messages: [{ value: JSON.stringify(event) }],
      });
      console.log("Event sent:", event);
    } catch (err) {
      console.error("Producer error:", err);
    }
  }, 1000);
}

startProducer().catch(console.error);
