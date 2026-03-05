const DISPLAY_MODE_QUERIES = [
  "(display-mode: standalone)",
  "(display-mode: fullscreen)",
  "(display-mode: minimal-ui)",
  "(display-mode: window-controls-overlay)",
] as const;

function matchesDisplayMode(query: (typeof DISPLAY_MODE_QUERIES)[number]): boolean {
  return (
    typeof window.matchMedia === "function" && window.matchMedia(query).matches
  );
}

export function detectInstalled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const isDisplayModeInstalled = DISPLAY_MODE_QUERIES.some(matchesDisplayMode);
  const isIOSStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
    true;

  return isDisplayModeInstalled || isIOSStandalone;
}

export { DISPLAY_MODE_QUERIES };
