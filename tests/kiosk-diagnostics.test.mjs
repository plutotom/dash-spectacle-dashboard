import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { loadTypeScript } from "./load-typescript.mjs";

const { KIOSK_DIAGNOSTICS_SCRIPT } = await loadTypeScript("../src/lib/kiosk-diagnostics.ts");

function browserFixture() {
  function element() {
    return {
      style: {},
      children: [],
      attributes: {},
      textContent: "",
      parentNode: null,
      setAttribute(key, value) {
        this.attributes[key] = value;
      },
      appendChild(child) {
        this.children.push(child);
        child.parentNode = this;
      },
      removeChild(child) {
        this.children = this.children.filter((value) => value !== child);
        child.parentNode = null;
      },
      querySelector(selector) {
        const name = selector.slice(1, -1);
        for (const child of this.children) {
          if (child.attributes[name]) return child;
          const nested = child.querySelector(selector);
          if (nested) return nested;
        }
        return null;
      },
    };
  }
  const timers = [];
  const listeners = {};
  const document = {
    body: element(),
    documentElement: { getAttribute: () => null },
    createElement: element,
  };
  const window = {
    location: { pathname: "/dashboard", reload() {} },
    setTimeout(callback, delay) {
      const timer = { callback, delay, cancelled: false };
      timers.push(timer);
      return timer;
    },
    clearTimeout(timer) {
      timer.cancelled = true;
    },
    addEventListener(name, callback) {
      listeners[name] = callback;
    },
  };
  runInNewContext(KIOSK_DIAGNOSTICS_SCRIPT, {
    window,
    document,
    navigator: { userAgent: "Chromium/90", onLine: true },
    Date,
  });
  return { document, timers, listeners };
}

test("startup timeout and browser failures render diagnostics without React or Sentry", () => {
  const { document, timers, listeners } = browserFixture();
  const startup = timers.find((timer) => timer.delay === 45000);
  startup.callback();
  assert.match(
    document.body.querySelector("[data-kiosk-error-message]").textContent,
    /did not start within 45 seconds/,
  );
  assert.match(
    document.body.querySelector("[data-kiosk-error-details]").textContent,
    /Chromium\/90/,
  );
  listeners.error({ message: "Unexpected runtime failure" });
  assert.equal(
    document.body.querySelector("[data-kiosk-error-message]").textContent,
    "Unexpected runtime failure",
  );
  listeners.unhandledrejection({ reason: new Error("Connection response failed") });
  assert.equal(
    document.body.querySelector("[data-kiosk-error-message]").textContent,
    "Connection response failed",
  );
  listeners.error({ target: { tagName: "SCRIPT" } });
  assert.match(
    document.body.querySelector("[data-kiosk-error-message]").textContent,
    /JavaScript file failed to load/,
  );
  assert.equal(document.body.children.length, 1);
});

test("successful startup cancels the watchdog and error text cannot become HTML", () => {
  const { document, timers, listeners } = browserFixture();
  listeners["dashboard-ready"]();
  assert.equal(timers.find((timer) => timer.delay === 45000).cancelled, true);
  assert.equal(document.body.children.length, 0);
  listeners.unhandledrejection({ reason: "<img src=x onerror=alert(1)>" });
  const detail = document.body.querySelector("[data-kiosk-error-message]");
  assert.equal(detail.textContent, "<img src=x onerror=alert(1)>");
  assert.equal(detail.children.length, 0);
});
