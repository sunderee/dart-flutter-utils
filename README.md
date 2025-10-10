
### Dart/Flutter Utilities

CLI for managing Dart/Flutter project configuration: `pubspec.yaml` (dependency updates) and `analysis_options.yaml` (rule generation) with strict defaults.

#### Prerequisites
- Bun 1.1+

#### Quick start
```bash
bun install
bun index.ts --help
```

#### Commands
- pubspec: Update SDK constraints and dependency versions in `pubspec.yaml`.
  - Options:
    - `-p, --path <path>`: Path to `pubspec.yaml` (default: `./pubspec.yaml`)
    - `-i, --include <a,b,c>`: Only check these packages
    - `-e, --exclude <a,b,c>`: Skip these packages
    - `-f, --flutter`: Include Flutter SDK constraint
    - `-w, --write`: Apply changes

- analysis: Generate `analysis_options.yaml` using `core`, `recommended`, or `flutter` presets; always enables strict language checks.
  - Options:
    - `-p, --path <path>`: Output path (default: `./analysis_options.yaml`)
    - `-s, --style <style>`: One of `core|recommended|flutter` (default: `flutter`)

#### Development
- Type checks: `bun run build`
- Tests: `bun test`

#### Robustness
- HTTP responses are validated; non-200 and invalid JSON fail fast with clear errors.
- Zod validates all external data structures strictly.
- File writes check existence and report actionable errors.