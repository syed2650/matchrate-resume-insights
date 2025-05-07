
/**
 * Utility functions for ID generation in resume reviews
 */

import { v4 as uuidv4 } from 'uuid';

// Generate a random anonymous ID or retrieve existing one
export function getAnonymousId(): string {
  let storedAnonymousId = localStorage.getItem('anonymousId');
  
  if (!storedAnonymousId) {
    storedAnonymousId = uuidv4();
    localStorage.setItem('anonymousId', storedAnonymousId);
  }
  
  return storedAnonymousId;
}
