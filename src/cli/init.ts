import { existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import prompts from "prompts";
import {
  findProjectRoot,
  findManifest,
  fileExists,
  readJSONFile,
  writeJSONFile,
} from "./utils";
import { generateManifest } from "../utils/generate-manifest";
import type { ManifestConfig } from "../core/types";

/**
 * Extracts icon folder path from existing icons
 */
function extractIconFolder(existing: any): string {
  if (existing?.icons && Array.isArray(existing.icons) && existing.icons.length > 0) {
    const firstIcon = existing.icons[0];
    if (firstIcon.src) {
      // Extract folder path (remove filename)
      const pathParts = firstIcon.src.split("/");
      pathParts.pop(); // Remove filename
      return pathParts.join("/") || "/icons";
    }
  }
  return "/icons";
}

/**
 * Reads existing manifest and extracts values for placeholders
 */
function readExistingManifest(manifestPath: string): Partial<ManifestConfig> & { _iconFolder?: string } | null {
  if (!fileExists(manifestPath)) {
    return null;
  }

  try {
    const existing = readJSONFile<any>(manifestPath);
    
    // Extract icon folder path
    const iconFolder = extractIconFolder(existing);

    return {
      name: existing.name || "",
      short_name: existing.short_name || "",
      description: existing.description || "",
      start_url: existing.start_url || "",
      theme_color: existing.theme_color || "",
      background_color: existing.background_color || "",
      icons: existing.icons || [],
      // Store icon folder separately for easier access
      _iconFolder: iconFolder,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Generates icon entries from folder path and sizes
 */
function generateIconsFromFolder(folderPath: string, sizes: string[]): Array<{
  src: string;
  sizes: string;
  type: string;
  purpose: string;
}> {
  const defaultType = "image/png";
  
  // Ensure folder path ends with /
  const normalizedFolder = folderPath.endsWith("/") ? folderPath : `${folderPath}/`;
  
  return sizes.map((size) => ({
    src: `${normalizedFolder}icon-${size}.png`,
    sizes: size,
    type: defaultType,
    purpose: "any maskable",
  }));
}

/**
 * Interactive manifest initialization
 */
export async function init(manifestPath?: string): Promise<void> {
  const projectRoot = findProjectRoot();

  if (!projectRoot) {
    console.error("❌ Error: Could not find project root (looking for package.json)");
    process.exit(1);
  }

  // Determine manifest path
  let manifestFilePath: string;
  
  if (manifestPath) {
    manifestFilePath = join(projectRoot, manifestPath);
  } else {
    // Try to find existing manifest
    const existingManifestPath = findManifest(projectRoot);
    if (existingManifestPath) {
      manifestFilePath = existingManifestPath;
      console.log(`📖 Found existing manifest at: ${existingManifestPath}`);
    } else {
      // Default to public/manifest.json (common location)
      manifestFilePath = join(projectRoot, "public", "manifest.json");
      
      // Create public directory if it doesn't exist
      const publicDir = dirname(manifestFilePath);
      if (!existsSync(publicDir)) {
        try {
          mkdirSync(publicDir, { recursive: true });
        } catch (error) {
          // If can't create public, use root
          manifestFilePath = join(projectRoot, "manifest.json");
        }
      }
    }
  }

  // Read existing manifest if it exists
  const existing = readExistingManifest(manifestFilePath);

  console.log("\n📝 Let's set up your PWA manifest!\n");

  // Interactive questions
  const responses = await prompts([
    {
      type: "text",
      name: "name",
      message: "App name (full name):",
      initial: existing?.name || "My App",
      validate: (value: string) => value.trim().length > 0 || "App name is required",
    },
    {
      type: "text",
      name: "short_name",
      message: "App short name (max 12 characters recommended):",
      initial: existing?.short_name || "",
      validate: (value: string) => value.trim().length > 0 || "Short name is required",
    },
    {
      type: "text",
      name: "description",
      message: "App description:",
      initial: existing?.description || "My awesome progressive web app",
      validate: (value: string) => value.trim().length > 0 || "Description is required",
    },
    {
      type: "text",
      name: "start_url",
      message: "Start URL (usually '/' for root):",
      initial: existing?.start_url || "/",
      validate: (value: string) => value.trim().length > 0 || "Start URL is required",
    },
    {
      type: "text",
      name: "theme_color",
      message: "Theme color (hex, e.g., #000000):",
      initial: existing?.theme_color || "#000000",
      validate: (value: string) => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexRegex.test(value) || "Please enter a valid hex color (e.g., #000000)";
      },
    },
    {
      type: "text",
      name: "background_color",
      message: "Background color (hex, e.g., #ffffff):",
      initial: existing?.background_color || "#ffffff",
      validate: (value: string) => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexRegex.test(value) || "Please enter a valid hex color (e.g., #ffffff)";
      },
    },
    {
      type: "text",
      name: "icon_folder",
      message: "Icon folder path (e.g., /icons):",
      initial: existing?._iconFolder || "/icons",
      validate: (value: string) => value.trim().length > 0 || "Icon folder path is required",
    },
    {
      type: "multiselect",
      name: "icon_sizes",
      message: "Icon sizes (select all that apply):",
      choices: [
        { title: "192x192 (recommended)", value: "192x192", selected: true },
        { title: "512x512 (recommended)", value: "512x512", selected: true },
        { title: "144x144", value: "144x144", selected: false },
        { title: "384x384", value: "384x384", selected: false },
        { title: "96x96", value: "96x96", selected: false },
        { title: "72x72", value: "72x72", selected: false },
      ],
      hint: "Use space to select, enter to confirm",
      min: 1,
    },
  ]);

  // Handle cancellation
  if (Object.keys(responses).length === 0) {
    console.log("\n❌ Cancelled by user");
    process.exit(0);
  }

  try {
    // Generate icons from folder and selected sizes
    const icons = generateIconsFromFolder(responses.icon_folder.trim(), responses.icon_sizes);

    // Build manifest config
    const manifestConfig: ManifestConfig = {
      name: responses.name.trim(),
      short_name: responses.short_name.trim(),
      description: responses.description.trim(),
      start_url: responses.start_url.trim(),
      display: "standalone", // Always standalone
      theme_color: responses.theme_color.trim(),
      background_color: responses.background_color.trim(),
      icons,
    };

    // Generate manifest
    const manifest = generateManifest(manifestConfig);

    // Write manifest (without comments, since it's already filled)
    writeJSONFile(manifestFilePath, manifest);

    console.log("\n✅ Manifest created successfully!");
    console.log(`📝 Location: ${manifestFilePath}`);
    console.log("\n📋 Next steps:");
    console.log("1. Make sure your icon files exist at the specified paths");
    console.log("2. Update any additional fields if needed");
    console.log("3. Test your PWA installation");
  } catch (error) {
    console.error("\n❌ Error creating manifest.json:", error);
    process.exit(1);
  }
}
