import "server-only";

export function mapProductToGoogle(product: any, config: any, mappings: any[]) {
  // A robust mapping implementation
  // Default values mapping
  const input: any = {
    offerId: config.offerId || product.sku,
    title: config.titleOverride || product.seoTitle || product.title,
    description: config.descriptionOverride || product.seoDescription || product.shortDescription || product.description,
    link: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000'}/product/${product.slug}`,
    imageLink: config.imageOverride || product.mainImage,
    contentLanguage: config.contentLanguage || "en",
    targetCountry: config.targetCountry || "US",
    feedLabel: config.feedLabel || "US",
    channel: "online",
    condition: config.condition || "new",
    availability: product.stockStatus === 'IN_STOCK' && product.stockQuantity > 0 ? "in stock" : "out of stock",
  };

  if (product.basePrice) {
    input.price = {
      value: product.basePrice.toString(),
      currency: "USD"
    };
  }

  if (product.salePrice && Number(product.salePrice) > 0) {
    input.salePrice = {
      value: product.salePrice.toString(),
      currency: "USD"
    };
  }

  if (product.brand) {
    input.brand = product.brand.name;
  }

  if (config.googleProductCategory) {
    input.googleProductCategory = config.googleProductCategory;
  }

  if (config.productType) {
    input.productTypes = [config.productType];
  }
  
  if (config.customLabels) {
    input.customLabel0 = config.customLabels.label0;
    input.customLabel1 = config.customLabels.label1;
    input.customLabel2 = config.customLabels.label2;
    input.customLabel3 = config.customLabels.label3;
    input.customLabel4 = config.customLabels.label4;
  }
  
  if (product.weight) {
    input.shippingWeight = {
      value: product.weight.toString(),
      unit: "kg"
    };
  }
  if (product.length && product.width && product.height) {
    input.shippingLength = { value: product.length.toString(), unit: "cm" };
    input.shippingWidth = { value: product.width.toString(), unit: "cm" };
    input.shippingHeight = { value: product.height.toString(), unit: "cm" };
  }

  // Apply custom mappings logic (e.g. static, template, etc)
  for (const rule of mappings) {
    if (!rule.active) continue;
    // apply rule.transformation, rule.sourceType, etc.
  }

  return input;
}
