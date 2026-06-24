import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Refresh the espresso cache server-side instead of letting every open
// dashboard poll independently. One fetch every 5 min regardless of how many
// tabs/devices are connected; clients just read the cache reactively.
crons.interval(
  "refresh espresso shots",
  { minutes: 5 },
  api.espresso.fetchShots,
  {},
);

// Weather is refreshed server-side so kiosk clients never poll in a loop.
crons.interval(
  "refresh weather current",
  { minutes: 5 },
  api.weather.fetchCurrent,
  {},
);

crons.interval(
  "refresh weather forecast",
  { minutes: 20 },
  api.weather.fetchForecast,
  {},
);

export default crons;
