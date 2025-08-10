import AutoScalingStatus from "./AutoScalingStatus";
import CurrentMetrics from "./CurrentMetrics";
import SystemStats from "./SystemStats";

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center gap-8 px-8 py-12">
      <div className="w-full max-w-6xl grid grid-cols-3 gap-8">
        <SystemStats />
        <AutoScalingStatus />
        <CurrentMetrics />
      </div>
    </div>
  );
}
