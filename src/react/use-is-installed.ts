"use client";

import { useState, useEffect } from "react";
import { detectInstalled } from "../core/detect-installed";

/**
 * React hook to check if the PWA is installed.
 *
 * @returns {boolean} True if the app is installed as a PWA, false otherwise
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isInstalled = useIsInstalled();
 *
 *   if (isInstalled) {
 *     return <div>App is installed!</div>;
 *   }
 *
 *   return <div>Install our app</div>;
 * }
 * ```
 */
export function useIsInstalled(): boolean {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    setIsInstalled(detectInstalled());
  }, []);

  return isInstalled;
}
