import "server-only";
import { prisma } from "@/lib/prisma";
import { GoogleMerchantClient } from "./client";
import { mapProductToGoogle } from "./mapper";
import { validateProductPayload } from "./validator";
import { evaluateRules } from "./rules-engine";

export async function submitProduct(productId: bigint): Promise<void> {
  const connection = await prisma.googleMerchantConnection.findFirst({
    where: { status: "CONNECTED" }
  });

  if (!connection) throw new Error("No connected Google Merchant account found.");

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { brand: true, category: true }
  });

  if (!product) throw new Error("Product not found");

  const config = await prisma.googleProductConfiguration.findUnique({
    where: { productId }
  });

  if (!config || !config.enabled) {
    throw new Error("Product is not configured or not enabled for Google Merchant.");
  }

  // Find data source. For now we assume the default API data source or create one conceptually.
  // The Merchant API v1 product inputs require specifying the data source.
  let dataSource = await prisma.googleMerchantDataSource.findFirst({
    where: { connectionId: connection.id, sourceType: "PRIMARY" }
  });

  // Fallback data source name if not found in db
  const dataSourceId = dataSource?.googleResourceName || `accounts/${connection.merchantAccountId}/dataSources/default`;

  // Fetch mappings and rules
  const mappings = await prisma.googleMerchantMapping.findMany({
    where: { connectionId: connection.id, active: true },
    orderBy: { priority: 'desc' }
  });
  
  const rules = await prisma.googleMerchantRule.findMany({
    where: { connectionId: connection.id, active: true },
    orderBy: { priority: 'desc' }
  });

  let payload = mapProductToGoogle(product, config, mappings);
  
  const ruleOverrides = evaluateRules(product, rules);
  if (ruleOverrides.exclude) {
    // If a local rule excludes it, do not submit, and maybe delete existing.
    return;
  }
  
  payload = { ...payload, ...ruleOverrides };

  const validation = validateProductPayload(payload);
  if (validation.status === "BLOCKED") {
    throw new Error(`Product blocked by validation: ${validation.errors.map(e => e.message).join(", ")}`);
  }

  const client = new GoogleMerchantClient(connection.merchantAccountId);

  // Insert into Merchant Center API
  // Path: accounts/{account}/productInputs:insert
  const requestBody = {
    dataSource: dataSourceId,
    productInput: payload
  };

  try {
    const response = await client.fetchApi(`accounts/${connection.merchantAccountId}/productInputs:insert`, {
      method: "POST",
      body: JSON.stringify(requestBody)
    });

    // Update config
    await prisma.googleProductConfiguration.update({
      where: { id: config.id },
      data: {
        lastSubmittedAt: new Date()
      }
    });

    // We also want to record the status placeholder for retrieval
    await prisma.googleProductStatus.upsert({
      where: { productId },
      create: {
        productId,
        connectionId: connection.id,
        offerId: payload.offerId,
        productInputName: response.name,
        processingState: "PROCESSING"
      },
      update: {
        offerId: payload.offerId,
        productInputName: response.name,
        processingState: "PROCESSING",
        lastFetchedAt: new Date()
      }
    });
  } catch (err) {
    console.error("Failed to submit product to Google Merchant:", err);
    throw err;
  }
}

export async function deleteProductInput(merchantAccountId: string, dataSourceId: string, offerId: string) {
  const client = new GoogleMerchantClient(merchantAccountId);
  // Using the productInputs:delete method
  // Format: accounts/{account}/productInputs/{productinput}
  // The id is usually dataSourceId~offerId
  
  const dsId = dataSourceId.split("/").pop();
  const productId = `${dsId}~${offerId}`;
  
  await client.fetchApi(`accounts/${merchantAccountId}/productInputs/${productId}`, {
    method: "DELETE"
  });
}
