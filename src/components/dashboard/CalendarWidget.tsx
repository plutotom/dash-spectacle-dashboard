"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, isSameDay } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
}

interface DayEvents {
  date: Date;
  events: CalendarEvent[];
}

export function CalendarWidget() {
  const [days, setDays] = useState<DayEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      // This will be replaced with actual Google Calendar API call via Convex action
      // For now, using placeholder data
      const today = new Date();
      const mockDays: DayEvents[] = Array.from({ length: 5 }, (_, i) => ({
        date: addDays(today, i),
        events:
          i === 0
            ? [
                {
                  id: "1",
                  title: "Team Meeting",
                  start: today,
                  end: today,
                  allDay: false,
                },
                {
                  id: "2",
                  title: "Lunch",
                  start: today,
                  end: today,
                  allDay: false,
                },
              ]
            : i === 1
              ? [
                  {
                    id: "3",
                    title: "Doctor Appointment",
                    start: addDays(today, 1),
                    end: addDays(today, 1),
                    allDay: false,
                  },
                ]
              : [],
      }));
      setDays(mockDays);
      setError(null);
    } catch {
      setError("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    // Refresh every 20 minutes
    const interval = setInterval(fetchEvents, 20 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 flex items-center justify-center h-40">
        <p className="text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  const today = new Date();

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/5 flex flex-col mt-4">
      <h3 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
        Upcoming Events
      </h3>
      <div className="grid grid-cols-5 gap-4">
        {days.slice(0, 5).map((day, index) => (
          <div
            key={index}
            className={`rounded-md p-2 flex flex-col h-full ${
              isSameDay(day.date, today)
                ? "bg-purple-500/10 border border-purple-500/20"
                : "bg-white/5 border border-white/5"
            }`}
          >
            <div className="text-[10px] text-white/40 uppercase mb-1.5 font-medium tracking-wide border-b border-white/5 pb-1">
              {isSameDay(day.date, today)
                ? "Today"
                : isSameDay(day.date, addDays(today, 1))
                  ? "Tomorrow"
                  : format(day.date, "EEEE")}
            </div>

            <div className="flex-1 space-y-1.5">
              {day.events.length > 0 ? (
                day.events.map((event) => (
                  <div key={event.id} className="group">
                    <div className="text-xs font-medium text-white/90 truncate leading-tight">
                      {event.title}
                    </div>
                    <div className="text-[9px] text-white/40">
                      {format(event.start, "h:mm a")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  <span className="text-[10px] text-white/20 italic">
                    No events
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
