import { Command } from "commander";
import { init } from "./init";

const program = new Command();

program
  .name("@polterware/pwa")
  .description("CLI tool for managing PWA configuration")
  .version("1.0.0");

program
  .command("init")
  .description("Create manifest.json with PWA configuration template")
  .option(
    "--manifest-path <path>",
    "Path to manifest.json (relative to project root)",
    undefined
  )
  .action(async (options) => {
    await init(options.manifestPath);
  });

program.parse(process.argv);
