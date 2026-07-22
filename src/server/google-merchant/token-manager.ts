import "server-only";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { GoogleOAuthTokens } from "./types";

const ENCRYPTION_KEY = process.env.GOOGLE_MERCHANT_TOKEN_ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex");
const ALGORITHM = "aes-256-gcm";

function getBufferKey(): Buffer {
  if (ENCRYPTION_KEY.length === 64) {
    return Buffer.from(ENCRYPTION_KEY, "hex");
  }
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
}

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const key = getBufferKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

export function decryptToken(encryptedToken: string): string {
  const [ivHex, encryptedHex, authTagHex] = encryptedToken.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const key = getBufferKey();
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

export async function storeTokens(
  merchantAccountId: string,
  tokens: GoogleOAuthTokens,
  adminId: bigint,
  merchantAccountName?: string,
  googleUserEmail?: string
) {
  const encryptedRefresh = tokens.refresh_token ? encryptToken(tokens.refresh_token) : undefined;

  await prisma.googleMerchantConnection.upsert({
    where: { merchantAccountId },
    create: {
      merchantAccountId,
      merchantAccountName,
      googleUserEmail,
      encryptedRefreshToken: encryptedRefresh,
      grantedScopes: tokens.scope,
      status: "CONNECTED",
      connectedByAdminId: adminId,
    },
    update: {
      merchantAccountName,
      googleUserEmail,
      encryptedRefreshToken: encryptedRefresh || undefined, // keep old if not provided in refresh
      grantedScopes: tokens.scope,
      status: "CONNECTED",
      connectedByAdminId: adminId,
    },
  });
  
  // Create an audit log
  await prisma.googleMerchantAuditLog.create({
    data: {
      connectionId: (await prisma.googleMerchantConnection.findUnique({ where: { merchantAccountId } }))!.id,
      adminId,
      action: "CONNECT",
      resourceType: "account",
      resourceId: merchantAccountId,
      afterData: { status: "CONNECTED" },
    }
  });
}

export async function getDecryptedRefreshToken(merchantAccountId: string): Promise<string | null> {
  const connection = await prisma.googleMerchantConnection.findUnique({
    where: { merchantAccountId },
    select: { encryptedRefreshToken: true }
  });

  if (!connection || !connection.encryptedRefreshToken) {
    return null;
  }

  try {
    return decryptToken(connection.encryptedRefreshToken);
  } catch (err) {
    console.error("Failed to decrypt token:", err);
    return null;
  }
}
