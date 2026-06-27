"use client";

import { useEffect, useRef, useState } from "react";

export default function CamperdownDashboard() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
        setLastRefresh(new Date());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-md md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Camperdown Operations Dashboard
            </h1>

            <p className="mt-1 text-slate-500">Live Shuttle Operations</p>
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-600">
            Last refreshed
            <br />
            <span className="font-semibold">
              {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Dashboard */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <iframe
            ref={iframeRef}
            src="https://creatorapp.zohopublic.com/makatu/pod-application/page-embed/Camperdown_Dashboard/VRrHsH7wC1E1N6Vv30HVE7jvpOy1Ea1XCFfWXu8j5J2SHJjRWf33FO7631wy1fWq67qB8GbAROeNbzYE9MPAYH1rW9fkedTvfJg6"
            title="Camperdown Dashboard"
            className="h-[85vh] w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </main>
  );
}
