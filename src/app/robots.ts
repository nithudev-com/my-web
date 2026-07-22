import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // General Search Engine Bots (Google, Bing, etc.)
        userAgent: "*",
        allow: [
          "/",
          "/product/",
          "/category/",
          "/brand/",
          "/blog/",
          "/deals",
          "/new-releases",
          "/contact",
          "/returns",
          "/about",
          "/faq"
        ],
        disallow: [
          // Security: Block Admin & API
          "/admin",
          "/admin/",
          "/api/",
          
          // Privacy: Block Customer Private Data & Auth
          "/account",
          "/account/",
          "/checkout",
          "/checkout/",
          "/cart",
          "/wishlist",
          "/login",
          "/register",
          "/forgot-password",

          // SEO Crawl Budget Optimization: Prevent indexing of dynamic/duplicate URL parameters
          "/*?sort=",
          "/*?filter=",
          "/*?price=",
          "/*?page_size=",
          "/*?session=",
          "/*?utm_",
          "/*?_rsc=",
          "/*?q=",
          "/search"
        ],
      },
      {
        // Security: Block Aggressive AI Data Scrapers to save bandwidth and protect IP
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "Anthropic-ai",
          "ClaudeBot",
          "Claude-Web",
          "Omgilibot",
          "Omgili",
          "Bytespider",
          "Diffbot",
          "Amazonbot",
          "PerplexityBot"
        ],
        disallow: ["/"],
      }
    ],
    sitemap: siteUrl("/sitemap.xml"),
  };
}
