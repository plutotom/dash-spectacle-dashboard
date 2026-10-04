"use client";

import { useConvexConnectionState } from "convex/react";
import { useEffect, useState } from "react";
import { TimedNotice } from "@/components/errors/TimedNotice";

export function ConnectionStatus() {
  const { isWebSocketConnected, hasEverConnected } = useConvexConnectionState();
  const [unavailableSince, setUnavailableSince] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.dataset.dashboardReady = "true";
    window.dispatchEvent(new Event("dashboard-ready"));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setUnavailableSince(isWebSocketConnected ? null : new Date().toLocaleString()),
      isWebSocketConnected ? 0 : 30_000,
    );
    return () => window.clearTimeout(timer);
  }, [isWebSocketConnected]);

  if (isWebSocketConnected || !unavailableSince) return null;
  return (
    <TimedNotice key={unavailableSince}>
      <div
        role="status"
        className="mb-6 rounded-xl border-2 border-amber-300 bg-black/90 p-5 text-white"
      >
        <p className="text-2xl font-semibold">Dashboard data connection unavailable</p>
        <p className="mt-2 text-lg">
          {hasEverConnected
            ? "Some information may be out of date."
            : "Widgets are waiting for data."}{" "}
          Reconnecting automatically. Weather uses a separate connection.
        </p>
        <p className="mt-2 text-base text-amber-100">Detected {unavailableSince}</p>
      </div>
    </TimedNotice>
  );
}
