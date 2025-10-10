import { z } from "zod";

export const analysisRuleModel = z.object({
  name: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  state: z.string(),
  incompatible: z.array(z.string()),
  sets: z.array(z.string()),
});

export const analysisRulesModel = z.array(analysisRuleModel);

export type AnalysisRuleModel = z.infer<typeof analysisRuleModel>;
export type AnalysisRulesModel = z.infer<typeof analysisRulesModel>;
