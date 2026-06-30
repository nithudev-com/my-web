import { Meilisearch } from "meilisearch";

export type SearchProduct = {
  id: string;
  sku: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  stockStatus: string;
  categorySlug?: string | null;
  brandSlug?: string | null;
  image?: string | null;
};

export function getSearchClient() {
  const host = process.env.MEILISEARCH_HOST;
  if (!host) return null;

  return new Meilisearch({
    host,
    apiKey: process.env.MEILISEARCH_API_KEY
  });
}

export async function syncProductsToSearch(products: SearchProduct[]) {
  const client = getSearchClient();
  if (!client || products.length === 0) return;

  try {
    const index = client.index("products");
    await index.addDocuments(products, { primaryKey: "id" });

    await index.updateFilterableAttributes([
      "categorySlug",
      "brandSlug",
      "stockStatus",
      "price"
    ]);

    await index.updateSortableAttributes(["price", "title"]);
  } catch (error) {
    console.error("Failed to sync products to Meilisearch:", error);
  }
}

export async function deleteProductsFromSearch(productIds: string[]) {
  const client = getSearchClient();
  if (!client || productIds.length === 0) return;

  try {
    const index = client.index("products");
    await index.deleteDocuments(productIds);
  } catch (error) {
    console.error("Failed to delete products from Meilisearch:", error);
  }
}
