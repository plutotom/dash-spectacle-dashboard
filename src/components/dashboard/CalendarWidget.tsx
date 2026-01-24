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
      const mockDays: DayEvents[] = Array.from({ length: 4 }, (_, i) => ({
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
    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/10">
      <h3 className="text-lg font-medium text-white mb-4">Calendar</h3>
      <div className="grid grid-cols-4 gap-3">
        {days.map((day, index) => (
          <div
            key={index}
            className={`rounded-lg p-3 ${
              isSameDay(day.date, today)
                ? "bg-purple-600/30 border border-purple-500/50"
                : "bg-white/5"
            }`}
          >
            <div className="text-xs text-gray-400 uppercase mb-1">
              {isSameDay(day.date, today)
                ? "Today"
                : isSameDay(day.date, addDays(today, 1))
                  ? "Tomorrow"
                  : format(day.date, "EEE")}
            </div>
            <div className="text-sm font-medium text-white mb-2">
              {format(day.date, "MMM d")}
            </div>
            <div className="space-y-1">
              {day.events.length > 0 ? (
                day.events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs text-gray-300 truncate bg-white/10 rounded px-2 py-1"
                  >
                    {event.title}
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500 italic">No events</div>
              )}
              {day.events.length > 3 && (
                <div className="text-xs text-gray-400">
                  +{day.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
