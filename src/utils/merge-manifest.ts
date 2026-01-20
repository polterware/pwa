/**
 * Fields that are considered "app-specific" and should be updated from PWA config.
 * All other fields in the manifest will be preserved.
 */
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

/**
 * Merges a new manifest configuration into an existing manifest.
 * Only updates app-specific fields, preserving all custom fields.
 * 
 * @param existingManifest - The existing manifest JSON object
 * @param newManifestConfig - The new manifest configuration to merge
 * @returns Merged manifest object
 * 
 * @example
 * ```typescript
 * const existing = {
 *   name: "Old Name",
 *   shortcuts: [{ name: "Custom Shortcut", url: "/shortcut" }],
 *   categories: ["games"]
 * };
 * 
 * const updated = mergeManifest(existing, {
 *   name: "New Name",
 *   short_name: "NewApp",
 *   description: "New description"
 * });
 * 
 * // Result: {
 * //   name: "New Name",
 * //   short_name: "NewApp",
 * //   description: "New description",
 * //   shortcuts: [{ name: "Custom Shortcut", url: "/shortcut" }], // preserved
 * //   categories: ["games"] // preserved
 * // }
 * ```
 */
export function mergeManifest(
  existingManifest: Record<string, any>,
  newManifestConfig: Record<string, any>
): Record<string, any> {
  const merged = { ...existingManifest };

  // Update only app-specific fields
  for (const [key, value] of Object.entries(newManifestConfig)) {
    if (APP_SPECIFIC_FIELDS.has(key)) {
      merged[key] = value;
    }
  }

  // Special handling for icons - always replace completely
  if (newManifestConfig.icons) {
    merged.icons = newManifestConfig.icons;
  }

  return merged;
}

/**
 * Gets the list of fields that will be updated when merging.
 * Useful for logging/debugging what will change.
 */
export function getAppSpecificFields(): string[] {
  return Array.from(APP_SPECIFIC_FIELDS);
}
