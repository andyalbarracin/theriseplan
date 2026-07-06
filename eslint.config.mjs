import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";

/**
 * Lean flat config. Type safety is enforced by `tsc --noEmit` (strict).
 * `eslint-config-next`'s shareable config is currently incompatible with this
 * ESLint/plugin toolchain (circular config), so we register the Next + React
 * Hooks plugins directly and apply a small, reliable rule set.
 */
const eslintConfig = [
  {
    ignores: [
      "VFinal - HTML/**",
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx,mjs,cjs,js}"],
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "error",
      // Local, pre-sized images are used deliberately (images.unoptimized).
      "@next/next/no-img-element": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-debugger": "error",
      "no-var": "error",
    },
  },
];

export default eslintConfig;
