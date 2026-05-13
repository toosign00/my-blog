declare namespace NodeJS {
  interface ProcessEnv {
    GITHUB_PERSONAL_ACCESS_TOKEN?: string;
    CLOUDFLARE_ACCOUNT_ID?: string;
    CLOUDFLARE_D1_DATABASE_ID?: string;
    CLOUDFLARE_API_TOKEN?: string;
  }
}
