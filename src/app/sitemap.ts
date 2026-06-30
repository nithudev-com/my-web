import type { MetadataRoute } from "next";
import { getSitemapCategories } from "@/services/products";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getSitemapCategories();

  return [
    {
      url: siteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    ...categories.map((category) => ({
      url: siteUrl(`/category/${category.slug}`),
      lastModified: category.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8
    }))
  ];
}
