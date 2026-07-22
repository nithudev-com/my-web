import "server-only";

export type ConnectionStatus = "PENDING" | "CONNECTED" | "DISCONNECTED" | "ERROR";

export interface GoogleOAuthTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}
