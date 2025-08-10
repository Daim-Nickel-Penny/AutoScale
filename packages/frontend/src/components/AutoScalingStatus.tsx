"use client";
import useSWR from "swr";
import vms from "../data/vms";
import { useRef } from "react";

export default function AutoScalingStatus() {
  const { data } = useSWR(
    "http://localhost:3001/system-stats",
    (url) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 500,
    }
  );
  const prevCpu = useRef<number[]>([]);
  const prevInstanceIdx = useRef<number>(0);
  const instanceCount = data?.maxThreads ?? 1;
  let status = "steady";
  let statusColor = "text-neutral-400";

  let currentIdx = 0;
  if (data?.cpu !== undefined && data?.memory !== undefined) {
    currentIdx = vms.findIndex(
      (vm) => vm.cpu >= data.cpu && vm.memory >= data.memory
    );
    if (currentIdx === -1) {
      currentIdx = vms.length - 1;
    }
  }

  if (data?.cpu !== undefined) {
    prevCpu.current.push(data.cpu);
    if (prevCpu.current.length > 2) prevCpu.current.shift();
  }

  let displayInstanceIdx = currentIdx;
  let instanceChanged = false;
  if (prevCpu.current.length === 2) {
    const [prev, curr] = prevCpu.current;
    const diff = curr - prev;
    const percent = prev !== 0 ? Math.abs(diff) / prev : 0;
    if (percent < 0.1) {
      status = "steady";
      statusColor = "text-blue-500";
    } else if ((prev < 60 && curr >= 60) || (prev >= 60 && curr >= 60)) {
      status = "scaled up";
      statusColor = "text-green-500";
      if (currentIdx < vms.length - 1) {
        displayInstanceIdx = currentIdx + 1;
        instanceChanged = true;
      }
    } else if (diff < 0 && percent >= 0.1) {
      status = "scaled down";
      statusColor = "text-red-500";
      if (currentIdx > 0) {
        displayInstanceIdx = currentIdx - 1;
        instanceChanged = true;
      }
    } else {
      status = "steady";
      statusColor = "text-neutral-400";
    }
  }
  prevInstanceIdx.current = displayInstanceIdx;
  const currentInstance = vms[displayInstanceIdx];

  return (
    <section className="bg-neutral-950/20 bg-opacity-70 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-start text-white w-full border border-none overflow-hidden">
      <h2 className="text-lg font-bold mb-3 tracking-tight text-white">
        Auto Scaling
      </h2>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Status</span>
          <span className={statusColor}>{status}</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Instances</span>
          <span>{instanceCount}</span>
        </div>
        <div className="flex justify-between text-sm font-medium items-center">
          <span className="text-neutral-400">Current Instance</span>
          <span
            className={`font-bold transition-all duration-300 ${
              instanceChanged ? "bg-green-500 text-black px-2 py-1 rounded" : ""
            }`}
            style={{
              maxWidth: "120px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {currentInstance.instanceName}
          </span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">CPU</span>
          <span>{currentInstance.cpu}</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Memory</span>
          <span>{currentInstance.memory}</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Disk</span>
          <span>{currentInstance.disk}</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-neutral-400">Network</span>
          <span>{currentInstance.network}</span>
        </div>
      </div>
    </section>
  );
}
