/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_GOOGLE_CLIENT_ID: string;
  VITE_CLIENT_URL: string;
  VITE_SERVER_URL: string;
  // add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
