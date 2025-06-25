/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_CLIENT_URL: string;
  readonly VITE_SERVER_URL: string;
  readonly VITE_MAPBOX_TOKEN: string;
  // thêm các biến khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
