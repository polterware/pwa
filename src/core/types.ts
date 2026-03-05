export type OperatingSystem =
  | "ios"
  | "android"
  | "macos"
  | "windows"
  | "linux"
  | "other";

export type Browser =
  | "safari"
  | "chrome"
  | "arc"
  | "edge"
  | "firefox"
  | "samsungInternet"
  | "other";

export type InstallAvailability =
  | "native"
  | "manual"
  | "unsupported"
  | "unavailable";

export type InstallReason =
  | "already_installed"
  | "browser_unsupported"
  | "criteria_unmet"
  | "unknown";

export type InstallGuideId = "ios_share_sheet" | "safari_add_to_dock";

export interface InstallEnvironment {
  os: OperatingSystem;
  browser: Browser;
  isInstalled: boolean;
  availability: InstallAvailability;
  reason: InstallReason;
  guideId: InstallGuideId | null;
}

export interface InstallGuideStep {
  number: number;
  title: string;
  description: string;
}

export interface InstallGuide {
  id: InstallGuideId;
  title: string;
  description: string;
  actionLabel: string;
  closeLabel: string;
  steps: InstallGuideStep[];
}

export interface InstallPromptChoice {
  outcome: "accepted" | "dismissed";
  platform: string;
}

export interface DeferredBeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallPromptChoice>;
}

export type PWAInstallStatus =
  | "installed"
  | "manual"
  | "prompt_available"
  | "prompting"
  | "accepted"
  | "dismissed"
  | "unsupported"
  | "unavailable";
