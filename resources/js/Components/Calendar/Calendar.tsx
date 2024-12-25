import { calendarService } from '@/services/calendarService';
import { CalendarEvent } from '@/types/calendar';
import { useEffect, useState } from 'react';

interface CalendarProps {
    className?: string;
}

export function Calendar({ className }: CalendarProps) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await calendarService.getEvents();
                setEvents(data);
            } catch (err) {
                setError('Failed to fetch calendar events');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
        const intervalId = setInterval(fetchEvents, 20 * 60 * 1000); // fetch only every 20 minuetns
        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="">Loading Calendar...</div>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 text-destructive">Error loading calendar: {error}</div>;
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    return (
        <div className={`rounded-lg shadow-sm ${className}`}>
            <div className="p-4">
                <h2 className="mb-4 text-xl font-semibold">Upcoming Events</h2>
                <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event.id} className="rounded-md border border-border p-4 transition-colors hover:bg-accent">
                            <h3 className="font-medium text-foreground">{event.name}</h3>
                            <div className="mt-1 text-sm text-muted-foreground">
                                {formatDate(event.startDateTime)} - {formatDate(event.endDateTime)}
                            </div>
                            {event.description && <div className="mt-2 text-sm text-muted-foreground">{event.description}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
