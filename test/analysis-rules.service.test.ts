import { describe, expect, it, mock } from "bun:test";
import { AnalysisRulesService } from "../src/analysis-options/services/analysis-rules.service";

const RULE = {
  name: "avoid_print",
  description: "Avoid using print",
  categories: ["style"],
  state: "stable",
  incompatible: [],
  sets: ["core", "recommended", "flutter"],
};

describe("AnalysisRulesService", () => {
  it("parses rules", async () => {
    const svc = new AnalysisRulesService();
    const fetchSpy = mock(() => Promise.resolve(new Response(JSON.stringify([RULE]), { status: 200 })));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const res = await svc.getAnalysisRules();
    expect(res).toEqual([RULE]);
  });

  it("throws on non-OK response", async () => {
    const svc = new AnalysisRulesService();
    const fetchSpy = mock(() => Promise.resolve(new Response("nope", { status: 500 })));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(svc.getAnalysisRules()).rejects.toThrow("Failed to fetch linter rules: HTTP 500");
  });

  it("throws on invalid JSON", async () => {
    const svc = new AnalysisRulesService();
    const fetchSpy = mock(() => Promise.resolve(new Response("{bad json", { status: 200 })));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(svc.getAnalysisRules()).rejects.toThrow("Failed to parse linter rules JSON");
  });
});
