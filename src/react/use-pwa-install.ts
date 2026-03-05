"use client";

import { useEffect, useRef, useState } from "react";
import {
  detectInstallEnvironment,
  promoteToNativeInstall,
} from "../core/detect-install-environment";
import { DISPLAY_MODE_QUERIES } from "../core/detect-installed";
import { getInstallGuide } from "../constants/install-guides";
import type {
  InstallGuideConfig,
  LocaleConfig,
} from "../constants/install-guides";
import type { Locale } from "../constants/locales";
import type {
  DeferredBeforeInstallPromptEvent,
  InstallEnvironment,
  InstallGuide,
  InstallPromptChoice,
  PWAInstallStatus,
} from "../core/types";

type PromptPhase = "idle" | "prompting" | "accepted" | "dismissed";

function markEnvironmentInstalled(
  environment: InstallEnvironment,
): InstallEnvironment {
  return {
    ...environment,
    isInstalled: true,
    availability: "unavailable",
    reason: "already_installed",
    guideId: null,
  };
}

function applyPromptAvailability(
  environment: InstallEnvironment,
  promptEvent: DeferredBeforeInstallPromptEvent | null,
  installOverride: boolean,
): InstallEnvironment {
  const nextEnvironment = installOverride
    ? markEnvironmentInstalled(environment)
    : environment;

  if (!promptEvent) {
    return nextEnvironment;
  }

  return promoteToNativeInstall(nextEnvironment);
}

function getInstallStatus(
  environment: InstallEnvironment,
  canPrompt: boolean,
  promptPhase: PromptPhase,
): PWAInstallStatus {
  if (environment.isInstalled) {
    return "installed";
  }

  if (promptPhase === "prompting") {
    return "prompting";
  }

  if (promptPhase === "accepted") {
    return "accepted";
  }

  if (promptPhase === "dismissed") {
    return "dismissed";
  }

  if (canPrompt) {
    return "prompt_available";
  }

  if (environment.availability === "manual") {
    return "manual";
  }

  if (environment.availability === "unsupported") {
    return "unsupported";
  }

  return "unavailable";
}

export interface UsePWAInstallOptions {
  guideConfig?: InstallGuideConfig;
  locale?: Locale;
}

export interface UsePWAInstallReturn {
  environment: InstallEnvironment;
  canPrompt: boolean;
  promptInstall: () => Promise<InstallPromptChoice | null>;
  status: PWAInstallStatus;
  guide: InstallGuide | null;
}

export function usePWAInstall({
  guideConfig,
  locale,
}: UsePWAInstallOptions = {}): UsePWAInstallReturn {
  const [environment, setEnvironment] = useState<InstallEnvironment>(() =>
    detectInstallEnvironment(),
  );
  const [deferredPrompt, setDeferredPrompt] =
    useState<DeferredBeforeInstallPromptEvent | null>(null);
  const [installOverride, setInstallOverride] = useState(environment.isInstalled);
  const [promptPhase, setPromptPhase] = useState<PromptPhase>("idle");
  const deferredPromptRef = useRef<DeferredBeforeInstallPromptEvent | null>(
    deferredPrompt,
  );
  const installOverrideRef = useRef<boolean>(installOverride);

  deferredPromptRef.current = deferredPrompt;
  installOverrideRef.current = installOverride;

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const syncEnvironment = () => {
      const nextEnvironment = detectInstallEnvironment();
      if (nextEnvironment.isInstalled) {
        installOverrideRef.current = true;
        setInstallOverride(true);
      }
      setEnvironment(
        applyPromptAvailability(
          nextEnvironment,
          deferredPromptRef.current,
          installOverrideRef.current,
        ),
      );
    };

    const handleBeforeInstallPrompt = (event: Event) => {
      const installEvent = event as DeferredBeforeInstallPromptEvent;
      installEvent.preventDefault();
      deferredPromptRef.current = installEvent;
      setDeferredPrompt(installEvent);
      setPromptPhase("idle");
      setEnvironment(
        applyPromptAvailability(
          detectInstallEnvironment(),
          installEvent,
          installOverrideRef.current,
        ),
      );
    };

    const handleAppInstalled = () => {
      deferredPromptRef.current = null;
      installOverrideRef.current = true;
      setDeferredPrompt(null);
      setInstallOverride(true);
      setPromptPhase("idle");
      setEnvironment(markEnvironmentInstalled(detectInstallEnvironment()));
    };

    syncEnvironment();

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener,
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    const mediaQueryLists = DISPLAY_MODE_QUERIES.flatMap((query) => {
      if (typeof window.matchMedia !== "function") {
        return [];
      }

      return [window.matchMedia(query)];
    });

    mediaQueryLists.forEach((mediaQueryList) => {
      if ("addEventListener" in mediaQueryList) {
        mediaQueryList.addEventListener("change", syncEnvironment);
        return;
      }

      mediaQueryList.addListener(syncEnvironment);
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);

      mediaQueryLists.forEach((mediaQueryList) => {
        if ("removeEventListener" in mediaQueryList) {
          mediaQueryList.removeEventListener("change", syncEnvironment);
          return;
        }

        mediaQueryList.removeListener(syncEnvironment);
      });
    };
  }, []);

  const guideLookupConfig: InstallGuideConfig | LocaleConfig = locale
    ? { locale, overrides: guideConfig }
    : guideConfig ?? {};
  const canPrompt = deferredPrompt !== null;
  const guide = getInstallGuide(environment.guideId, guideLookupConfig);

  async function promptInstall(): Promise<InstallPromptChoice | null> {
    const installEvent = deferredPromptRef.current;

    if (!installEvent) {
      return null;
    }

    setPromptPhase("prompting");
    await installEvent.prompt();

    const choice = await installEvent.userChoice;

    deferredPromptRef.current = null;
    setDeferredPrompt(null);
    setPromptPhase(choice.outcome === "accepted" ? "accepted" : "dismissed");
    setEnvironment(
      applyPromptAvailability(
        detectInstallEnvironment(),
        null,
        installOverrideRef.current,
      ),
    );

    return choice;
  }

  return {
    environment,
    canPrompt,
    promptInstall,
    status: getInstallStatus(environment, canPrompt, promptPhase),
    guide,
  };
}
