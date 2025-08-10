"use client";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function SystemStats() {
  const { data } = useSWR("http://localhost:3001/system-stats", fetcher, {
    refreshInterval: 2000,
  });

  return (
    <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 flex flex-col items-center text-white">
      <div className="text-lg font-semibold mb-4 tracking-wide">
        System Stats
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between">
          <span>CPU Usage</span>
          <span>{data?.cpu ?? "-"}%</span>
        </div>
        <div className="flex justify-between">
          <span>Memory Usage</span>
          <span>{data?.memory ?? "-"}%</span>
        </div>
        <div className="flex justify-between">
          <span>Disk</span>
          <span>{data?.diskUsage ?? "-"}%</span>
        </div>
        <div className="flex justify-between">
          <span>Network</span>
          <span>{data?.network ?? "-"}</span>
        </div>
      </div>
    </div>
  );
}
