import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { GoogleMerchantClient } from "@/server/google-merchant/client";
import { mapProductToGoogle } from "@/server/google-merchant/mapper";
import { validateProductPayload } from "@/server/google-merchant/validator";
import { queueProductSync } from "@/lib/google-merchant-queue";

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await props.params;
  const productId = BigInt(params.id);

  try {
    const connection = await prisma.googleMerchantConnection.findFirst({
      where: { status: "CONNECTED" }
    });

    if (!connection) {
      throw new Error("Google Merchant Center not connected");
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { brand: true, category: true }
    });

    if (!product) throw new Error("Product not found");

    let config = await prisma.googleProductConfiguration.findUnique({
      where: { productId }
    });

    if (!config) {
      config = await prisma.googleProductConfiguration.create({
        data: {
          productId,
          connectionId: connection.id,
          offerId: product.sku,
        }
      });
    }

    const payload = mapProductToGoogle(product, config, []);
    const validation = validateProductPayload(payload);

    if (validation.status === "BLOCKED") {
      throw new Error("Product is blocked by local validation");
    }

    // Enqueue the sync task
    await queueProductSync(productId, admin.id);

    return NextResponse.redirect(new URL(`/admin/products/${productId}/google-merchant?msg=sync_queued`, req.url));
  } catch (err: any) {
    console.error("Sync error:", err);
    return NextResponse.redirect(new URL(`/admin/products/${productId}/google-merchant?error=sync_failed`, req.url));
  }
}
