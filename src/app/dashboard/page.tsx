"use client";

import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import {
  DateTimeDisplay,
  CurrentWeather,
  WeatherForecast,
  MessagesFeed,
  CalendarWidget,
  BackgroundSlideshow,
} from "@/components/dashboard";
import ButtonNavigation from "../section/ButtonNavigation";

function useMidnightRefresh() {
  useEffect(() => {
    function scheduleRefresh() {
      const now = new Date();
      const next3am = new Date();
      next3am.setHours(3, 0, 0, 0);
      if (next3am <= now) {
        next3am.setDate(next3am.getDate() + 1);
      }
      const msUntil3am = next3am.getTime() - now.getTime();
      const timer = setTimeout(() => {
        window.location.reload();
      }, msUntil3am);
      return timer;
    }

    const timer = scheduleRefresh();
    return () => clearTimeout(timer);
  }, []);
}

export default function DashboardPage() {
  const { isLoading } = useConvexAuth();
  useMidnightRefresh();

  // Show loading spinner only briefly
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Slideshow */}
      <BackgroundSlideshow />

      {/* Content Container */}
      <div className="relative z-10 p-6 min-h-screen">
        {/* Header with auth buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <ButtonNavigation />
        </div>

        {/* Main Dashboard Layout */}
        <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-3rem)] pt-12">
          {/* Top Row: DateTime + Weather */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <DateTimeDisplay />
            </div>
            {/* Weather Stack - Right Aligned and Compact */}
            <div className="w-full md:w-auto flex flex-col gap-2 min-w-[240px]">
              <CurrentWeather />
              <WeatherForecast />
            </div>
          </div>

          {/* Bottom Row: Messages (left) + Calendar (right) */}
          <div className="flex flex-col md:flex-row items-end gap-6 mt-auto pb-8 pt-8">
            <div className="w-full max-w-lg shrink-0">
              <MessagesFeed />
            </div>
            <div className="flex-1 min-w-0">
              <CalendarWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
