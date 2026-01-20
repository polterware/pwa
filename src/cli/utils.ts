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
 * Reads and parses a JSON file
 */
export function readJSONFile<T = any>(filePath: string): T {
  const content = readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

/**
 * Writes a JSON file with formatting
 */
export function writeJSONFile(filePath: string, data: any): void {
  const content = JSON.stringify(data, null, 2) + "\n";
  writeFileSync(filePath, content, "utf-8");
}

/**
 * Checks if a file exists
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

/**
 * Gets the path to pwa.config.json in the project root
 */
export function getPWAConfigPath(projectRoot: string): string {
  return join(projectRoot, "pwa.config.json");
}
