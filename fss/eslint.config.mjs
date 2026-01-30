import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/**
 * ESLint 9 Flat Config for Fess Site Search
 *
 * 移行元: .eslintrc.json
 * - ESLint 9のFlat Config形式に変換
 * - Vue 3プロジェクトのルール設定
 * - Prettierとの統合
 */
export default [
  // ESLint推奨ルール
  js.configs.recommended,

  // Vue 3推奨ルール（全てのVueファイルに適用）
  ...pluginVue.configs['flat/recommended'],

  // プロジェクト全体の設定
  {
    // 無視パターン（旧 ignorePatterns）
    ignores: [
      'src/openapi/',
      'dist/',
      'node_modules/',
    ],
  },

  // JavaScript・Vueファイル共通の設定
  {
    files: ['src/**/*.{js,vue}'],

    languageOptions: {
      // ECMAScript 2022（旧 ecmaVersion）
      ecmaVersion: 2022,

      // モジュール形式（旧 sourceType）
      sourceType: 'module',

      // グローバル変数（旧 env: es6, node, browser, jquery）
      globals: {
        ...globals.es2021,
        ...globals.node,
        ...globals.browser,
        ...globals.jquery,
        // Viteビルド時に定義されるグローバル変数
        __FSS_JSON_CONFIG__: 'readonly',
      },
    },

    rules: {
      // インデント: 2スペース
      'indent': ['error', 2],

      // 改行コード: LF (Unix)
      'linebreak-style': ['error', 'unix'],

      // セミコロン: 必須
      'semi': ['error', 'always'],

      // console.log 許可（開発中は有用）
      'no-console': 'off',

      // 未使用変数の警告を無効化
      'no-unused-vars': 'off',

      // Vue: v-html の使用を許可（XSS対策は開発者が責任を持つ）
      'vue/no-v-html': 'off',

      // Vue: 1行あたりの属性数制限を無効化（可読性は開発者判断）
      'vue/max-attributes-per-line': 'off',

      // Vue: 単一行要素のコンテンツ改行を強制しない
      'vue/singleline-html-element-content-newline': 'off',
    },
  },

  // Prettier統合（最後に配置してルールの衝突を回避）
  prettier,
];
