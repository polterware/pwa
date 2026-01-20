/**
 * Tests for generateManifest function
 */

import { describe, it, expect } from "vitest";
import { generateManifest } from "./generate-manifest";
import type { ManifestConfig } from "../core/types";

describe("generateManifest", () => {
  const baseConfig: ManifestConfig = {
    name: "Test App",
    short_name: "Test",
    description: "Test description",
    start_url: "/",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };

  it("should generate basic manifest", () => {
    const manifest = generateManifest(baseConfig);
    expect(manifest).toMatchObject({
      name: "Test App",
      short_name: "Test",
      description: "Test description",
      start_url: "/",
      display: "standalone",
    });
  });

  it("should include optional fields when provided", () => {
    const config: ManifestConfig = {
      ...baseConfig,
      background_color: "#000000",
      theme_color: "#ffffff",
      orientation: "portrait",
      categories: ["games"],
      lang: "en",
      dir: "ltr",
    };
    const manifest = generateManifest(config);
    expect(manifest).toMatchObject({
      background_color: "#000000",
      theme_color: "#ffffff",
      orientation: "portrait",
      categories: ["games"],
      lang: "en",
      dir: "ltr",
    });
  });

  it("should include icon purpose when provided", () => {
    const config: ManifestConfig = {
      ...baseConfig,
      icons: [
        {
          src: "/icon.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    };
    const manifest = generateManifest(config);
    expect((manifest as any).icons[0]).toMatchObject({
      purpose: "any maskable",
    });
  });
});
