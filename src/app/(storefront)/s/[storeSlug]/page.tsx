import { Suspense } from "react";
import { StoreHeader } from "./_components/StoreHeader";
import { StoreFooter } from "./_components/StoreFooter";
import { CartSidebar } from "./_components/CartSidebar";
import { HeroSection } from "./_components/HeroSection";
import { FeaturedProducts } from "./_components/FeaturedProducts";
import { Collections } from "./_components/Collections";

interface StoreHomePageProps {
  params: Promise<{
    storeSlug: string;
  }>;
}

export default async function StoreHomePage({ params }: StoreHomePageProps) {
  const { storeSlug } = await params;
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader storeSlug={storeSlug} />

      <main>
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <HeroSection storeSlug={storeSlug} />
        </Suspense>

        <div className="container mx-auto px-4 py-12 space-y-16">
          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
            <FeaturedProducts storeSlug={storeSlug} />
          </Suspense>

          <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse rounded" />}>
            <Collections storeSlug={storeSlug} />
          </Suspense>
        </div>
      </main>

      <StoreFooter storeSlug={storeSlug} />
      <CartSidebar storeSlug={storeSlug} />
    </div>
  );
}
