import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/**
 * ESLint 9 Flat Config for Fess Site Search
 *
 * Migrated from: .eslintrc.json
 * - Converted to ESLint 9 Flat Config format
 * - Vue 3 project rule settings
 * - Prettier integration
 */
export default [
  // ESLint recommended rules
  js.configs.recommended,

  // Vue 3 recommended rules (applies to all Vue files)
  ...pluginVue.configs['flat/recommended'],

  // Project-wide settings
  {
    // Ignore patterns (formerly ignorePatterns)
    ignores: [
      'src/openapi/',
      'dist/',
      'node_modules/',
    ],
  },

  // Common settings for JavaScript and Vue files
  {
    files: ['src/**/*.{js,vue}'],

    languageOptions: {
      // ECMAScript 2022 (formerly ecmaVersion)
      ecmaVersion: 2022,

      // Module format (formerly sourceType)
      sourceType: 'module',

      // Global variables (formerly env: es6, node, browser, jquery)
      globals: {
        ...globals.es2021,
        ...globals.node,
        ...globals.browser,
        ...globals.jquery,
        // Global variables defined at Vite build time
        __FSS_JSON_CONFIG__: 'readonly',
      },
    },

    rules: {
      // Indent: 2 spaces
      'indent': ['error', 2],

      // Line ending: LF (Unix)
      'linebreak-style': ['error', 'unix'],

      // Semicolon: required
      'semi': ['error', 'always'],

      // Allow console.log (useful during development)
      'no-console': 'off',

      // Disable unused variable warnings
      'no-unused-vars': 'off',

      // Vue: Allow v-html (developer is responsible for XSS prevention)
      'vue/no-v-html': 'off',

      // Vue: Disable max attributes per line (readability is developer's choice)
      'vue/max-attributes-per-line': 'off',

      // Vue: Don't force content newline for single-line elements
      'vue/singleline-html-element-content-newline': 'off',
    },
  },

  // Prettier integration (placed last to avoid rule conflicts)
  prettier,
];
