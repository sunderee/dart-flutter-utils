import { z } from "zod";

export const pubspecModelSchema = z.object({
    name: z.string(),
    environment: z.object({
        sdk: z.string().optional(),
        flutter: z.string().optional(),
    }).optional(),
    dependencies: z.record(z.string(), z.union([
        z.string(),
        z.record(z.string(), z.any()),
        z.null()
    ])).optional().nullable(),
    dev_dependencies: z.record(z.string(), z.union([
        z.string(),
        z.record(z.string(), z.any()),
        z.null()
    ])).optional().nullable(),
});

export type PubspecModel = z.infer<typeof pubspecModelSchema>;