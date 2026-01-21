"use client";

import { useIsInstalled } from "./use-is-installed";
import { usePlatform } from "./use-platform";
import type { Platform } from "../core/types";

export interface UsePWAReturn {
  /**
   * Whether the app is installed as a PWA
   */
  isInstalled: boolean;
  /**
   * The detected platform
   */
  platform: Platform;
}

/**
 * React hook that combines PWA installation detection and platform detection.
 *
 * @returns {UsePWAReturn} Object containing isInstalled and platform
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isInstalled, platform } = usePWA();
 *
 *   if (isInstalled) {
 *     return <div>App installed on {platform}!</div>;
 *   }
 *
 *   return <div>Running in browser on {platform}</div>;
 * }
 * ```
 */
export function usePWA(): UsePWAReturn {
  const isInstalled = useIsInstalled();
  const platform = usePlatform();

  return {
    isInstalled,
    platform,
  };
}
