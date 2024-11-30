import { CalendarEvent } from '@/types/calendar';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
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
                const response = await axios.get('/api/calendar-events');
                setEvents(response.data);
            } catch (err) {
                setError('Failed to fetch calendar events');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 text-destructive">{error}</div>;
    }

    return (
        <div className={`rounded-lg bg-card shadow-sm ${className}`}>
            <div className="p-4">
                <h2 className="mb-4 text-xl font-semibold">Upcoming Events</h2>
                <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event.id} className="rounded-md border border-border p-4 transition-colors hover:bg-accent">
                            <h3 className="font-medium text-foreground">{event.summary}</h3>
                            <div className="mt-1 text-sm text-muted-foreground">
                                {format(parseISO(event.start.dateTime), 'PPp')} - {format(parseISO(event.end.dateTime), 'PPp')}
                            </div>
                            {event.location && <div className="mt-1 text-sm text-muted-foreground">📍 {event.location}</div>}
                            {event.description && <div className="mt-2 text-sm text-muted-foreground">{event.description}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
