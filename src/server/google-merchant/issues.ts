import "server-only";
import { prisma } from "@/lib/prisma";
import { GoogleMerchantClient } from "./client";

export async function refreshAccountIssues(connectionId: bigint) {
  const connection = await prisma.googleMerchantConnection.findUnique({
    where: { id: connectionId }
  });

  if (!connection) throw new Error("Connection not found");
  const client = new GoogleMerchantClient(connection.merchantAccountId);

  try {
    const issuesResponse = await client.fetchApi(`accounts/v1beta/accounts/${connection.merchantAccountId}/issues`);
    
    // Clear old active issues
    await prisma.googleMerchantIssue.updateMany({
      where: { connectionId, status: "ACTIVE" },
      data: { status: "RESOLVED", lastDetectedAt: new Date() }
    });

    if (issuesResponse && issuesResponse.issues) {
      for (const issue of issuesResponse.issues) {
        await prisma.googleMerchantIssue.create({
          data: {
            connectionId,
            googleIssueCode: issue.id || "UNKNOWN",
            issueType: "ACCOUNT",
            severity: issue.severity || "ERROR",
            title: issue.title || "Account Issue",
            description: issue.detail || "",
            documentationUrl: issue.documentationUri || "",
            status: "ACTIVE",
            firstDetectedAt: new Date(),
            lastDetectedAt: new Date(),
            rawPayload: issue as any
          }
        });
      }
    }
  } catch (err) {
    console.error("Failed to refresh account issues:", err);
  }
}

export async function refreshProductStatus(productId: bigint) {
  const connection = await prisma.googleMerchantConnection.findFirst({
    where: { status: "CONNECTED" }
  });
  if (!connection) return;

  const productStatus = await prisma.googleProductStatus.findUnique({
    where: { productId }
  });
  if (!productStatus || !productStatus.offerId) return;

  const client = new GoogleMerchantClient(connection.merchantAccountId);

  try {
    // In Merchant API v1, products are queried with:
    // accounts/{account}/products/{product}
    // where {product} is channel~language~feedLabel~offerId
    
    // We would need to assemble the correct product ID string
    const config = await prisma.googleProductConfiguration.findUnique({ where: { productId } });
    const channel = "online";
    const language = config?.contentLanguage || "en";
    const feedLabel = config?.feedLabel || "US";
    const googleProductId = `${channel}~${language}~${feedLabel}~${productStatus.offerId}`;

    const googleProduct = await client.fetchApi(`accounts/${connection.merchantAccountId}/products/${googleProductId}`);
    
    // Process approval state
    const issues = googleProduct?.issues || [];
    let approvalState = "APPROVED";
    
    if (issues.some((i: any) => i.severity === "ERROR" || i.severity === "DISAPPROVED")) {
      approvalState = "DISAPPROVED";
    } else if (issues.some((i: any) => i.severity === "WARNING")) {
      approvalState = "WARNING";
    }

    await prisma.googleProductStatus.update({
      where: { productId },
      data: {
        approvalState,
        issueCount: issues.length,
        lastFetchedAt: new Date(),
        rawSnapshot: googleProduct as any
      }
    });

    // Also update issues in DB
    await prisma.googleMerchantIssue.updateMany({
      where: { connectionId: connection.id, productId, status: "ACTIVE" },
      data: { status: "RESOLVED", lastDetectedAt: new Date() }
    });

    for (const issue of issues) {
      await prisma.googleMerchantIssue.create({
        data: {
          connectionId: connection.id,
          productId,
          googleIssueCode: issue.code || "UNKNOWN",
          issueType: "PRODUCT",
          severity: issue.severity || "WARNING",
          title: issue.attributeName ? `Issue with ${issue.attributeName}` : "Product Issue",
          description: issue.description || "",
          documentationUrl: issue.documentation || "",
          status: "ACTIVE",
          firstDetectedAt: new Date(),
          lastDetectedAt: new Date(),
          rawPayload: issue as any
        }
      });
    }

  } catch (err: any) {
    if (err.message.includes("404")) {
      await prisma.googleProductStatus.update({
        where: { productId },
        data: { approvalState: "NOT_FOUND", lastFetchedAt: new Date() }
      });
    }
    console.error("Failed to refresh product status:", err);
  }
}
