import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/checkout", "/account", "/cart"]
      }
    ],
    sitemap: [siteUrl("/sitemap.xml"), siteUrl("/product/sitemap/0.xml")]
  };
}
