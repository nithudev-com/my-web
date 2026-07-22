import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { exchangeCodeForTokens } from "@/server/google-merchant/auth";
import { storeTokens } from "@/server/google-merchant/token-manager";
import { GoogleMerchantClient } from "@/server/google-merchant/client";

export async function GET(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/admin/google-merchant/connection?error=${error}`, req.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/admin/google-merchant/connection?error=missing_params", req.url));
  }

  const storedState = req.cookies.get("google_oauth_state")?.value;
  const codeVerifier = req.cookies.get("google_oauth_verifier")?.value;

  if (!storedState || !codeVerifier || state !== storedState) {
    return NextResponse.redirect(new URL("/admin/google-merchant/connection?error=invalid_state", req.url));
  }

  try {
    const tokens = await exchangeCodeForTokens(code, codeVerifier);
    
    // We fetch a basic user profile or use a default account ID.
    // The user might have multiple accounts.
    // For now we will use an env variable default account or a dummy check, and later discover accounts.
    const defaultAccountId = process.env.GOOGLE_MERCHANT_DEFAULT_ACCOUNT_ID || "123456789";

    await storeTokens(defaultAccountId, tokens, admin.id, "Default Account", "");

    const response = NextResponse.redirect(new URL("/admin/google-merchant", req.url));
    response.cookies.delete("google_oauth_state");
    response.cookies.delete("google_oauth_verifier");
    return response;
  } catch (err: any) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(new URL(`/admin/google-merchant/connection?error=exchange_failed`, req.url));
  }
}
