"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // 12-hour format without AM/PM
  const timeString = format(currentTime, "h:mm");
  const weekday = format(currentTime, "EEEE");
  const dateString = format(currentTime, "MMMM d, yyyy");

  return (
    <div className="text-white">
      <div className="text-8xl font-light tracking-tight">{timeString}</div>
      <div className="text-3xl font-medium mt-2">{weekday}</div>
      <div className="text-lg text-gray-300 mt-1">{dateString}</div>
    </div>
  );
}
