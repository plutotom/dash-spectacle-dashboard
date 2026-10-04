"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { ErrorPanel, type DashboardError } from "@/components/errors/ErrorPanel";

export default function Error({ error, reset }: { error: DashboardError; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#100e0b",
        padding: "6vh 6vw",
        display: "grid",
        alignItems: "center",
      }}
    >
      <ErrorPanel title="Dashboard could not continue" error={error} onRetry={reset} />
    </main>
  );
}
