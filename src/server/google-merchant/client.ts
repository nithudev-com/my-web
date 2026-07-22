import "server-only";
import { getDecryptedRefreshToken } from "./token-manager";
import { refreshAccessToken } from "./auth";
import { prisma } from "@/lib/prisma";

export class GoogleMerchantClient {
  private merchantAccountId: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(merchantAccountId: string) {
    this.merchantAccountId = merchantAccountId;
  }

  private async ensureValidToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return this.accessToken;
    }

    const refreshToken = await getDecryptedRefreshToken(this.merchantAccountId);
    if (!refreshToken) {
      throw new Error(`No refresh token available for account ${this.merchantAccountId}`);
    }

    try {
      const tokens = await refreshAccessToken(refreshToken);
      this.accessToken = tokens.access_token;
      this.tokenExpiry = tokens.expiry_date;
      return this.accessToken;
    } catch (err) {
      await prisma.googleMerchantConnection.update({
        where: { merchantAccountId: this.merchantAccountId },
        data: {
          status: "DISCONNECTED",
          disconnectedAt: new Date(),
          lastFailedRequestAt: new Date(),
        }
      });
      throw err;
    }
  }

  async fetchApi(path: string, options: RequestInit = {}): Promise<any> {
    const token = await this.ensureValidToken();
    const url = `https://merchantapi.googleapis.com/${path}`;

    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type") && options.method !== "GET" && options.method !== "DELETE") {
      headers.set("Content-Type", "application/json");
    }

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await fetch(url, { ...options, headers });
        
        if (response.ok) {
          await prisma.googleMerchantConnection.update({
            where: { merchantAccountId: this.merchantAccountId },
            data: { lastSuccessfulRequestAt: new Date() }
          });
          
          if (response.status === 204) return null;
          return await response.json();
        }

        if (response.status === 429 || response.status >= 500) {
          attempt++;
          const retryAfter = response.headers.get("Retry-After");
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise(res => setTimeout(res, delay));
          continue;
        }

        const errorText = await response.text();
        throw new Error(`Merchant API Error ${response.status}: ${errorText}`);
      } catch (err: any) {
        if (attempt === maxRetries - 1) {
          await prisma.googleMerchantConnection.update({
            where: { merchantAccountId: this.merchantAccountId },
            data: { lastFailedRequestAt: new Date() }
          });
          throw err;
        }
        attempt++;
      }
    }
  }

  async getAccountInfo(): Promise<any> {
    return this.fetchApi(`accounts/v1beta/accounts/${this.merchantAccountId}`);
  }
}
