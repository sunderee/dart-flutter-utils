import { z } from "zod";

export const sdkModelSchema = z.object({
    base_url: z.string(),
    current_release: z.object({
        beta: z.string(),
        dev: z.string(),
        stable: z.string(),
    }),
    releases: z.array(z.object({
        hash: z.string(),
        version: z.string(),
        dart_sdk_version: z.string().optional(),
    })),
});

export type LatestSDKModel = {
    dart: string;
    flutter: string;
}

export type SDKModel = z.infer<typeof sdkModelSchema>;