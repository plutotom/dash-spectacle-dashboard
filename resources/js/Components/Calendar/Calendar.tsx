import { calendarService } from '@/services/calendarService';
import { GroupedCalendarEvents } from '@/types/calendar';
import { useEffect, useState } from 'react';
import CalendarDay from './Partial/CalendarDay';

interface CalendarProps {
    className?: string;
}

export function Calendar({ className }: CalendarProps) {
    const [events, setEvents] = useState<GroupedCalendarEvents>(null);
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
        const intervalId = setInterval(fetchEvents, 20 * 60 * 1000); // fetch only every 20 minuets
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

    return (
        <div className={`rounded-lg shadow-sm ${className}`}>
            <div className="p-4">
                <h2 className="mb-4 text-xl font-semibold text-primary-foreground">Upcoming Events</h2>
                <div className="flex space-y-4">
                    {Object.values(events)
                        .slice(0, 4)
                        .map((dayEvents, index) => (
                            <CalendarDay key={index} dayEvents={dayEvents} dayDate={Object.keys(events)[index]} />
                        ))}
                </div>
            </div>
        </div>
    );
}
