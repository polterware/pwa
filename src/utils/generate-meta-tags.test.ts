/**
 * Tests for generateMetaTags function
 */

import { describe, it, expect } from "vitest";
import { generateMetaTags, metaTagsToHTML } from "./generate-meta-tags";
import type { MetaTagsConfig } from "../core/types";

describe("generateMetaTags", () => {
  it("should generate basic meta tags", () => {
    const tags = generateMetaTags();
    expect(tags.length).toBeGreaterThan(0);
    expect(tags.some((tag) => tag.attributes.name === "apple-mobile-web-app-capable")).toBe(true);
  });

  it("should include manifest link when provided", () => {
    const config: MetaTagsConfig = {
      manifestPath: "/manifest.json",
    };
    const tags = generateMetaTags(config);
    const manifestTag = tags.find((tag) => tag.attributes.rel === "manifest");
    expect(manifestTag).toBeDefined();
    expect(manifestTag?.attributes.href).toBe("/manifest.json");
  });

  it("should include theme color when provided", () => {
    const config: MetaTagsConfig = {
      themeColor: "#7b2dff",
    };
    const tags = generateMetaTags(config);
    const themeTag = tags.find((tag) => tag.attributes.name === "theme-color");
    expect(themeTag).toBeDefined();
    expect(themeTag?.attributes.content).toBe("#7b2dff");
  });

  it("should include apple touch icons", () => {
    const config: MetaTagsConfig = {
      appleTouchIcons: [
        { href: "/icon.png" },
        { href: "/icon-180.png", sizes: "180x180" },
      ],
    };
    const tags = generateMetaTags(config);
    const iconTags = tags.filter((tag) => tag.attributes.rel === "apple-touch-icon");
    expect(iconTags.length).toBe(2);
    expect(iconTags[0].attributes.href).toBe("/icon.png");
    expect(iconTags[1].attributes.href).toBe("/icon-180.png");
    expect(iconTags[1].attributes.sizes).toBe("180x180");
  });
});

describe("metaTagsToHTML", () => {
  it("should convert meta tags to HTML string", () => {
    const tags = generateMetaTags({
      manifestPath: "/manifest.json",
      themeColor: "#7b2dff",
    });
    const html = metaTagsToHTML(tags);
    expect(html).toContain('<link rel="manifest" href="/manifest.json" />');
    expect(html).toContain('<meta name="theme-color" content="#7b2dff" />');
  });
});
