import { describe, expect, it, mock } from 'bun:test';
import { SDKService } from '../src/pubspec/services/sdk.service';

const VALID_RESPONSE = {
  base_url: "https://example.com",
  current_release: { beta: "b", dev: "d", stable: "hash123" },
  releases: [
    { hash: "hash999", version: "3.27.0" },
    { hash: "hash123", version: "3.28.0", dart_sdk_version: "3.7.1" }
  ]
};

describe('SDKService', () => {
  it('returns latest Dart and Flutter versions on success', async () => {
    const sdkService = new SDKService();
    const fetchSpy = mock(() => Promise.resolve(new Response(JSON.stringify(VALID_RESPONSE), { status: 200 })));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const result = await sdkService.getDartAndFlutterSDKVersions();
    expect(result).toEqual({ dart: '3.7.1', flutter: '3.28.0' });
  });

  it('throws on non-OK response', async () => {
    const sdkService = new SDKService();
    const fetchSpy = mock(() => Promise.resolve(new Response('nope', { status: 500 })));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(sdkService.getDartAndFlutterSDKVersions()).rejects.toThrow('Failed to fetch SDK versions: HTTP 500');
  });

  it('throws on invalid JSON', async () => {
    const sdkService = new SDKService();
    const fetchSpy = mock(() => Promise.resolve(new Response('{bad json', { status: 200 })));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(sdkService.getDartAndFlutterSDKVersions()).rejects.toThrow('Invalid JSON in SDK versions response');
  });

  it('throws when latest release candidate missing', async () => {
    const bad = { ...VALID_RESPONSE, current_release: { beta: 'b', dev: 'd', stable: 'missing' } };
    const sdkService = new SDKService();
    const fetchSpy = mock(() => Promise.resolve(new Response(JSON.stringify(bad), { status: 200 })));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    await expect(sdkService.getDartAndFlutterSDKVersions()).rejects.toThrow('Latest stable release candidate not found or missing Dart SDK version');
  });
});
