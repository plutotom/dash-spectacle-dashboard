import { CalendarEvent } from '@/types/calendar';

interface CalendarDayProps {
    dayDate: string;
    dayEvents: CalendarEvent[];
}

export default function CalendarDay({ dayEvents, dayDate }: CalendarDayProps) {
    if (!dayEvents.length) return null;

    return (
        <div className="flex flex-col text-primary-foreground">
            <span className="text-lg">
                {new Date(dayDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                })}
            </span>
            <hr className="border-[0.5px] border-gray-400" />

            {dayEvents.map((event) => (
                <div key={event.id} className="my-1 border-l-4 border-l-primary ps-1">
                    <Event event={event} />
                </div>
            ))}
        </div>
    );
}

function Event({ event }: { event: CalendarEvent }) {
    if (event.isAllDay) {
        return (
            <div>
                <div className="flex flex-col justify-between text-lg">
                    <span className="text-sm text-[#A9A9A9]">All day</span>
                    <span>{event.summary}</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col justify-between text-lg">
                <span>
                    {new Date(event.start.dateTime!).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    })}
                    {' - '}
                    {new Date(event.end.dateTime!).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    })}
                </span>
                <span>{event.summary}</span>
            </div>
        </div>
    );
}
