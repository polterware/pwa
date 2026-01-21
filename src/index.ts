// Core functions (framework-agnostic)
export { detectInstalled } from "./core/detect-installed";
export { detectPlatform } from "./core/detect-platform";
export { getInstallInstructions } from "./constants/install-instructions";
export { mergeManifest, getAppSpecificFields } from "./utils/merge-manifest";

// Types
export type {
  Platform,
  InstallInstruction,
  InstallInstructions,
} from "./core/types";
export type { DefaultInstallInstructionsConfig } from "./constants/install-instructions";
