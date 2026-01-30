import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

// INPUT_JSON_PATHが指定されている場合、JSONファイルを読み込んで埋め込む
let jsonConfig = {};
if (process.env.INPUT_JSON_PATH) {
  try {
    const jsonPath = path.resolve(process.env.INPUT_JSON_PATH);
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    jsonConfig = JSON.parse(jsonContent);
    console.log('[FSS] Loaded JSON config from:', jsonPath);
  } catch (e) {
    console.warn('[FSS] Failed to load JSON config:', e.message);
  }
}

// 環境変数を定義オブジェクトに変換（JSONシリアライズ可能な値にする）
const defineEnv = {
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  'import.meta.env.VITE_INPUT_CSS_PATH': JSON.stringify(process.env.INPUT_CSS_PATH || ''),
  '__FSS_JSON_CONFIG__': JSON.stringify(jsonConfig),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cssInjectedByJsPlugin(), // CSSをJSに埋め込む（ウィジェットとして配布するため）
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // querystringポリフィル（ブラウザ環境で必要）
      querystring: 'querystring-es3',
    },
    // 拡張子の自動解決（Vue CLI互換）
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  define: defineEnv,
  build: {
    // ライブラリモードで単一ファイル出力
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'FessSiteSearch', // グローバル変数名（IIFE形式）
      fileName: () => process.env.OUTPUT_JS_FILENAME || 'fess-ss.js',
      formats: ['iife'], // 即時実行関数形式（ウィジェット用）
    },
    rollupOptions: {
      // 外部依存を含めて単一ファイルにバンドル
      external: [],
      output: {
        // グローバル変数の設定は不要（external: []のため）
        globals: {},
      },
    },
    // ファイル名のハッシュ化を無効化
    cssCodeSplit: false,
    // ソースマップは本番ビルドでは無効化
    sourcemap: false,
  },
});
