/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // Agrega aquí más variables de entorno que uses
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}