/**
 * Detects if the PWA is already installed on the device.
 * Works by checking display-mode: standalone media query and navigator.standalone (iOS Safari).
 * 
 * @returns {boolean} True if the PWA is installed, false otherwise
 */
export function detectInstalled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // Check for display-mode: standalone (standard PWA detection)
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  // Check for iOS Safari standalone mode
  const isIOSStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  return isStandalone || isIOSStandalone;
}
