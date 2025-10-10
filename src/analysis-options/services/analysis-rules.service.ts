// Use global fetch to simplify testing/mocking
import { type AnalysisRuleModel, analysisRulesModel } from "../data";

export class AnalysisRulesService {
  private static readonly URL =
    "https://raw.githubusercontent.com/dart-lang/site-www/refs/heads/main/src/data/linter_rules.json";

  async getAnalysisRules(): Promise<AnalysisRuleModel[]> {
    const response = await fetch(AnalysisRulesService.URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch linter rules: HTTP ${response.status}`);
    }
    const raw = await response.text();
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch (error) {
      throw new Error(`Failed to parse linter rules JSON: ${error}`);
    }
    const parsedResponse = await analysisRulesModel.safeParseAsync(json);
    if (!parsedResponse.success) {
      throw new Error(`Failed to parse analysis rules: ${parsedResponse.error.message}`);
    }
    return parsedResponse.data;
  }
}
