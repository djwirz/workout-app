interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

type ImportMetaEnvAsCast = {
  readonly [K in keyof ImportMetaEnv]: ImportMetaEnv[K]
}

declare interface ImportMeta {
  readonly env: ImportMetaEnvAsCast
} 