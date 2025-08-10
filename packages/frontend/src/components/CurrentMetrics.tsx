"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CurrentMetrics() {
  const { data } = useSWR("http://localhost:3001/current-metrics", fetcher, {
    refreshInterval: 2000,
  });
  return (
    <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 flex flex-col items-center text-white">
      <div className="text-lg font-semibold mb-4 tracking-wide">
        Current Metrics
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between">
          <span>Requests/sec</span>
          <span>{data?.requestPerSecond ?? "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Avg Latency</span>
          <span>{data?.latency ?? "-"} ms</span>
        </div>
        <div className="flex justify-between">
          <span>Error Rate</span>
          <span>{data?.errorRate ?? "-"}%</span>
        </div>
      </div>
    </div>
  );
}
