"use client";
import useSWR from "swr";
import { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CurrentMetrics() {
  const { data } = useSWR(
    "http://localhost:3001/current-metrics",
    (url) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 500,
    }
  );
  const reqHistory = useRef<number[]>([]);
  if (data?.requestPerSecond !== undefined) {
    reqHistory.current.push(data.requestPerSecond);
    if (reqHistory.current.length > 10) reqHistory.current.shift();
  }

  let barColor = "#22c55e"; // green
  if (reqHistory.current.length > 1) {
    const prev = reqHistory.current[reqHistory.current.length - 2];
    const curr = reqHistory.current[reqHistory.current.length - 1];
    const diff = curr - prev;
    const percent = prev !== 0 ? Math.abs(diff) / prev : 0;
    if (percent < 0.1) {
      barColor = "#3b82f6"; // blue-500
    } else if (diff < 0 && percent >= 0.1) {
      barColor = "#ef4444"; // red-500
    } else if (diff > 0 && percent >= 0.1) {
      barColor = "#22c55e"; // green-500
    }
  }

  return (
    <section className="bg-neutral-950/20 bg-opacity-70 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-start text-white w-full border border-none overflow-hidden">
      <h2 className="text-lg font-bold mb-3 tracking-tight text-white">
        Current Metrics
      </h2>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Requests/sec</span>
          <span>{data?.requestPerSecond ?? "-"}</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Avg Latency</span>
          <span>{data?.latency ?? "-"} ms</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Error Rate</span>
          <span>{data?.errorRate ?? "-"}%</span>
        </div>
      </div>
      <div className="mt-4 w-full h-36 flex items-center justify-center bg-black/20 rounded-xl border border-none shadow-md overflow-hidden">
        <Bar
          data={{
            labels: reqHistory.current.map((_, i) => `T-${10 - i}`),
            datasets: [
              {
                label: "Requests/sec",
                data: reqHistory.current,
                backgroundColor: barColor,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                labels: { color: "#fff", font: { size: 12 } },
              },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: "Time",
                  color: "#fff",
                  font: { weight: "bold", size: 12 },
                },
                ticks: { color: "#a3a3a3", font: { size: 10 } },
              },
              y: {
                display: true,
                min: 0,
                title: {
                  display: true,
                  text: "Requests/sec",
                  color: "#fff",
                  font: { weight: "bold", size: 12 },
                },
                ticks: { color: "#a3a3a3", font: { size: 10 } },
              },
            },
          }}
        />
      </div>
    </section>
  );
}
