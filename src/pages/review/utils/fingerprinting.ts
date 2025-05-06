
/**
 * Utility functions for client fingerprinting
 */

// Client fingerprint generation (basic version)
export function generateClientFingerprint(): string {
  try {
    // Use screen properties, timezone, and other browser features
    const screenData = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const platform = navigator.platform;
    
    // Combine these values to create a fingerprint
    const combinedData = `${screenData}|${timeZone}|${language}|${platform}`;
    
    // Create a simple hash
    let hash = 0;
    for (let i = 0; i < combinedData.length; i++) {
      const char = combinedData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  } catch (e) {
    // Fallback if anything fails
    return Math.random().toString(36).substring(2, 15);
  }
}

// Get or create a client ID that persists across sessions
export function getOrCreateClientId(): string {
  try {
    // Try to get existing client ID from localStorage
    let clientId = localStorage.getItem('client_id');
    
    // If not found, create one and store it
    if (!clientId) {
      clientId = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15);
      localStorage.setItem('client_id', clientId);
    }
    
    return clientId;
  } catch (e) {
    // If localStorage fails, return a random ID (will not persist)
    return Math.random().toString(36).substring(2, 15);
  }
}

// Function to get the client's IP address (will use the edge function to get it)
export async function getClientIp(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (e) {
    return null;
  }
}
