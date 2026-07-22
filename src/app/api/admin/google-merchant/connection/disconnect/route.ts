import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const activeConnection = await prisma.googleMerchantConnection.findFirst({
      where: { status: "CONNECTED" }
    });

    if (activeConnection) {
      await prisma.googleMerchantConnection.update({
        where: { id: activeConnection.id },
        data: {
          status: "DISCONNECTED",
          disconnectedAt: new Date(),
          encryptedRefreshToken: null,
        }
      });
      
      await prisma.googleMerchantAuditLog.create({
        data: {
          connectionId: activeConnection.id,
          adminId: admin.id,
          action: "DISCONNECT",
          resourceType: "account",
          resourceId: activeConnection.merchantAccountId,
        }
      });
    }

    return NextResponse.redirect(new URL("/admin/google-merchant/connection", req.url));
  } catch (err: any) {
    console.error("Disconnect error:", err);
    return NextResponse.redirect(new URL("/admin/google-merchant/connection?error=disconnect_failed", req.url));
  }
}
