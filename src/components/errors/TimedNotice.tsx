"use client";

import { useEffect, useState, type ReactNode } from "react";

// Mount a new notice for each distinct incident; repeated renders do not
// prolong its visibility on the unattended wall display.
export function TimedNotice({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 120_000);
    return () => window.clearTimeout(timer);
  }, []);

  return visible ? children : null;
}
