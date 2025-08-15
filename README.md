
# Dart/Flutter Utilities

CLI tool for managing Dart/Flutter project configuration files: pubspec.yaml (dependency updates) and analysis_options.yaml (rule generation).

## Prerequisites

- Bun.sh runtime

## Installation

Install dependencies and build the executable:

```sh
bun install
bun build --production --compile --outfile=dart-utils ./index.ts
```

## Usage

Execute with `./dart-utils <command> [options]`

### pubspec

Update SDK versions and package dependencies in pubspec.yaml.

Options:
- `-p, --path <path>` Path to pubspec.yaml (default: ./pubspec.yaml)
- `-i, --include <packages>` Comma-separated list of packages to include
- `-e, --exclude <packages>` Comma-separated list of packages to exclude
- `-f, --flutter` Update Flutter SDK version
- `-w, --write` Write changes to file

### analysis

Generate analysis_options.yaml with specified style.

Options:
- `-p, --path <path>` Path to analysis_options.yaml (default: ./analysis_options.yaml)
- `-s, --style <style>` Analysis style (default: flutter)