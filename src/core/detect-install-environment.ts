import { detectInstalled } from "./detect-installed";
import type {
  Browser,
  InstallEnvironment,
  InstallGuideId,
  InstallReason,
  OperatingSystem,
} from "./types";

const NATIVE_INSTALL_BROWSERS = new Set<Browser>([
  "chrome",
  "edge",
  "samsungInternet",
]);

function detectOperatingSystem(userAgent: string): OperatingSystem {
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  }

  if (/android/.test(userAgent)) {
    return "android";
  }

  if (/windows nt/.test(userAgent)) {
    return "windows";
  }

  if (/macintosh|mac os x/.test(userAgent)) {
    return "macos";
  }

  if (/linux|x11/.test(userAgent)) {
    return "linux";
  }

  return "other";
}

function detectBrowser(userAgent: string): Browser {
  if (/arc\//.test(userAgent)) {
    return "arc";
  }

  if (/edg\//.test(userAgent) || /edgios\//.test(userAgent) || /edga\//.test(userAgent)) {
    return "edge";
  }

  if (/samsungbrowser\//.test(userAgent)) {
    return "samsungInternet";
  }

  if (/firefox\//.test(userAgent) || /fxios\//.test(userAgent)) {
    return "firefox";
  }

  if (
    (/chrome\//.test(userAgent) || /crios\//.test(userAgent)) &&
    !/opr\/|opera|edg|arc|samsungbrowser/.test(userAgent)
  ) {
    return "chrome";
  }

  if (
    /safari\//.test(userAgent) &&
    !/chrome|crios|edg|opr|opera|arc|samsungbrowser/.test(userAgent)
  ) {
    return "safari";
  }

  return "other";
}

function resolveManualGuide(
  os: OperatingSystem,
  browser: Browser,
): InstallGuideId | null {
  if (browser === "safari" && os === "ios") {
    return "ios_share_sheet";
  }

  if (browser === "safari" && os === "macos") {
    return "safari_add_to_dock";
  }

  return null;
}

function resolveReason(
  os: OperatingSystem,
  browser: Browser,
  isInstalled: boolean,
): { reason: InstallReason; guideId: InstallGuideId | null } {
  if (isInstalled) {
    return {
      reason: "already_installed",
      guideId: null,
    };
  }

  const guideId = resolveManualGuide(os, browser);

  if (guideId) {
    return {
      reason: "unknown",
      guideId,
    };
  }

  if (browser === "arc") {
    return {
      reason: "browser_unsupported",
      guideId: null,
    };
  }

  if (browser === "firefox" || browser === "other") {
    return {
      reason: "browser_unsupported",
      guideId: null,
    };
  }

  if (os === "ios" && browser !== "safari") {
    return {
      reason: "browser_unsupported",
      guideId: null,
    };
  }

  if (NATIVE_INSTALL_BROWSERS.has(browser)) {
    return {
      reason: "criteria_unmet",
      guideId: null,
    };
  }

  return {
    reason: "unknown",
    guideId: null,
  };
}

function resolveAvailability(reason: InstallReason, guideId: InstallGuideId | null) {
  if (reason === "already_installed") {
    return "unavailable";
  }

  if (guideId) {
    return "manual";
  }

  if (reason === "browser_unsupported") {
    return "unsupported";
  }

  return "unavailable";
}

export function detectInstallEnvironment(): InstallEnvironment {
  if (
    typeof window === "undefined" ||
    typeof navigator === "undefined" ||
    !window.navigator
  ) {
    return {
      os: "other",
      browser: "other",
      isInstalled: false,
      availability: "unavailable",
      reason: "unknown",
      guideId: null,
    };
  }

  const userAgent = window.navigator.userAgent?.toLowerCase() ?? "";
  const os = detectOperatingSystem(userAgent);
  const browser = detectBrowser(userAgent);
  const isInstalled = detectInstalled();
  const { reason, guideId } = resolveReason(os, browser, isInstalled);

  return {
    os,
    browser,
    isInstalled,
    availability: resolveAvailability(reason, guideId),
    reason,
    guideId,
  };
}

export function promoteToNativeInstall(
  environment: InstallEnvironment,
): InstallEnvironment {
  if (environment.isInstalled) {
    return environment;
  }

  return {
    ...environment,
    availability: "native",
    reason: "unknown",
    guideId: null,
  };
}

export { detectBrowser, detectOperatingSystem };
