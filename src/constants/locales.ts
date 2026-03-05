import type { InstallGuideLocale } from "./install-guides";

/**
 * Supported locales for install guides.
 */
export type Locale = "en" | "pt-BR" | "es";

/**
 * English (default) locale preset.
 */
const en: InstallGuideLocale = {
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

/**
 * Portuguese (Brazil) locale preset.
 */
const ptBR: InstallGuideLocale = {
  actionLabel: "Instalar app",
  closeLabel: "Entendi",
  iosShareSheet: {
    title: "Instale no iPhone ou iPad",
    description:
      "Use a folha de compartilhamento do Safari para adicionar este app à Tela de Início.",
    step1Title: "Abra o menu Compartilhar",
    step1Description:
      "Toque no ícone Compartilhar na barra do Safari para abrir a folha do sistema.",
    step2Title: "Encontre a ação de instalação",
    step2Description:
      "Role a folha de compartilhamento até ver a ação Adicionar à Tela de Início.",
    step3Title: "Confirme a instalação",
    step3Description:
      "Toque em Adicionar à Tela de Início e depois em Adicionar para colocar o app na sua Tela de Início.",
  },
  safariAddToDock: {
    title: "Instale no Safari para macOS",
    description:
      "Use a ação Adicionar ao Dock do Safari para instalar este web app.",
    step1Title: "Abra o menu Arquivo",
    step1Description:
      "No Safari, abra o menu Arquivo na barra de menus do macOS.",
    step2Title: "Escolha Adicionar ao Dock",
    step2Description:
      "Clique em Adicionar ao Dock para criar um atalho com comportamento de app no Dock.",
  },
};

/**
 * Spanish locale preset.
 */
const es: InstallGuideLocale = {
  actionLabel: "Instalar app",
  closeLabel: "Entendido",
  iosShareSheet: {
    title: "Instala en iPhone o iPad",
    description:
      "Usa la hoja de compartir de Safari para añadir esta app a tu pantalla de inicio.",
    step1Title: "Abre el menú Compartir",
    step1Description:
      "Toca el ícono Compartir en la barra de Safari para abrir la hoja del sistema.",
    step2Title: "Encuentra la acción de instalación",
    step2Description:
      "Desplázate por la hoja de compartir hasta ver la acción Añadir a pantalla de inicio.",
    step3Title: "Confirma la instalación",
    step3Description:
      "Toca Añadir a pantalla de inicio y luego Añadir para colocar la app en tu pantalla de inicio.",
  },
  safariAddToDock: {
    title: "Instala en Safari para macOS",
    description:
      "Usa la acción Añadir al Dock de Safari para instalar esta web app.",
    step1Title: "Abre el menú Archivo",
    step1Description:
      "En Safari, abre el menú Archivo desde la barra de menús de macOS.",
    step2Title: "Elige Añadir al Dock",
    step2Description:
      "Haz clic en Añadir al Dock para crear un acceso directo con comportamiento de app en tu Dock.",
  },
};

/**
 * Map of all available locale presets.
 */
export const LOCALES: Record<
  Locale,
  InstallGuideLocale
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
): InstallGuideLocale {
  return LOCALES[locale] ?? LOCALES.en;
}
