import { CalendarEvent } from '@/types/calendar';

interface CalendarDayProps {
    dayDate: string;
    dayEvents: CalendarEvent[];
}

export default function CalendarDay({ dayEvents, dayDate }: CalendarDayProps) {
    return (
        <div className="flex flex-col text-primary-foreground">
            <span>{new Date(dayDate).toDateString()}</span>
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
    return (
        <div>
            <div className="flex flex-col justify-between">
                <span>
                    {new Date(event.start.dateTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    })}
                    {' - '}
                    {new Date(event.end.dateTime).toLocaleTimeString('en-US', {
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
