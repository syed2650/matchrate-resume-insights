/**
 * Mixpanel tracking utilities.
 * Init is called from main.tsx with VITE_MIXPANEL_TOKEN.
 * All track calls are no-ops if Mixpanel is not initialized.
 */

declare global {
  interface Window {
    mixpanel?: {
      init: (token: string, options?: Record<string, unknown>) => void;
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

let isInitialized = false;

export function initMixpanel(): void {
  const token = import.meta.env.VITE_MIXPANEL_TOKEN;
  if (token && typeof window !== "undefined" && window.mixpanel) {
    try {
      window.mixpanel.init(token);
      isInitialized = true;
    } catch (e) {
      console.warn("Mixpanel init failed:", e);
    }
  }
}

export function track(event: string, properties?: Record<string, unknown>): void {
  if (isInitialized && typeof window !== "undefined" && window.mixpanel) {
    try {
      window.mixpanel.track(event, properties);
    } catch (e) {
      console.warn("Mixpanel track failed:", e);
    }
  }
}
