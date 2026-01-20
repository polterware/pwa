import type { MetaTagsConfig } from "../core/types";

/**
 * Object representation of meta tags that can be used programmatically.
 * Safe to use - no HTML injection, type-safe, framework-agnostic.
 */
export interface MetaTagsObject {
  links: Array<{
    rel: string;
    href: string;
    sizes?: string;
  }>;
  meta: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

/**
 * Generates a structured object representation of PWA meta tags.
 * This is safer than generating HTML strings as it avoids XSS risks.
 * 
 * The returned object can be used in:
 * - Next.js Metadata API (with some transformation)
 * - React Helmet
 * - Other meta tag management libraries
 * - Programmatic manipulation
 * 
 * @param {MetaTagsConfig} config - The meta tags configuration
 * @returns {MetaTagsObject} Structured object with links and meta tags
 * 
 * @example
 * ```typescript
 * const metaTags = getMetaTagsObject({
 *   manifestPath: "/manifest.json",
 *   themeColor: "#7b2dff",
 *   appleMobileWebAppTitle: "My App"
 * });
 * 
 * // Use in Next.js:
 * export const metadata = {
 *   ...metaTags.meta.reduce((acc, tag) => {
 *     if (tag.name) {
 *       acc[tag.name.replace(/-/g, '')] = tag.content;
 *     }
 *     return acc;
 *   }, {}),
 *   ...metaTags.links.reduce((acc, link) => {
 *     if (link.rel === 'manifest') {
 *       acc.manifest = link.href;
 *     }
 *     return acc;
 *   }, {})
 * };
 * ```
 */
export function getMetaTagsObject(
  config: MetaTagsConfig = {}
): MetaTagsObject {
  const links: MetaTagsObject["links"] = [];
  const meta: MetaTagsObject["meta"] = [];

  // Manifest link
  if (config.manifestPath) {
    links.push({
      rel: "manifest",
      href: config.manifestPath,
    });
  }

  // Theme color meta tag
  if (config.themeColor) {
    meta.push({
      name: "theme-color",
      content: config.themeColor,
    });
  }

  // iOS/Safari PWA Support
  meta.push({
    name: "apple-mobile-web-app-capable",
    content: config.appleMobileWebAppCapable !== false ? "yes" : "no",
  });

  meta.push({
    name: "apple-mobile-web-app-status-bar-style",
    content: config.appleMobileWebAppStatusBarStyle ?? "black-translucent",
  });

  if (config.appleMobileWebAppTitle) {
    meta.push({
      name: "apple-mobile-web-app-title",
      content: config.appleMobileWebAppTitle,
    });
  }

  // Apple touch icons
  if (config.appleTouchIcons && config.appleTouchIcons.length > 0) {
    config.appleTouchIcons.forEach((icon) => {
      const link: MetaTagsObject["links"][0] = {
        rel: "apple-touch-icon",
        href: icon.href,
      };

      if (icon.sizes) {
        link.sizes = icon.sizes;
      }

      links.push(link);
    });
  }

  return {
    links,
    meta,
  };
}
