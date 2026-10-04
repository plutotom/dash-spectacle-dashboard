"use client";

import { DateTimeDisplay } from "@/components/dashboard/DateTimeDisplay";
import { CurrentWeather } from "@/components/dashboard/CurrentWeather";
import { MessagesFeed } from "@/components/dashboard/MessagesFeed";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { BackgroundSlideshow } from "@/components/dashboard/BackgroundSlideshow";
import { EspressoGlassTile } from "@/components/dashboard/espresso/EspressoGlassTile";
import { EspressoShotGraphTile } from "@/components/dashboard/espresso/EspressoShotGraphTile";
import { ConnectionStatus } from "@/components/dashboard/ConnectionStatus";
import { WidgetErrorBoundary } from "@/components/errors/WidgetErrorBoundary";
import ButtonNavigation from "../section/ButtonNavigation";

export default function DashboardPage() {
  return (
    <div className="kiosk-dashboard min-h-screen relative overflow-hidden">
      {/* Background Slideshow */}
      <WidgetErrorBoundary name="Background photos" background>
        <BackgroundSlideshow />
      </WidgetErrorBoundary>

      {/* Content Container */}
      <div className="relative z-10 p-6 min-h-screen">
        {/* Header with auth buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <WidgetErrorBoundary name="Navigation">
            <ButtonNavigation />
          </WidgetErrorBoundary>
        </div>

        {/* Main Dashboard Layout */}
        <div className="max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-8rem)] pt-12">
          <WidgetErrorBoundary name="Connection status">
            <ConnectionStatus />
          </WidgetErrorBoundary>
          <div className="space-y-8 flex-1">
            {/* Top Row: DateTime + Weather */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
              <div className="flex-1">
                <WidgetErrorBoundary name="Clock">
                  <DateTimeDisplay />
                </WidgetErrorBoundary>
              </div>
              {/* Morning ritual stack: weather + espresso */}
              <div className="w-full md:w-auto flex flex-col gap-2 min-w-[280px] md:max-w-[340px]">
                <WidgetErrorBoundary name="Weather">
                  <CurrentWeather />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary name="Espresso summary">
                  <EspressoGlassTile />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary name="Espresso graph">
                  <EspressoShotGraphTile />
                </WidgetErrorBoundary>
              </div>
            </div>
          </div>

          {/* Bottom area: Messages above calendar */}
          <div className="w-full mt-auto">
            <div className="flex justify-start w-full pb-4">
              <div className="w-full max-w-lg">
                <WidgetErrorBoundary name="Messages">
                  <MessagesFeed />
                </WidgetErrorBoundary>
              </div>
            </div>
            <div className="w-full pb-8">
              <WidgetErrorBoundary name="Calendar">
                <CalendarWidget />
              </WidgetErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
