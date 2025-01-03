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
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await calendarService.getEvents();
                setEvents(data);
                setLastUpdated(new Date());
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
            <div className="">
                <div className="flex space-x-2">
                    {Object.values(events)
                        .slice(0, 4)
                        .map((dayEvents, index) => (
                            <div className="w-1/4" key={index}>
                                <CalendarDay key={index} dayEvents={dayEvents} dayDate={Object.keys(events)[index]} />
                            </div>
                        ))}
                </div>
                <div className="mt-2 text-sm text-gray-400">Last updated: {lastUpdated?.toLocaleTimeString()}</div>
            </div>
        </div>
    );
}
