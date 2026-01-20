/**
 * Tests for install instructions
 */

import { describe, it, expect } from "vitest";
import { getInstallInstructions } from "./install-instructions";
import type { Platform } from "../core/types";

describe("getInstallInstructions", () => {
  it("should return iOS instructions", () => {
    const instructions = getInstallInstructions("ios");
    expect(instructions.platform).toBe("ios");
    expect(instructions.steps).toHaveLength(3);
    expect(instructions.steps[0].number).toBe(1);
    expect(instructions.steps[0].title).toBeDefined();
    expect(instructions.steps[0].description).toBeDefined();
  });

  it("should return Android instructions", () => {
    const instructions = getInstallInstructions("android");
    expect(instructions.platform).toBe("android");
    expect(instructions.steps).toHaveLength(2);
    expect(instructions.steps[0].number).toBe(1);
  });

  it("should return macOS Safari instructions", () => {
    const instructions = getInstallInstructions("macos_safari");
    expect(instructions.platform).toBe("macos_safari");
    expect(instructions.steps).toHaveLength(2);
    expect(instructions.subtitle).toContain("Dock");
  });

  it("should return desktop instructions", () => {
    const instructions = getInstallInstructions("desktop");
    expect(instructions.platform).toBe("desktop");
    expect(instructions.steps).toHaveLength(2);
  });

  it("should return other platform instructions", () => {
    const instructions = getInstallInstructions("other");
    expect(instructions.platform).toBe("other");
    expect(instructions.steps).toHaveLength(2);
  });

  it("should allow customizing instruction texts", () => {
    const instructions = getInstallInstructions("ios", {
      title: "Custom Title",
      subtitle: "Custom Subtitle",
      buttonText: "Custom Button",
      gotItText: "Custom Got It",
      ios: {
        step1Title: "Custom Step 1",
        step1Desc: "Custom Description 1",
      },
    });

    expect(instructions.title).toBe("Custom Title");
    expect(instructions.subtitle).toBe("Custom Subtitle");
    expect(instructions.buttonText).toBe("Custom Button");
    expect(instructions.gotItText).toBe("Custom Got It");
    expect(instructions.steps[0].title).toBe("Custom Step 1");
    expect(instructions.steps[0].description).toBe("Custom Description 1");
  });

  it("should merge custom config with defaults", () => {
    const instructions = getInstallInstructions("android", {
      title: "Custom Title",
      // Other fields should use defaults
    });

    expect(instructions.title).toBe("Custom Title");
    expect(instructions.buttonText).toBeDefined();
    expect(instructions.steps[0].title).toBeDefined();
  });
});
