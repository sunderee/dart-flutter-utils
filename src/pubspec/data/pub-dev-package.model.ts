import { z } from "zod";
import { pubspecModelSchema } from "./pubspec.model";

export const pubDevPackageModel = z.object({
    name: z.string(),
    isDiscontinued: z.boolean().optional(),
    replacedBy: z.string().optional(),
    advisoriesUpdated: z.string().optional(),
    latest: z.object({
        version: z.string(),
        retracted: z.boolean().optional(),
        archive_url: z.string(),
        archive_sha256: z.string(),
        pubspec: pubspecModelSchema,
    }),
    versions: z.array(z.object({
        version: z.string(),
        retracted: z.boolean().optional(),
        archive_url: z.string(),
        archive_sha256: z.string(),
        pubspec: pubspecModelSchema,
    })),
});

export type LatestPubDevPackageVersion = {
    name: string;
    version: string;
};

export type PubDevPackage = z.infer<typeof pubDevPackageModel>;