"use client";

import { usePwaInstalled } from "./use-is-pwa";
import { usePlatform } from "./use-platform";
import type { Platform } from "../core/types";

export interface UsePWAReturn {
  /**
   * Whether the app is running as a PWA (installed)
   */
  isPWA: boolean;
  /**
   * The detected platform
   */
  platform: Platform;
  /**
   * Whether the app is installed (alias for isPWA)
   */
  isInstalled: boolean;
}

/**
 * React hook that combines PWA detection and platform detection.
 * Returns an object with both isPWA/isInstalled and platform information.
 *
 * @returns {UsePWAReturn} Object containing isPWA, isInstalled, and platform
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isPWA, platform } = usePWA();
 *
 *   if (isPWA) {
 *     return <div>Running as PWA on {platform}</div>;
 *   }
 *
 *   return <div>Running in browser on {platform}</div>;
 * }
 * ```
 */
export function usePWA(): UsePWAReturn {
  const isInstalled = usePwaInstalled();
  const platform = usePlatform();

  return {
    isPWA: isInstalled,
    isInstalled,
    platform,
  };
}
