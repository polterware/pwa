import { describe, expect, it } from "vitest";
import { getInstallGuide } from "./install-guides";

describe("getInstallGuide", () => {
  it("returns null when no guide id is provided", () => {
    expect(getInstallGuide(null)).toBeNull();
  });

  it("returns the iOS share sheet guide", () => {
    const guide = getInstallGuide("ios_share_sheet");

    expect(guide).toMatchObject({
      id: "ios_share_sheet",
      actionLabel: "Install app",
      closeLabel: "Got it",
    });
    expect(guide?.steps).toHaveLength(3);
  });

  it("returns the Safari Add to Dock guide", () => {
    const guide = getInstallGuide("safari_add_to_dock");

    expect(guide).toMatchObject({
      id: "safari_add_to_dock",
    });
    expect(guide?.steps).toHaveLength(2);
  });

  it("merges custom overrides with defaults", () => {
    const guide = getInstallGuide("ios_share_sheet", {
      actionLabel: "Install now",
      iosShareSheet: {
        title: "Install this product",
      },
    });

    expect(guide).toMatchObject({
      title: "Install this product",
      actionLabel: "Install now",
      closeLabel: "Got it",
    });
    expect(guide?.steps[0].title).toBe("Open the Share menu");
  });

  it("supports locale presets", () => {
    const guide = getInstallGuide("safari_add_to_dock", {
      locale: "pt-BR",
    });

    expect(guide).toMatchObject({
      title: "Instale no Safari para macOS",
      actionLabel: "Instalar app",
      closeLabel: "Entendi",
    });
  });

  it("supports locale presets with overrides", () => {
    const guide = getInstallGuide("ios_share_sheet", {
      locale: "es",
      overrides: {
        iosShareSheet: {
          title: "Instala esta experiencia",
        },
      },
    });

    expect(guide).toMatchObject({
      title: "Instala esta experiencia",
      actionLabel: "Instalar app",
    });
  });

  it("falls back to English for unknown locales", () => {
    // @ts-expect-error Testing invalid locale fallback
    const guide = getInstallGuide("ios_share_sheet", { locale: "unknown" });

    expect(guide?.title).toBe("Install on iPhone or iPad");
  });
});
