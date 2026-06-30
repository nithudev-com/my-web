import type { Product, Category, Brand } from "@prisma/client";

export function siteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}${path}`;
}

export function productJsonLd(product: Product & { brand?: Brand | null }) {
  const price = product.salePrice ?? product.basePrice;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.mainImage ? [product.mainImage] : [],
    description: product.shortDescription || product.description || product.title,
    sku: product.sku,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand.name
        }
      : undefined,
    offers: {
      "@type": "Offer",
      url: siteUrl(`/product/${product.slug}`),
      priceCurrency: "INR",
      price: Number(price),
      availability:
        product.stockStatus === "IN_STOCK"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock"
    }
  };
}

export function categoryJsonLd(category: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    url: siteUrl(`/category/${category.slug}`),
    description: category.seoDescription || `Shop ${category.name}`
  };
}

export function faqJsonLd(faqs: any) {
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq: any) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}
