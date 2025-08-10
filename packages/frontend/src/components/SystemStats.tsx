"use client";
import useSWR from "swr";
import { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export default function SystemStats() {
  const { data } = useSWR(
    "http://localhost:3001/system-stats",
    (url) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 500,
    }
  );
  const cpuHistory = useRef<number[]>([]);
  if (data?.cpu !== undefined) {
    cpuHistory.current.push(data.cpu);
    if (cpuHistory.current.length > 10) cpuHistory.current.shift();
  }

  let lineColor = "#3b82f6"; // default blue
  let bgColor = "rgba(59,130,246,0.2)";
  if (cpuHistory.current.length > 1) {
    const prev = cpuHistory.current[cpuHistory.current.length - 2];
    const curr = cpuHistory.current[cpuHistory.current.length - 1];
    if (curr > 80) {
      lineColor = "#ef4444"; // red-500
      bgColor = "rgba(239,68,68,0.2)";
    } else if (curr < 10) {
      lineColor = "#3b82f6"; // blue-500
      bgColor = "rgba(59,130,246,0.2)";
    } else if (curr > prev) {
      lineColor = "#22c55e"; // green-500
      bgColor = "rgba(34,197,94,0.2)";
    } else if (curr < prev) {
      lineColor = "#ef4444"; // red-500
      bgColor = "rgba(239,68,68,0.2)";
    }
  }

  return (
    <section className="bg-neutral-950/20 bg-opacity-70 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-start text-white w-full border border-none overflow-hidden">
      <h2 className="text-lg font-bold mb-3 tracking-tight text-white">
        System Stats
      </h2>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">CPU Usage</span>
          <span
            className={
              data?.cpu > 80
                ? "text-red-500"
                : data?.cpu < 10
                ? "text-blue-500"
                : "text-neutral-100"
            }
          >
            {data?.cpu ?? "-"}%
          </span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Memory Usage</span>
          <span
            className={
              data?.memory > 80
                ? "text-red-500"
                : data?.memory < 10
                ? "text-blue-500"
                : "text-neutral-100"
            }
          >
            {data?.memory ?? "-"}%
          </span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Disk</span>
          <span
            className={
              data?.diskUsage > 80
                ? "text-red-500"
                : data?.diskUsage < 10
                ? "text-blue-500"
                : "text-neutral-100"
            }
          >
            {data?.diskUsage ?? "-"}%
          </span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Network</span>
          <span
            className={
              data?.network > 80
                ? "text-red-500"
                : data?.network < 10
                ? "text-blue-500"
                : "text-neutral-100"
            }
          >
            {data?.network ?? "-"}
          </span>
        </div>
      </div>
      <div className="mt-4 w-full h-36 flex items-center justify-center bg-black/20 rounded-xl border border-none shadow-md overflow-hidden">
        <Line
          data={{
            labels: cpuHistory.current.map((_, i) => `T-${10 - i}`),
            datasets: [
              {
                label: "CPU Usage %",
                data: cpuHistory.current,
                tension: 0.4,
                segment: {
                  borderColor: (ctx) => {
                    const i = ctx.p1DataIndex;
                    const val = cpuHistory.current[i];
                    const prev = cpuHistory.current[i - 1];
                    if (val > 80) return "#ef4444"; // red
                    if (val < 10) return "#3b82f6"; // blue
                    if (prev !== undefined && val > prev) return "#22c55e"; // green
                    if (prev !== undefined && val < prev) return "#ef4444"; // red
                    return "#3b82f6"; // blue
                  },
                  backgroundColor: (ctx) => {
                    const i = ctx.p1DataIndex;
                    const val = cpuHistory.current[i];
                    const prev = cpuHistory.current[i - 1];
                    if (val > 80) return "rgba(239,68,68,0.2)";
                    if (val < 10) return "rgba(59,130,246,0.2)";
                    if (prev !== undefined && val > prev)
                      return "rgba(34,197,94,0.2)";
                    if (prev !== undefined && val < prev)
                      return "rgba(239,68,68,0.2)";
                    return "rgba(59,130,246,0.2)";
                  },
                },
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
                max: 100,
                title: {
                  display: true,
                  text: "CPU Usage (%)",
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
