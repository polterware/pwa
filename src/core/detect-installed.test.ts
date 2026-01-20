/**
 * Tests for detectInstalled function
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { detectInstalled } from "./detect-installed";

describe("detectInstalled", () => {
  const originalWindow = global.window;

  beforeEach(() => {
    // Reset window object
    delete (global as any).window;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it("should return false when window is undefined", () => {
    expect(detectInstalled()).toBe(false);
  });

  it("should return false when matchMedia returns false and navigator.standalone is false", () => {
    (global as any).window = {
      matchMedia: vi.fn(() => ({ matches: false })),
      navigator: { standalone: false },
    };
    expect(detectInstalled()).toBe(false);
  });

  it("should return true when display-mode is standalone", () => {
    (global as any).window = {
      matchMedia: vi.fn((query: string) => ({
        matches: query === "(display-mode: standalone)",
      })),
      navigator: {},
    };
    expect(detectInstalled()).toBe(true);
  });

  it("should return true when iOS standalone is true", () => {
    (global as any).window = {
      matchMedia: vi.fn(() => ({ matches: false })),
      navigator: { standalone: true },
    };
    expect(detectInstalled()).toBe(true);
  });

  it("should return true when both conditions are true", () => {
    (global as any).window = {
      matchMedia: vi.fn((query: string) => ({
        matches: query === "(display-mode: standalone)",
      })),
      navigator: { standalone: true },
    };
    expect(detectInstalled()).toBe(true);
  });
});
