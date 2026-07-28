/**
 * Personal dashboard — capture every error for remote Pi debugging.
 *
 * Session Replay is deliberately absent. The kiosk page is opened once and never
 * unloads, so rrweb would serialize DOM mutations (clock tick, background swap,
 * Convex pushes) and upload them forever over the Pi's Wi-Fi.
 */
export const SENTRY_TRACES_SAMPLE_RATE = 1;

export function getSentryDsn(): string | undefined {
  return process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.SENTRY_DSN;
}
