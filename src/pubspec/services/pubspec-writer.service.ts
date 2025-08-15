export class PubspecWriterService {
    async writeDartSDK(filePath: string, sdk: string): Promise<void> {
        let pubspecFile = await Bun.file(filePath).text();
        // Handle various SDK version formats and explicitly set to >=X.X.X format
        // Replaces: ">=2.17.0 <4.0.0", '^3.0.0', '>=3.1.0 <4.0.0' with >=X.X.X
        pubspecFile = pubspecFile.replace(
            /(\s+sdk:\s+)(['"]?)([^'"\n]+)(['"]?)/,
            `$1$2>=${sdk}$4`
        );
        await Bun.write(filePath, pubspecFile);
    }

    async writeFlutterSDK(filePath: string, flutter: string): Promise<void> {
        let pubspecFile = await Bun.file(filePath).text();
        // Handle various Flutter version formats and explicitly set to >=X.X.X format
        // Replaces: ">=3.10.0", '^3.13.0', '>=3.13.0' with >=X.X.X
        pubspecFile = pubspecFile.replace(
            /(\s+flutter:\s+)(['"]?)([^'"\n]+)(['"]?)/,
            `$1$2>=${flutter}$4`
        );
        await Bun.write(filePath, pubspecFile);
    }

    async writeDependency(filePath: string, dependencyName: string, dependencyVersion: string): Promise<void> {
        let pubspecFile = await Bun.file(filePath).text();

        // Handle various dependency formats: ^1.0.2, "^1.0.2", '>=1.0.0 <2.0.0', etc.
        // Use caret format (^X.X.X) for dependencies to allow compatible updates
        const dependencyRegex = new RegExp(
            `(\\s+${dependencyName}:\\s+)(['"]?)([^'\"\\n]+)(['"]?)`,
            'g'
        );
        pubspecFile = pubspecFile.replace(dependencyRegex, `$1$2^${dependencyVersion}$4`);

        await Bun.write(filePath, pubspecFile);
    }
}