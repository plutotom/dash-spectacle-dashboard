/** Personal dashboard — capture everything for remote Pi debugging. */
export const SENTRY_TRACES_SAMPLE_RATE = 1.0;
export const SENTRY_REPLAYS_SESSION_SAMPLE_RATE = 1.0;
export const SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE = 1.0;

export function getSentryDsn(): string | undefined {
  return process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN;
}
