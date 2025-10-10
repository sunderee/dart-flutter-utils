import { describe, expect, it } from "bun:test";
import { AnalysisRuleStyle } from "../src/analysis-options/data/style.enum";
import { AnalysisOptionsWriterService } from "../src/analysis-options/services/analysis-options-writer.service";

const mkRule = (name: string) => ({
  name,
  description: "desc",
  categories: [],
  state: "stable",
  incompatible: [],
  sets: ["flutter"],
});

describe("AnalysisOptionsWriterService", () => {
  it("writes a file with strict language and rules", async () => {
    const tmpPath = `./tmp-analysis-${Date.now()}.yaml`;
    const svc = new AnalysisOptionsWriterService();
    await svc.writeAnalysisOptionsFile(tmpPath, [mkRule("avoid_print")], AnalysisRuleStyle.FLUTTER);

    const content = await Bun.file(tmpPath).text();
    expect(content).toContain("include: package:flutter_lints/flutter.yaml");
    expect(content).toContain("strict-casts: true");
    expect(content).toContain("- avoid_print");
  });
});
