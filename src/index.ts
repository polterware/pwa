export { detectInstallEnvironment } from "./core/detect-install-environment";
export { getInstallGuide } from "./constants/install-guides";
export type {
  Browser,
  DeferredBeforeInstallPromptEvent,
  InstallAvailability,
  InstallEnvironment,
  InstallGuide,
  InstallGuideId,
  InstallGuideStep,
  InstallPromptChoice,
  InstallReason,
  OperatingSystem,
  PWAInstallStatus,
} from "./core/types";
export type {
  IOSShareSheetGuideConfig,
  InstallGuideConfig,
  LocaleConfig,
  SafariAddToDockGuideConfig,
} from "./constants/install-guides";
export type { Locale } from "./constants/locales";
