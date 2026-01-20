"use client";

import { usePwaInstalled } from "./use-pwa-installed";

/**
 * React hook to check if the app is running as a PWA.
 * This is an alias for usePwaInstalled() for a more direct naming.
 * 
 * @returns {boolean} True if the app is running as a PWA, false otherwise
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isPWA = useIsPWA();
 *   
 *   if (isPWA) {
 *     return <div>Running as PWA!</div>;
 *   }
 *   
 *   return <div>Running in browser</div>;
 * }
 * ```
 */
export function useIsPWA(): boolean {
  return usePwaInstalled();
}
