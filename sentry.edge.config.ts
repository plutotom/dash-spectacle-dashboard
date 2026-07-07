import * as Sentry from "@sentry/nextjs";
import { getSentryDsn, SENTRY_TRACES_SAMPLE_RATE } from "./sentry.shared";

const dsn = getSentryDsn();

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    enableLogs: true,
  });
}
