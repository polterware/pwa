import { describe, expect, it } from "vitest";
import { getAppSpecificFields, mergeManifest } from "./merge-manifest";

describe("mergeManifest", () => {
  it("updates app-specific fields and preserves custom fields", () => {
    const merged = mergeManifest(
      {
        name: "Old App",
        shortcuts: [{ name: "Open inbox", url: "/inbox" }],
        theme_color: "#111111",
      },
      {
        name: "New App",
        theme_color: "#222222",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    );

    expect(merged).toEqual({
      name: "New App",
      shortcuts: [{ name: "Open inbox", url: "/inbox" }],
      theme_color: "#222222",
      icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    });
  });

  it("lists the manifest fields controlled by the merge helper", () => {
    expect(getAppSpecificFields()).toContain("icons");
    expect(getAppSpecificFields()).toContain("start_url");
  });
});
