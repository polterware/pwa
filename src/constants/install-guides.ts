import type { InstallGuide, InstallGuideId } from "../core/types";
import { LOCALES, type Locale } from "./locales";

export interface IOSShareSheetGuideConfig {
  title?: string;
  description?: string;
  step1Title?: string;
  step1Description?: string;
  step2Title?: string;
  step2Description?: string;
  step3Title?: string;
  step3Description?: string;
}

export interface SafariAddToDockGuideConfig {
  title?: string;
  description?: string;
  step1Title?: string;
  step1Description?: string;
  step2Title?: string;
  step2Description?: string;
}

export interface InstallGuideConfig {
  actionLabel?: string;
  closeLabel?: string;
  iosShareSheet?: IOSShareSheetGuideConfig;
  safariAddToDock?: SafariAddToDockGuideConfig;
}

export interface InstallGuideLocale {
  actionLabel: string;
  closeLabel: string;
  iosShareSheet: Required<IOSShareSheetGuideConfig>;
  safariAddToDock: Required<SafariAddToDockGuideConfig>;
}

export interface LocaleConfig {
  locale: Locale;
  overrides?: InstallGuideConfig;
}

const DEFAULT_GUIDES: InstallGuideLocale = {
  actionLabel: "Install app",
  closeLabel: "Got it",
  iosShareSheet: {
    title: "Install on iPhone or iPad",
    description: "Use Safari's share sheet to add this app to your Home Screen.",
    step1Title: "Open the Share menu",
    step1Description:
      "Tap the Share icon in Safari's toolbar to open the system share sheet.",
    step2Title: "Find the install action",
    step2Description:
      "Scroll the share sheet until you see the Add to Home Screen action.",
    step3Title: "Confirm the install",
    step3Description:
      "Tap Add to Home Screen, then tap Add to place the app on your Home Screen.",
  },
  safariAddToDock: {
    title: "Install in Safari on macOS",
    description: "Use Safari's Add to Dock action to install this web app.",
    step1Title: "Open the File menu",
    step1Description: "In Safari, open the File menu from the macOS menu bar.",
    step2Title: "Choose Add to Dock",
    step2Description:
      "Click Add to Dock to create an app-style shortcut in your Dock.",
  },
};

function mergeGuideConfig<T extends Record<string, string>>(
  baseConfig: T,
  overrides?: Partial<T>,
): T {
  if (!overrides) {
    return baseConfig;
  }

  const nextConfig = { ...baseConfig };

  for (const key in overrides) {
    const value = overrides[key];

    if (value !== undefined) {
      nextConfig[key] = value as T[Extract<keyof T, string>];
    }
  }

  return nextConfig;
}

function resolveConfig(
  config: InstallGuideConfig | LocaleConfig,
): InstallGuideLocale {
  if ("locale" in config && config.locale) {
    const localeConfig = LOCALES[config.locale] ?? LOCALES.en;
    const overrides = config.overrides ?? {};

    return {
      actionLabel: overrides.actionLabel ?? localeConfig.actionLabel,
      closeLabel: overrides.closeLabel ?? localeConfig.closeLabel,
      iosShareSheet: mergeGuideConfig(
        localeConfig.iosShareSheet,
        overrides.iosShareSheet,
      ),
      safariAddToDock: mergeGuideConfig(
        localeConfig.safariAddToDock,
        overrides.safariAddToDock,
      ),
    };
  }

  const overrides = config ?? {};

  return {
    actionLabel: overrides.actionLabel ?? DEFAULT_GUIDES.actionLabel,
    closeLabel: overrides.closeLabel ?? DEFAULT_GUIDES.closeLabel,
    iosShareSheet: mergeGuideConfig(
      DEFAULT_GUIDES.iosShareSheet,
      overrides.iosShareSheet,
    ),
    safariAddToDock: mergeGuideConfig(
      DEFAULT_GUIDES.safariAddToDock,
      overrides.safariAddToDock,
    ),
  };
}

export function getInstallGuide(
  guideId: InstallGuideId | null | undefined,
  config: InstallGuideConfig | LocaleConfig = {},
): InstallGuide | null {
  if (!guideId) {
    return null;
  }

  const resolvedConfig = resolveConfig(config);

  switch (guideId) {
    case "ios_share_sheet": {
      return {
        id: "ios_share_sheet",
        title: resolvedConfig.iosShareSheet.title,
        description: resolvedConfig.iosShareSheet.description,
        actionLabel: resolvedConfig.actionLabel,
        closeLabel: resolvedConfig.closeLabel,
        steps: [
          {
            number: 1,
            title: resolvedConfig.iosShareSheet.step1Title,
            description: resolvedConfig.iosShareSheet.step1Description,
          },
          {
            number: 2,
            title: resolvedConfig.iosShareSheet.step2Title,
            description: resolvedConfig.iosShareSheet.step2Description,
          },
          {
            number: 3,
            title: resolvedConfig.iosShareSheet.step3Title,
            description: resolvedConfig.iosShareSheet.step3Description,
          },
        ],
      };
    }

    case "safari_add_to_dock": {
      return {
        id: "safari_add_to_dock",
        title: resolvedConfig.safariAddToDock.title,
        description: resolvedConfig.safariAddToDock.description,
        actionLabel: resolvedConfig.actionLabel,
        closeLabel: resolvedConfig.closeLabel,
        steps: [
          {
            number: 1,
            title: resolvedConfig.safariAddToDock.step1Title,
            description: resolvedConfig.safariAddToDock.step1Description,
          },
          {
            number: 2,
            title: resolvedConfig.safariAddToDock.step2Title,
            description: resolvedConfig.safariAddToDock.step2Description,
          },
        ],
      };
    }

    default: {
      return null;
    }
  }
}
