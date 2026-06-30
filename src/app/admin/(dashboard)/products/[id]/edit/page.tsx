import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id: BigInt(id) },
  });

  if (!product) {
    notFound();
  }

  // We need to serialize the product because BigInt cannot be passed to Client Components natively via props
  const serializedProduct = {
    ...product,
    id: product.id.toString(),
    categoryId: product.categoryId?.toString(),
    brandId: product.brandId?.toString(),
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  };

  return (
    <div>
      <EditProductForm product={serializedProduct as any} />
    </div>
  );
}
