/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INPUT_CSS_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
