import { GroupedCalendarEvents } from '@/types/calendar';
import axios from 'axios';

export const calendarService = {
    async getEvents(): Promise<GroupedCalendarEvents> {
        const response = await axios.get<{ data: GroupedCalendarEvents }>('/api/calendar-events');
        return response.data.data;
    },
};
