import AutoScalingStatus from "./AutoScalingStatus";
import CurrentMetrics from "./CurrentMetrics";
import SystemStats from "./SystemStats";

export default function Dashboard() {
  return (
    <main
      className="min-h-screen w-full bg-black flex flex-col items-center justify-start px-4 py-10 relative"
      style={{
        backgroundImage: "url(/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <header className="w-full max-w-6xl flex flex-col items-start mb-10">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          Auto Scale Dashboard
        </h1>
        <p className="text-lg text-neutral-400 font-medium">
          Modern, real-time metrics and scaling status
        </p>
      </header>
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <SystemStats />
        <AutoScalingStatus />
        <CurrentMetrics />
      </section>
    </main>
  );
}
