declare namespace NodeJS {
  interface ProcessEnv {
    CLOUDFLARE_ACCOUNT_ID?: string;
    CLOUDFLARE_D1_DATABASE_ID?: string;
    CLOUDFLARE_IMAGE_PLACEHOLDERS_KV_NAMESPACE_ID?: string;
    CLOUDFLARE_API_TOKEN?: string;
  }
}
