import type { Platform } from "./types";

/**
 * Detects the current platform based on user agent.
 *
 * @returns {Platform} The detected platform (ios, android, macos_safari, desktop, or other)
 */
export function detectPlatform(): Platform {
  if (
    typeof window === "undefined" ||
    typeof navigator === "undefined" ||
    !window.navigator
  ) {
    return "other";
  }

  const userAgent = window.navigator.userAgent?.toLowerCase() ?? "";

  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isMac = /macintosh|mac os x/.test(userAgent);
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);

  if (isIOS) {
    return "ios";
  }

  if (isMac && isSafari) {
    return "macos_safari";
  }

  if (isAndroid) {
    return "android";
  }

  // Desktop browsers (Chrome, Edge, Firefox, etc.)
  if (!isIOS && !isAndroid) {
    return "desktop";
  }

  return "other";
}
