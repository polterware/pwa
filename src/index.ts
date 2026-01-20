// Core functions (framework-agnostic)
export { detectInstalled } from "./core/detect-installed";
export { detectPlatform } from "./core/detect-platform";
export { getInstallInstructions } from "./constants/install-instructions";
export { generateManifest } from "./utils/generate-manifest";
export { generateMetaTags, metaTagsToHTML } from "./utils/generate-meta-tags";

// Types
export type {
  Platform,
  InstallInstruction,
  InstallInstructions,
  ManifestConfig,
  MetaTagsConfig,
} from "./core/types";
export type { DefaultInstallInstructionsConfig } from "./constants/install-instructions";
export type { MetaTag } from "./utils/generate-meta-tags";
