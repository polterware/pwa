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
