#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./init";
import { update } from "./update";

const program = new Command();

program
  .name("@polterware/pwa")
  .description("CLI tool for managing PWA configuration")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize pwa.config.json in the project root")
  .action(async () => {
    await init();
  });

program
  .command("update")
  .description("Update manifest.json based on pwa.config.json")
  .option(
    "--manifest-path <path>",
    "Path to manifest.json (relative to project root)",
    undefined
  )
  .action(async (options) => {
    await update(options.manifestPath);
  });

program.parse(process.argv);
