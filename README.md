## Problem Statement

Modern distributed systems must dynamically adjust computing capacity based on fluctuating workloads and
resource utilization to maintain performance while minimizing cost.
In cloud platforms, this is achieved through **event-driven autoscaling**, where scaling decisions are triggered by real-time metrics such as:

- CPU load
- Memory consumption
- Request throughput

This project simulates an event-driven autoscaler using **Apache Kafka** as the messaging backbone:

- **Load Generator service**:
  - Produces synthetic load events (requests per second, CPU%, memory%) to a Kafka topic.
- **Hypervisor service**:
  - Consumes these events.
  - Applies configurable scaling rules.
  - Determines whether to scale the number of simulated worker instances up or down.
- **Scaling actions are inside load generator**:
  - All actions are logged.
  - Optionally persisted to a database for review.

**Goal:**  
Demonstrate how Kafka can be used to build a responsive control loop for infrastructure management, processing continuous metric streams and triggering scaling actions in near real-time.
