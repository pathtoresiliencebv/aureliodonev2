import { Suspense } from "react";
import { StoreHeader } from "../../_components/StoreHeader";
import { StoreFooter } from "../../_components/StoreFooter";
import { CartSidebar } from "../../_components/CartSidebar";
import { ProductDetail } from "./_components/ProductDetail";
import { ProductDetailSkeleton } from "./_components/ProductDetailSkeleton";

interface ProductDetailPageProps {
  params: Promise<{
    storeSlug: string;
    productId: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { storeSlug, productId } = await params;

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader storeSlug={storeSlug} />

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetail storeSlug={storeSlug} productId={productId} />
        </Suspense>
      </main>

      <StoreFooter storeSlug={storeSlug} />
      <CartSidebar storeSlug={storeSlug} />
    </div>
  );
}
