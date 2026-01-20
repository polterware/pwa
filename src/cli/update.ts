import { join } from "path";
import {
  findManifest,
  findProjectRoot,
  readJSONFile,
  writeJSONFile,
  getPWAConfigPath,
  fileExists,
} from "./utils";
import { pwaConfigToManifestConfig } from "../config/pwa-config";
import { generateManifest } from "../utils/generate-manifest";
import { mergeManifest } from "../utils/merge-manifest";

/**
 * Updates the manifest.json file based on pwa.config.json
 */
export async function update(manifestPath?: string): Promise<void> {
  const projectRoot = findProjectRoot();

  if (!projectRoot) {
    console.error("❌ Error: Could not find project root (looking for package.json)");
    process.exit(1);
  }

  // Read pwa.config.json
  const configPath = getPWAConfigPath(projectRoot);
  if (!fileExists(configPath)) {
    console.error(`❌ Error: pwa.config.json not found at ${configPath}`);
    console.log("💡 Tip: Run 'npx @polterware/pwa init' to create it.");
    process.exit(1);
  }

  let config;
  try {
    config = readJSONFile(configPath);
  } catch (error) {
    console.error("❌ Error reading pwa.config.json:", error);
    process.exit(1);
  }

  // Find or use provided manifest path
  let manifestFilePath = manifestPath
    ? join(projectRoot, manifestPath)
    : findManifest(projectRoot);

  if (!manifestFilePath) {
    console.error("❌ Error: Could not find manifest.json");
    console.log("💡 Searched in:");
    console.log("   - manifest.json (root)");
    console.log("   - public/manifest.json");
    console.log("   - app/manifest.json");
    console.log("\n💡 Tip: Create a manifest.json file or specify the path with --manifest-path");
    process.exit(1);
  }

  // Read existing manifest
  let existingManifest: Record<string, any> = {};
  if (fileExists(manifestFilePath)) {
    try {
      existingManifest = readJSONFile(manifestFilePath);
      console.log(`📖 Found existing manifest at: ${manifestFilePath}`);
    } catch (error) {
      console.warn("⚠️  Warning: Could not parse existing manifest, creating new one");
    }
  } else {
    console.log(`📝 Creating new manifest at: ${manifestFilePath}`);
  }

  // Convert PWA config to manifest config and generate
  const manifestConfig = pwaConfigToManifestConfig(config);
  const newManifestData = generateManifest(manifestConfig);

  // Merge with existing manifest
  const mergedManifest = mergeManifest(existingManifest, newManifestData);

  // Write updated manifest
  try {
    writeJSONFile(manifestFilePath, mergedManifest);
    console.log("✅ Successfully updated manifest.json");
    
    // Show what was updated
    const updatedFields = Object.keys(newManifestData);
    console.log(`📋 Updated fields: ${updatedFields.join(", ")}`);
  } catch (error) {
    console.error("❌ Error writing manifest.json:", error);
    process.exit(1);
  }
}
