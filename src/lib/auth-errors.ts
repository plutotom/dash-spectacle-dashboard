export type PasswordAuthFlow = "signIn" | "signUp";

function defaultMessage(flow: PasswordAuthFlow): string {
  return flow === "signIn"
    ? "We couldn't sign you in. Check your email and password, then try again."
    : "We couldn't create your account. If you already have one, sign in instead.";
}

function serverContactMessage(): string {
  return "Something went wrong while contacting the server. Check your connection and try again.";
}

function looksLikeHtmlDocument(text: string): boolean {
  const t = text.trimStart().toLowerCase();
  if (t.startsWith("<!doctype") || t.startsWith("<html")) {
    return true;
  }
  if (!t.startsWith("<")) {
    return false;
  }
  return (
    t.includes("<head") ||
    t.includes("<body") ||
    t.includes("</html>") ||
    t.includes("<script")
  );
}

function extractRawMessage(err: unknown): string | undefined {
  if (typeof err === "string") {
    return err;
  }
  if (err instanceof Error && typeof err.message === "string") {
    return err.message;
  }
  if (err && typeof err === "object") {
    const rec = err as Record<string, unknown>;
    if (typeof rec.message === "string") {
      return rec.message;
    }
    if (typeof rec.error === "string") {
      return rec.error;
    }
    if (
      rec.data !== undefined &&
      (typeof rec.data === "string" || typeof rec.data === "number")
    ) {
      return String(rec.data);
    }
  }
  return undefined;
}

function tryParseJsonMessage(text: string): string | undefined {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== "object") {
      return undefined;
    }
    const rec = parsed as Record<string, unknown>;
    if (typeof rec.message === "string" && rec.message.length > 0) {
      return rec.message;
    }
    if (typeof rec.error === "string" && rec.error.length > 0) {
      return rec.error;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

function normalizeKnownAuthMessage(
  raw: string,
  flow: PasswordAuthFlow,
): string {
  const lower = raw.toLowerCase();

  if (
    lower.includes("invalid") &&
    (lower.includes("password") ||
      lower.includes("credential") ||
      lower.includes("email"))
  ) {
    return "Invalid email or password.";
  }
  if (
    flow === "signUp" &&
    (lower.includes("already") ||
      lower.includes("exists") ||
      lower.includes("registered"))
  ) {
    return "An account with this email already exists. Try signing in.";
  }
  if (lower.includes("user not found") || lower.includes("no user")) {
    return "Invalid email or password.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return serverContactMessage();
  }

  const singleLine = raw.replace(/\s+/g, " ").trim();
  if (singleLine.length > 220) {
    return defaultMessage(flow);
  }
  return singleLine;
}

/**
 * Turns thrown values from password sign-in / sign-up into short, user-safe copy.
 * Avoids dumping HTML error pages or huge stack blobs into the UI.
 */
export function getPasswordAuthErrorMessage(
  err: unknown,
  flow: PasswordAuthFlow,
): string {
  const raw = extractRawMessage(err);
  if (!raw) {
    return defaultMessage(flow);
  }

  if (looksLikeHtmlDocument(raw) || raw.length > 2000) {
    return serverContactMessage();
  }

  const fromJson = tryParseJsonMessage(raw);
  if (fromJson && !looksLikeHtmlDocument(fromJson)) {
    return normalizeKnownAuthMessage(fromJson, flow);
  }

  return normalizeKnownAuthMessage(raw, flow);
}
