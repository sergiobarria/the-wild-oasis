import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Must stay last: disables ESLint rules that conflict with Prettier.
    prettier,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        // Convex codegen and test/coverage output are not ours to lint.
        '**/_generated/**',
        'coverage/**',
        'playwright-report/**',
        'test-results/**',
    ]),
]);

export default eslintConfig;
