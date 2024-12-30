interface DateTime {
    dateTime: string | null;
    timeZone: string | null;
}

export interface CalendarEvent {
    id: string;
    summary: string; // This is equivalent to "name" in your previous interface
    description?: string | null;
    start: DateTime;
    end: DateTime;
    status: string;
    htmlLink: string;
}

// Type for the grouped events response
export interface GroupedCalendarEvents {
    [date: string]: CalendarEvent[];
}
