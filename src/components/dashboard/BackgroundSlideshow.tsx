"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { isAllowedBackgroundUrl } from "@/lib/background-image";
import { TimedNotice } from "@/components/errors/TimedNotice";

const DEFAULT_BG = "https://images.unsplash.com/photo-1741715421791-c08283c8b7d2?ixlib=rb-4.1.0";
const INTERVAL_MS = 60 * 5 * 1000; // 5 minutes

export function BackgroundSlideshow() {
  // Match the server/client first render, then randomize after mount.
  const [seed, setSeed] = useState(0);

  const image = useQuery(api.images.getBackgroundImage, { seed });

  useEffect(() => {
    const initial = window.setTimeout(() => setSeed(Math.floor(Math.random() * 1000)), 0);
    const interval = setInterval(() => {
      setSeed((prev) => prev + 1);
    }, INTERVAL_MS);
    return () => {
      window.clearTimeout(initial);
      clearInterval(interval);
    };
  }, []);

  return (
    <BackgroundPhoto key={`${seed}:${image?.url ?? DEFAULT_BG}`} url={image?.url ?? DEFAULT_BG} />
  );
}

function BackgroundPhoto({ url }: { url: string }) {
  const allowed = isAllowedBackgroundUrl(url);
  const [failed, setFailed] = useState(false);
  return (
    <>
      <div className="absolute inset-0 z-0 bg-stone-950">
        {allowed && !failed ? (
          <Image
            src={`/api/background-image?url=${encodeURIComponent(url)}`}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            unoptimized
            onError={() => setFailed(true)}
            style={{ objectFit: "cover" }}
          />
        ) : null}
      </div>
      <div className="absolute inset-0 z-0 bg-black/40" />
      {!allowed || failed ? (
        <TimedNotice>
          <div
            role="status"
            className="absolute bottom-3 right-3 z-20 max-w-lg rounded-lg border border-amber-300 bg-black/90 p-3 text-base text-amber-100"
          >
            Background photo unavailable:{" "}
            {allowed ? "download or resizing failed" : "unsupported photo source"}. Other widgets
            are still running. The next photo is attempted in five minutes.
          </div>
        </TimedNotice>
      ) : null}
    </>
  );
}
