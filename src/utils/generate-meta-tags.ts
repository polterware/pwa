import type { MetaTagsConfig } from "../core/types";

export interface MetaTag {
  tag: string;
  attributes: Record<string, string>;
}

/**
 * Generates HTML meta tags for PWA support.
 * Returns an array of meta tag objects that can be used to generate HTML.
 * 
 * @param {MetaTagsConfig} config - The meta tags configuration
 * @returns {MetaTag[]} Array of meta tag objects
 */
export function generateMetaTags(config: MetaTagsConfig = {}): MetaTag[] {
  const tags: MetaTag[] = [];

  // Manifest link
  if (config.manifestPath) {
    tags.push({
      tag: "link",
      attributes: {
        rel: "manifest",
        href: config.manifestPath,
      },
    });
  }

  // Theme color
  if (config.themeColor) {
    tags.push({
      tag: "meta",
      attributes: {
        name: "theme-color",
        content: config.themeColor,
      },
    });
  }

  // iOS/Safari PWA Support
  tags.push({
    tag: "meta",
    attributes: {
      name: "apple-mobile-web-app-capable",
      content: config.appleMobileWebAppCapable !== false ? "yes" : "no",
    },
  });

  tags.push({
    tag: "meta",
    attributes: {
      name: "apple-mobile-web-app-status-bar-style",
      content: config.appleMobileWebAppStatusBarStyle ?? "black-translucent",
    },
  });

  if (config.appleMobileWebAppTitle) {
    tags.push({
      tag: "meta",
      attributes: {
        name: "apple-mobile-web-app-title",
        content: config.appleMobileWebAppTitle,
      },
    });
  }

  // Apple touch icons
  if (config.appleTouchIcons && config.appleTouchIcons.length > 0) {
    config.appleTouchIcons.forEach((icon) => {
      const attributes: Record<string, string> = {
        rel: "apple-touch-icon",
        href: icon.href,
      };

      if (icon.sizes) {
        attributes.sizes = icon.sizes;
      }

      tags.push({
        tag: "link",
        attributes,
      });
    });
  }

  return tags;
}

/**
 * Converts meta tags to HTML string.
 * 
 * @param {MetaTag[]} tags - Array of meta tag objects
 * @returns {string} HTML string with meta tags
 */
export function metaTagsToHTML(tags: MetaTag[]): string {
  return tags
    .map((tag) => {
      const attrs = Object.entries(tag.attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
      return `<${tag.tag} ${attrs} />`;
    })
    .join("\n");
}
