import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname, resolve } from "path";

/**
 * Common locations where manifest.json might be found
 */
const MANIFEST_LOCATIONS = [
  "manifest.json",
  "public/manifest.json",
  "app/manifest.json",
  "app/manifest.webmanifest",
  "public/manifest.webmanifest",
];

/**
 * Fields that should have comments indicating they need user editing
 */
const EDITABLE_FIELDS = new Set([
  "name",
  "short_name",
  "description",
  "start_url",
  "icons",
  "theme_color",
  "background_color",
]);

/**
 * Removes comments from JSONC (JSON with Comments) content
 */
function stripJSONComments(content: string): string {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove /* */ comments
    .replace(/\/\/.*$/gm, "") // Remove // comments
    .trim();
}

/**
 * Finds the manifest.json file in common locations
 * @param projectRoot - Root directory of the project
 * @returns Path to manifest.json or null if not found
 */
export function findManifest(projectRoot: string): string | null {
  for (const location of MANIFEST_LOCATIONS) {
    const path = join(projectRoot, location);
    if (existsSync(path)) {
      return path;
    }
  }
  return null;
}

/**
 * Finds the project root directory by looking for package.json
 * @param startDir - Directory to start searching from
 * @returns Project root directory or null if not found
 */
export function findProjectRoot(startDir: string = process.cwd()): string | null {
  let currentDir = resolve(startDir);

  while (currentDir !== dirname(currentDir)) {
    const packageJsonPath = join(currentDir, "package.json");
    if (existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }

  return null;
}

/**
 * Reads and parses a JSON or JSONC file (removes comments before parsing)
 */
export function readJSONFile<T = any>(filePath: string): T {
  const content = readFileSync(filePath, "utf-8");
  const cleanedContent = stripJSONComments(content);
  return JSON.parse(cleanedContent);
}

/**
 * Writes a JSON file with formatting
 */
export function writeJSONFile(filePath: string, data: any): void {
  const content = JSON.stringify(data, null, 2) + "\n";
  writeFileSync(filePath, content, "utf-8");
}

/**
 * Writes a JSONC file (JSON with Comments) with comments on editable fields
 */
export function writeJSONCFile(filePath: string, data: any): void {
  const jsonString = JSON.stringify(data, null, 2);
  const lines = jsonString.split("\n");
  
  const commentedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    const indent = line.match(/^\s*/)?.[0] || "";
    
    // Check if this line contains a key that should be commented
    for (const field of EDITABLE_FIELDS) {
      // Escape special regex characters in field name (underscore needs special handling)
      const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const fieldPattern = new RegExp(`^"${escapedField}"\\s*:`);
      
      if (fieldPattern.test(trimmedLine)) {
        // Get the comment for this field
        const comment = getFieldComment(field);
        if (comment) {
          commentedLines.push(`${indent}// ${comment}`);
        }
        break;
      }
    }
    
    commentedLines.push(line);
  }
  
  writeFileSync(filePath, commentedLines.join("\n") + "\n", "utf-8");
}

/**
 * Gets the comment text for a specific field
 */
function getFieldComment(field: string): string {
  const comments: Record<string, string> = {
    name: "TODO: Change this to your app's full name",
    short_name: "TODO: Change this to your app's short name (max 12 characters recommended)",
    description: "TODO: Change this to your app's description",
    start_url: "TODO: Change this to your app's start URL (usually '/' for root)",
    icons: "TODO: Update icon paths and add all required sizes (192x192, 512x512 recommended)",
    theme_color: "TODO: Change this to your app's theme color",
    background_color: "TODO: Change this to your app's background color",
  };
  
  return comments[field] || "";
}

/**
 * Checks if a file exists
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}
