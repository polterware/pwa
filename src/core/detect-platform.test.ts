/**
 * Tests for detectPlatform function
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { detectPlatform } from "./detect-platform";

describe("detectPlatform", () => {
  const originalWindow = global.window;

  beforeEach(() => {
    delete (global as any).window;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("should return 'other' when window is undefined", () => {
    expect(detectPlatform()).toBe("other");
  });

  it("should return 'other' when navigator is undefined", () => {
    (global as any).window = {};
    expect(detectPlatform()).toBe("other");
  });

  it("should detect iOS", () => {
    (global as any).window = {
      navigator: {
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
      },
    };
    expect(detectPlatform()).toBe("ios");
  });

  it("should detect Android", () => {
    (global as any).window = {
      navigator: {
        userAgent: "Mozilla/5.0 (Linux; Android 10; SM-G973F)",
      },
    };
    expect(detectPlatform()).toBe("android");
  });

  it("should detect macOS Safari", () => {
    (global as any).window = {
      navigator: {
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
      },
    };
    expect(detectPlatform()).toBe("macos_safari");
  });

  it("should detect desktop Chrome", () => {
    (global as any).window = {
      navigator: {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    };
    expect(detectPlatform()).toBe("desktop");
  });
});
