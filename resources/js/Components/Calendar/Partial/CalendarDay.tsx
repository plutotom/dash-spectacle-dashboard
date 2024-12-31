import { CalendarEvent } from '@/types/calendar';

interface CalendarDayProps {
    dayDate: string;
    dayEvents: CalendarEvent[];
}

export default function CalendarDay({ dayEvents, dayDate }: CalendarDayProps) {
    return (
        <div className="flex flex-col text-primary-foreground">
            <span>{new Date(dayDate).toDateString()}</span>
            {/* <hr /> */}

            {dayEvents.map((event) => (
                <div key={event.id} className="my-1 border-l-4 border-l-black p-1">
                    <Event event={event} />
                    {/* <hr /> */}
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
                    {new Date(event.start.dateTime).toLocaleTimeString()} - {new Date(event.end.dateTime).toLocaleTimeString()}
                </span>
                <span>{event.summary}</span>
            </div>
        </div>
    );
}
