import { Kafka } from "kafkajs";

const kafka = new Kafka({
  brokers: ["kafka:9092"],
  clientId: "hypervisor",
});

const producer = kafka.producer();

async function startProducer() {
  await producer.connect();

  async function sendEvent() {
    try {
      const event = {
        id: Date.now().toString(),
        timeStamp: new Date().toISOString(),
        message: "Synthetic load event from hypervisor",
        encodedData: JSON.stringify({
          requestPerSecond: Math.floor(Math.random() * 50000),
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
      // console.log("Event sent:", event);
    } catch (err) {
      console.error("Producer error:", err);
    }
    const LOWER_DELAY = 10;
    const UPPER_DELAY = 5000;
    const nextDelay =
      Math.floor(Math.random() * (UPPER_DELAY - LOWER_DELAY + 1)) + LOWER_DELAY;
    setTimeout(sendEvent, nextDelay);
  }

  sendEvent();
}

startProducer().catch(console.error);
