// Inline the bootstrap so it does not depend on another successful script download.
export const KIOSK_DIAGNOSTICS_SCRIPT = String.raw`
/* Runs before React so startup failures can be read from the living-room TV. */
(function () {
  if (!/^\/dashboard\/?$/.test(window.location.pathname)) return;
  var panel = null;
  var latestMessage = "";
  var dismissedMessage = null;
  var dismissTimer = null;

  function dismissPanel() {
    window.clearTimeout(dismissTimer);
    dismissedMessage = latestMessage;
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    panel = null;
    dismissTimer = null;
  }

  function show(message) {
    var nextMessage = String(message).slice(0, 1000);
    if (nextMessage === dismissedMessage) return;
    latestMessage = nextMessage;
    if (!document.body) {
      window.setTimeout(function () {
        show(latestMessage);
      }, 100);
      return;
    }
    if (!panel) {
      dismissedMessage = null;
      panel = document.createElement("section");
      panel.setAttribute("role", "alert");
      panel.setAttribute("data-kiosk-error", "true");
      panel.style.cssText =
        "position:fixed;top:4vh;left:4vw;right:4vw;z-index:2147483647;max-height:88vh;overflow:auto;box-sizing:border-box;padding:28px;background:#211710;color:#fff7ed;border:2px solid #dba66a;border-radius:16px;font-family:sans-serif;box-shadow:0 12px 50px #000;font-size:20px;line-height:1.5;overflow-wrap:anywhere;";
      var heading = document.createElement("h1");
      heading.textContent = "Dashboard browser error";
      heading.style.cssText = "font-size:36px;margin:0 0 16px;line-height:1.15";
      panel.appendChild(heading);
      var detail = document.createElement("p");
      detail.setAttribute("data-kiosk-error-message", "true");
      panel.appendChild(detail);
      var metadata = document.createElement("p");
      metadata.setAttribute("data-kiosk-error-details", "true");
      metadata.style.fontSize = "18px";
      panel.appendChild(metadata);
      var guidance = document.createElement("p");
      guidance.textContent =
        "Photograph this screen if the error keeps happening. Try reloading; if the browser is frozen, restart the Pi.";
      panel.appendChild(guidance);
      var reload = document.createElement("button");
      reload.textContent = "Reload dashboard";
      reload.style.cssText =
        "padding:12px 20px;font-size:20px;cursor:pointer;background:#fff0d9;color:#25170d;border:0;border-radius:8px;margin-right:12px;";
      reload.onclick = function () {
        window.location.reload();
      };
      panel.appendChild(reload);
      var dismiss = document.createElement("button");
      dismiss.textContent = "Dismiss message";
      dismiss.style.cssText = reload.style.cssText;
      dismiss.onclick = dismissPanel;
      panel.appendChild(dismiss);
      document.body.appendChild(panel);
      reload.focus();
      dismissTimer = window.setTimeout(dismissPanel, 120000);
    }
    panel.querySelector("[data-kiosk-error-message]").textContent = latestMessage;
    panel.querySelector("[data-kiosk-error-details]").textContent =
      new Date().toLocaleString() +
      " · " +
      navigator.userAgent +
      " · " +
      (navigator.onLine
        ? "Network available; individual services may still be unreachable"
        : "Browser reports offline");
  }

  window.addEventListener(
    "error",
    function (event) {
      var target = event.target;
      if (target && target.tagName === "SCRIPT") {
        show(
          "A dashboard JavaScript file failed to load. Reload the page to request the current version.",
        );
      } else if (event.message) {
        show(event.message);
      }
    },
    true,
  );
  window.addEventListener("unhandledrejection", function (event) {
    var reason = event.reason;
    show(
      reason && reason.message
        ? reason.message
        : typeof reason === "string"
          ? reason
          : "An asynchronous dashboard operation failed without an error message.",
    );
  });
  var startupTimer = window.setTimeout(function () {
    if (document.documentElement.getAttribute("data-dashboard-ready") !== "true") {
      show(
        "Dashboard did not start within 45 seconds. The browser may be unsupported, or an application file could not load.",
      );
    }
  }, 45000);
  window.addEventListener("dashboard-ready", function () {
    window.clearTimeout(startupTimer);
  });
})();
`;
