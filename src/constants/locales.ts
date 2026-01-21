import type { DefaultInstallInstructionsConfig } from "./install-instructions";

/**
 * Supported locales for install instructions.
 */
export type Locale = "en" | "pt-BR" | "es";

/**
 * English (default) locale preset.
 */
const en: Required<DefaultInstallInstructionsConfig> = {
  title: "Install App",
  subtitle: "Add to your home screen for quick access",
  subtitleMacos: "Add to Dock for quick access",
  buttonText: "Install App",
  gotItText: "Got it!",
  ios: {
    step1Title: "Tap the Share icon",
    step1Desc:
      "In Safari's bar, tap the share icon (square with arrow pointing up)",
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
 * Portuguese (Brazil) locale preset.
 */
const ptBR: Required<DefaultInstallInstructionsConfig> = {
  title: "Instalar App",
  subtitle: "Adicione à tela inicial para acesso rápido",
  subtitleMacos: "Adicione ao Dock para acesso rápido",
  buttonText: "Instalar App",
  gotItText: "Entendi!",
  ios: {
    step1Title: "Toque no ícone Compartilhar",
    step1Desc:
      "Na barra do Safari, toque no ícone de compartilhar (quadrado com seta para cima)",
    step2Title: "Role o menu para baixo",
    step2Desc: "Na janela que abrir, arraste para baixo para ver mais opções",
    step3Title: "Toque em 'Adicionar à Tela de Início'",
    step3Desc: "Em seguida, toque em 'Adicionar' no canto superior direito",
  },
  android: {
    step1Title: "Abra o menu do navegador",
    step1Desc: "Toque nos três pontos no canto superior direito",
    step2Title: "Instalar app",
    step2Desc: 'Toque em "Instalar app" ou "Adicionar à tela inicial"',
  },
  macos: {
    step1Title: "Clique no menu Arquivo",
    step1Desc: "Na barra de menus do Safari, clique em 'Arquivo'",
    step2Title: "Adicionar ao Dock",
    step2Desc: "Clique em 'Adicionar ao Dock' para criar um atalho",
  },
  desktop: {
    step1Title: "Clique no menu do navegador",
    step1Desc: "Clique nos três pontos no canto superior direito",
    step2Title: "Instalar app",
    step2Desc: "Clique em 'Instalar App' ou 'Instalar aplicativo'",
  },
};

/**
 * Spanish locale preset.
 */
const es: Required<DefaultInstallInstructionsConfig> = {
  title: "Instalar App",
  subtitle: "Añade a tu pantalla de inicio para acceso rápido",
  subtitleMacos: "Añade al Dock para acceso rápido",
  buttonText: "Instalar App",
  gotItText: "¡Entendido!",
  ios: {
    step1Title: "Toca el ícono de Compartir",
    step1Desc:
      "En la barra de Safari, toca el ícono de compartir (cuadrado con flecha hacia arriba)",
    step2Title: "Desplázate en el menú",
    step2Desc:
      "En la ventana que se abre, arrastra hacia abajo para ver más opciones",
    step3Title: "Toca 'Añadir a pantalla de inicio'",
    step3Desc: "Luego toca 'Añadir' en la esquina superior derecha",
  },
  android: {
    step1Title: "Abre el menú del navegador",
    step1Desc: "Toca los tres puntos en la esquina superior derecha",
    step2Title: "Instalar app",
    step2Desc: 'Toca "Instalar app" o "Añadir a pantalla de inicio"',
  },
  macos: {
    step1Title: "Haz clic en el menú Archivo",
    step1Desc: "En la barra de menús de Safari, haz clic en 'Archivo'",
    step2Title: "Añadir al Dock",
    step2Desc: "Haz clic en 'Añadir al Dock' para crear un acceso directo",
  },
  desktop: {
    step1Title: "Haz clic en el menú del navegador",
    step1Desc: "Haz clic en los tres puntos en la esquina superior derecha",
    step2Title: "Instalar app",
    step2Desc: "Haz clic en 'Instalar App' o 'Instalar aplicación'",
  },
};

/**
 * Map of all available locale presets.
 */
export const LOCALES: Record<
  Locale,
  Required<DefaultInstallInstructionsConfig>
> = {
  en,
  "pt-BR": ptBR,
  es,
};

/**
 * Gets the locale preset for a given locale code.
 * Falls back to English if locale is not found.
 */
export function getLocalePreset(
  locale: Locale,
): Required<DefaultInstallInstructionsConfig> {
  return LOCALES[locale] ?? LOCALES.en;
}
