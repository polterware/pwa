// Core functions (framework-agnostic)
export { detectInstalled } from "./core/detect-installed";
export { detectPlatform } from "./core/detect-platform";
export { getInstallInstructions } from "./constants/install-instructions";
export { generateManifest } from "./utils/generate-manifest";
export { getMetaTagsObject } from "./utils/get-meta-tags-object";
export { mergeManifest, getAppSpecificFields } from "./utils/merge-manifest";

// Config functions
export {
  pwaConfigToManifestConfig,
  pwaConfigToMetaTagsConfig,
  defaultPWAConfig,
} from "./config/pwa-config";

// Types
export type {
  Platform,
  InstallInstruction,
  InstallInstructions,
  ManifestConfig,
  MetaTagsConfig,
} from "./core/types";
export type { DefaultInstallInstructionsConfig } from "./constants/install-instructions";
export type { MetaTagsObject } from "./utils/get-meta-tags-object";
export type { PWAConfig } from "./config/pwa-config";
