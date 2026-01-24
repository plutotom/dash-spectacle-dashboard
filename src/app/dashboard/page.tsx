"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DateTimeDisplay,
  CurrentWeather,
  WeatherForecast,
  MessagesFeed,
  PrayerRequestsWidget,
  CalendarWidget,
} from "@/components/dashboard";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-hidden">
      {/* Header with sign out */}
      <div className="absolute top-4 right-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSignOut}
          className="bg-white/10 hover:bg-white/20 text-white border-white/10"
        >
          Sign Out
        </Button>
      </div>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Row: DateTime + Current Weather */}
        <div className="flex items-start justify-between gap-8">
          <DateTimeDisplay />
          <div className="w-64">
            <CurrentWeather />
          </div>
        </div>

        {/* Weather Forecast Row */}
        <WeatherForecast />

        {/* Middle Row: Messages + Prayer Requests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MessagesFeed />
          <PrayerRequestsWidget />
        </div>

        {/* Calendar Row */}
        <CalendarWidget />
      </div>
    </div>
  );
}
