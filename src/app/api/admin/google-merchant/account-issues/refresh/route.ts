import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { refreshAccountIssues } from "@/server/google-merchant/issues";

export async function POST(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connection = await prisma.googleMerchantConnection.findFirst({
      where: { status: "CONNECTED" }
    });

    if (connection) {
      await refreshAccountIssues(connection.id);
    }
    
    return NextResponse.redirect(new URL("/admin/google-merchant/account-issues", req.url));
  } catch (err: any) {
    console.error("Refresh error:", err);
    return NextResponse.redirect(new URL("/admin/google-merchant/account-issues?error=refresh_failed", req.url));
  }
}
