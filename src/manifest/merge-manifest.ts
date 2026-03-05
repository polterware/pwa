const APP_SPECIFIC_FIELDS = new Set([
  "name",
  "short_name",
  "description",
  "start_url",
  "display",
  "theme_color",
  "background_color",
  "icons",
]);

export function mergeManifest(
  existingManifest: Record<string, any>,
  newManifestConfig: Record<string, any>,
): Record<string, any> {
  const merged = { ...existingManifest };

  for (const [key, value] of Object.entries(newManifestConfig)) {
    if (APP_SPECIFIC_FIELDS.has(key)) {
      merged[key] = value;
    }
  }

  if (newManifestConfig.icons) {
    merged.icons = newManifestConfig.icons;
  }

  return merged;
}

export function getAppSpecificFields(): string[] {
  return Array.from(APP_SPECIFIC_FIELDS);
}
