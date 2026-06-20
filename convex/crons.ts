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

export default crons;
