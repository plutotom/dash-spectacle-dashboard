"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  DateTimeDisplay,
  CurrentWeather,
  WeatherForecast,
  MessagesFeed,
  PrayerRequestsWidget,
  CalendarWidget,
} from "@/components/dashboard";
import { Shield } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const isAdmin = useQuery(api.profile.isAdmin);

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  // Show loading spinner only briefly
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 overflow-hidden">
      {/* Header with auth buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/dashboard/users")}
                className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-500/30"
              >
                <Shield className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/profile")}
              className="bg-white/10 hover:bg-white/20 text-white border-white/10"
            >
              Profile
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSignOut}
              className="bg-white/10 hover:bg-white/20 text-white border-white/10"
            >
              Sign Out
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/signin")}
            className="bg-white/10 hover:bg-white/20 text-white border-white/10"
          >
            Sign In
          </Button>
        )}
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
