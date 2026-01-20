import { writeJSONFile, fileExists, getPWAConfigPath, findProjectRoot } from "./utils";
import { defaultPWAConfig } from "../config/pwa-config";

/**
 * Initializes a pwa.config.json file in the project root
 */
export async function init(): Promise<void> {
  const projectRoot = findProjectRoot();

  if (!projectRoot) {
    console.error("❌ Error: Could not find project root (looking for package.json)");
    process.exit(1);
  }

  const configPath = getPWAConfigPath(projectRoot);

  if (fileExists(configPath)) {
    console.error(`❌ Error: pwa.config.json already exists at ${configPath}`);
    console.log("💡 Tip: If you want to recreate it, delete the existing file first.");
    process.exit(1);
  }

  try {
    writeJSONFile(configPath, defaultPWAConfig);
    console.log("✅ Created pwa.config.json");
    console.log(`📝 Location: ${configPath}`);
    console.log("\n📋 Next steps:");
    console.log("1. Edit pwa.config.json with your app's information");
    console.log("2. Run: npx @polterware/pwa update");
  } catch (error) {
    console.error("❌ Error creating pwa.config.json:", error);
    process.exit(1);
  }
}
