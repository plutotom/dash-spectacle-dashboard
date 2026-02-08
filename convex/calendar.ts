"use node";
import { action } from "./_generated/server";
import { google } from "googleapis";

export const getEvents = action({
  args: {},
  handler: async () => {
    // 1. Authenticate with Google
    const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!credentialsJson || !calendarId) {
      // eslint-disable-next-line no-console
      console.warn(
        "Missing GOOGLE_SERVICE_ACCOUNT_CREDENTIALS or GOOGLE_CALENDAR_ID",
      );
      return []; // Or throw error, but for dashboard stability return empty
    }

    try {
      const credentials = JSON.parse(credentialsJson);

      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
      });

      const calendar = google.calendar({ version: "v3", auth });

      // 2. Calculate time range (Now to Now + 4 days)
      const now = new Date();
      const timeMax = new Date(now);
      timeMax.setDate(timeMax.getDate() + 4);

      console.log(
        `[Calendar] Fetching events from ${now.toISOString()} to ${timeMax.toISOString()}`,
      );
      console.log(`[Calendar] Using Calendar ID: ${calendarId}`);

      // 3. Fetch events
      const response = await calendar.events.list({
        calendarId,
        timeMin: now.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });

      console.log(
        `[Calendar] Received ${response.data.items?.length || 0} raw events from Google`,
      );

      // 4. Transform events
      const events =
        response.data.items?.map((item) => {
          // Handle all-day events vs timed events
          const start = item.start?.dateTime || item.start?.date;
          const end = item.end?.dateTime || item.end?.date;
          const allDay = !item.start?.dateTime; // if dateTime is missing, it's a date-only (all-day) event

          return {
            id: item.id || Math.random().toString(),
            title: item.summary || "No Title",
            start,
            end,
            allDay,
          };
        }) || [];

      console.log(`[Calendar] Returning ${events.length} transformed events`);

      return events;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching calendar events:", error);
      // Fail gracefully for the dashboard
      return [];
    }
  },
});
