// Core functions (framework-agnostic)
export { detectInstalled } from "./core/detect-installed";
export { detectPlatform } from "./core/detect-platform";
export { getInstallInstructions } from "./constants/install-instructions";

// Types
export type {
  Platform,
  InstallInstruction,
  InstallInstructions,
} from "./core/types";
export type {
  DefaultInstallInstructionsConfig,
  LocaleConfig,
} from "./constants/install-instructions";
export type { Locale } from "./constants/locales";
