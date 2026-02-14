/**
 * Mixpanel tracking utilities.
 * Mixpanel is initialized in index.html via the official bootstrap snippet.
 * All track calls are no-ops if Mixpanel is unavailable.
 */

declare global {
  interface Window {
    mixpanel?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export function track(event: string, properties?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && window.mixpanel?.track) {
    try {
      window.mixpanel.track(event, properties);
    } catch (e) {
      console.warn("Mixpanel track failed:", e);
    }
  }
}
