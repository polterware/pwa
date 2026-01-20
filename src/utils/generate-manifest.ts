import type { ManifestConfig } from "../core/types";

/**
 * Generates a Web App Manifest JSON object based on the provided configuration.
 * 
 * @param {ManifestConfig} config - The manifest configuration
 * @returns {object} The manifest JSON object
 */
export function generateManifest(config: ManifestConfig): object {
  const manifest: any = {
    name: config.name,
    short_name: config.short_name,
    description: config.description,
    start_url: config.start_url,
    display: config.display ?? "standalone",
  };

  if (config.background_color) {
    manifest.background_color = config.background_color;
  }

  if (config.theme_color) {
    manifest.theme_color = config.theme_color;
  }

  if (config.orientation) {
    manifest.orientation = config.orientation;
  }

  manifest.icons = config.icons.map((icon) => ({
    src: icon.src,
    sizes: icon.sizes,
    type: icon.type,
    ...(icon.purpose && { purpose: icon.purpose }),
  }));

  if (config.categories && config.categories.length > 0) {
    manifest.categories = config.categories;
  }

  if (config.lang) {
    manifest.lang = config.lang;
  }

  if (config.dir) {
    manifest.dir = config.dir;
  }

  return manifest;
}
