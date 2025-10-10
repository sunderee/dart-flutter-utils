import { describe, expect, it, mock } from "bun:test";
import { PubDevService } from "../src/pubspec/services/pub-dev.service";

const SAMPLE = {
  name: "http",
  latest: {
    version: "1.2.3",
    archive_url: "x",
    archive_sha256: "y",
    pubspec: { name: "http" },
  },
  versions: [],
};

describe("PubDevService", () => {
  it("returns latest package version", async () => {
    const svc = new PubDevService();
    const fetchSpy = mock(() => Promise.resolve(new Response(JSON.stringify(SAMPLE), { status: 200 })));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const res = await svc.getPackageDetails("http");
    expect(res).toEqual({ name: "http", version: "1.2.3" });
  });

  it("throws on 404", async () => {
    const svc = new PubDevService();
    const fetchSpy = mock(() => Promise.resolve(new Response("not found", { status: 404 })));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(svc.getPackageDetails("nope")).rejects.toThrow("Package not found: nope (HTTP 404)");
  });

  it("throws on invalid JSON", async () => {
    const svc = new PubDevService();
    const fetchSpy = mock(() => Promise.resolve(new Response("{bad", { status: 200 })));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(svc.getPackageDetails("http")).rejects.toThrow("Invalid JSON response for package: http");
  });
});
