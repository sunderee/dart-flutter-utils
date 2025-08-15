import { fetch } from "bun";
import { sdkModelSchema, type LatestSDKModel } from "../data/sdk.model";

export class SDKService {
    private static readonly URL = 'https://storage.googleapis.com/flutter_infra_release/releases/releases_macos.json';

    async getDartAndFlutterSDKVersions(): Promise<LatestSDKModel> {
        const response = await fetch(SDKService.URL);
        const rawBody = await response.text();
        const jsonBody = JSON.parse(rawBody);
        const parsedBody = await sdkModelSchema.safeParseAsync(jsonBody);

        if (parsedBody.error) {
            throw new Error(`Invalid SDK response: ${parsedBody.error.message}`);
        }

        const latestStableHash = parsedBody.data.current_release.stable;
        const latestReleaseCandidate = parsedBody.data.releases
            .find((item) => item.hash === latestStableHash && item.dart_sdk_version);

        if (latestReleaseCandidate === undefined || !latestReleaseCandidate.dart_sdk_version) {
            throw new Error(`Latest stable release candidate not found or missing Dart SDK version`);
        }

        return {
            dart: latestReleaseCandidate.dart_sdk_version,
            flutter: latestReleaseCandidate.version,
        };
    }
}