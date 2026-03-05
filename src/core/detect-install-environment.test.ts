import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { detectInstallEnvironment } from "./detect-install-environment";

function createWindow(
  userAgent: string,
  {
    isInstalled = false,
  }: {
    isInstalled?: boolean;
  } = {},
) {
  return {
    navigator: {
      userAgent,
      standalone: false,
    },
    matchMedia: vi.fn((query: string) => ({
      matches: isInstalled && query === "(display-mode: standalone)",
    })),
  };
}

describe("detectInstallEnvironment", () => {
  const originalWindow = global.window;

  beforeEach(() => {
    delete (global as any).window;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("returns unavailable when window is undefined", () => {
    expect(detectInstallEnvironment()).toEqual({
      os: "other",
      browser: "other",
      isInstalled: false,
      availability: "unavailable",
      reason: "unknown",
      guideId: null,
    });
  });

  it("detects iOS Safari as a manual install flow", () => {
    (global as any).window = createWindow(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    );

    expect(detectInstallEnvironment()).toMatchObject({
      os: "ios",
      browser: "safari",
      availability: "manual",
      guideId: "ios_share_sheet",
    });
  });

  it("detects macOS Safari as a manual Add to Dock flow", () => {
    (global as any).window = createWindow(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    );

    expect(detectInstallEnvironment()).toMatchObject({
      os: "macos",
      browser: "safari",
      availability: "manual",
      guideId: "safari_add_to_dock",
    });
  });

  it("detects Arc on macOS as unsupported", () => {
    (global as any).window = createWindow(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Arc/1.84.0 Chrome/134.0.6998.36 Safari/537.36",
    );

    expect(detectInstallEnvironment()).toMatchObject({
      os: "macos",
      browser: "arc",
      availability: "unsupported",
      reason: "browser_unsupported",
      guideId: null,
    });
  });

  it("detects Arc on Windows as unsupported", () => {
    (global as any).window = createWindow(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Arc/1.84.0 Chrome/134.0.6998.36 Safari/537.36",
    );

    expect(detectInstallEnvironment()).toMatchObject({
      os: "windows",
      browser: "arc",
      availability: "unsupported",
      reason: "browser_unsupported",
      guideId: null,
    });
  });

  it("detects Chrome desktop as unavailable until install criteria are met", () => {
    (global as any).window = createWindow(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    );

    expect(detectInstallEnvironment()).toMatchObject({
      os: "windows",
      browser: "chrome",
      availability: "unavailable",
      reason: "criteria_unmet",
      guideId: null,
    });
  });

  it("returns already installed when the app is running in standalone mode", () => {
    (global as any).window = createWindow(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
      { isInstalled: true },
    );

    expect(detectInstallEnvironment()).toMatchObject({
      isInstalled: true,
      availability: "unavailable",
      reason: "already_installed",
      guideId: null,
    });
  });
});
