import { parse } from "yaml";
import { pubspecModelSchema, type PubspecModel } from "../data/pubspec.model";

export class PubspecReaderService {
    async readPubspecFromPath(path: string): Promise<PubspecModel> {
        const fileExists = await Bun.file(path).exists();
        if (!fileExists) {
            throw new Error(`Pubspec file not found at ${path}`);
        }

        const fileContent = await Bun.file(path).text();
        const parsedYamlFile = parse(fileContent);
        const pubspec = await pubspecModelSchema.safeParseAsync(parsedYamlFile);

        if (pubspec.error) {
            throw new Error(`Invalid pubspec file at ${path}: ${pubspec.error.message}`);
        }

        return pubspec.data;
    }
}