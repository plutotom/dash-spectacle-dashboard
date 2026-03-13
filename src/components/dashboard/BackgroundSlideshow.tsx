"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useState } from "react";

const DEFAULT_BG =
  "https://images.unsplash.com/photo-1741715421791-c08283c8b7d2?ixlib=rb-4.1.0";
const INTERVAL_MS = 60 * 5 * 1000; // 5 minutes

export function BackgroundSlideshow() {
  // Initialize with a random seed so refreshes get different images
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000));

  const image = useQuery(api.images.getBackgroundImage, { seed });

  useEffect(() => {
    const interval = setInterval(() => {
      setSeed((prev) => prev + 1);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (!image) {
    return (
      <>
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${DEFAULT_BG}')`,
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/40" />
      </>
    );
  }

  return (
    <>
      <div
        key={image._id}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed transition-opacity duration-1000 opacity-100"
        style={{
          backgroundImage: `url('${image.url}')`,
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/40" />
    </>
  );
}
