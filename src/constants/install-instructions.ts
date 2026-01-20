import type { Platform, InstallInstructions } from "../core/types";

export interface DefaultInstallInstructionsConfig {
  title?: string;
  subtitle?: string;
  subtitleMacos?: string;
  buttonText?: string;
  gotItText?: string;
  ios?: {
    step1Title?: string;
    step1Desc?: string;
    step2Title?: string;
    step2Desc?: string;
    step3Title?: string;
    step3Desc?: string;
  };
  android?: {
    step1Title?: string;
    step1Desc?: string;
    step2Title?: string;
    step2Desc?: string;
  };
  macos?: {
    step1Title?: string;
    step1Desc?: string;
    step2Title?: string;
    step2Desc?: string;
  };
  desktop?: {
    step1Title?: string;
    step1Desc?: string;
    step2Title?: string;
    step2Desc?: string;
  };
}

const DEFAULT_INSTRUCTIONS: Required<DefaultInstallInstructionsConfig> = {
  title: "Install App",
  subtitle: "Add to your home screen for quick access",
  subtitleMacos: "Add to Dock for quick access",
  buttonText: "Install App",
  gotItText: "Got it!",
  ios: {
    step1Title: "Tap the Share icon",
    step1Desc: "In Safari's bar, tap the share icon (square with arrow pointing up)",
    step2Title: "Scroll down the menu",
    step2Desc: "In the sheet that opens, drag down to see more options",
    step3Title: "Tap 'Add to Home Screen'",
    step3Desc: "Then tap 'Add' in the top right corner",
  },
  android: {
    step1Title: "Open browser menu",
    step1Desc: "Tap the three dots in the top right corner",
    step2Title: "Install app",
    step2Desc: 'Tap "Install app" or "Add to Home Screen"',
  },
  macos: {
    step1Title: "Click the File menu",
    step1Desc: "In Safari's menu bar, click 'File'",
    step2Title: "Add to Dock",
    step2Desc: "Click 'Add to Dock' to create a shortcut",
  },
  desktop: {
    step1Title: "Click the browser menu",
    step1Desc: "Click the three dots in the top right corner",
    step2Title: "Install app",
    step2Desc: "Click 'Install App' or 'Install app'",
  },
};

/**
 * Gets install instructions for a specific platform.
 * 
 * @param {Platform} platform - The platform to get instructions for
 * @param {DefaultInstallInstructionsConfig} config - Optional configuration to override default texts
 * @returns {InstallInstructions} The install instructions for the platform
 */
export function getInstallInstructions(
  platform: Platform,
  config: DefaultInstallInstructionsConfig = {}
): InstallInstructions {
  const mergedConfig = {
    title: config.title ?? DEFAULT_INSTRUCTIONS.title,
    subtitle: config.subtitle ?? DEFAULT_INSTRUCTIONS.subtitle,
    subtitleMacos: config.subtitleMacos ?? DEFAULT_INSTRUCTIONS.subtitleMacos,
    buttonText: config.buttonText ?? DEFAULT_INSTRUCTIONS.buttonText,
    gotItText: config.gotItText ?? DEFAULT_INSTRUCTIONS.gotItText,
    ios: { ...DEFAULT_INSTRUCTIONS.ios, ...config.ios },
    android: { ...DEFAULT_INSTRUCTIONS.android, ...config.android },
    macos: { ...DEFAULT_INSTRUCTIONS.macos, ...config.macos },
    desktop: { ...DEFAULT_INSTRUCTIONS.desktop, ...config.desktop },
  };

  switch (platform) {
    case "ios": {
      return {
        platform: "ios",
        title: mergedConfig.title,
        subtitle: mergedConfig.subtitle,
        buttonText: mergedConfig.buttonText,
        gotItText: mergedConfig.gotItText,
        steps: [
          {
            number: 1,
            title: mergedConfig.ios.step1Title,
            description: mergedConfig.ios.step1Desc,
          },
          {
            number: 2,
            title: mergedConfig.ios.step2Title,
            description: mergedConfig.ios.step2Desc,
          },
          {
            number: 3,
            title: mergedConfig.ios.step3Title,
            description: mergedConfig.ios.step3Desc,
          },
        ],
      };
    }

    case "macos_safari": {
      return {
        platform: "macos_safari",
        title: mergedConfig.title,
        subtitle: mergedConfig.subtitleMacos,
        buttonText: mergedConfig.buttonText,
        gotItText: mergedConfig.gotItText,
        steps: [
          {
            number: 1,
            title: mergedConfig.macos.step1Title,
            description: mergedConfig.macos.step1Desc,
          },
          {
            number: 2,
            title: mergedConfig.macos.step2Title,
            description: mergedConfig.macos.step2Desc,
          },
        ],
      };
    }

    case "android": {
      return {
        platform: "android",
        title: mergedConfig.title,
        subtitle: mergedConfig.subtitle,
        buttonText: mergedConfig.buttonText,
        gotItText: mergedConfig.gotItText,
        steps: [
          {
            number: 1,
            title: mergedConfig.android.step1Title,
            description: mergedConfig.android.step1Desc,
          },
          {
            number: 2,
            title: mergedConfig.android.step2Title,
            description: mergedConfig.android.step2Desc,
          },
        ],
      };
    }

    case "desktop":
    case "other": {
      return {
        platform: platform === "desktop" ? "desktop" : "other",
        title: mergedConfig.title,
        subtitle: mergedConfig.subtitle,
        buttonText: mergedConfig.buttonText,
        gotItText: mergedConfig.gotItText,
        steps: [
          {
            number: 1,
            title: mergedConfig.desktop.step1Title,
            description: mergedConfig.desktop.step1Desc,
          },
          {
            number: 2,
            title: mergedConfig.desktop.step2Title,
            description: mergedConfig.desktop.step2Desc,
          },
        ],
      };
    }

    default: {
      return {
        platform: "other",
        title: mergedConfig.title,
        subtitle: mergedConfig.subtitle,
        buttonText: mergedConfig.buttonText,
        gotItText: mergedConfig.gotItText,
        steps: [],
      };
    }
  }
}
