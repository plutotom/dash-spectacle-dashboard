import { CalendarEvent } from '@/types/calendar';
import axios from 'axios';

export const calendarService = {
    async getEvents(): Promise<CalendarEvent[]> {
        const response = await axios.get<{ data: CalendarEvent[] }>('/api/calendar-events');

        return response.data.data;
    },
};
