"use client";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function AutoScalingStatus() {
  const { data } = useSWR("http://localhost:3001/scale", fetcher, {
    refreshInterval: 2000,
  });
  return (
    <div className="bg-neutral-900 rounded-2xl shadow-lg p-8 flex flex-col items-center text-white">
      <div className="text-lg font-semibold mb-4 tracking-wide">
        Auto Scaling
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between">
          <span>Status</span>
          <span>{data?.status ?? "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Instances</span>
          <span>{data?.instances ?? "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Action</span>
          <span>{data?.lastAction ?? "-"}</span>
        </div>
      </div>
    </div>
  );
}
