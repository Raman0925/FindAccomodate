declare module '@env' {
  export const PUBLIC_SUPABASE_URL: string;
  export const PUBLIC_SUPABASE_KEY: string;
  /** OAuth 2.0 Web client ID (public identifier only — never the client secret). */
  export const GOOGLE_WEB_CLIENT_ID: string;
  /** iOS OAuth client ID from Google Cloud (optional if using GoogleService-Info.plist). */
  export const GOOGLE_IOS_CLIENT_ID: string;
}
