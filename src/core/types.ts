export type Platform = "ios" | "macos_safari" | "android" | "desktop" | "other";

export interface InstallInstruction {
  number: number;
  title: string;
  description: string;
}

export interface InstallInstructions {
  platform: Platform;
  steps: InstallInstruction[];
  title: string;
  subtitle: string;
  buttonText: string;
  gotItText: string;
}

export interface ManifestConfig {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display?: "standalone" | "fullscreen" | "minimal-ui" | "browser";
  background_color?: string;
  theme_color?: string;
  orientation?: "portrait" | "landscape" | "any";
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: "any" | "maskable" | "any maskable";
  }>;
  categories?: string[];
  lang?: string;
  dir?: "ltr" | "rtl";
}

export interface MetaTagsConfig {
  manifestPath?: string;
  themeColor?: string;
  appleMobileWebAppCapable?: boolean;
  appleMobileWebAppStatusBarStyle?: "default" | "black" | "black-translucent";
  appleMobileWebAppTitle?: string;
  appleTouchIcons?: Array<{
    href: string;
    sizes?: string;
  }>;
}
