"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";

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

  const getEvents = useAction(api.calendar.getEvents);

  const fetchEvents = useCallback(async () => {
    try {
      const rawEvents = await getEvents();

      const today = new Date();
      // Generate next 5 days
      const upcomingDays: DayEvents[] = Array.from({ length: 5 }, (_, i) => {
        const date = addDays(today, i);
        return {
          date,
          events: [],
        };
      });

      console.log(
        "[CalendarWidget] Raw events received:",
        rawEvents?.length || 0,
      );

      // Distribute events to days
      if (rawEvents && Array.isArray(rawEvents)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawEvents.forEach((event: any) => {
          if (!event.start) return;
          const eventStart = parseISO(event.start);
          // Find which day bucket this falls into
          const dayBucket = upcomingDays.find((d) =>
            isSameDay(d.date, eventStart),
          );
          if (dayBucket) {
            dayBucket.events.push({
              id: event.id,
              title: event.title,
              start: eventStart,
              end: event.end ? parseISO(event.end) : eventStart,
              allDay: event.allDay,
            });
          } else {
            console.log(
              "[CalendarWidget] Event skipped (not in 5-day range):",
              event.title,
              event.start,
            );
          }
        });
      }

      console.log(
        "[CalendarWidget] Processed days:",
        upcomingDays.map((d) => ({
          date: format(d.date, "yyyy-MM-dd"),
          count: d.events.length,
        })),
      );

      setDays(upcomingDays);
      setError(null);
    } catch (err) {
      console.error("[CalendarWidget] Error fetching calendar events:", err);
      // Extract error message if it's a Convex error or standard Error
      const errorMessage =
        (err as { message?: string })?.message || "Failed to load calendar";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getEvents]);

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
      <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-3 border border-red-500/20 flex items-center justify-center h-full min-h-[140px] mt-4">
        <div className="flex flex-col items-center text-center">
          <span className="text-red-400 font-medium text-xs uppercase tracking-wider mb-1">
            Calendar Error
          </span>
          <p className="text-red-300/70 text-[10px]">{error}</p>
        </div>
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
                      {event.allDay ? "All Day" : format(event.start, "h:mm a")}
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
