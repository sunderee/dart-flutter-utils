import chalk from "chalk";
import { Command } from "commander";
import type { AnalysisRuleStyle } from "../analysis-options/data";
import { AnalysisOptionsWriterService } from "../analysis-options/services/analysis-options-writer.service";
import { AnalysisRulesService } from "../analysis-options/services/analysis-rules.service";
import { PubDevService, PubspecReaderService, PubspecWriterService, SDKService } from "../pubspec/services";

/** Entry point for the CLI */
export function runCLI(args: string[]): void {
  const program = new Command();

  program
    .name("sunderee-flutter-utils")
    .description("Dart/Flutter utility tools for managing pubspec.yaml and analysis_options.yaml files")
    .version("0.0.1");

  // Pubspec command
  program
    .command("pubspec")
    .description("Manage pubspec.yaml file dependencies")
    .option("-p, --path <path>", "Path to the pubspec.yaml file", "./pubspec.yaml")
    .option("-i, --include <packages>", "Comma-separated list of packages to include in the update")
    .option("-e, --exclude <packages>", "Comma-separated list of packages to exclude from the update")
    .option("-f, --flutter", "Whether or not to update the Flutter SDK version")
    .option("-w, --write", "Write the changes to the pubspec.yaml file", false)
    .action(async (options) => {
      const pubspecReaderService = new PubspecReaderService();
      const pubspecFile = await pubspecReaderService.readPubspecFromPath(options.path);

      const [currentDartVersion, currentFlutterVersion] = [
        cleanUpVersion(pubspecFile.environment?.sdk),
        cleanUpVersion(pubspecFile.environment?.flutter),
      ];

      const sdkService = new SDKService();
      const latestSDKVersions = await sdkService.getDartAndFlutterSDKVersions();

      const pubspecWriterService = new PubspecWriterService();

      const hasEnvChanges =
        (currentDartVersion !== undefined && currentDartVersion !== latestSDKVersions.dart) ||
        (currentFlutterVersion !== undefined && currentFlutterVersion !== latestSDKVersions.flutter);
      if (hasEnvChanges) {
        console.log("Environment:");
      }

      if (currentDartVersion !== undefined && currentDartVersion !== latestSDKVersions.dart) {
        console.log(`  sdk: ${chalk.red(currentDartVersion)} -> ${chalk.green(latestSDKVersions.dart)}`);
        if (options.write) {
          await pubspecWriterService.writeDartSDK(options.path, latestSDKVersions.dart);
        }
      }
      if (currentFlutterVersion !== undefined && currentFlutterVersion !== latestSDKVersions.flutter) {
        console.log(`  flutter: ${chalk.red(currentFlutterVersion)} -> ${chalk.green(latestSDKVersions.flutter)}`);
        if (options.write) {
          await pubspecWriterService.writeFlutterSDK(options.path, latestSDKVersions.flutter);
        }
      }

      // Prepare dependency candidates for a latest version check
      let dependencyCandidateKeys = [
        ...Object.keys(pubspecFile.dependencies ?? {}),
        ...Object.keys(pubspecFile.dev_dependencies ?? {}),
      ];
      const dependencyCandidateValues = [
        ...Object.entries(pubspecFile.dependencies ?? {}),
        ...Object.entries(pubspecFile.dev_dependencies ?? {}),
      ];

      const includesArray = ((options.include as string | undefined) ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
      const excludesArray = ((options.exclude as string | undefined) ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      if (includesArray.length > 0) {
        dependencyCandidateKeys = dependencyCandidateKeys.filter((item) => includesArray.includes(item));
      } else if (excludesArray.length > 0) {
        dependencyCandidateKeys = dependencyCandidateKeys.filter((item) => !excludesArray.includes(item));
      }

      if (dependencyCandidateKeys.length > 0) {
        console.log("\nDependencies:");
      }

      const pubDevService = new PubDevService();
      for (const key of dependencyCandidateKeys) {
        const value = dependencyCandidateValues.find((item) => item[0] === key);
        if (value === undefined) {
          console.log(chalk.red(`  ${key} not found in dependencies or dev_dependencies`));
          continue;
        }

        if (typeof value[1] === "string") {
          const currentVersion = cleanUpVersion(value[1]);
          const latestVersion = await pubDevService.getPackageDetails(key);

          if (currentVersion !== latestVersion.version) {
            console.log(`  ${key}: ${chalk.red(currentVersion ?? "unknown")} -> ${chalk.green(latestVersion.version)}`);
            if (options.write) {
              await pubspecWriterService.writeDependency(options.path, key, latestVersion.version);
            }
          }
        }
      }
    });

  // Analysis command
  program
    .command("analysis")
    .description("Manage analysis_options.yaml file")
    .option("-p, --path <path>", "Path to the analysis_options.yaml file", "./analysis_options.yaml")
    .option("-s, --style <style>", "Style of the analysis", "flutter")
    .action(async (options) => {
      const analysisRulesService = new AnalysisRulesService();
      const analysisRules = await analysisRulesService.getAnalysisRules();

      const style = String(options.style ?? "").toLowerCase();
      const validStyles = new Set(["core", "recommended", "flutter"]);
      if (!validStyles.has(style)) {
        console.error(`Invalid style: ${options.style}. Valid values are: core, recommended, flutter`);
        process.exit(2);
      }
      const analysisRuleStyle = style as AnalysisRuleStyle;

      const analysisOptionsWriterService = new AnalysisOptionsWriterService();
      await analysisOptionsWriterService.writeAnalysisOptionsFile(options.path, analysisRules, analysisRuleStyle);
    });

  try {
    program.parse(args);
  } catch (error) {
    console.error("Error parsing CLI arguments:", error);
    process.exit(1);
  }
}

/**
 * Normalizes a semver constraint to just the version portion for comparison.
 */
const cleanUpVersion = (version: string | undefined): string | undefined => {
  if (version === undefined) {
    return undefined;
  }
  return version.replaceAll("^", "").replaceAll(">", "").replaceAll("<", "").replaceAll("=", "");
};
