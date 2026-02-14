/**
 * GA4 gtag event helper. Safe to call even if gtag is not loaded.
 */
declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

export function gtagEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}
