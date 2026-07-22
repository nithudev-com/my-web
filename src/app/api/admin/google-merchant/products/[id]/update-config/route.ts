import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await props.params;
  const productId = BigInt(params.id);

  const formData = await req.formData();
  
  try {
    await prisma.googleProductConfiguration.update({
      where: { productId },
      data: {
        enabled: formData.get("enabled") === "on",
        googleProductCategory: formData.get("googleProductCategory") as string || null,
        targetCountry: formData.get("targetCountry") as string || null,
        contentLanguage: formData.get("contentLanguage") as string || null,
        titleOverride: formData.get("titleOverride") as string || null,
        descriptionOverride: formData.get("descriptionOverride") as string || null,
        condition: formData.get("condition") as string || null,
      }
    });

    return NextResponse.redirect(new URL(`/admin/products/${productId}/google-merchant`, req.url));
  } catch (err: any) {
    console.error("Update config error:", err);
    return NextResponse.redirect(new URL(`/admin/products/${productId}/google-merchant?error=update_failed`, req.url));
  }
}
