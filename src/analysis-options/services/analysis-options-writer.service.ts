import { AnalysisRuleStyle, type AnalysisRuleModel } from "../data";

export class AnalysisOptionsWriterService {
    async writeAnalysisOptionsFile(filePath: string, rules: AnalysisRuleModel[], style: AnalysisRuleStyle) {
        let lines: string[] = [];

        lines.push(this.importFromStyle(style));
        lines.push('');

        this.strictTypeChecks(lines);
        this.analyzerErrors(style, rules, lines);
        this.linterRules(style, rules, lines);

        await Bun.file(filePath).write(lines.join('\n'));
    }

    private importFromStyle(style: AnalysisRuleStyle) {
        switch (style) {
            case AnalysisRuleStyle.CORE:
                return 'include: package:lints/core.yaml';
            case AnalysisRuleStyle.RECOMMENDED:
                return 'include: package:lints/recommended.yaml';
            case AnalysisRuleStyle.FLUTTER:
                return 'include: package:flutter_lints/flutter.yaml';
        }
    }

    private strictTypeChecks(lines: string[]) {
        lines.push('analyzer:');
        lines.push('  enable-experiment: []');
        lines.push('  language:');
        lines.push('    strict-casts: true');
        lines.push('    strict-inference: true');
        lines.push('    strict-raw-types: true');
    }

    private analyzerErrors(style: AnalysisRuleStyle, rules: AnalysisRuleModel[], lines: string[]) {
        lines.push('  errors:');
        for (const rule of rules) {
            const isEnabled = rule.sets.includes(style);
            const isStable = rule.state === 'stable';
            const line = isEnabled && isStable ? `    ${rule.name}: error` : `    # ${rule.name}: error`;
            lines.push(line);
        }

        lines.push('');
    }

    private linterRules(style: AnalysisRuleStyle, rules: AnalysisRuleModel[], lines: string[]) {
        lines.push('linter:');
        lines.push('  rules:');

        for (const rule of rules) {
            const isEnabled = rule.sets.includes(style);
            const isStable = rule.state === 'stable';

            const description = rule.description.replace(/\n/g, ' ');
            lines.push(`    # ${description}`);

            if (rule.incompatible.length > 0) {
                lines.push(`    # Incompatible with ${rule.incompatible.join(', ')}`);
            }

            if (rule.state !== 'stable') {
                lines.push(`    # State: ${rule.state}`);
            }

            if (rule.categories.length > 0) {
                lines.push(`    # Categories: ${rule.categories.join(', ')}`);
            }

            const ruleLine = isEnabled && isStable ? `    - ${rule.name}` : `    # - ${rule.name}`;
            lines.push(ruleLine);
            lines.push('');
        }
    }
}
