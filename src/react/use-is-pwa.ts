"use client";

import { useState, useEffect } from "react";
import { detectInstalled } from "../core/detect-installed";

/**
 * React hook to check if the app is running as a PWA (installed).
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
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(detectInstalled());
  }, []);

  return isInstalled;
}

/**
 * Alias for useIsPWA().
 * @see useIsPWA
 */
export const usePwaInstalled = useIsPWA;
