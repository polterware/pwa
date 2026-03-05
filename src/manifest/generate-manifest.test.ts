import { describe, expect, it } from "vitest";
import { generateManifest } from "./generate-manifest";
import type { ManifestConfig } from "./types";

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

  it("generates the required manifest fields", () => {
    const manifest = generateManifest(baseConfig);

    expect(manifest).toMatchObject({
      name: "Test App",
      short_name: "Test",
      description: "Test description",
      start_url: "/",
      display: "standalone",
    });
  });

  it("includes optional fields when provided", () => {
    const manifest = generateManifest({
      ...baseConfig,
      background_color: "#000000",
      theme_color: "#ffffff",
      orientation: "portrait",
      categories: ["productivity"],
      lang: "en",
      dir: "ltr",
    });

    expect(manifest).toMatchObject({
      background_color: "#000000",
      theme_color: "#ffffff",
      orientation: "portrait",
      categories: ["productivity"],
      lang: "en",
      dir: "ltr",
    });
  });

  it("preserves icon purpose when provided", () => {
    const manifest = generateManifest({
      ...baseConfig,
      icons: [
        {
          src: "/icon.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    });

    expect((manifest as { icons: Array<{ purpose?: string }> }).icons[0]).toEqual(
      expect.objectContaining({
        purpose: "any maskable",
      }),
    );
  });
});
