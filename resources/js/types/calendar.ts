// events": [
//     {
//     "id": "e9im6r31d5miqobjedkn6t1dehp62tj5dgmn0sj579r32ej9edgmiob8cgn70sjfcdq6usi0ctmm2qbc5phmur9qbss38s3acdi32rhn6ho36e32c4r3ed3gdcp64ebb6so6uqhic8sn0dhp61l62oj164s68c3acli34choe0omkpb4d4q3cro",
//     "name": "🚌 Travel",
//     "startDateTime": "2024-12-02T16:30:00.000000Z",
//     "endDateTime": "2024-12-02T17:00:00.000000Z",
//     "description": "<i>This event was created by <a href=\"https://app.reclaim.ai/landing/about?name=Isaiah+proctor&utm_source=calendar&utm_campaign=calendar-referral&utm_medium=buffer-event&utm_term=kPQYz\">Reclaim</a>.</i><p>Isaiah is traveling at this time and may not be available for calls or meetings. You may book over it, but we encourage you to find another time to avoid scheduling conflicts.</p>"
//     },

export interface CalendarEvent {
    id: string;
    name: string;
    startDateTime: string;
    endDateTime: string;
    description?: string;
}
