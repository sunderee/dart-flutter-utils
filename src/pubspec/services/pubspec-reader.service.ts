import { parse } from "yaml";
import { type PubspecModel, pubspecModelSchema } from "../data/pubspec.model";

export class PubspecReaderService {
  async readPubspecFromPath(path: string): Promise<PubspecModel> {
    const fileExists = await Bun.file(path).exists();
    if (!fileExists) {
      throw new Error(`Pubspec file not found at ${path}`);
    }

    const fileContent = await Bun.file(path).text();
    let parsedYamlFile: unknown;
    try {
      parsedYamlFile = parse(fileContent);
    } catch (error) {
      throw new Error(`Invalid YAML in pubspec at ${path}: ${error}`);
    }
    const pubspec = await pubspecModelSchema.safeParseAsync(parsedYamlFile);

    if (!pubspec.success) {
      throw new Error(`Invalid pubspec file at ${path}: ${pubspec.error.message}`);
    }

    return pubspec.data;
  }
}
