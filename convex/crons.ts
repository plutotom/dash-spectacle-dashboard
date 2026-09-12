import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Refresh espresso cache server-side instead of letting every open dashboard
// poll independently. Weather now refreshes directly in the single kiosk client.
crons.interval("refresh espresso shots", { minutes: 5 }, api.espresso.fetchShots, {});

export default crons;
