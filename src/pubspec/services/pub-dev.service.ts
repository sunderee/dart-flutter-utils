import { pubDevPackageModel, type LatestPubDevPackageVersion } from "../data/pub-dev-package.model";
// Uses global fetch for easier test mocking

export class PubDevService {
    private static readonly BASE_URL = 'https://pub.dev/api/packages';

    async getPackageDetails(name: string): Promise<LatestPubDevPackageVersion> {
        const url = `${PubDevService.BASE_URL}/${name}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Package not found: ${name} (HTTP ${response.status})`);
        }

        const rawBody = await response.text();
        let jsonBody: unknown;

        try {
            jsonBody = JSON.parse(rawBody);
        } catch (error) {
            throw new Error(`Invalid JSON response for package: ${name}`);
        }

        const parsedBody = await pubDevPackageModel.safeParseAsync(jsonBody);

        if (parsedBody.error) {
            throw new Error(`Invalid package details: ${parsedBody.error.message}`);
        }

        const latestVersion = parsedBody.data.latest.version;

        return {
            name: parsedBody.data.name,
            version: latestVersion,
        };
    }
}