"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-lg space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-white/70 text-sm">
          This page hit an error. Details were sent to Sentry.
        </p>
        {error.message ? (
          <p className="text-xs text-red-300/80 break-words font-mono">{error.message}</p>
        ) : null}
        {error.digest ? <p className="text-xs text-white/40">Digest: {error.digest}</p> : null}
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
