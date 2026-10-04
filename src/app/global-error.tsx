"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { ErrorPanel, type DashboardError } from "@/components/errors/ErrorPanel";

export default function GlobalError({
  error,
  reset,
}: {
  error: DashboardError;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {/* Inline styles remain readable when the root layout or its CSS fails. */}
        <main
          style={{
            minHeight: "100vh",
            boxSizing: "border-box",
            background: "#100e0b",
            padding: "6vh 6vw",
            display: "grid",
            alignItems: "center",
          }}
        >
          <ErrorPanel title="Dashboard could not start" error={error} onRetry={reset} />
        </main>
      </body>
    </html>
  );
}
