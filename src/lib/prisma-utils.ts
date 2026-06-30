/**
 * Recursively converts BigInt values to strings and Decimal values to numbers/strings.
 * This is needed because Next.js unstable_cache and Client Components cannot serialize BigInt.
 */
export function sanitizePrismaData<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === "bigint") {
    return data.toString() as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizePrismaData(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const newObj: Record<string, unknown> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (typeof value === "bigint") {
          newObj[key] = value.toString();
        } else if (value && typeof value === "object" && "toNumber" in value && typeof (value as any).toNumber === "function") {
          // Handle Prisma Decimal
          newObj[key] = (value as any).toString();
        } else if (value instanceof Date) {
          newObj[key] = value.toISOString();
        } else if (value !== null && typeof value === "object") {
          newObj[key] = sanitizePrismaData(value);
        } else {
          newObj[key] = value;
        }
      }
    }
    return newObj as unknown as T;
  }

  return data;
}
