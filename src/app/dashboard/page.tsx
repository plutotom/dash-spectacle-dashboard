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
  CalendarWidget,
  BackgroundSlideshow,
} from "@/components/dashboard";
import { Shield, Image as ImageIcon } from "lucide-react";

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
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push("/users")}
                  className="bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 shadow-lg backdrop-blur-md transition-all hover:scale-105"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/gallery")}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-105"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Gallery
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/profile")}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-105"
              >
                Profile
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSignOut}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-105"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/signin")}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-105"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Main Dashboard Layout */}
        <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-8rem)] pt-12">
          <div className="space-y-8 flex-1">
            {/* Top Row: DateTime + Weather */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
              <div className="flex-1">
                <DateTimeDisplay />
              </div>
              {/* Weather Stack - Right Aligned and Compact */}
              <div className="w-full md:w-auto flex flex-col gap-2 min-w-[200px]">
                <CurrentWeather />
                <WeatherForecast />
              </div>
            </div>

            {/* Middle Row: Content */}
            <div className="flex justify-start w-full">
              {/* Messages - Constrained width, taller via component styles */}
              <div className="w-full max-w-md">
                <MessagesFeed />
              </div>
            </div>
          </div>

          {/* Bottom Row: Calendar (Full Width, Sticky Bottom) */}
          <div className="w-full pb-8 mt-auto pt-8">
            <CalendarWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
