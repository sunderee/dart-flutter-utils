import { fetch } from "bun";
import { analysisRulesModel, type AnalysisRuleModel } from "../data";

export class AnalysisRulesService {
    private static readonly URL = 'https://raw.githubusercontent.com/dart-lang/site-www/main/src/_data/linter_rules.json';

    async getAnalysisRules(): Promise<AnalysisRuleModel[]> {
        const response = await fetch(AnalysisRulesService.URL);
        const data = await response.json();
        const parsedResponse = await analysisRulesModel.safeParseAsync(data);

        if (!parsedResponse.success) {
            throw new Error('Failed to parse analysis rules');
        }

        return parsedResponse.data;
    }
}