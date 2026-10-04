"use client";

import { useEffect, useRef, useState } from "react";

export type DashboardError = Error & { digest?: string };

export function ErrorPanel({
  title,
  error,
  onRetry,
  compact = false,
  retryNotice,
}: {
  title: string;
  error: DashboardError;
  onRetry?: () => void;
  compact?: boolean;
  retryNotice?: string;
}) {
  const [diagnostics, setDiagnostics] = useState<string | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(true);
  const reloadButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDetailsVisible(false), 120_000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      reloadButton.current?.focus();
      const browser = navigator.userAgent.match(/(?:Chrome|Chromium|Firefox)\/([\d.]+)/);
      setDiagnostics(
        `${new Date().toLocaleString()} · ${browser?.[0] ?? navigator.userAgent} · ${navigator.onLine ? "Network available (services may still be unreachable)" : "Browser reports offline"}`,
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      role="alert"
      style={{
        background: "#211710",
        color: "#fff7ed",
        border: "2px solid #dba66a",
        borderRadius: 16,
        padding: detailsVisible ? (compact ? 20 : 40) : 16,
        fontFamily: "var(--font-geist-sans), sans-serif",
        width: "100%",
        boxSizing: "border-box",
        overflowWrap: "anywhere",
      }}
    >
      {detailsVisible ? (
        <p style={{ color: "#ffd29d", fontSize: 14, letterSpacing: "0.12em", margin: "0 0 12px" }}>
          DASH SPECTACLE · ERROR
        </p>
      ) : null}
      <h1
        style={{
          fontSize: detailsVisible ? (compact ? 24 : 44) : 20,
          margin: "0 0 16px",
          lineHeight: 1.15,
        }}
      >
        {title}
      </h1>
      {detailsVisible ? (
        <>
          <p style={{ fontSize: compact ? 18 : 26, lineHeight: 1.5, margin: "0 0 16px" }}>
            {typeof error?.message === "string" && error.message
              ? error.message.slice(0, 1000)
              : "An unexpected error occurred without a message."}
          </p>
          {typeof error?.digest === "string" ? (
            <p style={{ fontSize: 20 }}>Error reference: {error.digest}</p>
          ) : null}
          <p style={{ fontSize: 16, color: "#efd5b9", lineHeight: 1.5 }}>
            {retryNotice ?? "Photograph this screen if the error keeps happening."}
          </p>
          {diagnostics ? <p style={{ fontSize: 16, color: "#efd5b9" }}>{diagnostics}</p> : null}
        </>
      ) : null}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
        <button
          ref={reloadButton}
          type="button"
          onClick={() => window.location.reload()}
          style={buttonStyle}
        >
          Reload dashboard
        </button>
        {onRetry ? (
          <button type="button" onClick={onRetry} style={buttonStyle}>
            Try again
          </button>
        ) : null}
      </div>
    </section>
  );
}

const buttonStyle = {
  background: "#fff0d9",
  color: "#25170d",
  border: "1px solid #fff0d9",
  borderRadius: 8,
  padding: "12px 18px",
  fontSize: 18,
  cursor: "pointer",
};
