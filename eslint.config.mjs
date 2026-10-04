import antfu from '@antfu/eslint-config'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults'
import { MatcherType, SelectorKind } from 'eslint-plugin-better-tailwindcss/types'
// Both sites build from the one layer, so either site's generated config lints the whole repo.
import { withNuxt } from './sites/charlotte/.nuxt/eslint.config.mjs'

// Avow's lint rules (~/Code/Avow/eslint.config.mjs), less the ones about its own domains.
export default withNuxt(
  antfu(
    {
      formatters: true,
      typescript: {
        tsconfigPath: 'tsconfig.json',
        overridesTypeAware: {
          'ts/consistent-type-exports': 'error',
          'ts/no-unnecessary-qualifier': 'error',
          'ts/prefer-nullish-coalescing': ['error', { ignorePrimitives: true }],
          'ts/prefer-readonly': 'error',
          'ts/prefer-regexp-exec': 'error',
          'ts/promise-function-async': ['error', { checkArrowFunctions: false }],
          'ts/require-array-sort-compare': 'error',
          'ts/restrict-template-expressions': ['error', {
            allowBoolean: true,
            allowNullish: true,
            allowNumber: true,
            allowRegExp: true,
          }],
          'ts/return-await': 'error',
          'ts/switch-exhaustiveness-check': 'error',
          'ts/unbound-method': 'off',
        },
      },
    },
    {
      ignores: [
        '.claude/**/*.md',
        '**/*.md',
        // Copied from Avow as they are; scripts/ds-diff.sh compares them byte for byte.
        'layers/ui/**',
      ],
    },
  ),
  {
    files: ['**/*.{ts,tsx,vue}'],
    rules: {
      'e18e/prefer-nullish-coalescing': 'off',
      'e18e/prefer-timer-args': 'off',
      'perfectionist/sort-imports': 'off',
      'ts/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      'ts/consistent-type-imports': ['error', { fixStyle: 'separate-type-imports' }],
      'ts/default-param-last': 'error',
      'ts/method-signature-style': 'error',
      'ts/no-import-type-side-effects': 'error',
      'ts/no-unnecessary-type-assertion': 'off',
      'ts/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'ts/no-useless-empty-export': 'error',
      'ts/sort-type-constituents': 'error',
      'func-style': ['error', 'declaration'],
      'vue/prefer-separate-static-class': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', 'test/**/*.ts'],
    rules: {
      'ts/consistent-type-assertions': 'off',
      'ts/consistent-type-imports': 'off',
      // Asymmetric matchers (expect.anything(), expect.stringMatching()) are typed any.
      'ts/no-unsafe-assignment': 'off',
    },
  },
  {
    // Vite's plugin types and Nuxt's disagree; Avow casts the same way.
    files: ['**/nuxt.config.ts'],
    rules: {
      'ts/consistent-type-assertions': 'off',
    },
  },
  betterTailwind.configs['recommended-warn'],
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'layers/melo/app/assets/css/main.css',
      },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unknown-classes': 'off',
      'test/prefer-lowercase-title': ['error', { ignore: ['describe'] }],
    },
  },
  // The design system's guard, as in Avow: colour with the named theme colours (text-ink,
  // bg-panel, border-rule, text-danger), never a palette class. This is what keeps the blog
  // looking like Avow when the tokens change there.
  {
    files: ['layers/melo/app/**/*.{ts,vue}', 'layers/melo/components/**/*.vue'],
    rules: {
      'better-tailwindcss/no-restricted-classes': ['error', {
        selectors: [
          ...getDefaultSelectors(),
          { kind: SelectorKind.Attribute, name: '.+(?:-c|C)lass', match: [{ type: MatcherType.String }, { type: MatcherType.ObjectKey }] },
          { kind: SelectorKind.Variable, name: '.+', match: [{ type: MatcherType.String }, { type: MatcherType.ObjectValue }] },
          { kind: SelectorKind.Callee, name: '^computed$', match: [{ type: MatcherType.AnonymousFunctionReturn, match: [{ type: MatcherType.String }, { type: MatcherType.ObjectKey }, { type: MatcherType.ObjectValue }] }] },
        ],
        restrict: [{
          pattern: '^(?:[\\w-]+:)*!?(?:bg|text|border(?:-[xytrblse])?|ring(?:-offset)?|outline|divide|from|via|to|fill|stroke|shadow|decoration|placeholder|caret|accent)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d{2,3}(?:\\/\\d+)?!?$',
          message: '"$0" is a palette colour. Use a named colour from tailwind-theme.css (text-ink, bg-panel, border-rule, text-danger).',
        }, {
          pattern: '^(?:[\\w-]+:)*!?[\\w-]+-\\((?:[\\w-]+:)?--machine-[\\w-]+\\)(?:\\/\\d+)?!?$',
          message: '"$0" reaches for a --machine-* variable that has a theme name. Write it as the named colour (text-ink, border-rule-soft).',
        }],
      }],
    },
  },
)
