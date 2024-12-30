import { CalendarEvent } from '@/types/calendar';

interface CalendarDayProps {
    dayDate: string;
    dayEvents: CalendarEvent[];
}

export default function CalendarDay({ dayEvents, dayDate }: CalendarDayProps) {
    return (
        <div className="flex flex-col text-primary-foreground">
            <span>{new Date(dayDate).toDateString()}</span>
            <hr />

            {dayEvents.map((event) => (
                <div key={event.id}>
                    <Event event={event} />
                    <hr />
                </div>
            ))}
        </div>
    );
}

function Event({ event }: { event: CalendarEvent }) {
    return (
        <div>
            <div>
                <div className="time-start to time end">
                    <span>
                        {new Date(event.start.dateTime).toLocaleTimeString()} - {new Date(event.end.dateTime).toLocaleTimeString()}
                    </span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: event.description || '' }}></div>
            </div>
        </div>
    );
}
