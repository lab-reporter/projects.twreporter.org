/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_TIMESTAMP?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
