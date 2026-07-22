import "server-only";

export type ValidationResult = {
  status: "READY" | "WARNING" | "BLOCKED" | "REQUIRES_REVIEW";
  errors: { field: string, message: string }[];
  warnings: { field: string, message: string }[];
};

export function validateProductPayload(payload: any): ValidationResult {
  const errors: { field: string, message: string }[] = [];
  const warnings: { field: string, message: string }[] = [];

  if (!payload.title || payload.title.length === 0) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (payload.title.length > 150) {
    errors.push({ field: "title", message: "Title must be 150 characters or less" });
  }

  if (!payload.description || payload.description.length === 0) {
    errors.push({ field: "description", message: "Description is required" });
  } else if (payload.description.length > 5000) {
    errors.push({ field: "description", message: "Description must be 5000 characters or less" });
  }

  if (!payload.link || !payload.link.startsWith("https://")) {
    errors.push({ field: "link", message: "Valid HTTPS landing page URL is required" });
  }

  if (!payload.imageLink || !payload.imageLink.startsWith("https://")) {
    errors.push({ field: "imageLink", message: "Valid HTTPS primary image URL is required" });
  }

  if (!payload.price || !payload.price.value || Number(payload.price.value) <= 0) {
    errors.push({ field: "price", message: "Price must be greater than zero" });
  }

  if (!payload.availability) {
    errors.push({ field: "availability", message: "Availability is required" });
  }

  if (!payload.condition) {
    errors.push({ field: "condition", message: "Condition is required" });
  }

  if (!payload.brand && !payload.gtin && !payload.mpn) {
    warnings.push({ field: "identifier", message: "Product is missing Brand, GTIN, and MPN. Performance may be degraded." });
  }

  let status: ValidationResult["status"] = "READY";
  if (errors.length > 0) {
    status = "BLOCKED";
  } else if (warnings.length > 0) {
    status = "WARNING";
  }

  return { status, errors, warnings };
}
