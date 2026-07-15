import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/product/", "/category/", "/brand/", "/blog/", "/deals", "/new-releases", "/contact", "/returns", "/about", "/faq"],
        disallow: [
          "/admin",
          "/api/",
          "/checkout",
          "/account",
          "/cart",
          "/wishlist",
          "/login",
          "/register",
          "/*?sort=",
          "/*?filter=",
          "/*?price=",
          "/*?page_size=",
          "/*?session=",
          "/*?utm_source=",
          "/*?utm_campaign=",
          "/*?_rsc=",
        ],
      },
    ],
    sitemap: siteUrl("/sitemap.xml"),
  };
}
