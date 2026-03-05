import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DeferredBeforeInstallPromptEvent } from "../core/types";
import {
  usePWAInstall,
  type UsePWAInstallOptions,
  type UsePWAInstallReturn,
} from "./use-pwa-install";

function setUserAgent(userAgent: string) {
  Object.defineProperty(window.navigator, "userAgent", {
    value: userAgent,
    configurable: true,
  });
}

function mockMatchMedia(matches = false) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      media: query,
      matches,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function createBeforeInstallPromptEvent(
  outcome: "accepted" | "dismissed" = "accepted",
): DeferredBeforeInstallPromptEvent {
  const event = new Event("beforeinstallprompt", {
    cancelable: true,
  }) as DeferredBeforeInstallPromptEvent;

  event.prompt = vi.fn().mockResolvedValue(undefined);

  Object.defineProperty(event, "userChoice", {
    configurable: true,
    value: Promise.resolve({
      outcome,
      platform: "web",
    }),
  });

  return event;
}

function renderUsePWAInstall(options: UsePWAInstallOptions = {}) {
  let currentValue: UsePWAInstallReturn | null = null;
  const container = document.createElement("div");
  const root = createRoot(container);

  function HookHarness({ hookOptions }: { hookOptions: UsePWAInstallOptions }) {
    currentValue = usePWAInstall(hookOptions);
    return null;
  }

  act(() => {
    root.render(<HookHarness hookOptions={options} />);
  });

  return {
    get current() {
      if (!currentValue) {
        throw new Error("Hook state was not initialized");
      }

      return currentValue;
    },
    unmount() {
      act(() => {
        root.unmount();
      });
    },
  };
}

describe("usePWAInstall", () => {
  const originalMatchMedia = window.matchMedia;
  const originalUserAgent = window.navigator.userAgent;

  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: originalMatchMedia,
    });
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      value: originalUserAgent,
    });
    vi.restoreAllMocks();
  });

  it("returns a manual guide for iOS Safari", () => {
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    );

    const hook = renderUsePWAInstall();

    expect(hook.current.status).toBe("manual");
    expect(hook.current.canPrompt).toBe(false);
    expect(hook.current.guide?.id).toBe("ios_share_sheet");

    hook.unmount();
  });

  it("captures beforeinstallprompt and exposes a native prompt flow", () => {
    setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    );

    const hook = renderUsePWAInstall();
    const event = createBeforeInstallPromptEvent();

    act(() => {
      window.dispatchEvent(event);
    });

    expect(event.defaultPrevented).toBe(true);
    expect(hook.current.canPrompt).toBe(true);
    expect(hook.current.status).toBe("prompt_available");
    expect(hook.current.environment.availability).toBe("native");
    expect(hook.current.guide).toBeNull();

    hook.unmount();
  });

  it("resolves an accepted install prompt", async () => {
    setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    );

    const hook = renderUsePWAInstall();
    const event = createBeforeInstallPromptEvent("accepted");
    let choice: Awaited<ReturnType<UsePWAInstallReturn["promptInstall"]>> =
      null;

    act(() => {
      window.dispatchEvent(event);
    });

    await act(async () => {
      choice = await hook.current.promptInstall();
    });

    expect(event.prompt).toHaveBeenCalledTimes(1);
    expect(choice).toEqual({
      outcome: "accepted",
      platform: "web",
    });
    expect(hook.current.canPrompt).toBe(false);
    expect(hook.current.status).toBe("accepted");

    hook.unmount();
  });

  it("marks the app as installed after appinstalled", () => {
    setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    );

    const hook = renderUsePWAInstall();
    const event = createBeforeInstallPromptEvent("accepted");

    act(() => {
      window.dispatchEvent(event);
    });

    act(() => {
      window.dispatchEvent(new Event("appinstalled"));
    });

    expect(hook.current.environment.isInstalled).toBe(true);
    expect(hook.current.canPrompt).toBe(false);
    expect(hook.current.status).toBe("installed");
    expect(hook.current.guide).toBeNull();

    hook.unmount();
  });
});
