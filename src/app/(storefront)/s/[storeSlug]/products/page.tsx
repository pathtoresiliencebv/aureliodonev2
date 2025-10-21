import { Suspense } from "react";
import { StoreHeader } from "../_components/StoreHeader";
import { StoreFooter } from "../_components/StoreFooter";
import { ProductGrid } from "./_components/ProductGrid";
import { ProductFilters } from "./_components/ProductFilters";
import { ProductGridSkeleton } from "./_components/ProductGridSkeleton";

interface ProductsPageProps {
  params: Promise<{
    storeSlug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    price_min?: string;
    price_max?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { storeSlug } = await params;
  const searchParamsResolved = await searchParams;
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader storeSlug={storeSlug} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">All Products</h1>
            <p className="text-muted-foreground">
              Discover our complete range of products
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
                <ProductFilters storeSlug={storeSlug} searchParams={searchParamsResolved} />
              </Suspense>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid storeSlug={storeSlug} searchParams={searchParamsResolved} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <StoreFooter storeSlug={storeSlug} />
    </div>
  );
}
