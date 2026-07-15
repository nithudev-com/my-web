import { NextResponse } from "next/server";
import { buildSitemapIndex, buildProductsSitemaps } from "@/lib/sitemap-builder";

export const dynamic = "force-dynamic";

/**
 * The legacy Next.js sitemap.ts route conflicts with our new sitemap.xml route handler.
 * This file is kept as a redirect fallback only — the real sitemap index
 * is served by /sitemap.xml/route.ts which returns the sitemapindex XML.
 */
export default async function sitemap() {
  // Return minimal valid response — real sitemap served at /sitemap.xml via route handler
  const productSitemaps = await buildProductsSitemaps().catch(() => [] as any[]);
  const xml = await buildSitemapIndex(productSitemaps.length);

  // Note: Next.js MetadataRoute.Sitemap cannot return sitemapindex format.
  // Return a single entry pointing to all sitemaps so Next.js doesn't 404.
  return [];
}
