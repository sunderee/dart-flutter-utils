#!/usr/bin/env bash
rm -rf node_modules bun.lock dart-utils
bun install
bun build --production --compile --outfile=dart-utils ./index.ts
chmod +x dart-utils