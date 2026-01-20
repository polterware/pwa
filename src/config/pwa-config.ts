import type { MetaTagsConfig } from "../core/types";

/**
 * Configuration format for pwa.config.json
 * Uses camelCase for JSON compatibility
 */
export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  display?: "standalone" | "fullscreen" | "minimal-ui" | "browser";
  themeColor?: string;
  backgroundColor?: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: "any" | "maskable" | "any maskable";
  }>;
  metaTags?: {
    manifestPath?: string;
    themeColor?: string;
    appleMobileWebAppCapable?: boolean;
    appleMobileWebAppStatusBarStyle?: "default" | "black" | "black-translucent";
    appleMobileWebAppTitle?: string;
    appleTouchIcons?: Array<{
      href: string;
      sizes?: string;
    }>;
  };
}

/**
 * Default template for pwa.config.json
 */
export const defaultPWAConfig: PWAConfig = {
  name: "My App",
  shortName: "MyApp",
  description: "My awesome progressive web app",
  startUrl: "/",
  display: "standalone",
  themeColor: "#000000",
  backgroundColor: "#ffffff",
  icons: [
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable",
    },
    {
      src: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
  metaTags: {
    appleMobileWebAppCapable: true,
    appleMobileWebAppStatusBarStyle: "default",
    appleMobileWebAppTitle: "My App",
    appleTouchIcons: [
      {
        href: "/icons/apple-touch-icon.png",
      },
    ],
  },
};

/**
 * Converts PWAConfig to ManifestConfig format
 */
export function pwaConfigToManifestConfig(config: PWAConfig): import("../core/types").ManifestConfig {
  return {
    name: config.name,
    short_name: config.shortName,
    description: config.description,
    start_url: config.startUrl,
    display: config.display,
    theme_color: config.themeColor,
    background_color: config.backgroundColor,
    icons: config.icons,
  };
}

/**
 * Converts PWAConfig metaTags to MetaTagsConfig format
 */
export function pwaConfigToMetaTagsConfig(config: PWAConfig): MetaTagsConfig {
  if (!config.metaTags) {
    return {};
  }

  return {
    manifestPath: config.metaTags.manifestPath,
    themeColor: config.metaTags.themeColor || config.themeColor,
    appleMobileWebAppCapable: config.metaTags.appleMobileWebAppCapable,
    appleMobileWebAppStatusBarStyle: config.metaTags.appleMobileWebAppStatusBarStyle,
    appleMobileWebAppTitle: config.metaTags.appleMobileWebAppTitle,
    appleTouchIcons: config.metaTags.appleTouchIcons,
  };
}
